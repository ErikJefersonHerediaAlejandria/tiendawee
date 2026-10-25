import 'dotenv/config';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { Pool } from 'pg';

export interface CreateOrderInput {
  planId: number;
  quantity?: number;
  customerName: string;
  customerDoc: string;
  customerEmail: string;
  customerAddress: string;
  cardNumber: string;
}

const IGV_RATE = 0.18;
const round2 = (n: number) => Math.round(n * 100) / 100;

@Injectable()
export class StoreService implements OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
    if (!connectionString) throw new Error('Falta DIRECT_URL o DATABASE_URL en backend/.env');
    this.pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async listPlans() {
    const { rows } = await this.pool.query(
      `select id, code, name, speed_mbps as "speedMbps", price::float8 as price,
              description, features, stock
         from plans where is_active order by price`,
    );
    return rows;
  }

  async createOrder(input: CreateOrderInput) {
    const quantity = input.quantity ?? 1;
    const card = (input.cardNumber ?? '').replace(/\s|-/g, '');

    if (!Number.isInteger(input.planId)) throw new BadRequestException('Plan inválido');
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
      throw new BadRequestException('Cantidad inválida (1 a 10)');
    if (!input.customerName?.trim()) throw new BadRequestException('Ingresa tu nombre');
    if (!/^\d{8,11}$/.test(input.customerDoc ?? ''))
      throw new BadRequestException('DNI (8 dígitos) o RUC (11 dígitos) inválido');
    if (!/^\S+@\S+\.\S+$/.test(input.customerEmail ?? ''))
      throw new BadRequestException('Correo inválido');
    if (!input.customerAddress?.trim()) throw new BadRequestException('Ingresa tu dirección');
    if (!/^\d{16}$/.test(card)) throw new BadRequestException('La tarjeta debe tener 16 dígitos');

    if (card.endsWith('0000'))
      throw new BadRequestException('Pago rechazado (tarjeta de prueba terminada en 0000)');

    const client = await this.pool.connect();
    try {
      await client.query('begin');
      const planRes = await client.query(
        'select id, name, price::float8 as price, stock from plans where id = $1 and is_active for update',
        [input.planId],
      );
      const plan = planRes.rows[0];
      if (!plan) throw new NotFoundException('Plan no encontrado');
      if (plan.stock < quantity) throw new BadRequestException('Sin stock suficiente');

      const total = round2(plan.price * quantity);
      const subtotal = round2(total / (1 + IGV_RATE));
      const igv = round2(total - subtotal);

      const ins = await client.query(
        `insert into orders (customer_name, customer_doc, customer_email, customer_address,
                             plan_id, quantity, unit_price, subtotal, igv, total, card_last4)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id`,
        [input.customerName.trim(), input.customerDoc, input.customerEmail.trim(),
         input.customerAddress.trim(), plan.id, quantity, plan.price, subtotal, igv, total,
         card.slice(-4)],
      );
      await client.query('update plans set stock = stock - $1 where id = $2', [quantity, plan.id]);
      await client.query('commit');
      return this.getOrder(ins.rows[0].id);
    } catch (e) {
      await client.query('rollback');
      throw e;
    } finally {
      client.release();
    }
  }

  async getOrder(id: number) {
    const { rows } = await this.pool.query(
      `select o.id, o.receipt_number as "receiptNumber", o.customer_name as "customerName",
              o.customer_doc as "customerDoc", o.customer_email as "customerEmail",
              o.customer_address as "customerAddress", o.quantity,
              o.unit_price::float8 as "unitPrice", o.subtotal::float8 as subtotal,
              o.igv::float8 as igv, o.total::float8 as total,
              o.payment_method as "paymentMethod", o.card_last4 as "cardLast4",
              o.payment_status as "paymentStatus", o.created_at as "createdAt",
              p.name as "planName", p.speed_mbps as "speedMbps"
         from orders o join plans p on p.id = o.plan_id where o.id = $1`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Pedido no encontrado');
    return rows[0];
  }
}