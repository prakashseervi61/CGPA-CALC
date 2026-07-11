package com.prakash.semora.data.remote

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import kotlinx.coroutines.tasks.await

data class GradeDoc(
    val courseCode: String = "",
    val courseName: String = "",
    val credits: Int = 0,
    val grade: String = ""
)

data class SemesterDoc(
    val semesterNumber: Int = 0,
    val sgpa: Double = 0.0,
    val totalCredits: Int = 0,
    val totalGradedCredits: Int = 0,
    val updatedAt: Long = System.currentTimeMillis(),
    val grades: Map<String, GradeDoc> = emptyMap()
)

object FirestoreSemesterRepository {
    private val db = FirebaseFirestore.getInstance()

    private fun semestersRef(deviceUid: String, profileId: String) =
        db.collection("devices").document(deviceUid)
            .collection("profiles").document(profileId)
            .collection("semesters")

    suspend fun getSemesters(deviceUid: String, profileId: String): List<SemesterDoc> {
        val snapshot = semestersRef(deviceUid, profileId)
            .orderBy("semesterNumber")
            .get().await()
        return snapshot.documents.map { doc ->
            val data = doc.data ?: return@map null
            docToSemester(doc.id, data)
        }.filterNotNull()
    }

    suspend fun getSemester(deviceUid: String, profileId: String, semesterNumber: Int): SemesterDoc? {
        val doc = semestersRef(deviceUid, profileId)
            .document(semesterNumber.toString())
            .get().await()
        val data = doc.data ?: return null
        return docToSemester(doc.id, data)
    }

    suspend fun saveSemester(deviceUid: String, profileId: String, semester: SemesterDoc) {
        semestersRef(deviceUid, profileId)
            .document(semester.semesterNumber.toString())
            .set(semesterToMap(semester))
            .await()
    }

    suspend fun updateGradeField(
        deviceUid: String, profileId: String,
        semesterNumber: Int, courseCode: String,
        gradeDoc: GradeDoc
    ) {
        semestersRef(deviceUid, profileId).document(semesterNumber.toString())
            .set(mapOf(
                "grades.$courseCode" to mapOf(
                    "courseCode" to gradeDoc.courseCode,
                    "courseName" to gradeDoc.courseName,
                    "credits" to gradeDoc.credits,
                    "grade" to gradeDoc.grade
                )
            ), SetOptions.merge()).await()
    }

    suspend fun updateSemesterSummary(
        deviceUid: String, profileId: String,
        semesterNumber: Int, sgpa: Double,
        totalCredits: Int, totalGradedCredits: Int
    ) {
        semestersRef(deviceUid, profileId).document(semesterNumber.toString())
            .set(mapOf(
                "sgpa" to sgpa,
                "totalCredits" to totalCredits,
                "totalGradedCredits" to totalGradedCredits,
                "updatedAt" to System.currentTimeMillis()
            ), SetOptions.merge()).await()
    }

    suspend fun deleteSemester(deviceUid: String, profileId: String, semesterNumber: Int) {
        semestersRef(deviceUid, profileId)
            .document(semesterNumber.toString())
            .delete().await()
    }

    suspend fun deleteAllSemesters(deviceUid: String, profileId: String) {
        val snapshot = semestersRef(deviceUid, profileId).get().await()
        for (doc in snapshot.documents) {
            doc.reference.delete().await()
        }
    }

    internal fun docToSemester(id: String, data: Map<String, Any>): SemesterDoc {
        val gradesRaw = data["grades"] as? Map<String, Any> ?: emptyMap()
        val grades = gradesRaw.mapValues { (_, value) ->
            val g = value as? Map<String, Any> ?: emptyMap()
            GradeDoc(
                courseCode = g["courseCode"] as? String ?: "",
                courseName = g["courseName"] as? String ?: "",
                credits = (g["credits"] as? Long)?.toInt() ?: 0,
                grade = g["grade"] as? String ?: ""
            )
        }
        return SemesterDoc(
            semesterNumber = (data["semesterNumber"] as? Long)?.toInt() ?: 0,
            sgpa = data["sgpa"] as? Double ?: 0.0,
            totalCredits = (data["totalCredits"] as? Long)?.toInt() ?: 0,
            totalGradedCredits = (data["totalGradedCredits"] as? Long)?.toInt() ?: 0,
            updatedAt = data["updatedAt"] as? Long ?: System.currentTimeMillis(),
            grades = grades
        )
    }

    private fun semesterToMap(semester: SemesterDoc): Map<String, Any?> {
        val gradesMap = semester.grades.mapValues { (_, g) ->
            mapOf(
                "courseCode" to g.courseCode,
                "courseName" to g.courseName,
                "credits" to g.credits,
                "grade" to g.grade
            )
        }
        return mapOf(
            "semesterNumber" to semester.semesterNumber,
            "sgpa" to semester.sgpa,
            "totalCredits" to semester.totalCredits,
            "totalGradedCredits" to semester.totalGradedCredits,
            "updatedAt" to semester.updatedAt,
            "grades" to gradesMap
        )
    }
}
