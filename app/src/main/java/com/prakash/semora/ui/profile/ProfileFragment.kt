package com.prakash.semora.ui.profile

import android.content.Intent
import android.content.res.ColorStateList
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import androidx.appcompat.app.AppCompatDelegate
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.semora.R
import com.example.semora.databinding.FragmentProfileBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.prakash.semora.ui.utils.ShimmerDrawable
import com.prakash.semora.ui.auth.ProfilePickerActivity
import com.prakash.semora.utils.SessionManager

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var viewModel: ProfileViewModel
    private var shimmerDrawable: ShimmerDrawable? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        viewModel = ViewModelProvider(
            this,
            ViewModelProvider.AndroidViewModelFactory.getInstance(requireActivity().application)
        )[ProfileViewModel::class.java]

        observeData()
        observeLoading()
        setupClickListeners()
        updateThemeLabel()

        shimmerDrawable = ShimmerDrawable().apply {
            binding.loadingShimmer.background = this
        }

        viewModel.loadProfile()
    }

    private fun observeLoading() {
        viewModel.isLoading.observe(viewLifecycleOwner) { loading ->
            if (_binding == null) return@observe
            binding.loadingShimmer.visibility = if (loading) View.VISIBLE else View.GONE
            binding.scrollContent.visibility = if (loading) View.GONE else View.VISIBLE
            if (loading) shimmerDrawable?.startShimmer() else shimmerDrawable?.stopShimmer()
        }
    }

    private fun observeData() {
        viewModel.username.observe(viewLifecycleOwner) { name ->
            if (_binding == null) return@observe
            binding.tvUsername.text = name
        }

        viewModel.avatarInitial.observe(viewLifecycleOwner) { initial ->
            if (_binding == null) return@observe
            binding.tvAvatarInitial.text = initial
        }

        viewModel.avatarColor.observe(viewLifecycleOwner) { color ->
            if (_binding == null) return@observe
            binding.cvAvatar.backgroundTintList = ColorStateList.valueOf(color)
        }
    }

    private fun setupClickListeners() {
        binding.cvAvatar.setOnClickListener { animateAvatarScale() }
        binding.ivEditAvatar.setOnClickListener { animateAvatarScale() }

        binding.rowManageProfiles.setOnClickListener {
            startActivity(Intent(requireContext(), ManageProfilesActivity::class.java))
        }

        binding.rowEditProfile.setOnClickListener {
            startActivity(Intent(requireContext(), EditProfileActivity::class.java))
        }

        binding.rowChangePin.setOnClickListener {
            startActivity(Intent(requireContext(), ChangePinActivity::class.java))
        }

        binding.rowTheme.setOnClickListener { showThemePicker() }
        binding.rowLogout.setOnClickListener { showLogoutConfirm() }
    }

    private fun showThemePicker() {
        val modes = arrayOf("System default", "Light", "Dark")
        val current = sessionManager.getThemeMode()
        val checkedItem = when (current) {
            1 -> 1
            2 -> 2
            else -> 0
        }

        MaterialAlertDialogBuilder(requireContext(), R.style.ThemeOverlay_Semora_Dialog)
            .setTitle("App theme")
            .setSingleChoiceItems(modes, checkedItem) { dialog, which ->
                val mode = when (which) {
                    1 -> AppCompatDelegate.MODE_NIGHT_NO
                    2 -> AppCompatDelegate.MODE_NIGHT_YES
                    else -> AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
                }
                sessionManager.setThemeMode(mode)
                AppCompatDelegate.setDefaultNightMode(mode)
                updateThemeLabel()
                dialog.dismiss()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun updateThemeLabel() {
        val mode = sessionManager.getThemeMode()
        binding.tvThemeValue.text = when (mode) {
            1 -> "Light"
            2 -> "Dark"
            else -> "System default"
        }
    }

    private fun showLogoutConfirm() {
        if (!isAdded) return
        MaterialAlertDialogBuilder(requireContext(), R.style.ThemeOverlay_Semora_Dialog_Destructive)
            .setTitle("Log out")
            .setMessage("Are you sure you want to log out? All local data will remain saved.")
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Log out") { _, _ ->
                sessionManager.logout()
                val intent = Intent(requireContext(), ProfilePickerActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                requireActivity().finish()
            }
            .show()
    }

    private fun animateAvatarScale() {
        binding.cvAvatar.animate()
            .scaleX(0.88f)
            .scaleY(0.88f)
            .setDuration(120)
            .withEndAction {
                binding.cvAvatar.animate()
                    .scaleX(1f)
                    .scaleY(1f)
                    .setDuration(350)
                    .setInterpolator(OvershootInterpolator(3f))
                    .start()
            }
            .start()
    }

    override fun onDestroyView() {
        shimmerDrawable?.stopShimmer()
        shimmerDrawable = null
        super.onDestroyView()
        _binding = null
    }
}