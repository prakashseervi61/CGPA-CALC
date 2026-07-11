package com.prakash.semora.ui.home

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.SemesterCurriculum
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreSemesterRepository
import com.prakash.semora.data.remote.SemesterDoc
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.delay
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

class HomeViewModel(
    application: Application,
    private val repo: FirestoreSemesterRepository = FirestoreSemesterRepository
) : AndroidViewModel(application) {

    private val sessionManager = SessionManager(application)
    private var deviceUid: String = ""

    private val _dashboard = MutableLiveData<HomeDashboardData>()
    val dashboard: LiveData<HomeDashboardData> = _dashboard

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    private var cachedDashboard: HomeDashboardData? = null

    fun clearError() { _errorMessage.value = null }

    fun loadDashboard() {
        val profileId = sessionManager.getFirebaseProfileId() ?: ""

        cachedDashboard?.let {
            _dashboard.value = it
            _isLoading.value = false
        } ?: run {
            _isLoading.value = true
        }

        viewModelScope.launch {
            deviceUid = FirestoreAuthRepository.getUid() ?: ""
            if (deviceUid.isEmpty() || profileId.isEmpty()) {
                val empty = computeDashboard(emptyList())
                if (cachedDashboard != empty) {
                    cachedDashboard = empty
                    _dashboard.value = empty
                }
                _isLoading.value = false
                return@launch
            }

            val semesters = try {
                FirestoreSemesterRepository.getSemesters(deviceUid, profileId)
            } catch (e1: Exception) {
                delay(2000)
                try {
                    FirestoreSemesterRepository.getSemesters(deviceUid, profileId)
                } catch (e2: Exception) {
                    _errorMessage.value = "Couldn't load dashboard — check your connection"
                    null
                }
            }
            if (semesters == null) {
                if (cachedDashboard == null) {
                    val empty = computeDashboard(emptyList())
                    cachedDashboard = empty
                    _dashboard.value = empty
                }
                _isLoading.value = false
                return@launch
            }
            val fresh = computeDashboard(semesters)
            if (fresh != cachedDashboard) {
                cachedDashboard = fresh
                _dashboard.value = fresh
            }
            _isLoading.value = false
        }
    }

    internal fun computeDashboard(semesters: List<SemesterDoc>): HomeDashboardData {
        _isLoading.value = false

        var totalWeightedPoints = 0.0
        var totalGradedCredits = 0
        val semestersWithGrades = mutableSetOf<Int>()

        for (sem in semesters) {
            for ((_, g) in sem.grades) {
                if (g.grade.isEmpty()) continue
                val point = SemesterCurriculum.gradeToPoint(g.grade)
                totalWeightedPoints += point * g.credits
                totalGradedCredits += g.credits
                semestersWithGrades.add(sem.semesterNumber)
            }
        }

        val completedCount = semestersWithGrades.count { semNum ->
            val totalCourses = SemesterCurriculum.getSemester(semNum).courses.size
            val sem = semesters.find { it.semesterNumber == semNum }
            val gradedCount = sem?.grades?.count { (_, g) -> g.grade.isNotEmpty() } ?: 0
            gradedCount == totalCourses
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

    private fun cgpaMessage(cgpa: Double): String = when {
        cgpa == 0.0 -> ""
        cgpa >= 9.5 -> "Outstanding"
        cgpa >= 9.0 -> "Excellent"
        cgpa >= 8.0 -> "Very Good"
        cgpa >= 7.0 -> "Good"
        cgpa >= 6.0 -> "Keep Improving"
        else -> "Needs Improvement"
    }
}
