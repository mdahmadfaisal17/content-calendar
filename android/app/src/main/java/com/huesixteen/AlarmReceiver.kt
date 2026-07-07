package com.huesixteen

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.pm.PackageManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.Manifest
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

class AlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val title = intent.getStringExtra(EXTRA_TITLE) ?: "HueSixteen"
        val ruleId = intent.getStringExtra(EXTRA_RULE_ID) ?: "unknown"
        val topic = intent.getStringExtra(EXTRA_TOPIC) ?: "Scheduled content"
        val timeLabel = intent.getStringExtra(EXTRA_TIME_LABEL) ?: ""
        val message = if (timeLabel.isBlank()) "$title: $topic" else "$title: $topic at $timeLabel"

        val launchIntent = Intent(context, AlarmActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra(EXTRA_TITLE, title)
            putExtra(EXTRA_RULE_ID, ruleId)
            putExtra(EXTRA_TOPIC, topic)
            putExtra(EXTRA_TIME_LABEL, timeLabel)
        }

        try {
            context.startActivity(launchIntent)
        } catch (_: Exception) {
            // Alarm must continue via notification path even if activity launch is blocked.
        }

        AlarmNotification.show(context, title, message, ruleId)
        AlarmScheduler.markDelivered(context, ruleId)
    }

    companion object {
        const val EXTRA_TITLE = "extra_title"
        const val EXTRA_RULE_ID = "extra_rule_id"
        const val EXTRA_TOPIC = "extra_topic"
        const val EXTRA_TIME_LABEL = "extra_time_label"
    }
}

object AlarmNotification {

    private const val CHANNEL_ID = "huesixteen_alarm_channel"

    fun show(context: Context, title: String, message: String, ruleId: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        ensureChannel(context)

        val contentIntent = Intent(context, AlarmActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra(AlarmReceiver.EXTRA_TITLE, title)
            putExtra(AlarmReceiver.EXTRA_RULE_ID, ruleId)
        }

        val fullScreenIntent = android.app.PendingIntent.getActivity(
            context,
            ruleId.hashCode(),
            contentIntent,
            android.app.PendingIntent.FLAG_UPDATE_CURRENT or android.app.PendingIntent.FLAG_IMMUTABLE,
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(false)
            .setOngoing(true)
            .setFullScreenIntent(fullScreenIntent, true)
            .build()

        NotificationManagerCompat.from(context).notify(ruleId.hashCode(), notification)
    }

    private fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val channel = NotificationChannel(
            CHANNEL_ID,
            "HueSixteen Alarms",
            NotificationManager.IMPORTANCE_HIGH,
        ).apply {
            description = "Alarm notifications for scheduled content"
            enableVibration(true)
        }

        val manager = context.getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }
}
