package com.prakash.semora.ui.auth

import android.animation.ObjectAnimator
import android.content.Intent
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.widget.PopupMenu
import android.view.animation.OvershootInterpolator
import android.view.animation.AccelerateDecelerateInterpolator
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.RecyclerView
import com.example.semora.BaseActivity
import com.example.semora.R
import com.example.semora.databinding.ActivityProfilePickerBinding

class ProfilePickerActivity : BaseActivity() {

    private lateinit var binding: ActivityProfilePickerBinding
    private lateinit var viewModel: ProfilePickerViewModel
    private lateinit var adapter: ProfileAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfilePickerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this, ViewModelProvider.AndroidViewModelFactory.getInstance(application))[ProfilePickerViewModel::class.java]

        setupAdapter()
        setupListeners()
        observeState()
        playEntryAnimations()

        viewModel.loadProfiles()
    }

    private fun setupAdapter() {
        adapter = ProfileAdapter(
            onProfileClick = { item ->
                val user = item.profile
                val intent = Intent(this, com.prakash.semora.ui.auth.PinVerificationActivity::class.java).apply {
                    putExtra("profile_id", user.id)
                    putExtra("username", user.username)
                    putExtra("avatar_color", user.avatarColor)
                }
                startActivity(intent)
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
            },
            onCreateProfileClick = {
                startActivity(Intent(this, com.prakash.semora.ui.auth.RegisterActivity::class.java))
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
            },
            onMenuClick = { item, anchor ->
                showProfileMenu(item, anchor)
            }
        )

        val layoutManager = GridLayoutManager(this, 2)
        binding.rvProfiles.layoutManager = layoutManager
        binding.rvProfiles.adapter = adapter

        val swipeHandler = object : ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.LEFT or ItemTouchHelper.RIGHT) {
            override fun onMove(recyclerView: RecyclerView, viewHolder: RecyclerView.ViewHolder, target: RecyclerView.ViewHolder): Boolean = false
            override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
                val pos = viewHolder.adapterPosition
                if (pos == RecyclerView.NO_POSITION) return
                val item = adapter.currentList.getOrNull(pos) as? ProfilePickerItem ?: return
                confirmDelete(item)
                adapter.notifyItemChanged(pos)
            }
        }
        ItemTouchHelper(swipeHandler).attachToRecyclerView(binding.rvProfiles)
    }

    private fun setupListeners() {
        binding.btnCreateFirst.setOnClickListener {
            startActivity(Intent(this, com.prakash.semora.ui.auth.RegisterActivity::class.java))
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }
        binding.btnCreateNewFab.setOnClickListener {
            startActivity(Intent(this, com.prakash.semora.ui.auth.RegisterActivity::class.java))
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }
    }

    private fun observeState() {
        viewModel.state.observe(this) { state ->
            if (state.isLoading) return@observe
            if (state.isEmpty) {
                showEmptyState()
            } else {
                showProfiles(state.profiles)
            }
        }
    }

    private fun showEmptyState() {
        binding.emptyState.visibility = View.VISIBLE
        binding.profileSection.visibility = View.GONE
        binding.btnCreateNewFab.visibility = View.GONE
        binding.emptyState.post { animateEmptyState() }
    }

    private fun showProfiles(profiles: List<ProfilePickerItem>) {
        binding.emptyState.visibility = View.GONE
        binding.profileSection.visibility = View.VISIBLE
        binding.btnCreateNewFab.visibility = View.VISIBLE

        val items = mutableListOf<Any>()
        items.addAll(profiles)
        items.add("create")
        adapter.submitList(items)
        binding.rvProfiles.animate().alpha(1f).setDuration(400).start()
    }

    private fun playEntryAnimations() {
        val views = listOf(binding.ivLogoContainer, binding.tvTitle, binding.tvTagline, binding.tvSubtitle)
        views.forEachIndexed { i, v ->
            v.alpha = 0f
            v.translationY = 30f
            v.postDelayed({
                v.animate().alpha(1f).translationY(0f).setDuration(500)
                    .setInterpolator(OvershootInterpolator(0.8f)).start()
            }, (i * 120).toLong())
        }
    }

    private fun animateEmptyState() {
        binding.cardEmpty.apply { alpha = 0f; translationY = 40f }
        binding.cardEmpty.animate().alpha(1f).translationY(0f).setDuration(500)
            .setStartDelay(400).setInterpolator(AccelerateDecelerateInterpolator()).start()

        binding.featureGrid.apply { alpha = 0f; translationY = 40f }
        binding.featureGrid.animate().alpha(1f).translationY(0f).setDuration(500)
            .setStartDelay(600).setInterpolator(AccelerateDecelerateInterpolator()).start()

        binding.tvFooter.apply { alpha = 0f }
        binding.tvFooter.animate().alpha(1f).setDuration(400).setStartDelay(800).start()

        // Floating illustration
        val floatAnim = ObjectAnimator.ofFloat(binding.ivEmptyIllustration, View.TRANSLATION_Y, 0f, -8f)
        floatAnim.duration = 2500
        floatAnim.repeatMode = ObjectAnimator.REVERSE
        floatAnim.repeatCount = ObjectAnimator.INFINITE
        floatAnim.startDelay = 1000
        floatAnim.start()

        // Button press scale effect
        binding.btnCreateFirst.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    binding.btnCreateFirst.animate().scaleX(0.97f).scaleY(0.97f).setDuration(100).start()
                    false
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    binding.btnCreateFirst.animate().scaleX(1f).scaleY(1f).setDuration(100).start()
                    false
                }
                else -> false
            }
        }
    }

    private fun showProfileMenu(item: ProfilePickerItem, anchor: View) {
        val popup = PopupMenu(this, anchor)
        popup.menu.add(0, 1, 0, getString(R.string.pp_menu_edit))
        popup.menu.add(0, 2, 0, getString(R.string.pp_menu_delete))
        popup.menu.add(0, 3, 0, getString(R.string.pp_menu_switch))
        popup.setOnMenuItemClickListener { menuItem ->
            when (menuItem.itemId) {
                1 -> {
                    startActivity(Intent(this, com.prakash.semora.ui.profile.EditProfileActivity::class.java).apply {
                        putExtra("profile_id", item.profile.id)
                    })
                    true
                }
                2 -> { confirmDelete(item); true }
                3 -> {
                    startActivity(Intent(this, com.prakash.semora.ui.auth.PinVerificationActivity::class.java).apply {
                        putExtra("profile_id", item.profile.id)
                        putExtra("username", item.profile.username)
                        putExtra("avatar_color", item.profile.avatarColor)
                    })
                    overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
                    true
                }
                else -> false
            }
        }
        popup.show()
    }

    private fun confirmDelete(item: ProfilePickerItem) {
        AlertDialog.Builder(this)
            .setTitle(R.string.pp_delete_title)
            .setMessage(R.string.pp_delete_message)
            .setPositiveButton(R.string.pp_delete_confirm) { _, _ -> viewModel.deleteProfile(item.profile) }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }
}
