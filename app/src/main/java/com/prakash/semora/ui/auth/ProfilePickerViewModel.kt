package com.prakash.semora.ui.auth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.User
import kotlinx.coroutines.launch

data class ProfilePickerItem(
    val profile: User,
    val cgpa: String,
    val currentSemester: String,
    val semesterCount: Int
)

data class ProfilePickerState(
    val isEmpty: Boolean = true,
    val profiles: List<ProfilePickerItem> = emptyList(),
    val isLoading: Boolean = true
)

class ProfilePickerViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getDatabase(application)
    private val userDao = db.userDao()
    private val semesterDao = db.semesterDao()

    private val _state = MutableLiveData(ProfilePickerState())
    val state: LiveData<ProfilePickerState> = _state

    fun loadProfiles() {
        viewModelScope.launch {
            _state.value = ProfilePickerState(isLoading = true)
            try {
                val users = userDao.getAllUsers()
                if (users.isEmpty()) {
                    _state.value = ProfilePickerState(isEmpty = true, isLoading = false)
                    return@launch
                }
                val items = users.map { user ->
                    val semesters = semesterDao.getSemesters(user.id)
                    val cgpa = calculateCgpa(semesters)
                    val semesterCount = semesters.size
                    val currentSem = if (semesterCount > 0) "Semester ${semesters.last().semesterNumber}" else "Not started"
                    ProfilePickerItem(
                        profile = user,
                        cgpa = cgpa,
                        currentSemester = currentSem,
                        semesterCount = semesterCount
                    )
                }
                _state.value = ProfilePickerState(isEmpty = false, profiles = items, isLoading = false)
            } catch (_: Exception) {
                _state.value = ProfilePickerState(isEmpty = true, isLoading = false)
            }
        }
    }

    fun deleteProfile(profile: User) {
        viewModelScope.launch {
            try {
                userDao.deleteUser(profile)
                loadProfiles()
            } catch (_: Exception) {
                loadProfiles()
            }
        }
    }

    private fun calculateCgpa(semesters: List<com.prakash.semora.model.Semester>): String {
        if (semesters.isEmpty()) return "N/A"
        var weightedSum = 0.0
        var totalCredits = 0
        for (sem in semesters) {
            weightedSum += sem.sgpa * sem.totalCredits
            totalCredits += sem.totalCredits
        }
        if (totalCredits == 0) return "N/A"
        return String.format("%.2f", weightedSum / totalCredits)
    }
}
