package com.prakash.semora.ui.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreProfileRepository
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class EditProfileState(
    val username: String = "",
    val branch: String = "Information Technology",
    val avatarInitial: String = "U",
    val createdAt: String = "",
    val usernameError: String? = null,
    val isSaving: Boolean = false,
    val saveSuccess: Boolean = false,
    val saveMessage: String? = null
)

class EditProfileViewModel(application: Application) : AndroidViewModel(application) {

    private val _state = MutableLiveData(EditProfileState())
    val state: LiveData<EditProfileState> = _state

    private var profileId: String = ""
    private var originalUsername: String = ""
    private var deviceUid: String = ""

    fun loadProfile(profileId: String, username: String, branch: String, createdAtTimestamp: Long) {
        this.profileId = profileId
        originalUsername = username
        _state.value = EditProfileState(
            username = username,
            branch = branch,
            avatarInitial = username.firstOrNull()?.uppercase()?.toString() ?: "U",
            createdAt = formatDate(createdAtTimestamp)
        )
        viewModelScope.launch {
            deviceUid = FirestoreAuthRepository.getUid() ?: ""
        }
    }

    fun hasUnsavedChanges(): Boolean {
        return _state.value?.username != originalUsername
    }

    fun updateUsername(value: String) {
        _state.value = _state.value?.copy(username = value)
        validateLocally(value)
    }

    private fun validateLocally(value: String): Boolean {
        val error = when {
            value.isBlank() -> "Username is required"
            value.length < 3 -> "Minimum 3 characters required"
            value.length > 20 -> "Maximum 20 characters"
            else -> null
        }
        _state.value = _state.value?.copy(usernameError = error)
        return error == null
    }

    fun save() {
        val s = _state.value ?: return
        val currentUsername = s.username.trim()
        if (!validateLocally(currentUsername)) return

        if (currentUsername == originalUsername) {
            _state.value = _state.value?.copy(
                saveSuccess = true,
                saveMessage = "Profile updated successfully."
            )
            return
        }

        _state.value = _state.value?.copy(isSaving = true, usernameError = null)

        viewModelScope.launch {
            try {
                if (deviceUid.isEmpty() || profileId.isEmpty()) {
                    _state.value = _state.value?.copy(
                        isSaving = false,
                        saveMessage = "Update failed. Please try again."
                    )
                    return@launch
                }
                val profiles = FirestoreProfileRepository.getProfiles(deviceUid)
                val existing = profiles.firstOrNull { it.username == currentUsername && it.id != profileId }
                if (existing != null) {
                    _state.value = _state.value?.copy(
                        isSaving = false,
                        usernameError = "Username already exists"
                    )
                    return@launch
                }

                FirestoreProfileRepository.updateUsername(deviceUid, profileId, currentUsername)

                val sessionManager = SessionManager(getApplication())
                sessionManager.saveFirebaseSession(profileId, currentUsername)

                _state.value = _state.value?.copy(
                    isSaving = false,
                    saveSuccess = true,
                    saveMessage = "Profile updated successfully."
                )
            } catch (e: Exception) {
                _state.value = _state.value?.copy(
                    isSaving = false,
                    saveMessage = "Update failed. Please try again."
                )
            }
        }
    }

    fun clearSaveMessage() {
        _state.value = _state.value?.copy(saveSuccess = false, saveMessage = null)
    }

    private fun formatDate(timestamp: Long): String {
        val sdf = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
        return sdf.format(Date(timestamp))
    }
}
