package com.prakash.semora.model

data class Course(
    val code: String,
    val name: String,
    val credits: Int,
    var grade: String = ""
)

data class SemesterData(
    val number: Int,
    val courses: List<Course>
) {
    val totalCredits: Int get() = courses.sumOf { it.credits }
}
