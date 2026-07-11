# Phase 2: UI Polish (M3 + States) - Context

**Gathered:** 2026-07-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Full Material Design 3 consistency across all screens. Proper empty/loading/error states everywhere. Smooth transitions between tabs and navigation paths. Edge-to-edge system bar handling. M3-aligned dialog styling.

Error state cards with retry already implemented in Phase 1 — this phase polishes their M3 styling.

</domain>

<decisions>
## Implementation Decisions

### Empty States
- **D-01:** Text-only banners — no illustrations. Inline in relevant section (not full-page overlay).
- **D-02:** No semester/course empty states needed — hardcoded curriculum means semesters and courses always exist.
- **D-03:** Profile picker empty state: text prompt ("Create your first profile to get started") with a CTA action button that triggers profile creation.
- **D-04:** All-grades-empty semester: show placeholder hint text ("Tap a course to add your grade").

### Loading States
- **D-05:** Keep skeleton layouts, polish them — correct card shapes (rounded corners, proper height) with shimmer animation overlay.
- **D-06:** Use M3's built-in shimmer pattern if available; fall back to custom drawable if not.

### Bottom Navigation
- **D-07:** Active indicator: filled pill/chip around the icon+label.
- **D-08:** Tab switch animation: indicator slides to new position (150-200ms ease).
- **D-09:** Touch feedback: M3 default ripple per tab item.

### Transitions
- **D-10:** Tab switches: slide horizontally based on tab order.
- **D-11:** Semester card → semester detail: simple fade-in.
- **D-12:** No other navigation paths animated — auth flow, dialogs, profile creation stay instant.

### Edge-to-Edge
- **D-13:** System bars: scrim + inset padding. Content draws behind but pads to avoid overlap (standard M3 approach).
- **D-14:** Keyboard overlap: use windowInsets animation to push content above keyboard when it opens.

### Dialogs
- **D-15:** All 6 dialogs share a common M3 style template (colors, corner radius, typography, button styling).
- **D-16:** Destructive action dialogs (delete semester, clear grades, reset app) use color-coded styling — errorContainer background or red accent for confirm button.

### the agent's Discretion
- M3 theme audit methodology — how to systematically review 19 layouts. Researcher/planner determines the approach.
- Error state card M3 styling polish — researcher/planner handles the visual refinement.
- Specific color values and sizing for the animated pill/chip, shimmer, and transitions.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Theme & Design
- `.planning/codebase/STACK.md` — M3 version (1.10.0), custom bottom nav, existing animations
- `.planning/codebase/STRUCTURE.md` — All 19 layout files indexed, complete file tree
- `.planning/codebase/PATTERNS.md` — ViewModel/SWR/error patterns carried forward

### Prior Phase Decisions
- `.planning/phases/01-stability-hardening/01-CONTEXT.md` — D-19 (keep SWR cache), D-20 (keep skeletons), error card pattern established
- `.planning/phases/01-stability-hardening/01-02-SUMMARY.md` — Error card implementation reference

### Implementation Files (Key Source)
- `app/src/main/res/layout/fragment_home.xml` — Dashboard skeleton (polish target)
- `app/src/main/res/layout/fragment_semester.xml` — Grade list skeleton (polish target)
- `app/src/main/res/layout/fragment_profile.xml` — Profile skeleton (polish target)
- `app/src/main/res/layout/activity_main.xml` — Bottom nav bar (animation target)
- `app/src/main/res/layout/activity_profile_picker.xml` — Empty state target
- `app/src/main/res/layout/item_semester_card.xml` — Card layout (fade-in transition)
- `app/src/main/res/values/themes.xml` — Current M3 theme config
- `app/src/main/res/values/colors.xml` — Current color palette
- `app/src/main/res/layout/*.xml` (all 19 layouts) — Theme audit targets
- `app/src/main/java/com/prakash/semora/ui/home/HomeFragment.kt` — Tab nav listener
- `app/src/main/java/com/example/semora/MainActivity.kt` — Bottom nav setup, edge-to-edge config
- `app/src/main/java/com/example/semora/BaseActivity.kt` — Base activity (edge-to-edge candidate)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Error card pattern (MaterialCardView + error icon + message + retry) already implemented in Phase 1 — reuse across all screens.
- M3 `MaterialAlertDialogBuilder` already in use — dialogs can be themed via style override.
- `ValueAnimator` and `ObjectAnimator` already used for CGPA counter and PIN entry — animation infrastructure exists.
- Custom bottom nav listener already in `MainActivity.kt` — animation hooks just need to connect.

### Established Patterns
- Skeletons already exist for Home/Semester/Profile fragments — refine shapes and add shimmer.
- Repository → ViewModel → Fragment data flow unchanged.
- `enableEdgeToEdge()` already called in `BaseActivity.kt`.

### Integration Points
- Bottom nav animation connects into `MainActivity.kt`'s existing `addOnDestinationChangedListener`.
- Tab transitions hook into `NavController`'s `navigate()` with anim resources.
- Empty states are per-fragment XML additions (profile picker, semester detail).
- Dialog theme override via `R.style.Widget_Material3_Dialog` or custom style.
- Keyboard adjustment via `WindowCompat.setDecorFitsSystemWindows()` + `WindowInsetsControllerCompat`.

</code_context>

<specifics>
## Specific Ideas

- Profile picker empty state: centered text + styled "Create Profile" button, above or replacing the FAB.
- Semester placeholder: subtle hint text shown when all grades are `N/A`, fades out once any grade is entered.
- Bottom nav pill/chip: slides with `Animator` on `NavController` destination changes.
- Destructive dialogs: use `M3`'s `colorError` / `colorOnError` for the destructive action button.
- Shimmer: if M3 doesn't provide a built-in, use a custom `Drawable` with `LinearGradient` and `ValueAnimator` for translation animation.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 2-UI Polish (M3 + States)*
*Context gathered: 2026-07-11*
