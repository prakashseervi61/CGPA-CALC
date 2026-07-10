# Semora — Roadmap

**Last updated:** 2026-07-10

---

## Phase 1: Stability Hardening

**Goal:** Eliminate systemic crash patterns so the app is reliably usable on any network condition and across all navigation paths.

### Deliverables
- [x] Offline resilience: graceful fallback when Firestore `get().await()` fails (cache-first via Firestore persistence, error card + auto-retry UI, pull-to-refresh on Semester tab)
- [x] First-grade-entry crash fix: `.set(merge())` already on grade write paths — verified during acceptance testing
- [x] Tab-switch crash: ViewModel state preserved (NavOptions fix already applied) — verified during acceptance testing
- [x] Profile-edit crash: `updatePin`, `updateUsername` changed to `.set(SetOptions.merge())` — no crash on missing doc
- [x] Remove dead Room code: `AppDatabase`, DAOs, Room dependencies, KSP processor config — deleted
- [x] Remove dead `HomeViewModel` MutableStateFlow — removed (verified clean)

### Success Criteria
- 30-minute continuous use (add 6 semesters of grades, switch tabs, go offline, come back) produces zero crashes

### Plans
- **2 plans ✓**

Plans:
- [x] `01-01-PLAN.md` — Dead code sweep: remove preload system, Room deps/source/migration, profile edit crash fix
- [x] `01-02-PLAN.md` — Error handling UI: error cards + auto-retry across all tabs, pull-to-refresh on Semester tab

---

## Phase 2: UI Polish (M3 + States)

**Goal:** Full Material Design 3 consistency across all screens. Proper empty/error/loading states everywhere. Smooth transitions.

### Deliverables
- [ ] M3 theme audit: consistent color surface/background/primary across all layouts
- [ ] Bottom nav: proper Material ripple, animated dot indicator
- [ ] Empty states: illustrations/text for "No semesters yet", "No courses", "No profiles"
- [ ] Loading states: replace skeleton layouts with cleaner shimmer or M3 `LinearProgressIndicator`
- [ ] Error states: inline error cards with retry button (currently just `_errorMessage` text)
- [ ] Smooth transitions: shared element transitions between semester card → semester detail
- [ ] Edge-to-edge: verify `enableEdgeToEdge()` handles system bars on all screens

### Success Criteria
- All 19 XML layouts reviewed and updated for M3 consistency
- Every screen has empty / loading / error state handled
- No flicker or jump during navigation transitions

---

## Phase 3: Test Coverage

**Goal:** Unit tests for core business logic to enable safe refactoring during feature expansion.

### Deliverables
- [ ] Test `FirestoreSemesterRepository.computeSgpa()` — edge cases: empty grades, zero credits, mix of letter grades
- [ ] Test `PinHasher.hash()` / `PinHasher.verify()` — valid, invalid, empty PIN, length mismatch
- [ ] Test `SemesterCurriculum` mapping
- [ ] Test `HomeViewModel` dashboard aggregation logic (mock repo)
- [ ] Test `SemViewModel.updateGrade()` state transitions
- [ ] Test `FirestoreProfileRepository.docToProfile()` — null fields, missing fields, type coercion

### Success Criteria
- All ViewModel and repository core logic covered by unit tests
- Tests pass on `./gradlew test`

---

## Phase 4: Multi-Branch Curriculum

**Goal:** Support 2-3 branches (IT, CS, ECE). Branch name displayed on dashboard and profile.

### Deliverables
- [ ] Add branch enum/sealed class: `IT`, `CS`, `ECE`
- [ ] Branch picker in profile creation screen (currently hard-coded "Information Technology")
- [ ] Branch display on home dashboard ("Information Technology - 3rd Semester")
- [ ] Store branch in `ProfileDoc` (already has `branch` field, just needs UI to set it)
- [ ] Update `SemesterCurriculum` to return courses per branch label
- [ ] Branch edit in profile settings screen

### Success Criteria
- User can create 3 profiles with different branches
- Dashboard shows correct branch label per profile
- Curriculum courses match selected branch

---

## Phase 5: PDF / Image Report Export

**Goal:** Shareable semester report card — exported as PDF or image.

### Deliverables
- [ ] Generate PDF with course list, grades, SGPA, CGPA
- [ ] Share intent (system share sheet)
- [ ] Optional: export all semesters as single report
- [ ] Layout: branded header, course table, summary section

### Success Criteria
- Single tap generates a shareable report from current semester view
- PDF renders correctly on device and when shared

---

## After Phase 5 — Open Questions

- Account system migration (anonymous → email/Google)?
- Data export/import for backup?
- Grade forecasting / what-if simulator?
- Play Store release?
