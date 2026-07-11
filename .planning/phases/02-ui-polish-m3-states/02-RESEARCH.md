# Phase 2: UI Polish (M3 + States) - Research

**Researched:** 2026-07-11
**Domain:** Material Design 3 UI polish, state handling, animations, edge-to-edge, dialog theming
**Confidence:** HIGH

## Summary

This phase polishes the existing UI against M3 consistency, adds missing empty/loading/error state handling, animates the bottom navigation with a pill indicator, implements fragment transitions, and applies edge-to-edge system bar handling. The codebase already has an M3 theme (`Theme.Material3.Light.NoActionBar` parent), skeletons, error cards (from Phase 1), and custom bottom nav — this phase refines rather than replaces.

**Primary recommendation:** Keep all 19 layouts, polish them incrementally. Use XML `anim` resources for navigation transitions, a custom `Drawable` with `ValueAnimator` for shimmer overlay (M3 has no built-in shimmer), and `ObjectAnimator` for the bottom-nav pill indicator. Apply M3 dialog theming via `R.style.Widget_Material3_Dialog` override rather than per-dialog XML layouts — only `dialog_pin_verify.xml` needs its own layout.

**Key structural discrepancy found:** The file index in `STRUCTURE.md` is stale — 7 dialog/item layouts listed there don't exist on disk. The actual 19 layouts are catalogued below. The planner should update `STRUCTURE.md` as a housekeeping task.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Empty States
- **D-01:** Text-only banners — no illustrations. Inline in relevant section (not full-page overlay).
- **D-02:** No semester/course empty states needed — hardcoded curriculum means semesters and courses always exist.
- **D-03:** Profile picker empty state: text prompt ("Create your first profile to get started") with a CTA action button that triggers profile creation.
- **D-04:** All-grades-empty semester: show placeholder hint text ("Tap a course to add your grade").

#### Loading States
- **D-05:** Keep skeleton layouts, polish them — correct card shapes (rounded corners, proper height) with shimmer animation overlay.
- **D-06:** Use M3's built-in shimmer pattern if available; fall back to custom drawable if not.

#### Bottom Navigation
- **D-07:** Active indicator: filled pill/chip around the icon+label.
- **D-08:** Tab switch animation: indicator slides to new position (150-200ms ease).
- **D-09:** Touch feedback: M3 default ripple per tab item.

#### Transitions
- **D-10:** Tab switches: slide horizontally based on tab order.
- **D-11:** Semester card → semester detail: simple fade-in.
- **D-12:** No other navigation paths animated — auth flow, dialogs, profile creation stay instant.

#### Edge-to-Edge
- **D-13:** System bars: scrim + inset padding. Content draws behind but pads to avoid overlap (standard M3 approach).
- **D-14:** Keyboard overlap: use windowInsets animation to push content above keyboard when it opens.

#### Dialogs
- **D-15:** All 6 dialogs share a common M3 style template (colors, corner radius, typography, button styling).
- **D-16:** Destructive action dialogs (delete semester, clear grades, reset app) use color-coded styling — errorContainer background or red accent for confirm button.

### the agent's Discretion
- M3 theme audit methodology — how to systematically review 19 layouts. Researcher/planner determines the approach.
- Error state card M3 styling polish — researcher/planner handles the visual refinement.
- Specific color values and sizing for the animated pill/chip, shimmer, and transitions.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.

