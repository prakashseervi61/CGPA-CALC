# Phase 3 Context: Test Coverage

**Created:** 2026-07-11
**Source:** discuss-phase (gray area deep-dive)

---

## Goal

Unit tests for core business logic to enable safe refactoring during feature expansion. Tests pass on `./gradlew test`.

---

## Locked Decisions

### D-17: Test injection pattern — default param + MockK

ViewModels get a repository parameter with default value so tests can inject mocks:

```kotlin
// Production: no change to callers
class SemViewModel(app: Application, private val repo: FirestoreSemesterRepository = FirestoreSemesterRepository)

// Test: inject mockk
val repo = mockk<FirestoreSemesterRepository>()
val vm = SemViewModel(mockk(), repo)
```

- `HomeViewModel` and `SemViewModel` both get this pattern
- `ProfileViewModel` and `AuthViewModel` are out of scope (no test targets in ROADMAP)
- MockK added to `libs.versions.toml` + `app/build.gradle.kts` as `testImplementation`

### D-18: Extract SGPA math → `object SgpaCalculator`

Pull the weighted-sum loop from `SemViewModel.computeState()` into a standalone utility:

```kotlin
object SgpaCalculator {
    fun compute(courses: List<Course>): Double {
        val graded = courses.filter { it.grade.isNotEmpty() }
        val totalGradedCredits = graded.sumOf { it.credits }
        if (totalGradedCredits == 0) return 0.0
        val weightedSum = graded.sumOf { SemesterCurriculum.gradeToPoint(it.grade) * it.credits }
        return weightedSum / totalGradedCredits
    }
}
```

- Zero mocking needed for the math itself
- `computeState()` delegates to `SgpaCalculator.compute()`
- Direct unit test covers: empty list, zero credits, all letters, mix graded/ungraded, single course

### D-19: Extract `computeDashboard()` + `docToProfile()` for direct testing

Both promoted to `internal` visibility:

- `HomeViewModel.computeDashboard()` → `internal fun` (package-private)
- `FirestoreProfileRepository.docToProfile()` → `internal fun`

Neither requires Android context in tests. Tests pass raw data and assert output.

### D-20: Test `docToProfile()` despite dead callers

`getProfiles()` was removed in Phase 1, but `docToProfile()` parsing logic will be needed by Phase 4 (multi-branch). Test null fields, missing fields, type coercion now.

Targets from ROADMAP (6) + discovered (1):

| Target | File | Approach |
|--------|------|----------|
| `SgpaCalculator.compute()` | `utils/SgpaCalculator.kt` [NEW] | Direct unit test, no mocking |
| `PinHasher.hash()` / `verify()` | `utils/PinHasher.kt` | Direct unit test, no mocking |
| `SemesterCurriculum` mapping | `data/SemesterCurriculum.kt` | Direct unit test, no mocking |
| `HomeViewModel.computeDashboard()` | `ui/home/HomeViewModel.kt` | Internal function, direct test |
| `SemViewModel.updateGrade()` + `computeState()` | `ui/semester/SemViewModel.kt` | MockK repo, default-param injection |
| `docToProfile()` | `data/remote/FirestoreProfileRepository.kt` | Internal function, direct test |
| `docToSemester()` | `data/remote/FirestoreSemesterRepository.kt` | Internal function, direct test |

---

## Scope: Edge Cases Per Target

| Target | Edge Cases |
|--------|-----------|
| `SgpaCalculator.compute()` | empty courses, zero credits, all letter grades, mix graded/ungraded, single course |
| `PinHasher.hash()` + `verify()` | valid hash/verify, wrong PIN, empty PIN, salt length mismatch, legacy v1 path |
| `SemesterCurriculum` | `getSemester(1..8)` valid, `getSemester(0/9/99)` fallback, `gradeToPoint` all 7 grades + invalid |
| `HomeViewModel.computeDashboard()` | empty semesters list, 1 semester mixed grades, all graded, all ungraded, ÷0 (no graded credits) |
| `SemViewModel.updateGrade()` + `computeState()` | update grade → SGPA recomputed, state immutability, all courses graded → `allGraded=true` |
| `docToProfile()` | all fields present, missing `pinHash`, missing `pinSalt`, null coerce, Long→Int cast |
| `docToSemester()` | missing `grades` field, empty `grades`, null `semesterNumber`, type coercion |

---

## Infrastructure Changes

### New Dependencies (test only)

```toml
# gradle/libs.versions.toml
[versions]
mockk = "1.13.10"

[libraries]
mockk = { group = "io.mockk", name = "mockk", version.ref = "mockk" }
```

```kotlin
// app/build.gradle.kts
testImplementation(libs.mockk)
```

### New Files

| File | Purpose |
|------|---------|
| `app/src/test/java/com/prakash/semora/utils/SgpaCalculator.kt` | Extracted SGPA math |
| `app/src/test/java/com/prakash/semora/utils/SgpaCalculatorTest.kt` | SGPA unit tests |
| `app/src/test/java/com/prakash/semora/utils/PinHasherTest.kt` | PIN hashing tests |
| `app/src/test/java/com/prakash/semora/data/SemesterCurriculumTest.kt` | Curriculum mapping tests |
| `app/src/test/java/com/prakash/semora/ui/home/HomeViewModelTest.kt` | Dashboard aggregation tests |
| `app/src/test/java/com/prakash/semora/ui/semester/SemViewModelTest.kt` | Semester state tests |
| `app/src/test/java/com/prakash/semora/data/remote/FirestoreProfileRepositoryTest.kt` | docToProfile parsing tests |
| `app/src/test/java/com/prakash/semora/data/remote/FirestoreSemesterRepositoryTest.kt` | docToSemester parsing tests |

### Modified Files

| File | Change |
|------|--------|
| `gradle/libs.versions.toml` | Add MockK version + library entry |
| `app/build.gradle.kts` | Add `testImplementation(libs.mockk)` |
| `app/.../SemViewModel.kt` | Add repo param with default, extract SGPA math |
| `app/.../HomeViewModel.kt` | Add repo param with default, make `computeDashboard` internal |
| `app/.../FirestoreProfileRepository.kt` | Make `docToProfile()` internal |
| `app/.../FirestoreSemesterRepository.kt` | Make `docToSemester()` internal |

---

## Out of Scope

- Instrumented tests (`androidTest/`) — JVM unit tests only
- `ProfileViewModel` / `AuthViewModel` / `SessionManager` — not in ROADMAP
- UI tests (Espresso) — Phase 3 is unit-test-only
- CI pipeline — tests run locally via `./gradlew test`

---

## Success Criteria

- [ ] `./gradlew test` passes with all new tests green
- [ ] Every test target in the table above has at least the listed edge cases covered
- [ ] No source code changes alter production behavior (extraction is pure refactor, no logic change)
