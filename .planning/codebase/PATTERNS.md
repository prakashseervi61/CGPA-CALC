# Patterns: Semora

**Last updated:** 2026-07-10
**Focus:** Recurring coding patterns and conventions

## Repository Pattern

Every Firestore collection has a dedicated Repository object (singleton, not class):

```kotlin
object FirestoreXxxRepository {
    private val db = FirebaseFirestore.getInstance()
    suspend fun getXxx(): Result = ...
}
```

**When adding new Firestore access:** create a new `object` Repository in `data/remote/`.

## ViewModel Pattern

All ViewModels extend `AndroidViewModel(application)` to access application context:

```kotlin
class FooViewModel(application: Application) : AndroidViewModel(application) {
    private val _state = MutableLiveData<State>()
    val state: LiveData<State> = _state
    fun load() { viewModelScope.launch { ... } }
}
```

**Error handling pattern:**
```kotlin
private val _errorMessage = MutableStateFlow<String?>(null)
val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()
fun clearError() { _errorMessage.value = null }
```

## Caching — Stale-While-Revalidate

Tab ViewModels (Home, Profile) use this pattern to avoid loading spinners:

```kotlin
private var cachedValue: Dashboard? = null

fun loadData() {
    if (cachedValue != null) {
        _data.value = cachedValue  // show stale instantly
    }
    viewModelScope.launch {
        val fresh = repo.fetch()
        cachedValue = fresh
        _data.value = fresh       // update when fresh arrives
    }
}
```

## Preloader Pattern (Ponytail: YAGNI)

`FirestoreSemesterRepository` has a preload/consume mechanism called from `PinVerificationActivity` to pre-warm cache before `MainActivity` loads:

```kotlin
suspend fun preload(deviceUid: String, profileId: String) {
    semesters = getSemesters(deviceUid, profileId)
}
fun consumePreloaded(): List<SemesterDoc>? { ... }
```

**Ponytail verdict:** Firestore offline persistence already serves this purpose. Preload adds 26 lines of machinery for marginal benefit.

## Optimistic UI

Grade updates update the in-memory `SemesterState` immediately, then call Firestore asynchronously. The UI never waits for Firestore:

```kotlin
fun updateGrade(grade: Grade) {
    val newList = currentSemester.grades.map { ... }
    _semesterState.value = currentSemester.copy(grades = newList)
    viewModelScope.launch { repo.updateGradeField(uid, pid, semNum, grade) }
}
```

## Navigation

Bottom tabs use a custom listener on `NavController`:

```kotlin
navController.addOnDestinationChangedListener { _, dest, _ ->
    updateTabSelection(dest.id)
}
```

Fragment navigation happens via `NavHostFragment.findNavController(this)`.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Repositories | `FirestoreXxxRepository` | `FirestoreProfileRepository` |
| ViewModels | `XxxViewModel` | `HomeViewModel` |
| Fragments | `XxxFragment` | `SemesterFragment` |
| Layout files | `fragment_xxx.xml` | `fragment_home.xml` |
| Dialog layouts | `dialog_xxx.xml` | `dialog_change_pin.xml` |
| Activity layouts | `activity_xxx.xml` | `activity_main.xml` |
| DTO data classes | `XxxDoc` | `ProfileDoc`, `SemesterDoc` |
