package com.example.semora

import android.content.Intent
import android.graphics.drawable.Animatable
import android.graphics.drawable.Animatable2
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.core.content.ContextCompat
import com.example.semora.databinding.ActivitySplashBinding
import com.prakash.semora.ui.auth.ProfilePickerActivity
import com.prakash.semora.ui.utils.MotionUtils
import com.prakash.semora.utils.SessionManager
class SplashActivity : BaseActivity() {

    private lateinit var binding: ActivitySplashBinding
    private lateinit var sessionManager: SessionManager
    private var hasNavigated = false

    companion object {
        private const val ZOOM_DELAY_MS = 1400L
        private const val ZOOM_OUT_DURATION_MS = 400L
        private const val OVERLAY_FADE_IN_MS = 300L
        private const val OVERLAY_START_DELAY_MS = 100L
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sessionManager = SessionManager(this)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val drawable = ContextCompat.getDrawable(this, R.drawable.avd_splash_logo)

        binding.ivSplashLogo.setImageDrawable(drawable)

        if (drawable is Animatable2) {
            drawable.registerAnimationCallback(object : Animatable2.AnimationCallback() {
                override fun onAnimationEnd(drawable: Drawable?) {
                    playZoomOut()
                }
            })
        }

        if (drawable is Animatable) {
            drawable.start()
        }

        Handler(Looper.getMainLooper()).postDelayed({
            if (isFinishing) return@postDelayed
            playZoomOut()
        }, ZOOM_DELAY_MS)
    }

    private fun playZoomOut() {
        if (hasNavigated) return
        hasNavigated = true

        if (!MotionUtils.areAnimationsEnabled(this)) {
            navigateToProfilePicker()
            return
        }

        binding.ivSplashLogo.animate()
            .scaleX(1.35f)
            .scaleY(1.35f)
            .alpha(0f)
            .setDuration(ZOOM_OUT_DURATION_MS)
            .setInterpolator(MotionUtils.emphasizedDecelerate())
            .start()

        binding.vWhiteOverlay.animate()
            .alpha(1f)
            .setDuration(OVERLAY_FADE_IN_MS)
            .setStartDelay(OVERLAY_START_DELAY_MS)
            .withEndAction {
                navigateToProfilePicker()
            }
            .start()
    }

    private fun navigateToProfilePicker() {
        val isLoggedIn = sessionManager.isLoggedIn()
        val hasProfile = sessionManager.getUserId() != -1
        val intent = if (isLoggedIn && hasProfile) {
            Intent(this, MainActivity::class.java)
        } else {
            if (isLoggedIn) sessionManager.logout()
            Intent(this, ProfilePickerActivity::class.java)
        }
        startActivity(intent)
        @Suppress("DEPRECATION")
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        finish()
    }
}
