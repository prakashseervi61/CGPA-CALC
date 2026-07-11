# Semora — Project Charter

**Last updated:** 2026-07-10

## Vision
A polished, reliable GPA calculator for engineering students that works offline-first and supports multiple branches. Shareable with friends and batchmates without friction.

## Target Audience
- Engineering students (friends & batchmates)
- First launch -> pick a branch -> enter grades -> see CGPA in under 30 seconds

## Current State
- Core flow works: anonymous auth → profile picker → PIN → main tabs (Home, Semester, Profile)
- Known instability: crashes on offline, first grade entry, tab switches, profile edits
- Single branch: Information Technology (hard-coded course data)
- No tests, no crash reporting, dead Room code still bundled

## Tech Stack
- **Kotlin** + **AndroidX** (ViewModel, LiveData/StateFlow, Navigation)
- **Firebase Firestore** (primary data store, offline persistence enabled)
- **Firebase Auth** (anonymous sign-in)
- **Material Design 3** (partial — needs full polish)
- **Room** (legacy — to be removed)

## Guiding Principles
1. **Stability first** — features on a broken app = frustration
2. **Incremental delivery** — ship each phase before starting the next
3. **Test-covered core** — unit tests before feature expansion to prevent regressions
4. **No new dependencies** unless they replace a bigger maintenance burden

## Roadmap Summary

| Phase | Title | Timeline |
|-------|-------|----------|
| 1 | Stability Hardening | Next |
| 2 | UI Polish (M3 + States) | After Phase 1 |
| 3 | Test Coverage | After Phase 2 |
| 4 | Multi-Branch Curriculum | After Phase 3 |
| 5 | PDF / Image Report Export | After Phase 4 |

See [ROADMAP.md](./ROADMAP.md) for detailed phase breakdown.
