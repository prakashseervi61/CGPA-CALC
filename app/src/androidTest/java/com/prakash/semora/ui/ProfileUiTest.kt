package com.prakash.semora.ui

import android.content.Intent
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.rule.ActivityTestRule
import com.example.semora.MainActivity
import com.example.semora.R
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.User
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class ProfileUiTest {

    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java, false, false)

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<android.app.Application>()
        val db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
        runBlocking {
            db.userDao().insertUser(User(username = "alice", pin = "hash", salt = "salt", avatarColor = 0, createdAt = System.currentTimeMillis()))
        }
        SessionManager(ctx).saveUserSession(1, "alice")
    }

    @After
    fun teardown() {
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun mainActivityShowsProfileTab() {
        activityRule.launchActivity(Intent())
        onView(withId(R.id.nav_profile)).check(matches(isDisplayed()))
    }

    @Test
    fun profileTabShowsUsername() {
        activityRule.launchActivity(Intent())
        onView(withId(R.id.nav_profile)).perform(androidx.test.espresso.action.ViewActions.click())
        try { Thread.sleep(500) } catch (_: Exception) {}
        onView(withText("alice")).check(matches(isDisplayed()))
    }
}
