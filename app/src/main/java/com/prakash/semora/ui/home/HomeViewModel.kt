package com.prakash.semora.ui.home

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.SemesterCurriculum
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.GradeEntity
import com.prakash.semora.model.Semester
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.launch

data class HomeDashboardData(
    val cgpa: Double = 0.0,
    val cgpaMessage: String = "",
    val cgpaProgress: Int = 0,
    val completedSemesters: Int = 0,
    val totalSemesters: Int = 8,
    val semesterProgress: Int = 0,
    val gradedCredits: Int = 0,
    val totalCurriculumCredits: Int = SemesterCurriculum.totalCurriculumCredits,
    val creditsProgress: Int = 0
)

class HomeViewModel(app: Application) : AndroidViewModel(app) {

    private val sessionManager = SessionManager(app)
    private var profileId: Int = -1

    private val semesterDao = AppDatabase.getDatabase(app).semesterDao()
    private val gradeDao = AppDatabase.getDatabase(app).gradeDao()

    private val _dashboard = MutableLiveData<HomeDashboardData>()
    val dashboard: LiveData<HomeDashboardData> = _dashboard

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    private var cachedDashboard: HomeDashboardData? = null

    fun clearError() { _errorMessage.value = null }

    fun loadDashboard() {
        profileId = sessionManager.getUserId()
        if (profileId == -1) {
            val empty = computeDashboard(emptyList(), emptyList())
            cachedDashboard = empty
            _dashboard.value = empty
            _isLoading.value = false
            _errorMessage.value = null
            return
        }

        _errorMessage.value = null
        cachedDashboard?.let { _dashboard.value = it }
        _isLoading.value = cachedDashboard == null

        viewModelScope.launch {
            try {
                val semesters = semesterDao.getSemesters(profileId)
                val allGrades = gradeDao.getGradesForUser(profileId)

                if (semesters.isEmpty()) {
                    if (cachedDashboard == null) {
                        val empty = computeDashboard(emptyList(), emptyList())
                        cachedDashboard = empty
                        _dashboard.value = empty
                    }
                    _isLoading.value = false
                    _errorMessage.value = null
                    return@launch
                }

                _errorMessage.value = null
                val fresh = computeDashboard(semesters, allGrades)
                if (fresh != cachedDashboard) {
                    cachedDashboard = fresh
                    _dashboard.value = fresh
                }
                _isLoading.value = false
            } catch (e: Exception) {
                _isLoading.value = false
                if (cachedDashboard == null) {
                    _errorMessage.value = "Couldn't load data."
                }
            }
        }
    }

    private fun cgpaMessage(cgpa: Double): String = when {
        cgpa == 0.0 -> ""
        cgpa >= 9.5 -> "Outstanding"
        cgpa >= 9.0 -> "Excellent"
        cgpa >= 8.0 -> "Very Good"
        cgpa >= 7.0 -> "Good"
        cgpa >= 6.0 -> "Keep Improving"
        else -> "Needs Improvement"
    }

    internal fun computeDashboard(semesters: List<Semester>, grades: List<GradeEntity>): HomeDashboardData {
        var totalWeightedPoints = 0.0
        var totalGradedCredits = 0
        val semesterSubjectCount = mutableMapOf<Int, Int>()

        for (g in grades) {
            if (g.grade.isEmpty()) continue
            val point = SemesterCurriculum.gradeToPoint(g.grade)
            totalWeightedPoints += point * g.credits
            totalGradedCredits += g.credits
            semesterSubjectCount[g.semesterNumber] = (semesterSubjectCount[g.semesterNumber] ?: 0) + 1
        }

        var completedCount = 0
        for ((semNum, count) in semesterSubjectCount) {
            val expectedCount = SemesterCurriculum.getSemester(semNum).courses.size
            if (count >= expectedCount && expectedCount > 0) {
                completedCount++
            }
        }

        val totalSemesters = SemesterCurriculum.getAllSemesters().size
        val totalCredits = SemesterCurriculum.totalCurriculumCredits
        val cgpa = if (totalGradedCredits > 0) totalWeightedPoints / totalGradedCredits else 0.0

        return HomeDashboardData(
            cgpa = cgpa,
            cgpaMessage = cgpaMessage(cgpa),
            cgpaProgress = (cgpa / 10.0 * 100).toInt(),
            completedSemesters = completedCount,
            totalSemesters = totalSemesters,
            semesterProgress = if (completedCount > 0) (completedCount.toFloat() / totalSemesters * 100).toInt() else 0,
            gradedCredits = totalGradedCredits,
            totalCurriculumCredits = totalCredits,
            creditsProgress = if (totalCredits > 0) (totalGradedCredits.toFloat() / totalCredits * 100).toInt() else 0
        )
    }
}