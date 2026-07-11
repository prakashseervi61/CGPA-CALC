package com.prakash.semora.utils

import com.prakash.semora.model.Course
import org.junit.Assert.assertEquals
import org.junit.Test

class SgpaCalculatorTest {

    @Test
    fun `empty courses returns 0`() {
        assertEquals(0.0, SgpaCalculator.compute(emptyList()), 0.001)
    }

    @Test
    fun `all ungraded courses returns 0`() {
        val courses = listOf(
            Course("23MA101", "Maths", 4, ""),
            Course("23CS101", "CS", 3, ""),
        )
        assertEquals(0.0, SgpaCalculator.compute(courses), 0.001)
    }

    @Test
    fun `single graded course returns grade point`() {
        val courses = listOf(Course("23MA101", "Maths", 4, "O"))
        assertEquals(10.0, SgpaCalculator.compute(courses), 0.001)
    }

    @Test
    fun `mix of graded and ungraded computes weighted average`() {
        val courses = listOf(
            Course("23MA101", "Maths", 4, "O"),
            Course("23CS101", "CS", 3, ""),
            Course("23IT101", "IT", 3, "A"),
        )
        val expected = (10.0 * 4 + 8.0 * 3) / (4 + 3)
        assertEquals(expected, SgpaCalculator.compute(courses), 0.001)
    }

    @Test
    fun `all letter grades computes correct weighted average`() {
        val courses = listOf(
            Course("23MA101", "Maths", 4, "O"),
            Course("23CS101", "CS", 3, "A+"),
            Course("23IT101", "IT", 3, "A"),
            Course("23EC111", "EC", 4, "B+"),
        )
        val expected = (10.0 * 4 + 9.0 * 3 + 8.0 * 3 + 7.0 * 4) / (4 + 3 + 3 + 4)
        assertEquals(expected, SgpaCalculator.compute(courses), 0.001)
    }

    @Test
    fun `zero credit courses are handled`() {
        val courses = listOf(
            Course("23MA101", "Maths", 0, "O"),
            Course("23CS101", "CS", 0, "A"),
        )
        assertEquals(0.0, SgpaCalculator.compute(courses), 0.001)
    }

    @Test
    fun `U grade contributes 0 points`() {
        val courses = listOf(
            Course("23MA101", "Maths", 4, "U"),
            Course("23CS101", "CS", 4, "O"),
        )
        assertEquals(5.0, SgpaCalculator.compute(courses), 0.001)
    }
}
