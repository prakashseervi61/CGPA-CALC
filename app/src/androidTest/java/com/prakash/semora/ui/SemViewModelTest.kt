package com.prakash.semora.ui

import android.app.Application
import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.ui.semester.SemViewModel
import com.prakash.semora.model.GradeEntity
import kotlinx.coroutines.flow.first
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
class SemViewModelTest {

    @get:Rule val instantTask = InstantTaskExecutorRule()

    private lateinit var db: AppDatabase
    private lateinit var viewModel: SemViewModel

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<Application>()
        db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries().build()
        AppDatabase.setTestInstance(db)
        viewModel = SemViewModel(ctx)
    }

    @After
    fun teardown() {
        db.close()
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun init_loadsSemester1() = runBlocking {
        val state = viewModel.currentState.first()
        assertEquals(1, state.semesterNumber)
        assertTrue(state.courses.isNotEmpty())
        assertEquals(0, state.completedSubjects)
    }

    @Test
    fun selectSemester_switchesState() = runBlocking {
        viewModel.selectSemester(2)
        val state = viewModel.currentState.first()
        assertEquals(2, state.semesterNumber)
    }

    @Test
    fun selectSemester_sameNumber_noop() = runBlocking {
        viewModel.selectSemester(1)
        viewModel.selectSemester(1)
        val state = viewModel.currentState.first()
        assertEquals(1, state.semesterNumber)
    }

    @Test
    fun updateGrade_persistsToDb() = runBlocking {
        val course = viewModel.currentState.first().courses.first()
        viewModel.updateGrade(course.code, "O")
        val grades = db.gradeDao().getGradesForSemester(1, 1)
        assertEquals(1, grades.size)
        assertEquals("O", grades[0].grade)
    }

    @Test
    fun updateGrade_computesSgpa() = runBlocking {
        val courses = viewModel.currentState.first().courses
        courses.take(2).forEach { viewModel.updateGrade(it.code, "O") }
        val state = viewModel.currentState.first()
        assertEquals(10.0, state.sgpa, 0.001)
        assertEquals(2, state.completedSubjects)
    }

    @Test
    fun updateGrade_mixedGrades_computesWeightedSgpa() = runBlocking {
        val courses = viewModel.currentState.first().courses
        courses.take(2).forEachIndexed { i, c ->
            viewModel.updateGrade(c.code, if (i == 0) "O" else "A")
        }
        val state = viewModel.currentState.first()
        val weighted = (10.0 * courses[0].credits + 8.0 * courses[1].credits) / (courses[0].credits + courses[1].credits)
        assertEquals(weighted, state.sgpa, 0.001)
    }

    @Test
    fun updateGrade_thenReset_clearsAll() = runBlocking {
        val course = viewModel.currentState.first().courses.first()
        viewModel.updateGrade(course.code, "O")
        viewModel.resetCurrentSemester()
        val state = viewModel.currentState.first()
        assertEquals(0, state.completedSubjects)
        assertEquals(0.0, state.sgpa, 0.001)
    }

    @Test
    fun selectSemester_cachesPreviousState() = runBlocking {
        val course1 = viewModel.currentState.first().courses.first()
        viewModel.updateGrade(course1.code, "O")
        viewModel.selectSemester(2)
        viewModel.selectSemester(1)
        val state = viewModel.currentState.first()
        assertEquals(1, state.completedSubjects)
    }

    @Test
    fun allGraded_trueWhenEverySubjectHasGrade() = runBlocking {
        val courses = viewModel.currentState.first().courses
        courses.forEach { viewModel.updateGrade(it.code, "A+") }
        val state = viewModel.currentState.first()
        assertTrue(state.allGraded)
    }
}
