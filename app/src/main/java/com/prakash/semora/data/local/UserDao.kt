package com.prakash.semora.data.local

import androidx.room.*
import com.prakash.semora.model.User

@Dao
interface UserDao {
    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertUser(user: User): Long

    @Query("SELECT * FROM users WHERE id = :id")
    suspend fun getUserById(id: Int): User?

    @Query("SELECT * FROM users WHERE username = :username LIMIT 1")
    suspend fun getUserByUsername(username: String): User?

    @Query("SELECT * FROM users ORDER BY createdAt ASC")
    suspend fun getAllUsers(): List<User>

    @Delete
    suspend fun deleteUser(user: User)

    @Query("UPDATE users SET username = :username WHERE id = :id")
    suspend fun updateUsername(id: Int, username: String)

    @Query("UPDATE users SET pin = :pin, salt = :salt WHERE id = :id")
    suspend fun updatePin(id: Int, pin: String, salt: String)

    @Query("UPDATE users SET lastOpened = :timestamp WHERE id = :id")
    suspend fun updateLastOpened(id: Int, timestamp: Long)
}
