package com.prakash.semora.utils

import android.content.Context
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatDelegate
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class SessionManagerTest {

    private lateinit var prefs: SharedPreferences
    private lateinit var editor: SharedPreferences.Editor
    private lateinit var sessionManager: SessionManager

    @Before
    fun setup() {
        editor = mockk(relaxed = true)
        prefs = mockk {
            every { edit() } returns editor
        }
        val ctx = mockk<Context> {
            every { getSharedPreferences("semora_session", Context.MODE_PRIVATE) } returns prefs
        }
        sessionManager = SessionManager(ctx)
    }

    @Test
    fun `isLoggedIn reads from prefs default false`() {
        every { prefs.getBoolean("isLoggedIn", false) } returns false
        assertFalse(sessionManager.isLoggedIn())
    }

    @Test
    fun `isLoggedIn returns true after save`() {
        every { prefs.getBoolean("isLoggedIn", false) } returns true
        assertTrue(sessionManager.isLoggedIn())
    }

    @Test
    fun `getUserId default is -1`() {
        every { prefs.getInt("userId", -1) } returns -1
        assertEquals(-1, sessionManager.getUserId())
    }

    @Test
    fun `getUserId returns saved value`() {
        every { prefs.getInt("userId", -1) } returns 42
        assertEquals(42, sessionManager.getUserId())
    }

    @Test
    fun `getUsername returns null before save`() {
        every { prefs.getString("username", null) } returns null
        assertNull(sessionManager.getUsername())
    }

    @Test
    fun `getUsername returns saved value`() {
        every { prefs.getString("username", null) } returns "testuser"
        assertEquals("testuser", sessionManager.getUsername())
    }

    @Test
    fun `saveUserSession writes all keys`() {
        sessionManager.saveUserSession(42, "alice")
        verify { editor.putBoolean("isLoggedIn", true) }
        verify { editor.putInt("userId", 42) }
        verify { editor.putString("username", "alice") }
        verify { editor.apply() }
    }

    @Test
    fun `logout clears all`() {
        sessionManager.logout()
        verify { editor.clear() }
        verify { editor.apply() }
    }

    @Test
    fun `setThemeMode delegates to editor`() {
        sessionManager.setThemeMode(AppCompatDelegate.MODE_NIGHT_YES)
        verify { editor.putInt("theme_mode", AppCompatDelegate.MODE_NIGHT_YES) }
        verify { editor.apply() }
    }

    @Test
    fun `getThemeMode default is follow system`() {
        every { prefs.getInt("theme_mode", AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM) } returns AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
        assertEquals(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM, sessionManager.getThemeMode())
    }
}
