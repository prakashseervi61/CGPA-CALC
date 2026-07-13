package com.prakash.semora.ui

import android.content.Intent
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.action.ViewActions.closeSoftKeyboard
import androidx.test.espresso.action.ViewActions.typeText
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.rule.ActivityTestRule
import com.example.semora.R
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.ui.auth.RegisterActivity
import com.prakash.semora.utils.SessionManager
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class RegistrationUiTest {

    @get:Rule
    val activityRule = ActivityTestRule(RegisterActivity::class.java, false, false)

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<android.app.Application>()
        SessionManager(ctx).logout()
        val db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
    }

    @After
    fun teardown() {
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun registrationScreenShowsTitle() {
        activityRule.launchActivity(Intent())
        onView(withText("Create Profile")).check(matches(isDisplayed()))
    }

    @Test
    fun registrationScreenShowsUsernameField() {
        activityRule.launchActivity(Intent())
        onView(withId(R.id.etUsername)).check(matches(isDisplayed()))
    }

    @Test
    fun registrationScreenShowsRegisterButton() {
        activityRule.launchActivity(Intent())
        onView(withId(R.id.btnRegister)).check(matches(isDisplayed()))
    }
}