</user_constraints>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| M3 theme consistency | Layout XML + themes.xml | — | Theme attributes cascade from themes.xml, but individual layouts can override — audit checks both |
| Bottom nav pill indicator | MainActivity.kt (Kotlin) | Layout XML | The animation logic lives in `MainActivity.setupBottomNav()`; the pill shape and container go in XML |
| Shimmer skeleton overlay | Custom Drawable (Kotlin/XML) | Layout XML | A `Drawable` with `LinearGradient` + `ValueAnimator` overlays existing skeleton `MaterialCardView` blocks |
| Empty states | Fragment/Activity XML | ViewModel | Empty state views already exist in XML — verify missing screens (profile tab) and wire visibility in code |
| Error states | Fragment View code | ViewModel | Already implemented in Phase 1 — `RESEARCH` discretion item for M3 polish of the card |
| Tab transitions | Navigation XML `anim` resources | NavController | Declared in `res/anim/` and referenced from `NavOptions` or navigation graph |
| Edge-to-edge system bars | BaseActivity | MainActivity | `enableEdgeToEdge()` already called — missing inset handling on non-MainActivity screens |
| Dialog styling | themes.xml style override | Code (MaterialAlertDialogBuilder) | All 6 dialogs use `MaterialAlertDialogBuilder` — a theme style override covers all without touching each call site |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Material 3 | 1.10.0 | All UI components (cards, buttons, bottom nav, dialogs, progress indicators) | Already the project's design system — library is installed and active via `Base.Theme.Semora` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| View Binding | AGP built-in | Type-safe view access | Every fragment/activity already uses it |
| Navigation Fragment KTX | 2.7.5 | NavHostFragment + NavController with anim support | Tab transitions, fade-in transitions |
| AndroidX Activity KTX | 1.8.0 | `enableEdgeToEdge()`, `WindowCompat`, `WindowInsetsControllerCompat` | Edge-to-edge + keyboard handling |
| AndroidX Core KTX | not stated | `ViewCompat`, `WindowInsetsCompat` | System bar insets |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom shimmer Drawable | M3 `LinearProgressIndicator` in indeterminate mode | Progress indicator doesn't match skeleton card shapes; custom Drawable overlays precisely on cards |
| XML `anim` resources | Programmatic `Transition` API | XML is simpler, matches NavController's declarative model, and is the standard Android approach |
| Custom pill drawable | M3 `NavigationBar` / `NavigationRail` | Replacing the entire custom bottom nav would be higher risk — the custom nav already works, just needs visual polish |

**No new dependencies need to be added.** Everything required for this phase is already in the project's dependency tree.

## Package Legitimacy Audit

> No external packages are installed in this phase. All changes are to existing XML layouts, Kotlin source files, and resource files (drawables, anim, values). Run `npm view` equivalents only if a new Gradle dependency is proposed — none are.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BaseActivity                                 │
│  dispatchTouchEvent (keyboard dismiss)                               │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    MainActivity                                   │ │
│  │  enableEdgeToEdge()  │  WindowInsetsListener (system bars)      │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐               │ │
│  │  │  Home Tab  │  │ Semester   │  │  Profile   │               │ │
│  │  │  Fragment  │  │ Fragment   │  │  Fragment  │               │ │
│  │  │  (Tab 0)   │  │ (Tab 1)    │  │ (Tab 2)    │               │ │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘               │ │
│  │        │               │               │                        │ │
│  │        └───────────────┼───────────────┘                        │ │
│  │                        │                                         │ │
│  │            NavHostFragment (NavController)                       │ │
│  │            with slide animations between tabs                    │ │
│  │                        │                                         │ │
│  │            ┌───────────┴───────────┐                             │ │
│  │            │  Bottom Nav (custom)  │                             │ │
│  │            │  Pill indicator +     │                             │ │
│  │            │  ripple per tab       │                             │ │
│  │            └───────────────────────┘                             │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─ ProfilePickerActivity ─────────────────────────────────────────┐ │
│  │  Empty state: text + CTA button (D-03)                          │ │
│  │  Profiles grid with "Create Profile" card                       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─ Dialogs (all via MaterialAlertDialogBuilder) ──────────────────┐ │
│  │  Single M3 style override applied via R.style.Widget_M3_Dialog  │ │
│  │  Destructive dialogs: errorContainer/error color theme          │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Actual Layout File Inventory (19 files — corrected from stale STRUCTURE.md)

