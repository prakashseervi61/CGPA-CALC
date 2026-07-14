package com.prakash.semora.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "semesters")
data class Semester(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int,
    val semesterNumber: Int,
    val sgpa: Double,
    val totalCredits: Int
)
