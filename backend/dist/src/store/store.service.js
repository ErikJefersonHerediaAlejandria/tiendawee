"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const IGV_RATE = 0.18;
const round2 = (n) => Math.round(n * 100) / 100;
let StoreService = class StoreService {
    pool;
    constructor() {
        const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
        if (!connectionString)
            throw new Error('Falta DIRECT_URL o DATABASE_URL en backend/.env');
        this.pool = new pg_1.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    async listPlans() {
        const { rows } = await this.pool.query(`select id, code, name, speed_mbps as "speedMbps", price::float8 as price,
              description, features, stock
         from plans where is_active order by price`);
        return rows;
    }
    async createOrder(input) {
        const quantity = input.quantity ?? 1;
        const card = (input.cardNumber ?? '').replace(/\s|-/g, '');
        if (!Number.isInteger(input.planId))
            throw new common_1.BadRequestException('Plan inválido');
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
            throw new common_1.BadRequestException('Cantidad inválida (1 a 10)');
        if (!input.customerName?.trim())
            throw new common_1.BadRequestException('Ingresa tu nombre');
        if (!/^\d{8,11}$/.test(input.customerDoc ?? ''))
            throw new common_1.BadRequestException('DNI (8 dígitos) o RUC (11 dígitos) inválido');
        if (!/^\S+@\S+\.\S+$/.test(input.customerEmail ?? ''))
            throw new common_1.BadRequestException('Correo inválido');
        if (!input.customerAddress?.trim())
            throw new common_1.BadRequestException('Ingresa tu dirección');
        if (!/^\d{16}$/.test(card))
            throw new common_1.BadRequestException('La tarjeta debe tener 16 dígitos');
        if (card.endsWith('0000'))
            throw new common_1.BadRequestException('Pago rechazado (tarjeta de prueba terminada en 0000)');
        const client = await this.pool.connect();
        try {
            await client.query('begin');
            const planRes = await client.query('select id, name, price::float8 as price, stock from plans where id = $1 and is_active for update', [input.planId]);
            const plan = planRes.rows[0];
            if (!plan)
                throw new common_1.NotFoundException('Plan no encontrado');
            if (plan.stock < quantity)
                throw new common_1.BadRequestException('Sin stock suficiente');
            const total = round2(plan.price * quantity);
            const subtotal = round2(total / (1 + IGV_RATE));
            const igv = round2(total - subtotal);
            const ins = await client.query(`insert into orders (customer_name, customer_doc, customer_email, customer_address,
                             plan_id, quantity, unit_price, subtotal, igv, total, card_last4)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id`, [input.customerName.trim(), input.customerDoc, input.customerEmail.trim(),
                input.customerAddress.trim(), plan.id, quantity, plan.price, subtotal, igv, total,
                card.slice(-4)]);
            await client.query('update plans set stock = stock - $1 where id = $2', [quantity, plan.id]);
            await client.query('commit');
            return this.getOrder(ins.rows[0].id);
        }
        catch (e) {
            await client.query('rollback');
            throw e;
        }
        finally {
            client.release();
        }
    }
    async getOrder(id) {
        const { rows } = await this.pool.query(`select o.id, o.receipt_number as "receiptNumber", o.customer_name as "customerName",
              o.customer_doc as "customerDoc", o.customer_email as "customerEmail",
              o.customer_address as "customerAddress", o.quantity,
              o.unit_price::float8 as "unitPrice", o.subtotal::float8 as subtotal,
              o.igv::float8 as igv, o.total::float8 as total,
              o.payment_method as "paymentMethod", o.card_last4 as "cardLast4",
              o.payment_status as "paymentStatus", o.created_at as "createdAt",
              p.name as "planName", p.speed_mbps as "speedMbps"
         from orders o join plans p on p.id = o.plan_id where o.id = $1`, [id]);
        if (!rows[0])
            throw new common_1.NotFoundException('Pedido no encontrado');
        return rows[0];
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StoreService);
//# sourceMappingURL=store.service.js.map