package com.prakash.semora.ui

import android.app.Application
import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.User
import com.prakash.semora.ui.profile.ProfileViewModel
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class ProfileViewModelTest {

    @get:Rule val instantTask = InstantTaskExecutorRule()

    private lateinit var db: AppDatabase
    private lateinit var viewModel: ProfileViewModel
    private var insertedUserId = -1

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<Application>()
        db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
        viewModel = ProfileViewModel(ctx)
    }

    @After
    fun teardown() {
        db.close()
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun loadProfile_withValidUser_showsData() = runBlocking {
        insertedUserId = db.userDao().insertUser(
            User(username = "alice", pin = "hash", salt = "salt", avatarColor = 0xFF1A73E8.toInt(), createdAt = System.currentTimeMillis())
        ).toInt()
        SessionManager(ApplicationProvider.getApplicationContext()).saveUserSession(insertedUserId, "alice")
        viewModel.loadProfile()
        Thread.sleep(200)
        assertEquals("alice", viewModel.username.value)
    }

    @Test
    fun loadProfile_withoutUser_showsDefaults() {
        viewModel.loadProfile()
        Thread.sleep(200)
        assertEquals("U", viewModel.avatarInitial.value)
    }

    @Test
    fun loadProfile_withClosedDb_hasErrorMessage() = runBlocking {
        insertedUserId = db.userDao().insertUser(
            User(username = "charlie", pin = "hash", salt = "salt", avatarColor = 0, createdAt = System.currentTimeMillis())
        ).toInt()
        SessionManager(ApplicationProvider.getApplicationContext()).saveUserSession(insertedUserId, "charlie")
        db.close()
        viewModel.loadProfile()
        Thread.sleep(200)
        assertNotNull(viewModel.errorMessage.value)
    }
}
