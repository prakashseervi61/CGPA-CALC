package com.prakash.semora.ui.auth

import android.graphics.drawable.GradientDrawable
import android.text.format.DateUtils
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.semora.databinding.ItemCreateProfileBinding
import com.example.semora.databinding.ItemProfileBinding
import com.prakash.semora.data.remote.ProfileDoc

class ProfileAdapter(
    private val onProfileClick: (ProfileDoc) -> Unit,
    private val onCreateProfileClick: () -> Unit
) : ListAdapter<Any, RecyclerView.ViewHolder>(DiffCallback()) {

    companion object {
        private const val TYPE_PROFILE = 0
        private const val TYPE_CREATE = 1
    }

    override fun getItemViewType(position: Int): Int {
        return if (getItem(position) is ProfileDoc) TYPE_PROFILE else TYPE_CREATE
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return if (viewType == TYPE_PROFILE) {
            val binding = ItemProfileBinding.inflate(
                LayoutInflater.from(parent.context), parent, false
            )
            ProfileViewHolder(binding)
        } else {
            val binding = ItemCreateProfileBinding.inflate(
                LayoutInflater.from(parent.context), parent, false
            )
            CreateProfileViewHolder(binding)
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is ProfileViewHolder -> {
                val profile = getItem(position) as ProfileDoc
                holder.bind(profile)
                holder.itemView.setOnClickListener { onProfileClick(profile) }
            }
            is CreateProfileViewHolder -> {
                holder.itemView.setOnClickListener { onCreateProfileClick() }
            }
        }
    }

    class ProfileViewHolder(private val binding: ItemProfileBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(profile: ProfileDoc) {
            binding.tvUsername.text = profile.username

            val bg = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(profile.avatarColor)
            }
            binding.tvAvatar.background = bg
            binding.tvAvatar.text = profile.initial.toString()

            if (profile.lastOpened != null) {
                binding.tvLastOpened.text = getRelativeTime(profile.lastOpened)
                binding.tvLastOpened.visibility = android.view.View.VISIBLE
            } else {
                binding.tvLastOpened.visibility = android.view.View.GONE
            }
        }

        private fun getRelativeTime(timestamp: Long): String {
            return DateUtils.getRelativeTimeSpanString(
                timestamp, System.currentTimeMillis(), DateUtils.MINUTE_IN_MILLIS
            ).toString()
        }
    }

    class CreateProfileViewHolder(binding: ItemCreateProfileBinding) :
        RecyclerView.ViewHolder(binding.root)

    class DiffCallback : DiffUtil.ItemCallback<Any>() {
        override fun areItemsTheSame(oldItem: Any, newItem: Any): Boolean {
            if (oldItem is ProfileDoc && newItem is ProfileDoc) return oldItem.id == newItem.id
            return oldItem is String && newItem is String
        }

        override fun areContentsTheSame(oldItem: Any, newItem: Any): Boolean {
            return oldItem == newItem
        }
    }
}
