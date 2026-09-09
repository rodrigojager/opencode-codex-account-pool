import type { Account, Settings } from "./domain";
import { AccountStore } from "./store";
import { BindingStore } from "./bindings";
import { QuotaService } from "./quota";
export declare class AllAccountsExhaustedError extends Error {
    readonly account: Account | undefined;
    readonly resumeAt: number | undefined;
    constructor(account: Account | undefined, resumeAt: number | undefined);
}
export declare class NoAccountsAvailableError extends Error {
    readonly account: Account | undefined;
    readonly retryAt: number | undefined;
    constructor(account: Account | undefined, retryAt: number | undefined);
}
export interface RotationOptions {
    settings: () => Promise<Settings>;
    bindings?: BindingStore;
    quota?: QuotaService;
    streamCancelTimeoutMs?: number;
    issuer?: string;
    codexApiEndpoint?: string;
    fetch?: typeof globalThis.fetch;
    onSelected?(sessionID: string | undefined, account: Account): void | Promise<void>;
    onFailover?(sessionID: string | undefined, from: Account, to: Account | undefined, status: number): void | Promise<void>;
    onAllExhausted?(sessionID: string | undefined, account: Account | undefined, resumeAt: number | undefined): void | Promise<void>;
    prepareFailover?(input: {
        sessionID?: string;
        from: Account;
        to: Account;
        requestInput: RequestInfo | URL;
        init?: RequestInit;
    }): Promise<{
        requestInput?: RequestInfo | URL;
        init?: RequestInit;
    } | void>;
}
export declare const STREAM_CANCEL_TIMEOUT_MS = 2000;
export declare function createRotatingFetch(store: AccountStore, options: RotationOptions): (originalInput: RequestInfo | URL, originalInit?: RequestInit) => Promise<Response>;
