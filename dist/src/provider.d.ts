import type { ProviderHook } from "@opencode-ai/plugin";
export declare const ASTRA_MODEL_ID = "gpt-6-astra";
type OpenAIProvider = Parameters<NonNullable<ProviderHook["models"]>>[0];
export declare function ensureAstraModel(provider: OpenAIProvider): {
    [key: string]: import("@opencode-ai/sdk/v2").Model;
};
export {};
