import { type Settings } from "./domain";
export declare class SettingsStore {
    readonly path: string;
    private cached?;
    constructor(path?: string);
    get(force?: boolean): Promise<{
        version: 1;
        revision: number;
        providerName: string;
        notifyActiveAccount: boolean;
        summarizer: {
            enabled: boolean;
            everyTurns: number;
            maxDeltaTokens: number;
            maxSummaryTokens: number;
            timeoutMs: number;
            finalSummaryThreshold: number;
            retainLastTurns: number;
            fallbackOn: ("provider_unavailable" | "model_not_found" | "auth" | "rate_limit" | "timeout" | "server_error" | "invalid_output")[];
            primary?: {
                providerID: string;
                modelID: string;
                variant?: string | undefined;
                advancedOptions?: Record<string, unknown> | undefined;
            } | undefined;
            fallback?: {
                providerID: string;
                modelID: string;
                variant?: string | undefined;
                advancedOptions?: Record<string, unknown> | undefined;
            } | undefined;
        };
        rotation: {
            strategy: "sticky";
            proactivePrimaryPercent: number;
            proactiveSecondaryPercent: number;
            rateLimitCooldownMs: number;
            authFailureCooldownMs: number;
            maxAttempts: number;
        };
        quota: {
            pollIntervalMs: number;
            staleAfterMs: number;
        };
        scheduler: {
            autoResumeGoals: boolean;
            resumeJitterMs: number;
            resumeSpacingMs: number;
            maxConcurrentResumesPerAccount: number;
            leaseMs: number;
        };
    }>;
    save(next: Omit<Settings, "version" | "revision"> | Settings): Promise<{
        version: 1;
        revision: number;
        providerName: string;
        notifyActiveAccount: boolean;
        summarizer: {
            enabled: boolean;
            everyTurns: number;
            maxDeltaTokens: number;
            maxSummaryTokens: number;
            timeoutMs: number;
            finalSummaryThreshold: number;
            retainLastTurns: number;
            fallbackOn: ("provider_unavailable" | "model_not_found" | "auth" | "rate_limit" | "timeout" | "server_error" | "invalid_output")[];
            primary?: {
                providerID: string;
                modelID: string;
                variant?: string | undefined;
                advancedOptions?: Record<string, unknown> | undefined;
            } | undefined;
            fallback?: {
                providerID: string;
                modelID: string;
                variant?: string | undefined;
                advancedOptions?: Record<string, unknown> | undefined;
            } | undefined;
        };
        rotation: {
            strategy: "sticky";
            proactivePrimaryPercent: number;
            proactiveSecondaryPercent: number;
            rateLimitCooldownMs: number;
            authFailureCooldownMs: number;
            maxAttempts: number;
        };
        quota: {
            pollIntervalMs: number;
            staleAfterMs: number;
        };
        scheduler: {
            autoResumeGoals: boolean;
            resumeJitterMs: number;
            resumeSpacingMs: number;
            maxConcurrentResumesPerAccount: number;
            leaseMs: number;
        };
    }>;
}
