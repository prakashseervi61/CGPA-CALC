package com.prakash.semora.ui.auth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreProfileRepository
import com.prakash.semora.data.remote.ProfileDoc
import com.prakash.semora.utils.PinHasher
import kotlinx.coroutines.launch

data class RegisterFormState(
    val usernameError: String? = null,
    val pinError: String? = null,
    val confirmPinError: String? = null
)

class AuthViewModel(application: Application) : AndroidViewModel(application) {

    private val _authResult = MutableLiveData<ProfileDoc?>()
    val authResult: LiveData<ProfileDoc?> = _authResult

    private val _authMessage = MutableLiveData<String>()
    val authMessage: LiveData<String> = _authMessage

    private val _formState = MutableLiveData<RegisterFormState>()
    val formState: LiveData<RegisterFormState> = _formState

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    private val _registrationSuccess = MutableLiveData(false)
    val registrationSuccess: LiveData<Boolean> = _registrationSuccess

    fun register(username: String, pin: String, confirmPin: String) {
        val currentErrors = mutableMapOf<String, String?>()

        if (username.isBlank()) {
            currentErrors["username"] = "Username is required"
        }

        if (pin.length != 4 || !pin.all { it.isDigit() }) {
            currentErrors["pin"] = "PIN must be exactly 4 digits"
        }

        if (confirmPin.length != 4 || !confirmPin.all { it.isDigit() }) {
            currentErrors["confirmPin"] = "Please confirm your PIN"
        } else if (pin != confirmPin) {
            currentErrors["confirmPin"] = "PINs do not match"
        }

        if (currentErrors.isNotEmpty()) {
            _formState.value = RegisterFormState(
                usernameError = currentErrors["username"],
                pinError = currentErrors["pin"],
                confirmPinError = currentErrors["confirmPin"]
            )
            return
        }

        _formState.value = RegisterFormState()
        _isLoading.value = true

        viewModelScope.launch {
            try {
                val deviceUid = FirestoreAuthRepository.getUid()
                if (deviceUid == null) {
                    _authMessage.value = "Registration failed. Please try again."
                    _isLoading.value = false
                    return@launch
                }

                val existing = FirestoreProfileRepository.getProfiles(deviceUid)
                    .firstOrNull { it.username == username }
                if (existing != null) {
                    _formState.value = RegisterFormState(usernameError = "Username already exists")
                    _authMessage.value = "Username already exists"
                } else {
                    val salt = PinHasher.generateSalt()
                    val profile = ProfileDoc(
                        username = username,
                        pinHash = PinHasher.hash(pin, salt),
                        pinSalt = salt,
                        pinVersion = 1
                    )
                    val profileId = FirestoreProfileRepository.createProfile(deviceUid, profile)
                    val created = profile.copy(id = profileId)
                    _authResult.value = created
                    _authMessage.value = "Profile created"
                    _registrationSuccess.value = true
                }
            } catch (e: Exception) {
                _authMessage.value = "Registration failed. Please try again."
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun login(username: String, pin: String) {
        if (username.isEmpty()) {
            _authMessage.value = "Username cannot be empty"
            return
        }
        if (pin.length != 4 || !pin.all { it.isDigit() }) {
            _authMessage.value = "PIN must be exactly 4 digits"
            return
        }

        viewModelScope.launch {
            val deviceUid = FirestoreAuthRepository.getUid() ?: return@launch
            val profiles = try {
                FirestoreProfileRepository.getProfiles(deviceUid)
            } catch (e: Exception) {
                _authMessage.value = "Could not connect. Check your connection."
                return@launch
            }
            val user = profiles.firstOrNull { it.username == username }
            if (user != null && PinHasher.verify(pin, user.pinHash, user.pinSalt, user.pinVersion)) {
                if (user.pinVersion == 0) {
                    val newHash = PinHasher.hash(pin, user.pinSalt)
                    FirestoreProfileRepository.updatePin(deviceUid, user.id, newHash, user.pinSalt, 1)
                }
                _authResult.value = user
            } else {
                _authResult.value = null
                _authMessage.value = "Incorrect PIN. Try again."
            }
        }
    }
}
