import { type Settings } from "./domain";
import { LedgerStore } from "./ledger";
import { HandoffStore } from "./handoff";
export declare class SummaryCoordinator {
    private client;
    private directory;
    private ledger;
    private handoff;
    private jobs;
    private internal;
    private internalProfiles;
    constructor(client: any, directory: string, ledger?: LedgerStore, handoff?: HandoffStore);
    isInternal(sessionID?: string): boolean;
    profile(sessionID?: string): {
        providerID: string;
        modelID: string;
        variant?: string | undefined;
        advancedOptions?: Record<string, unknown> | undefined;
    } | undefined;
    schedule(sessionID: string, settings: Settings, force?: boolean): void;
    refresh(sessionID: string, settings: Settings): Promise<void>;
    private runLoop;
    private run;
    private invoke;
}
