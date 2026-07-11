package com.prakash.semora.utils

import com.prakash.semora.data.SemesterCurriculum
import com.prakash.semora.model.Course

object SgpaCalculator {
    fun compute(courses: List<Course>): Double {
        val graded = courses.filter { it.grade.isNotEmpty() }
        val totalGradedCredits = graded.sumOf { it.credits }
        if (totalGradedCredits == 0) return 0.0
        val weightedSum = graded.sumOf {
            SemesterCurriculum.gradeToPoint(it.grade) * it.credits
        }
        return weightedSum / totalGradedCredits
    }
}
