package com.prakash.semora.ui.profile

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.semora.BaseActivity
import com.example.semora.MainActivity
import com.example.semora.databinding.ActivityManageProfilesBinding
import com.example.semora.R
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.prakash.semora.ui.auth.RegisterActivity
import com.prakash.semora.utils.PinHasher
import com.prakash.semora.utils.PinInputHelper
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.launch

class ManageProfilesActivity : BaseActivity() {

    private lateinit var binding: ActivityManageProfilesBinding
    private lateinit var viewModel: ManageProfilesViewModel
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: ManageProfileAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityManageProfilesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        viewModel = ViewModelProvider(
            this,
            ViewModelProvider.AndroidViewModelFactory.getInstance(application)
        )[ManageProfilesViewModel::class.java]

        setupToolbar()
        setupRecyclerView()
        setupFab()
        setupObservers()
    }

    override fun onResume() {
        super.onResume()
        viewModel.loadProfiles(sessionManager.getUserId())
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = ""
        binding.toolbar.setNavigationOnClickListener { finish() }
    }

    private fun setupRecyclerView() {
        adapter = ManageProfileAdapter(
            onSwitchClick = { showPinDialog(it) },
            onEditClick = { openEditProfile(it) },
            onDeleteClick = { showDeleteConfirmDialog(it) }
        )
        binding.rvProfiles.layoutManager = LinearLayoutManager(this)
        binding.rvProfiles.adapter = adapter
    }

    private fun setupFab() {
        binding.fabCreateProfile.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
    }

    private fun setupObservers() {
        viewModel.state.observe(this) { state ->
            adapter.submitList(state.profiles)
            state.message?.let {
                Snackbar.make(binding.root, it, Snackbar.LENGTH_SHORT).show()
                viewModel.clearMessage()
            }
        }
    }

    private fun openEditProfile(item: ProfileItem) {
        val intent = Intent(this, EditProfileActivity::class.java)
        intent.putExtra("profile_id", item.profile.id)
        intent.putExtra("username", item.profile.username)
        startActivity(intent)
    }

    private fun showDeleteConfirmDialog(item: ProfileItem) {
        val profileCount = viewModel.state.value?.profiles?.size ?: 0
        if (profileCount <= 1) {
            Snackbar.make(binding.root, "Cannot delete the last profile.", Snackbar.LENGTH_SHORT).show()
            return
        }

        MaterialAlertDialogBuilder(this, R.style.ThemeOverlay_Semora_Dialog_Destructive)
            .setTitle("Delete Profile")
            .setMessage("Are you sure you want to delete \"${item.profile.username}\"? This will permanently remove all grades and semester data for this profile.")
            .setPositiveButton("Delete") { _, _ ->
                viewModel.deleteProfile(item.profile) {
                    if (item.isActive) {
                        sessionManager.logout()
                        val intent = Intent(this, RegisterActivity::class.java)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        startActivity(intent)
                        finish()
                    }
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun showPinDialog(item: ProfileItem) {
        val dialog = android.app.Dialog(this)
        dialog.setContentView(R.layout.dialog_pin_verify)
        dialog.window?.setLayout(
            android.view.ViewGroup.LayoutParams.MATCH_PARENT,
            android.view.ViewGroup.LayoutParams.WRAP_CONTENT
        )
        dialog.setCancelable(false)
        dialog.window?.setWindowAnimations(0)

        val pinBoxes = listOf(
            dialog.findViewById<EditText>(R.id.etPin1),
            dialog.findViewById<EditText>(R.id.etPin2),
            dialog.findViewById<EditText>(R.id.etPin3),
            dialog.findViewById<EditText>(R.id.etPin4)
        )
        val tvError = dialog.findViewById<android.widget.TextView>(R.id.tvPinError)
        val btnCancel = dialog.findViewById<com.google.android.material.button.MaterialButton>(R.id.btnDialogCancel)
        val btnVerify = dialog.findViewById<com.google.android.material.button.MaterialButton>(R.id.btnDialogVerify)

        val pinInput = PinInputHelper(pinBoxes).also { it.setup() }

        btnCancel.setOnClickListener { dialog.dismiss() }

        btnVerify.setOnClickListener {
            val enteredPin = pinInput.pin
            if (enteredPin.length != 4 || enteredPin.any { !it.isDigit() }) {
                tvError.text = "Enter all 4 digits"
                tvError.visibility = View.VISIBLE
                return@setOnClickListener
            }
            val profile = item.profile
            if (!PinHasher.verify(enteredPin, profile.pin, profile.salt)) {
                tvError.text = "Incorrect PIN. Try again."
                tvError.visibility = View.VISIBLE
                pinInput.clear()
                return@setOnClickListener
            }
            sessionManager.saveUserSession(profile.id, profile.username)
            lifecycleScope.launch {
                com.prakash.semora.data.local.AppDatabase.getDatabase(this@ManageProfilesActivity)
                    .userDao().updateLastOpened(profile.id, System.currentTimeMillis())
            }
            dialog.dismiss()
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }

        dialog.show()
    }
}
