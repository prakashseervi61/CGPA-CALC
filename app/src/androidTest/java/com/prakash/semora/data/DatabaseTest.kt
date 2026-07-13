package com.prakash.semora.data

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prakash.semora.data.local.AppDatabase
import com.prakash.semora.model.GradeEntity
import com.prakash.semora.model.Semester
import com.prakash.semora.model.User
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class DatabaseTest {

    private lateinit var db: AppDatabase

    @Before
    fun setup() {
        val ctx = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(ctx, AppDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        AppDatabase.setTestInstance(db)
    }

    @After
    fun teardown() {
        db.close()
        AppDatabase.setTestInstance(null)
    }

    @Test
    fun userDao_insertAndQuery() = runBlocking {
        val user = User(username = "alice", pin = "hash", salt = "salt", avatarColor = 0, createdAt = 1L)
        val id = db.userDao().insertUser(user)
        val loaded = db.userDao().getUserById(id.toInt())
        assertNotNull(loaded)
        assertEquals("alice", loaded!!.username)
    }

    @Test
    fun userDao_getByUsername() = runBlocking {
        val user = User(username = "bob", pin = "hash", salt = "salt", avatarColor = 0, createdAt = 1L)
        db.userDao().insertUser(user)
        val loaded = db.userDao().getUserByUsername("bob")
        assertNotNull(loaded)
        assertEquals("bob", loaded!!.username)
    }

    @Test
    fun userDao_getAllUsers() = runBlocking {
        db.userDao().insertUser(User(username = "a", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        db.userDao().insertUser(User(username = "b", pin = "h", salt = "s", avatarColor = 0, createdAt = 2L))
        assertEquals(2, db.userDao().getAllUsers().size)
    }

    @Test
    fun userDao_deleteUser() = runBlocking {
        val id = db.userDao().insertUser(User(username = "del", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        val user = db.userDao().getUserById(id.toInt())!!
        db.userDao().deleteUser(user)
        assertNull(db.userDao().getUserById(id.toInt()))
    }

    @Test
    fun semesterDao_insertAndGet() = runBlocking {
        val uid = db.userDao().insertUser(User(username = "u", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        db.semesterDao().insertSemester(Semester(userId = uid.toInt(), semesterNumber = 1, sgpa = 9.0, totalCredits = 20))
        val sem = db.semesterDao().getSemester(uid.toInt(), 1)
        assertNotNull(sem)
        assertEquals(9.0, sem!!.sgpa, 0.001)
    }

    @Test
    fun gradeDao_insertAndQueryBySemester() = runBlocking {
        val uid = db.userDao().insertUser(User(username = "u", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        val grade = GradeEntity(userId = uid.toInt(), semesterNumber = 1, courseCode = "CS101", courseName = "CS", credits = 4, grade = "A")
        db.gradeDao().insertGrade(grade)
        val grades = db.gradeDao().getGradesForSemester(uid.toInt(), 1)
        assertEquals(1, grades.size)
        assertEquals("A", grades[0].grade)
    }

    @Test
    fun gradeDao_insertReplacesOnConflict() = runBlocking {
        val uid = db.userDao().insertUser(User(username = "u", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        val g1 = GradeEntity(uid.toInt(), 1, "CS101", "CS", 4, "A")
        db.gradeDao().insertGrade(g1)
        val g2 = GradeEntity(uid.toInt(), 1, "CS101", "CS", 4, "O")
        db.gradeDao().insertGrade(g2)
        val grades = db.gradeDao().getGradesForSemester(uid.toInt(), 1)
        assertEquals(1, grades.size)
        assertEquals("O", grades[0].grade)
    }

    @Test
    fun userDelete_cascadesToSemestersAndGrades() = runBlocking {
        val uid = db.userDao().insertUser(User(username = "u", pin = "h", salt = "s", avatarColor = 0, createdAt = 1L))
        db.semesterDao().insertSemester(Semester(userId = uid.toInt(), semesterNumber = 1, sgpa = 9.0, totalCredits = 20))
        db.gradeDao().insertGrade(GradeEntity(uid.toInt(), 1, "CS101", "CS", 4, "A"))
        val user = db.userDao().getUserById(uid.toInt())!!
        db.userDao().deleteUser(user)
        assertEquals(0, db.semesterDao().getSemesters(uid.toInt()).size)
        assertEquals(0, db.gradeDao().getGradesForUser(uid.toInt()).size)
    }
}
