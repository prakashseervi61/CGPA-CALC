package com.prakash.semora.ui.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreProfileRepository
import com.prakash.semora.data.remote.FirestoreSemesterRepository
import com.prakash.semora.data.remote.ProfileDoc
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch

data class ProfileItem(
    val profile: ProfileDoc,
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

    private var deviceUid: String = ""

    private val _state = MutableLiveData(ManageProfilesState())
    val state: LiveData<ManageProfilesState> = _state

    private var activeProfileId: String = ""

    fun loadProfiles(activeProfileId: String) {
        this.activeProfileId = activeProfileId
        viewModelScope.launch {
            _state.value = _state.value?.copy(isLoading = true)
            deviceUid = FirestoreAuthRepository.getUid() ?: ""
            if (deviceUid.isEmpty()) {
                _state.value = ManageProfilesState(isLoading = false)
                return@launch
            }
            try {
                val profiles = FirestoreProfileRepository.getProfiles(deviceUid)
                val semestersByProfile = coroutineScope {
                    profiles.map { profile ->
                        async { profile.id to FirestoreSemesterRepository.getSemesters(deviceUid, profile.id) }
                    }.map { it.await() }
                }.toMap()

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
                _state.value = ManageProfilesState(isLoading = false, message = "Could not load profiles. Check your connection.")
            }
        }
    }

    private fun calculateCgpa(semesters: List<com.prakash.semora.data.remote.SemesterDoc>): String {
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

    fun deleteProfile(profile: ProfileDoc, onComplete: () -> Unit) {
        viewModelScope.launch {
            try {
                deviceUid = FirestoreAuthRepository.getUid() ?: ""
                if (deviceUid.isEmpty()) return@launch
                FirestoreSemesterRepository.deleteAllSemesters(deviceUid, profile.id)
                FirestoreProfileRepository.deleteProfile(deviceUid, profile.id)
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
