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
        try {
            AlarmService.start(context, intent)
        } catch (_: Exception) {
            AlarmNotification.show(
                context,
                intent.getStringExtra(EXTRA_TITLE) ?: "HueSixteen",
                buildMessage(intent),
                intent.getStringExtra(EXTRA_RULE_ID) ?: "unknown",
            )
        }

        AlarmScheduler.markDelivered(context, intent.getStringExtra(EXTRA_RULE_ID) ?: "unknown")
    }

    private fun buildMessage(intent: Intent): String {
        val title = intent.getStringExtra(EXTRA_TITLE) ?: "HueSixteen"
        val topic = intent.getStringExtra(EXTRA_TOPIC) ?: "Scheduled content"
        val timeLabel = intent.getStringExtra(EXTRA_TIME_LABEL) ?: ""
        return if (timeLabel.isBlank()) "$title: $topic" else "$title: $topic at $timeLabel"
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
