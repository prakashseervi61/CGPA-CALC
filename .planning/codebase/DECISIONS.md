# Decisions: Semora

**Last updated:** 2026-07-10
**Focus:** Architectural Decision Records (lightweight ADRs)

## ADR-001: Firestore over Room

- **Status:** Accepted
- **Date:** ~2025 (migration completed)
- **Context:** Original app used Room (local SQLite) for all data. Needed cross-device access.
- **Decision:** Migrate to Cloud Firestore as primary data store. Room kept for backward compatibility during transition; should be removed.
- **Tradeoff:** Offline support via Firestore persistence cache (not Room). Works offline but less query flexibility than Room.

## ADR-002: Anonymous Auth over Sign-up

- **Status:** Accepted
- **Context:** Avoids friction of email/password registration. Target user is a student who just wants to calculate GPA.
- **Decision:** `FirebaseAuth.signInAnonymously()` on app start. No account creation UI.
- **Tradeoff:** No password reset, no recovery if device is lost. Data tied to device's anonymous UID.

## ADR-003: Nested Map Grades (No Subcollection)

- **Status:** Accepted
- **Context:** Semesters contain 5-8 courses each. Need to load all courses in one document read.
- **Decision:** Store `grades: Map<String, GradeDoc>` inside the semester document, not as a subcollection.
- **Tradeoff:** Firestore document size limit (1 MiB) — fine for 8 semesters × 8 courses = 64 grade entries. Failed writes update the entire map, not individual subcollection docs.

## ADR-004: One-Shot Reads over Snapshot Listeners

- **Status:** Accepted
- **Context:** GPA data changes infrequently (once per grade entry). Real-time listeners would be overkill.
- **Decision:** Use `get().await()` (one-shot) everywhere. No `addSnapshotListener`.
- **Tradeoff:** Stale data shown until next manual refresh (tab switch, pull-to-refresh, or cold start). No cross-device real-time sync.

## ADR-005: `.set(SetOptions.merge())` over `.update()`

- **Status:** Accepted (2026-07)
- **Context:** `.update()` crashes when the document doesn't exist. Grade creation flow could write to a non-existent semester doc.
- **Decision:** Use `.set(data, SetOptions.merge())` for all grade and summary writes.
- **Tradeoff:** Merge doesn't detect field conflicts. If two clients write to different fields simultaneously, no conflict error — last write wins per field.

## ADR-006: Custom Bottom Nav over NavigationBarView

- **Status:** Accepted
- **Context:** Needed full control over tab animation (dot indicators, custom colors per tab).
- **Decision:** Manual `LinearLayout` of `ImageView` + `TextView` pairs driven by `NavController` listener.
- **Tradeoff:** More XML + Kotlin code (~150 lines) vs 30 lines for `NavigationBarView`. No Material 3 bottom nav behavior (badge, ripple, accessibility).

## ADR-007: Stale-While-Revalidate over Always-Refresh

- **Status:** Accepted (2026-07)
- **Context:** Tab switches caused loading spinners even though data hadn't changed. Cold start flashed empty then loaded.
- **Decision:** Show cached `LiveData` immediately, refresh in background.
- **Tradeoff:** Extra complexity in ViewModel (cache state, preload handoff). Edge case: cache can show stale data if Firestore persistence hasn't synced.
