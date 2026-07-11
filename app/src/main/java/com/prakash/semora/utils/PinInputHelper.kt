package com.prakash.semora.utils

import android.os.Handler
import android.os.Looper
import android.text.Editable
import android.text.TextWatcher
import android.view.KeyEvent
import android.widget.EditText

class PinInputHelper(
    private val boxes: List<EditText>,
    private val digits: CharArray = CharArray(4) { ' ' }
) {
    private var maskHandler: Handler? = null
    private var isProgrammaticChange = false

    fun setup() {
        boxes.forEachIndexed { index, box ->
            box.setBackgroundResource(com.example.semora.R.drawable.bg_pin_dot_empty)

            box.setOnKeyListener { _, keyCode, event ->
                if (keyCode == KeyEvent.KEYCODE_DEL && event.action == KeyEvent.ACTION_DOWN) {
                    handleDelete(index)
                    true
                } else false
            }

            box.addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
                override fun afterTextChanged(s: Editable?) {
                    if (isProgrammaticChange) return
                    val text = s?.toString() ?: ""
                    if (text.length == 1 && text[0].isDigit()) {
                        cancelMaskTimer()
                        maskAllVisibleExcept(index)
                        digits[index] = text[0]
                        box.setBackgroundResource(com.example.semora.R.drawable.bg_pin_dot_filled)
                        startMaskTimer(index)
                        if (index < boxes.size - 1) boxes[index + 1].requestFocus()
                    } else if (text.isEmpty()) {
                        cancelMaskTimer()
                        digits[index] = ' '
                        box.setBackgroundResource(com.example.semora.R.drawable.bg_pin_dot_empty)
                    }
                }
            })
        }
    }

    val pin: String get() = digits.joinToString("")

    fun clear() {
        isProgrammaticChange = true
        digits.fill(' ')
        boxes.forEachIndexed { i, box ->
            box.setText("")
            box.setBackgroundResource(com.example.semora.R.drawable.bg_pin_dot_empty)
        }
        isProgrammaticChange = false
        cancelMaskTimer()
        boxes[0].requestFocus()
    }

    fun destroy() {
        cancelMaskTimer()
    }

    private fun handleDelete(index: Int) {
        val text = boxes[index].text?.toString() ?: ""
        if (text.isNotEmpty() && text != "●") {
            cancelMaskTimer()
            setTextAt(index, "")
            digits[index] = ' '
            boxes[index].setBackgroundResource(com.example.semora.R.drawable.bg_pin_dot_empty)
        } else if (index > 0) {
            cancelMaskTimer()
            setTextAt(index - 1, "")
            digits[index - 1] = ' '
            boxes[index - 1].setBackgroundResource(com.example.semora.R.drawable.bg_pin_dot_empty)
            boxes[index - 1].requestFocus()
        }
    }

    private fun maskAllVisibleExcept(exceptIndex: Int) {
        for (i in boxes.indices) {
            if (i != exceptIndex) {
                val text = boxes[i].text?.toString() ?: ""
                if (text.isNotEmpty() && text != "●") {
                    setTextAt(i, "●")
                }
            }
        }
    }

    private fun startMaskTimer(index: Int) {
        maskHandler?.removeCallbacksAndMessages(null)
        val handler = Handler(Looper.getMainLooper())
        maskHandler = handler
        handler.postDelayed({
            setTextAt(index, "●")
        }, 1000)
    }

    private fun cancelMaskTimer() {
        maskHandler?.removeCallbacksAndMessages(null)
        maskHandler = null
    }

    private fun setTextAt(index: Int, text: String) {
        isProgrammaticChange = true
        boxes[index].setText(text)
        boxes[index].setSelection(boxes[index].text?.length ?: 1)
        isProgrammaticChange = false
    }
}