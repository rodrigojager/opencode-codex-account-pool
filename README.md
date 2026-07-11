# OpenCode Codex Account Pool

Use multiple ChatGPT Plus/Pro accounts with OpenCode Codex, keep one account attached to each session, monitor quota, and carry your working context safely when the active account changes.

[English](#english) | [Português brasileiro](#portugues-brasileiro)

<a id="english"></a>

## English

### What this plugin is for

OpenCode Codex Account Pool adds multi-account ChatGPT OAuth management to OpenCode's `openai` provider. It is useful when you work with more than one of your own ChatGPT Plus/Pro accounts and want OpenCode to:

- Keep a different Codex account assigned to each OpenCode session.
- Preserve that assignment when you change agents inside the same session.
- Show quota usage and reset times without exposing credentials.
- Prefer the session's current account while it remains healthy.
- Move the session to another available account near a quota limit or after a recoverable failure.
- Prepare a compact handoff so the next account can continue with the relevant context.
- Wait for a quota reset and resume an active OpenCode goal automatically.

The account binding belongs to the **session**, not to the agent. Changing from one agent to another in the same session does not by itself change the selected Codex account. The binding applies to OpenAI/Codex requests; agents using another provider do not use the Codex account pool.

> Use this plugin only with accounts and subscriptions you are authorized to use. You are responsible for complying with OpenAI's terms and the terms of any provider selected for summaries.

### Main features

| Feature | What you get |
|---|---|
| Multiple ChatGPT accounts | Add and manage multiple Plus/Pro accounts through browser OAuth or device code. |
| Per-session account | Each OpenCode session can use its own account, independently of the selected agent. |
| Sticky selection | A healthy assigned account stays attached to the session instead of rotating on every request. |
| Default account | Choose which account should be preferred by sessions that do not have a binding yet. |
| Quota visibility | See primary and secondary usage, reset times, plan information, and account health. |
| Proactive handoff | At the end of a turn, the plugin can prepare another account before the current one reaches its configured threshold. |
| Failure recovery | Replayable requests can fail over after authentication errors, rate limits, server errors, or transport failures. |
| Compact context handoff | Goal, todos, decisions, files, verification results, and a structured summary are retained for continuity. |
| Hidden summarizer | A temporary hidden child agent creates the structured summary without writing into the main chat. |
| Context trimming after handoff | The full transcript remains visible in OpenCode, but old messages stop being resent to the model after a handoff. |
| Persistent quota waiting | If every account is exhausted, an active goal can wait on disk and resume after quota is confirmed available. |
| Multi-window safety | Atomic writes, locks, reservations, and leases coordinate state across OpenCode windows and processes. |
| Agent tools | Agents can inspect accounts, change the current binding, refresh quota, add durable notes, and request a handoff. |

### Requirements

- OpenCode `1.17.0` or newer.
- At least one ChatGPT account with Plus/Pro Codex access.
- Network access to ChatGPT OAuth, Codex, and quota endpoints.
- A configured OpenCode provider/model for the handoff summarizer if summaries are enabled.
- Bun only when building or developing this repository locally. Bun is not required for a normal published-package installation.

Remove or disable other plugins that take ownership of OpenAI/Codex authentication, especially `opencode-openai-codex-auth`. Two authentication plugins for the same provider can override each other depending on load order.

### Installation

#### Published package

After the package is published, install both the server and TUI targets globally:

```bash
opencode plugin opencode-codex-account-pool --global
```

You can also open OpenCode's plugin manager, press `shift+i`, enter `opencode-codex-account-pool`, and choose the global scope.

#### From this repository

```bash
bun install
bun run install:global
```

The local installer builds the project, creates backups with the `.codex-pool.backup` suffix, removes the conflicting `opencode-openai-codex-auth` registration, and adds:

- `dist/server.js` to the global `opencode.json`.
- `dist/tui.js` to the global `tui.json`.

Preview the changes without writing files:

```bash
bun run install:global:dry-run
```

After installation or any plugin registration change, quit **all** OpenCode processes and start OpenCode again. Plugins and configuration-time files are loaded at startup.

### Manual plugin registration

The server and TUI are separate plugin targets. If you register a local build manually, use absolute file URLs.

Global `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "file:///ABSOLUTE/PATH/opencode-codex-account-pool/dist/server.js"
  ]
}
```

Global `~/.config/opencode/tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": [
    "file:///ABSOLUTE/PATH/opencode-codex-account-pool/dist/tui.js"
  ]
}
```

On Windows, a valid file URL looks like `file:///C:/path/to/dist/server.js`.

### Quick start

1. Restart OpenCode after installing the plugin.
2. Run `/codex-accounts`.
3. Select `+ Add account`.
4. Choose `Browser OAuth` or `Headless / device code`.
5. Complete login using one of your own ChatGPT accounts.
6. Repeat the process for every account you want in the pool.
7. Open an OpenCode session, run `/codex-accounts`, select an account, and choose `Set active for current session` if you want a specific binding.
8. Run `/codex-handoff-config` if you want structured background summaries and configure the primary summarizer model.
9. Use `/codex-handoff-status` to confirm the account and summarizer state for the current session.

If browser login keeps updating an existing entry instead of adding a new one, the browser is signing in to the same ChatGPT identity. Use another browser profile or a private window and sign in to the other account.

### Visual interface

The TUI target adds four slash commands. The same screens are also available in the OpenCode command palette under the `Codex` category.

| Command | Purpose |
|---|---|
| `/codex-accounts` | Add accounts, choose session/default accounts, inspect quota, and manage credentials. |
| `/codex-handoff-config` | Configure and test the hidden handoff summarizer. |
| `/codex-handoff-status` | Show the current session's account, handoff epoch, and summary status. |
| `/codex-waiting` | List goals waiting for quota and optionally cancel automatic resume. |

#### Managing accounts with `/codex-accounts`

The first screen lists every account. A filled circle marks the account attached to the current session. Each row shows the label, identity, quota, blocked state, and whether the account is disabled.

`+ Add account`

Choose `Browser OAuth` for the recommended browser flow or `Headless / device code` when a local browser callback is not convenient. After login, you can assign a friendly label. Logging in again to the same ChatGPT identity updates its tokens instead of creating a duplicate.

`Refresh all quotas`

Requests fresh quota information for every enabled account.

Selecting an account opens these actions:

| Action | Behavior |
|---|---|
| `Set active for current session` | Attaches this account to the session currently open in the TUI. It is disabled when no session is open or the account is disabled. |
| `Set default for new sessions` | Makes this the preferred account for sessions that do not have an account binding yet. Existing session bindings are unchanged. |
| `Rename` | Changes only the local display label. |
| `Disable` / `Enable` | Removes or restores the account as a candidate for new Codex requests. Credentials remain stored until removal. |
| `Details` | Shows email, workspace, organization, plan, enabled state, attached session count, quota windows, token expiration, and health counters. |
| `Refresh quota` | Refreshes quota only for the selected account. |
| `Reauthenticate in browser` | Runs browser OAuth again. Make sure the browser signs in to the intended identity. |
| `Remove` | Disables the account and queues safe removal. Active requests are allowed to finish; affected idle sessions are reassigned when possible. |

Manual selection is sticky while the account remains enabled and healthy. It is not an instruction to keep using an exhausted or invalid account forever; automatic failover can still protect the session.

You may also add an account through OpenCode's normal authentication flow:

```text
opencode auth login
```

Select OpenAI and one of the `ChatGPT Plus/Pro - add account` methods registered by the plugin.

#### Configuring summaries with `/codex-handoff-config`

The wizard guides you through these steps:

1. Select the primary provider.
2. Select the primary model.
3. Select its reasoning variant, or use `Default`.
4. Choose whether to configure an optional fallback model.
5. Enter the summary cadence, input budget, output budget, timeout, and final-summary threshold.
6. Review and optionally test the primary and fallback profiles.
7. Optionally enter provider-specific advanced options as a JSON object.
8. Select `Save globally`.

Saving from this screen enables the summarizer and applies the settings to every OpenCode window that uses the same plugin data directory.

| Visual option | Default | Meaning |
|---|---:|---|
| Primary provider/model/variant | Not configured | Model used by the hidden summarizer. A primary profile is required for summaries to run. |
| Optional fallback | None | A second profile tried only after a configured category of primary failure. |
| `Update every N completed turns` | `4` | How often the incremental summary is refreshed. Minimum `1`. |
| `Maximum new input tokens per summary` | `8000` | Approximate maximum new context sent in one summary update. Minimum `500`. |
| `Maximum final summary tokens` | `3000` | Approximate size limit accepted for the structured summary. Minimum `250`. |
| `Summarizer timeout in milliseconds` | `60000` | Time allowed for a summary request. Minimum `1000`. |
| `Final summary quota threshold (%)` | `90` | Usage level at which the plugin makes sure a recent final summary exists before handoff. Range `1` to `100`. |
| Primary/fallback advanced options | `{}` | Optional provider-specific JSON merged into the hidden summary request. Use only options supported by that provider. |

The fallback is sequential, not parallel. It is used only if the primary request fails in one of the categories listed in `summarizer.fallbackOn`.

#### Reading `/codex-handoff-status`

The status screen shows:

- The account bound to the current session.
- The current handoff epoch and its state.
- Whether the summarizer is enabled.
- The current summary revision.
- The provider/model that generated the latest summary.

#### Managing `/codex-waiting`

This screen lists goals waiting for a Codex quota reset, with the session, state, expected resume time, and target account. Select a job to cancel its automatic resume. Canceling the job does not delete the OpenCode session or its transcript.

### How it works from the user's point of view

#### During normal work

When a session first sends a Codex request, the plugin uses its existing account binding. If there is no binding, it prefers the configured default account and otherwise chooses a healthy enabled account with available quota. That account remains attached to the session while it is usable.

Different sessions may use different accounts at the same time. Opening the same session in two windows represents the same work and therefore shares the same binding and handoff state.

#### Near a quota limit

At the end of a completed turn, the plugin can refresh quota and compare usage with the configured proactive thresholds. If another healthy account has sufficient room, the session is prepared to continue with that account.

The visible OpenCode transcript is not deleted. The plugin keeps a compact continuation state and stops resending older pre-handoff messages to the model. This reduces repeated context while preserving the original transcript for you.

#### The hidden summarizer

If enabled, the plugin periodically starts a temporary child session using the provider/model you selected. The hidden agent receives a bounded, redacted version of the previous summary and recent work, produces validated structured JSON, and is then deleted.

It does not write into the parent chat and has no file-editing, shell, task, or web tools. The hidden agent creates the summary; account switching, checkpoints, and context handoff are plugin responsibilities rather than autonomous agent actions.

#### Unexpected account failure

For replayable requests, authentication failures, rate limits, server errors, and transport failures may trigger another available account. A partially delivered stream is not automatically replayed, protecting you from duplicated model output or duplicated work.

#### When every account is exhausted

If the session has an active goal captured by OpenCode's goal tools, the plugin can save a waiting job instead of keeping an HTTP request open. At the expected reset time it rechecks credentials and quota. If the session and goal still exist and the goal is still active, it resumes the same session with the recorded agent, model, and variant.

Waiting jobs survive OpenCode restarts. `/codex-waiting` lets you inspect or cancel them.

### Configuration files

There are two separate configuration layers:

| Layer | File | Purpose |
|---|---|---|
| Plugin registration | `~/.config/opencode/opencode.json` and `tui.json` | Loads the server and visual interface targets. Changes require an OpenCode restart. |
| Runtime settings | `<data directory>/settings.json` | Controls summaries, rotation, quota polling, notifications, and automatic resume. |

The default plugin data directory is:

```text
~/.local/share/opencode/codex-account-pool/
```

If `XDG_DATA_HOME` is set, the directory is `$XDG_DATA_HOME/opencode/codex-account-pool`. Override it entirely with `OPENCODE_CODEX_DATA_DIR`.

| Environment variable | Purpose |
|---|---|
| `OPENCODE_CODEX_DATA_DIR` | Moves the complete plugin data directory, including settings, accounts, bindings, summaries, and scheduler jobs. |
| `XDG_DATA_HOME` | Changes the base data directory when `OPENCODE_CODEX_DATA_DIR` is not set. |
| `OPENCODE_CODEX_ACCOUNTS_PATH` | Points to a legacy version-1 account file to import. It does not replace the current `accounts.json` path. |

The TUI is the recommended way to manage accounts and summary profiles. For options that are not exposed visually, edit `settings.json` while all OpenCode processes are closed, keep `version` set to `1`, and make valid JSON. Invalid values prevent the plugin from reading the settings file.

Do not manually edit `accounts.json`; it contains OAuth credentials and is managed by the plugin.

#### Complete `settings.json` example

```json
{
  "version": 1,
  "revision": 0,
  "providerName": "Codex Account Pool",
  "notifyActiveAccount": true,
  "summarizer": {
    "enabled": true,
    "primary": {
      "providerID": "opencode",
      "modelID": "your-summary-model",
      "variant": "low",
      "advancedOptions": {}
    },
    "fallback": {
      "providerID": "another-provider",
      "modelID": "another-summary-model",
      "variant": "medium"
    },
    "everyTurns": 4,
    "maxDeltaTokens": 8000,
    "maxSummaryTokens": 3000,
    "timeoutMs": 60000,
    "finalSummaryThreshold": 90,
    "retainLastTurns": 1,
    "fallbackOn": [
      "provider_unavailable",
      "model_not_found",
      "auth",
      "rate_limit",
      "timeout",
      "server_error",
      "invalid_output"
    ]
  },
  "rotation": {
    "strategy": "sticky",
    "proactivePrimaryPercent": 90,
    "proactiveSecondaryPercent": 95,
    "rateLimitCooldownMs": 30000,
    "authFailureCooldownMs": 300000,
    "maxAttempts": 10
  },
  "quota": {
    "pollIntervalMs": 60000,
    "staleAfterMs": 120000
  },
  "scheduler": {
    "autoResumeGoals": true,
    "resumeJitterMs": 5000,
    "resumeSpacingMs": 15000,
    "maxConcurrentResumesPerAccount": 1,
    "leaseMs": 60000
  }
}
```

Replace the example provider and model IDs with IDs that exist in your OpenCode installation. Remove `fallback` if you do not want one. Remove `variant` and `advancedOptions` when the provider does not need them.

#### Runtime settings reference

| JSON field | Default | Visual UI | Description |
|---|---:|---|---|
| `version` | `1` | No | Settings format version. Keep it at `1`. |
| `revision` | `0` initially | Automatic | Increased when the TUI saves settings. Use a non-negative integer. |
| `providerName` | `Codex Account Pool` | No | Display name for the OpenAI provider. Model IDs remain `openai/*`. |
| `notifyActiveAccount` | `true` | No | Shows a toast when a session starts using a different Codex account. |
| `summarizer.enabled` | `false` | Save enables it | Enables background structured summaries. A primary profile is also required. |
| `summarizer.primary` | None | Yes | Primary summary profile: `providerID`, `modelID`, optional `variant`, optional `advancedOptions`. |
| `summarizer.fallback` | None | Yes | Optional profile used after selected primary failure categories. |
| `summarizer.everyTurns` | `4` | Yes | Number of completed turns between incremental updates. Minimum `1`. |
| `summarizer.maxDeltaTokens` | `8000` | Yes | Approximate maximum new summary input. Minimum `500`. |
| `summarizer.maxSummaryTokens` | `3000` | Yes | Approximate maximum accepted summary size. Minimum `250`. |
| `summarizer.timeoutMs` | `60000` | Yes | Summary request timeout in milliseconds. Minimum `1000`. |
| `summarizer.finalSummaryThreshold` | `90` | Yes | Quota percentage that triggers a final refresh before handoff. Range `1` to `100`. |
| `summarizer.retainLastTurns` | `1` | No | Number of recent pre-handoff turns retained with the compact handoff. Range `0` to `10`. |
| `summarizer.fallbackOn` | All supported categories | No | Failure categories that are allowed to invoke the fallback profile. |
| `rotation.strategy` | `sticky` | No | Account selection strategy. `sticky` is currently the only valid value. |
| `rotation.proactivePrimaryPercent` | `90` | No | Primary quota usage that can trigger a proactive account handoff. Range `1` to `100`. |
| `rotation.proactiveSecondaryPercent` | `95` | No | Secondary quota usage that can trigger a proactive account handoff. Range `1` to `100`. |
| `rotation.rateLimitCooldownMs` | `30000` | No | Temporary cooldown after a rate-limit response. Minimum `1000`. A server `Retry-After` value can override it. |
| `rotation.authFailureCooldownMs` | `300000` | No | Temporary cooldown after authentication, transport, or similar failures. Minimum `1000`. |
| `rotation.maxAttempts` | `10` | No | Maximum accounts attempted for one replayable request. Minimum `1` and still limited by available accounts. |
| `quota.pollIntervalMs` | `60000` | No | Minimum interval used when deciding whether quota should be refreshed after successful traffic. Minimum `5000`. |
| `quota.staleAfterMs` | `120000` | No | Reserved stale-quota threshold for configuration compatibility. It is not currently a separate TUI refresh trigger. Minimum `5000`. |
| `scheduler.autoResumeGoals` | `true` | No | Enables persistent automatic resume for active goals waiting on quota. |
| `scheduler.resumeJitterMs` | `5000` | No | Random delay before a due resume, reducing simultaneous requests. Minimum `0`. |
| `scheduler.resumeSpacingMs` | `15000` | No | Spacing after a resume attempt. Minimum `0`. |
| `scheduler.maxConcurrentResumesPerAccount` | `1` | No | Maximum simultaneous resume jobs assigned to one account. Minimum `1`. |
| `scheduler.leaseMs` | `60000` | No | Cross-process ownership lease for a resume job. Minimum `10000`. |

Supported `summarizer.fallbackOn` values:

| Value | Failure type |
|---|---|
| `provider_unavailable` | The selected provider cannot serve the request. |
| `model_not_found` | The configured model is unavailable or does not exist. |
| `auth` | Authentication or authorization failed. |
| `rate_limit` | The summary provider returned a rate limit. |
| `timeout` | The summary request exceeded its timeout. |
| `server_error` | The provider returned another server-side failure. |
| `invalid_output` | The model response was not valid structured summary JSON. |

### Advanced server registration options

The server target accepts optional plugin-level options. Most users should keep the defaults.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    [
      "opencode-codex-account-pool/server",
      {
        "providerName": "Codex Account Pool",
        "quiet": false,
        "issuer": "https://auth.openai.com",
        "codexApiEndpoint": "https://chatgpt.com/backend-api/codex/responses"
      }
    ]
  ]
}
```

| Option | Purpose |
|---|---|
| `providerName` | Initial provider display name when no runtime settings revision has been saved. Prefer `settings.json` for later changes. |
| `quiet` | Suppresses account and handoff toast notifications emitted by the server target. |
| `issuer` | Overrides the OAuth issuer. Intended for development or controlled testing. |
| `codexApiEndpoint` | Overrides the Codex responses endpoint. Intended for development or controlled testing. |
| `storePath` | Overrides only the account credential store path. Prefer `OPENCODE_CODEX_DATA_DIR` when you want to relocate all plugin data. |

When using a local build, replace the package spec in the tuple with the `file:///.../dist/server.js` URL. Restart OpenCode after changing plugin-level options.

