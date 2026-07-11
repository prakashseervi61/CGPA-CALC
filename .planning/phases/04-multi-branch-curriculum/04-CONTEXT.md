# Phase 4: Multi-Branch Curriculum — Context

**Gathered:** 2026-07-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Support 2-3 branches (IT, CS, ECE). Branch name displayed on dashboard and profile. Branch picker in profile creation and edit screens. SemesterCurriculum returns courses per branch label. Existing grades preserved when branch changes — only new semesters use the new curriculum.

</domain>

<decisions>
## Implementation Decisions

### Branch Enum Model

- **D-21:** Simple string enum — `enum class Branch(val displayName: String)` in `model/Branch.kt`. IT, CS, ECE only.
- **D-22:** Label-only — course mapping is a separate `Map<Branch, List<SemesterData>>` in SemesterCurriculum, not embedded in enum.
- **D-23:** Exact match on displayName for Firestore string → enum mapping. `Branch.fromString(s)` matches `"Information Technology"` → `Branch.IT`.
- **D-24:** Branch stored in SessionManager (SharedPreferences) for quick read access.
- **D-25:** New file `model/Branch.kt` — separate from SemesterCurriculum.

### Curriculum Data Per Branch

- **D-26:** `Map<Branch, List<SemesterData>>` structure in SemesterCurriculum — each branch gets its own complete course list.
- **D-27:** Full data per branch — no shared-core optimization. Simpler, no state coupling between branches.
- **D-28:** Branch-specific structure allowed — different branches may have different semester counts or progression patterns.
- **D-29:** Branch-aware API: `getSemester(number, branch)`, `getAllSemesters(branch)` — callers always specify branch.
- **D-30:** CS and ECE courses scaffolded with 8 generic semesters of placeholder courses (e.g., "CS Core I", "ECE Elective II") — real curricula can replace later.
- **D-31:** Existing semester grades preserved when user changes branch — only newly created semesters use new curriculum.
- **D-32:** `Course(code, name, credits)` model stays as-is — no branch field added to Course.

### Branch Picker UX

- **D-33:** Dropdown (AutoCompleteTextView / M3 Exposed Dropdown Menu) for branch selection in RegisterActivity (profile creation).
- **D-34:** Tap-to-edit in EditProfileActivity — currently read-only field becomes tappable to open the same dropdown. No always-editable mode.

### Dashboard Branch Display

- **D-35:** Branch label below username in greeting: `"Information Technology · 3rd Semester"` format.
- **D-36:** HomeViewModel fetches profile from Firestore in `loadDashboard()` to get branch — consistent with existing pattern of fetching data there.
- **D-37:** Current semester number derived from Firestore semesters data (latest semester with grades).

### the agent's Discretion

- EditProfileViewModel `hasUnsavedChanges()` — extend to check branch changes. Planner decides implementation detail.
- SessionManager save/load branch key name — standard SharedPreferences key, planner picks.
- Specific TextInputLayout → AutoCompleteTextView migration in both layouts — planner handles XML + code wiring.
- HomeViewModel profile fetch integration — whether to add a `loadProfile()` call or inline it in `loadDashboard()`. Researcher/planner determines.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Key Source Files

