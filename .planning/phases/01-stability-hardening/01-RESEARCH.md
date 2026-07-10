# Phase 1: Stability Hardening - Research

## 1. Crash Pattern Root Causes

### Offline / Network Errors
- All Firestore calls use `get().await()` (one-shot reads). When offline, Firebase SDK throws `FirebaseFirestoreException` with code `UNAVAILABLE`.
- **HomeViewModel** (line 70-83): catches exception but silently returns `null` → shows empty dashboard with no error feedback.
- **ProfileViewModel** (line 50-57): catches exception, silently returns → profile data may not load, user sees stale or empty.
- **SemViewModel.updateGrade()** (line 84-86): catches exception, sets `_errorMessage` — this is the ONLY ViewModel with proper error user feedback.
- **SemViewModel.loadSemester()** (line 109-112): catches exception silently, just sets `_isLoading = false`.
- **FirestoreProfileRepository.updatePin/updateUsername/deleteProfile**: all use `.update()` which throws if the document doesn't exist.

### First-Grade-Entry Crash
- Already partially fixed: `updateGradeField()` (line 80-88) uses `SetOptions.merge()`, so it creates the semester doc if missing.
- `updateSemesterSummary()` (line 95-102) also uses `SetOptions.merge()`.
- **Risk:** `saveSemester()` (line 67-72) uses `.set()` without `SetOptions.merge()` — if called on an existing doc, it overwrites all fields (including grades). Currently only called from `ProfilePickerActivity` during migration.