### Agent tools

The server exposes these tools to agents, subject to the active agent's permissions:

| Tool | Purpose |
|---|---|
| `codex_account_current` | Show the account attached to the current session. |
| `codex_accounts_list` | List accounts, status, and quota without credentials. |
| `codex_accounts_set_active` | Attach an enabled account to the current session. |
| `codex_accounts_set_default` | Set the preferred account for unbound sessions. |
| `codex_accounts_enable` | Enable or disable an account. |
| `codex_accounts_rename` | Change an account's local label. |
| `codex_accounts_remove` | Queue safe account removal after confirmation. |
| `codex_quota_refresh` | Refresh quota for all enabled accounts. |
| `codex_handoff_note` | Store a durable decision, constraint, blocker, or reference for future handoffs. |
| `codex_handoff_status` | Inspect the binding, structured summary, and handoff epoch for the session. |
| `codex_handoff_now` | Prepare a handoff to the best available alternative account. |

### Data and privacy

- OAuth credentials remain in the local `accounts.json` file.
- Credentials are never returned by TUI screens or agent tools.
- Settings and summaries do not contain account tokens.
- Common bearer tokens, API keys, and token fields are redacted from summarizer input.
- Binary attachments and model reasoning metadata are not sent to the summarizer.
- Recent message text and bounded tool outputs may be sent to the summary provider you select.
- The summary provider's privacy policy applies to that summarized context.
- A free model is not necessarily a private model; cost and privacy are separate choices.
- Credential files use mode `0600` on POSIX systems. On Windows, protect access through your operating-system account and filesystem permissions.
- The original OpenCode transcript remains in OpenCode after a handoff.