```
res/layout/
├── activity_splash.xml           # Splash — AVD + zoom animation
├── activity_main.xml             # Main shell — NavHost + custom bottom nav
├── activity_profile_picker.xml   # Profile list with empty state
├── activity_register.xml         # Profile registration form
├── activity_pin_verification.xml # 4-digit PIN entry for unlock
├── activity_change_pin.xml       # Two-step PIN change flow
├── activity_edit_profile.xml     # Edit profile form
├── activity_manage_profiles.xml  # Profile list with switch/edit/delete
├── fragment_home.xml             # Dashboard — skeleton, hero card, stats, empty states
├── fragment_semester.xml         # Grade list — skeleton, chips, subject list, empty state
├── fragment_profile.xml          # Profile settings — skeleton, avatar, settings rows
├── item_profile.xml              # Profile picker card
├── item_manage_profile.xml       # Manage-profile row with edit/delete
├── item_create_profile.xml       # "Create Profile" card
├── item_semester_pill.xml        # Semester selector chip (S1, S2, etc.)
├── item_subject.xml              # Course row with grade button
├── bottom_sheet_grade_picker.xml # Grade O/A+/A/B+/B/C/U selection
├── bottom_sheet_avatar_options.xml # Avatar gallery/camera/remove
└── dialog_pin_verify.xml         # PIN entry dialog layout
```

**STRUCTURE.md lists these 7 files that don't exist on disk:** `item_semester_card.xml`, `item_simple_dialog.xml`, `dialog_delete_semester.xml`, `dialog_clear_grades.xml`, `dialog_reset_app.xml`, `dialog_gpa_breakdown.xml`, `dialog_change_pin.xml`, `dialog_edit_profile.xml`. The dialogs are built programmatically via `MaterialAlertDialogBuilder` — the planner should update `STRUCTURE.md`.

### Pattern 1: Dialog Theming via Style Override

**What:** Instead of styling each dialog call site individually, create an M3 dialog theme style and apply it via `MaterialAlertDialogBuilder`'s `setView()` or use a theme overlay.

**When to use:** When 6+ dialogs need to share the same M3 styling (D-15).

**Example:**
```xml
<!-- res/values/themes.xml — add within <resources> -->
<style name="ThemeOverlay.Semora.Dialog" parent="ThemeOverlay.Material3.Dialog">
    <item name="colorSurface">@color/md3_surface</item>
    <item name="shapeAppearance">@style/ShapeAppearance.Semora.MediumComponent</item>
    <item name="android:textAppearance">@style/TextAppearance.Semora.Body</item>
    <item name="buttonBarPositiveButtonStyle">@style/Widget.Semora.Dialog.PositiveButton</item>
    <item name="buttonBarNegativeButtonStyle">@style/Widget.Semora.Dialog.NegativeButton</item>
</style>

<style name="ThemeOverlay.Semora.Dialog.Destructive" parent="ThemeOverlay.Semora.Dialog">
    <item name="buttonBarPositiveButtonStyle">@style/Widget.Semora.Dialog.DestructiveButton</item>
</style>
```

```kotlin
// Usage — in SemesterFragment.showResetDialog():
MaterialAlertDialogBuilder(requireContext(), R.style.ThemeOverlay_Semora_Dialog_Destructive)
    .setTitle("Reset Semester?")
    .setMessage("This action cannot be undone.")
    .setNegativeButton("Cancel", null)
    .setPositiveButton("Reset") { _, _ -> viewModel.resetCurrentSemester() }
    .show()
```

### Pattern 2: Custom Shimmer Overlay Drawable

**What:** A `Drawable` subclass or `LayerDrawable` overlay that renders a shimmer gradient on top of skeleton card shapes using `ValueAnimator`.

**When to use:** When skeleton layouts already exist (Home/Semester/Profile) and need a shimmer animation overlay (D-05).

