# Code Quality: Semora

**Last updated:** 2026-07-10
**Focus:** Style, consistency, maintainability

## Overall Assessment

**Rough but functional.** The app works, but has several quality markers typical of a solo-built project that evolved over time.

## Positives

- **Repository pattern cleanly separates data access** — Firestore repos encapsulate all Firestore API calls, ViewModels call repos not Firebase directly
- **Consistent error handling added across ViewModels** — every Firestore call has try/catch with `_errorMessage` StateFlow and `clearError()`
- **Optimistic UI updates** — grade changes update UI state immediately, Firestore write is async and non-blocking
- **Stale-while-revalidate caching** — `cachedDashboard`/`cachedProfileLoaded` pattern avoids loading spinners on tab switches
- **Version catalog** — single-source dependency versions via `gradle/libs.versions.toml`
- **PIN hashing via PBKDF2** (in `PinHasher.kt`) — proper password-based key derivation, not plaintext

## Issues

### Dual Package Namespace

Files in both `com.example.semora` (4 entry-point files) and `com.prakash.semora` (~30 files). This causes:
- Import path confusion (what lives where?)
- No `internal` visibility between packages (everything is `public`)
- All navigation strings use fully-qualified class names

**Effort to fix:** ~2 hours (package move + update all imports + AndroidManifest references)

### No Tests

Zero test files in `src/test/` or `src/androidTest/`. Key untestable paths:
- SGPA calculation logic in `FirestoreSemesterRepository`
- Dashboard aggregation in `HomeViewModel`
- PIN hashing edge cases in `PinHasher`
- Grade validation (nulls, negative credits, out-of-range grades)

### Mixed State Management

| ViewModel | State Mechanism | UI Observation |
|-----------|----------------|----------------|
| `HomeViewModel` | `LiveData<HomeDashboardData>` | `observe()` |
| `HomeViewModel` | `MutableStateFlow<HomeDashboardData>` (unused) | — |
| `SemViewModel` | `StateFlow<SemesterState>` | `lifecycleScope.launch { repeatOnLifecycle { collect() } }` |
| `ProfileViewModel` | `LiveData<Boolean>` | `observe()` |
| `AuthViewModel` | `LiveData`, `postValue` | `observe()` |

Inconsistency: `LiveData` in 3 ViewModels, `StateFlow` in 1. `HomeViewModel` declares both `_cachedDashboard` (LiveData) and a `MutableStateFlow` that is only assigned but never collected.

### Dead Code

- **Room layer** (`data/local/` — `AppDatabase`, `UserDao`, `SemesterDao`, `GradeDao`) — unused since Firestore migration. Room KSP processor still runs.
- **Room dependencies** — `room-runtime`, `room-ktx`, `room-compiler` (KSP) still declared in `libs.versions.toml` and `build.gradle.kts`
- **`HomeViewModel.MutableStateFlow<HomeDashboardData>`** — declared, assigned, but never observed by any fragment
- **`SemesterCurriculum`** — hard-coded list of courses per semester (`courseData: Map<Int, List<Course>>`), may drift from actual university curriculum

### Error Handling Gaps

- `PinHasher` does not handle hash/salt length mismatches on verify
- `FirestoreSemesterRepository.updateGradeField()` does not validate grade values before write
- `FirestoreSemesterRepository.computeSgpa()` silently returns `0.0` if totalCredits=0 (division by zero guard is present, but caller gets no signal of abnormal data)

### ViewModel Lifecycle

- No `onCleared()` cleanup in any ViewModel
- `viewModelScope.launch` coroutines are not explicitly cancelled (handled implicitly by ViewModel scope)

## Style Observations

- Consistent single-expression function patterns (`= db.collection(...)`)
- No ktlint or detekt configuration file found
- No explicit `.editorconfig` for Kotlin style
