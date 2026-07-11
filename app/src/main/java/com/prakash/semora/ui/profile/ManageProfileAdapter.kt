package com.prakash.semora.ui.profile

import android.graphics.drawable.GradientDrawable
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.semora.R
import com.example.semora.databinding.ItemManageProfileBinding

class ManageProfileAdapter(
    private val onSwitchClick: (ProfileItem) -> Unit,
    private val onEditClick: (ProfileItem) -> Unit,
    private val onDeleteClick: (ProfileItem) -> Unit
) : ListAdapter<ProfileItem, ManageProfileAdapter.ViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemManageProfileBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(private val binding: ItemManageProfileBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: ProfileItem) {
            val profile = item.profile

            binding.tvAvatar.text = profile.initial.toString()
            binding.tvUsername.text = profile.username
            binding.tvBranch.text = profile.branch
            binding.tvCgpa.text = "CGPA: ${item.cgpa}"
            binding.tvSemester.text = item.currentSemester

            val bg = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(profile.avatarColor)
            }
            binding.tvAvatar.background = bg

            if (item.isActive) {
                binding.btnSwitch.visibility = android.view.View.GONE
                binding.chipActive.visibility = android.view.View.VISIBLE
                binding.chipActive.text = "Currently Using"
            } else {
                binding.btnSwitch.visibility = android.view.View.VISIBLE
                binding.chipActive.visibility = android.view.View.GONE
                binding.btnSwitch.setOnClickListener { onSwitchClick(item) }
            }

            binding.rowEdit.setOnClickListener { onEditClick(item) }
            binding.rowDelete.setOnClickListener { onDeleteClick(item) }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<ProfileItem>() {
        override fun areItemsTheSame(oldItem: ProfileItem, newItem: ProfileItem): Boolean {
            return oldItem.profile.id == newItem.profile.id
        }

        override fun areContentsTheSame(oldItem: ProfileItem, newItem: ProfileItem): Boolean {
            return oldItem == newItem
        }
    }
}
