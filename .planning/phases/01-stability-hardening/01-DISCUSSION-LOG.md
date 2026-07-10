# Phase 1: Stability Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-10
**Phase:** 1-Stability Hardening
**Areas discussed:** Offline behavior, Error reporting UX, Dead Room removal, Cache & preload refactor

---

## Offline Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Silent cache | Show cached data silently, no banner | ✓ |
| Offline banner | Persistent "You're offline" banner | |
| Toast on first fail | One-time snackbar on first failure | |

| Option | Description | Selected |
|--------|-------------|----------|
| Queue and retry | Accept grade locally, retry when online | ✓ |
| Block with message | Refuse writes while offline | |
| Same as online (silent) | Attempt write, Firebase queues it | |

| Option | Description | Selected |
|--------|-------------|----------|
| Lightweight check | Detect offline only on Firestore fail | ✓ |
| Dedicated monitor | ConnectivityManager.NetworkCallback | |
| Don't monitor | No app-level connectivity awareness | |

| Option | Description | Selected |
|--------|-------------|----------|
| Silent sync | No notification on reconnect | ✓ |
| Sync confirmation | Snackbar when reconnected | |

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, Semester tab only | Pull-to-refresh on semester list | ✓ |
| Yes, all tabs | SwipeRefreshLayout on every tab | |
| No pull-to-refresh | No manual refresh gesture | |

| Option | Description | Selected |
|--------|-------------|----------|
| Empty state | "Connect to internet" + retry | ✓ |
| Cached UI placeholder | Render shell with placeholder | |

**User's choice:** All recommended options selected.
**Notes:** Focus on simplicity. Firestore persistence handles the heavy lifting — app just surfaces errors gracefully.

---

## Error Reporting UX

| Option | Description | Selected |
|--------|-------------|----------|
| User-friendly always | Never expose Firebase error codes | ✓ |
| User-friendly + log | Friendly UI, Logcat technical | |
| Technical in dev only | Debug shows technical details | |

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-retry once | Retry after 2s, then show error | ✓ |
| Show immediately | Error on first failure | |
| Retry 3x with backoff | Exponential backoff | |

| Option | Description | Selected |
|--------|-------------|----------|
| Persist until resolved | Error stays until success | ✓ |
| Dismissible with swipe | Swipe to dismiss | |
| Auto-dismiss after 8s | Fades out | |

| Option | Description | Selected |
|--------|-------------|----------|
| Single error, latest wins | Replace old errors with new | ✓ |
| Stack multiple cards | One card per failed op | |

| Option | Description | Selected |
|--------|-------------|----------|
| Errors only | No success feedback | ✓ |
| Brief success snackbar | "Saved" after each write | |

| Option | Description | Selected |
|--------|-------------|----------|
| Retry Firestore call only | Retry just .set()/.get() | ✓ |
| Retry full flow | Re-run entire ViewModel flow | |

**User's choice:** All recommended options selected.
**Notes:** Keep error UX minimal and non-intrusive. Auto-retry handles transient blips. Error card persists so user doesn't lose data silently.

---

## Dead Room Removal

| Option | Description | Selected |
|--------|-------------|----------|
| Room only | Remove Room, leave namespace | ✓ |
| Room + namespace | Both in one pass | |

| Option | Description | Selected |
|--------|-------------|----------|
| Comment out deps | Keep entries commented | ✓ |
| Delete entirely | Remove from catalog and build | |

| Option | Description | Selected |
|--------|-------------|----------|
| Delete all | Remove data/local/ entirely | ✓ |
| Delete DAOs, keep entities | | |
| Keep everything, deprecated | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Remove with Room | One dead-code cleanup pass | ✓ |
| Separate task | Distinct deliverable | |

| Option | Description | Selected |
|--------|-------------|----------|
| Remove KSP config | Remove room.schemaLocation | ✓ |
| Keep KSP config | Leave as-is | |

**User's choice:** Comment out deps (not delete) for safety. Delete data/local/ source files. Remove KSP config. Leave namespace consolidation for later.

---

## Cache & Preload Refactor

| Option | Description | Selected |
|--------|-------------|----------|
| Remove preload | Delete preload/consumePreloaded | ✓ |
| Keep preload | Keep cold-start optimization | |

| Option | Description | Selected |
|--------|-------------|----------|
| Keep as-is | SWR pattern stays | ✓ |
| Simplify to basic cache | Remove show-stale logic | |

| Option | Description | Selected |
|--------|-------------|----------|
| Keep skeletons | Polished loading experience | ✓ |
| Replace with ProgressBar | Simpler, less XML | |

**User's choice:** Remove preload machinery. Keep SWR cache pattern as-is. Keep skeleton layouts for visual quality.

---

## the agent's Discretion

- Tab-switch crash root cause investigation strategy
- Profile-edit crash review scope

## Deferred Ideas

- Dual package namespace consolidation — future refactoring phase
- Crash reporting / analytics — future phase
