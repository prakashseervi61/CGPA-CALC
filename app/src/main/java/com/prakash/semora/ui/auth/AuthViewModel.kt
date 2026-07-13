package com.prakash.semora.ui.auth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.User
import com.prakash.semora.utils.PinHasher
import kotlinx.coroutines.launch

data class RegisterFormState(
    val usernameError: String? = null,
    val pinError: String? = null,
    val confirmPinError: String? = null
)

class AuthViewModel(application: Application) : AndroidViewModel(application) {

    private val userDao = AppDatabase.getDatabase(application).userDao()

    private val _authResult = MutableLiveData<User?>()
    val authResult: LiveData<User?> = _authResult

    private val _authMessage = MutableLiveData<String>()
    val authMessage: LiveData<String> = _authMessage

    private val _formState = MutableLiveData<RegisterFormState>()
    val formState: LiveData<RegisterFormState> = _formState

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    private val _registrationSuccess = MutableLiveData(false)
    val registrationSuccess: LiveData<Boolean> = _registrationSuccess

    fun register(username: String, pin: String, confirmPin: String) {
        var usernameError: String? = null
        var pinError: String? = null
        var confirmPinError: String? = null

        if (username.isBlank()) usernameError = "Username is required"

        if (pin.length != 4 || !pin.all { it.isDigit() }) pinError = "PIN must be exactly 4 digits"

        if (confirmPin.length != 4 || !confirmPin.all { it.isDigit() }) {
            confirmPinError = "Please confirm your PIN"
        } else if (pin != confirmPin) {
            confirmPinError = "PINs do not match"
        }

        if (usernameError != null || pinError != null || confirmPinError != null) {
            _formState.value = RegisterFormState(usernameError, pinError, confirmPinError)
            return
        }

        _formState.value = RegisterFormState()
        _isLoading.value = true

        viewModelScope.launch {
            try {
                val existing = userDao.getUserByUsername(username)
                if (existing != null) {
                    _formState.value = RegisterFormState(usernameError = "Username already exists")
                    _authMessage.value = "Username already exists"
                } else {
                    val salt = PinHasher.generateSalt()
                    val user = User(
                        username = username,
                        pin = PinHasher.hash(pin, salt),
                        salt = salt,
                        avatarColor = 0,
                        createdAt = System.currentTimeMillis()
                    )
                    val userId = userDao.insertUser(user).toInt()
                    val created = user.copy(id = userId)
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
            val user = userDao.getUserByUsername(username)
            if (user != null && PinHasher.verify(pin, user.pin, user.salt)) {
                userDao.updateLastOpened(user.id, System.currentTimeMillis())
                _authResult.value = user
            } else {
                _authResult.value = null
                _authMessage.value = "Incorrect PIN. Try again."
            }
        }
    }
}
