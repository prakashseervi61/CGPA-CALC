package com.prakash.semora.ui.utils

import android.content.Context
import android.provider.Settings
import android.view.animation.Interpolator
import android.view.animation.PathInterpolator

/**
 * Motion utilities for consistent, accessibility-aware animations.
 */
object MotionUtils {

    /**
     * Returns true if the user has NOT disabled animations in accessibility settings.
     * Use this to gate all custom animations.
     */
    fun areAnimationsEnabled(context: Context): Boolean {
        val scale = Settings.Global.getFloat(
            context.contentResolver,
            Settings.Global.ANIMATOR_DURATION_SCALE,
            1f
        )
        return scale > 0f
    }

    /**
     * M3 Emphasized Decelerate interpolator — fast start, slow landing.
     * Recommended for entrances and state changes.
     */
    fun emphasizedDecelerate(): Interpolator =
        PathInterpolator(0.05f, 0.7f, 0.1f, 1f)


}
