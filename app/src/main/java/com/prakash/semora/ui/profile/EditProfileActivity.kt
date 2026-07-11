package com.prakash.semora.ui.profile

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import androidx.activity.OnBackPressedCallback
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import androidx.lifecycle.ViewModelProvider
import com.example.semora.BaseActivity
import com.example.semora.databinding.ActivityEditProfileBinding
import com.google.android.material.snackbar.Snackbar
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreProfileRepository
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class EditProfileActivity : BaseActivity() {

    private lateinit var binding: ActivityEditProfileBinding
    private lateinit var viewModel: EditProfileViewModel
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        viewModel = ViewModelProvider(
            this,
            ViewModelProvider.AndroidViewModelFactory.getInstance(application)
        )[EditProfileViewModel::class.java]

        setupToolbar()
        setupObservers()
        setupTextWatcher()
        setupClickListeners()
        setupBackHandler()
        loadData()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = ""

        binding.toolbar.setNavigationOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }

        binding.toolbar.setOnMenuItemClickListener { item ->
            when (item.itemId) {
                com.example.semora.R.id.action_save -> {
                    triggerSave()
                    true
                }
                else -> false
            }
        }
    }

    private fun setupBackHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (viewModel.hasUnsavedChanges()) {
                    MaterialAlertDialogBuilder(this@EditProfileActivity, com.example.semora.R.style.ThemeOverlay_Semora_Dialog)
                        .setTitle("Discard changes?")
                        .setMessage("You have unsaved changes. Are you sure you want to go back?")
                        .setPositiveButton("Discard") { _, _ ->
                            finish()
                        }
                        .setNegativeButton("Keep editing", null)
                        .show()
                } else {
                    finish()
                }
            }
        })
    }

    private fun loadData() {
        val profileId = intent.getStringExtra("profile_id") ?: sessionManager.getFirebaseProfileId() ?: ""
        val username = intent.getStringExtra("username") ?: sessionManager.getUsername() ?: "User"

        CoroutineScope(Dispatchers.IO).launch {
            val deviceUid = FirestoreAuthRepository.getUid()
            val profile = if (deviceUid != null && profileId.isNotEmpty()) {
                FirestoreProfileRepository.getProfile(deviceUid, profileId)
            } else null
            val createdAt = profile?.createdAt ?: System.currentTimeMillis()
            val branch = profile?.branch ?: "Information Technology"
            runOnUiThread {
                viewModel.loadProfile(profileId, username, branch, createdAt)
            }
        }
    }

    private fun setupObservers() {
        viewModel.state.observe(this) { state ->
            if (binding.etUsername.text?.toString() != state.username) {
                binding.etUsername.setText(state.username)
            }
            binding.tvAvatarInitial.text = state.avatarInitial
            if (binding.etCreatedAt.text?.toString() != state.createdAt) {
                binding.etCreatedAt.setText(state.createdAt)
            }
            if (binding.etBranch.text?.toString() != state.branch) {
                binding.etBranch.setText(state.branch)
            }

            if (state.usernameError != null) {
                binding.tilUsername.error = state.usernameError
            } else {
                binding.tilUsername.error = null
            }

            if (state.isSaving) {
                binding.btnSave.text = ""
                binding.btnSave.isEnabled = false
                binding.btnProgress.visibility = View.VISIBLE
            } else {
                binding.btnSave.text = "Save Changes"
                binding.btnSave.isEnabled = true
                binding.btnProgress.visibility = View.GONE
            }

            if (state.saveSuccess) {
                val message = state.saveMessage ?: "Profile updated successfully."
                Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT).show()
                binding.root.postDelayed({
                    if (!isFinishing) finish()
                }, 600)
                viewModel.clearSaveMessage()
            } else if (state.saveMessage != null) {
                Snackbar.make(binding.root, state.saveMessage!!, Snackbar.LENGTH_SHORT).show()
                viewModel.clearSaveMessage()
            }
        }
    }

    private fun setupTextWatcher() {
        binding.etUsername.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                viewModel.updateUsername(s?.toString() ?: "")
            }
        })
    }

    private fun setupClickListeners() {
        binding.btnSave.setOnClickListener { triggerSave() }
    }

    private fun triggerSave() {
        viewModel.save()
    }
}
