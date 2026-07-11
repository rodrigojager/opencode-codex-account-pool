import type { Account, AccountQuota } from "./domain";
import { AccountStore } from "./store";
export declare function parseQuotaPayload(payload: unknown, now?: number): AccountQuota;
export declare function blockedUntil(account: Account, now?: number): number;
export declare function nearLimit(account: Account, primary: number, secondary: number): boolean;
export declare function headroom(account: Account): number;
export declare class QuotaService {
    private accounts;
    private fetchFn;
    private inflight;
    constructor(accounts: AccountStore, fetchFn?: typeof fetch);
    refresh(account: Account, force?: boolean): Promise<{
        fetchedAt: number;
        source: "usage-endpoint" | "headers" | "response";
        planType?: string | undefined;
        allowed?: boolean | undefined;
        limitReached?: boolean | undefined;
        reachedType?: string | undefined;
        primary?: {
            usedPercent: number;
            windowSeconds?: number | undefined;
            resetAt?: number | undefined;
        } | undefined;
        secondary?: {
            usedPercent: number;
            windowSeconds?: number | undefined;
            resetAt?: number | undefined;
        } | undefined;
        codeReview?: {
            usedPercent: number;
            windowSeconds?: number | undefined;
            resetAt?: number | undefined;
        } | undefined;
        credits?: {
            hasCredits?: boolean | undefined;
            unlimited?: boolean | undefined;
            balance?: string | number | undefined;
        } | undefined;
        error?: string | undefined;
    }>;
    refreshAll(force?: boolean): Promise<PromiseSettledResult<{
        fetchedAt: number;
        source: "usage-endpoint" | "headers" | "response";
        planType?: string | undefined;
        allowed?: boolean | undefined;
        limitReached?: boolean | undefined;
        reachedType?: string | undefined;
        primary?: {
            usedPercent: number;
            windowSeconds?: number | undefined;
            resetAt?: number | undefined;
        } | undefined;
        secondary?: {
            usedPercent: number;
            windowSeconds?: number | undefined;
            resetAt?: number | undefined;
        } | undefined;
        codeReview?: {
            usedPercent: number;
            windowSeconds?: number | undefined;
            resetAt?: number | undefined;
        } | undefined;
        credits?: {
            hasCredits?: boolean | undefined;
            unlimited?: boolean | undefined;
            balance?: string | number | undefined;
        } | undefined;
        error?: string | undefined;
    }>[]>;
}
