---
phase: 02
slug: ui-polish-m3-states
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-11
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | JUnit 4.13.2 (unit) + Espresso 3.5.1 (UI) |
| **Config file** | `app/build.gradle.kts` |
| **Quick run command** | `./gradlew testDebugUnitTest` |
| **Full suite command** | `./gradlew testDebugUnitTest` |
| **Estimated runtime** | ~10s |

---

## Sampling Rate

- **After every task commit:** Run `./gradlew assembleDebug` (build check)
- **After every plan wave:** Run `./gradlew testDebugUnitTest`
- **Before `/gsd-verify-work`:** Full build green + visual inspection
- **Max feedback latency:** 30s

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | M3 theme audit | — | N/A | build | `./gradlew assembleDebug` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | Layout consistency | — | N/A | visual | manual | ✅ | ⬜ pending |
| 02-02-01 | 02 | 2 | Empty/loading states | — | N/A | build | `./gradlew assembleDebug` | ✅ | ⬜ pending |
| 02-02-02 | 02 | 2 | Bottom nav animation | — | N/A | visual | manual | ✅ | ⬜ pending |
| 02-03-01 | 03 | 3 | Transitions | — | N/A | visual | manual | ✅ | ⬜ pending |
| 02-03-02 | 03 | 3 | Edge-to-edge | — | N/A | build | `./gradlew assembleDebug` | ✅ | ⬜ pending |
| 02-03-03 | 03 | 3 | Dialog styling | — | N/A | build | `./gradlew assembleDebug` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| M3 color consistency across all screens | Theme audit | Visual judgment — cannot be automated | Navigate every screen; verify color surface/background/primary match M3 spec |
| Bottom nav pill animation | Nav animation | Animation correctness is visual | Switch between all 3 tabs; verify smooth slide + correct pill position |
| Tab slide transition | Tab transition | Visual | Switch tabs; verify content slides horizontally |
| Semester fade-in | Card transition | Visual | Tap semester card; verify fade-in animation |
| Edge-to-edge system bar rendering | Edge-to-edge | Visual — depends on device | Launch app on device/emulator; verify no content overlap with system bars |
| Keyboard inset animation | Edge-to-edge (keyboard) | Visual | Tap any grade input; verify keyboard pushes content above |
| Empty state display | Empty states | Visual — verify text + CTA | Create new profile at clean state; verify prompt text and button |
| Destructive dialog colors | Dialog styling | Visual | Trigger delete semester dialog; verify errorContainer/red accent |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
