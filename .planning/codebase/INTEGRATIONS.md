# Integrations: Semora

**Last updated:** 2026-07-10
**Focus:** External services, APIs, and data flow

## Firebase Services

### Firebase Authentication

- **Type:** Anonymous authentication
- **Purpose:** Creates a unique device-scoped identity without requiring user registration
- **Integration point:** `com.prakash.semora.data.remote.FirestoreAuthRepository`
- **API:** `FirebaseAuth.signInAnonymously().await()` — called on app cold start via `SemoraApplication.initFirebase()`
- **Current behavior:** Each device gets an anonymous UID. Profile data is stored under `/devices/{uid}/profiles/`.

### Cloud Firestore

- **Type:** NoSQL document database
- **Purpose:** All persistent data storage (profiles, semester grades)
- **Database structure:**

```
/devices/{deviceUid}/
  /profiles/{profileId}/
    - fields: username, pinHash, pinSalt, pinVersion, avatarColor, branch, createdAt, lastOpened
    /semesters/{semesterNumber}/
      - fields: semesterNumber, sgpa, totalCredits, totalGradedCredits, updatedAt
      - grades: Map<String, GradeDoc> (nested map, not subcollection)
        - key: courseCode (e.g. "MA101")
        - value: { courseCode, courseName, credits, grade }
```

- **Offline persistence:** Enabled via `FirebaseFirestoreSettings.Builder().setPersistenceEnabled(true)`
- **Write strategy:** Uses `.set(SetOptions.merge())` for upserts (creates doc if missing, updates fields if exists)
- **Access pattern:** One-shot reads via `get().await()`, NOT real-time listeners (`addSnapshotListener`)

### Repository Classes

| Class | Responsibility |
|-------|---------------|
| `FirestoreAuthRepository` | Anonymous sign-in, UID access |
| `FirestoreProfileRepository` | CRUD for profiles (name, PIN, branch, avatar) |
| `FirestoreSemesterRepository` | CRUD for semesters + grades, SGPA calculation |

## Local Storage (No External API)

- **SharedPreferences** (`semora_session`) — session state: active profile ID, theme mode, username
- **Room Database** (`semora_db`) — declared as dependency, but migration to Firestore is complete. Room artifacts (UserDao, SemesterDao, GradeDao, AppDatabase) remain in `data/local/` but are no longer actively used.
- **No external REST APIs** — all data flows through Firebase SDK directly

## Absent Integrations (Not Used)

- No Push Notifications (FCM)
- No Analytics (Firebase Analytics)
- No Crash Reporting (Firebase Crashlytics)
- No In-App Purchases
- No Third-party OAuth (Google, GitHub, etc.)
- No File Storage (Firebase Storage)
- No CI/CD pipeline
