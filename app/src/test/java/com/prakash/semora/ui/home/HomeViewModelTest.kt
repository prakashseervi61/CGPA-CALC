package com.prakash.semora.ui.home

import android.app.Application
import com.prakash.semora.data.SemesterCurriculum
import com.prakash.semora.model.GradeEntity
import io.mockk.mockk
import org.junit.Assert.assertEquals
import org.junit.Test

class HomeViewModelTest {

    private val vm = HomeViewModel(mockk<Application>(relaxed = true))

    @Test
    fun `computeDashboard empty returns zeros`() {
        val result = vm.computeDashboard(emptyList(), emptyList())
        assertEquals(0.0, result.cgpa, 0.001)
        assertEquals("", result.cgpaMessage)
        assertEquals(0, result.cgpaProgress)
        assertEquals(0, result.completedSemesters)
        assertEquals(0, result.gradedCredits)
        assertEquals(SemesterCurriculum.totalCurriculumCredits, result.totalCurriculumCredits)
    }

    @Test
    fun `computeDashboard single grade computes weighted CGPA`() {
        val grades = listOf(GradeEntity(1, 1, "23MA101", "Maths", 4, "O"))
        val result = vm.computeDashboard(emptyList(), grades)
        assertEquals(10.0, result.cgpa, 0.001)
        assertEquals(4, result.gradedCredits)
    }

    @Test
    fun `computeDashboard mixed grades computes correct weighted average`() {
        val grades = listOf(
            GradeEntity(1, 1, "23MA101", "Maths", 4, "O"),
            GradeEntity(1, 1, "23SB101", "Bio", 3, "A")
        )
        val result = vm.computeDashboard(emptyList(), grades)
        val expected = (10.0 * 4 + 8.0 * 3) / 7
        assertEquals(expected, result.cgpa, 0.001)
        assertEquals(7, result.gradedCredits)
    }

    @Test
    fun `computeDashboard no grades yields zero`() {
        val grades = listOf(GradeEntity(1, 1, "23MA101", "Maths", 4, ""))
        val result = vm.computeDashboard(emptyList(), grades)
        assertEquals(0.0, result.cgpa, 0.001)
        assertEquals(0, result.gradedCredits)
    }

    @Test
    fun `computeDashboard detects completed semester when all subjects graded`() {
        val sem1 = SemesterCurriculum.getSemester(1)
        val grades = sem1.courses.mapIndexed { i, c ->
            GradeEntity(1, 1, c.code, c.name, c.credits, "A+")
        }
        val result = vm.computeDashboard(emptyList(), grades)
        assertEquals(1, result.completedSemesters)
    }

    @Test
    fun `computeDashboard partial grades yields 0 completed semesters`() {
        val grades = listOf(GradeEntity(1, 1, "23MA101", "Maths", 4, "A+"))
        val result = vm.computeDashboard(emptyList(), grades)
        assertEquals(0, result.completedSemesters)
    }

    @Test
    fun `cgpa 0 yields empty message`() {
        val result = vm.computeDashboard(emptyList(), emptyList())
        assertEquals("", result.cgpaMessage)
    }

    @Test
    fun `cgpa 9_5 yields Outstanding`() {
        val grades = listOf(GradeEntity(1, 1, "23MA101", "Maths", 4, "O"))
        val result = vm.computeDashboard(emptyList(), grades)
        assertEquals("Outstanding", result.cgpaMessage)
    }

    @Test
    fun `cgpa 9_0 yields Excellent`() {
        val grades = listOf(GradeEntity(1, 1, "23MA101", "Maths", 4, "A+"))
        val result = vm.computeDashboard(emptyList(), grades)
        assertEquals("Excellent", result.cgpaMessage)
    }

    @Test
    fun `cgpa 8_0 yields Very Good`() {
        val grades = listOf(GradeEntity(1, 1, "23MA101", "Maths", 4, "A"))
        val result = vm.computeDashboard(emptyList(), grades)
        assertEquals("Very Good", result.cgpaMessage)
    }

    @Test
    fun `cgpa 5_0 yields Needs Improvement`() {
        val grades = listOf(GradeEntity(1, 1, "23MA101", "Maths", 4, "C"))
        val result = vm.computeDashboard(emptyList(), grades)
        assertEquals("Needs Improvement", result.cgpaMessage)
    }

    @Test
    fun `creditsProgress matches ratio`() {
        val grades = listOf(GradeEntity(1, 1, "23MA101", "Maths", 4, "A"))
        val result = vm.computeDashboard(emptyList(), grades)
        val expected = (4f / SemesterCurriculum.totalCurriculumCredits * 100).toInt()
        assertEquals(expected, result.creditsProgress)
    }
}
