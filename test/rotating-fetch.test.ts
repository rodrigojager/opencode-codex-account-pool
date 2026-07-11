import { afterEach, describe, expect, mock, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { AccountStore } from "../src/store"
import { createRotatingFetch } from "../src/rotating-fetch"
import { defaultSettings } from "../src/domain"

const directories: string[] = []
afterEach(async () => Promise.all(directories.splice(0).map((path) => rm(path, { recursive: true, force: true }))))

test("rotates to the next account after a 429", async () => {
  const directory = await mkdtemp(join(tmpdir(), "codex-fetch-"))
  directories.push(directory)
  const store = new AccountStore(join(directory, "accounts.json"))
  const first = await store.add({ access: "first", refresh: "r1", expires: Date.now() + 60_000 })
  await store.add({ access: "second", refresh: "r2", expires: Date.now() + 60_000 })
  await store.setActive(first.id)

  const request = mock(async (_url: RequestInfo | URL, init?: RequestInit) => {
    const token = new Headers(init?.headers).get("authorization")
    return token === "Bearer first" ? new Response("limited", { status: 429 }) : new Response("ok")
  })
  const rotating = createRotatingFetch(store, { fetch: request as unknown as typeof fetch, settings: async () => defaultSettings() })
  const response = await rotating("https://api.openai.com/v1/responses", { method: "POST", body: "{}" })

  expect(response.status).toBe(200)
  await response.text()
  expect(request).toHaveBeenCalledTimes(3) // two model attempts plus the asynchronous quota refresh
  const snapshot = await store.snapshot()
  expect(snapshot.accounts.find((item) => item.id === first.id)?.health.lastStatus).toBe(429)
  expect(snapshot.accounts.find((item) => item.id !== first.id)?.health.successes).toBe(1)
})

test("reports all accounts exhausted after the final 429", async () => {
  const directory = await mkdtemp(join(tmpdir(), "codex-exhausted-"))
  directories.push(directory)
  const store = new AccountStore(join(directory, "accounts.json"))
  await store.add({ access: "first", refresh: "r1", expires: Date.now() + 60_000 })
  await store.add({ access: "second", refresh: "r2", expires: Date.now() + 60_000 })
  const exhausted = mock(() => {})
  const request = mock(async () => new Response("limited", { status: 429, headers: { "retry-after": "60" } }))
  const rotating = createRotatingFetch(store, { fetch: request as unknown as typeof fetch, settings: async () => defaultSettings(), onAllExhausted: exhausted })
  const response = await rotating("https://api.openai.com/v1/responses", { method: "POST", body: "{}", headers: { "session-id": "ses_a" } })
  expect(response.status).toBe(429)
  expect(exhausted).toHaveBeenCalledTimes(1)
})

test("holds a cross-process reservation until the response stream is consumed", async () => {
  const directory = await mkdtemp(join(tmpdir(), "codex-reservation-"))
  directories.push(directory)
  const store = new AccountStore(join(directory, "accounts.json"))
  const account = await store.add({ access: "first", refresh: "r1", expires: Date.now() + 60_000 })
  const { BindingStore } = await import("../src/bindings")
  const bindings = new BindingStore(join(directory, "bindings.json"))
  const request = mock(async (url: RequestInfo | URL) => String(url).includes("wham/usage") ? new Response(JSON.stringify({ rate_limit: { allowed: true } })) : new Response("streamed"))
  const rotating = createRotatingFetch(store, { fetch: request as unknown as typeof fetch, bindings, settings: async () => defaultSettings() })
  const response = await rotating("https://api.openai.com/v1/responses", { headers: { "session-id": "ses_a" } })
  expect(await bindings.activeReservations(account.id)).toHaveLength(1)
  expect(await response.text()).toBe("streamed")
  expect(await bindings.activeReservations(account.id)).toHaveLength(0)
})