### Tab-Switch Crash
- NavOptions fix (`setPopUpTo(startId, false, true)`) was applied earlier. This preserves ViewModels across tab switches.
- Potential remaining issue: `HomeViewModel.loadDashboard()` is called on `onViewCreated()`. If called before `deviceUid` is available (anonymous auth hasn't completed), it silently returns empty data.
- `SemViewModel` caches semesters in `semesterCache` — tab switch returns cache instantly. No crash risk.

### Profile-Edit Crash
- `FirestoreProfileRepository.updateUsername()` (line 48-51) uses `.update()`. If the profile doc doesn't exist → crash.
- `FirestoreProfileRepository.updatePin()` (line 53-60) uses `.update().` Same crash.
- `FirestoreProfileRepository.deleteProfile()` (line 67-69) uses `.delete()` which doesn't crash if doc doesn't exist.
- These should use `.set(merge())` to match the semester pattern.

## 2. Technical Approach Per Deliverable

### Offline Resilience
- **Current:** Firestore offline persistence enabled in `SemoraApplication.kt:38-42`. Firebase SDK already caches read results and queues writes.
- **What's missing:** Graceful error handling when offline + clear user feedback on write failures.
- **Approach:**
  - Extend `_errorMessage` pattern (currently in SemViewModel only) to HomeViewModel and ProfileViewModel
  - Add inline error card to layouts: `MaterialCardView` with error message + retry button, visibility controlled by `errorMessage` LiveData
  - Pull-to-refresh on SemesterFragment using `SwipeRefreshLayout`
  - `computeSgpa()` division by zero: add guard returning `0.0` (already present) but caller should not silently accept 0.0 CGPA

### Preload Removal
- Delete `FirestoreSemesterRepository.preload()` (lines 30-36) and `consumePreloaded()` (lines 38-42)
- Delete `@Volatile var preloadedSemesters` (line 27)
- Delete preload call in `PinVerificationActivity` line 137
- Delete consume check in `HomeViewModel` lines 61-68
- Firestore persistence cache handles cold-start reads automatically

### Room Removal
- **`libs.versions.toml`:** Comment out lines 28-30 (`androidx-room-runtime`, `androidx-room-ktx`, `androidx-room-compiler`)
- **`app/build.gradle.kts`:** Comment out lines 35-37 (KSP arg `room.schemaLocation`), lines 47-50 (Room dependencies block), line 3 (KSP plugin not needed if no other processor uses it — but Firebase doesn't use KSP, so keep KSP only if needed elsewhere)
- **`SemoraApplication.kt`:** Remove line 10 (`import AppDatabase`), remove `runMigration()` method (lines 54-133) since migration is complete, remove `applicationScope` (line 22) if no longer needed for other coroutines
- **Delete:** Entire `app/src/main/java/com/prakash/semora/data/local/` directory
- **Note:** The `KEY_MIGRATION_DONE` SharedPreferences flag may make `runMigration()` a no-op for existing users, but removing it is cleaner. Users who never migrated will lose Room data — check if acceptable.
- **Dead MutableStateFlow:** In HomeViewModel, remove the unused `MutableStateFlow<HomeDashboardData>` (declared but never collected).

### Error Card UI Pattern
- SemViewModel already has the `_errorMessage` StateFlow + `clearError()` pattern
- Extend to HomeViewModel and ProfileViewModel:
  ```kotlin
  private val _errorMessage = MutableLiveData<String?>()
  val errorMessage: LiveData<String?> = _errorMessage
  fun clearError() { _errorMessage.value = null }
  ```
- Add `MaterialCardView` in each fragment layout, visibility bound to error message:
  ```xml
  <com.google.android.material.card.MaterialCardView
      android:id="@+id/errorCard"
      android:visibility="gone"
      app:cardBackgroundColor="@color/error_container">
      <LinearLayout horizontal>
          <ImageView ... />  <!-- error icon -->
          <TextView android:id="@+id/errorText" ... />
          <Button android:id="@+id/retryButton" text="Retry" ... />
      </LinearLayout>
  </MaterialCardView>
  ```

### Auto-Retry Pattern
- For transient errors: retry the Firestore call once after 2s delay
- Keep it simple — retry the `await()` call in a `try { delay(2000); ... }` wrapper before falling through to error display

## 3. Files to Modify

| File | Change |
|------|--------|
| `FirestoreSemesterRepository.kt` | Delete preload(), consumePreloaded(), preloadedSemesters field (lines 26-42) |
| `HomeViewModel.kt` | Delete consumePreloaded check (61-68), add _errorMessage + clearError(), remove dead MutableStateFlow |
| `ProfileViewModel.kt` | Add _errorMessage + clearError() |
| `PinVerificationActivity.kt` | Delete preload() call (line 137) |
| `FirestoreProfileRepository.kt` | Change .update() → .set(merge()) for updateUsername, updatePin |
| `SemoraApplication.kt` | Remove Room import, migration code, applicationScope |
| `app/build.gradle.kts` | Comment out Room deps, KSP arg |
| `gradle/libs.versions.toml` | Comment out Room library entries |
| `data/local/` | Delete entire directory |
| `fragment_home.xml` | Add error card MaterialCardView |
| `fragment_semester.xml` | Add SwipeRefreshLayout for pull-to-refresh |
| `fragment_profile.xml` | Add error card MaterialCardView |

## 4. Side Effects & Risks

- **Migration code removal:** If any user has Room data that hasn't been migrated to Firestore (e.g. downgraded app or never ran migration), removing the migration code will lose that data. The `KEY_MIGRATION_DONE` flag check in SharedPreferences makes this effectively already the case for existing users.
- **KSP plugin removal:** KSP is only used for Room annotation processing. If removed and no other processor needs it, builds will be faster. However, the `google-devtools-ksp` plugin in `build.gradle.kts` (root) and `app/build.gradle.kts` line 3 should be removed.
- **`saveSemester()` overwrite risk:** Uses `.set()` (not merge) — if called on an existing semester, grades get wiped. Currently only called during Room migration path (which we're removing), so this is safe.

## 5. Testing Approach

- Manual verification only (no test infrastructure exists yet):
  1. Add grades, switch tabs, verify no crashes (30-min test)
  2. Enable airplane mode, verify app shows cached data silently
  3. Tap "Retry" on error card, verify it retries the Firestore call
  4. Delete Room deps, build and run, verify no compile errors
  5. Create new profile, enter grades, verify .set(merge()) creates semester doc

## RESEARCH COMPLETE
