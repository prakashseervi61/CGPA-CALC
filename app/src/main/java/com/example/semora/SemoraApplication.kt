package com.example.semora

import android.app.Application
import android.content.Context
import androidx.appcompat.app.AppCompatDelegate
import android.content.SharedPreferences

class SemoraApplication : Application() {

    companion object {
        const val PREFS_NAME = "semora_session"
        const val KEY_THEME_MODE = "theme_mode"
    }

    override fun onCreate() {
        super.onCreate()
        applyThemePreference()
    }

    private fun applyThemePreference() {
        val prefs: SharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        val mode = prefs.getInt(KEY_THEME_MODE, AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
        AppCompatDelegate.setDefaultNightMode(mode)
    }
}
