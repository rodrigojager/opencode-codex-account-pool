import { type SessionLedger } from "./domain";
export declare class LedgerStore {
    path(sessionID: string): string;
    get(sessionID: string): Promise<{
        version: 1;
        revision: number;
        sessionID: string;
        todos: {
            content: string;
            status: string;
            priority?: string | undefined;
        }[];
        completedSteps: string[];
        pendingSteps: string[];
        decisions: {
            id: string;
            category: string;
            text: string;
            createdAt: number;
            replaceKey?: string | undefined;
        }[];
        modifiedFiles: string[];
        verifications: {
            command: string;
            result: string;
            at: number;
        }[];
        turnCount: number;
        updatedAt: number;
        goal?: {
            objective: string;
            status: "active" | "paused" | "complete" | "unmet" | "cleared";
            updatedAt: number;
            id?: string | undefined;
            lastCheckpoint?: string | undefined;
        } | undefined;
        currentStep?: string | undefined;
        lastUserText?: string | undefined;
        lastUserMessageID?: string | undefined;
        lastAssistantMessageID?: string | undefined;
    }>;
    private update;
    setGoal(sessionID: string, input: Partial<NonNullable<SessionLedger["goal"]>> & {
        objective?: string;
        status?: NonNullable<SessionLedger["goal"]>["status"];
    }): Promise<void>;
    setTodos(sessionID: string, todos: Array<{
        content: string;
        status: string;
        priority?: string;
    }>): Promise<void>;
    note(sessionID: string, category: string, text: string, replaceKey?: string): Promise<void>;
    file(sessionID: string, path: string): Promise<void>;
    verification(sessionID: string, command: string, result: string): Promise<void>;
    userMessage(sessionID: string, messageID: string | undefined, text: string): Promise<void>;
    assistant(sessionID: string, messageID: string): Promise<void>;
}
