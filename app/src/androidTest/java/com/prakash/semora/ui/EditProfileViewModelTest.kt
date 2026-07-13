package com.prakash.semora.ui

import android.app.Application
import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.User
import com.prakash.semora.ui.profile.EditProfileViewModel
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class EditProfileViewModelTest {

    @get:Rule val instantTask = InstantTaskExecutorRule()

    private lateinit var db: AppDatabase
    private lateinit var viewModel: EditProfileViewModel

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<Application>()
        db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
        viewModel = EditProfileViewModel(ctx)
    }

    @After
    fun teardown() {
        db.close()
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun loadProfile_populatesState() {
        viewModel.loadProfile(1, "alice", System.currentTimeMillis())
        val s = viewModel.state.value
        assertNotNull(s)
        assertEquals("alice", s!!.username)
    }

    @Test
    fun updateUsername_validatesMinLength() {
        viewModel.loadProfile(1, "alice", System.currentTimeMillis())
        viewModel.updateUsername("ab")
        assertEquals("Minimum 3 characters required", viewModel.state.value?.usernameError)
    }

    @Test
    fun updateUsername_validatesMaxLength() {
        viewModel.loadProfile(1, "alice", System.currentTimeMillis())
        viewModel.updateUsername("abcdefghijklmnopqrstu")
        assertEquals("Maximum 20 characters", viewModel.state.value?.usernameError)
    }

    @Test
    fun updateUsername_validLengthClearsError() {
        viewModel.loadProfile(1, "alice", System.currentTimeMillis())
        viewModel.updateUsername("ab")
        assertNotNull(viewModel.state.value?.usernameError)
        viewModel.updateUsername("alice_new")
        assertNull(viewModel.state.value?.usernameError)
    }

    @Test
    fun saveWithSameUsername_succeeds() {
        viewModel.loadProfile(1, "alice", System.currentTimeMillis())
        viewModel.save()
        assertTrue(viewModel.state.value?.saveSuccess ?: false)
    }

    @Test
    fun saveWithDuplicateUsername_showsError() = runBlocking {
        db.userDao().insertUser(User(username = "existing", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        val ctx = ApplicationProvider.getApplicationContext<Application>()
        SessionManager(ctx).saveUserSession(99, "test")
        viewModel.loadProfile(99, "test", System.currentTimeMillis())
        viewModel.updateUsername("existing")
        viewModel.save()
        Thread.sleep(200)
        assertEquals("Username already exists", viewModel.state.value?.usernameError)
    }

    @Test
    fun saveWithNewUsername_updatesDb() = runBlocking {
        val ctx = ApplicationProvider.getApplicationContext<Application>()
        val uid = db.userDao().insertUser(User(username = "old", pin = "hash", salt = "salt", avatarColor = 0, createdAt = 1L))
        SessionManager(ctx).saveUserSession(uid.toInt(), "old")
        viewModel.loadProfile(uid.toInt(), "old", System.currentTimeMillis())
        viewModel.updateUsername("newname")
        viewModel.save()
        Thread.sleep(200)
        val updated = db.userDao().getUserById(uid.toInt())
        assertEquals("newname", updated!!.username)
    }

    @Test
    fun hasUnsavedChanges_detectsChange() {
        viewModel.loadProfile(1, "alice", System.currentTimeMillis())
        assertFalse(viewModel.hasUnsavedChanges())
        viewModel.updateUsername("bob")
        assertTrue(viewModel.hasUnsavedChanges())
    }
}
