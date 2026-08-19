import { type ModelProfile, type SummaryCircuit, type SummaryJob, type SummaryPriority } from "./domain";
export declare function modelKey(profile: ModelProfile): string;
export declare class SummaryQueueStore {
    readonly path: string;
    constructor(path?: string);
    snapshot(): Promise<{
        version: 1;
        revision: number;
        jobs: SummaryJob[];
        circuits: Record<string, SummaryCircuit>;
    }>;
    private update;
    put(sessionID: string, priority: SummaryPriority, force: boolean): Promise<{
        id: string;
        sessionID: string;
        state: "waiting" | "claimed";
        priority: "quota" | "routine" | "emergency";
        force: boolean;
        dirty: boolean;
        nextAttemptAt: number;
        createdAt: number;
        updatedAt: number;
        owner?: {
            instanceID: string;
            pid: number;
            hostname: string;
            leaseUntil: number;
        } | undefined;
        lastError?: string | undefined;
    }>;
    claim(instanceID: string, leaseMs: number): Promise<{
        id: string;
        sessionID: string;
        state: "waiting" | "claimed";
        priority: "quota" | "routine" | "emergency";
        force: boolean;
        dirty: boolean;
        nextAttemptAt: number;
        createdAt: number;
        updatedAt: number;
        owner?: {
            instanceID: string;
            pid: number;
            hostname: string;
            leaseUntil: number;
        } | undefined;
        lastError?: string | undefined;
    } | undefined>;
    renew(id: string, instanceID: string, leaseMs: number): Promise<boolean>;
    complete(id: string, instanceID: string): Promise<{
        requeued: boolean;
    }>;
    defer(id: string, instanceID: string, nextAttemptAt: number, error: string): Promise<boolean>;
    cancel(sessionID: string): Promise<void>;
    block(profile: ModelProfile, category: string, error: string, cooldownMs: number): Promise<{
        key: string;
        blockedUntil: number;
        category: string;
        failures: number;
        updatedAt: number;
        lastError?: string | undefined;
    }>;
    clear(profile: ModelProfile): Promise<void>;
}
