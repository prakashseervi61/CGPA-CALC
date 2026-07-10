---
phase: 01-stability-hardening
plan: 01-01
subsystem: infra
tags: [cleanup, room, firestore, dead-code]
requires: []
provides:
  - Cleaned preload mechanism from FirestoreSemesterRepository
  - FirestoreProfileRepository now uses .set(merge()) instead of .update()
  - Removed Room dependencies and migration code
affects: [build, app-startup]

tech-stack:
  added: []
  patterns:
    - Prefer Firestore .set(SetOptions.merge()) over .update() for crash safety on missing docs
    - No Room dependencies in build config

key-files:
  created: []
  modified:
    - app/src/main/java/com/prakash/semora/data/remote/FirestoreSemesterRepository.kt
    - app/src/main/java/com/prakash/semora/ui/auth/PinVerificationActivity.kt
    - app/src/main/java/com/prakash/semora/ui/home/HomeViewModel.kt
    - app/src/main/java/com/prakash/semora/data/remote/FirestoreProfileRepository.kt
    - gradle/libs.versions.toml
    - app/build.gradle.kts
    - app/src/main/java/com/example/semora/SemoraApplication.kt
  deleted:
    - app/src/main/java/com/prakash/semora/data/local/AppDatabase.kt
    - app/src/main/java/com/prakash/semora/data/local/UserDao.kt
    - app/src/main/java/com/prakash/semora/data/local/SemesterDao.kt
    - app/src/main/java/com/prakash/semora/data/local/GradeDao.kt
    - app/src/main/java/com/prakash/semora/model/GradeEntity.kt
    - app/src/main/java/com/prakash/semora/model/Semester.kt
    - app/src/main/java/com/prakash/semora/model/User.kt

key-decisions:
  - "Kept google-devtools-ksp plugin declaration in root and app build files (it's a no-op without room-compiler, removing it risks breaking unknown KSP consumers)"
  - "Kept room = 2.8.4 version entry in libs.versions.toml [versions] for reference"
  - "Kept minimal CoroutineScope(Dispatchers.IO) in SemoraApplication for signal-and-forget firebase init"

patterns-established:
  - "Firestore writes should use .set(SetOptions.merge()) for crash-safety when the target document may not exist"
  - "Preload idioms replaced with direct Firestore reads at point of use"

requirements-completed: [D-13, D-14, D-15, D-17, D-18]

duration: 12min
completed: 2026-07-10
status: complete
---

# Phase 01: Stability Hardening — Plan 1 Summary

**Removed dead preload mechanism, Room database layer, KSP Room config, and fixed FirestoreProfileRepository to use .set(merge()) to prevent crash on missing document**

## Performance

- **Duration:** 12 min
- **Started:** 2026-07-10T14:00:00Z
- **Completed:** 2026-07-10T14:12:00Z
- **Tasks:** 2
- **Files modified:** 7
- **Files deleted:** 4

## Accomplishments

- Removed `preloadedSemesters` field, `preload()`, and `consumePreloaded()` from `FirestoreSemesterRepository` — eliminates stale cache state
- Removed `preload()` call and unused import from `PinVerificationActivity` — leaner auth flow
- Removed preloaded consume block from `HomeViewModel` — dashboard loads directly from Firestore
- Changed `FirestoreProfileRepository.updateUsername()` and `updatePin()` from `.update()` to `.set(SetOptions.merge())` — prevents crash when profile doc doesn't exist yet
- Commented out Room library entries in `libs.versions.toml` — stops Gradle from resolving Room artifacts
- Commented out KSP Room arg block and Room dependencies in `app/build.gradle.kts` — eliminates Room from build
- Removed `runMigration()` method and all migration code from `SemoraApplication.kt` — faster app startup, no dead migration logic
- Deleted entire `data/local/` package (AppDatabase, UserDao, SemesterDao, GradeDao) — Room layer completely excised
- Deleted Room entity model files (GradeEntity, Semester, User) — only Room-annotated classes, no non-Room consumers

## Task Commits

Each task was committed atomically:

1. **Task 01-01-01: Remove preload mechanism and fix FirestoreProfileRepository** — `5608aa5` (refactor)
2. **Task 01-01-02: Remove Room dependencies and migration code** — `d92d522` (chore)

## Files Created/Modified

