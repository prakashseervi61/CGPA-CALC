package com.prakash.semora.ui.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreProfileRepository
import com.prakash.semora.data.remote.ProfileDoc
import com.prakash.semora.utils.PinHasher
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.launch

class ChangePinViewModel(application: Application) : AndroidViewModel(application) {

    private val sessionManager = SessionManager(application)

    private val _step = MutableLiveData(1)
    val step: LiveData<Int> = _step

    private val _currentPinError = MutableLiveData<String?>(null)
    val currentPinError: LiveData<String?> = _currentPinError

    private val _newPinError = MutableLiveData<String?>(null)
    val newPinError: LiveData<String?> = _newPinError

    private val _confirmPinError = MutableLiveData<String?>(null)
    val confirmPinError: LiveData<String?> = _confirmPinError

    private val _isSaving = MutableLiveData(false)
    val isSaving: LiveData<Boolean> = _isSaving

    private val _success = MutableLiveData(false)
    val success: LiveData<Boolean> = _success

    private val _message = MutableLiveData<String?>(null)
    val message: LiveData<String?> = _message

    private var currentProfile: ProfileDoc? = null
    private var storedPinHash: String = ""
    private var deviceUid: String = ""

    fun loadUser() {
        viewModelScope.launch {
            deviceUid = FirestoreAuthRepository.getUid() ?: ""
            val profileId = sessionManager.getFirebaseProfileId() ?: ""
            if (deviceUid.isEmpty() || profileId.isEmpty()) return@launch
            try {
                val profile = FirestoreProfileRepository.getProfile(deviceUid, profileId)
                currentProfile = profile
                storedPinHash = profile?.pinHash ?: ""
            } catch (e: Exception) {
                _message.value = "Could not load profile. Check your connection."
            }
        }
    }

    fun verifyCurrentPin(enteredPin: String) {
        val profile = currentProfile ?: return
        if (enteredPin.length != 4 || !enteredPin.all { it.isDigit() }) {
            _currentPinError.value = "Enter your 4-digit PIN"
            return
        }

        if (!PinHasher.verify(enteredPin, profile.pinHash, profile.pinSalt, profile.pinVersion)) {
            _currentPinError.value = "Incorrect current PIN."
            return
        }

        if (profile.pinVersion == 0) {
            val newHash = PinHasher.hash(enteredPin, profile.pinSalt)
            viewModelScope.launch {
                try {
                    FirestoreProfileRepository.updatePin(deviceUid, profile.id, newHash, profile.pinSalt, 1)
                } catch (e: Exception) {
                    _message.value = "Could not upgrade PIN. Check your connection."
                }
            }
        }

        _currentPinError.value = null
        _newPinError.value = null
        _confirmPinError.value = null
        _step.value = 2
    }

    fun updatePin(newPin: String, confirmPin: String) {
        val profile = currentProfile ?: return
        if (newPin.length != 4 || !newPin.all { it.isDigit() }) {
            _newPinError.value = "PIN must be exactly 4 digits"
            return
        }

        if (PinHasher.verify(newPin, storedPinHash, profile.pinSalt, 1)) {
            _newPinError.value = "New PIN cannot be the same as current PIN"
            return
        }

        if (confirmPin != newPin) {
            _confirmPinError.value = "PINs do not match"
            return
        }

        _newPinError.value = null
        _confirmPinError.value = null
        _isSaving.value = true

        viewModelScope.launch {
            try {
                val newHash = PinHasher.hash(newPin, profile.pinSalt)
                FirestoreProfileRepository.updatePin(deviceUid, profile.id, newHash, profile.pinSalt, 1)
                _success.value = true
                _message.value = "PIN updated successfully."
            } catch (e: Exception) {
                _message.value = "Update failed. Please try again."
            } finally {
                _isSaving.value = false
            }
        }
    }

    fun clearMessage() {
        _message.value = null
    }

    fun clearErrors() {
        _currentPinError.value = null
        _newPinError.value = null
        _confirmPinError.value = null
    }
}
