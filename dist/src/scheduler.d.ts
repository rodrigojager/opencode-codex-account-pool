import { type ResumeJob, type Settings } from "./domain";
import { AccountStore } from "./store";
import { BindingStore } from "./bindings";
import { QuotaService } from "./quota";
import { LedgerStore } from "./ledger";
export declare class JobStore {
    readonly path: string;
    constructor(path?: string);
    snapshot(): Promise<{
        version: 1;
        revision: number;
        jobs: ResumeJob[];
    }>;
    private update;
    put(job: ResumeJob): Promise<{
        id: string;
        sessionID: string;
        goalActive: boolean;
        state: "completed" | "failed" | "waiting" | "claimed" | "resuming" | "cancelled";
        resumeAt: number;
        targetAccountID: string;
        epoch: number;
        agent: string;
        model: {
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        };
        attempts: number;
        createdAt: number;
        updatedAt: number;
        goalID?: string | undefined;
        owner?: {
            instanceID: string;
            pid: number;
            hostname: string;
            leaseUntil: number;
        } | undefined;
        lastError?: string | undefined;
    }>;
    cancelSession(sessionID: string): Promise<void>;
    claim(instanceID: string, leaseMs: number, blockedAccounts?: Set<string>): Promise<{
        id: string;
        sessionID: string;
        goalActive: boolean;
        state: "completed" | "failed" | "waiting" | "claimed" | "resuming" | "cancelled";
        resumeAt: number;
        targetAccountID: string;
        epoch: number;
        agent: string;
        model: {
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        };
        attempts: number;
        createdAt: number;
        updatedAt: number;
        goalID?: string | undefined;
        owner?: {
            instanceID: string;
            pid: number;
            hostname: string;
            leaseUntil: number;
        } | undefined;
        lastError?: string | undefined;
    } | undefined>;
    renew(id: string, instanceID: string, leaseMs: number): Promise<boolean>;
    finish(id: string, state: ResumeJob["state"], update?: Partial<ResumeJob>): Promise<{
        id: string;
        sessionID: string;
        goalActive: boolean;
        state: "completed" | "failed" | "waiting" | "claimed" | "resuming" | "cancelled";
        resumeAt: number;
        targetAccountID: string;
        epoch: number;
        agent: string;
        model: {
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        };
        attempts: number;
        createdAt: number;
        updatedAt: number;
        goalID?: string | undefined;
        owner?: {
            instanceID: string;
            pid: number;
            hostname: string;
            leaseUntil: number;
        } | undefined;
        lastError?: string | undefined;
    } | undefined>;
}
export interface WaitInput {
    sessionID: string;
    goalID?: string;
    agent: string;
    model: {
        providerID: string;
        modelID: string;
        variant?: string;
    };
    targetAccountID: string;
    resumeAt: number;
    epoch: number;
}
export declare class ResumeScheduler {
    private client;
    private directory;
    private settings;
    private jobs;
    private accounts;
    private bindings;
    private quota;
    private ledger;
    readonly instanceID: string;
    private timer?;
    private ticking;
    private active;
    constructor(client: any, directory: string, settings: () => Promise<Settings>, jobs?: JobStore, accounts?: AccountStore, bindings?: BindingStore, quota?: QuotaService, ledger?: LedgerStore);
    start(): void;
    stop(): void;
    wait(input: WaitInput): Promise<{
        id: string;
        sessionID: string;
        goalActive: boolean;
        state: "completed" | "failed" | "waiting" | "claimed" | "resuming" | "cancelled";
        resumeAt: number;
        targetAccountID: string;
        epoch: number;
        agent: string;
        model: {
            providerID: string;
            modelID: string;
            variant?: string | undefined;
        };
        attempts: number;
        createdAt: number;
        updatedAt: number;
        goalID?: string | undefined;
        owner?: {
            instanceID: string;
            pid: number;
            hostname: string;
            leaseUntil: number;
        } | undefined;
        lastError?: string | undefined;
    }>;
    cancel(sessionID: string): Promise<void>;
    private tick;
    private resume;
}