- `app/src/main/java/com/prakash/semora/data/remote/FirestoreSemesterRepository.kt` — Removed preload mechanism (preloadedSemesters, preload(), consumePreloaded())
- `app/src/main/java/com/prakash/semora/ui/auth/PinVerificationActivity.kt` — Removed preload() call and FirestoreSemesterRepository import
- `app/src/main/java/com/prakash/semora/ui/home/HomeViewModel.kt` — Removed preloaded consume block
- `app/src/main/java/com/prakash/semora/data/remote/FirestoreProfileRepository.kt` — Changed updateUsername/updatePin to .set(SetOptions.merge()), added SetOptions import
- `gradle/libs.versions.toml` — Commented out Room library entries
- `app/build.gradle.kts` — Commented out KSP arg block and Room dependencies
- `app/src/main/java/com/example/semora/SemoraApplication.kt` — Removed migration code, simplified imports and scope

### Deleted
- `app/src/main/java/com/prakash/semora/data/local/AppDatabase.kt`
- `app/src/main/java/com/prakash/semora/data/local/UserDao.kt`
- `app/src/main/java/com/prakash/semora/data/local/SemesterDao.kt`
- `app/src/main/java/com/prakash/semora/data/local/GradeDao.kt`
- `app/src/main/java/com/prakash/semora/data/local/` (entire directory)
- `app/src/main/java/com/prakash/semora/model/GradeEntity.kt`
- `app/src/main/java/com/prakash/semora/model/Semester.kt`
- `app/src/main/java/com/prakash/semora/model/User.kt`

## Decisions Made

- **Kept `google-devtools-ksp` plugin declaration**: Removing `room-compiler` makes KSP a no-op for Room. Keeping the plugin avoids risk of breaking other hypothetical KSP consumers. Can be removed in a future sweep if confirmed unused.
- **Kept `room = "2.8.4"` version entry**: Preserved the version string in [versions] for reference (it's inert without the library entries). Removes cleanly in a later pass.
- **Kept minimal `CoroutineScope(Dispatchers.IO)`**: `FirestoreAuthRepository.ensureSignedIn()` is a `suspend` function called during app init — a lightweight scope replaces the old `SupervisorJob()` + scope pattern.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Deleted Room entity model files that blocked compilation**
- **Found during:** Task 01-01-02 (verification — `./gradlew assembleDebug`)
- **Issue:** After removing Room dependencies, KSP was skipped but previously-generated `_Impl` files in `build/generated/ksp/debug/` referenced the Room entity model classes (`GradeEntity`, `Semester`, `User`) in `com.prakash.semora.model`. These entity files still had `@Entity`, `@PrimaryKey`, `@ForeignKey` annotations that resolved to `androidx.room.*`, which was no longer on the classpath. The stale generated code plus the unresolved Room annotations caused ~250+ compile errors.
- **Fix:** Deleted the three Room entity model files (`GradeEntity.kt`, `Semester.kt`, `User.kt`) and cleaned the `app/build/` directory. These files had zero non-Room consumers — only the Room annotation processor and the deleted DAO layer referenced them.
- **Files modified:**
  - Deleted: `app/src/main/java/com/prakash/semora/model/GradeEntity.kt`
  - Deleted: `app/src/main/java/com/prakash/semora/model/Semester.kt`
  - Deleted: `app/src/main/java/com/prakash/semora/model/User.kt`
  - Cleaned: `app/build/` (stale generated KSP code)
- **Verification:** `./gradlew assembleDebug` succeeds (BUILD SUCCESSFUL in 23s, `kspDebugKotlin SKIPPED`)
- **Committed in:** Post-task cleanup (part of plan metadata commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix — without deleting these unused entity files, the build fails with 250+ compilation errors due to stale KSP-generated code referencing deleted Room annotations.

## Issues Encountered

- **Stale KSP generated code:** After removing Room dependencies, KSP was disengaged (`kspDebugKotlin SKIPPED`) but previously-generated `_Impl` files in `build/generated/ksp/debug/` remained on disk and referenced deleted Room classes and APIs. The entity model files also needed to be removed since they still carried Room annotations. Solution: delete entity files + clean `app/build/` directory.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Dead code (preload mechanism, Room layer) fully removed
- Firestore profile writes now crash-safe with `.set(merge())`
- Ready for **Plan 01-02**: Fix offline crash with Firestore null listeners in GradeActivity
- Build should pass with `./gradlew assembleDebug`

## Self-Check: PASSED

- [x] All files exist as expected (8 of 8)
- [x] Deleted files confirmed removed (data/local/ directory + 3 entity files)
- [x] Commits present: `5608aa5` (Task 1), `d92d522` (Task 2)
- [x] No preload/consumePreloaded references remain anywhere
- [x] FirestoreProfileRepository uses SetOptions.merge() for updateUsername and updatePin
- [x] Build passes: `./gradlew assembleDebug` → BUILD SUCCESSFUL in 23s
- [x] SUMMARY.md written to plan directory

---
*Phase: 01-stability-hardening*
*Completed: 2026-07-10*
