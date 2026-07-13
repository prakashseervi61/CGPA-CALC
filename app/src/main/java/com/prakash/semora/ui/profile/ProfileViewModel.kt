package com.prakash.semora.ui.profile

import android.app.Application
import androidx.core.content.ContextCompat
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.semora.R
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.launch

class ProfileViewModel(private val app: Application) : AndroidViewModel(app) {

    private val sessionManager = SessionManager(app)
    private val userDao = AppDatabase.getDatabase(app).userDao()

    private val _username = MutableLiveData<String>()
    val username: LiveData<String> = _username

    private val _avatarInitial = MutableLiveData<String>()
    val avatarInitial: LiveData<String> = _avatarInitial

    private val _avatarColor = MutableLiveData<Int>()
    val avatarColor: LiveData<Int> = _avatarColor

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    fun clearError() { _errorMessage.value = null }

    fun loadProfile() {
        val localUsername = sessionManager.getUsername() ?: "User"
        val initial = localUsername.firstOrNull()?.uppercase() ?: "U"
        _username.value = localUsername
        _avatarInitial.value = initial
        _isLoading.value = true
        _errorMessage.value = null

        val profileId = sessionManager.getUserId()
        viewModelScope.launch {
            if (profileId == -1) {
                _errorMessage.value = "Couldn't load profile"
                _avatarColor.value = ContextCompat.getColor(app, R.color.md3_primary)
                _isLoading.value = false
                return@launch
            }
            try {
                val profile = userDao.getUserById(profileId)
                if (profile == null) {
                    _errorMessage.value = "Profile not found"
                    _avatarColor.value = ContextCompat.getColor(app, R.color.md3_primary)
                    _isLoading.value = false
                    return@launch
                }
                _errorMessage.value = null
                _avatarColor.value = profile.avatarColor
                _isLoading.value = false
            } catch (e: Exception) {
                _errorMessage.value = "Couldn't load profile"
                _avatarColor.value = ContextCompat.getColor(app, R.color.md3_primary)
                _isLoading.value = false
            }
        }
    }
}
