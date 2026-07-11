# Phase 4: Multi-Branch Curriculum — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-11
**Phase:** 4-Multi-Branch Curriculum
**Areas discussed:** Branch enum model, Curriculum data per branch, Branch picker UX, Dashboard branch display, Curriculum data source

---

## Branch Enum Model

| Option | Description | Selected |
|--------|-------------|----------|
| Simple string enum | `enum class Branch(val displayName: String)` | ✓ |
| Sealed class with metadata | sealed class with embedded semester data | |
| Continue strings as-is | Keep branch as raw String in ProfileDoc | |
| Label-only enum | Enum carries displayName only, course mapping separate | ✓ |
| Enum carries semester data | Course data embedded in branch type | |
| New Branch.kt in model/ | Clean separation in model package | ✓ |
| Inline in SemesterCurriculum | Fewer files, keeps types together | |
| IT, CS, ECE (ROADMAP default) | As specified | ✓ |
| IT, CS, ECE + placeholder | Include GENERIC for future branches | |
| Exact match on displayName | Case-sensitive match from Firestore string | ✓ |
| Case-insensitive + fallback | Tolerant matching, default to IT | |
| Save in SessionManager | Store branch in SharedPreferences | ✓ |
| Fetch from Firestore always | Always get branch from ProfileDoc | |

**User's choice:** Simple string enum, label-only, new Branch.kt in model/, IT/CS/ECE only, exact match on displayName, saved in SessionManager.

**Notes:** D-21 through D-25 captured.

---

## Curriculum Data Per Branch

| Option | Description | Selected |
|--------|-------------|----------|
| Map<Branch, List<SemesterData>> | Branch → courses map | ✓ |
| Sealed class per branch | Object per branch with common interface | |
| Single list with branch filter | Course has branch property | |
| Full data per branch | Complete course lists per branch | ✓ |
| Shared core + branch-specific | Less duplication, more complexity | |
| Same 8-semester structure for all | All branches follow same pattern | |
| Branch-specific structure | Different patterns per branch | ✓ |
| Keep grades, only affect new semesters | Existing grades preserved | ✓ |
| Warn user, clear semesters | Reset grades on branch change | |
| Don't allow branch change | Branch locked after creation | |
| Branch-aware API: getSemester(n, branch) | Callers specify branch | ✓ |
| Stateful: set branch once, then getSemester(n) | Fewer param changes | |

**User's choice:** Map<Branch, List<SemesterData>> with full data per branch, branch-specific structures, existing grades preserved, branch-aware API.

**Notes:** CS/ECE courses to be scaffolded with 8 generic semesters of placeholders. Course model stays as-is.

---

## Branch Picker UX

| Option | Description | Selected |
|--------|-------------|----------|
| Dropdown (AutoCompleteTextView) | M3 Exposed Dropdown Menu | ✓ |
| Radio button group | 3 radio buttons, visible upfront | |
| Chip group | M3 FilterChip row | |
| Tap-to-edit — opens dropdown | Click read-only field → picker | ✓ |
| Always editable dropdown | AutoCompleteTextView by default | |

**User's choice:** Dropdown for registration, tap-to-edit for edit profile.

---

## Dashboard Branch Display

| Option | Description | Selected |
|--------|-------------|----------|
| Below username in greeting | "Information Technology · 3rd Semester" below name | ✓ |
| In the hero/CGPA card | Inside main grade card | |
| Both | Greeting line + CGPA card | |
| Fetch profile from Firestore | HomeViewModel fetches profile in loadDashboard() | ✓ |
| Read from SessionManager | Direct read from SharedPreferences | |
| Passed from login via intent | Fragile on tab switches | |
| Branch + current semester number | "IT · 3rd Semester" | ✓ |
| Branch only, no semester | Simple: just branch name | |
| Branch + progress fraction | "IT · 3 of 8 completed" | |

**User's choice:** Branch label below username in greeting, format "Branch · Nth Semester", HomeViewModel fetches profile from Firestore.

**Notes:** D-35 through D-37 captured.

---

## Curriculum Data Source

| Option | Description | Selected |
|--------|-------------|----------|
| 8 generic semesters with generic courses | Full placeholder structure | ✓ |
| Realistic first 4, placeholder 5-8 | Core courses realistic | |
| Minimal — 1-2 generic courses per semester | Bare minimum | |
| Keep Course as-is | No branch field on Course | ✓ |
| Add optional branch field to Course | YAGNI risk | |

**User's choice:** 8 generic semesters with generic placeholder courses for CS and ECE. Course model unchanged.

---

## the agent's Discretion

- EditProfileViewModel `hasUnsavedChanges()` branch awareness detail
- SessionManager branch key name
- Specific AutoCompleteTextView wiring in layouts
- HomeViewModel profile fetch integration approach

## Deferred Ideas

None.
