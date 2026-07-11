import { type AccountAction } from "./domain";
export declare class AccountActionStore {
    readonly path: string;
    constructor(path?: string);
    snapshot(): Promise<{
        version: 1;
        revision: number;
        actions: AccountAction[];
    }>;
    private update;
    enqueueRemove(accountID: string): Promise<{
        id: string;
        type: "remove";
        accountID: string;
        state: "completed" | "failed" | "claimed" | "pending";
        createdAt: number;
        updatedAt: number;
        owner?: string | undefined;
        leaseUntil?: number | undefined;
        result?: string | undefined;
    }>;
    claim(owner: string, leaseMs?: number): Promise<{
        id: string;
        type: "remove";
        accountID: string;
        state: "completed" | "failed" | "claimed" | "pending";
        createdAt: number;
        updatedAt: number;
        owner?: string | undefined;
        leaseUntil?: number | undefined;
        result?: string | undefined;
    } | undefined>;
    finish(id: string, state: "completed" | "failed", result: string): Promise<{
        id: string;
        type: "remove";
        accountID: string;
        state: "completed" | "failed" | "claimed" | "pending";
        createdAt: number;
        updatedAt: number;
        owner?: string | undefined;
        leaseUntil?: number | undefined;
        result?: string | undefined;
    } | undefined>;
    requeue(id: string, result: string): Promise<{
        id: string;
        type: "remove";
        accountID: string;
        state: "completed" | "failed" | "claimed" | "pending";
        createdAt: number;
        updatedAt: number;
        owner?: string | undefined;
        leaseUntil?: number | undefined;
        result?: string | undefined;
    } | undefined>;
}
