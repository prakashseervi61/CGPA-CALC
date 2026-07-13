package com.prakash.semora.ui.auth

import android.animation.Animator
import android.animation.ObjectAnimator
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.view.animation.AnimationUtils
import android.view.animation.OvershootInterpolator
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import androidx.lifecycle.ViewModelProvider
import com.example.semora.R
import com.example.semora.BaseActivity
import com.example.semora.MainActivity
import com.example.semora.databinding.ActivityRegisterBinding
import com.prakash.semora.ui.auth.LoginActivity
import com.prakash.semora.utils.PinInputHelper
import com.prakash.semora.utils.SessionManager

class RegisterActivity : BaseActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var viewModel: AuthViewModel
    private lateinit var sessionManager: SessionManager
    private var isAnimating = false

    private lateinit var pinInput: PinInputHelper
    private lateinit var confirmPinInput: PinInputHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.ivLogo.alpha = 0f

        sessionManager = SessionManager(this)
        viewModel = ViewModelProvider(
            this,
            ViewModelProvider.AndroidViewModelFactory.getInstance(application)
        )[AuthViewModel::class.java]

        setupSecurePinInput()
        setupPinFocusAnimations()
        setupObservers()
        setupButtonPressAnimation()
        setupListeners()
        playLogoAnimation()
    }

    override fun onDestroy() {
        pinInput.destroy()
        confirmPinInput.destroy()
        super.onDestroy()
    }

    private fun playLogoAnimation() {
        val logoFadeIn = ObjectAnimator.ofFloat(binding.ivLogo, View.ALPHA, 0f, 1f)
        logoFadeIn.duration = 600
        logoFadeIn.interpolator = OvershootInterpolator(0.8f)
        logoFadeIn.start()
    }

    private fun setupSecurePinInput() {
        val pinBoxes = listOf(
            binding.etPin1, binding.etPin2, binding.etPin3, binding.etPin4
        )
        val confirmPinBoxes = listOf(
            binding.etConfirmPin1, binding.etConfirmPin2,
            binding.etConfirmPin3, binding.etConfirmPin4
        )

        pinInput = PinInputHelper(pinBoxes).also { it.setup() }
        confirmPinInput = PinInputHelper(confirmPinBoxes).also { it.setup() }

        binding.etUsername.imeOptions = EditorInfo.IME_ACTION_NEXT
        binding.etUsername.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_NEXT) {
                pinBoxes[0].requestFocus(); true
            } else false
        }

        pinBoxes.forEachIndexed { index, box ->
            box.imeOptions = EditorInfo.IME_ACTION_NEXT
            box.setOnEditorActionListener { _, actionId, _ ->
                if (actionId == EditorInfo.IME_ACTION_NEXT) {
                    if (index < pinBoxes.size - 1) pinBoxes[index + 1].requestFocus()
                    else confirmPinBoxes[0].requestFocus()
                    true
                } else false
            }
        }

        confirmPinBoxes.forEachIndexed { index, box ->
            box.imeOptions = if (index < confirmPinBoxes.size - 1) EditorInfo.IME_ACTION_NEXT else EditorInfo.IME_ACTION_DONE
            box.setOnEditorActionListener { _, actionId, _ ->
                when (actionId) {
                    EditorInfo.IME_ACTION_NEXT -> { confirmPinBoxes[index + 1].requestFocus(); true }
                    EditorInfo.IME_ACTION_DONE -> {
                        box.clearFocus()
                        (getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager).hideSoftInputFromWindow(box.windowToken, 0)
                        true
                    }
                    else -> false
                }
            }
        }
    }

    private fun setupPinFocusAnimations() {
        val allBoxes = listOf(
            binding.etPin1, binding.etPin2, binding.etPin3, binding.etPin4,
            binding.etConfirmPin1, binding.etConfirmPin2, binding.etConfirmPin3, binding.etConfirmPin4
        )

        allBoxes.forEach { editText ->
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
        viewModel.formState.observe(this) { state ->
            binding.tvPinError.visibility = View.GONE
            binding.tvConfirmPinError.visibility = View.GONE
            binding.tvUsernameError.visibility = View.GONE

            state?.usernameError?.let {
                binding.tvUsernameError.text = it
                binding.tvUsernameError.visibility = View.VISIBLE
                shakeView(binding.tilUsername)
            }

            state?.pinError?.let {
                binding.tvPinError.text = it
                binding.tvPinError.visibility = View.VISIBLE
                shakeView(binding.pinContainer)
            }

            state?.confirmPinError?.let {
                binding.tvConfirmPinError.text = it
                binding.tvConfirmPinError.visibility = View.VISIBLE
                shakeView(binding.confirmPinContainer)
            }
        }

        viewModel.isLoading.observe(this) { loading ->
            binding.btnRegister.isEnabled = !loading
            binding.btnProgress.visibility = if (loading) View.VISIBLE else View.GONE
            if (loading) {
                binding.btnRegister.text = ""
                animateButtonLoading()
            } else {
                binding.btnRegister.text = getString(R.string.register_btn)
            }
        }

        viewModel.authResult.observe(this) { user ->
            if (user != null) {
                sessionManager.saveUserSession(user.id, user.username)
                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                finish()
            }
        }

        // login errors handled in LoginActivity
    }

    private fun animateButtonLoading() {
        if (isAnimating) return
        isAnimating = true
        val bounce = ObjectAnimator.ofFloat(binding.flButtonContainer, View.TRANSLATION_Y, 0f, -4f, 0f)
        bounce.duration = 400
        bounce.interpolator = OvershootInterpolator(1f)
        bounce.addListener(object : Animator.AnimatorListener {
            override fun onAnimationStart(p0: Animator) {}
            override fun onAnimationEnd(p0: Animator) { isAnimating = false }
            override fun onAnimationCancel(p0: Animator) { isAnimating = false }
            override fun onAnimationRepeat(p0: Animator) {}
        })
        bounce.start()
    }

    private fun setupButtonPressAnimation() {
        binding.btnRegister.setOnTouchListener { v, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    v.animate().scaleX(0.95f).scaleY(0.95f).setDuration(100).start()
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    v.animate().scaleX(1f).scaleY(1f).setDuration(100).start()
                }
            }
            false
        }
    }

    private fun setupListeners() {
        binding.btnRegister.setOnClickListener {
            viewModel.register(
                binding.etUsername.text.toString().trim(),
                pinInput.pin,
                confirmPinInput.pin
            )
        }

        binding.btnBack.setOnClickListener {
            finish()
        }

        // Changed from finish() to navigate to LoginActivity
        binding.btnBackToLogin.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }
    }

    private fun shakeView(view: View) {
        val shake = AnimationUtils.loadAnimation(this, R.anim.shake_error)
        view.startAnimation(shake)
    }
}