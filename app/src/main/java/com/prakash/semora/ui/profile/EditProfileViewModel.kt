package com.prakash.semora.ui.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class EditProfileState(
    val username: String = "",
    val avatarInitial: String = "U",
    val createdAt: String = "",
    val usernameError: String? = null,
    val isSaving: Boolean = false,
    val saveSuccess: Boolean = false,
    val saveMessage: String? = null
)

class EditProfileViewModel(application: Application) : AndroidViewModel(application) {

    private val userDao = AppDatabase.getDatabase(application).userDao()

    private val _state = MutableLiveData(EditProfileState())
    val state: LiveData<EditProfileState> = _state

    private var profileId: Int = -1
    private var originalUsername: String = ""

    fun loadProfile(profileId: Int, username: String, createdAtTimestamp: Long) {
        this.profileId = profileId
        originalUsername = username
        _state.value = EditProfileState(
            username = username,
            avatarInitial = username.firstOrNull()?.uppercase()?.toString() ?: "U",
            createdAt = formatDate(createdAtTimestamp)
        )
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
                if (profileId == -1) {
                    _state.value = _state.value?.copy(
                        isSaving = false,
                        saveMessage = "Update failed. Please try again."
                    )
                    return@launch
                }
                
                val existing = userDao.getUserByUsername(currentUsername)
                if (existing != null && existing.id != profileId) {
                    _state.value = _state.value?.copy(
                        isSaving = false,
                        usernameError = "Username already exists"
                    )
                    return@launch
                }

                userDao.updateUsername(profileId, currentUsername)

                val sessionManager = SessionManager(getApplication())
                sessionManager.saveUserSession(profileId, currentUsername)

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
