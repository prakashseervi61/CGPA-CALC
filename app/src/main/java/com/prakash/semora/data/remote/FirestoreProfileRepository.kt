package com.prakash.semora.data.remote

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import kotlinx.coroutines.tasks.await

data class ProfileDoc(
    val id: String = "",
    val username: String = "",
    val pinHash: String = "",
    val pinSalt: String = "",
    val pinVersion: Int = 1,
    val avatarColor: Int = 0xFF1A73E8.toInt(),
    val branch: String = "Information Technology",
    val createdAt: Long = System.currentTimeMillis(),
    val lastOpened: Long? = null
) {
    val initial: Char
        get() = username.firstOrNull()?.uppercaseChar() ?: '?'
}

object FirestoreProfileRepository {
    private val db = FirebaseFirestore.getInstance()

    private fun profilesRef(deviceUid: String) =
        db.collection("devices").document(deviceUid).collection("profiles")

    suspend fun getProfiles(deviceUid: String): List<ProfileDoc> {
        val snapshot = profilesRef(deviceUid).orderBy("createdAt").get().await()
        return snapshot.documents.map { doc ->
            val data = doc.data ?: return@map null
            docToProfile(doc.id, data)
        }.filterNotNull()
    }

    suspend fun getProfile(deviceUid: String, profileId: String): ProfileDoc? {
        val doc = profilesRef(deviceUid).document(profileId).get().await()
        val data = doc.data ?: return null
        return docToProfile(doc.id, data)
    }

    suspend fun createProfile(deviceUid: String, profile: ProfileDoc): String {
        val docRef = profilesRef(deviceUid).document()
        val data = profileToMap(profile.copy(id = docRef.id))
        docRef.set(data).await()
        return docRef.id
    }

    suspend fun updateUsername(deviceUid: String, profileId: String, username: String) {
        profilesRef(deviceUid).document(profileId)
            .set(mapOf("username" to username), SetOptions.merge()).await()
    }

    suspend fun updatePin(deviceUid: String, profileId: String, pinHash: String, pinSalt: String, pinVersion: Int) {
        profilesRef(deviceUid).document(profileId)
            .set(mapOf(
                "pinHash" to pinHash,
                "pinSalt" to pinSalt,
                "pinVersion" to pinVersion
            ), SetOptions.merge()).await()
    }

    suspend fun updateLastOpened(deviceUid: String, profileId: String, timestamp: Long) {
        profilesRef(deviceUid).document(profileId)
            .update("lastOpened", timestamp).await()
    }

    suspend fun deleteProfile(deviceUid: String, profileId: String) {
        profilesRef(deviceUid).document(profileId).delete().await()
    }

    internal fun docToProfile(id: String, data: Map<String, Any>): ProfileDoc {
        return ProfileDoc(
            id = id,
            username = data["username"] as? String ?: "",
            pinHash = data["pinHash"] as? String ?: "",
            pinSalt = data["pinSalt"] as? String ?: "",
            pinVersion = (data["pinVersion"] as? Long)?.toInt() ?: 1,
            avatarColor = (data["avatarColor"] as? Long)?.toInt() ?: 0xFF1A73E8.toInt(),
            branch = data["branch"] as? String ?: "Information Technology",
            createdAt = data["createdAt"] as? Long ?: System.currentTimeMillis(),
            lastOpened = data["lastOpened"] as? Long
        )
    }

    private fun profileToMap(profile: ProfileDoc): Map<String, Any?> {
        return mutableMapOf<String, Any?>(
            "username" to profile.username,
            "pinHash" to profile.pinHash,
            "pinSalt" to profile.pinSalt,
            "pinVersion" to profile.pinVersion,
            "avatarColor" to profile.avatarColor.toLong(),
            "branch" to profile.branch,
            "createdAt" to profile.createdAt,
            "lastOpened" to profile.lastOpened
        )
    }
}