### Limitations and behavior to expect

- This plugin manages ChatGPT OAuth accounts for OpenAI/Codex. It does not pool arbitrary API keys or accounts from unrelated providers.
- A session binding is sticky but can change when the account is disabled, exhausted, removed, or fails in a recoverable way.
- Proactive handoff happens at an idle turn boundary, not in the middle of a generated response.
- Partially delivered streams are never replayed automatically.
- Automatic resume requires an active goal captured through the OpenCode goal tools, an existing session, a valid enabled account, and confirmed quota.
- The configured summary provider receives redacted work context. Disable summaries if this is not acceptable for your workflow.
- Concurrent sessions may still edit the same working tree. Use Git worktrees when code-level isolation is required.

### Troubleshooting

#### The plugin does not load

For a local checkout, run `bun run build` and confirm that `dist/server.js` and `dist/tui.js` exist. Verify that each file is registered in the correct config, then restart every OpenCode process.

#### Browser login reports that another login is running

Complete or cancel the current login. A stale login lock is reclaimed after its timeout.

#### Browser login cannot use port 1455

Restart OpenCode first. The plugin can fall back to registered port `1457`. If both ports belong to unrelated processes, close those listeners or use device-code login.

#### A new login updates an existing account

The pool deduplicates accounts by ChatGPT identity/workspace. Sign in to a different identity using another browser profile or a private window.

