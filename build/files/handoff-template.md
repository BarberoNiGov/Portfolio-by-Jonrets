# HANDOFF.md — <System Name>

> A context pack. Paste this into a fresh session when you need more context headroom.
> It summarizes the system, the current state, the conventions, and the next thing to build.
> Keep it under ~150 lines. If it grows past that, the detail belongs in PROGRESS.md.

## What this is

<One paragraph: what the system does, who uses it, and the one architectural fact that explains everything else.>

**Stack:** <versions, not just names.>

## How it runs right now

<The actual serving mode — not the idealized one. Include the URL, the ports, and the commands.>

```bash
<command>   # what it starts
<command>   # what it stops
```

## Conventions / quality gate

- Backend: `<command>` — currently **<n> passed (<n> assertions)**.
- Frontend: `<command>` for lint, types, and build.
- <style rules: comments, path quoting, formatting, test isolation>

## Key files

| Area | Files |
|---|---|
| <area> | `<path>`, `<path>` |
| <area> | `<path>` |
| <area> | `<path>` |
| Tests | `<path>` |

## Current behavior (as built)

- <the behavior that actually exists, including exceptions and edge rules>
- <what is intentionally not implemented>
- <what the most recent scope decision changed or removed>

## SHIPPED

- **<Feature>** — <what it does and the invariant it protects>

## NEXT

- **<The single next thing>** — <what done looks like>

## PARKED

- **<Feature>** — <why it is parked and what would unpark it>

## Open items

- <unverified assumption, known gap, or risk>
