package com.prakash.semora.ui

import android.content.Intent
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.rule.ActivityTestRule
import com.example.semora.MainActivity
import com.example.semora.R
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.Semester
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class SemesterUiTest {

    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java, false, false)

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<android.app.Application>()
        val db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
        runBlocking {
            db.semesterDao().insertSemester(Semester(userId = 1, semesterNumber = 1, sgpa = 9.0, totalCredits = 20))
        }
    }

    @After
    fun teardown() {
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun mainActivityShowsSemesterTab() {
        activityRule.launchActivity(Intent())
        onView(withId(R.id.nav_semester)).check(matches(isDisplayed()))
    }

    @Test
    fun semesterTabHasSemester1Chip() {
        activityRule.launchActivity(Intent())
        onView(withId(R.id.nav_semester)).perform(click())
        try { Thread.sleep(500) } catch (_: Exception) {}
        onView(withText("Semester 1")).check(matches(isDisplayed()))
    }
}
