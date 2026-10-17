# PROGRESS.md — <System Name>

> **Last updated:** <date>
> **Companion:** [PLAN.md](PLAN.md) — decisions and architecture.
>
> This file is the single place to see what is built, where work stopped, and what is next.
> A fresh context window must be able to resume from this file alone.

## Where we last stopped

**<One-line summary of the latest session.>**

<Three to six sentences. What changed, why it changed, and what it means for the plan. If a scope decision changed, say so plainly and say what it supersedes.>

**Resume point → <the next concrete action>.**

## Phase status

| Phase | Scope | Status |
|---|---|---|
| **P0 — Spike** | <...> | 🟢 complete / 🟡 partial / 🔴 not started |
| **P1 — Foundation** | <...> | <...> |
| **P2 — <...>** | <...> | <...> |

Legend: 🟢 done · 🟡 partial · 🔴 not started

Partial must be specific: say what is done and what is not.

## What is built

### <Area>

- <capability, with the constraint or decision that shapes it>

### <Area>

- <capability>

## Verification (last run)

| Check | Command | Result |
|---|---|---|
| Unit / feature tests | `<command>` | <pass count, assertion count> |
| Static analysis | `<command>` | <error count> |
| Formatting | `<command>` | <clean or not> |
| Types | `<command>` | <error count> |
| Build | `<command>` | <result> |
| Manual | <what was clicked or run> | <what was observed> |

Never write "tested" without the command and the result. If a check did not run, write `not run` and the reason.

## Next steps (recommended order)

1. **<action>** — <why it is next, and what done looks like>
2. **<action>** — <why it is next, and what done looks like>
3. **<action>**

## Key technical notes / gotchas

- **<Gotcha>:** <what happens, why, and the fix. Write these for someone with no memory of this session.>
- **<Gotcha>:** <what happens, why, and the fix.>

## Open items / risks

- <what is unverified, unbuilt, or fragile, and the consequence>
