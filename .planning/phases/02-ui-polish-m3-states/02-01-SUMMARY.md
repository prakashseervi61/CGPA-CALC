# Summary: 02-01 — M3 Foundation

**Phase:** 02-ui-polish-m3-states | **Plan:** 01 | **Wave:** 1
**Status:** ✅ Complete

## Tasks

### Task 1: Dialog theme overlay + AlertDialog migration + STRUCTURE.md fix
- Added `ThemeOverlay.Semora.Dialog` and `ThemeOverlay.Semora.Dialog.Destructive` styles to themes.xml
- Added `Widget.Semora.Dialog.DestructiveButton` style (error-colored positive button)
- Migrated EditProfileActivity from `AlertDialog.Builder` to `MaterialAlertDialogBuilder` with theme overlay
- ProfileFragment: theme picker uses `ThemeOverlay.Semora.Dialog`, logout confirm uses `Destructive`
- SemesterFragment: reset dialog uses `Destructive`
- ManageProfilesActivity: delete confirm uses `Destructive`
- Updated STRUCTURE.md layout index to match actual 19 files on disk

### Task 2: ShimmerDrawable + bg_nav_pill + anim XMLs
- Created `ShimmerDrawable.kt` — ValueAnimator-based shimmer with LinearGradient sweep, lifecycle-aware start/stop via setVisible
- Created `bg_nav_pill.xml` — 20dp-radius rectangle with `md3_primary_container` fill
- Created 4 slide anim XMLs: `slide_in_right`, `slide_out_left`, `slide_in_left`, `slide_out_right` (200ms each)

### Task 3: BaseActivity edge-to-edge + keyboard + activity migration
- BaseActivity: added `enableEdgeToEdge()` in onCreate, `OnApplyWindowInsetsListener` on decorView for system bars + IME insets
- SplashActivity: changed from `AppCompatActivity` to `BaseActivity()`
- ProfilePickerActivity: changed from `AppCompatActivity` to `BaseActivity()`
- Removed unused AppCompatActivity import from SplashActivity

## Verification
- `./gradlew assembleDebug` — BUILD SUCCESSFUL
