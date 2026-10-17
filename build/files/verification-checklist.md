# Verification Checklist

> Run this before declaring any task done. It is a gate, not a formality.
> **A check you did not run is `INCONCLUSIVE`, never `PASS`.**

## 1. Pre-flight

- [ ] The project installs from a clean state using only the documented commands
- [ ] The app starts with no errors
- [ ] The test suite runs (record the count: `__ passed, __ failed`)

If any of these fail, stop. Do not review code on top of a broken baseline.

## 2. Spec conformance

Open `PLAN.md` and walk the acceptance criteria one by one.

| # | Criterion | Result | Evidence |
|---|---|---|---|
| 1 | <criterion> | PASS / FAIL / INCONCLUSIVE | <command or observation> |
| 2 | <criterion> | PASS / FAIL / INCONCLUSIVE | <command or observation> |

Do not grade a criterion as PASS because the code "looks right."

## 3. Functional regression

- [ ] Full test suite passes
- [ ] Lint, typecheck, and build pass with no new warnings
- [ ] Every changed function's call sites were checked for signature and behavior drift
- [ ] No removed symbol is still referenced
- [ ] Database migrations apply cleanly and roll back cleanly

## 4. Edge cases and failure states

Check each that applies:

- [ ] Empty, null, and zero-value inputs
- [ ] Duplicate submission and double-click
- [ ] Unauthorized and expired-session access
- [ ] Network failure, timeout, and retry behavior
- [ ] Invalid or malformed input rejected at the boundary
- [ ] Large input: pagination, a load limit, or a hard cap exists

## 5. Security

- [ ] No secret, key, token, or credential in code, logs, or output
- [ ] User input is validated at the trust boundary, not trusted downstream
- [ ] Authorization is checked server-side, not only in the UI
- [ ] Output is escaped for its context (HTML, SQL, shell, JSON)
- [ ] Errors do not leak stack traces, queries, or internal paths

## 6. Determinism

- [ ] The same input produces the same output across runs
- [ ] Ordering is stable (explicit sort, not incidental)
- [ ] No dependence on wall-clock time, random seeds, or network state unless declared

## 7. Housekeeping

- [ ] No debug prints, commented-out code, or TODO placeholders
- [ ] No unrelated files changed
- [ ] `PROGRESS.md` is updated for the next context window

## Verdict

- **PASS** — every applicable check ran and passed
- **FAIL** — at least one check ran and failed. List findings as `severity | file:line | what breaks | evidence`
- **INCONCLUSIVE** — a required check could not run. List exactly what was missing

Never claim a check you did not run. Never report a failure as a partial success.
