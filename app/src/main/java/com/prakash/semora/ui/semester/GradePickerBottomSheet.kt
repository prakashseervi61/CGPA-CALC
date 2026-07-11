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

        val gradeToChip = mapOf(
            "O" to R.id.chipO,
            "A+" to R.id.chipAPlus,
            "A" to R.id.chipA,
            "B+" to R.id.chipBPlus,
            "B" to R.id.chipB,
            "C" to R.id.chipC,
            "U" to R.id.chipU
        )

        val gradeToBg = mapOf(
            "O" to R.drawable.bg_grade_chip_o,
            "A+" to R.drawable.bg_grade_chip_a,
            "A" to R.drawable.bg_grade_chip_a,
            "B+" to R.drawable.bg_grade_chip_b,
            "B" to R.drawable.bg_grade_chip_b,
            "C" to R.drawable.bg_grade_chip_c,
            "U" to R.drawable.bg_grade_chip_u
        )

        gradeToChip.forEach { (grade, chipId) ->
            val chip = view.findViewById<MaterialButton>(chipId)
            chip.text = grade
            chip.setOnClickListener {
                onGradeSelected?.invoke(grade)
                dismiss()
            }
            if (grade == selectedGrade) {
                gradeToBg[grade]?.let { bgRes ->
                    chip.background = resources.getDrawable(bgRes, null)
                }
            }
        }

        view.findViewById<View>(R.id.btnClearGrade).setOnClickListener {
            onGradeSelected?.invoke("")
            dismiss()
        }
    }

}