#### Quota looks stale

Use `Refresh all quotas` in `/codex-accounts` or ask an agent to call `codex_quota_refresh`. The upstream quota endpoint can update slowly around reset boundaries.

#### The summary is not updating

Open `/codex-handoff-status`, verify the configured provider and model still exist, then use `Test primary` or `Test fallback` in `/codex-handoff-config`.

#### A goal did not resume

Open `/codex-waiting`. Resume requires a captured active goal, an existing session, an enabled account, and available quota. Selecting a waiting job lets you cancel it if necessary.

#### Account removal stays queued

An active request still owns a reservation. Removal continues after the request ends or its stale lease expires.

#### Recover from invalid settings

Close OpenCode and fix or remove `<data directory>/settings.json`. Defaults are regenerated when the file is absent; accounts are not removed.

### Development

```bash
bun install
bun run typecheck
bun test
bun run build
npm pack --dry-run
```

The package exposes separate `server` and `tui` targets and requires both for the complete experience.

---

<a id="portugues-brasileiro"></a>

## Português brasileiro

### Para que serve este plugin

O OpenCode Codex Account Pool adiciona gerenciamento de múltiplas contas ChatGPT via OAuth ao provider `openai` do OpenCode. Ele é útil quando você trabalha com mais de uma conta ChatGPT Plus/Pro própria e quer que o OpenCode:

- Mantenha uma conta Codex diferente vinculada a cada sessão do OpenCode.
- Preserve esse vínculo quando você troca de agente dentro da mesma sessão.
- Mostre o consumo de quota e os horários de reset sem expor credenciais.
- Continue usando a conta atual da sessão enquanto ela estiver saudável.
- Mova a sessão para outra conta disponível quando a quota estiver próxima do limite ou ocorrer uma falha recuperável.
- Prepare um handoff compacto para a próxima conta continuar com o contexto relevante.
- Aguarde o reset de quota e retome automaticamente um goal ativo do OpenCode.

O vínculo da conta pertence à **sessão**, não ao agente. Trocar de agente dentro da mesma sessão não altera sozinho a conta Codex selecionada. O vínculo vale para requisições OpenAI/Codex; agentes que usam outro provider não utilizam a pool de contas Codex.

> Use este plugin apenas com contas e assinaturas que você tem autorização para usar. Você é responsável por cumprir os termos da OpenAI e os termos de qualquer provider escolhido para gerar summaries.

### Principais funcionalidades

| Funcionalidade | O que ela oferece |
|---|---|
| Múltiplas contas ChatGPT | Adicione e gerencie várias contas Plus/Pro por OAuth no navegador ou device code. |
| Conta por sessão | Cada sessão do OpenCode pode usar sua própria conta, independentemente do agente selecionado. |
| Seleção sticky | Uma conta saudável permanece ligada à sessão, em vez de trocar a cada requisição. |
| Conta padrão | Escolha qual conta deve ser preferida por sessões que ainda não possuem vínculo. |
| Visualização de quota | Consulte consumo primário e secundário, resets, plano e saúde da conta. |
| Handoff preventivo | No fim de um turno, o plugin pode preparar outra conta antes de a atual atingir o limite configurado. |
| Recuperação de falhas | Requisições que podem ser repetidas aceitam failover após erros de autenticação, rate limit, servidor ou transporte. |
| Handoff compacto de contexto | Goal, todos, decisões, arquivos, verificações e summary estruturado são preservados para continuidade. |
| Summarizer invisível | Um agente filho temporário e oculto produz o summary sem escrever no chat principal. |
| Redução de contexto após handoff | O transcript completo continua visível no OpenCode, mas mensagens antigas deixam de ser reenviadas ao modelo. |
| Espera persistente por quota | Se todas as contas esgotarem, um goal ativo pode aguardar em disco e ser retomado quando houver quota. |
| Segurança entre janelas | Escritas atômicas, locks, reservas e leases coordenam o estado entre janelas e processos. |
| Ferramentas para agentes | Agentes podem consultar contas, trocar o vínculo atual, atualizar quota, salvar notas e solicitar handoff. |

