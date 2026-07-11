import { type Account, type AccountQuota } from "./domain";
export interface AccountInput {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    label?: string;
    email?: string;
    subjectID?: string;
    workspaceAccountID?: string;
    organizationID?: string;
    planType?: string;
}
export declare class AccountStore {
    readonly path: string;
    constructor(path?: string);
    private migrate;
    importLegacyIfNeeded(): Promise<{
        version: 2;
        initialized: boolean;
        revision: number;
        order: string[];
        accounts: {
            id: string;
            label: string;
            accessToken: string;
            refreshToken: string;
            expiresAt: number;
            enabled: boolean;
            createdAt: number;
            updatedAt: number;
            health: {
                successes: number;
                failures: number;
                cooldownUntil?: number | undefined;
                lastStatus?: number | undefined;
                lastErrorAt?: number | undefined;
            };
            email?: string | undefined;
            subjectID?: string | undefined;
            workspaceAccountID?: string | undefined;
            organizationID?: string | undefined;
            planType?: string | undefined;
            lastUsedAt?: number | undefined;
            quota?: {
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
            } | undefined;
        }[];
        defaultAccountID?: string | undefined;
    }>;
    snapshot(): Promise<{
        version: 2;
        initialized: boolean;
        revision: number;
        order: string[];
        accounts: {
            id: string;
            label: string;
            accessToken: string;
            refreshToken: string;
            expiresAt: number;
            enabled: boolean;
            createdAt: number;
            updatedAt: number;
            health: {
                successes: number;
                failures: number;
                cooldownUntil?: number | undefined;
                lastStatus?: number | undefined;
                lastErrorAt?: number | undefined;
            };
            email?: string | undefined;
            subjectID?: string | undefined;
            workspaceAccountID?: string | undefined;
            organizationID?: string | undefined;
            planType?: string | undefined;
            lastUsedAt?: number | undefined;
            quota?: {
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
            } | undefined;
        }[];
        defaultAccountID?: string | undefined;
    }>;
    private update;
    initialize(): Promise<boolean>;
    add(input: AccountInput | {
        access: string;
        refresh: string;
        expires: number;
        accountId?: string;
        email?: string;
        label?: string;
    }): Promise<{
        id: string;
        label: string;
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        enabled: boolean;
        createdAt: number;
        updatedAt: number;
        health: {
            successes: number;
            failures: number;
            cooldownUntil?: number | undefined;
            lastStatus?: number | undefined;
            lastErrorAt?: number | undefined;
        };
        email?: string | undefined;
        subjectID?: string | undefined;
        workspaceAccountID?: string | undefined;
        organizationID?: string | undefined;
        planType?: string | undefined;
        lastUsedAt?: number | undefined;
        quota?: {
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
        } | undefined;
    }>;
    updateTokens(id: string, input: Partial<Pick<Account, "accessToken" | "refreshToken" | "expiresAt" | "workspaceAccountID" | "email" | "subjectID">> & {
        access?: string;
        refresh?: string;
        expires?: number;
        accountId?: string;
    }): Promise<boolean>;
    renameAccount(id: string, label: string): Promise<boolean>;
    setDefault(id: string): Promise<boolean>;
    setActive(id: string): Promise<boolean>;
    setEnabled(id: string, enabled: boolean): Promise<boolean>;
    remove(id: string): Promise<boolean>;
    recordOutcome(id: string, status: number, ok: boolean, cooldownUntil?: number): Promise<void>;
    outcome(id: string, status: number, ok: boolean, cooldownUntil?: number): Promise<void>;
    updateQuota(id: string, quota: AccountQuota): Promise<boolean>;
    moveToBack(id: string): Promise<void>;
}
export type { Account };
