package com.prakash.semora.ui.home

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View
import androidx.core.content.ContextCompat
import com.example.semora.R
import kotlin.math.min

/**
 * Simple circular progress indicator that shows a gradient stroke
 * and draws the current CGPA (or percentage) in the centre.
 */
class CustomProgressRing @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyle: Int = 0
) : View(context, attrs, defStyle) {

    init {
        // Ensure we have a decent size if not set via layout
        // No-op; size determined by layout params.
    }

    private val backgroundPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 8f
        val baseColor = ContextCompat.getColor(context, R.color.md3_on_background)
        color = Color.argb(30, Color.red(baseColor), Color.green(baseColor), Color.blue(baseColor))
    }

    private val progressPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 8f
        isAntiAlias = true
        shader = SweepGradient(
            0f, 0f,
            intArrayOf(
                ContextCompat.getColor(context, R.color.md3_primary),
                ContextCompat.getColor(context, R.color.md3_tertiary)
            ),
            null as FloatArray?
        )
    }

    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        textAlign = Paint.Align.CENTER
        textSize = 24f
        color = ContextCompat.getColor(context, R.color.md3_on_background)
        typeface = Typeface.DEFAULT_BOLD
    }

    private var progress: Float = 0f   // 0‑10 (CGPA)
    private val rectF = RectF()

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        val size = min(w, h).toFloat()
        val offset = strokeWidth / 2
        rectF.set(offset, offset, size - offset, size - offset)
    }

    override fun onDraw(canvas: Canvas) {
        // move origin to centre
        val centerX = width / 2f
        val centerY = height / 2f
        canvas.translate(centerX, centerY)

        // background circle
        canvas.drawOval(rectF, backgroundPaint)

        // progress arc (sweepAngle = progress/10 * 360)
        val sweep = progress * 36f   // 10 -> 360°
        canvas.drawArc(rectF, -90f, sweep, false, progressPaint)

        // centre text (show CGPA with 2 decimals)
        val text = String.format("%.2f", progress)
        val textHeight = textPaint.descent() - textPaint.ascent()
        canvas.drawText(text, 0f, textHeight / 2, textPaint)
    }

    fun setProgress(cgpa: Float) {
        progress = if (cgpa < 0f) 0f else if (cgpa > 10f) 10f else cgpa
        invalidate()
    }

    // Helper to get strokeWidth (same as paints)
    private val strokeWidth: Float
        get() = 8f
}