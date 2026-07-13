package com.prakash.semora.ui.profile

import android.graphics.drawable.GradientDrawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
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
            val user = item.profile
            binding.tvUsername.text = user.username

            val bg = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(user.avatarColor)
            }
            binding.tvAvatar.background = bg
            binding.tvAvatar.text = user.username.firstOrNull()?.uppercaseChar()?.toString() ?: "?"

            if (item.isActive) {
                binding.btnSwitch.visibility = View.GONE
                binding.chipActive.visibility = View.VISIBLE
            } else {
                binding.btnSwitch.visibility = View.VISIBLE
                binding.chipActive.visibility = View.GONE
                binding.btnSwitch.setOnClickListener { onSwitchClick(item) }
            }

            binding.tvCgpa.text = "CGPA: ${item.cgpa}"
            binding.tvSemester.text = item.currentSemester

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
