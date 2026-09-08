import type { ProviderHook } from "@opencode-ai/plugin"

export const ASTRA_MODEL_ID = "gpt-6-astra"

type OpenAIProvider = Parameters<NonNullable<ProviderHook["models"]>>[0]

export function ensureAstraModel(provider: OpenAIProvider) {
  if (provider.models[ASTRA_MODEL_ID]) return provider.models
  const source =
    provider.models["gpt-5.6-sol"] ??
    Object.values(provider.models).find((model) => model.api.id === "gpt-5.6-sol")
  if (!source) return provider.models

  return {
    ...provider.models,
    [ASTRA_MODEL_ID]: {
      ...source,
      id: ASTRA_MODEL_ID,
      providerID: provider.id,
      api: { ...source.api, id: ASTRA_MODEL_ID },
      name: "GPT-6 Astra",
      family: "gpt-astra",
      capabilities: {
        ...source.capabilities,
        attachment: true,
        reasoning: true,
        temperature: false,
        toolcall: true,
        input: { ...source.capabilities.input, text: true, image: true, pdf: true },
        output: { ...source.capabilities.output, text: true },
      },
      limit: { context: 1_050_000, input: 922_000, output: 128_000 },
      status: "active" as const,
      release_date: "2026-09-04",
      options: { ...source.options },
      headers: { ...source.headers },
      variants: source.variants ? { ...source.variants } : undefined,
    },
  }
}
