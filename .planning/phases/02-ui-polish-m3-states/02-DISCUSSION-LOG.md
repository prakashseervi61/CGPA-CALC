# Phase 2: UI Polish (M3 + States) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-11
**Phase:** 2-UI Polish (M3 + States)
**Areas discussed:** Empty state style, Loading state treatment, Bottom nav animation, Transition scope, Edge-to-edge handling, Dialog styling consistency

---

## Empty State Style

| Option | Description | Selected |
|--------|-------------|----------|
| Illustrated cards | Small illustrations per screen type | |
| Text-only banners | Simple text message in styled container | ✓ |
| Full-page centered | Empty state fills main content area | |
| Inline in relevant section | Empty state inside content container | ✓ |
| With CTA button | Each empty state has primary action button | ✓ |
| Text only, no CTA | Just the message | |
| Show placeholder text | "Tap a course to add your grade" hint | ✓ |
| Leave blank | Empty grade fields are self-explanatory | |

**User's choice:** Text-only banners, inline in section. No semester/course states needed (hardcoded curriculum). Profile picker gets text + CTA button. Semester all-grades-empty shows placeholder hint text.

**Notes:** User clarified hardcoded curriculum eliminates the need for semester/course empty states.

---

## Loading State Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Keep skeletons, polish them | Refine current skeleton layouts | ✓ |
| Replace with M3 LinearProgressIndicator | Minimal bar instead of card shapes | |
| Hybrid | Skeletons on first load, bar on refresh | |
| Correct shape + shimmer | Match actual card shapes + moving gradient | ✓ |
| Same shape, smoother animation | Keep current shapes, improve animation timing | |
| Custom shimmer drawable | Full control over gradient animation | |
| M3 pattern (if available) | Less custom code | ✓ |

**User's choice:** Keep skeletons, polish with correct card shapes + shimmer overlay. Use M3 pattern if available.

**Notes:** Consistent with D-20 from Phase 1 (keep skeletons).

---

## Bottom Nav Animation

| Option | Description | Selected |
|--------|-------------|----------|
| Dot indicator | Small colored dot above active tab | |
| Filled pill/chip | Active tab background fills around icon+label | ✓ |
| Underline / accent bar | Thin colored line under label | |
| Slide | Indicator animates to new position | ✓ |
| Fade | Crossfade between tabs | |
| Bouncy spring | Overshoots then settles | |
| M3 default ripple | Standard Material ripple | ✓ |
| Scale bounce on tap | Icon scales down then back + ripple | |
| No extra feedback | Indicator animation only | |

**User's choice:** Filled pill/chip active indicator. Slides to new position on tab switch. M3 default ripple touch feedback.

---

## Transition Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Fade transitions | Content fades between tab switches | |
| Slide horizontally | Content slides based on tab order | ✓ |
| No tab transition | Keep instant switch | |
| Shared element transition | Card expands into detail | |
| Simple fade-in | Semester detail fades in | ✓ |
| Leave instant | No transition | |
| Just the two above | Slide tabs + fade semester detail | ✓ |
| Plus auth flow | Also animate splash/auth/main transitions | |

**User's choice:** Slide horizontally between tabs. Fade-in for semester card → detail. No other navigation paths animated.

---

## Edge-to-Edge Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Scrim + inset padding | Translucent scrim, content pads to avoid overlap | ✓ |
| Transparent bars, draw behind | Fully transparent bars, background extends edge-to-edge | |
| Adjust on keyboard | Push content above keyboard when it opens | ✓ |
| Keep current behavior | Standard adjustResize/adjustPan | |

**User's choice:** Scrim + inset padding for system bars. Adjust on keyboard overlap using windowInsets animation.

---

## Dialog Styling Consistency

| Option | Description | Selected |
|--------|-------------|----------|
| Common M3 template | One base dialog style for all | ✓ |
| Per-dialog customization | Each dialog has unique styling | |
| Color-coded destructive | Error styling for destructive actions | ✓ |
| Same style, different text | All dialogs look the same | |

**User's choice:** Common M3 style template for all dialogs. Destructive actions (delete, clear, reset) use color-coded styling with error colors.

---

## the agent's Discretion

- M3 theme audit methodology — how to systematically review 19 layouts.
- Error state card M3 styling polish.
- Specific color values, sizing for pill/chip, shimmer, and transitions.

## Deferred Ideas

None.
