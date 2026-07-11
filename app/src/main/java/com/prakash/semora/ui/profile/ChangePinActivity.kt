package com.prakash.semora.ui.profile

import android.os.Bundle
import android.view.View
import androidx.lifecycle.ViewModelProvider
import com.example.semora.BaseActivity
import com.example.semora.databinding.ActivityChangePinBinding
import com.google.android.material.snackbar.Snackbar
import com.prakash.semora.utils.PinInputHelper
import com.prakash.semora.utils.SessionManager

class ChangePinActivity : BaseActivity() {

    private lateinit var binding: ActivityChangePinBinding
    private lateinit var viewModel: ChangePinViewModel

    private lateinit var currentPinInput: PinInputHelper
    private lateinit var newPinInput: PinInputHelper
    private lateinit var confirmPinInput: PinInputHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChangePinBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(
            this,
            ViewModelProvider.AndroidViewModelFactory.getInstance(application)
        )[ChangePinViewModel::class.java]

        setupToolbar()
        setupPinInputs()
        setupObservers()
        setupClickListeners()
        viewModel.loadUser()
    }

    override fun onDestroy() {
        currentPinInput.destroy()
        newPinInput.destroy()
        confirmPinInput.destroy()
        super.onDestroy()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = ""

        binding.toolbar.setNavigationOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }
    }

    private fun setupPinInputs() {
        currentPinInput = PinInputHelper(
            listOf(binding.etCurrentPin1, binding.etCurrentPin2, binding.etCurrentPin3, binding.etCurrentPin4)
        ).also { it.setup() }
        newPinInput = PinInputHelper(
            listOf(binding.etNewPin1, binding.etNewPin2, binding.etNewPin3, binding.etNewPin4)
        ).also { it.setup() }
        confirmPinInput = PinInputHelper(
            listOf(binding.etConfirmPin1, binding.etConfirmPin2, binding.etConfirmPin3, binding.etConfirmPin4)
        ).also { it.setup() }
    }

    private fun setupObservers() {
        viewModel.step.observe(this) { step ->
            if (step == 2) {
                binding.stepCurrentPin.visibility = View.GONE
                binding.stepNewPin.visibility = View.VISIBLE

                val newPinBoxes = listOf(
                    binding.etNewPin1, binding.etNewPin2,
                    binding.etNewPin3, binding.etNewPin4
                )
                newPinBoxes[0].requestFocus()
            }
        }

        viewModel.currentPinError.observe(this) { error ->
            if (error != null) {
                binding.tvCurrentPinError.text = error
                binding.tvCurrentPinError.visibility = View.VISIBLE
                clearCurrentPinBoxes()
            } else {
                binding.tvCurrentPinError.visibility = View.GONE
            }
        }

        viewModel.newPinError.observe(this) { error ->
            if (error != null) {
                binding.tvNewPinError.text = error
                binding.tvNewPinError.visibility = View.VISIBLE
            } else {
                binding.tvNewPinError.visibility = View.GONE
            }
        }

        viewModel.confirmPinError.observe(this) { error ->
            if (error != null) {
                binding.tvConfirmPinError.text = error
                binding.tvConfirmPinError.visibility = View.VISIBLE
            } else {
                binding.tvConfirmPinError.visibility = View.GONE
            }
        }

        viewModel.isSaving.observe(this) { saving ->
            if (saving) {
                binding.btnUpdatePin.text = ""
                binding.btnUpdatePin.isEnabled = false
                binding.btnProgress.visibility = View.VISIBLE
            } else {
                binding.btnUpdatePin.text = "Update PIN"
                binding.btnUpdatePin.isEnabled = true
                binding.btnProgress.visibility = View.GONE
            }
        }

        viewModel.success.observe(this) { success ->
            if (success) {
                Snackbar.make(binding.root, "PIN updated successfully.", Snackbar.LENGTH_SHORT).show()
                binding.root.postDelayed({
                    if (!isFinishing) finish()
                }, 800)
                viewModel.clearMessage()
            }
        }

        viewModel.message.observe(this) { msg ->
            if (msg != null && viewModel.success.value != true) {
                Snackbar.make(binding.root, msg!!, Snackbar.LENGTH_SHORT).show()
                viewModel.clearMessage()
            }
        }
    }

    private fun setupClickListeners() {
        binding.btnVerify.setOnClickListener {
            binding.tvCurrentPinError.visibility = View.GONE
            viewModel.verifyCurrentPin(currentPinInput.pin)
        }

        binding.btnUpdatePin.setOnClickListener {
            binding.tvNewPinError.visibility = View.GONE
            binding.tvConfirmPinError.visibility = View.GONE
            viewModel.updatePin(newPinInput.pin, confirmPinInput.pin)
        }
    }

    private fun clearCurrentPinBoxes() {
        currentPinInput.clear()
    }
}