### Requisitos

- OpenCode `1.17.0` ou mais recente.
- Pelo menos uma conta ChatGPT com Plus/Pro e acesso ao Codex.
- Acesso de rede aos endpoints de OAuth, Codex e quota do ChatGPT.
- Um provider/model configurado no OpenCode para o summarizer de handoff, caso summaries sejam habilitados.
- Bun apenas para compilar ou desenvolver este repositório localmente. Bun não é necessário em uma instalação normal do pacote publicado.

Remova ou desabilite outros plugins que assumam a autenticação OpenAI/Codex, principalmente `opencode-openai-codex-auth`. Dois plugins de autenticação para o mesmo provider podem sobrescrever um ao outro dependendo da ordem de carregamento.

### Instalação

#### Pacote publicado

Depois que o pacote estiver publicado, instale globalmente os targets de servidor e TUI:

```bash
opencode plugin opencode-codex-account-pool --global
```

Também é possível abrir o gerenciador de plugins do OpenCode, pressionar `shift+i`, informar `opencode-codex-account-pool` e escolher o escopo global.

#### A partir deste repositório

```bash
bun install
bun run install:global
```

O instalador local compila o projeto, cria backups com o sufixo `.codex-pool.backup`, remove o registro conflitante de `opencode-openai-codex-auth` e adiciona:

- `dist/server.js` ao `opencode.json` global.
- `dist/tui.js` ao `tui.json` global.

Para visualizar as mudanças sem gravar arquivos:

```bash
bun run install:global:dry-run
```

Depois de instalar ou alterar o registro do plugin, feche **todos** os processos do OpenCode e abra novamente. Plugins e arquivos de configuração de inicialização são carregados durante a abertura.

### Registro manual do plugin

O servidor e a TUI são targets separados. Ao registrar uma compilação local manualmente, use URLs de arquivo absolutas.

Arquivo global `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "file:///CAMINHO/ABSOLUTO/opencode-codex-account-pool/dist/server.js"
  ]
}
```

Arquivo global `~/.config/opencode/tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": [
    "file:///CAMINHO/ABSOLUTO/opencode-codex-account-pool/dist/tui.js"
  ]
}
```

No Windows, uma URL válida se parece com `file:///C:/caminho/para/dist/server.js`.

### Início rápido

1. Reinicie o OpenCode depois da instalação.
2. Execute `/codex-accounts`.
3. Selecione `+ Add account`.
4. Escolha `Browser OAuth` ou `Headless / device code`.
5. Conclua o login usando uma de suas contas ChatGPT.
6. Repita o processo para cada conta que deseja adicionar à pool.
7. Abra uma sessão do OpenCode, execute `/codex-accounts`, selecione uma conta e escolha `Set active for current session` se quiser um vínculo específico.
8. Execute `/codex-handoff-config` se quiser summaries estruturados em background e configure o modelo primary.
9. Use `/codex-handoff-status` para confirmar a conta e o estado do summarizer na sessão atual.

Se o login no navegador continuar atualizando uma entrada existente em vez de adicionar outra, o navegador está entrando na mesma identidade ChatGPT. Use outro perfil ou uma janela privada e faça login na outra conta.

### Interface visual

O target da TUI adiciona quatro slash commands. As mesmas telas também aparecem na paleta de comandos do OpenCode, dentro da categoria `Codex`.

| Comando | Finalidade |
|---|---|
| `/codex-accounts` | Adicionar contas, escolher contas da sessão/padrão, consultar quota e gerenciar credenciais. |
| `/codex-handoff-config` | Configurar e testar o summarizer invisível de handoff. |
| `/codex-handoff-status` | Mostrar conta, epoch de handoff e estado do summary da sessão atual. |
| `/codex-waiting` | Listar goals aguardando quota e, se necessário, cancelar a retomada automática. |

#### Gerenciando contas com `/codex-accounts`

A primeira tela lista todas as contas. Um círculo preenchido marca a conta vinculada à sessão atual. Cada linha mostra label, identidade, quota, bloqueio e se a conta está desabilitada.

`+ Add account`

Escolha `Browser OAuth` para o fluxo recomendado no navegador ou `Headless / device code` quando um callback local no navegador não for conveniente. Depois do login, você pode definir um label amigável. Entrar novamente na mesma identidade ChatGPT atualiza os tokens em vez de criar uma duplicata.

`Refresh all quotas`

Solicita informações atualizadas de quota para todas as contas habilitadas.

Selecionar uma conta abre estas ações:

| Ação | Comportamento |
|---|---|
| `Set active for current session` | Vincula a conta à sessão atualmente aberta na TUI. Fica indisponível quando nenhuma sessão está aberta ou a conta está desabilitada. |
| `Set default for new sessions` | Torna esta a conta preferida para sessões que ainda não possuem vínculo. Sessões já vinculadas não são alteradas. |
| `Rename` | Altera apenas o label local exibido. |
| `Disable` / `Enable` | Remove ou devolve a conta ao conjunto de candidatas para novas requisições Codex. As credenciais permanecem armazenadas até a remoção. |
| `Details` | Exibe email, workspace, organização, plano, estado, quantidade de sessões, janelas de quota, expiração do token e contadores de saúde. |
| `Refresh quota` | Atualiza somente a quota da conta selecionada. |
| `Reauthenticate in browser` | Executa o OAuth no navegador novamente. Confirme que o navegador entrou na identidade desejada. |
| `Remove` | Desabilita a conta e agenda uma remoção segura. Requisições ativas podem terminar; sessões idle afetadas são reatribuídas quando possível. |

A seleção manual permanece sticky enquanto a conta estiver habilitada e saudável. Isso não obriga o uso eterno de uma conta esgotada ou inválida; o failover automático ainda pode proteger a sessão.

Também é possível adicionar uma conta pelo fluxo normal de autenticação do OpenCode:

