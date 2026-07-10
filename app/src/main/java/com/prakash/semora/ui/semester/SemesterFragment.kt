package com.prakash.semora.ui.semester

import android.animation.ValueAnimator
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.semora.databinding.FragmentSemesterBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.example.semora.R
import com.prakash.semora.model.Course
import com.prakash.semora.model.SemesterState
import kotlinx.coroutines.launch

class SemesterFragment : Fragment() {

    private var _binding: FragmentSemesterBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: SubjectAdapter
    private lateinit var viewModel: SemViewModel
    private var resetDialog: androidx.appcompat.app.AlertDialog? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSemesterBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(this)[SemViewModel::class.java]

        initAdapter()
        buildSemesterChips()
        setupResetButton()

        observeLoading()
        observeErrors()
        setupPullToRefresh()

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.currentState.collect { state ->
                    bindState(state)
                }
            }
        }
    }

    private fun observeErrors() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.errorMessage.collect { msg ->
                    if (_binding == null) return@collect
                    binding.errorCard.visibility = if (msg != null) View.VISIBLE else View.GONE
                    binding.errorText.text = msg
                }
            }
        }
    }

    private fun setupPullToRefresh() {
        binding.retryButton.setOnClickListener {
            viewModel.clearError()
            viewModel.refresh()
        }
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.refresh()
            binding.swipeRefresh.isRefreshing = false
        }
    }

    private fun observeLoading() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.isLoading.collect { loading ->
                    if (_binding == null) return@collect
                    binding.loadingShimmer.visibility = if (loading) View.VISIBLE else View.GONE
                    binding.nestedScrollView.visibility = if (loading) View.GONE else View.VISIBLE
                    binding.layoutBottomPanel.visibility = if (loading) View.GONE else View.VISIBLE
                }
            }
        }
    }

    private fun initAdapter() {
        adapter = SubjectAdapter { course -> showGradePicker(course) }
        binding.rvSubjects.layoutManager = LinearLayoutManager(requireContext())
        binding.rvSubjects.adapter = adapter
        binding.rvSubjects.itemAnimator = null
        adapter.submitList(viewModel.currentState.value.courses)
    }

    private fun showGradePicker(course: Course) {
        val sheet = GradePickerBottomSheet.newInstance(
            course.grade.ifEmpty { null }
        )
        sheet.setOnGradeSelectedListener { grade ->
            viewModel.updateGrade(course.code, grade)
        }
        sheet.show(parentFragmentManager, "grade_picker")
    }

    private fun buildSemesterChips() {
        val container = binding.semesterChipsContainer
        container.removeAllViews()

        for (i in 1..8) {
            val chip = LayoutInflater.from(requireContext())
                .inflate(R.layout.item_semester_pill, container, false)

            val tvNum = chip.findViewById<TextView>(R.id.tvPillNumber)
            val tvLabel = chip.findViewById<TextView>(R.id.tvPillLabel)
            tvNum.text = "S$i"
            tvLabel.text = "Semester $i"

            chip.setOnClickListener { viewModel.selectSemester(i) }
            container.addView(chip)

            if (i < 8) {
                val spacer = View(requireContext())
                spacer.layoutParams = LinearLayout.LayoutParams(
                    resources.getDimensionPixelOffset(R.dimen.spacing_xs), 1
                )
                container.addView(spacer)
            }
        }
    }

    private var lastSgpa = 0.0

    private fun bindState(state: SemesterState) {
        if (_binding == null) return
        adapter.submitList(state.courses)
        updateSemesterChips(state.semesterNumber)
        animateSgpa(state.sgpa)
        binding.tvLiveCompleted.text = "${state.completedSubjects} / ${state.totalSubjects}"
        binding.tvLiveCredits.text = "${state.totalGradedCredits} / ${state.totalCredits}"

        if (state.completedSubjects == 0) {
            binding.emptyState.visibility = View.VISIBLE
        } else {
            binding.emptyState.visibility = View.GONE
        }
    }

    private fun animateSgpa(target: Double) {
        val animator = ValueAnimator.ofFloat(lastSgpa.toFloat(), target.toFloat())
        animator.duration = 500L
        animator.interpolator = AccelerateDecelerateInterpolator()
        animator.addUpdateListener { animation ->
            if (_binding == null) return@addUpdateListener
            binding.tvLiveSgpa.text = String.format("%.2f", animation.animatedValue)
        }
        animator.start()
        lastSgpa = target
    }

    private fun updateSemesterChips(activeNumber: Int) {
        if (_binding == null) return
        for (i in 0 until binding.semesterChipsContainer.childCount) {
            val chip = binding.semesterChipsContainer.getChildAt(i)
            val tvNum = chip?.findViewById<TextView>(R.id.tvPillNumber) ?: continue
            val tvLabel = chip?.findViewById<TextView>(R.id.tvPillLabel) ?: continue
            val num = tvNum.text.toString().filter { it.isDigit() }.toIntOrNull() ?: 0
            val isActive = num == activeNumber

            val bg = chip?.background as? GradientDrawable
            if (isActive) {
                bg?.setColor(
                    ContextCompat.getColor(requireContext(), R.color.md3_primary_container)
                )
                bg?.setStroke(0, ContextCompat.getColor(requireContext(), R.color.md3_primary))
                tvNum.setTextColor(
                    ContextCompat.getColor(requireContext(), R.color.md3_on_primary_container)
                )
                tvLabel.setTextColor(
                    ContextCompat.getColor(requireContext(), R.color.md3_on_primary_container)
                )
            } else {
                bg?.setColor(
                    ContextCompat.getColor(requireContext(), R.color.md3_surface_container_low)
                )
                bg?.setStroke(
                    1,
                    ContextCompat.getColor(requireContext(), R.color.md3_outline)
                )
                tvNum.setTextColor(
                    ContextCompat.getColor(requireContext(), R.color.md3_on_surface)
                )
                tvLabel.setTextColor(
                    ContextCompat.getColor(requireContext(), R.color.md3_on_surface_variant)
                )
            }
        }
    }

    private fun setupResetButton() {
        binding.btnReset.setOnClickListener { showResetDialog() }
    }

    private fun showResetDialog() {
        if (_binding == null) return
        val number = viewModel.currentState.value.semesterNumber
        resetDialog = MaterialAlertDialogBuilder(requireContext())
            .setTitle("Reset Semester?")
            .setMessage(
                "This will remove all selected grades for Semester $number " +
                        "and reset the SGPA. This action cannot be undone."
            )
            .setCancelable(true)
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Reset") { _, _ ->
                viewModel.resetCurrentSemester()
                Snackbar.make(binding.root, "Semester $number has been reset.", Snackbar.LENGTH_SHORT)
                    .show()
            }
            .show()
    }

    override fun onDestroyView() {
        resetDialog?.dismiss()
        resetDialog = null
        super.onDestroyView()
        _binding = null
    }
}
