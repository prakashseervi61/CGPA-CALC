# Summary: 02-02 — Bottom Nav Pill + Tab Transitions

**Phase:** 02-ui-polish-m3-states | **Plan:** 02 | **Wave:** 2
**Status:** ✅ Complete

## Tasks

### Task 1: Update bottom nav layout — replace dots with pill + add ripple
- Removed `dot_home`, `dot_semester`, `dot_profile` View elements from all 3 tabs
- Added `nav_pill` View (44dp height, bg_nav_pill drawable) as first child of bottom_nav_container
- Added `android:foreground="?attr/selectableItemBackground"` to each tab FrameLayout (nav_home, nav_semester, nav_profile) for M3 ripple
- Deleted `bg_active_dot.xml` (replaced by bg_nav_pill)

### Task 2: Pill indicator animation + NavController tab transitions + fade-in
- Removed redundant `enableEdgeToEdge()` from MainActivity (BaseActivity handles it)
- Removed `ViewCompat.setOnApplyWindowInsetsListener` from MainActivity (BaseActivity handles it)
- Removed icon scale animation and label alpha animation (pill replaces visual indicator)
- Added pill translation: 175ms AccelerateDecelerate, tabWidth calculated from bottomNavContainer width / 3
- Added NavOptions with slide anims (slide_in_right/out_left or slide_in_left/out_right based on direction)
- Tab 0→1 (Home→Semester) uses fade_in/fade_out instead of slide
- 50ms stagger between pill animation and fragment navigation to avoid visual competition

## Verification
- `./gradlew assembleDebug` — BUILD SUCCESSFUL
