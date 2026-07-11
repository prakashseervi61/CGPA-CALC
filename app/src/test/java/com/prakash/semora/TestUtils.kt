package com.prakash.semora

import android.app.Application
import io.mockk.mockk

fun mockApplication(): Application = mockk(relaxed = true)
