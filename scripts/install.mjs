#!/usr/bin/env bun
import { existsSync } from "node:fs"
import { mkdir, readFile, rename, copyFile, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { applyEdits, modify, parse, printParseErrorCode } from "jsonc-parser"

const argv = process.argv.slice(2)
const args = new Set(argv)
const global = args.has("--global") || !args.has("--local")
const dryRun = args.has("--dry-run")
const uninstall = args.has("--uninstall")
const root = resolve(import.meta.dirname, "..")
const configDirArg = argv.find((value) => value.startsWith("--config-dir="))?.slice("--config-dir=".length)
const configDir = configDirArg
  ? resolve(configDirArg)
  : global
    ? process.env.OPENCODE_CONFIG_DIR ?? join(homedir(), ".config", "opencode")
    : join(process.cwd(), ".opencode")

const serverSpec = pathToFileURL(join(root, "dist", "server.js")).href
const tuiSpec = pathToFileURL(join(root, "dist", "tui.js")).href
const packageName = "opencode-codex-account-pool"
const conflicts = new Set(["opencode-openai-codex-auth"])

function pluginName(value) {
  const spec = Array.isArray(value) ? value[0] : value
  if (typeof spec !== "string") return ""
  if (spec.startsWith("@")) return spec.split("@").slice(0, 2).join("@")
  return spec.split("@")[0]
}

function updatePlugins(text, kind) {
  const errors = []
  const data = parse(text, errors, { allowTrailingComma: true, disallowComments: false }) ?? {}
  if (errors.length) {
    const error = errors[0]
    throw new Error(`${printParseErrorCode(error.error)} at offset ${error.offset}`)
  }
  const current = Array.isArray(data.plugin) ? data.plugin : []
  const localSpec = kind === "server" ? serverSpec : tuiSpec
  const filtered = current.filter((entry) => {
    const name = pluginName(entry)
    if (kind === "server" && conflicts.has(name)) return false
    if (name === packageName) return false
    if (typeof entry === "string" && entry.includes("opencode-codex-account-pool")) return false
    if (typeof entry === "string" && entry.endsWith(kind === "server" ? "/dist/server.js" : "/dist/tui.js")) return false
    return true
  })
  if (!uninstall) filtered.push(localSpec)
  const formattingOptions = { insertSpaces: true, tabSize: 2 }
  const withSchema = data.$schema
    ? text
    : applyEdits(text, modify(text, ["$schema"], kind === "server" ? "https://opencode.ai/config.json" : "https://opencode.ai/tui.json", { formattingOptions }))
  return applyEdits(withSchema, modify(withSchema, ["plugin"], filtered, { formattingOptions }))
}

async function patch(name, kind) {
  const path = join(configDir, `${name}.json`)
  const source = await readFile(path, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "{}\n"
    throw error
  })
  const next = updatePlugins(source, kind)
  if (next === source) return { path, changed: false }
  if (dryRun) return { path, changed: true }
  await mkdir(dirname(path), { recursive: true })
  if (existsSync(path)) await copyFile(path, `${path}.codex-pool.backup`)
  const temp = `${path}.${process.pid}.tmp`
  await writeFile(temp, next, "utf8")
  await rename(temp, path)
  return { path, changed: true }
}

if (!uninstall && (!existsSync(join(root, "dist", "server.js")) || !existsSync(join(root, "dist", "tui.js")))) {
  console.error("Build artifacts are missing. Run `bun run build` first.")
  process.exit(1)
}

try {
  const results = await Promise.all([patch("opencode", "server"), patch("tui", "tui")])
  console.log(`${uninstall ? "Uninstall" : "Install"}${dryRun ? " dry run" : ""}:`)
  for (const result of results) console.log(`  ${result.changed ? "updated" : "unchanged"} ${result.path}`)
  if (!dryRun) {
    console.log(`\n${uninstall ? "Plugin removed." : "Plugin installed. Backups use the .codex-pool.backup suffix."}`)
    console.log("Quit every OpenCode process and start it again.")
  }
} catch (error) {
  console.error(`Installation failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
