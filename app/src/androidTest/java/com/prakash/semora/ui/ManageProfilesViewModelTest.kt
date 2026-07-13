package com.prakash.semora.ui

import android.app.Application
import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.Semester
import com.prakash.semora.model.User
import com.prakash.semora.ui.profile.ManageProfilesViewModel
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class ManageProfilesViewModelTest {

    @get:Rule val instantTask = InstantTaskExecutorRule()

    private lateinit var db: AppDatabase
    private lateinit var viewModel: ManageProfilesViewModel

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<Application>()
        db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
        viewModel = ManageProfilesViewModel(ctx)
    }

    @After
    fun teardown() {
        db.close()
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun loadProfiles_withUsers_listsAll() = runBlocking {
        db.userDao().insertUser(User(username = "alice", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        db.userDao().insertUser(User(username = "bob", pin = "h", salt = "s", avatarColor = 0, createdAt = 2L))
        viewModel.loadProfiles(1)
        Thread.sleep(200)
        val state = viewModel.state.value
        assertNotNull(state)
        assertEquals(2, state!!.profiles.size)
    }

    @Test
    fun loadProfiles_empty_returnsEmpty() {
        viewModel.loadProfiles(1)
        Thread.sleep(200)
        val state = viewModel.state.value
        assertNotNull(state)
        assertTrue(state!!.profiles.isEmpty())
    }

    @Test
    fun loadProfiles_marksActiveProfile() = runBlocking {
        val uid = db.userDao().insertUser(User(username = "alice", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        viewModel.loadProfiles(uid.toInt())
        Thread.sleep(200)
        val item = viewModel.state.value!!.profiles.first()
        assertTrue(item.isActive)
    }

    @Test
    fun loadProfiles_calculatesCgpa() = runBlocking {
        val uid = db.userDao().insertUser(User(username = "alice", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        db.semesterDao().insertSemester(Semester(userId = uid.toInt(), semesterNumber = 1, sgpa = 9.0, totalCredits = 20))
        viewModel.loadProfiles(uid.toInt())
        Thread.sleep(200)
        val item = viewModel.state.value!!.profiles.first()
        assertEquals("9.00", item.cgpa)
    }

    @Test
    fun deleteProfile_removesFromDb() = runBlocking {
        val uid = db.userDao().insertUser(User(username = "alice", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        db.userDao().insertUser(User(username = "bob", pin = "h", salt = "s", avatarColor = 0, createdAt = 2L))
        SessionManager(ApplicationProvider.getApplicationContext()).saveUserSession(uid.toInt(), "alice")
        var callbackCalled = false
        viewModel.loadProfiles(uid.toInt())
        Thread.sleep(200)
        val alice = db.userDao().getUserById(uid.toInt())!!
        viewModel.deleteProfile(alice) { callbackCalled = true }
        Thread.sleep(200)
        assertEquals(1, viewModel.state.value!!.profiles.size)
        assertTrue(callbackCalled)
    }

    @Test
    fun calculateCgpa_noSemesters_returnsN_A() = runBlocking {
        val uid = db.userDao().insertUser(User(username = "alice", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        viewModel.loadProfiles(uid.toInt())
        Thread.sleep(200)
        val item = viewModel.state.value!!.profiles.first()
        assertEquals("N/A", item.cgpa)
    }
}
