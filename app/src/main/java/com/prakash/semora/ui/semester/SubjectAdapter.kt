package com.prakash.semora.ui.semester

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.semora.databinding.ItemSubjectBinding
import com.example.semora.R
import com.prakash.semora.model.Course

class SubjectAdapter(
    private val onGradeClick: (Course) -> Unit
) : ListAdapter<Course, SubjectAdapter.ViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemSubjectBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(private val binding: ItemSubjectBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(course: Course) {
            val ctx = binding.root.context

            binding.tvSubjectName.text = course.name
            binding.tvSubjectCode.text = course.code
            binding.tvSubjectCredits.text = "${course.credits} Credits"

            val hasGrade = course.grade.isNotEmpty()
            val isFailed = course.grade == "U"

            if (hasGrade) {
                binding.btnGrade.text = course.grade
                binding.btnGrade.backgroundTintList = ContextCompat.getColorStateList(
                    ctx, gradeBackgrounds[course.grade] ?: R.color.md3_surface_container_high
                )
                binding.btnGrade.setTextColor(ContextCompat.getColor(ctx, android.R.color.white))
            } else {
                binding.btnGrade.text = "-"
                binding.btnGrade.backgroundTintList = ContextCompat.getColorStateList(
                    ctx, R.color.md3_surface_container_high
                )
                binding.btnGrade.setTextColor(
                    ContextCompat.getColor(ctx, R.color.md3_on_surface_variant)
                )
            }

            binding.btnGrade.setOnClickListener {
                tapCard()
                onGradeClick(course)
            }

            binding.root.setOnClickListener {
                tapCard()
                onGradeClick(course)
            }
        }

        private fun tapCard() {
            binding.cardSubject.animate()
                .scaleX(0.96f)
                .scaleY(0.96f)
                .setDuration(100)
                .withEndAction {
                    binding.cardSubject.animate()
                        .scaleX(1f)
                        .scaleY(1f)
                        .setDuration(200)
                        .setInterpolator(OvershootInterpolator(2f))
                        .start()
                }
                .start()
        }
    }

    private class DiffCallback : DiffUtil.ItemCallback<Course>() {
        override fun areItemsTheSame(old: Course, new: Course) = old.code == new.code
        override fun areContentsTheSame(old: Course, new: Course) = old == new
    }

    private val gradeBackgrounds = mapOf(
        "O" to R.color.grade_o_bg,
        "A+" to R.color.grade_a_bg,
        "A" to R.color.grade_a_bg,
        "B+" to R.color.grade_b_bg,
        "B" to R.color.grade_b_bg,
        "C" to R.color.grade_c_bg,
        "U" to R.color.grade_u_bg
    )
}