```text
opencode auth login
```

Selecione OpenAI e um dos métodos `ChatGPT Plus/Pro - adicionar conta` registrados pelo plugin.

#### Configurando summaries com `/codex-handoff-config`

O assistente conduz pelas seguintes etapas:

1. Selecione o provider primary.
2. Selecione o modelo primary.
3. Selecione a variant de raciocínio ou use `Default`.
4. Escolha se deseja configurar um modelo fallback opcional.
5. Informe frequência, orçamento de entrada, orçamento de saída, timeout e threshold de summary final.
6. Revise e, opcionalmente, teste os perfis primary e fallback.
7. Opcionalmente, informe opções avançadas específicas do provider como um objeto JSON.
8. Selecione `Save globally`.

Salvar por essa tela habilita o summarizer e aplica as configurações a todas as janelas do OpenCode que usam o mesmo diretório de dados do plugin.

| Opção visual | Padrão | Significado |
|---|---:|---|
| Provider/model/variant primary | Não configurado | Modelo usado pelo summarizer invisível. Um perfil primary é obrigatório para gerar summaries. |
| Fallback opcional | Nenhum | Segundo perfil tentado somente após uma categoria configurada de falha do primary. |
| `Update every N completed turns` | `4` | Frequência de atualização do summary incremental. Mínimo `1`. |
| `Maximum new input tokens per summary` | `8000` | Máximo aproximado de contexto novo enviado em uma atualização. Mínimo `500`. |
| `Maximum final summary tokens` | `3000` | Limite aproximado aceito para o summary estruturado. Mínimo `250`. |
| `Summarizer timeout in milliseconds` | `60000` | Tempo permitido para uma requisição de summary. Mínimo `1000`. |
| `Final summary quota threshold (%)` | `90` | Nível de uso em que o plugin garante um summary final recente antes do handoff. Intervalo de `1` a `100`. |
| Opções avançadas primary/fallback | `{}` | JSON opcional incorporado à requisição interna. Use apenas opções aceitas pelo provider escolhido. |

O fallback é sequencial, não paralelo. Ele só é usado quando o primary falha em uma das categorias presentes em `summarizer.fallbackOn`.

#### Entendendo `/codex-handoff-status`

A tela de status mostra:

- A conta vinculada à sessão atual.
- O epoch atual de handoff e seu estado.
- Se o summarizer está habilitado.
- A revisão atual do summary.
- O provider/model que gerou o summary mais recente.

#### Gerenciando `/codex-waiting`

Essa tela lista goals aguardando reset da quota Codex, com sessão, estado, horário previsto e conta de destino. Selecione um job para cancelar sua retomada automática. Cancelar o job não apaga a sessão nem o transcript do OpenCode.

### Como funciona do ponto de vista do usuário

#### Durante o trabalho normal

Quando uma sessão envia sua primeira requisição Codex, o plugin usa o vínculo de conta existente. Se ainda não houver vínculo, ele prefere a conta padrão configurada e, caso necessário, escolhe uma conta habilitada, saudável e com quota. Essa conta permanece ligada à sessão enquanto puder ser usada.

Sessões diferentes podem usar contas diferentes ao mesmo tempo. Abrir a mesma sessão em duas janelas representa o mesmo trabalho e, portanto, compartilha vínculo e estado de handoff.

#### Perto do limite de quota

No fim de um turno concluído, o plugin pode atualizar a quota e comparar o uso com os thresholds preventivos configurados. Se outra conta saudável tiver espaço suficiente, a sessão é preparada para continuar com ela.

O transcript visível no OpenCode não é apagado. O plugin mantém um estado compacto de continuidade e deixa de reenviar ao modelo mensagens antigas anteriores ao handoff. Isso reduz contexto repetido sem remover seu histórico original.

#### O summarizer invisível

Quando habilitado, o plugin inicia periodicamente uma sessão filha temporária usando o provider/model escolhido. O agente oculto recebe uma versão limitada e redigida do summary anterior e do trabalho recente, produz um JSON estruturado validado e depois é apagado.

Ele não escreve no chat principal e não possui ferramentas de edição, shell, task ou web. O agente oculto cria o summary; troca de contas, checkpoints e aplicação do handoff são responsabilidades do plugin, não ações autônomas do agente.

#### Falha inesperada de uma conta

Em requisições que podem ser repetidas, falhas de autenticação, rate limits, erros de servidor e falhas de transporte podem acionar outra conta disponível. Um stream entregue parcialmente nunca é repetido automaticamente, evitando saída ou trabalho duplicado.

#### Quando todas as contas estão esgotadas

Se a sessão tiver um goal ativo capturado pelas ferramentas de goal do OpenCode, o plugin pode salvar um job de espera em vez de manter uma requisição HTTP aberta. No horário esperado de reset, ele valida novamente credenciais e quota. Se a sessão e o goal ainda existirem e o goal continuar ativo, ele retoma a mesma sessão com agente, modelo e variant registrados.

Os jobs de espera sobrevivem a reinicializações do OpenCode. `/codex-waiting` permite inspecioná-los ou cancelá-los.

### Arquivos de configuração

Existem duas camadas separadas de configuração:

| Camada | Arquivo | Finalidade |
|---|---|---|
| Registro do plugin | `~/.config/opencode/opencode.json` e `tui.json` | Carrega os targets de servidor e interface visual. Mudanças exigem reiniciar o OpenCode. |
| Configurações de execução | `<diretório de dados>/settings.json` | Controla summaries, rotação, consulta de quota, notificações e retomada automática. |

O diretório padrão de dados do plugin é:

```text
~/.local/share/opencode/codex-account-pool/
```

Se `XDG_DATA_HOME` estiver definido, o diretório será `$XDG_DATA_HOME/opencode/codex-account-pool`. Para alterar tudo, use `OPENCODE_CODEX_DATA_DIR`.

| Variável de ambiente | Finalidade |
|---|---|
| `OPENCODE_CODEX_DATA_DIR` | Move todo o diretório de dados, incluindo configurações, contas, vínculos, summaries e jobs do scheduler. |
| `XDG_DATA_HOME` | Altera o diretório base quando `OPENCODE_CODEX_DATA_DIR` não está definido. |
| `OPENCODE_CODEX_ACCOUNTS_PATH` | Aponta para um arquivo legado de contas na versão 1 que deve ser importado. Não substitui o caminho atual de `accounts.json`. |

