package com.prakash.semora.ui.auth

import android.content.res.ColorStateList
import android.graphics.drawable.GradientDrawable
import android.text.format.DateUtils
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.semora.R
import com.example.semora.databinding.ItemCreateProfileBinding
import com.example.semora.databinding.ItemProfileBinding

class ProfileAdapter(
    private val onProfileClick: (ProfilePickerItem) -> Unit,
    private val onCreateProfileClick: () -> Unit,
    private val onMenuClick: (ProfilePickerItem, View) -> Unit
) : ListAdapter<Any, RecyclerView.ViewHolder>(DiffCallback()) {

    companion object {
        private const val TYPE_PROFILE = 0
        private const val TYPE_CREATE = 1
    }

    override fun getItemViewType(position: Int): Int {
        return if (getItem(position) is ProfilePickerItem) TYPE_PROFILE else TYPE_CREATE
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return if (viewType == TYPE_PROFILE) {
            val binding = ItemProfileBinding.inflate(LayoutInflater.from(parent.context), parent, false)
            ProfileViewHolder(binding)
        } else {
            val binding = ItemCreateProfileBinding.inflate(LayoutInflater.from(parent.context), parent, false)
            CreateProfileViewHolder(binding)
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is ProfileViewHolder -> {
                val item = getItem(position) as ProfilePickerItem
                holder.bind(item)
                holder.itemView.setOnClickListener { onProfileClick(item) }
                holder.binding.btnMenu.setOnClickListener { v -> onMenuClick(item, v) }
            }
            is CreateProfileViewHolder -> {
                holder.itemView.setOnClickListener { onCreateProfileClick() }
            }
        }
    }

    class ProfileViewHolder(val binding: ItemProfileBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: ProfilePickerItem) {
            val user = item.profile
            binding.tvName.text = user.username

            val avatarBg = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(if (user.avatarColor != 0) user.avatarColor else 0xFF2563EB.toInt())
            }
            binding.tvAvatar.background = avatarBg
            binding.tvAvatar.text = user.username.firstOrNull()?.uppercaseChar()?.toString() ?: "?"

            binding.tvSemester.text = item.currentSemester
            binding.tvCgpa.text = item.cgpa

            val cgpaValue = item.cgpa.toDoubleOrNull()
            val cgpaColor = when {
                cgpaValue == null -> 0xFF2563EB.toInt()
                cgpaValue >= 9.0 -> 0xFF10B981.toInt()
                cgpaValue >= 8.0 -> 0xFF2563EB.toInt()
                cgpaValue >= 7.0 -> 0xFFF59E0B.toInt()
                else -> 0xFFEF4444.toInt()
            }
            binding.tvCgpa.backgroundTintList = ColorStateList.valueOf(cgpaColor)

            if (user.lastOpened != null) {
                binding.tvLastOpened.text = DateUtils.getRelativeTimeSpanString(
                    user.lastOpened, System.currentTimeMillis(), DateUtils.MINUTE_IN_MILLIS
                )
                binding.tvLastOpened.visibility = View.VISIBLE
            } else {
                binding.tvLastOpened.visibility = View.GONE
            }
        }
    }

    class CreateProfileViewHolder(binding: ItemCreateProfileBinding) :
        RecyclerView.ViewHolder(binding.root)

    class DiffCallback : DiffUtil.ItemCallback<Any>() {
        override fun areItemsTheSame(oldItem: Any, newItem: Any): Boolean {
            if (oldItem is ProfilePickerItem && newItem is ProfilePickerItem) return oldItem.profile.id == newItem.profile.id
            return oldItem is String && newItem is String
        }

        override fun areContentsTheSame(oldItem: Any, newItem: Any): Boolean {
            return oldItem == newItem
        }
    }
}
