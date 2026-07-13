package com.prakash.semora.data.local

import androidx.room.*
import com.prakash.semora.model.Semester

@Dao
interface SemesterDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSemester(semester: Semester): Long

    @Query("SELECT * FROM semesters WHERE userId = :userId AND semesterNumber = :semesterNumber LIMIT 1")
    suspend fun getSemester(userId: Int, semesterNumber: Int): Semester?

    @Query("SELECT * FROM semesters WHERE userId = :userId ORDER BY semesterNumber ASC")
    suspend fun getSemesters(userId: Int): List<Semester>

    @Query("DELETE FROM semesters WHERE userId = :userId AND semesterNumber = :semesterNumber")
    suspend fun deleteSemesterByNumber(userId: Int, semesterNumber: Int)

    @Query("UPDATE semesters SET sgpa = :sgpa, totalCredits = :totalCredits WHERE userId = :userId AND semesterNumber = :semesterNumber")
    suspend fun updateSemesterSummary(userId: Int, semesterNumber: Int, sgpa: Double, totalCredits: Int)
}