A TUI é a forma recomendada de gerenciar contas e perfis de summary. Para opções que não aparecem na interface, edite `settings.json` com todos os processos do OpenCode fechados, mantenha `version` como `1` e use JSON válido. Valores inválidos impedem o plugin de ler o arquivo.

Não edite `accounts.json` manualmente; ele contém credenciais OAuth e é gerenciado pelo plugin.

#### Exemplo completo de `settings.json`

```json
{
  "version": 1,
  "revision": 0,
  "providerName": "Codex Account Pool",
  "notifyActiveAccount": true,
  "summarizer": {
    "enabled": true,
    "primary": {
      "providerID": "opencode",
      "modelID": "seu-modelo-de-summary",
      "variant": "low",
      "advancedOptions": {}
    },
    "fallback": {
      "providerID": "outro-provider",
      "modelID": "outro-modelo-de-summary",
      "variant": "medium"
    },
    "everyTurns": 4,
    "maxDeltaTokens": 8000,
    "maxSummaryTokens": 3000,
    "timeoutMs": 60000,
    "finalSummaryThreshold": 90,
    "retainLastTurns": 1,
    "fallbackOn": [
      "provider_unavailable",
      "model_not_found",
      "auth",
      "rate_limit",
      "timeout",
      "server_error",
      "invalid_output"
    ]
  },
  "rotation": {
    "strategy": "sticky",
    "proactivePrimaryPercent": 90,
    "proactiveSecondaryPercent": 95,
    "rateLimitCooldownMs": 30000,
    "authFailureCooldownMs": 300000,
    "maxAttempts": 10
  },
  "quota": {
    "pollIntervalMs": 60000,
    "staleAfterMs": 120000
  },
  "scheduler": {
    "autoResumeGoals": true,
    "resumeJitterMs": 5000,
    "resumeSpacingMs": 15000,
    "maxConcurrentResumesPerAccount": 1,
    "leaseMs": 60000
  }
}
```

Substitua os IDs de provider e modelo do exemplo por IDs existentes na sua instalação do OpenCode. Remova `fallback` se não quiser um. Remova `variant` e `advancedOptions` quando o provider não precisar deles.

#### Referência das configurações de execução

| Campo JSON | Padrão | Interface visual | Descrição |
|---|---:|---|---|
| `version` | `1` | Não | Versão do formato de configurações. Mantenha em `1`. |
| `revision` | `0` inicialmente | Automático | Incrementado quando a TUI salva as configurações. Use um inteiro não negativo. |
| `providerName` | `Codex Account Pool` | Não | Nome exibido para o provider OpenAI. Os IDs de modelo continuam como `openai/*`. |
| `notifyActiveAccount` | `true` | Não | Mostra um toast quando uma sessão começa a usar outra conta Codex. |
| `summarizer.enabled` | `false` | Salvar habilita | Habilita summaries estruturados em background. Um perfil primary também é obrigatório. |
| `summarizer.primary` | Nenhum | Sim | Perfil primary: `providerID`, `modelID`, `variant` opcional e `advancedOptions` opcional. |
| `summarizer.fallback` | Nenhum | Sim | Perfil opcional usado após categorias selecionadas de falha do primary. |
| `summarizer.everyTurns` | `4` | Sim | Quantidade de turnos concluídos entre atualizações incrementais. Mínimo `1`. |
| `summarizer.maxDeltaTokens` | `8000` | Sim | Máximo aproximado de entrada nova para o summary. Mínimo `500`. |
| `summarizer.maxSummaryTokens` | `3000` | Sim | Tamanho máximo aproximado aceito para o summary. Mínimo `250`. |
| `summarizer.timeoutMs` | `60000` | Sim | Timeout da requisição de summary em milissegundos. Mínimo `1000`. |
| `summarizer.finalSummaryThreshold` | `90` | Sim | Percentual de quota que dispara uma atualização final antes do handoff. Intervalo de `1` a `100`. |
| `summarizer.retainLastTurns` | `1` | Não | Número de turnos recentes anteriores ao handoff mantidos com o estado compacto. Intervalo de `0` a `10`. |
| `summarizer.fallbackOn` | Todas as categorias aceitas | Não | Categorias de falha autorizadas a acionar o perfil fallback. |
| `rotation.strategy` | `sticky` | Não | Estratégia de seleção. `sticky` é atualmente o único valor válido. |
| `rotation.proactivePrimaryPercent` | `90` | Não | Uso da quota primária que pode iniciar um handoff preventivo. Intervalo de `1` a `100`. |
| `rotation.proactiveSecondaryPercent` | `95` | Não | Uso da quota secundária que pode iniciar um handoff preventivo. Intervalo de `1` a `100`. |
| `rotation.rateLimitCooldownMs` | `30000` | Não | Cooldown temporário depois de rate limit. Mínimo `1000`. Um `Retry-After` do servidor pode substituí-lo. |
| `rotation.authFailureCooldownMs` | `300000` | Não | Cooldown após falhas de autenticação, transporte ou semelhantes. Mínimo `1000`. |
| `rotation.maxAttempts` | `10` | Não | Máximo de contas tentadas em uma requisição repetível. Mínimo `1` e ainda limitado pelas contas disponíveis. |
| `quota.pollIntervalMs` | `60000` | Não | Intervalo mínimo usado para decidir uma atualização de quota após tráfego bem-sucedido. Mínimo `5000`. |
| `quota.staleAfterMs` | `120000` | Não | Threshold reservado de quota desatualizada para compatibilidade de configuração. Atualmente não dispara uma atualização separada na TUI. Mínimo `5000`. |
| `scheduler.autoResumeGoals` | `true` | Não | Habilita a retomada automática e persistente de goals aguardando quota. |
| `scheduler.resumeJitterMs` | `5000` | Não | Atraso aleatório antes de uma retomada, reduzindo requisições simultâneas. Mínimo `0`. |
| `scheduler.resumeSpacingMs` | `15000` | Não | Espaçamento depois de uma tentativa de retomada. Mínimo `0`. |
| `scheduler.maxConcurrentResumesPerAccount` | `1` | Não | Máximo de jobs de retomada simultâneos por conta. Mínimo `1`. |
| `scheduler.leaseMs` | `60000` | Não | Lease de propriedade entre processos para um job. Mínimo `10000`. |

Valores aceitos em `summarizer.fallbackOn`:

| Valor | Tipo de falha |
|---|---|
| `provider_unavailable` | O provider selecionado não consegue atender à requisição. |
| `model_not_found` | O modelo configurado não está disponível ou não existe. |
| `auth` | Falha de autenticação ou autorização. |
| `rate_limit` | O provider do summary retornou rate limit. |
| `timeout` | A requisição excedeu seu timeout. |
| `server_error` | O provider retornou outra falha de servidor. |
| `invalid_output` | A resposta não era um JSON válido de summary estruturado. |

