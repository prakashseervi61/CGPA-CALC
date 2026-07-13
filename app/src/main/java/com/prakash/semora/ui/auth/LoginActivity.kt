package com.prakash.semora.ui.auth

import android.animation.ObjectAnimator
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.view.animation.OvershootInterpolator
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import androidx.lifecycle.ViewModelProvider
import com.example.semora.R
import com.example.semora.BaseActivity
import com.example.semora.MainActivity
import com.example.semora.databinding.ActivityLoginBinding
import com.prakash.semora.ui.auth.AuthViewModel
import com.prakash.semora.utils.PinInputHelper
import com.prakash.semora.utils.SessionManager

class LoginActivity : BaseActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var viewModel: AuthViewModel
    private lateinit var sessionManager: SessionManager

    private lateinit var pinInput: PinInputHelper

    private var username: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)
        viewModel = ViewModelProvider(
            this,
            ViewModelProvider.AndroidViewModelFactory.getInstance(application)
        )[AuthViewModel::class.java]

        setupUI()
        setupSecurePinInput()
        setupObservers()
        setupListeners()
    }

    override fun onDestroy() {
        pinInput.destroy()
        super.onDestroy()
    }

    private fun setupUI() {
        binding.tvTitle.alpha = 0f
        binding.tilUsername.alpha = 0f
        binding.pinContainer.alpha = 0f
        binding.btnLogin.alpha = 0f

        binding.tvTitle.postDelayed({
            ObjectAnimator.ofFloat(binding.tvTitle, View.ALPHA, 0f, 1f).apply {
                duration = 400
                interpolator = OvershootInterpolator(0.8f)
                start()
            }
        }, 100)

        binding.tilUsername.postDelayed({
            ObjectAnimator.ofFloat(binding.tilUsername, View.ALPHA, 0f, 1f).apply {
                duration = 400
                interpolator = OvershootInterpolator(0.8f)
                start()
            }
        }, 300)

        binding.pinContainer.postDelayed({
            ObjectAnimator.ofFloat(binding.pinContainer, View.ALPHA, 0f, 1f).apply {
                duration = 400
                interpolator = OvershootInterpolator(0.8f)
                start()
            }
        }, 500)

        binding.btnLogin.postDelayed({
            ObjectAnimator.ofFloat(binding.btnLogin, View.ALPHA, 0f, 1f).apply {
                duration = 400
                interpolator = OvershootInterpolator(0.8f)
                start()
            }
        }, 700)
    }

    private fun setupSecurePinInput() {
        val pinBoxes = listOf(
            binding.etPin1, binding.etPin2, binding.etPin3, binding.etPin4
        )

        pinInput = PinInputHelper(pinBoxes).also { it.setup() }

        binding.etUsername.imeOptions = EditorInfo.IME_ACTION_NEXT
        binding.etUsername.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_NEXT) {
                pinBoxes[0].requestFocus()
                true
            } else false
        }

        pinBoxes.forEachIndexed { index, box ->
            box.imeOptions = if (index < pinBoxes.size - 1) EditorInfo.IME_ACTION_NEXT else EditorInfo.IME_ACTION_DONE
            box.setOnEditorActionListener { _, actionId, _ ->
                when (actionId) {
                    EditorInfo.IME_ACTION_NEXT -> {
                        if (index < pinBoxes.size - 1) pinBoxes[index + 1].requestFocus()
                        else attemptLogin()
                        true
                    }
                    EditorInfo.IME_ACTION_DONE -> {
                        box.clearFocus()
                        val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
                        imm.hideSoftInputFromWindow(box.windowToken, 0)
                        attemptLogin()
                        true
                    }
                    else -> false
                }
            }
        }
    }

    private fun attemptLogin() {
        username = binding.etUsername.text.toString().trim()
        val enteredPin = pinInput.pin

        if (username.isEmpty()) {
            binding.tvUsernameError.text = "Username cannot be empty"
            binding.tvUsernameError.visibility = View.VISIBLE
            shakeView(binding.tilUsername)
            return
        }

        if (enteredPin.length != 4 || !enteredPin.all { it.isDigit() }) {
            binding.tvPinError.text = "PIN must be exactly 4 digits"
            binding.tvPinError.visibility = View.VISIBLE
            shakeView(binding.pinContainer)
            return
        }

        viewModel.login(username, enteredPin)
    }

    private fun setupObservers() {
        viewModel.authResult.observe(this) { user ->
            if (user != null) {
                sessionManager.saveUserSession(user.id, user.username)
                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                finish()
            }
        }

        viewModel.authMessage.observe(this) { message ->
            if (message.isNotEmpty()) {
                binding.tvUsernameError.text = message
                binding.tvUsernameError.visibility = View.VISIBLE
                binding.tvPinError.text = message
                binding.tvPinError.visibility = View.VISIBLE
                shakeView(binding.tilUsername)
                shakeView(binding.pinContainer)
                clearInputs()
            }
        }
    }

    private fun setupListeners() {
        binding.btnLogin.setOnClickListener {
            attemptLogin()
        }

        binding.btnBack.setOnClickListener {
            finish()
        }

        binding.tvSignUp.setOnClickListener {
            val intent = Intent(this, com.prakash.semora.ui.auth.RegisterActivity::class.java)
            startActivity(intent)
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }
    }

    private fun clearInputs() {
        binding.etUsername.text?.clear()
        pinInput.clear()
    }

    private fun shakeView(view: View) {
        val shake = android.view.animation.AnimationUtils.loadAnimation(this, R.anim.shake_error)
        view.startAnimation(shake)
    }
}