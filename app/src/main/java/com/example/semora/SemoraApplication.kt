package com.example.semora

import android.app.Application
import android.content.Context
import androidx.appcompat.app.AppCompatDelegate
import android.content.SharedPreferences
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FirebaseFirestoreSettings
import com.prakash.semora.data.remote.FirestoreAuthRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class SemoraApplication : Application() {

    private val applicationScope = CoroutineScope(Dispatchers.IO)

    companion object {
        const val PREFS_NAME = "semora_session"
        const val KEY_THEME_MODE = "theme_mode"
    }

    override fun onCreate() {
        super.onCreate()
        applyThemePreference()
        configureFirestore()
        initFirebase()
    }

    private fun configureFirestore() {
        val settings = FirebaseFirestoreSettings.Builder()
            .setPersistenceEnabled(true)
            .build()
        FirebaseFirestore.getInstance().firestoreSettings = settings
    }

    private fun initFirebase() {
        applicationScope.launch {
            FirestoreAuthRepository.ensureSignedIn()
        }
    }

    private fun applyThemePreference() {
        val prefs: SharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        val mode = prefs.getInt(KEY_THEME_MODE, AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
        AppCompatDelegate.setDefaultNightMode(mode)
    }
}