### Opções avançadas de registro do servidor

O target de servidor aceita opções adicionais no registro do plugin. A maioria dos usuários deve manter os valores padrão.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    [
      "opencode-codex-account-pool/server",
      {
        "providerName": "Codex Account Pool",
        "quiet": false,
        "issuer": "https://auth.openai.com",
        "codexApiEndpoint": "https://chatgpt.com/backend-api/codex/responses"
      }
    ]
  ]
}
```

| Opção | Finalidade |
|---|---|
| `providerName` | Nome inicial exibido quando nenhuma revisão das configurações de execução foi salva. Para mudanças posteriores, prefira `settings.json`. |
| `quiet` | Oculta notificações toast de conta e handoff emitidas pelo target de servidor. |
| `issuer` | Substitui o emissor OAuth. Destinado a desenvolvimento ou testes controlados. |
| `codexApiEndpoint` | Substitui o endpoint de responses do Codex. Destinado a desenvolvimento ou testes controlados. |
| `storePath` | Altera somente o caminho do arquivo de credenciais. Prefira `OPENCODE_CODEX_DATA_DIR` para mover todos os dados do plugin. |

Ao usar uma compilação local, substitua o pacote na tupla pela URL `file:///.../dist/server.js`. Reinicie o OpenCode depois de alterar opções de registro.

### Ferramentas dos agentes

O servidor expõe estas ferramentas aos agentes, respeitando as permissões do agente ativo:

| Ferramenta | Finalidade |
|---|---|
| `codex_account_current` | Mostrar a conta vinculada à sessão atual. |
| `codex_accounts_list` | Listar contas, estado e quota sem credenciais. |
| `codex_accounts_set_active` | Vincular uma conta habilitada à sessão atual. |
| `codex_accounts_set_default` | Definir a conta preferida para sessões sem vínculo. |
| `codex_accounts_enable` | Habilitar ou desabilitar uma conta. |
| `codex_accounts_rename` | Alterar o label local da conta. |
| `codex_accounts_remove` | Agendar remoção segura após confirmação. |
| `codex_quota_refresh` | Atualizar a quota de todas as contas habilitadas. |
| `codex_handoff_note` | Salvar uma decisão, constraint, blocker ou referência durável para futuros handoffs. |
| `codex_handoff_status` | Consultar vínculo, summary estruturado e epoch de handoff da sessão. |
| `codex_handoff_now` | Preparar handoff para a melhor conta alternativa disponível. |

### Dados e privacidade

- Credenciais OAuth permanecem no arquivo local `accounts.json`.
- Credenciais nunca são retornadas pelas telas da TUI ou ferramentas dos agentes.
- Configurações e summaries não contêm tokens das contas.
- Bearer tokens, API keys e campos comuns de token são removidos da entrada do summarizer.
- Anexos binários e metadados de raciocínio do modelo não são enviados ao summarizer.
- Texto de mensagens recentes e saídas limitadas de ferramentas podem ser enviados ao provider de summary escolhido.
- A política de privacidade desse provider se aplica ao contexto resumido.
- Um modelo gratuito não é necessariamente privado; custo e privacidade são escolhas diferentes.
- Arquivos de credenciais usam modo `0600` em sistemas POSIX. No Windows, proteja o acesso pela conta do sistema operacional e permissões do sistema de arquivos.
- O transcript original do OpenCode permanece no OpenCode após o handoff.

### Limitações e comportamentos esperados

- Este plugin gerencia contas ChatGPT OAuth para OpenAI/Codex. Ele não agrupa API keys arbitrárias nem contas de providers diferentes.
- O vínculo da sessão é sticky, mas pode mudar se a conta for desabilitada, esgotada, removida ou apresentar uma falha recuperável.
- O handoff preventivo ocorre em um intervalo idle entre turnos, nunca no meio de uma resposta em geração.
- Streams entregues parcialmente nunca são repetidos automaticamente.
- A retomada automática exige um goal ativo capturado pelas ferramentas do OpenCode, uma sessão existente, uma conta válida e habilitada e quota confirmada.
- O provider de summary configurado recebe contexto de trabalho redigido. Desabilite summaries se isso não for aceitável no seu fluxo.
- Sessões simultâneas ainda podem editar a mesma working tree. Use Git worktrees quando precisar de isolamento de código.

### Solução de problemas

#### O plugin não carrega

Em um checkout local, execute `bun run build` e confirme a existência de `dist/server.js` e `dist/tui.js`. Verifique se cada arquivo está registrado no config correto e reinicie todos os processos do OpenCode.

#### O login informa que já existe outro login em execução

Conclua ou cancele o login atual. Um lock abandonado é recuperado depois do timeout.

#### O login no navegador não consegue usar a porta 1455

Primeiro reinicie o OpenCode. O plugin pode usar a porta alternativa registrada `1457`. Se ambas pertencerem a outros processos, feche esses listeners ou use device code.

#### Um novo login apenas atualiza uma conta existente

A pool remove duplicatas pela identidade/workspace ChatGPT. Entre em uma identidade diferente usando outro perfil do navegador ou uma janela privada.

#### A quota parece desatualizada

Use `Refresh all quotas` em `/codex-accounts` ou peça ao agente para chamar `codex_quota_refresh`. O endpoint de quota pode demorar para atualizar próximo do reset.

#### O summary não está sendo atualizado

Abra `/codex-handoff-status`, confirme que o provider e o modelo ainda existem e use `Test primary` ou `Test fallback` em `/codex-handoff-config`.

#### Um goal não foi retomado

Abra `/codex-waiting`. A retomada exige um goal ativo capturado, uma sessão existente, uma conta habilitada e quota disponível. Selecione um job para cancelá-lo, se necessário.

#### A remoção de uma conta continua na fila

Uma requisição ativa ainda possui uma reserva. A remoção continua depois que a requisição termina ou o lease abandonado expira.

#### Recuperar configurações inválidas

Feche o OpenCode e corrija ou remova `<diretório de dados>/settings.json`. Os padrões são recriados quando o arquivo não existe; as contas não são removidas.

### Desenvolvimento

```bash
bun install
bun run typecheck
bun test
bun run build
npm pack --dry-run
```

O pacote expõe targets separados de `server` e `tui`; ambos são necessários para a experiência completa.
