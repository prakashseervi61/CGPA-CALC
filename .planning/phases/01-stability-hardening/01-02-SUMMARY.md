---
phase: 01-stability-hardening
plan: 01-02
subsystem: ui
tags: [viewmodel, livedata, stateflow, error-handling, retry, pull-to-refresh, swipe-refresh, m3]
requires:
  - phase: 01-stability-hardening
    provides: dead code sweep, profile-edit crash fix
provides:
  - Inline error cards with retry on Home, Profile, Semester tabs
  - Auto-retry with 2s delay on Firestore fetch failures
  - Pull-to-refresh on Semester tab
  - Cold-offline-first-load empty state on Home tab
affects: [02-ui-polish, 03-test-coverage]
tech-stack:
  added: [androidx.swiperefreshlayout:swiperefreshlayout:1.1.0]
  patterns: [Inline error card with retry pattern, Auto-retry on transient Firestore failures]
key-files:
  created:
    - app/src/main/res/drawable/ic_error.xml
  modified:
    - app/src/main/java/com/prakash/semora/ui/home/HomeViewModel.kt
    - app/src/main/java/com/prakash/semora/ui/profile/ProfileViewModel.kt
    - app/src/main/java/com/prakash/semora/ui/semester/SemViewModel.kt
    - app/src/main/java/com/prakash/semora/ui/home/HomeFragment.kt
    - app/src/main/java/com/prakash/semora/ui/profile/ProfileFragment.kt
    - app/src/main/java/com/prakash/semora/ui/semester/SemesterFragment.kt
    - app/src/main/res/layout/fragment_home.xml
    - app/src/main/res/layout/fragment_profile.xml
    - app/src/main/res/layout/fragment_semester.xml
    - app/build.gradle.kts
key-decisions:
  - "Error card uses MaterialCardView with md3_error_container background for M3 consistency"
  - "Auto-retry has 2s delay before second attempt — long enough for transient network issues to resolve"
  - "SwipeRefreshLayout wraps only the NestedScrollView, bottom panel stays outside"
  - "Cold-offline-first-load state appears when isLoading==false && cgpa==0.0 && completedSemesters==0"
requirements-completed: [D-01, D-02, D-03, D-04, D-05, D-06, D-07, D-08, D-09, D-10, D-11, D-12, D-19, D-20]
duration: 38 min
completed: 2026-07-10
status: complete
---

# Phase 1 Plan 2: Error Handling & Pull-to-Refresh Summary

**Inline error cards with retry across all tabs, auto-retry on Firestore failures, pull-to-refresh on Semester, and cold-offline-first-load empty state on Home**

## Performance

- **Duration:** 38 min
- **Started:** 2026-07-10T14:15:00Z
- **Completed:** 2026-07-10T14:53:00Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- HomeViewModel, ProfileViewModel now expose `errorMessage: LiveData<String?>` and `clearError()` — Firestore errors show user-friendly messages instead of silent returns
- Auto-retry (2s delay, one retry) on Firestore fetch failures in all three ViewModels before showing error card
- Inline error card (MaterialCardView) with Retry button added to all three fragment layouts
- Pull-to-refresh on Semester tab using SwipeRefreshLayout + SemViewModel.refresh()
- Cold-offline-first-load empty state on Home tab with Retry button
- Snackbar error handling in SemesterFragment replaced with inline error card
- SemViewModel.loadSemester() no longer silently swallows errors — sets `_errorMessage` on retry failure
- Existing SWR cache pattern (cachedDashboard, cachedProfileLoaded, semesterCache) preserved unchanged

## Task Commits

Each task was committed atomically:

1. **Task 1: Add error handling pattern to all ViewModels** - `774af8d` (feat)
   - HomeViewModel: errorMessage LiveData, clearError(), auto-retry
   - ProfileViewModel: errorMessage LiveData, clearError(), auto-retry
   - SemViewModel: auto-retry in loadSemester(), refresh() method
   - ic_error.xml drawable, swiperefreshlayout dependency

2. **Task 2: Add error card UI and pull-to-refresh** - `933e1a6` (feat)
   - Error card XML in all three fragment layouts
   - Wiring in HomeFragment, ProfileFragment, SemesterFragment
   - Cold-offline-first-load state on Home tab
   - SwipeRefreshLayout on Semester tab

