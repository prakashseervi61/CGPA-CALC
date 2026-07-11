package com.prakash.semora.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class SemesterCurriculumTest {

    @Test
    fun `getSemester 1 through 8 returns non-empty courses`() {
        for (i in 1..8) {
            val sem = SemesterCurriculum.getSemester(i)
            assertTrue("Semester $i should have courses", sem.courses.isNotEmpty())
        }
    }

    @Test
    fun `getSemester 0 returns fallback with empty list`() {
        val sem = SemesterCurriculum.getSemester(0)
        assertEquals(0, sem.number)
        assertTrue(sem.courses.isEmpty())
    }

    @Test
    fun `getSemester 9 returns fallback with empty list`() {
        val sem = SemesterCurriculum.getSemester(9)
        assertEquals(9, sem.number)
        assertTrue(sem.courses.isEmpty())
    }

    @Test
    fun `getSemester 99 returns fallback with empty list`() {
        val sem = SemesterCurriculum.getSemester(99)
        assertEquals(99, sem.number)
        assertTrue(sem.courses.isEmpty())
    }

    @Test
    fun `gradeToPoint O returns 10`() {
        assertEquals(10.0, SemesterCurriculum.gradeToPoint("O"), 0.001)
    }

    @Test
    fun `gradeToPoint A+ returns 9`() {
        assertEquals(9.0, SemesterCurriculum.gradeToPoint("A+"), 0.001)
    }

    @Test
    fun `gradeToPoint A returns 8`() {
        assertEquals(8.0, SemesterCurriculum.gradeToPoint("A"), 0.001)
    }

    @Test
    fun `gradeToPoint B+ returns 7`() {
        assertEquals(7.0, SemesterCurriculum.gradeToPoint("B+"), 0.001)
    }

    @Test
    fun `gradeToPoint B returns 6`() {
        assertEquals(6.0, SemesterCurriculum.gradeToPoint("B"), 0.001)
    }

    @Test
    fun `gradeToPoint C returns 5`() {
        assertEquals(5.0, SemesterCurriculum.gradeToPoint("C"), 0.001)
    }

    @Test
    fun `gradeToPoint U returns 0`() {
        assertEquals(0.0, SemesterCurriculum.gradeToPoint("U"), 0.001)
    }

    @Test
    fun `gradeToPoint empty string returns 0`() {
        assertEquals(0.0, SemesterCurriculum.gradeToPoint(""), 0.001)
    }

    @Test
    fun `gradeToPoint invalid grade returns 0`() {
        assertEquals(0.0, SemesterCurriculum.gradeToPoint("Z"), 0.001)
    }

    @Test
    fun `totalCurriculumCredits is positive`() {
        assertTrue(SemesterCurriculum.totalCurriculumCredits > 0)
    }

    @Test
    fun `getAllSemesters returns 8 semesters`() {
        assertEquals(8, SemesterCurriculum.getAllSemesters().size)
    }
}
