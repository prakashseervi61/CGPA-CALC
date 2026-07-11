package com.prakash.semora.model

import com.prakash.semora.data.SemesterCurriculum

data class SemesterState(
    val semesterNumber: Int,
    val courses: List<Course>,
    val sgpa: Double = 0.0,
    val completedSubjects: Int = 0,
    val totalSubjects: Int = 0,
    val totalCredits: Int = 0,
    val totalGradedCredits: Int = 0,
    val allGraded: Boolean = false
) {
    companion object {
        fun empty(number: Int): SemesterState {
            val data = SemesterCurriculum.getSemester(number)
            val courses = data.courses.map { Course(it.code, it.name, it.credits, "") }
            return SemesterState(
                semesterNumber = number,
                courses = courses,
                totalSubjects = courses.size,
                totalCredits = courses.sumOf { it.credits }
            )
        }
    }
}
