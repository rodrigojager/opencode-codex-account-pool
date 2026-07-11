import type { z } from "zod";
export declare function dataRoot(): string;
export declare const paths: {
    root: string;
    settings: string;
    accounts: string;
    legacyAccounts: string;
    bindings: string;
    jobs: string;
    actions: string;
    session(sessionID: string): string;
};
export declare class FileLock {
    readonly path: string;
    readonly owner: string;
    private constructor();
    static acquire(key: string, timeoutMs?: number, staleMs?: number): Promise<FileLock>;
    release(): Promise<void>;
}
export declare function atomicWrite(path: string, value: unknown, secret?: boolean): Promise<void>;
export declare function readJson<T>(path: string, schema: z.ZodType<T>, fallback: () => T): Promise<T>;
export declare function transact<T, R>(input: {
    key: string;
    path: string;
    schema: z.ZodType<T>;
    fallback: () => T;
    secret?: boolean;
    update(value: T): R | Promise<R>;
}): Promise<R>;
