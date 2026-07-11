import { type Account, type ContextEpoch, type SessionLedger, type SessionState, type StructuredSummary, type SummaryFile } from "./domain";
export declare class HandoffStore {
    summaryPath(sessionID: string): string;
    statePath(sessionID: string): string;
    summary(sessionID: string): Promise<{
        version: 1;
        revision: number;
        sessionID: string;
        basedOnMessageID?: string | undefined;
        generatedAt?: number | undefined;
        generatedBy?: {
            slot: "primary" | "fallback";
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        } | undefined;
        settingsRevision?: number | undefined;
        primaryFailure?: {
            category: string;
            message: string;
        } | undefined;
        summary?: {
            objective: string;
            constraints: string[];
            decisions: string[];
            completed: string[];
            nextSteps: string[];
            modifiedFiles: string[];
            tests: string[];
            blockers: string[];
            unresolvedQuestions: string[];
            importantReferences: string[];
            currentStep?: string | undefined;
        } | undefined;
        lastAttemptAt?: number | undefined;
        lastError?: string | undefined;
    }>;
    state(sessionID: string): Promise<{
        version: 1;
        revision: number;
        sessionID: string;
        status: "active" | "paused" | "waiting_for_quota" | "closed";
        updatedAt: number;
        epoch?: {
            sessionID: string;
            epoch: number;
            targetAccountID: string;
            cutoffMessageID: string;
            summaryRevision: number;
            checkpointPath: string;
            state: "planned" | "armed" | "committed" | "failed";
            reason: string;
            createdAt: number;
            sourceAccountID?: string | undefined;
            committedAt?: number | undefined;
        } | undefined;
    }>;
    saveSummary(sessionID: string, input: Omit<SummaryFile, "version" | "revision" | "sessionID">, expectedBase?: string): Promise<boolean>;
    setEpoch(sessionID: string, epoch: ContextEpoch, status?: SessionState["status"]): Promise<{
        version: 1;
        revision: number;
        sessionID: string;
        status: "active" | "paused" | "waiting_for_quota" | "closed";
        updatedAt: number;
        epoch?: {
            sessionID: string;
            epoch: number;
            targetAccountID: string;
            cutoffMessageID: string;
            summaryRevision: number;
            checkpointPath: string;
            state: "planned" | "armed" | "committed" | "failed";
            reason: string;
            createdAt: number;
            sourceAccountID?: string | undefined;
            committedAt?: number | undefined;
        } | undefined;
    }>;
    commitEpoch(sessionID: string, epochNumber: number): Promise<boolean>;
    checkpoint(input: {
        sessionID: string;
        source?: Account;
        target: Account;
        ledger: SessionLedger;
        summary?: StructuredSummary;
        cutoffMessageID: string;
        reason: string;
        quota?: unknown;
    }): Promise<{
        checkpoint: {
            version: number;
            sessionID: string;
            epoch: number;
            createdAt: number;
            reason: string;
            sourceAccount: {
                id: string;
                label: string;
                email: string | undefined;
            } | undefined;
            targetAccount: {
                id: string;
                label: string;
                email: string | undefined;
            };
            objective: string;
            plan: {
                completed: string[];
                current: string | undefined;
                pending: string[];
            };
            decisions: string[];
            constraints: string[];
            blockers: string[];
            modifiedFiles: string[];
            tests: string[];
            lastMilestone: string | undefined;
            quota: unknown;
            boundary: {
                cutoffMessageID: string;
                lastUserMessageID: string | undefined;
                lastAssistantMessageID: string | undefined;
            };
            summary: {
                objective: string;
                constraints: string[];
                decisions: string[];
                completed: string[];
                nextSteps: string[];
                modifiedFiles: string[];
                tests: string[];
                blockers: string[];
                unresolvedQuestions: string[];
                importantReferences: string[];
                currentStep?: string | undefined;
            } | undefined;
        };
        epoch: {
            sessionID: string;
            epoch: number;
            targetAccountID: string;
            cutoffMessageID: string;
            summaryRevision: number;
            checkpointPath: string;
            state: "planned" | "armed" | "committed" | "failed";
            reason: string;
            createdAt: number;
            sourceAccountID?: string | undefined;
            committedAt?: number | undefined;
        };
    }>;
}
export declare function handoffText(checkpoint: any): string;
export declare function applyEpoch(messages: any[], cutoffMessageID: string, text: string, retainLastTurns?: number): any[];
