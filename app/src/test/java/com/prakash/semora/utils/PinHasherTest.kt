package com.prakash.semora.utils

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class PinHasherTest {

    @Test
    fun `hash and verify with valid PIN returns true`() {
        val salt = PinHasher.generateSalt()
        val hash = PinHasher.hash("1234", salt)
        assertTrue(PinHasher.verify("1234", hash, salt, 1))
    }

    @Test
    fun `verify with wrong PIN returns false`() {
        val salt = PinHasher.generateSalt()
        val hash = PinHasher.hash("1234", salt)
        assertFalse(PinHasher.verify("5678", hash, salt, 1))
    }

    @Test
    fun `verify with empty PIN returns false`() {
        val salt = PinHasher.generateSalt()
        val hash = PinHasher.hash("1234", salt)
        assertFalse(PinHasher.verify("", hash, salt, 1))
    }

    @Test
    fun `legacy v1 verify with correct PIN returns true`() {
        val hash = PinHasher.hashLegacy("1234")
        assertTrue(PinHasher.verify("1234", hash, "", 0))
    }

    @Test
    fun `legacy v1 verify with wrong PIN returns false`() {
        val hash = PinHasher.hashLegacy("1234")
        assertFalse(PinHasher.verify("5678", hash, "", 0))
    }

    @Test
    fun `same PIN with different salts produces different hashes`() {
        val salt1 = PinHasher.generateSalt()
        val salt2 = PinHasher.generateSalt()
        val hash1 = PinHasher.hash("1234", salt1)
        val hash2 = PinHasher.hash("1234", salt2)
        assertNotEquals(hash1, hash2)
    }

    @Test
    fun `generateSalt returns 32 character hex string`() {
        val salt = PinHasher.generateSalt()
        assertEquals(32, salt.length)
        assertTrue(salt.matches(Regex("[0-9a-f]+")))
    }
}
