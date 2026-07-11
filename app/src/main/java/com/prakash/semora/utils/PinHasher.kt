package com.prakash.semora.utils

import java.security.MessageDigest
import java.security.SecureRandom
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

object PinHasher {
    private const val LEGACY_SALT = "SemoraPINv1"
    private const val PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA256"
    private const val ITERATIONS = 10_000
    private const val KEY_LENGTH = 256
    private const val SALT_BYTES = 16

    fun hash(pin: String, salt: String): String {
        val spec = PBEKeySpec(pin.toCharArray(), salt.toByteArray(), ITERATIONS, KEY_LENGTH)
        val factory = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM)
        val hashBytes = factory.generateSecret(spec).encoded
        return hashBytes.joinToString("") { "%02x".format(it) }
    }

    fun verify(pin: String, storedHash: String, salt: String, pinVersion: Int): Boolean {
        return if (pinVersion == 0) {
            hashLegacy(pin) == storedHash
        } else {
            hash(pin, salt) == storedHash
        }
    }

    fun generateSalt(): String {
        val bytes = ByteArray(SALT_BYTES)
        SecureRandom().nextBytes(bytes)
        return bytes.joinToString("") { "%02x".format(it) }
    }

    @Deprecated("Only used by legacy MIGRATION_6_7")
    fun hashLegacy(pin: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val bytes = digest.digest((pin + LEGACY_SALT).toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
}
