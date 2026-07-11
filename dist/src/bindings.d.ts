import { type Account, type SessionBinding } from "./domain";
export declare class BindingStore {
    readonly path: string;
    constructor(path?: string);
    snapshot(): Promise<{
        version: 1;
        revision: number;
        bindings: Record<string, SessionBinding>;
        reservations: Array<{
            id: string;
            accountID: string;
            sessionID?: string;
            instanceID: string;
            expiresAt: number;
            createdAt: number;
        }>;
    }>;
    private update;
    get(sessionID: string): Promise<{
        sessionID: string;
        accountID: string;
        epoch: number;
        pinnedByUser: boolean;
        createdAt: number;
        updatedAt: number;
        worktree?: string | undefined;
        directory?: string | undefined;
        agent?: string | undefined;
        model?: {
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        } | undefined;
    }>;
    bind(sessionID: string, accountID: string, input?: Partial<SessionBinding>): Promise<{
        sessionID: string;
        accountID: string;
        epoch: number;
        pinnedByUser: boolean;
        createdAt: number;
        updatedAt: number;
        worktree?: string | undefined;
        directory?: string | undefined;
        agent?: string | undefined;
        model?: {
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        } | undefined;
    }>;
    removeSession(sessionID: string): Promise<boolean>;
    affected(accountID: string): Promise<{
        sessionID: string;
        accountID: string;
        epoch: number;
        pinnedByUser: boolean;
        createdAt: number;
        updatedAt: number;
        worktree?: string | undefined;
        directory?: string | undefined;
        agent?: string | undefined;
        model?: {
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        } | undefined;
    }[]>;
    removeAccount(accountID: string): Promise<{
        sessionID: string;
        accountID: string;
        epoch: number;
        pinnedByUser: boolean;
        createdAt: number;
        updatedAt: number;
        worktree?: string | undefined;
        directory?: string | undefined;
        agent?: string | undefined;
        model?: {
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        } | undefined;
    }[]>;
    reserve(accountID: string, sessionID?: string, leaseMs?: number): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        accountID: string;
        sessionID: string | undefined;
        instanceID: string;
        createdAt: number;
        expiresAt: number;
    }>;
    releaseReservation(id: string): Promise<void>;
    activeReservations(accountID: string): Promise<{
        id: string;
        accountID: string;
        sessionID?: string;
        instanceID: string;
        expiresAt: number;
        createdAt: number;
    }[]>;
}
export declare function selectAccount(accounts: Account[], preferred?: string, now?: number): {
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
} | undefined;
export declare function earliestAccount(accounts: Account[], now?: number): {
    account: {
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
    };
    at: number;
};
