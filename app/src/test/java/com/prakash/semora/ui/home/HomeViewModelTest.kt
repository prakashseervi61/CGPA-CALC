package com.prakash.semora.ui.home

import com.prakash.semora.data.remote.GradeDoc
import com.prakash.semora.mockApplication
import com.prakash.semora.data.remote.SemesterDoc
import org.junit.Assert.assertEquals
import org.junit.Test

class HomeViewModelTest {

    private fun makeViewModel() = HomeViewModel(mockApplication())

    @Test
    fun `empty semesters returns zero cgpa`() {
        val vm = makeViewModel()
        val result = vm.computeDashboard(emptyList())
        assertEquals(0.0, result.cgpa, 0.001)
        assertEquals(0, result.completedSemesters)
    }

    @Test
    fun `one semester with mixed grades computes correct cgpa`() {
        val vm = makeViewModel()
        val grades = mapOf(
            "23MA101" to GradeDoc("23MA101", "Maths", 4, "O"),
            "23CS101" to GradeDoc("23CS101", "CS", 3, "A"),
        )
        val semesters = listOf(SemesterDoc(semesterNumber = 1, grades = grades))
        val result = vm.computeDashboard(semesters)
        val expected = (10.0 * 4 + 8.0 * 3) / (4 + 3)
        assertEquals(expected, result.cgpa, 0.001)
    }

    @Test
    fun `all courses graded increments completed semesters`() {
        val vm = makeViewModel()
        val sem1Courses = SemesterDoc(semesterNumber = 1, grades = mapOf(
            "23MA101" to GradeDoc("23MA101", "Maths", 4, "O"),
            "23SB101" to GradeDoc("23SB101", "Biology", 3, "A+"),
            "23AS101" to GradeDoc("23AS101", "Science", 4, "A"),
            "23EC111" to GradeDoc("23EC111", "DLD", 4, "B+"),
            "23CS101" to GradeDoc("23CS101", "C++", 3, "A"),
            "23IT101" to GradeDoc("23IT101", "ADP", 3, "O"),
            "23AS102" to GradeDoc("23AS102", "Science Lab", 2, "A+"),
            "23TA101" to GradeDoc("23TA101", "Heritage", 1, "A"),
        ))
        val result = vm.computeDashboard(listOf(sem1Courses))
        assertEquals(1, result.completedSemesters)
    }

    @Test
    fun `no graded courses returns zero cgpa and zero completed`() {
        val vm = makeViewModel()
        val grades = mapOf(
            "23MA101" to GradeDoc("23MA101", "Maths", 4, ""),
            "23CS101" to GradeDoc("23CS101", "CS", 3, ""),
        )
        val semesters = listOf(SemesterDoc(semesterNumber = 1, grades = grades))
        val result = vm.computeDashboard(semesters)
        assertEquals(0.0, result.cgpa, 0.001)
        assertEquals(0, result.completedSemesters)
    }

    @Test
    fun `zero graded credits returns zero cgpa`() {
        val vm = makeViewModel()
        val result = vm.computeDashboard(listOf(SemesterDoc(semesterNumber = 1)))
        assertEquals(0.0, result.cgpa, 0.001)
    }

    @Test
    fun `cgpa progress is percentage of 10`() {
        val vm = makeViewModel()
        val grades = mapOf(
            "23MA101" to GradeDoc("23MA101", "Maths", 4, "O"),
        )
        val semesters = listOf(SemesterDoc(semesterNumber = 1, grades = grades))
        val result = vm.computeDashboard(semesters)
        assertEquals(100, result.cgpaProgress)
    }
}
