package com.huesixteen

import android.Manifest
import android.app.AlarmManager
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.webkit.WebSettings
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        requestNotificationPermissionIfNeeded()
        requestExactAlarmPermissionIfNeeded()
        AlarmScheduler.scheduleAll(this)

        val webView = findViewById<WebView>(R.id.webView)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccess = true
            allowContentAccess = true
        }
        webView.addJavascriptInterface(AlarmBridge(this), "AndroidBridge")
        webView.webViewClient = WebViewClient()
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onResume() {
        super.onResume()
        AlarmScheduler.scheduleAll(this)
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1001)
        }
    }

    private fun requestExactAlarmPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val alarmManager = getSystemService(AlarmManager::class.java)
            if (!alarmManager.canScheduleExactAlarms()) {
                startActivity(Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM))
            }
        }
    }

    private class AlarmBridge(private val activity: MainActivity) {
        @JavascriptInterface
        fun syncSchedules(scheduleJson: String) {
            activity.runOnUiThread {
                AlarmScheduler.replaceSchedules(activity, scheduleJson)
            }
        }
    }
}
