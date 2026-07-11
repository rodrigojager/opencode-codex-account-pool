# Troubleshooting

## Plugin does not load

Run `bun run build`, confirm `dist/server.js` and `dist/tui.js`, then restart OpenCode. Server config belongs in `opencode.json`; TUI config belongs in `tui.json`.

Remove other OpenAI/Codex auth plugins before enabling this package. Two plugins claiming the `openai` auth transport can override each other depending on load order.

## Browser login says another login is running

Complete or cancel the existing login. A stale lock is reclaimed after the browser-login timeout.

## Browser login says port 1455 is in use

Restart OpenCode so it loads the current plugin build. The plugin cancels a stale callback when possible and falls back to the registered local port `1457`. If both ports are owned by unrelated processes, close those listeners or use headless/device login.

## Adding an account only updates the existing account

The pool deduplicates by ChatGPT workspace/account identity. Sign in to a different ChatGPT account in the browser (use a separate browser profile or private window when needed); a fresh login to the same identity correctly replaces its tokens instead of creating a duplicate.

## Quota is stale

Use `Refresh all quotas` in `/codex-accounts` or call `codex_quota_refresh`. The upstream `/wham/usage` endpoint may update lazily around reset boundaries.

## Summary is not updating

Check `/codex-handoff-status`, verify the configured provider/model exists in that OpenCode instance, and use the popup's test action. If primary and fallback fail, deterministic goal/todo state remains available.

## Goal did not resume

Open `/codex-waiting`. Auto-resume requires a captured active goal, an existing idle session, a valid account, and confirmed available quota.

## Account removal remains queued

An active stream still owns a reservation. Removal completes after the stream ends or its stale lease expires.

## Recover from bad settings

Remove `settings.json` under `OPENCODE_CODEX_DATA_DIR` or the default data directory. Defaults are regenerated; accounts are unaffected.

## Recover from damaged account store

Do not hand-edit active tokens. Restore the `.v1.backup` or authenticate accounts again. Migration keeps the legacy file with a `.migrated` suffix.
