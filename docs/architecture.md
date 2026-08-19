# Architecture

## Runtime split

`dist/server.js` registra auth, hooks, tools e transporte. `dist/tui.js` registra comandos e dialogs. As duas entradas compartilham os mesmos schemas e stores, mas nunca são exportadas no mesmo módulo de plugin.

## State scopes

| State | Scope |
|---|---|
| Settings and account pool | Global |
| Quota cache | Account |
| Account binding | Session |
| Goal ledger | Session |
| Summary | Session |
| Summary queue and model circuits | Global with cross-process lease |
| Context epoch | Session |
| Resume job | Session with cross-process lease |

## Request path

```text
OpenCode -> provider fetch -> session binding -> account selector -> token refresh
         -> Codex endpoint -> outcome/quota -> stream reservation release
```

Selection is sticky while the bound account is healthy. Hard failures can fail over. A proactive handoff happens only at an idle boundary.

## Context epochs

Each handoff creates an epoch containing source/target account, cutoff message, summary revision and checkpoint. `experimental.chat.messages.transform` applies the cutoff on every later model call, so old messages cannot reappear on turn two after a handoff.

The original OpenCode transcript is untouched. The transform operates on cloned request messages.

## Summary path

```text
session.idle -> persistent priority queue -> global lease -> child session -> primary model
             -> optional fallback -> schema validation -> compare-and-swap commit
```

Concurrent idle events coalesce, and only one summary request runs across OpenCode processes that share the data directory. Routine jobs do not block the parent session. Quota and emergency callers wait only for a bounded interval; their jobs remain persisted if another session already owns the lease.

Each profile has a persistent circuit. A provider failure opens its circuit and defers the job; rate limits use a five-minute default cooldown and honor a longer `Retry-After`. A configured fallback gets one immediate attempt after an eligible primary failure. Later jobs skip blocked profiles instead of producing retry storms.

## Persistence

Writes use an in-process queue, `wx` cross-process lock, unique temporary file and atomic rename. Stores have independent lock keys to avoid global serialization.

## Scheduler

Waiting jobs are persistent. A runtime instance claims a due job with a lease. It verifies session, goal, auth and quota before sending a synthetic resume marker with explicit agent/model/variant.

## Account removal

The TUI disables the account and enqueues an action. The server waits for active reservations, creates handoffs for affected sessions, rebinds them, and only then removes credentials.
