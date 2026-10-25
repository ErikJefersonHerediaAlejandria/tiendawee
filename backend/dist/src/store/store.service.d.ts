import 'dotenv/config';
import { OnModuleDestroy } from '@nestjs/common';
export interface CreateOrderInput {
    planId: number;
    quantity?: number;
    customerName: string;
    customerDoc: string;
    customerEmail: string;
    customerAddress: string;
    cardNumber: string;
}
export declare class StoreService implements OnModuleDestroy {
    private pool;
    constructor();
    onModuleDestroy(): Promise<void>;
    listPlans(): Promise<any[]>;
    createOrder(input: CreateOrderInput): Promise<any>;
    getOrder(id: number): Promise<any>;
}
