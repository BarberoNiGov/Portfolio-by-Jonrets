# PLAN.md — <System or Feature Name>

> Written before implementation. This is the architecture and decision record the build is verified against.
> Facts marked as verified must carry a source and a date. An unsourced fact is an assumption, not a decision.

## 1. Objective

<One paragraph. What this system does, who uses it, and what "working" means.>

## 2. Decisions (resolved)

| Decision | Choice | Why |
|---|---|---|
| Backend | <...> | <...> |
| Database | <...> | <...> |
| Realtime / async | <...> | <...> |
| Frontend | <...> | <...> |
| Build tooling | <...> | <...> |
| Quality gate | <...> | <...> |
| Deployment target | <...> | <...> |
| Builder / team | <...> | <...> |

A decision that is still open belongs in §12, not here.

## 3. Verified compatibility

Every claim below was checked against primary sources on <date>.

### <Component or version>

- <fact> — source: <url>
- <fact> — source: <url>

### <Component or version>

- <fact> — source: <url>

Rules:

- Pin versions. "Latest" is not a version.
- Record anything outside the vendor's official support matrix as a spike item in §11.

## 4. Deployment topology

```
<entry point → application → services → data stores>
```

- <what runs where, and how many of each>
- <process manager, queue, scheduler>
- <what is shared with other systems, and what must never be written to>

## 5. Architecture

```
<modules and their responsibilities>
```

| Module | Responsibility | Depends on |
|---|---|---|
| <...> | <...> | <...> |

Boundaries:

- <what owns what>
- <what may not import from what>
- <where new code goes>

## 6. Interfaces and contracts

**Endpoints**

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| <...> | <...> | <...> | <...> | <...> |

**Events and jobs**

| Name | Trigger | Payload | Delivery | Idempotency |
|---|---|---|---|---|
| <...> | <...> | <...> | <...> | <...> |

Changing any contract here requires updating this section before the code changes.

## 7. Data model

```
<table>(<column> <type> <constraints>)
```

- **Keys:** <primary and unique keys, and why>
- **Constraints that will not survive the production engine:** <for example, nullable unique columns>
- **PII:** <what is sensitive, how it is stored, and what must never be logged>

## 8. Non-functional requirements

Every item must be measurable.

- **Scale:** <target, with a headroom figure>
- **Latency:** <p95 target>
- **Availability:** <acceptable failure mode>
- **Idempotency:** <what must be safe to repeat>
- **Recovery:** <how state is restored after a drop or restart>
- **Security:** <transport, sessions, authorization, rate limits>
- **Observability:** <logs, metrics, what an operator can actually see>
- **Reproducibility:** <how a second machine reaches the same state>

## 9. Build phases

| Phase | Deliverable | Exit criteria |
|---|---|---|
| P0 — Spike | <prove the riskiest assumptions> | <...> |
| P1 — Foundation | <...> | <...> |
| P2 — <...> | <...> | <...> |

A phase is complete only when its exit criteria are demonstrated, not when the code is written.

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| <...> | <...> | <...> |

## 11. Spike checklist

Things that must be proven on the real target before the build depends on them:

- [ ] <...>
- [ ] <...>

## 12. Open questions

| Question | Owner | Needed by |
|---|---|---|
| <...> | <...> | <...> |
