import { afterEach, expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { JobStore } from "../src/scheduler"

const roots: string[] = []
afterEach(async () => Promise.all(roots.splice(0).map((path) => rm(path, { recursive: true, force: true }))))

test("claims each due resume job only once", async () => {
  const root = await mkdtemp(join(tmpdir(), "jobs-")); roots.push(root)
  const store = new JobStore(join(root, "jobs.json"))
  const now = Date.now()
  await store.put({ id: "j", sessionID: "s", goalActive: true, state: "waiting", resumeAt: now - 1, targetAccountID: "a", epoch: 1, agent: "build", model: { providerID: "openai", modelID: "gpt" }, attempts: 0, createdAt: now, updatedAt: now })
  const [a, b] = await Promise.all([store.claim("one", 60000), store.claim("two", 60000)])
  expect([a, b].filter(Boolean)).toHaveLength(1)
})

test("respects per-account claim limits and renews the owner lease", async () => {
  const root = await mkdtemp(join(tmpdir(), "jobs-limit-")); roots.push(root)
  const store = new JobStore(join(root, "jobs.json"))
  const now = Date.now()
  for (const [id, account] of [["a1", "a"], ["a2", "a"], ["b1", "b"]] as const) await store.put({ id, sessionID: id, goalActive: true, state: "waiting", resumeAt: now - 1, targetAccountID: account, epoch: 1, agent: "build", model: { providerID: "openai", modelID: "gpt" }, attempts: 0, createdAt: now, updatedAt: now })
  const first = await store.claim("owner", 10000)
  expect(first?.targetAccountID).toBe("a")
  const second = await store.claim("owner", 10000, new Set(["a"]))
  expect(second?.targetAccountID).toBe("b")
  const before = first!.owner!.leaseUntil
  await new Promise((resolve) => setTimeout(resolve, 2))
  expect(await store.renew(first!.id, "owner", 20000)).toBe(true)
  expect((await store.snapshot()).jobs.find((item) => item.id === first!.id)!.owner!.leaseUntil).toBeGreaterThan(before)
})