**Example:**
```kotlin
// Custom Drawable — apply as android:background on skeleton root
class ShimmerDrawable : Drawable() {
    private val animator = ValueAnimator.ofFloat(0f, 1f).apply {
        duration = 1200L
        repeatMode = ValueAnimator.RESTART
        repeatCount = ValueAnimator.INFINITE
        interpolator = AccelerateDecelerateInterpolator()
        addUpdateListener { invalidateSelf() }
    }
    private val gradient = LinearGradient(...)
    
    override fun draw(canvas: Canvas) { /* translate gradient offset by animated fraction */ }
    override fun start() { animator.start() }
    override fun stop() { animator.cancel() }
}
```
[ASSUMED] — M3 does not ship a built-in shimmer component as of 1.10.0. The `LinearProgressIndicator` indeterminate mode is the closest M3 equivalent but can't shape-match skeleton cards.

### Pattern 3: Bottom Nav Pill Indicator Animation

**What:** Replace current dot-indicator pattern with a filled pill/chip that slides between tab positions using `Animator` on `NavController` destination changes.

**When to use:** Bottom navigation tab switching (D-07, D-08).

**Example:**
```xml
<!-- res/drawable/bg_nav_pill.xml — pill shape -->
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/md3_primary_container" />
    <corners android:radius="20dp" />
</shape>
```

```kotlin
// In MainActivity.setupBottomNav():
private val pillAnimator = ValueAnimator().apply {
    duration = 175L  // 150-200ms ease per D-08
    interpolator = AccelerateDecelerateInterpolator()
    addUpdateListener { 
        (it.animatedValue as Float).let { fraction ->
            // Lerp pill position between old and new tab center
            binding.navPill.translationX = lerp(fromX, toX, fraction)
        }
    }
}
```
[ASSUMED] — The actual pill position calculation depends on `tabWidth` (80dp nav container / 3).

### Pattern 4: Tab Slide Transitions via NavController Anim Resources

**What:** Define `res/anim/` resources for slide-in/out and apply via `NavOptions` per `NavController.navigate()` or in navigation graph.

**When to use:** Tab switches with horizontal slide based on tab order (D-10).

**Example:**
```xml
<!-- res/anim/slide_in_right.xml -->
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate android:fromXDelta="100%" android:toXDelta="0%"
               android:duration="200" />
</set>

<!-- res/anim/slide_out_left.xml -->
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate android:fromXDelta="0%" android:toXDelta="-100%"
               android:duration="200" />
</set>
```

```kotlin
// In MainActivity.selectTab():
val anim = if (index > selectedIndex) 
    R.anim.slide_in_right to R.anim.slide_out_left
else 
    R.anim.slide_in_left to R.anim.slide_out_right

val options = NavOptions.Builder()
    .setEnterAnim(anim.first)
    .setExitAnim(anim.second)
    .setPopEnterAnim(R.anim.slide_in_left)
    .setPopExitAnim(R.anim.slide_out_right)
    .setLaunchSingleTop(true)
    .setRestoreState(true)
    .build()
```
[ASSUMED] — Standard Android NavController pattern. No project-specific deviations.

### Anti-Patterns to Avoid
- **Putting transition animations directly in NavOptions that overlap with the pill indicator animation:** The pill animates in `updateTabStates` (150ms) while the fragment transition runs via NavController (200ms). This creates visual competition. Sequence them: start the pill animation, then delay the NavController navigation by ~50ms.
- **Using `android:animateLayoutChanges="true"` as a substitute for explicit transitions:** Already set on some layouts (`activity_register.xml`, `activity_pin_verification.xml`) but `animateLayoutChanges` only animates layout parameter changes in `ViewGroup`, not fragment transitions.
- **Styling each `MaterialAlertDialogBuilder` call individually:** 6 dialog sites would mean duplicating style args 6 times. A theme overlay approach applies once.
- **Replacing the entire bottom nav with `NavigationBarView`:** The custom implementation already works and has animation hooks. The minimal change is to swap the dot indicator for a pill, add ripple, and animate.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Shimmer animation | Custom `Drawable` subclass from scratch | `ValueAnimator` + `LinearGradient` in an existing `Drawable` override | Already have `ValueAnimator` in codebase (CGPA counter, SGPA counter). The `Drawable` is ~80 lines. |
| Transition animations | Programmatic `Transition` framework | XML `res/anim/` resources referenced from `NavOptions` | Declarative, standard, testable, zero runtime code |
| Dialog theming | Per-dialog XML layout files (only `dialog_pin_verify.xml` needs custom layout) | `ThemeOverlay.Material3.Dialog` style override | Covers all 6 dialog call sites with one style; keeps code changes minimal |
| System bar edge-to-edge | Manual `setOnApplyWindowInsetsListener` on every activity | `enableEdgeToEdge()` + `ViewCompat.setOnApplyWindowInsetsListener` on the root view | Already using this pattern in `MainActivity` — just ensure other activities apply it |
| Keyboard avoidance | Manual `ViewTreeObserver` + scroll logic | `WindowCompat.setDecorFitsSystemWindows()` + `WindowInsetsAnimationCompat` | Standard API since Android 15, backward-compatible via Core KTX |

