package com.prakash.semora.data.remote

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class FirestoreSemesterRepositoryTest {

    @Test
    fun `missing grades field defaults to empty map`() {
        val data = mapOf<String, Any>(
            "semesterNumber" to 1L,
        )
        val sem = FirestoreSemesterRepository.docToSemester("doc1", data)
        assertEquals(1, sem.semesterNumber)
        assertTrue(sem.grades.isEmpty())
    }

    @Test
    fun `empty grades map returns valid SemesterDoc`() {
        val data = mapOf<String, Any>(
            "semesterNumber" to 1L,
            "grades" to emptyMap<String, Any>(),
        )
        val sem = FirestoreSemesterRepository.docToSemester("doc1", data)
        assertEquals(1, sem.semesterNumber)
        assertTrue(sem.grades.isEmpty())
    }

    @Test
    fun `null semesterNumber defaults to 0`() {
        val data = emptyMap<String, Any>()
        val sem = FirestoreSemesterRepository.docToSemester("doc1", data)
        assertEquals(0, sem.semesterNumber)
    }

    @Test
    fun `credits coerces from Long to Int`() {
        val grades = mapOf(
            "23MA101" to mapOf(
                "courseCode" to "23MA101",
                "courseName" to "Maths",
                "credits" to 4L,
                "grade" to "O",
            )
        )
        val data = mapOf<String, Any>(
            "semesterNumber" to 1L,
            "grades" to grades,
        )
        val sem = FirestoreSemesterRepository.docToSemester("doc1", data)
        val grade = sem.grades["23MA101"]
        assertEquals(4, grade?.credits)
        assertEquals("O", grade?.grade)
    }

    @Test
    fun `null grade values in grades map default to empty strings`() {
        val grades = mapOf(
            "23MA101" to mapOf<String, Any?>(
                "courseCode" to null,
                "courseName" to null,
                "credits" to null,
                "grade" to null,
            )
        )
        val data = mapOf<String, Any>(
            "semesterNumber" to 1L,
            "grades" to grades,
        )
        val sem = FirestoreSemesterRepository.docToSemester("doc1", data)
        val grade = sem.grades["23MA101"]
        assertEquals("", grade?.courseCode)
        assertEquals("", grade?.courseName)
        assertEquals(0, grade?.credits)
        assertEquals("", grade?.grade)
    }

    @Test
    fun `sgpa defaults to 0`() {
        val data = mapOf<String, Any>("semesterNumber" to 1L)
        val sem = FirestoreSemesterRepository.docToSemester("doc1", data)
        assertEquals(0.0, sem.sgpa, 0.001)
    }

    @Test
    fun `map with all fields parses correctly`() {
        val grades = mapOf(
            "23MA101" to mapOf(
                "courseCode" to "23MA101",
                "courseName" to "Maths",
                "credits" to 4L,
                "grade" to "O",
            )
        )
        val data = mapOf<String, Any>(
            "semesterNumber" to 2L,
            "sgpa" to 9.5,
            "totalCredits" to 20L,
            "totalGradedCredits" to 20L,
            "grades" to grades,
        )
        val sem = FirestoreSemesterRepository.docToSemester("doc2", data)
        assertEquals(2, sem.semesterNumber)
        assertEquals(9.5, sem.sgpa, 0.001)
        assertEquals(20, sem.totalCredits)
        assertEquals(20, sem.totalGradedCredits)
        assertEquals(1, sem.grades.size)
    }
}
