package com.prakash.semora.model

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index

@Entity(
    tableName = "grades",
    primaryKeys = ["userId", "semesterNumber", "courseCode"],
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["id"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("userId")]
)
data class GradeEntity(
    val userId: Int,
    val semesterNumber: Int,
    val courseCode: String,
    val courseName: String,
    val credits: Int,
    val grade: String
)
