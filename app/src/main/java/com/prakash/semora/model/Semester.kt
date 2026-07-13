package com.prakash.semora.model

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "semesters",
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
data class Semester(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int,
    val semesterNumber: Int,
    val sgpa: Double,
    val totalCredits: Int
)