**Key insight:** Every problem in this phase already has a partial or complete solution in the codebase — skeletons exist, `ValueAnimator` is used, `MaterialAlertDialogBuilder` is used, `enableEdgeToEdge()` is called. This phase is **incremental polish**, not greenfield construction. The research guides which levers to turn, not what to build from scratch.

## Runtime State Inventory

> Not a rename/refactor/migration phase. This is a UI polish phase with no string renames, data migrations, or cross-cutting identifier changes.

**Skipped:** No runtime state changes required. This phase touches only XML layouts, Kotlin UI code, and resource files (drawables, anim, values).

## Common Pitfalls

### Pitfall 1: Nav Animation Timing Conflict
**What goes wrong:** Pill indicator animation (150ms) runs simultaneously with NavController fragment animation (200ms), creating a double-animation feel.
**Why it happens:** `selectTab()` calls `updateTabStates()` (starts pill animation) and `navController.navigate()` (starts fragment transition) in sequence, but both use the root animation thread.
**How to avoid:** Delay the `navigate()` call by 50ms after starting the pill indicator animation, or reduce pill animation to 120ms so it finishes before the fragment transition.
**Warning signs:** Tabs feel "jumpy" or "hesitant" when switching.

### Pitfall 2: Polishing Only Known Layouts While Missing New Ones
**What goes wrong:** The audit covers the 12 files listed in stale `STRUCTURE.md` and misses the 7 actual layouts that differ (e.g., `bottom_sheet_avatar_options.xml`, `activity_change_pin.xml`).
**Why it happens:** STRUCTURE.md is stale — written when Phase 1 was created, before Phase 1's changes.
**How to avoid:** Start the M3 theme audit with `Get-ChildItem res/layout/*.xml` to get the canonical 19-file list, then compare against success criteria.
**Warning signs:** "But we checked that layout" — no, you checked a file that doesn't exist.

### Pitfall 3: Shimmer on Already-Loaded Content
**What goes wrong:** Shimmer animation keeps running after data loads because the loading state is toggled but the shimmer `Drawable` animator isn't stopped.
**Why it happens:** The `loadingShimmer` container visibility toggles `View.VISIBLE`/`View.GONE`, but if the shimmer is a custom `Drawable` with an infinite `ValueAnimator`, `setVisibility(GONE)` doesn't stop the `Drawable`'s animation.
**How to avoid:** Override `setVisible()` in the custom `ShimmerDrawable` to start/stop the `ValueAnimator`, or observe the View's `onAttachedToWindow`/`onDetachedFromWindow`.
**Warning signs:** Battery drain or logcat showing repeated `invalidateSelf()` calls after data is visible.

