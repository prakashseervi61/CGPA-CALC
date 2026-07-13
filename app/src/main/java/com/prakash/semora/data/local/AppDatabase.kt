package com.prakash.semora.data.local

import android.content.Context
import androidx.annotation.VisibleForTesting
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.prakash.semora.model.GradeEntity
import com.prakash.semora.model.Semester
import com.prakash.semora.model.User

@Database(
    entities = [User::class, Semester::class, GradeEntity::class],
    version = 9,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun semesterDao(): SemesterDao
    abstract fun gradeDao(): GradeDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        @VisibleForTesting
        fun setTestInstance(db: AppDatabase?) { INSTANCE = db }

        private val MIGRATION_8_9 = object : Migration(8, 9) {
            override fun migrate(database: SupportSQLiteDatabase) {
                database.execSQL("CREATE TABLE IF NOT EXISTS `_users_new` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `username` TEXT NOT NULL, `pin` TEXT NOT NULL, `salt` TEXT NOT NULL, `avatarColor` INTEGER NOT NULL, `createdAt` INTEGER NOT NULL, `lastOpened` INTEGER)")
                database.execSQL("INSERT INTO _users_new (id, username, pin, salt, avatarColor, createdAt, lastOpened) SELECT id, username, pin, salt, avatarColor, createdAt, lastOpened FROM users")
                database.execSQL("DROP TABLE users")
                database.execSQL("ALTER TABLE _users_new RENAME TO users")
            }
        }

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "semora_database"
                )
                .addMigrations(MIGRATION_8_9)
                .fallbackToDestructiveMigration(true)
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
