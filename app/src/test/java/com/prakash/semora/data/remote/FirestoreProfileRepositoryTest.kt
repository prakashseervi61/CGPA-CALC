package com.prakash.semora.data.remote

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

class FirestoreProfileRepositoryTest {

    @Test
    fun `all fields present maps correctly`() {
        val data = mapOf<String, Any>(
            "username" to "testuser",
            "pinHash" to "abc123",
            "pinSalt" to "def456",
            "pinVersion" to 1L,
            "avatarColor" to 0xFF1A73E8.toLong(),
            "branch" to "Information Technology",
            "createdAt" to 1000L,
            "lastOpened" to 2000L,
        )
        val profile = FirestoreProfileRepository.docToProfile("doc1", data)
        assertEquals("doc1", profile.id)
        assertEquals("testuser", profile.username)
        assertEquals("abc123", profile.pinHash)
        assertEquals("def456", profile.pinSalt)
        assertEquals(1, profile.pinVersion)
        assertEquals("Information Technology", profile.branch)
        assertEquals(1000L, profile.createdAt)
        assertEquals(2000L, profile.lastOpened)
    }

    @Test
    fun `missing pinHash defaults to empty string`() {
        val data = mapOf<String, Any>("username" to "testuser")
        val profile = FirestoreProfileRepository.docToProfile("doc1", data)
        assertEquals("", profile.pinHash)
    }

    @Test
    fun `missing pinSalt defaults to empty string`() {
        val data = mapOf<String, Any>("username" to "testuser")
        val profile = FirestoreProfileRepository.docToProfile("doc1", data)
        assertEquals("", profile.pinSalt)
    }

    @Test
    fun `missing pinVersion defaults to 1`() {
        val data = mapOf<String, Any>("username" to "testuser")
        val profile = FirestoreProfileRepository.docToProfile("doc1", data)
        assertEquals(1, profile.pinVersion)
    }

    @Test
    fun `missing branch defaults to Information Technology`() {
        val data = mapOf<String, Any>("username" to "testuser")
        val profile = FirestoreProfileRepository.docToProfile("doc1", data)
        assertEquals("Information Technology", profile.branch)
    }

    @Test
    fun `empty data map uses all defaults`() {
        val profile = FirestoreProfileRepository.docToProfile("doc1", emptyMap())
        assertEquals("doc1", profile.id)
        assertEquals("", profile.username)
        assertEquals("", profile.pinHash)
        assertEquals("", profile.pinSalt)
        assertEquals(1, profile.pinVersion)
        assertEquals("Information Technology", profile.branch)
        assertNotNull(profile.createdAt)
    }

    @Test
    fun `pinVersion coerces from Long to Int`() {
        val data = mapOf<String, Any>("pinVersion" to 2L)
        val profile = FirestoreProfileRepository.docToProfile("doc1", data)
        assertEquals(2, profile.pinVersion)
    }
}
