package com.prakash.semora.ui.semester

import com.prakash.semora.data.SemesterCurriculum
import com.prakash.semora.data.remote.FirestoreSemesterRepository
import com.prakash.semora.mockApplication
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotSame
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class SemViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `updateGrade replaces grade and recomputes sgpa`() {
        val repo = mockk<FirestoreSemesterRepository>(relaxed = true)
        val vm = SemViewModel(mockApplication(), repo)
        val sem1 = SemesterCurriculum.getSemester(1)

        vm.selectSemester(1)
        vm.updateGrade(sem1.courses.first().code, "O")

        val state = vm.currentState.value
        val updated = state.courses.first { it.code == sem1.courses.first().code }
        assertEquals("O", updated.grade)
        assertTrue(state.sgpa > 0)
    }

    @Test
    fun `updateGrade preserves state immutability`() {
        val repo = mockk<FirestoreSemesterRepository>(relaxed = true)
        val vm = SemViewModel(mockApplication(), repo)

        vm.selectSemester(1)
        val before = vm.currentState.value
        val coursesBefore = before.courses.map { it.copy() }

        vm.updateGrade(before.courses.first().code, "O")

        val after = vm.currentState.value
        assertEquals(coursesBefore.size, after.courses.size)
        assertEquals(coursesBefore.first().code, after.courses.first().code)
        assertNotSame(before, after)
    }

    @Test
    fun `all courses graded sets allGraded true`() {
        val repo = mockk<FirestoreSemesterRepository>(relaxed = true)
        val vm = SemViewModel(mockApplication(), repo)

        vm.selectSemester(1)
        val sem1 = SemesterCurriculum.getSemester(1)

        sem1.courses.forEach { course ->
            vm.updateGrade(course.code, "O")
        }

        val state = vm.currentState.value
        assertTrue(state.allGraded)
    }

    @Test
    fun `selectSemester switches cached state`() {
        val repo = mockk<FirestoreSemesterRepository>(relaxed = true)
        val vm = SemViewModel(mockApplication(), repo)

        vm.selectSemester(1)
        vm.selectSemester(2)

        assertEquals(2, vm.currentState.value.semesterNumber)
    }
}