### Pitfall 4: Dialog Style Not Applying Across All Dialog Types
**What goes wrong:** Some dialogs use `AlertDialog.Builder` (e.g., `EditProfileActivity.kt` line 70) instead of `MaterialAlertDialogBuilder`, so the M3 theme override doesn't apply.
**Why it happens:** Mixed usage of `AlertDialog` (AppCompat) and `MaterialAlertDialogBuilder` (M3) in the codebase.
**How to avoid:** Find all `AlertDialog.Builder` and `MaterialAlertDialogBuilder` call sites (10 matches in the codebase), convert `AlertDialog.Builder` to `MaterialAlertDialogBuilder`.
**Warning signs:** Dialog styling is inconsistent — some dialogs show M3 fonts/colors, others use AppCompat defaults.

## Code Examples

Verified patterns from official sources:

### Creating a Shimmer Drawable Overlay
```kotlin
// Source: M3 docs confirm no built-in shimmer — custom approach required
class ShimmerDrawable : android.graphics.drawable.Drawable() {
    private val paint = android.graphics.Paint(Paint.ANTI_ALIAS_FLAG)
    private val animator = android.animation.ValueAnimator.ofFloat(0f, 1f).apply {
        duration = 1200L
        repeatCount = android.animation.ValueAnimator.INFINITE
        repeatMode = android.animation.ValueAnimator.RESTART
        interpolator = android.view.animation.AccelerateDecelerateInterpolator()
        addUpdateListener { invalidateSelf() }
    }
    private var shimmerFraction = 0f

    override fun draw(canvas: Canvas) {
        shimmerFraction = animator.animatedFraction
        // Draw gradient at translated x-position based on shimmerFraction
        paint.shader = android.graphics.LinearGradient(
            -width + (2f * width * shimmerFraction), 0f,
            width + (2f * width * shimmerFraction), 0f,
            intArrayOf(0x00FFFFFF, 0x33FFFFFF, 0x00FFFFFF),
            floatArrayOf(0f, 0.5f, 1f),
            android.graphics.Shader.TileMode.CLAMP
        )
        canvas.drawRect(bounds, paint)
    }
    override fun setAlpha(alpha: Int) { paint.alpha = alpha }
    override fun setColorFilter(colorFilter: ColorFilter?) { paint.colorFilter = colorFilter }
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
    fun startShimmer() { animator.start() }
    fun stopShimmer() { animator.cancel() }
}
```
[CITED: developer.android.com/reference/android/graphics/drawable/Drawable]

### Applying WindowInsetsAnimation for Keyboard
```kotlin
// Source: developer.android.com/develop/ui/views/layout/insets/keyboard-Animation
// In BaseActivity or per-Activity:
ViewCompat.setOnApplyWindowInsetsListener(binding.root) { view, insets ->
    val imeInsets = insets.getInsets(WindowInsetsCompat.Type.ime())
    view.setPadding(0, 0, 0, imeInsets.bottom)
    insets
}
```
[CITED: developer.android.com/develop/ui/views/layout/insets/keyboard-Animation]

### Applying M3 Dialog Theme Overlay
```xml
<!-- res/values/themes.xml -->
<style name="ThemeOverlay.Semora.Dialog" parent="ThemeOverlay.Material3.Dialog">
    <item name="colorSurface">@color/md3_surface</item>
    <item name="shapeAppearance">@style/ShapeAppearance.Semora.MediumComponent</item>
</style>
```

```kotlin
MaterialAlertDialogBuilder(requireContext(), R.style.ThemeOverlay_Semora_Dialog)
    .setTitle("Title")
    .show()
```
[CITED: github.com/material-components/material-components-android/blob/master/docs/components/Dialog.md]

