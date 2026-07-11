package com.prakash.semora.data.remote

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.tasks.await

object FirestoreAuthRepository {
    private val auth = FirebaseAuth.getInstance()

    suspend fun ensureSignedIn(): String? {
        auth.currentUser?.let { return it.uid }
        return auth.signInAnonymously().await().user?.uid
    }

    fun getUid(): String? = auth.currentUser?.uid

    fun isSignedIn(): Boolean = auth.currentUser != null

    fun getUser(): FirebaseUser? = auth.currentUser
}
