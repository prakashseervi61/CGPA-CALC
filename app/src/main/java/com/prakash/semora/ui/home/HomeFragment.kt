package com.prakash.semora.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.PathInterpolator
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.semora.R
import com.example.semora.databinding.FragmentHomeBinding
import com.prakash.semora.ui.utils.MotionUtils
import com.prakash.semora.ui.utils.ShimmerDrawable
import com.prakash.semora.utils.SessionManager
import java.util.Calendar

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var viewModel: HomeViewModel
    private var shimmerDrawable: ShimmerDrawable? = null

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

        shimmerDrawable = ShimmerDrawable().apply {
            binding.loadingShimmer.background = this
        }

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
        binding.btnEmptyRetry.setOnClickListener {
            viewModel.loadDashboard()
        }
    }

    private fun observeLoading() {
        viewModel.isLoading.observe(viewLifecycleOwner) { loading ->
            if (_binding == null) return@observe
            binding.loadingShimmer.visibility = if (loading) View.VISIBLE else View.GONE
            binding.scrollContent.visibility = if (loading) View.GONE else View.VISIBLE
            if (loading) shimmerDrawable?.startShimmer() else shimmerDrawable?.stopShimmer()
        }
    }

    private fun observeDashboard() {
        viewModel.dashboard.observe(viewLifecycleOwner) { data ->
            if (_binding == null) return@observe
            binding.cardHero.visibility = View.VISIBLE
            binding.emptyState.visibility = View.GONE

            binding.tvCgpaValue.text = String.format("%.2f", data.cgpa)
            binding.tvSemesterLabel.text = "Semester ${data.completedSemesters}"
            binding.tvCreditsLabel.text = "${data.gradedCredits} Credits"
            binding.tvPercentage.text = "≈ ${data.cgpaProgress}%"
            binding.progressRing.setProgress(data.cgpa.toFloat())

            val overlay = binding.cgpaBackgroundOverlay
            when {
                data.cgpa == 0.0 -> overlay.setBackgroundResource(android.R.color.transparent)
                data.cgpa >= 9.0 -> overlay.setBackgroundResource(R.color.cgpa_excellent_overlay)
                data.cgpa >= 8.0 -> overlay.setBackgroundResource(R.color.cgpa_good_overlay)
                else -> overlay.setBackgroundResource(R.color.cgpa_needs_improvement_overlay)
            }

            binding.cardRecentSemester.icon.setImageResource(R.drawable.ic_school_rounded)
            binding.cardRecentSemester.title.text = "Recent Semester"
            binding.cardRecentSemester.value.text = "Semester ${data.completedSemesters}"

            binding.cardTotalSubjects.icon.setImageResource(R.drawable.ic_school)
            binding.cardTotalSubjects.title.text = "Total Subjects"
            binding.cardTotalSubjects.value.text = "${data.completedSemesters * 6}"

            binding.cardCreditsEarned.icon.setImageResource(R.drawable.ic_credits)
            binding.cardCreditsEarned.title.text = "Credits Earned"
            binding.cardCreditsEarned.value.text = "${data.gradedCredits} / ${data.totalCurriculumCredits}"

            binding.cardOverallPercentage.icon.setImageResource(R.drawable.ic_info)
            binding.cardOverallPercentage.title.text = "Overall %"
            binding.cardOverallPercentage.value.text = "${data.cgpaProgress}%"

            binding.cardUpcomingExams.icon.setImageResource(R.drawable.ic_notification)
            binding.cardUpcomingExams.title.text = "Upcoming Exams"
            binding.cardUpcomingExams.value.text = "—"

            binding.cardAcademicInsights.icon.setImageResource(R.drawable.ic_school_rounded)
            binding.cardAcademicInsights.title.text = "Insights"
            binding.cardAcademicInsights.value.text = data.cgpaMessage.ifEmpty { "Keep going!" }

            binding.cardQuickActions.icon.setImageResource(R.drawable.ic_edit)
            binding.cardQuickActions.title.text = "Quick Actions"
            binding.cardQuickActions.value.text = "Tap to begin"

            fun View.enter(delay: Long) {
                if (!MotionUtils.areAnimationsEnabled(requireContext())) { alpha = 1f; translationY = 0f; return }
                alpha = 0f; translationY = 24f * resources.displayMetrics.density
                animate().alpha(1f).translationY(0f).setDuration(300L).setStartDelay(delay)
                    .setInterpolator(PathInterpolator(0.05f, 0.7f, 0.1f, 1f)).start()
            }
            binding.cardHero.enter(0L)
            binding.dashboardGrid.enter(100L)
        }
    }

    override fun onDestroyView() {
        shimmerDrawable?.stopShimmer()
        shimmerDrawable = null
        super.onDestroyView()
        _binding = null
    }

    override fun onResume() {
        super.onResume()
        viewModel.loadDashboard()
    }
}