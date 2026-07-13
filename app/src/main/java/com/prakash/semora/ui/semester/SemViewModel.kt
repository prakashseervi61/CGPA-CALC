package com.prakash.semora.ui.semester

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.SemesterCurriculum
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.Course
import com.prakash.semora.model.GradeEntity
import com.prakash.semora.model.Semester
import com.prakash.semora.model.SemesterState
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SemViewModel(application: Application) : AndroidViewModel(application) {

    private val sessionManager = SessionManager(application)
    private val profileId get() = sessionManager.getUserId()

    private val semesterDao = AppDatabase.getDatabase(application).semesterDao()
    private val gradeDao = AppDatabase.getDatabase(application).gradeDao()

    private val _currentState = MutableStateFlow(SemesterState.empty(1))
    val currentState: StateFlow<SemesterState> = _currentState.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val semesterCache = mutableMapOf(1 to _currentState.value)

    init {
        if (profileId != -1) {
            loadSemester(1)
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

        if (profileId == -1) return
        val course = updatedCourses.firstOrNull { it.code == courseCode } ?: return
        
        _errorMessage.value = null
        viewModelScope.launch {
            try {
                if (grade.isNotEmpty()) {
                    val gradeEntity = GradeEntity(
                        userId = profileId,
                        semesterNumber = current.semesterNumber,
                        courseCode = course.code,
                        courseName = course.name,
                        credits = course.credits,
                        grade = grade
                    )
                    gradeDao.insertGrade(gradeEntity)
                }
                
                // Ensure semester exists
                var savedSemester = semesterDao.getSemester(profileId, current.semesterNumber)
                if (savedSemester == null) {
                    val newSem = Semester(
                        userId = profileId,
                        semesterNumber = current.semesterNumber,
                        sgpa = state.sgpa,
                        totalCredits = state.totalCredits
                    )
                    semesterDao.insertSemester(newSem)
                } else {
                    semesterDao.updateSemesterSummary(
                        profileId, current.semesterNumber, state.sgpa, state.totalCredits
                    )
                }
            } catch (e: Exception) {
                if (e is kotlinx.coroutines.CancellationException) throw e
                _errorMessage.value = "Couldn't save grade."
            }
        }
    }

    private fun loadSemester(number: Int) {
        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            if (profileId == -1) {
                _isLoading.value = false
                return@launch
            }
            try {
                val grades = gradeDao.getGradesForSemester(profileId, number)
                _isLoading.value = false
                _errorMessage.value = null
                
                val data = SemesterCurriculum.getSemester(number)
                val courses = data.courses.map { template ->
                    val match = grades.find { it.courseCode == template.code }
                    if (match != null) template.copy(grade = match.grade) else template
                }
                val state = computeState(number, courses)
                semesterCache[number] = state
                _currentState.value = state
            } catch (e: Exception) {
                if (e is kotlinx.coroutines.CancellationException) throw e
                _errorMessage.value = "Couldn't load semester."
                _isLoading.value = false
            }
        }
    }

    fun resetCurrentSemester() {
        val number = _currentState.value.semesterNumber
        val empty = SemesterState.empty(number)
        semesterCache[number] = empty
        _currentState.value = empty
        _errorMessage.value = null

        viewModelScope.launch {
            if (profileId != -1) {
                try {
                    semesterDao.deleteSemesterByNumber(profileId, number)
                    gradeDao.deleteGradesForSemester(profileId, number)
                } catch (e: Exception) {
                    if (e is kotlinx.coroutines.CancellationException) throw e
                    _errorMessage.value = "Couldn't reset semester."
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
        val sgpa = if (totalGradedCredits == 0) 0.0
            else graded.sumOf { SemesterCurriculum.gradeToPoint(it.grade) * it.credits } / totalGradedCredits
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
