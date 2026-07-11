import { z } from "zod";
export declare const modelProfileSchema: z.ZodObject<{
    providerID: z.ZodString;
    modelID: z.ZodString;
    variant: z.ZodOptional<z.ZodString>;
    advancedOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type ModelProfile = z.infer<typeof modelProfileSchema>;
export declare const settingsSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    revision: z.ZodNumber;
    providerName: z.ZodDefault<z.ZodString>;
    notifyActiveAccount: z.ZodDefault<z.ZodBoolean>;
    summarizer: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        primary: z.ZodOptional<z.ZodObject<{
            providerID: z.ZodString;
            modelID: z.ZodString;
            variant: z.ZodOptional<z.ZodString>;
            advancedOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        fallback: z.ZodOptional<z.ZodObject<{
            providerID: z.ZodString;
            modelID: z.ZodString;
            variant: z.ZodOptional<z.ZodString>;
            advancedOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        everyTurns: z.ZodDefault<z.ZodNumber>;
        maxDeltaTokens: z.ZodDefault<z.ZodNumber>;
        maxSummaryTokens: z.ZodDefault<z.ZodNumber>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
        finalSummaryThreshold: z.ZodDefault<z.ZodNumber>;
        retainLastTurns: z.ZodDefault<z.ZodNumber>;
        fallbackOn: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            provider_unavailable: "provider_unavailable";
            model_not_found: "model_not_found";
            auth: "auth";
            rate_limit: "rate_limit";
            timeout: "timeout";
            server_error: "server_error";
            invalid_output: "invalid_output";
        }>>>;
    }, z.core.$strip>>;
    rotation: z.ZodDefault<z.ZodObject<{
        strategy: z.ZodDefault<z.ZodLiteral<"sticky">>;
        proactivePrimaryPercent: z.ZodDefault<z.ZodNumber>;
        proactiveSecondaryPercent: z.ZodDefault<z.ZodNumber>;
        rateLimitCooldownMs: z.ZodDefault<z.ZodNumber>;
        authFailureCooldownMs: z.ZodDefault<z.ZodNumber>;
        maxAttempts: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    quota: z.ZodDefault<z.ZodObject<{
        pollIntervalMs: z.ZodDefault<z.ZodNumber>;
        staleAfterMs: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    scheduler: z.ZodDefault<z.ZodObject<{
        autoResumeGoals: z.ZodDefault<z.ZodBoolean>;
        resumeJitterMs: z.ZodDefault<z.ZodNumber>;
        resumeSpacingMs: z.ZodDefault<z.ZodNumber>;
        maxConcurrentResumesPerAccount: z.ZodDefault<z.ZodNumber>;
        leaseMs: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Settings = z.infer<typeof settingsSchema>;
export declare const defaultSettings: () => Settings;
export declare const quotaWindowSchema: z.ZodObject<{
    usedPercent: z.ZodNumber;
    windowSeconds: z.ZodOptional<z.ZodNumber>;
    resetAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type QuotaWindow = z.infer<typeof quotaWindowSchema>;
export declare const accountQuotaSchema: z.ZodObject<{
    planType: z.ZodOptional<z.ZodString>;
    allowed: z.ZodOptional<z.ZodBoolean>;
    limitReached: z.ZodOptional<z.ZodBoolean>;
    reachedType: z.ZodOptional<z.ZodString>;
    primary: z.ZodOptional<z.ZodObject<{
        usedPercent: z.ZodNumber;
        windowSeconds: z.ZodOptional<z.ZodNumber>;
        resetAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    secondary: z.ZodOptional<z.ZodObject<{
        usedPercent: z.ZodNumber;
        windowSeconds: z.ZodOptional<z.ZodNumber>;
        resetAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    codeReview: z.ZodOptional<z.ZodObject<{
        usedPercent: z.ZodNumber;
        windowSeconds: z.ZodOptional<z.ZodNumber>;
        resetAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    credits: z.ZodOptional<z.ZodObject<{
        hasCredits: z.ZodOptional<z.ZodBoolean>;
        unlimited: z.ZodOptional<z.ZodBoolean>;
        balance: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    }, z.core.$strip>>;
    fetchedAt: z.ZodNumber;
    source: z.ZodEnum<{
        "usage-endpoint": "usage-endpoint";
        headers: "headers";
        response: "response";
    }>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AccountQuota = z.infer<typeof accountQuotaSchema>;
export declare const accountSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    subjectID: z.ZodOptional<z.ZodString>;
    workspaceAccountID: z.ZodOptional<z.ZodString>;
    organizationID: z.ZodOptional<z.ZodString>;
    planType: z.ZodOptional<z.ZodString>;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    expiresAt: z.ZodNumber;
    enabled: z.ZodBoolean;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    lastUsedAt: z.ZodOptional<z.ZodNumber>;
    health: z.ZodObject<{
        successes: z.ZodNumber;
        failures: z.ZodNumber;
        cooldownUntil: z.ZodOptional<z.ZodNumber>;
        lastStatus: z.ZodOptional<z.ZodNumber>;
        lastErrorAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    quota: z.ZodOptional<z.ZodObject<{
        planType: z.ZodOptional<z.ZodString>;
        allowed: z.ZodOptional<z.ZodBoolean>;
        limitReached: z.ZodOptional<z.ZodBoolean>;
        reachedType: z.ZodOptional<z.ZodString>;
        primary: z.ZodOptional<z.ZodObject<{
            usedPercent: z.ZodNumber;
            windowSeconds: z.ZodOptional<z.ZodNumber>;
            resetAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        secondary: z.ZodOptional<z.ZodObject<{
            usedPercent: z.ZodNumber;
            windowSeconds: z.ZodOptional<z.ZodNumber>;
            resetAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        codeReview: z.ZodOptional<z.ZodObject<{
            usedPercent: z.ZodNumber;
            windowSeconds: z.ZodOptional<z.ZodNumber>;
            resetAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        credits: z.ZodOptional<z.ZodObject<{
            hasCredits: z.ZodOptional<z.ZodBoolean>;
            unlimited: z.ZodOptional<z.ZodBoolean>;
            balance: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        }, z.core.$strip>>;
        fetchedAt: z.ZodNumber;
        source: z.ZodEnum<{
            "usage-endpoint": "usage-endpoint";
            headers: "headers";
            response: "response";
        }>;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Account = z.infer<typeof accountSchema>;
export declare const accountsFileSchema: z.ZodObject<{
    version: z.ZodLiteral<2>;
    initialized: z.ZodBoolean;
    revision: z.ZodNumber;
    defaultAccountID: z.ZodOptional<z.ZodString>;
    order: z.ZodArray<z.ZodString>;
    accounts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        subjectID: z.ZodOptional<z.ZodString>;
        workspaceAccountID: z.ZodOptional<z.ZodString>;
        organizationID: z.ZodOptional<z.ZodString>;
        planType: z.ZodOptional<z.ZodString>;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        expiresAt: z.ZodNumber;
        enabled: z.ZodBoolean;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        lastUsedAt: z.ZodOptional<z.ZodNumber>;
        health: z.ZodObject<{
            successes: z.ZodNumber;
            failures: z.ZodNumber;
            cooldownUntil: z.ZodOptional<z.ZodNumber>;
            lastStatus: z.ZodOptional<z.ZodNumber>;
            lastErrorAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        quota: z.ZodOptional<z.ZodObject<{
            planType: z.ZodOptional<z.ZodString>;
            allowed: z.ZodOptional<z.ZodBoolean>;
            limitReached: z.ZodOptional<z.ZodBoolean>;
            reachedType: z.ZodOptional<z.ZodString>;
            primary: z.ZodOptional<z.ZodObject<{
                usedPercent: z.ZodNumber;
                windowSeconds: z.ZodOptional<z.ZodNumber>;
                resetAt: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            secondary: z.ZodOptional<z.ZodObject<{
                usedPercent: z.ZodNumber;
                windowSeconds: z.ZodOptional<z.ZodNumber>;
                resetAt: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            codeReview: z.ZodOptional<z.ZodObject<{
                usedPercent: z.ZodNumber;
                windowSeconds: z.ZodOptional<z.ZodNumber>;
                resetAt: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            credits: z.ZodOptional<z.ZodObject<{
                hasCredits: z.ZodOptional<z.ZodBoolean>;
                unlimited: z.ZodOptional<z.ZodBoolean>;
                balance: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            }, z.core.$strip>>;
            fetchedAt: z.ZodNumber;
            source: z.ZodEnum<{
                "usage-endpoint": "usage-endpoint";
                headers: "headers";
                response: "response";
            }>;
            error: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AccountsFile = z.infer<typeof accountsFileSchema>;
export declare const bindingSchema: z.ZodObject<{
    sessionID: z.ZodString;
    accountID: z.ZodString;
    epoch: z.ZodNumber;
    worktree: z.ZodOptional<z.ZodString>;
    directory: z.ZodOptional<z.ZodString>;
    agent: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodObject<{
        providerID: z.ZodString;
        modelID: z.ZodString;
        variant: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    pinnedByUser: z.ZodBoolean;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export type SessionBinding = z.infer<typeof bindingSchema>;
export declare const bindingsFileSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    revision: z.ZodNumber;
    bindings: z.ZodRecord<z.ZodString, z.ZodObject<{
        sessionID: z.ZodString;
        accountID: z.ZodString;
        epoch: z.ZodNumber;
        worktree: z.ZodOptional<z.ZodString>;
        directory: z.ZodOptional<z.ZodString>;
        agent: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodObject<{
            providerID: z.ZodString;
            modelID: z.ZodString;
            variant: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        pinnedByUser: z.ZodBoolean;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>>;
    reservations: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        accountID: z.ZodString;
        sessionID: z.ZodOptional<z.ZodString>;
        instanceID: z.ZodString;
        expiresAt: z.ZodNumber;
        createdAt: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const structuredSummarySchema: z.ZodObject<{
    objective: z.ZodString;
    constraints: z.ZodArray<z.ZodString>;
    decisions: z.ZodArray<z.ZodString>;
    completed: z.ZodArray<z.ZodString>;
    currentStep: z.ZodOptional<z.ZodString>;
    nextSteps: z.ZodArray<z.ZodString>;
    modifiedFiles: z.ZodArray<z.ZodString>;
    tests: z.ZodArray<z.ZodString>;
    blockers: z.ZodArray<z.ZodString>;
    unresolvedQuestions: z.ZodArray<z.ZodString>;
    importantReferences: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type StructuredSummary = z.infer<typeof structuredSummarySchema>;
export type FailureCategory = Settings["summarizer"]["fallbackOn"][number];
export declare const ledgerSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    revision: z.ZodNumber;
    sessionID: z.ZodString;
    goal: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        objective: z.ZodString;
        status: z.ZodEnum<{
            active: "active";
            paused: "paused";
            complete: "complete";
            unmet: "unmet";
            cleared: "cleared";
        }>;
        lastCheckpoint: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>>;
    todos: z.ZodArray<z.ZodObject<{
        content: z.ZodString;
        status: z.ZodString;
        priority: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    completedSteps: z.ZodArray<z.ZodString>;
    currentStep: z.ZodOptional<z.ZodString>;
    pendingSteps: z.ZodArray<z.ZodString>;
    decisions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        category: z.ZodString;
        text: z.ZodString;
        replaceKey: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodNumber;
    }, z.core.$strip>>;
    modifiedFiles: z.ZodArray<z.ZodString>;
    verifications: z.ZodArray<z.ZodObject<{
        command: z.ZodString;
        result: z.ZodString;
        at: z.ZodNumber;
    }, z.core.$strip>>;
    lastUserText: z.ZodOptional<z.ZodString>;
    lastUserMessageID: z.ZodOptional<z.ZodString>;
    lastAssistantMessageID: z.ZodOptional<z.ZodString>;
    turnCount: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export type SessionLedger = z.infer<typeof ledgerSchema>;
export declare const summaryFileSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    revision: z.ZodNumber;
    sessionID: z.ZodString;
    basedOnMessageID: z.ZodOptional<z.ZodString>;
    generatedAt: z.ZodOptional<z.ZodNumber>;
    generatedBy: z.ZodOptional<z.ZodObject<{
        slot: z.ZodEnum<{
            primary: "primary";
            fallback: "fallback";
        }>;
        providerID: z.ZodString;
        modelID: z.ZodString;
        variant: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    settingsRevision: z.ZodOptional<z.ZodNumber>;
    primaryFailure: z.ZodOptional<z.ZodObject<{
        category: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>>;
    summary: z.ZodOptional<z.ZodObject<{
        objective: z.ZodString;
        constraints: z.ZodArray<z.ZodString>;
        decisions: z.ZodArray<z.ZodString>;
        completed: z.ZodArray<z.ZodString>;
        currentStep: z.ZodOptional<z.ZodString>;
        nextSteps: z.ZodArray<z.ZodString>;
        modifiedFiles: z.ZodArray<z.ZodString>;
        tests: z.ZodArray<z.ZodString>;
        blockers: z.ZodArray<z.ZodString>;
        unresolvedQuestions: z.ZodArray<z.ZodString>;
        importantReferences: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    lastAttemptAt: z.ZodOptional<z.ZodNumber>;
    lastError: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SummaryFile = z.infer<typeof summaryFileSchema>;
export declare const epochSchema: z.ZodObject<{
    sessionID: z.ZodString;
    epoch: z.ZodNumber;
    sourceAccountID: z.ZodOptional<z.ZodString>;
    targetAccountID: z.ZodString;
    cutoffMessageID: z.ZodString;
    summaryRevision: z.ZodNumber;
    checkpointPath: z.ZodString;
    state: z.ZodEnum<{
        planned: "planned";
        armed: "armed";
        committed: "committed";
        failed: "failed";
    }>;
    reason: z.ZodString;
    createdAt: z.ZodNumber;
    committedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type ContextEpoch = z.infer<typeof epochSchema>;
export declare const sessionStateSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    revision: z.ZodNumber;
    sessionID: z.ZodString;
    epoch: z.ZodOptional<z.ZodObject<{
        sessionID: z.ZodString;
        epoch: z.ZodNumber;
        sourceAccountID: z.ZodOptional<z.ZodString>;
        targetAccountID: z.ZodString;
        cutoffMessageID: z.ZodString;
        summaryRevision: z.ZodNumber;
        checkpointPath: z.ZodString;
        state: z.ZodEnum<{
            planned: "planned";
            armed: "armed";
            committed: "committed";
            failed: "failed";
        }>;
        reason: z.ZodString;
        createdAt: z.ZodNumber;
        committedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        paused: "paused";
        waiting_for_quota: "waiting_for_quota";
        closed: "closed";
    }>>;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export type SessionState = z.infer<typeof sessionStateSchema>;
export declare const resumeJobSchema: z.ZodObject<{
    id: z.ZodString;
    sessionID: z.ZodString;
    goalID: z.ZodOptional<z.ZodString>;
    goalActive: z.ZodBoolean;
    state: z.ZodEnum<{
        completed: "completed";
        failed: "failed";
        waiting: "waiting";
        claimed: "claimed";
        resuming: "resuming";
        cancelled: "cancelled";
    }>;
    resumeAt: z.ZodNumber;
    targetAccountID: z.ZodString;
    epoch: z.ZodNumber;
    agent: z.ZodString;
    model: z.ZodObject<{
        providerID: z.ZodString;
        modelID: z.ZodString;
        variant: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    owner: z.ZodOptional<z.ZodObject<{
        instanceID: z.ZodString;
        pid: z.ZodNumber;
        hostname: z.ZodString;
        leaseUntil: z.ZodNumber;
    }, z.core.$strip>>;
    attempts: z.ZodNumber;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    lastError: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ResumeJob = z.infer<typeof resumeJobSchema>;
export declare const jobsFileSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    revision: z.ZodNumber;
    jobs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sessionID: z.ZodString;
        goalID: z.ZodOptional<z.ZodString>;
        goalActive: z.ZodBoolean;
        state: z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            waiting: "waiting";
            claimed: "claimed";
            resuming: "resuming";
            cancelled: "cancelled";
        }>;
        resumeAt: z.ZodNumber;
        targetAccountID: z.ZodString;
        epoch: z.ZodNumber;
        agent: z.ZodString;
        model: z.ZodObject<{
            providerID: z.ZodString;
            modelID: z.ZodString;
            variant: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        owner: z.ZodOptional<z.ZodObject<{
            instanceID: z.ZodString;
            pid: z.ZodNumber;
            hostname: z.ZodString;
            leaseUntil: z.ZodNumber;
        }, z.core.$strip>>;
        attempts: z.ZodNumber;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        lastError: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const accountActionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        remove: "remove";
    }>;
    accountID: z.ZodString;
    state: z.ZodEnum<{
        completed: "completed";
        failed: "failed";
        claimed: "claimed";
        pending: "pending";
    }>;
    owner: z.ZodOptional<z.ZodString>;
    leaseUntil: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    result: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AccountAction = z.infer<typeof accountActionSchema>;
export declare const accountActionsFileSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    revision: z.ZodNumber;
    actions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            remove: "remove";
        }>;
        accountID: z.ZodString;
        state: z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            claimed: "claimed";
            pending: "pending";
        }>;
        owner: z.ZodOptional<z.ZodString>;
        leaseUntil: z.ZodOptional<z.ZodNumber>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        result: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
