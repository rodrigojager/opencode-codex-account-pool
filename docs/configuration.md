# Configuration

Most settings are managed through `/codex-handoff-config`. The canonical settings file is `settings.json` under the plugin data directory.

## Summarizer profiles

```json
{
  "summarizer": {
    "enabled": true,
    "primary": {
      "providerID": "opencode",
      "modelID": "free-model",
      "variant": "low"
    },
    "fallback": {
      "providerID": "omniroute",
      "modelID": "openai/gpt-5-mini",
      "variant": "medium"
    }
  }
}
```

Fallback is optional and sequential. `variant` is preferred over raw `reasoningEffort` because OpenCode translates variants to provider-specific thinking controls.

Advanced options are accepted in the schema for providers that do not publish variants, but can be rejected by an incompatible endpoint.

## Defaults

| Setting | Default |
|---|---:|
| Summary cadence | 4 turns |
| Delta budget | 8000 tokens |
| Summary budget | 3000 tokens |
| Summary timeout | 60000 ms |
| Primary proactive quota | 90% |
| Secondary proactive quota | 95% |
| Quota poll | 60000 ms |
| Resume spacing | 15000 ms |
| Scheduler lease | 60000 ms |

## Environment

| Variable | Purpose |
|---|---|
| `OPENCODE_CODEX_DATA_DIR` | Override all plugin state paths |
| `OPENCODE_CODEX_ACCOUNTS_PATH` | Legacy account store migration source/custom path |

## Provider name

`providerName` changes the display name only. Model IDs remain `openai/*`.
