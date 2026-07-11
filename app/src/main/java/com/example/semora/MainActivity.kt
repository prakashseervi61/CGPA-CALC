package com.example.semora

import android.content.res.ColorStateList
import android.os.Bundle
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.navigation.NavController
import androidx.navigation.NavOptions
import androidx.navigation.fragment.NavHostFragment
import com.example.semora.databinding.ActivityMainBinding

class MainActivity : BaseActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController

    private val tabIds = listOf(
        R.id.navigation_home,
        R.id.navigation_semester,
        R.id.navigation_profile
    )
    private var selectedIndex = 0
    private var tabWidth = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        setupBottomNav()
    }

    private fun setupBottomNav() {
        val icons = listOf(binding.ivNavHome, binding.ivNavSemester, binding.ivNavProfile)
        val labels = listOf(binding.tvNavHome, binding.tvNavSemester, binding.tvNavProfile)
        val tabs = listOf(binding.navHome, binding.navSemester, binding.navProfile)

        binding.bottomNavContainer.post {
            tabWidth = binding.bottomNavContainer.width / 3
        }

        navController.addOnDestinationChangedListener { _, destination, _ ->
            val index = tabIds.indexOf(destination.id)
            if (index >= 0 && index != selectedIndex) {
                selectedIndex = index
                updateTabStates(index)
            }
        }

        updateTabStates(0)

        tabs.forEachIndexed { index, tab ->
            tab.setOnClickListener { selectTab(index) }
        }
    }

    private fun selectTab(index: Int) {
        if (index == selectedIndex) return
        val fromIndex = selectedIndex
        selectedIndex = index
        updateTabStates(index)

        binding.bottomNavContainer.postDelayed({
            val anim = if (fromIndex == 0 && index == 1) {
                android.R.anim.fade_in to android.R.anim.fade_out
            } else if (index > fromIndex) {
                R.anim.slide_in_right to R.anim.slide_out_left
            } else {
                R.anim.slide_in_left to R.anim.slide_out_right
            }
            val options = NavOptions.Builder()
                .setEnterAnim(anim.first)
                .setExitAnim(anim.second)
                .setPopEnterAnim(R.anim.slide_in_left)
                .setPopExitAnim(R.anim.slide_out_right)
                .setLaunchSingleTop(true)
                .setRestoreState(true)
                .build()
            navController.navigate(tabIds[index], null, options)
        }, 50)
    }

    private fun updateTabStates(selected: Int) {
        val primary = ContextCompat.getColor(this, R.color.md3_primary)
        val onSurfaceVariant = ContextCompat.getColor(this, R.color.md3_on_surface_variant)

        binding.navPill.animate()
            .translationX((tabWidth * selected).toFloat())
            .setDuration(175L)
            .setInterpolator(AccelerateDecelerateInterpolator())
            .start()

        val icons = listOf(binding.ivNavHome, binding.ivNavSemester, binding.ivNavProfile)
        val labels = listOf(binding.tvNavHome, binding.tvNavSemester, binding.tvNavProfile)

        icons.forEachIndexed { i, icon ->
            val active = i == selected
            icon.imageTintList = ColorStateList.valueOf(if (active) primary else onSurfaceVariant)
        }

        labels.forEachIndexed { i, label ->
            val active = i == selected
            label.setTextColor(if (active) primary else onSurfaceVariant)
        }
    }

    fun switchToSemesterTab() {
        selectTab(1)
    }
}