## Files Created/Modified

- `app/build.gradle.kts` - Added swiperefreshlayout dependency
- `app/src/main/res/drawable/ic_error.xml` - New error icon vector drawable
- `app/src/main/res/layout/fragment_home.xml` - Error card + emptyOffline layout
- `app/src/main/res/layout/fragment_profile.xml` - Error card layout
- `app/src/main/res/layout/fragment_semester.xml` - Error card + SwipeRefreshLayout wrapping content
- `app/src/main/java/.../ui/home/HomeViewModel.kt` - errorMessage LiveData, clearError(), auto-retry
- `app/src/main/java/.../ui/home/HomeFragment.kt` - Error card observer, retry button, offline state
- `app/src/main/java/.../ui/profile/ProfileViewModel.kt` - errorMessage LiveData, clearError(), auto-retry
- `app/src/main/java/.../ui/profile/ProfileFragment.kt` - Error card observer, retry button
- `app/src/main/java/.../ui/semester/SemViewModel.kt` - Auto-retry in loadSemester(), refresh()
- `app/src/main/java/.../ui/semester/SemesterFragment.kt` - Error card observer, pull-to-refresh

## Decisions Made

- **Error card styling:** MaterialCardView with md3_error_container background, 8dp margin, 12dp content padding — consistent with M3 color system
- **Auto-retry timing:** 2s delay before second attempt. Long enough for transient network issues to resolve on mobile, short enough to not frustrate users
- **SwipeRefreshLayout scoping:** Wraps only the NestedScrollView content (not the bottom SGPA panel) — keeps bottom panel stable during refresh
- **Cold-offline detection:** Uses the heuristic of `cgpa == 0.0 && completedSemesters == 0` as proxy for "never successfully loaded" — correct because HomeDashboardData defaults to these values
- **Pull-to-refresh implementation:** Uses `viewModel.refresh()` instead of `selectSemester()` to bypass the guard that prevents re-selecting the current semester

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added `refresh()` method to SemViewModel for pull-to-refresh**
- **Found during:** Task 2 (Error card UI and pull-to-refresh)
- **Issue:** The plan's pull-to-refresh implementation called `viewModel.selectSemester(viewModel.currentState.value.semesterNumber)`, but `selectSemester()` has a guard that returns early when the requested semester is the same as the current one — making pull-to-refresh a no-op
- **Fix:** Added `fun refresh()` to SemViewModel that bypasses the guard and calls `loadSemester()` directly
- **Files modified:** SemViewModel.kt, SemesterFragment.kt
- **Verification:** `./gradlew assembleDebug` succeeds
- **Committed in:** 774af8d (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added `btnEmptyRetry` listener in HomeFragment**
- **Found during:** Task 2 (Error card UI and pull-to-refresh)
- **Issue:** The plan specified an offline empty state with a Retry button, but didn't explicitly include wiring the button listener in the acceptance criteria
- **Fix:** Added `binding.btnEmptyRetry.setOnClickListener { viewModel.loadDashboard() }` in `setupListeners()`
- **Files modified:** HomeFragment.kt
- **Verification:** `./gradlew assembleDebug` succeeds
- **Committed in:** 933e1a6 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 missing critical)
**Impact on plan:** Both fixes essential for pull-to-refresh and offline retry to function correctly. No scope creep.

## Issues Encountered

- The plan's proposed pull-to-refresh implementation using `selectSemester()` had a semantic bug (guard clause returned early). Fixed by adding a dedicated `refresh()` method.
- swiperefreshlayout dependency needed to be added to build.gradle.kts — not pre-configured in the project.
- ic_error.xml drawable didn't exist — created as vector drawable using the info icon shape with error color tint.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All tabs now have proper error handling with inline cards and Retry
- Auto-retry masks transient failures from users
- Semester tab has pull-to-refresh for manual data refresh
- Ready for Phase 2 (UI Polish - M3) and Phase 3 (Test Coverage)
- Note: offline empty state on Home uses `cgpa == 0.0 && completedSemesters == 0` heuristic — covers the common case but may briefly flash during a slow first load

---

*Phase: 01-stability-hardening*
*Completed: 2026-07-10*
