package com.prakash.semora.ui.semester

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.SemesterCurriculum
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreSemesterRepository
import com.prakash.semora.data.remote.GradeDoc
import com.prakash.semora.data.remote.SemesterDoc
import com.prakash.semora.model.Course
import com.prakash.semora.model.SemesterState
import com.prakash.semora.utils.SessionManager
import com.prakash.semora.utils.SgpaCalculator
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SemViewModel(
    application: Application,
    private val repo: FirestoreSemesterRepository = FirestoreSemesterRepository
) : AndroidViewModel(application) {

    private val sessionManager = SessionManager(application)
    private val profileId get() = sessionManager.getFirebaseProfileId() ?: ""
    private var deviceUid: String = ""

    private val _currentState = MutableStateFlow(SemesterState.empty(1))
    val currentState: StateFlow<SemesterState> = _currentState.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val semesterCache = mutableMapOf(1 to _currentState.value)

    init {
        viewModelScope.launch {
            deviceUid = FirestoreAuthRepository.getUid() ?: ""
            if (deviceUid.isNotEmpty()) loadSemester(1)
        }
    }

    fun selectSemester(number: Int) {
        if (number == _currentState.value.semesterNumber) return

        semesterCache[_currentState.value.semesterNumber] = _currentState.value

        semesterCache[number]?.let {
            _currentState.value = it
            return
        }

        val empty = SemesterState.empty(number)
        semesterCache[number] = empty
        _currentState.value = empty
        loadSemester(number)
    }

    fun updateGrade(courseCode: String, grade: String) {
        val current = _currentState.value
        val updatedCourses = current.courses.map {
            if (it.code == courseCode) it.copy(grade = grade) else it
        }
        val state = computeState(current.semesterNumber, updatedCourses)
        semesterCache[current.semesterNumber] = state
        _currentState.value = state

        viewModelScope.launch {
            if (deviceUid.isEmpty() || profileId.isEmpty()) return@launch
            val graded = updatedCourses.filter { it.grade.isNotEmpty() }
            val course = updatedCourses.firstOrNull { it.code == courseCode } ?: return@launch
            val gradeDoc = GradeDoc(course.code, course.name, course.credits, course.grade)
            try {
                FirestoreSemesterRepository.updateGradeField(
                    deviceUid, profileId,
                    current.semesterNumber, courseCode, gradeDoc
                )
                FirestoreSemesterRepository.updateSemesterSummary(
                    deviceUid, profileId,
                    current.semesterNumber, state.sgpa,
                    state.totalCredits,
                    graded.sumOf { it.credits }
                )
            } catch (e: Exception) {
                _errorMessage.value = "Couldn't save grade — check your connection"
            }
        }
    }

    private fun loadSemester(number: Int) {
        _isLoading.value = true
        viewModelScope.launch {
            if (deviceUid.isEmpty() || profileId.isEmpty()) {
                _isLoading.value = false
                return@launch
            }
            try {
                val saved = FirestoreSemesterRepository.getSemester(deviceUid, profileId, number)
                _isLoading.value = false
                if (saved == null || saved.grades.isEmpty()) return@launch
                val data = SemesterCurriculum.getSemester(number)
                val courses = data.courses.map { template ->
                    val match = saved.grades[template.code]
                    if (match != null) template.copy(grade = match.grade) else template
                }
                val state = computeState(number, courses)
                semesterCache[number] = state
                _currentState.value = state
            } catch (e1: Exception) {
                delay(2000)
                try {
                    val saved = FirestoreSemesterRepository.getSemester(deviceUid, profileId, number)
                    _isLoading.value = false
                    if (saved == null || saved.grades.isEmpty()) return@launch
                    val data = SemesterCurriculum.getSemester(number)
                    val courses = data.courses.map { template ->
                        val match = saved.grades[template.code]
                        if (match != null) template.copy(grade = match.grade) else template
                    }
                    val state = computeState(number, courses)
                    semesterCache[number] = state
                    _currentState.value = state
                } catch (e2: Exception) {
                    _errorMessage.value = "Couldn't load semester — check your connection"
                    _isLoading.value = false
                }
            }
        }
    }

    fun resetCurrentSemester() {
        val number = _currentState.value.semesterNumber
        val empty = SemesterState.empty(number)
        semesterCache[number] = empty
        _currentState.value = empty

        viewModelScope.launch {
            if (deviceUid.isNotEmpty() && profileId.isNotEmpty()) {
                try {
                    FirestoreSemesterRepository.deleteSemester(deviceUid, profileId, number)
                } catch (e: Exception) {
                    _errorMessage.value = "Couldn't reset semester — check your connection"
                }
            }
        }
    }

    fun refresh() {
        loadSemester(_currentState.value.semesterNumber)
    }

    fun clearError() {
        _errorMessage.value = null
    }

    private fun computeState(number: Int, courses: List<Course>): SemesterState {
        val graded = courses.filter { it.grade.isNotEmpty() }
        val totalGradedCredits = graded.sumOf { it.credits }
        val sgpa = SgpaCalculator.compute(courses)
        return SemesterState(
            semesterNumber = number,
            courses = courses,
            sgpa = sgpa,
            completedSubjects = graded.size,
            totalSubjects = courses.size,
            totalCredits = courses.sumOf { it.credits },
            totalGradedCredits = totalGradedCredits,
            allGraded = courses.all { it.grade.isNotEmpty() }
        )
    }
}
