# Architecture: Semora

**Last updated:** 2026-07-10
**Focus:** System design, patterns, data flow

## Architectural Pattern

**MVVM** (Model-View-ViewModel) with repository layer:

- **Model** — Firestore documents (remote data source) + in-memory ViewModel cache
- **ViewModel** — `AndroidViewModel` subclasses, expose `LiveData`/`StateFlow` to UI
- **View** — `Fragment` subclasses + data-bound XML layouts, observe ViewModel state via `lifecycleScope`

## Package Structure

Two root packages (dual-namespace legacy):

### `com.example.semora` — Entry Points & Framework
| File | Role |
|------|------|
| `SemoraApplication.kt` | Application class — Firebase init, Room→Firestore migration, theme |
| `BaseActivity.kt` | Base activity with edge-to-edge setup |
| `SplashActivity.kt` | Launcher — session check, route to auth or main |
| `MainActivity.kt` | Main shell — bottom nav, tab routing via NavController |

### `com.prakash.semora` — Business Logic & UI

| Package | Contents |
|---------|----------|
| `data/remote/` | `FirestoreAuthRepository`, `FirestoreProfileRepository`, `FirestoreSemesterRepository` + DTOs (`ProfileDoc`, `SemesterDoc`, `GradeDoc`) |
| `data/local/` | Room DAOs (`UserDao`, `SemesterDao`, `GradeDao`) and `AppDatabase` — legacy, no active usage |
| `model/` | Domain models (`Course`, `Semester`, `SemesterState`, `User`, `GradeEntity`) |
| `ui/auth/` | `AuthViewModel`, `ProfilePickerActivity`, `RegisterActivity`, `PinVerificationActivity`, `ProfileAdapter` |
| `ui/home/` | `HomeViewModel`, `HomeFragment` — CGPA dashboard |
| `ui/semester/` | `SemViewModel`, `SemesterFragment`, `SubjectAdapter`, `GradePickerBottomSheet` |
| `ui/profile/` | `ProfileViewModel`, `ProfileFragment`, `EditProfile*`, `ChangePin*`, `ManageProfiles*` |
| `utils/` | `SessionManager`, `PinHasher`, `PinInputHelper` |
| `data/` | `SemesterCurriculum` — hard-coded semester/course definitions and grade-to-point mapping |

## Data Flow

### Grade Entry Flow
```
SemesterFragment → SemViewModel.updateGrade() 
  → in-memory SemesterState updated immediately (optimistic)
  → FirestoreSemesterRepository.updateGradeField() — upsert single grade
  → FirestoreSemesterRepository.updateSemesterSummary() — upsert SGPA
```

### Dashboard Load Flow
```
HomeFragment.onViewCreated() → HomeViewModel.loadDashboard()
  → FirestoreSemesterRepository.getSemesters() — fetch all semesters
  → computeDashboard() — aggregate CGPA, progress stats
  → emit to HomeDashboardData LiveData
```

### Authentication Flow
```
SplashActivity → session check → ProfilePickerActivity (existing profiles)
  → PinVerificationActivity (4-digit PIN) → AuthViewModel.login()
  → FirestoreAuthRepository.ensureSignedIn()
  → FirestoreProfileRepository.getProfile()
  → SessionManager.saveFirebaseSession()
  → MainActivity
```

## Key Design Decisions

### Optimistic UI Updates
Grade changes update `SemesterState` in ViewModel immediately, then persist asynchronously. This makes the grade picker feel instant.

### Stale-While-Revalidate Caching
`HomeViewModel` and `ProfileViewModel` show cached data instantly on tab switch, then refresh from Firestore in background. Shown on cold start via `FirestoreSemesterRepository.preload()`.

### Nested Map over Subcollection
Grades are stored as a `Map<String, GradeDoc>` inside the semester document (not a subcollection). This avoids N+1 reads when loading a semester's courses in a single document read.

### Custom Bottom Nav (No NavigationBarView)
Bottom tab bar is manually built from `ImageView` + `TextView` pairs with dot indicators, driven by `NavController.addOnDestinationChangedListener`. This gives full control over animation and styling.

## Known Technical Debt

- **Two packages** — mix of `com.example.semora` and `com.prakash.semora` should be consolidated
- **Room code not removed** — `data/local/`, Room dependencies, and DAOs remain despite migration being complete
- **No tests** — zero unit or instrumented tests exist
- **KSP arg for Room** — `room.schemaLocation` still configured in build.gradle.kts
- **Mixed state management** — `LiveData` in Home/Profile, `StateFlow` in SemViewModel
