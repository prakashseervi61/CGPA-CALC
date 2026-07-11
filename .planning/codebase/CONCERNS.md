# Concerns: Semora

**Last updated:** 2026-07-10
**Focus:** Risks, pain points, and areas needing attention

## 🔴 High Risk

### No Data Backup / Recovery
All user data lives in Firestore under anonymous auth UIDs. If the device changes or the anonymous account expires (Firebase allows but doesn't enforce), all data is lost. No export, no account recovery, no data portability.

### No Error Visibility
Firestore writes fail silently in production — try/catch logs to stdout only. There's no crash reporting, no analytics, no way to know if users are hitting Firestore quota limits or permission errors.

### Non-Room Architecture Still Has Room Dependency
Room schema processor (`room.schemaLocation`) still runs on every build, and Room classes compile into the APK. Dead code with no test coverage = maintainability risk.

## 🟡 Medium Risk

### Two Package Namespaces
Dual `com.example.semora` and `com.prakash.semora` packages complicate refactoring. Any cross-package refactor requiring `internal` visibility will be blocked until consolidation.

### Preloaded Cache on Cold Start Breaks on First Launch
`FirestoreSemesterRepository.preload()` depends on `FirestoreProfileRepository.getProfiles()` succeeding. On first-ever launch (no profiles exist), the loop body never executes, so preload is a no-op — not a crash, but a deceptive cold-start benefit guarantee.

### SGPA Division by Zero
`computeSgpa()` divides by `totalCredits = 0` → returns `0.0` silently. If a semester somehow has zero total credits, the dashboard shows CGPA = 0.0 instead of "N/A" or an empty state.

## 🟢 Low Risk

### Hard-coded Course Data
`SemesterCurriculum` has 8 semesters of hard-coded courses from a specific university branch (Information Technology). The app's "branch" field in ProfileDoc suggests curriculum should be branch-aware, but it's always `SemesterCurriculum.IT`.

### Bottom Nav Uses Raw Drawable Resources
Three-grade icons (filled, unfilled filled/unfilled for each tab = 6 PNGs). Accessible in code but not vectorized — may look fuzzy on high-DPI screens.

### No Pagination
If a student has 8+ semesters, all semester documents are fetched in one `get().await()`. No pagination, no limit — fine for a student's career (8 semesters), risky if data accumulates from other sources.

### Profile Picker Race Condition
`ProfilePickerActivity` calls `FirestoreAuthRepository.ensureSignedIn()` THEN `FirestoreProfileRepository.getProfiles(uid)`. If anonymous sign-in is slow (>2 seconds), the profile list renders empty and then flicks to content when the async call completes. `LiveData` would fix this, not `val profiles = ...`

### PIN Brute Force
No rate limiting on `PinVerificationActivity`. A determined user could brute-force 10,000 4-digit PINs offline if they have access to `pinHash` + `pinSalt` (stored in Firestore). The `pinVersion` field suggests awareness of this, but no lockout or backoff is implemented.
