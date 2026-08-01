package com.huesixteen

import android.Manifest
import android.app.AlarmManager
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import androidx.appcompat.app.AlertDialog
import android.webkit.WebSettings
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {

    private val uiPrefs: SharedPreferences by lazy {
        getSharedPreferences("huesixteen_ui_prefs", MODE_PRIVATE)
    }

    private val devFallbackCandidates = listOf(
        "http://192.168.0.104:5000",
        "http://10.0.2.2:5000",
        "http://localhost:5000",
        "https://calendar.huesixteen.com",
        "https://content-calendar-ffac.onrender.com",
    )

    private val executor = Executors.newSingleThreadExecutor()
    private val appPrefs: SharedPreferences by lazy {
        getSharedPreferences("huesixteen_app_config", MODE_PRIVATE)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        requestNotificationPermissionIfNeeded()
        requestExactAlarmPermissionIfNeeded()
        requestBatteryOptimizationExemptionIfNeeded()
        AlarmScheduler.scheduleAll(this)
        showAlarmHelpOnce()

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
        loadBestAppUrl(webView)
    }

    override fun onResume() {
        super.onResume()
        requestExactAlarmPermissionIfNeeded()
        requestBatteryOptimizationExemptionIfNeeded()
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

    private fun requestBatteryOptimizationExemptionIfNeeded() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return
        }

        val powerManager = getSystemService(PowerManager::class.java)
        if (powerManager.isIgnoringBatteryOptimizations(packageName)) {
            return
        }

        startActivity(
            Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                data = Uri.parse("package:$packageName")
            },
        )
    }

    private fun showAlarmHelpOnce() {
        if (uiPrefs.getBoolean("alarm_help_seen", false)) {
            return
        }

        AlertDialog.Builder(this)
            .setTitle(R.string.alarm_help_title)
            .setMessage(R.string.alarm_help_message)
            .setPositiveButton(R.string.alarm_help_open_settings) { _, _ ->
                requestExactAlarmPermissionIfNeeded()
                requestBatteryOptimizationExemptionIfNeeded()
            }
            .setNegativeButton(R.string.alarm_help_got_it, null)
            .setOnDismissListener {
                uiPrefs.edit().putBoolean("alarm_help_seen", true).apply()
            }
            .show()
    }

    private class AlarmBridge(private val activity: MainActivity) {
        @JavascriptInterface
        fun syncSchedules(scheduleJson: String) {
            activity.runOnUiThread {
                AlarmScheduler.replaceSchedules(activity, scheduleJson)
            }
        }

        @JavascriptInterface
        fun setBackendUrl(baseUrl: String): Boolean {
            val normalized = activity.normalizeBaseUrl(baseUrl)
            if (normalized == null) {
                return false
            }

            activity.appPrefs.edit().putString("backend_base_url", normalized).apply()
            return true
        }

        @JavascriptInterface
        fun forceUpdate() {
            activity.runOnUiThread {
                val webView = activity.findViewById<WebView>(R.id.webView)
                webView.clearCache(true)
                webView.clearHistory()

                val currentUrl = webView.url
                if (!currentUrl.isNullOrBlank()) {
                    val refreshed = currentUrl.substringBefore("?")
                    webView.loadUrl("$refreshed?v=${System.currentTimeMillis()}")
                } else {
                    activity.loadBestAppUrl(webView)
                }
            }
        }

        @JavascriptInterface
        fun openNotificationSettings() {
            activity.runOnUiThread {
                activity.startActivity(
                    Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                        putExtra(Settings.EXTRA_APP_PACKAGE, activity.packageName)
                    },
                )
            }
        }

        @JavascriptInterface
        fun openExactAlarmSettings() {
            activity.runOnUiThread {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    activity.startActivity(Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM))
                }
            }
        }

        @JavascriptInterface
        fun openBatterySettings() {
            activity.runOnUiThread {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    activity.startActivity(
                        Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                            data = Uri.parse("package:${activity.packageName}")
                        },
                    )
                }
            }
        }
    }

    private fun loadBestAppUrl(webView: WebView) {
        executor.execute {
            val selectedBaseUrl = backendCandidates().firstOrNull { isBackendReachable(it) }

            runOnUiThread {
                if (selectedBaseUrl != null) {
                    webView.loadUrl("$selectedBaseUrl/login?v=${System.currentTimeMillis()}")
                } else {
                    webView.loadDataWithBaseURL(
                        null,
                        """
                        <html><body style=\"font-family:sans-serif;padding:20px;line-height:1.5;\">
                        <h3>Backend not reachable</h3>
                        <p>This app syncs only with the live server so phone and PC stay identical.</p>
                        <p>Set a public backend URL with AndroidBridge.setBackendUrl('https://your-domain.com') and reopen the app.</p>
                        </body></html>
                        """.trimIndent(),
                        "text/html",
                        "UTF-8",
                        null,
                    )
                }
            }
        }
    }

    private fun backendCandidates(): List<String> {
        val saved = normalizeBaseUrl(appPrefs.getString("backend_base_url", null))
        val configured = normalizeBaseUrl(getString(R.string.remote_backend_url))

        return listOfNotNull(saved)
            .plus(devFallbackCandidates)
            .plus(listOfNotNull(configured))
            .distinct()
    }

    private fun normalizeBaseUrl(value: String?): String? {
        if (value == null) {
            return null
        }

        val trimmed = value.trim().trimEnd('/')
        if (trimmed.isEmpty()) {
            return null
        }

        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            return null
        }

        return trimmed
    }

    private fun isBackendReachable(baseUrl: String): Boolean {
        return try {
            val connection = URL("$baseUrl/login").openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 2500
            connection.readTimeout = 2500
            connection.instanceFollowRedirects = true
            val code = connection.responseCode
            connection.disconnect()
            code in 200..399
        } catch (_: Exception) {
            false
        }
    }
}
