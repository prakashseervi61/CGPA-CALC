package com.prakash.semora.ui

import android.app.Application
import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.ui.auth.AuthViewModel
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AuthViewModelTest {

    @get:Rule val instantTask = InstantTaskExecutorRule()

    private lateinit var db: AppDatabase
    private lateinit var viewModel: AuthViewModel

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<Application>()
        db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
        viewModel = AuthViewModel(ctx)
    }

    @After
    fun teardown() {
        db.close()
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun registerWithValidData_createsUser() {
        viewModel.register("alice", "1234", "1234")
        val user = viewModel.authResult.value
        assertNotNull(user)
        assertEquals("alice", user!!.username)
        assertTrue(viewModel.registrationSuccess.value!!)
    }

    @Test
    fun registerWithDuplicateUsername_showsError() {
        viewModel.register("alice", "1234", "1234")
        viewModel.register("alice", "5678", "5678")
        assertEquals("Username already exists", viewModel.authMessage.value)
    }

    @Test
    fun registerWithBlankUsername_showsFormError() {
        viewModel.register("", "1234", "1234")
        assertEquals("Username is required", viewModel.formState.value?.usernameError)
        assertNull(viewModel.authResult.value)
    }

    @Test
    fun registerWithShortPin_showsFormError() {
        viewModel.register("alice", "123", "123")
        assertEquals("PIN must be exactly 4 digits", viewModel.formState.value?.pinError)
    }

    @Test
    fun registerWithNonDigitPin_showsFormError() {
        viewModel.register("alice", "12ab", "12ab")
        assertEquals("PIN must be exactly 4 digits", viewModel.formState.value?.pinError)
    }

    @Test
    fun registerWithMismatchedConfirm_showsFormError() {
        viewModel.register("alice", "1234", "5678")
        assertEquals("PINs do not match", viewModel.formState.value?.confirmPinError)
    }

    @Test
    fun loginWithCorrectPin_succeeds() {
        viewModel.register("alice", "1234", "1234")
        viewModel.login("alice", "1234")
        assertNotNull(viewModel.authResult.value)
        assertEquals("alice", viewModel.authResult.value!!.username)
    }

    @Test
    fun loginWithWrongPin_fails() {
        viewModel.register("alice", "1234", "1234")
        viewModel.login("alice", "0000")
        assertNull(viewModel.authResult.value)
        assertEquals("Incorrect PIN. Try again.", viewModel.authMessage.value)
    }

    @Test
    fun loginWithEmptyUsername_showsError() {
        viewModel.login("", "1234")
        assertEquals("Username cannot be empty", viewModel.authMessage.value)
    }

    @Test
    fun registerClearsFormStateOnSuccess() = runBlocking {
        viewModel.register("alice", "1234", "1234")
        val formState = viewModel.formState.value
        assertNotNull(formState)
        assertNull(formState?.usernameError)
        assertNull(formState?.pinError)
        assertNull(formState?.confirmPinError)
    }
}
