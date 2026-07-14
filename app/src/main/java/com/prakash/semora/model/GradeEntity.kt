package com.prakash.semora.model

import androidx.room.Entity

@Entity(
    tableName = "grades",
    primaryKeys = ["userId", "semesterNumber", "courseCode"]
)
data class GradeEntity(
    val userId: Int,
    val semesterNumber: Int,
    val courseCode: String,
    val courseName: String,
    val credits: Int,
    val grade: String
)
