import { StoreService } from './store.service';
import type { CreateOrderInput } from './store.service';
export declare class StoreController {
    private readonly store;
    constructor(store: StoreService);
    plans(): Promise<any[]>;
    createOrder(body: CreateOrderInput): Promise<any>;
    getOrder(id: number): Promise<any>;
}
