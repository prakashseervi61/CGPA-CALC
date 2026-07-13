package com.prakash.semora.ui.semester

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.google.android.material.button.MaterialButton
import com.example.semora.R

class GradePickerBottomSheet : BottomSheetDialogFragment() {

    private var onGradeSelected: ((String) -> Unit)? = null
    private var selectedGrade: String? = null

    companion object {
        private const val ARG_SELECTED = "selected_grade"

        fun newInstance(selected: String? = null): GradePickerBottomSheet {
            val sheet = GradePickerBottomSheet()
            val args = Bundle()
            args.putString(ARG_SELECTED, selected)
            sheet.arguments = args
            return sheet
        }
    }

    fun setOnGradeSelectedListener(listener: (String) -> Unit) {
        onGradeSelected = listener
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        selectedGrade = arguments?.getString(ARG_SELECTED)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.bottom_sheet_grade_picker, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        data class GradeOption(val grade: String, val chipId: Int, val bgRes: Int)
        val grades = listOf(
            GradeOption("O", R.id.chipO, R.drawable.bg_grade_chip_o),
            GradeOption("A+", R.id.chipAPlus, R.drawable.bg_grade_chip_a),
            GradeOption("A", R.id.chipA, R.drawable.bg_grade_chip_a),
            GradeOption("B+", R.id.chipBPlus, R.drawable.bg_grade_chip_b),
            GradeOption("B", R.id.chipB, R.drawable.bg_grade_chip_b),
            GradeOption("C", R.id.chipC, R.drawable.bg_grade_chip_c),
            GradeOption("U", R.id.chipU, R.drawable.bg_grade_chip_u),
        )

        grades.forEach { option ->
            val chip = view.findViewById<MaterialButton>(option.chipId)
            chip.text = option.grade
            chip.setOnClickListener {
                onGradeSelected?.invoke(option.grade)
                dismiss()
            }
            if (option.grade == selectedGrade) {
                chip.background = resources.getDrawable(option.bgRes, null)
            }
        }

        view.findViewById<View>(R.id.btnClearGrade).setOnClickListener {
            onGradeSelected?.invoke("")
            dismiss()
        }
    }

}
