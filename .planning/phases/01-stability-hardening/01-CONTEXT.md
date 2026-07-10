# Phase 1: Stability Hardening - Context

**Gathered:** 2026-07-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Eliminate systemic crash patterns so the app is reliably usable on any network condition and across all navigation paths. Includes offline resilience, Firestore error handling, dead code removal, and cache simplification.

</domain>

<decisions>
## Implementation Decisions

### Offline Behavior
- **D-01:** Silent cache reads — no banner or toast when serving cached data offline. App behaves as-if online for reads.
- **D-02:** Queue writes and retry — Firestore persistence handles queued writes automatically when connectivity returns. No user-facing write block.
- **D-03:** Lightweight connectivity check — only detect offline when Firestore calls fail (Firebase SDK's built-in detection). No separate ConnectivityManager monitor.
- **D-04:** Silent sync on reconnect — no notification when queued writes complete. User only sees data update in UI.
- **D-05:** Pull-to-refresh on Semester tab only — SwipeRefreshLayout on semester grade list. Home and Profile refresh via tab-switch lifecycle.
- **D-06:** Empty state on cold-offline-first-load — "Connect to the internet to get started" with retry button. No placeholder shell.

### Error Reporting UX
- **D-07:** User-friendly error wording — never expose Firebase error codes. "Something went wrong. Tap to retry."
- **D-08:** Auto-retry once on transient errors — retry the Firestore call after 2s delay before showing error card.
- **D-09:** Error card persists until resolved — dismissible only by successful retry or navigation away. No auto-dismiss.
- **D-10:** Single error, latest wins — only show the most recent error. Previous errors replaced silently.
- **D-11:** No success toasts — user sees grade change in UI as implicit confirmation. Errors-only feedback.
- **D-12:** Retry Firestore call only — ViewModel has data in memory; retry just the `.set()` or `.get()` call, not the full flow.

### Dead Room Removal
- **D-13:** Room dependencies — comment out in `libs.versions.toml` and `app/build.gradle.kts` (not delete).
- **D-14:** Room source — delete `data/local/` entirely (AppDatabase, DAOs, entities).
- **D-15:** KSP config — remove `room.schemaLocation` from build.gradle.kts and remove `room-compiler` KSP dependency.
- **D-16:** Dual package namespace — leave for future phase (out of scope).
- **D-17:** Dead HomeViewModel MutableStateFlow — remove in same pass as Room cleanup.

### Cache & Preload
- **D-18:** Remove `preload()`/`consumePreloaded()` from `FirestoreSemesterRepository` — Firestore persistence cache handles cold-start reads.
- **D-19:** Keep stale-while-revalidate cache in HomeViewModel/ProfileViewModel as-is — prevents loading spinners on tab switches.
- **D-20:** Keep skeleton layouts — visual quality matters for target audience. Do not revert to ProgressBar.

### the agent's Discretion
- Tab-switch crash root cause investigation approach — researcher/planner determines the best diagnosis strategy.
- Profile-edit crash review scope — which specific operations to test and fix.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture & Data Flow
- `.planning/codebase/ARCHITECTURE.md` — MVVM pattern, data flow for grade entry, dashboard load, authentication
- `.planning/codebase/CODE_QUALITY.md` — Known code quality issues including error handling gaps
- `.planning/codebase/CONCERNS.md` — Risk assessment: offline failures, silent errors, Room dead weight

### Implementation Files (Key Source)
- `app/src/main/java/com/prakash/semora/data/remote/FirestoreSemesterRepository.kt` — preload/consumePreloaded to remove, .set(merge()) paths, computeSgpa() edge cases
- `app/src/main/java/com/prakash/semora/ui/home/HomeViewModel.kt` — cachedDashboard SWR pattern, dead MutableStateFlow to remove
- `app/src/main/java/com/prakash/semora/ui/profile/ProfileViewModel.kt` — cachedProfileLoaded SWR pattern
- `app/src/main/java/com/example/semora/ui/auth/PinVerificationActivity.kt` — calls preload(), needs preload removal
- `app/src/main/java/com/example/semora/SemoraApplication.kt` — Firestore persistence config
- `app/build.gradle.kts` — Room dependencies + KSP config to clean
- `gradle/libs.versions.toml` — Room version catalog entries to comment out
- `app/src/main/res/layout/fragment_home.xml` — skeleton layout (keep)
- `app/src/main/res/layout/fragment_semester.xml` — skeleton layout (keep)
- `app/src/main/res/layout/fragment_profile.xml` — skeleton layout (keep)
- `app/src/main/java/com/prakash/semora/data/local/` — entire directory to delete

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `_errorMessage` StateFlow + `clearError()` pattern already exists in all ViewModels — no need to create new error architecture.
- Firestore offline persistence is already enabled (`SemoraApplication.kt:38-42`) — offline reads and queued writes work out of the box.

### Established Patterns
- Repository pattern: ViewModels call repos, repos call Firebase. Error handling at ViewModel layer.
- Optimistic UI: grade updates update UI state immediately, Firestore write is async.
- Stale-while-revalidate: show cached data instantly, refresh in background.

### Integration Points
- `PullToRefresh` on SemesterFragment — needs SwipeRefreshLayout wrapping the grade list.
- Error cards — need a reusable error card layout that ViewModels can trigger via existing `_errorMessage` mechanism.
- Room removal touches: `build.gradle.kts`, `libs.versions.toml`, `app/src/main/java/com/prakash/semora/data/local/`, `SemoraApplication.kt` (Room import), `settings.gradle.kts` (Room plugin).

</code_context>

<specifics>
## Specific Ideas

- Error card: MaterialCardView with error icon + message text + "Retry" button. Inline in the relevant section, not a full-screen overlay.
- Prevent data loss at all costs — user's grade data is the only thing that matters. If a write fails, they must know.

</specifics>

<deferred>
## Deferred Ideas

- Dual package namespace consolidation (`com.example.semora` → `com.prakash.semora`) — belongs in a dedicated refactoring phase.
- Crash reporting / analytics integration — not in scope for Phase 1.

</deferred>

---

*Phase: 1-Stability Hardening*
*Context gathered: 2026-07-10*
