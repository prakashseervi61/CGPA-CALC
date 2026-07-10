package com.prakash.semora.ui.profile

import android.app.Application
import androidx.core.content.ContextCompat
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreProfileRepository
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class ProfileViewModel(application: Application) : AndroidViewModel(application) {

    private val sessionManager = SessionManager(application)

    private val _username = MutableLiveData<String>()
    val username: LiveData<String> = _username

    private val _avatarInitial = MutableLiveData<String>()
    val avatarInitial: LiveData<String> = _avatarInitial

    private val _avatarColor = MutableLiveData<Int>()
    val avatarColor: LiveData<Int> = _avatarColor

    private val _branch = MutableLiveData<String>()
    val branch: LiveData<String> = _branch

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    private var cachedProfileLoaded = false

    fun clearError() { _errorMessage.value = null }

    fun loadProfile() {
        val localUsername = sessionManager.getUsername() ?: "User"

        if (cachedProfileLoaded) {
            _isLoading.value = false
        } else {
            val initial = localUsername.firstOrNull()?.uppercase() ?: "U"
            _username.value = localUsername
            _avatarInitial.value = initial
            _isLoading.value = true
        }

        val profileId = sessionManager.getFirebaseProfileId() ?: ""
        viewModelScope.launch {
            val deviceUid = FirestoreAuthRepository.getUid()
            val profile = try {
                if (deviceUid != null && profileId.isNotEmpty()) {
                    FirestoreProfileRepository.getProfile(deviceUid, profileId)
                } else null
            } catch (e1: Exception) {
                if (!cachedProfileLoaded) _isLoading.value = false
                delay(2000)
                try {
                    if (deviceUid != null && profileId.isNotEmpty()) {
                        FirestoreProfileRepository.getProfile(deviceUid, profileId)
                    } else null
                } catch (e2: Exception) {
                    _errorMessage.value = "Couldn't load profile — check your connection"
                    if (!cachedProfileLoaded) _isLoading.value = false
                    null
                }
            }
            if (profile == null) {
                if (!cachedProfileLoaded) {
                    _branch.value = "Information Technology"
                    _avatarColor.value = ContextCompat.getColor(getApplication(), com.example.semora.R.color.md3_primary)
                    _isLoading.value = false
                    cachedProfileLoaded = true
                }
                return@launch
            }
            _branch.value = profile.branch
            _avatarColor.value = profile.avatarColor
            _isLoading.value = false
            cachedProfileLoaded = true
        }
    }
}
