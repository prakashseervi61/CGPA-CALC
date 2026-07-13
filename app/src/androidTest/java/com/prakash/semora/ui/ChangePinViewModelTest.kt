package com.prakash.semora.ui

import android.app.Application
import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.User
import com.prakash.semora.ui.profile.ChangePinViewModel
import com.prakash.semora.utils.PinHasher
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
class ChangePinViewModelTest {

    @get:Rule val instantTask = InstantTaskExecutorRule()

    private lateinit var db: AppDatabase
    private lateinit var viewModel: ChangePinViewModel

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<Application>()
        db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
        viewModel = ChangePinViewModel(ctx)
    }

    @After
    fun teardown() {
        db.close()
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun verifyCurrentPin_correct_advancesStep() {
        val salt = PinHasher.generateSalt()
        val hash = PinHasher.hash("1234", salt)
        runBlocking {
            val uid = db.userDao().insertUser(User(username = "u", pin = hash, salt = salt, avatarColor = 0, createdAt = 1L))
            SessionManager(ApplicationProvider.getApplicationContext()).saveUserSession(uid.toInt(), "u")
        }
        viewModel.loadUser()
        Thread.sleep(200)
        viewModel.verifyCurrentPin("1234")
        assertEquals(2, viewModel.step.value ?: -1)
    }

    @Test
    fun verifyCurrentPin_wrong_showsError() {
        val salt = PinHasher.generateSalt()
        val hash = PinHasher.hash("1234", salt)
        runBlocking {
            val uid = db.userDao().insertUser(User(username = "u", pin = hash, salt = salt, avatarColor = 0, createdAt = 1L))
            SessionManager(ApplicationProvider.getApplicationContext()).saveUserSession(uid.toInt(), "u")
        }
        viewModel.loadUser()
        Thread.sleep(200)
        viewModel.verifyCurrentPin("0000")
        assertEquals("Incorrect current PIN.", viewModel.currentPinError.value)
        assertEquals(1, viewModel.step.value ?: -1)
    }

    @Test
    fun verifyCurrentPin_invalidFormat_showsError() {
        viewModel.verifyCurrentPin("12")
        assertNotNull(viewModel.currentPinError.value)
    }

    @Test
    fun updatePin_sameAsCurrent_showsError() {
        val salt = PinHasher.generateSalt()
        val hash = PinHasher.hash("1234", salt)
        runBlocking {
            val uid = db.userDao().insertUser(User(username = "u", pin = hash, salt = salt, avatarColor = 0, createdAt = 1L))
            SessionManager(ApplicationProvider.getApplicationContext()).saveUserSession(uid.toInt(), "u")
        }
        viewModel.loadUser()
        Thread.sleep(200)
        viewModel.updatePin("1234", "1234")
        assertEquals("New PIN cannot be the same as current PIN", viewModel.newPinError.value)
    }

    @Test
    fun updatePin_mismatchedConfirm_showsError() {
        val salt = PinHasher.generateSalt()
        val hash = PinHasher.hash("1234", salt)
        runBlocking {
            val uid = db.userDao().insertUser(User(username = "u", pin = hash, salt = salt, avatarColor = 0, createdAt = 1L))
            SessionManager(ApplicationProvider.getApplicationContext()).saveUserSession(uid.toInt(), "u")
        }
        viewModel.loadUser()
        Thread.sleep(200)
        viewModel.updatePin("5678", "9999")
        assertEquals("PINs do not match", viewModel.confirmPinError.value)
    }

    @Test
    fun updatePin_valid_savesToDb() = runBlocking {
        val salt = PinHasher.generateSalt()
        val hash = PinHasher.hash("1234", salt)
        val uid = db.userDao().insertUser(User(username = "u", pin = hash, salt = salt, avatarColor = 0, createdAt = 1L))
        SessionManager(ApplicationProvider.getApplicationContext()).saveUserSession(uid.toInt(), "u")
        viewModel.loadUser()
        Thread.sleep(200)
        viewModel.updatePin("5678", "5678")
        Thread.sleep(200)
        val updated = db.userDao().getUserById(uid.toInt())
        assertNotNull(updated)
        assertTrue(PinHasher.verify("5678", updated!!.pin, updated.salt))
        assertTrue(viewModel.success.value ?: false)
    }
}
