import { expect, test } from "bun:test"
import { ASTRA_MODEL_ID, ensureAstraModel } from "../src/provider"

function model(id: string) {
  return {
    id,
    providerID: "openai",
    api: { id, url: "https://api.openai.com/v1", npm: "@ai-sdk/openai" },
    name: id,
    family: "gpt",
    capabilities: {
      temperature: false,
      reasoning: true,
      attachment: true,
      toolcall: true,
      input: { text: true, audio: false, image: true, video: false, pdf: true },
      output: { text: true, audio: false, image: false, video: false, pdf: false },
      interleaved: false,
    },
    cost: { input: 0, output: 0, cache: { read: 0, write: 0 } },
    limit: { context: 400_000, input: 272_000, output: 128_000 },
    status: "active" as const,
    options: {},
    headers: {},
    release_date: "2026-07-01",
    variants: { high: { reasoningEffort: "high" } },
  }
}

test("adds Astra from the available Codex model template", () => {
  const source = model("gpt-5.6-sol")
  const provider = { id: "openai", models: { "gpt-5.6-sol": source } }

  const models = ensureAstraModel(provider as never)

  expect(models[ASTRA_MODEL_ID]).toMatchObject({
    id: ASTRA_MODEL_ID,
    providerID: "openai",
    api: { id: ASTRA_MODEL_ID },
    name: "GPT-6 Astra",
    family: "gpt-astra",
    limit: { context: 1_050_000, input: 922_000, output: 128_000 },
  })
  expect(models["gpt-5.6-sol"]).toBe(source)
  expect(provider.models).toEqual({ "gpt-5.6-sol": source })
})

test("preserves the host catalog when Astra is already available", () => {
  const astra = model(ASTRA_MODEL_ID)
  const provider = { id: "openai", models: { [ASTRA_MODEL_ID]: astra } }

  expect(ensureAstraModel(provider as never)).toBe(provider.models)
  expect(provider.models[ASTRA_MODEL_ID]).toBe(astra)
})
