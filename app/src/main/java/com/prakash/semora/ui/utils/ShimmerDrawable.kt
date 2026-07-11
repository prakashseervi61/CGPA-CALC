package com.prakash.semora.ui.utils

import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.Shader
import android.graphics.drawable.Drawable
import android.animation.ValueAnimator
import android.view.animation.AccelerateDecelerateInterpolator

class ShimmerDrawable : Drawable() {

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var shimmerFraction = 0f

    private val animator = ValueAnimator.ofFloat(0f, 1f).apply {
        duration = 1200L
        repeatCount = ValueAnimator.INFINITE
        repeatMode = ValueAnimator.RESTART
        interpolator = AccelerateDecelerateInterpolator()
        addUpdateListener { invalidateSelf() }
    }

    override fun draw(canvas: Canvas) {
        val width = bounds.width().coerceAtLeast(1)
        val height = bounds.height().coerceAtLeast(1)
        val translateX = -width + (2f * width * shimmerFraction)

        paint.shader = LinearGradient(
            translateX, 0f, translateX + width, 0f,
            intArrayOf(0x00FFFFFF, 0x33FFFFFF, 0x00FFFFFF),
            floatArrayOf(0f, 0.5f, 1f),
            Shader.TileMode.CLAMP
        )
        canvas.drawRect(bounds, paint)
    }

    override fun setAlpha(alpha: Int) {
        paint.alpha = alpha
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
        paint.colorFilter = colorFilter
    }

    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT

    fun startShimmer() {
        if (!animator.isRunning) animator.start()
    }

    fun stopShimmer() {
        animator.cancel()
    }

    override fun setVisible(visible: Boolean, restart: Boolean): Boolean {
        if (visible) startShimmer() else stopShimmer()
        return super.setVisible(visible, restart)
    }
}
