package com.prakash.semora.ui.auth

import android.animation.ObjectAnimator
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.animation.OvershootInterpolator
import com.example.semora.BaseActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.GridLayoutManager
import com.example.semora.databinding.ActivityProfilePickerBinding
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreProfileRepository
import kotlinx.coroutines.launch

class ProfilePickerActivity : BaseActivity() {

    private lateinit var binding: ActivityProfilePickerBinding
    private lateinit var adapter: ProfileAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfilePickerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupAdapter()
        setupListeners()
        loadProfiles()
        playEntryAnimation()
    }

    private fun setupAdapter() {
        adapter = ProfileAdapter(
            onProfileClick = { profile ->
                val intent = Intent(this, PinVerificationActivity::class.java)
                intent.putExtra("profile_id", profile.id)
                intent.putExtra("username", profile.username)
                intent.putExtra("avatar_color", profile.avatarColor)
                startActivity(intent)
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
            },
            onCreateProfileClick = {
                val intent = Intent(this, RegisterActivity::class.java)
                startActivity(intent)
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
            }
        )

        val spanCount = 2
        binding.rvProfiles.layoutManager = GridLayoutManager(this, spanCount)
        binding.rvProfiles.adapter = adapter
    }

    private fun setupListeners() {
        binding.btnEmptyCreate.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }
    }

    private fun loadProfiles() {
        lifecycleScope.launch {
            try {
                val deviceUid = FirestoreAuthRepository.getUid()
                if (deviceUid == null) return@launch
                val profiles = FirestoreProfileRepository.getProfiles(deviceUid)
                if (profiles.isEmpty()) {
                    showEmptyState()
                } else {
                    showProfiles(profiles)
                }
            } catch (e: Exception) {
                showEmptyState()
            }
        }
    }

    private fun showEmptyState() {
        binding.rvProfiles.visibility = View.GONE
        binding.emptyState.visibility = View.VISIBLE
        binding.emptyState.alpha = 0f
        binding.emptyState.animate().alpha(1f).setDuration(400).start()
    }

    private fun showProfiles(profiles: List<com.prakash.semora.data.remote.ProfileDoc>) {
        binding.emptyState.visibility = View.GONE
        binding.rvProfiles.visibility = View.VISIBLE

        val items = mutableListOf<Any>()
        items.addAll(profiles)
        items.add("create")
        adapter.submitList(items)

        binding.rvProfiles.post {
            binding.rvProfiles.animate().alpha(1f).setDuration(400).start()
        }
    }

    private fun playEntryAnimation() {
        val views = listOf(binding.ivLogo, binding.tvTitle, binding.tvSubtitle)
        views.forEachIndexed { i, view ->
            view.alpha = 0f
            view.postDelayed({
                val fade = ObjectAnimator.ofFloat(view, View.ALPHA, 0f, 1f)
                fade.duration = 500
                fade.interpolator = OvershootInterpolator(0.8f)
                fade.start()
            }, (i * 150).toLong())
        }
    }
}