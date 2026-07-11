# Stack: Semora

**Last updated:** 2026-07-10
**Focus:** Technology stack and dependencies

## Language & Runtime

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Kotlin | 1.9.x (via AGP 9.2.1) |
| JVM Target | Java | 17 |
| Min SDK | Android | 24 (Android 7.0) |
| Target SDK | Android | 34 (Android 14) |
| Build System | Gradle with Kotlin DSL | AGP 9.2.1 |

## Core Frameworks

- **AndroidX AppCompat** (`1.6.1`) — backward-compatible Material theme support
- **Material 3** (`1.10.0`) — Material Design 3 components (cards, bottom nav, dialogs, progress indicators)
- **AndroidX ConstraintLayout** (`2.1.4`) — primary layout engine
- **AndroidX Activity KTX** (`1.8.0`) — `enableEdgeToEdge()`, `ActivityResultLauncher`
- **View Binding** — type-safe view access (enabled in `buildFeatures`)

## Architecture & Data

- **Firebase Firestore** (`firebase-bom 32.7.0`, `firebase-firestore-ktx`) — primary data store (grades, profiles, semesters)
- **Firebase Auth** (`firebase-auth-ktx`) — anonymous authentication per device
- **Room** (`2.8.4`) — still declared as dependency, migration to Firestore is complete; no new Room usage
- **kotlinx-coroutines-play-services** (`1.8.1`) — `await()` bridge for Firebase Tasks

## Navigation

- **AndroidX Navigation** (`2.7.5`) — `NavHostFragment` with bottom-nav tab switching
  - `navigation-fragment-ktx` — `NavHostFragment`, `NavController`
  - `navigation-ui-ktx` — not used for bottom nav (custom tab bar)

## Lifecycle

- **AndroidX Lifecycle** (`2.6.2`) — `ViewModel` (via `AndroidViewModel`), `LiveData`, `StateFlow`
  - `lifecycle-viewmodel-ktx` — `viewModelScope`
  - `lifecycle-livedata-ktx` — `observe()` extensions

## Testing

| Framework | Usage |
|-----------|-------|
| JUnit `4.13.2` | Unit tests |
| AndroidX Test JUnit `1.1.5` | Instrumented tests |
| AndroidX Espresso `3.5.1` | UI tests |

No test files currently exist in the codebase.

## Development Tools

- **KSP** (`google-devtools-ksp 2.3.9`) — Room annotation processing
- **Google Services** (`com.google.gms.google-services 4.4.2`) — Firebase plugin (google-services.json for project config)

## Key Configuration Files

| File | Purpose |
|------|---------|
| `build.gradle.kts` (root) | Plugin declarations |
| `app/build.gradle.kts` | App module dependencies, build config |
| `settings.gradle.kts` | Repository config, project includes |
| `gradle/libs.versions.toml` | Version catalog (single source for dependency versions) |
| `gradle.properties` | Gradle JVM args, Kotlin options |
| `app/src/main/AndroidManifest.xml` | Activity declarations, permissions |
| `google-services.json` | Firebase project configuration (not tracked in git) |

## UI Layer

- **Custom bottom navigation** (not `NavigationBarView`) — 3 tabs: Home, Semester, Profile
- **Bottom sheets** — `MaterialAlertDialogBuilder` for grade selection, avatar options
- **Custom animations** — `ValueAnimator` for CGPA counter, `ObjectAnimator` for PIN entry
- **Layout files** — 19 XML layouts in `res/layout/`
- **Custom font** — Inter typeface bundled as `@font/inter_*`