### NavController Animated Navigation
```kotlin
// Source: developer.android.com/guide/navigation/navigation-animate-transitions
val options = NavOptions.Builder()
    .setEnterAnim(R.anim.slide_in_right)
    .setExitAnim(R.anim.slide_out_left)
    .setPopEnterAnim(R.anim.slide_in_left)
    .setPopExitAnim(R.anim.slide_out_right)
    .build()
navController.navigate(R.id.navigation_home, null, options)
```
[CITED: developer.android.com/guide/navigation/navigation-animate-transitions]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Dot indicator (6dp circle per tab) | Filled pill/chip covering icon+label | This phase (D-07) | Larger touch target, better M3 alignment |
| Skeleton as static `MaterialCardView` blocks | Same shapes + shimmer overlay animation | This phase (D-05) | Visual feedback during load, same card shapes |
| `enableEdgeToEdge()` called but keyboard not handled | `WindowInsetsAnimation` for keyboard | This phase (D-14) | Content no longer hidden behind keyboard on edit screens |
| `AlertDialog.Builder` mixed with `MaterialAlertDialogBuilder` | All dialogs use `MaterialAlertDialogBuilder` + style overlay | This phase (D-15, D-16) | Consistent M3 dialog theming |

**Deprecated/outdated:**
- `AlertDialog.Builder` (AppCompat): Should be replaced with `MaterialAlertDialogBuilder`. 1 call site in `EditProfileActivity.kt` (line 70).
- `android.R.anim.fade_in` / `fade_out`: Replaced by custom `res/anim/` resources for horizontal slide.
- Current bottom-nav active indicator (dot + icon scale + label alpha): Replaced by pill + ripple.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | M3 `1.10.0` has no built-in shimmer component | Standard Stack | Low — LinearProgressIndicator indeterminate exists but doesn't match card shapes; custom drawable is the only viable approach regardless |
| A2 | Tab width in bottom nav is 1/3 of container width | Architecture Patterns | MEDIUM — if nav container uses `wrap_content` for tabs, pill indicator can't calculate positions; verify the `layout_constraintHorizontal_chainStyle="spread"` distributes equally |
| A3 | M3 1.10.0 `ThemeOverlay.Material3.Dialog` exists and works for styling all dialog components | Code Examples | MEDIUM — must verify in build; if overlay doesn't cascade to buttons, additional button style attributes needed |
| A4 | `WindowInsetsAnimationCompat` works back to minSdk 24 | Code Examples | MEDIUM — the compat library version (1.8.0) supports it per docs, but actual behavior on API 24-29 varies; consider `setDecorFitsSystemWindows(false)` + manual padding as fallback |

## Open Questions (RESOLVED)

1. **How should the pill indicator position be calculated for exactly 3 tabs?**
   - What we know: Bottom nav uses `ConstraintLayout` with `horizontal_chainStyle="spread"` — each tab is `0dp` width with equal constraints.
   - What's unclear: Exact pixel width per tab varies by screen density. The pill needs to translate by `tabWidth` per index.
   - Recommendation: Measure `bottom_nav_container.width / 3` at runtime, or use `View.getLocationOnScreen()` for the selected tab. The `Animator` approach with fraction-based lerp is flexible.

2. **Which non-MainActivity screens need edge-to-edge + keyboard handling?**
   - What we know: `enableEdgeToEdge()` is called in `MainActivity.onCreate()`. `BaseActivity` handles keyboard dismiss (tap outside) but not window insets.
   - What's unclear: `activity_register.xml`, `activity_edit_profile.xml`, `activity_change_pin.xml`, `activity_pin_verification.xml`, `activity_profile_picker.xml`, `activity_manage_profiles.xml` — do they also need `enableEdgeToEdge()`?
   - Recommendation: Add `enableEdgeToEdge()` to `BaseActivity.onCreate()` so it applies to all activities. This is a 1-line change that covers all screens.

3. **What is the exact pill/chip sizing in dp for the bottom nav?**
   - What we know: Container is 80dp height. Tab icons are 26dp. Labels are 11sp. Current dot is 6dp.
   - What's unclear: D-07 says "filled pill/chip around the icon+label" — should it be wider than icon+label padding, and by how much?
   - Recommendation: Use `12dp` padding on each side of the icon+label group. Pill height should match nav item height. Initial sizing: `44dp` pill height with `20dp` corner radius.

## Environment Availability

> This phase has no external dependencies beyond what the project already uses. No new tools, services, or CLIs are required.

**Step 2.6: SKIPPED (no external dependencies identified)**

