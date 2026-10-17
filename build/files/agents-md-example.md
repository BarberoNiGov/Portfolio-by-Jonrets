# AGENTS.md — <Project Name>

> Read this before touching anything. It is the contract between the agent and the repo.
> Keep it under ~120 lines. Every line should change agent behavior — if it doesn't, delete it.

## 1. What this project is

<One paragraph. What it does, who uses it, and what "done" means for the business.>

- **Stack:** <language, framework, database, runtime versions>
- **First files to read:** <the 2–4 files that explain the system>
- **Deployed to:** <environment>

## 2. Non-negotiables

These are hard rules. Violating one is a failed task, not a bug to fix later.

- Never commit secrets, `.env` files, keys, or tokens.
- Never run destructive commands (`DROP`, `TRUNCATE`, recursive delete) against anything but a local scratch database.
- Never modify `<protected paths>` without explicit approval.
- Never invent a requirement. If the spec is silent, stop and ask.
- Never claim a test passed if you did not run it.

## 3. Commands

| Purpose | Command |
|---|---|
| Install | `<cmd>` |
| Dev server | `<cmd>` |
| Test | `<cmd>` |
| Lint / typecheck | `<cmd>` |
| Build | `<cmd>` |
| Migrate | `<cmd>` |

If a command fails, report the exact output. Do not silently substitute a different command.
After every test run, record the pass count and assertion count in `PROGRESS.md` — a number that moves is the only evidence the suite actually ran.

## 4. Architecture map

```
<path>/          → <what lives here>
<path>/          → <what lives here>
<path>/          → <what lives here>
```

- **Data model:** <where schema and migrations live; the 3–5 tables that matter>
- **Auth:** <how authentication and authorization work, in one sentence>
- **External services:** <list, and whether each can be mocked locally>

Rules:

- New code goes in `<path>`. Do not add a second pattern for the same job.
- Shared logic lives in `<path>`. Do not duplicate it.
- Configuration comes from the environment only — no hardcoded paths, hosts, ports, or keys.

## 5. Conventions

- Match the surrounding code. If the file uses `<style>`, use `<style>`.
- Prefer the smallest change that satisfies the acceptance criteria.
- No new dependency without a written justification in the task notes.
- Handle errors where they occur; never swallow them silently.
- Name functions for what they return, not how they work.

## 6. Definition of done

A task is done only when all of these are true:

1. Every acceptance criterion in `PLAN.md` is verified, not assumed.
2. Tests were run and the output is recorded in `PROGRESS.md`.
3. No new warnings in lint, typecheck, or build.
4. No secrets, debug prints, or commented-out code left behind.
5. `PROGRESS.md` is updated for the next context window.

## 7. How to report back

- State what changed and why, file by file.
- State what was verified — with the command and its result.
- State what was **not** verified, and why.
- If blocked, say exactly where and what is needed.
- Never summarize a failure as a success.
