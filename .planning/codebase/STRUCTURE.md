# Structure: Semora

**Last updated:** 2026-07-10
**Focus:** Directory layout and file organization

```
Semora/
├── build.gradle.kts                          # Root build — plugin declarations
├── settings.gradle.kts                       # Repository config
├── gradle.properties                         # JVM args, Kotlin options
├── gradle/
│   └── libs.versions.toml                    # Version catalog
├── google-services.json                      # Firebase config (untracked)
├── app/
│   ├── build.gradle.kts                      # App module — deps, buildConfig
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml           # Activity declarations, permissions
│       │   ├── java/
│       │   │   ├── com/example/semora/       # Entry points (4 files)
│       │   │   │   ├── SemoraApplication.kt
│       │   │   │   ├── BaseActivity.kt
│       │   │   │   ├── SplashActivity.kt
│       │   │   │   └── MainActivity.kt
│       │   │   └── com/prakash/semora/       # Business logic (~25 files)
│       │   │       ├── data/
│       │   │       │   ├── local/            # Room (legacy, 4 files)
│       │   │       │   ├── remote/           # Firestore repos + DTOs (4 files)
│       │   │       │   └── SemesterCurriculum.kt
│       │   │       ├── model/                # Domain models (5 files)
│       │   │       ├── ui/
│       │   │       │   ├── auth/             # Auth flow (~8 files)
│       │   │       │   ├── home/             # CGPA dashboard (2 files)
│       │   │       │   ├── semester/         # Grade entry (4 files)
│       │   │       │   └── profile/          # Profile management (~8 files)
│       │   │       └── utils/                # Helpers (3 files)
│       │   └── res/
│       │       ├── drawable/                 # Icons — grades (A+, A, etc.), nav icons
│       │       ├── font/                     # Inter typeface (4 weights)
│       │       ├── layout/                   # 19 XML layouts (fragments, activities)
│       │       ├── values/                   # colors.xml, strings.xml, themes.xml, dimens.xml
│       │       └── mipmap-*/                 # App launcher icons
│       └── test/                             # Empty (no test files)
│       └── androidTest/                      # Empty (no instrumented tests)

Total: ~63 source files, ~8100 lines
```

## Layout File Index

| Layout | Purpose |
|--------|---------|
| `activity_splash.xml` | Splash screen — app icon centered |
| `activity_main.xml` | Main shell — NavHostFragment + bottom nav bar |
| `activity_profile_picker.xml` | Profile list with empty state + CTA |
| `activity_register.xml` | New profile creation form |
| `activity_pin_verification.xml` | 4-digit PIN entry |
| `activity_change_pin.xml` | Change PIN screen |
| `activity_edit_profile.xml` | Edit profile details |
| `activity_manage_profiles.xml` | Profile list management |
| `fragment_home.xml` | Dashboard — CGPA card, semester cards, skeleton |
| `fragment_semester.xml` | Grade list for one semester, skeleton |
| `fragment_profile.xml` | Profile settings, skeleton |
| `item_profile.xml` | Profile picker card |
| `item_manage_profile.xml` | Manage profile row |
| `item_create_profile.xml` | Create profile button card |
| `item_semester_pill.xml` | Semester chip/selector pill |
| `item_subject.xml` | Course row in semester list |
| `bottom_sheet_grade_picker.xml` | Grade selection bottom sheet |
| `bottom_sheet_avatar_options.xml` | Avatar color picker bottom sheet |
| `dialog_pin_verify.xml` | PIN verification dialog |

## File Count by Package

| Package (com.prakash.semora.*) | Files |
|--------------------------------|-------|
| `data/remote/` | 4 |
| `data/local/` | 4 |
| `data/` (SemesterCurriculum) | 1 |
| `model/` | 5 |
| `ui/auth/` | 8 |
| `ui/home/` | 2 |
| `ui/semester/` | 4 |
| `ui/profile/` | 8 |
| `utils/` | 3 |