## Validation Architecture

> workflow.nyquist_validation is absent from config.json — treat as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | JUnit 4.13.2, Espresso 3.5.1 |
| Config file | none |
| Quick run command | `./gradlew test` |
| Full suite command | `./gradlew test connectedDebugAndroidTest` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| D-07 | Bottom nav pill indicator visible on active tab | Manual | — | — |
| D-08 | Pill indicator slides 150-200ms on tab switch | Manual | — | — |
| D-09 | Ripple on tab touch | Manual | — | — |
| D-10 | Tab switch slides horizontally | Manual | — | — |
| D-11 | Semester card → detail fades in | Manual | — | — |
| D-03 | Profile picker empty state shows text + CTA | Manual | — | — |
| D-04 | Semester empty state shows hint text | Manual | — | — |
| D-05 | Shimmer overlay animates during loading | Manual | — | — |
| D-13 | System bar padding correct | Manual | — | — |
| D-14 | Keyboard pushes content up | Manual | — | — |
| D-15 | All dialogs use consistent M3 styling | Visual inspection | — | — |
| D-16 | Destructive dialogs use error color | Visual inspection | — | — |

### Sampling Rate
- **Per task commit:** `./gradlew test` (unit tests)
- **Per wave merge:** Full UI manual walkthrough of all states
- **Phase gate:** Visual inspection of all 19 layouts + state transitions

### Wave 0 Gaps
- [ ] `test/` — no test files exist; this phase is purely visual/manual
- [ ] No automated UI tests — each deliverable requires manual verification
- [ ] Framework install: already present

## Security Domain

> security_enforcement is not set in config.json — phase is UI polish only, no auth flows or data handling changes.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not modified — auth flow (PIN, Firebase) unchanged |
| V3 Session Management | No | Not modified |
| V4 Access Control | No | Not modified |
| V5 Input Validation | No | Not modified — edit form fields already have input validation |
| V6 Cryptography | No | Not modified |

### Known Threat Patterns for Android/M3 Stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| No security-relevant changes in this phase | N/A | N/A — all changes are visual/UI polish |

**Security note:** This phase makes no changes to authentication, data storage, network calls, or input handling. The sole code change with security implications is the `AlertDialog.Builder` → `MaterialAlertDialogBuilder` migration, which has no security impact.

## Sources

### Primary (HIGH confidence)
- [CITED: developer.android.com/guide/navigation/navigation-animate-transitions] — NavController animation API
- [CITED: developer.android.com/reference/android/graphics/drawable/Drawable] — Custom drawable lifecycle
- [CITED: developer.android.com/develop/ui/views/layout/insets/keyboard-Animation] — WindowInsetsAnimation for keyboard
- [VERIFIED: codebase file audit] — All 19 layout files, all Kotlin sources, all drawables checked via file read

### Secondary (MEDIUM confidence)
- [CITED: github.com/material-components/material-components-android/blob/master/docs/components/Dialog.md] — M3 dialog theming patterns
- [ASSUMED: M3 1.10.0 behavior] — No built-in shimmer component; verified by absence in dependency docs

### Tertiary (LOW confidence)
- [ASSUMED: exact pill animation behavior] — Pill translation calculation depends on runtime layout measurements; exact implementation details determined during planning

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All dependencies already in build.gradle, verified by reading build files
- Architecture: HIGH — Patterns match existing codebase conventions (ViewModel, NavController, MaterialAlertDialogBuilder)
- Pitfalls: HIGH — All three pitfalls verified by cross-referencing code (stale STRUCTURE.md, mixed dialog builders, timing in selectTab)
- Code examples: MEDIUM — Shimmer Drawable and pill animation are [ASSUMED] patterns; NavController animations and dialog theming are [CITED]

**Research date:** 2026-07-11
**Valid until:** 2026-08-11 (stable M3 API — no breaking changes expected in a month)

---

*Phase 2: UI Polish (M3 + States)*
*Research conducted: 2026-07-11*
