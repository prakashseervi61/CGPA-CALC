package com.prakash.semora.ui.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.User
import com.prakash.semora.model.Semester
import kotlinx.coroutines.launch

data class ProfileItem(
    val profile: User,
    val isActive: Boolean,
    val cgpa: String,
    val currentSemester: String,
    val semesterCount: Int
)

data class ManageProfilesState(
    val profiles: List<ProfileItem> = emptyList(),
    val isLoading: Boolean = true,
    val message: String? = null
)

class ManageProfilesViewModel(application: Application) : AndroidViewModel(application) {

    private val userDao = AppDatabase.getDatabase(application).userDao()
    private val semesterDao = AppDatabase.getDatabase(application).semesterDao()

    private val _state = MutableLiveData(ManageProfilesState())
    val state: LiveData<ManageProfilesState> = _state

    private var activeProfileId: Int = -1

    fun loadProfiles(activeProfileId: Int) {
        this.activeProfileId = activeProfileId
        viewModelScope.launch {
            _state.value = _state.value?.copy(isLoading = true)
            try {
                val profiles = userDao.getAllUsers()
                val semestersByProfile = profiles.associate { profile ->
                    profile.id to semesterDao.getSemesters(profile.id)
                }

                val items = profiles.map { profile ->
                    val semesters = semestersByProfile[profile.id] ?: emptyList()
                    val cgpa = calculateCgpa(semesters)
                    val semesterCount = semesters.size
                    val currentSem = if (semesterCount > 0) "Semester ${semesters.last().semesterNumber}" else "Not started"
                    ProfileItem(
                        profile = profile,
                        isActive = profile.id == activeProfileId,
                        cgpa = cgpa,
                        currentSemester = currentSem,
                        semesterCount = semesterCount
                    )
                }
                _state.value = ManageProfilesState(profiles = items, isLoading = false)
            } catch (e: Exception) {
                _state.value = ManageProfilesState(isLoading = false, message = "Could not load profiles.")
            }
        }
    }

    private fun calculateCgpa(semesters: List<Semester>): String {
        if (semesters.isEmpty()) return "N/A"
        var weightedSum = 0.0
        var totalCredits = 0
        for (sem in semesters) {
            weightedSum += sem.sgpa * sem.totalCredits
            totalCredits += sem.totalCredits
        }
        if (totalCredits == 0) return "N/A"
        val cgpa = weightedSum / totalCredits
        return String.format("%.2f", cgpa)
    }

    fun deleteProfile(profile: User, onComplete: () -> Unit) {
        viewModelScope.launch {
            try {
                userDao.deleteUser(profile)
                _state.value = _state.value?.copy(message = "Profile deleted")
                loadProfiles(activeProfileId)
                onComplete()
            } catch (e: Exception) {
                _state.value = _state.value?.copy(message = "Delete failed: ${e.message}")
            }
        }
    }

    fun clearMessage() {
        _state.value = _state.value?.copy(message = null)
    }
}
