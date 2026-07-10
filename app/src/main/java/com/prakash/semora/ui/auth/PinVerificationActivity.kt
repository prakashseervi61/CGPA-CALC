package com.prakash.semora.ui.auth

import android.animation.ObjectAnimator
import android.content.Intent
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.View
import android.view.animation.AnimationUtils
import android.view.animation.OvershootInterpolator
import com.example.semora.R
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import com.example.semora.BaseActivity
import com.example.semora.MainActivity
import com.example.semora.databinding.ActivityPinVerificationBinding
import com.prakash.semora.data.remote.FirestoreAuthRepository
import com.prakash.semora.data.remote.FirestoreProfileRepository
import com.prakash.semora.utils.PinInputHelper
import com.prakash.semora.utils.SessionManager
import kotlinx.coroutines.launch

class PinVerificationActivity : BaseActivity() {

    private lateinit var binding: ActivityPinVerificationBinding
    private lateinit var viewModel: AuthViewModel
    private lateinit var sessionManager: SessionManager

    private lateinit var pinInput: PinInputHelper

    private var profileId: String = ""
    private var username: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPinVerificationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        profileId = intent.getStringExtra("profile_id") ?: ""
        username = intent.getStringExtra("username") ?: ""
        val avatarColor = intent.getIntExtra("avatar_color", 0xFF1A73E8.toInt())

        sessionManager = SessionManager(this)
        viewModel = ViewModelProvider(
            this,
            ViewModelProvider.AndroidViewModelFactory.getInstance(application)
        )[AuthViewModel::class.java]

        setupUI(avatarColor)
        setupSecurePinInput()
        setupObservers()
        setupListeners()
    }

    override fun onDestroy() {
        pinInput.destroy()
        super.onDestroy()
    }

    private fun setupUI(avatarColor: Int) {
        binding.tvUsername.text = username

        val bg = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(avatarColor)
        }
        binding.tvAvatar.background = bg
        binding.tvAvatar.text = username.firstOrNull()?.uppercaseChar()?.toString() ?: "?"

        binding.tvAvatar.alpha = 0f
        binding.tvUsername.alpha = 0f
        binding.tvTitle.alpha = 0f
        binding.pinContainer.alpha = 0f

        binding.tvAvatar.postDelayed({
            ObjectAnimator.ofFloat(binding.tvAvatar, View.ALPHA, 0f, 1f).apply {
                duration = 400
                interpolator = OvershootInterpolator(0.8f)
                start()
            }
        }, 100)

        binding.tvUsername.postDelayed({
            ObjectAnimator.ofFloat(binding.tvUsername, View.ALPHA, 0f, 1f).apply {
                duration = 400
                interpolator = OvershootInterpolator(0.8f)
                start()
            }
        }, 400)

        binding.tvTitle.postDelayed({
            ObjectAnimator.ofFloat(binding.tvTitle, View.ALPHA, 0f, 1f).apply {
                duration = 400
                interpolator = OvershootInterpolator(0.8f)
                start()
            }
        }, 500)

        binding.pinContainer.postDelayed({
            ObjectAnimator.ofFloat(binding.pinContainer, View.ALPHA, 0f, 1f).apply {
                duration = 500
                interpolator = OvershootInterpolator(0.8f)
                start()
            }
        }, 600)
    }

    private fun setupSecurePinInput() {
        val boxes = listOf(
            binding.etPin1, binding.etPin2,
            binding.etPin3, binding.etPin4
        )

        pinInput = PinInputHelper(boxes).also { it.setup() }

        boxes.forEachIndexed { index, editText ->
            editText.setOnFocusChangeListener { _, hasFocus ->
                editText.animate()
                    .scaleX(if (hasFocus) 1.02f else 1f)
                    .scaleY(if (hasFocus) 1.02f else 1f)
                    .translationZ(if (hasFocus) 6f else 0f)
                    .setDuration(if (hasFocus) 200 else 150)
                    .start()
            }
        }
    }

    private fun setupObservers() {
        viewModel.authResult.observe(this) { profile ->
            if (profile != null) {
                lifecycleScope.launch {
                    val deviceUid = FirestoreAuthRepository.getUid()
                    if (deviceUid != null) {
                        FirestoreProfileRepository.updateLastOpened(
                            deviceUid, profile.id, System.currentTimeMillis()
                        )
                    }
                }
                sessionManager.saveFirebaseSession(profile.id, profile.username)
                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                finish()
            }
        }

        viewModel.authMessage.observe(this) { message ->
            binding.tvPinError.visibility = View.VISIBLE
            binding.tvPinError.text = message
            shakeView(binding.pinContainer)
            clearPinBoxes()
        }
    }

    private fun clearPinBoxes() {
        pinInput.clear()
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }
        binding.btnUnlock.setOnClickListener {
            val enteredPin = pinInput.pin
            if (enteredPin.length == 4 && enteredPin.all { it.isDigit() }) {
                viewModel.login(username, enteredPin)
            } else {
                binding.tvPinError.visibility = View.VISIBLE
                binding.tvPinError.text = "Enter your PIN"
                shakeView(binding.pinContainer)
            }
        }
    }

    private fun shakeView(view: View) {
        val shake = AnimationUtils.loadAnimation(this, R.anim.shake_error)
        view.startAnimation(shake)
    }
}
