export interface InitParams {
    debug?: boolean;
    provider: EIP1193Provider;
}

export interface EIP1193Provider {
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
    on?(eventName: string, listener: (...args: unknown[]) => void): void;
    removeListener?(eventName: string, listener: (...args: unknown[]) => void): void;
}

export interface Transaction {
    from: string;
    to: string;
    value: string;
}