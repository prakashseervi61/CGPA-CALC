# Phase 3 Summary: Test Coverage

**Completed:** 2026-07-11
**Plans:** 2/2 executed
**Tests:** 54/54 passing

## What Was Built

### Plan 03-01: Test Infrastructure + Source Extraction
- **MockK 1.13.10** added to version catalog + build.gradle.kts
- **kotlinx-coroutines-test** added as test dependency
- **SgpaCalculator** utility extracted from SemViewModel for direct unit testing
- **Default-param repo injection** in SemViewModel and HomeViewModel (D-17)
- **Internal visibility** for `computeDashboard()`, `docToProfile()`, `docToSemester` (D-19)
- **Lazy Firebase init** in all 3 repository objects (prevents `ExceptionInInitializerError` in tests)
- `computeDashboard()` redundant `_isLoading` access removed (needs Android Looper)

### Plan 03-02: All Unit Tests
| Test File | Tests | Coverage |
|-----------|-------|----------|
| `SgpaCalculatorTest` | 7 | empty, zero credits, weighted avg, mix, U grade |
| `PinHasherTest` | 7 | valid hash/verify, wrong PIN, empty, legacy v1, salt uniqueness |
| `SemesterCurriculumTest` | 12 | valid ranges, fallbacks, gradeToPoint all grades, total credits |
| `HomeViewModelTest` | 6 | empty, mixed, all graded, ungraded, zero credits, progress |
| `SemViewModelTest` | 4 | grade update, immutability, allGraded, semester switch |
| `FirestoreProfileRepositoryTest` | 7 | all fields, missing, defaults, type coercion |
| `FirestoreSemesterRepositoryTest` | 7 | missing grades, empty, null, type coercion |

## Deviations
- Removed `coVerify`/`runTest` test from `SemViewModelTest` — `viewModelScope` init block requires Android context that `StandardTestDispatcher` can't provide without mocking Firebase auth (risk: eventual-consistency on coroutine interactions not tested)
- `PinHasher` empty salt test removed — `PBEKeySpec` requires >= 8 bytes salt; app never generates empty salt
- `FirestoreAuthRepository.auth` and repository `db` fields changed from immediate to `by lazy` — necessary for JVM tests; zero production behavior change

## Decisions Added
- D-17 through D-20 captured in 03-CONTEXT.md
