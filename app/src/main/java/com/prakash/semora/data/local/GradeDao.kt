package com.prakash.semora.data.local

import androidx.room.*
import com.prakash.semora.model.GradeEntity

@Dao
interface GradeDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGrade(grade: GradeEntity)

    @Query("SELECT * FROM grades WHERE userId = :userId AND semesterNumber = :semesterNumber")
    suspend fun getGradesForSemester(userId: Int, semesterNumber: Int): List<GradeEntity>

    @Query("SELECT * FROM grades WHERE userId = :userId")
    suspend fun getGradesForUser(userId: Int): List<GradeEntity>

    @Query("DELETE FROM grades WHERE userId = :userId AND semesterNumber = :semesterNumber")
    suspend fun deleteGradesForSemester(userId: Int, semesterNumber: Int)
}