- `app/src/main/java/com/prakash/semora/data/SemesterCurriculum.kt` — Current hardcoded IT curriculum, needs Map<Branch, ...> refactor
- `app/src/main/java/com/prakash/semora/data/remote/FirestoreProfileRepository.kt` — `ProfileDoc.branch` default, `docToProfile()`, `profileToMap()`
- `app/src/main/java/com/prakash/semora/ui/auth/AuthViewModel.kt` — `register()` creates profile with default branch, needs branch param
- `app/src/main/java/com/prakash/semora/ui/auth/ProfilePickerActivity.kt` — Entry point to create profile
- `app/src/main/java/com/prakash/semora/ui/home/HomeViewModel.kt` — `computeDashboard()` needs branch info for dashboard label
- `app/src/main/java/com/prakash/semora/ui/home/HomeFragment.kt` — Dashboard greeting display, needs branch label wiring
- `app/src/main/java/com/prakash/semora/ui/profile/EditProfileActivity.kt` — Branch is read-only, needs tap-to-edit dropdown
- `app/src/main/java/com/prakash/semora/ui/profile/EditProfileViewModel.kt` — `hasUnsavedChanges()` only checks username, needs branch awareness
- `app/src/main/java/com/prakash/semora/ui/profile/ProfileFragment.kt` — Already displays branch via `tvBranch`
- `app/src/main/java/com/prakash/semora/utils/SessionManager.kt` — Needs branch key for SharedPreferences storage
- `app/src/main/res/layout/activity_register.xml` — Needs branch dropdown below username field
- `app/src/main/res/layout/activity_edit_profile.xml` — Branch TextInputLayout (`etBranch`) needs conversion to dropdown
- `app/src/main/res/layout/fragment_home.xml` — Needs branch label TextView below greeting

### Prior Phase Decisions

- `.planning/phases/03-test-coverage/03-CONTEXT.md` — D-17 (default-param repo injection + MockK), D-18 (SgpaCalculator), D-20 (docToProfile tested for Phase 4 readiness)
- `.planning/phases/03-test-coverage/03-SUMMARY.md` — Test patterns and infrastructure established

### Codebase Maps

- `.planning/codebase/STRUCTURE.md` — File layout, 19 XML layouts indexed
- `.planning/codebase/STACK.md` — Technology stack, dependency versions
- `.planning/codebase/INTEGRATIONS.md` — Firestore data model, branch field in ProfileDoc

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `ProfileDoc.branch` field — already exists, stores branch string. No Firestore schema migration needed.
- `docToProfile()` — already tested (Phase 3 D-20), handles missing `branch` field with default. Internal visibility, accessible in tests.
- `SemesterCurriculum` object — existing pattern for course data. Just needs branch-aware refactor.
- `SessionManager` — SharedPreferences wrapper exists, just needs branch key addition.
- `EditProfileActivity` branch field — already rendered, just needs to become interactive.
- `ProfileFragment` — already observes and displays `viewModel.branch` — no change needed there.

### Established Patterns

- `@JvmOverloads` + default-param repo injection (D-17) — for ViewModels that need new params.
- Internal visibility for testable functions (D-19) — apply to new Branch mapping functions.
- MVVM + Fragment observes LiveData — `loadProfile()` → observe branch pattern already in ProfileFragment.
- Firestore `.set(merge())` upsert — established write strategy, use for `updateBranch`.

### Integration Points

- `AuthViewModel.register()` — takes `(username, pin, confirmPin)`, needs `branch` param added.
- `HomeViewModel.loadDashboard()` — currently fetches only semesters, needs profile fetch for branch.
- `SessionManager` — `saveFirebaseSession(profileId, username)` — needs branch parameter added.
- `EditProfileViewModel.save()` — currently only writes username changes, needs branch update via `FirestoreProfileRepository.updateBranch()` or generic update method.
- `SemesterCurriculum.getSemester(n)` — all 7 callers need branch parameter added.

</code_context>

<specifics>
## Specific Ideas

- Branch dropdown in registration: placed after username field, before PIN section — natural flow: name → branch → PIN.
- EditProfile branch tap: click on the read-only field → `MaterialAlertDialogBuilder` with single-choice items (IT, CS, ECE), or Exposed Dropdown with `DropdownPopup` — picker replaces the current read-only display.
- HomeViewModel profile fetch: add a `fetchProfile()` call in `loadDashboard()` coroutine before computing dashboard, or load branch from SessionManager if already cached.
- SessionManager key: `"profile_branch"` alongside `"profile_id"` and `"username"`.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 4-Multi-Branch Curriculum*
*Context gathered: 2026-07-11*
