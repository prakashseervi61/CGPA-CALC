package com.prakash.semora.ui.home

import android.animation.ValueAnimator
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.semora.databinding.FragmentHomeBinding
import com.prakash.semora.utils.SessionManager
import java.util.Calendar

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var viewModel: HomeViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        viewModel = ViewModelProvider(this, ViewModelProvider.AndroidViewModelFactory.getInstance(requireActivity().application))[HomeViewModel::class.java]

        setGreeting()
        setupListeners()
        observeDashboard()
        observeLoading()
        observeErrors()

        viewModel.loadDashboard()
    }

    private fun setGreeting() {
        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        val greeting = when (hour) {
            in 0..11 -> "Good morning"
            in 12..16 -> "Good afternoon"
            else -> "Good evening"
        }
        binding.tvGreeting.text = greeting
        binding.tvUsername.text = sessionManager.getUsername() ?: "Alex"
    }

    private fun setupListeners() {
        binding.btnNotifications.setOnClickListener {
            // TODO: Open notifications
        }
        binding.retryButton.setOnClickListener {
            viewModel.clearError()
            viewModel.loadDashboard()
        }
        binding.btnEmptyRetry.setOnClickListener {
            viewModel.loadDashboard()
        }
    }

    private fun observeLoading() {
        viewModel.isLoading.observe(viewLifecycleOwner) { loading ->
            if (_binding == null) return@observe
            binding.loadingShimmer.visibility = if (loading) View.VISIBLE else View.GONE
            binding.scrollContent.visibility = if (loading) View.GONE else View.VISIBLE
        }
    }

    private fun observeDashboard() {
        viewModel.dashboard.observe(viewLifecycleOwner) { data ->
            if (_binding == null) return@observe
            binding.cardHero.visibility = View.VISIBLE
            binding.cardSemesters.visibility = View.VISIBLE
            binding.cardCredits.visibility = View.VISIBLE
            binding.emptyState.visibility = View.GONE

            animateCgpaCount(data.cgpa)
            binding.tvCgpaMessage.text = data.cgpaMessage
            binding.cgpaProgress.progress = data.cgpaProgress
            binding.tvProgressPercentage.text = "${data.cgpaProgress}%"

            binding.tvSemesterCount.text = data.completedSemesters.toString()
            binding.tvTotalSemesters.text = "/ ${data.totalSemesters}"
            binding.semesterProgressBar.progress = data.semesterProgress

            binding.tvCreditsEarned.text = data.gradedCredits.toString()
            binding.tvTotalCredits.text = "/ ${data.totalCurriculumCredits}"
            binding.creditsProgressBar.progress = data.creditsProgress
        }
    }

    private fun observeErrors() {
        viewModel.errorMessage.observe(viewLifecycleOwner) { msg ->
            if (_binding == null) return@observe
            binding.errorCard.visibility = if (msg != null) View.VISIBLE else View.GONE
            binding.errorText.text = msg
        }
        viewModel.isLoading.observe(viewLifecycleOwner) { loading ->
            if (_binding == null) return@observe
            val data = viewModel.dashboard.value
            val isOfflineEmpty = !loading && data != null && data.cgpa == 0.0 && data.completedSemesters == 0
            binding.emptyOffline.visibility = if (isOfflineEmpty) View.VISIBLE else View.GONE
        }
    }

    private fun animateCgpaCount(target: Double) {
        val animator = ValueAnimator.ofFloat(0f, target.toFloat())
        animator.duration = 1000L
        animator.interpolator = AccelerateDecelerateInterpolator()
        animator.addUpdateListener { animation ->
            if (_binding == null) return@addUpdateListener
            binding.tvCgpa.text = String.format("%.2f", animation.animatedValue)
        }
        animator.start()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}