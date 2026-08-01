package com.huesixteen

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

class AlarmService : Service() {

    private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP_ALARM) {
            stopAlarm()
            stopSelf()
            return START_NOT_STICKY
        }

        val title = intent?.getStringExtra(AlarmReceiver.EXTRA_TITLE) ?: "HueSixteen"
        val topic = intent?.getStringExtra(AlarmReceiver.EXTRA_TOPIC) ?: "Scheduled content"
        val timeLabel = intent?.getStringExtra(AlarmReceiver.EXTRA_TIME_LABEL) ?: ""
        val ruleId = intent?.getStringExtra(AlarmReceiver.EXTRA_RULE_ID) ?: "unknown"
        val message = if (timeLabel.isBlank()) "$title: $topic" else "$title: $topic at $timeLabel"

        startForeground(ruleId.hashCode(), buildNotification(title, topic, timeLabel, message, ruleId))
        startAlarmTone()
        startVibration()

        return START_NOT_STICKY
    }

    override fun onDestroy() {
        stopAlarm()
        super.onDestroy()
    }

    private fun buildNotification(title: String, topic: String, timeLabel: String, message: String, ruleId: String) =
        NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setAutoCancel(false)
            .setOngoing(true)
            .setFullScreenIntent(buildContentIntent(title, topic, timeLabel, ruleId), true)
            .addAction(
                android.R.drawable.ic_media_pause,
                "Dismiss",
                AlarmActionReceiver.stopIntent(this, ruleId),
            )
            .build()

    private fun buildContentIntent(title: String, topic: String, timeLabel: String, ruleId: String) =
        android.app.PendingIntent.getActivity(
            this,
            ruleId.hashCode(),
            Intent(this, AlarmActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                putExtra(AlarmReceiver.EXTRA_TITLE, title)
                putExtra(AlarmReceiver.EXTRA_RULE_ID, ruleId)
                putExtra(AlarmReceiver.EXTRA_TOPIC, topic)
                putExtra(AlarmReceiver.EXTRA_TIME_LABEL, timeLabel)
            },
            android.app.PendingIntent.FLAG_UPDATE_CURRENT or android.app.PendingIntent.FLAG_IMMUTABLE,
        )

    private fun startAlarmTone() {
        stopAlarmTone()

        val uri: Uri = android.provider.Settings.System.DEFAULT_ALARM_ALERT_URI
        mediaPlayer = MediaPlayer().apply {
            setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build(),
            )
            setDataSource(this@AlarmService, uri)
            isLooping = true
            prepare()
            start()
        }
    }

    private fun startVibration() {
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = getSystemService(VibratorManager::class.java)
            manager.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Vibrator::class.java)
        }

        vibrator?.let { vib ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vib.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 1200, 800), 0))
            } else {
                @Suppress("DEPRECATION")
                vib.vibrate(longArrayOf(0, 1200, 800), 0)
            }
        }
    }

    private fun stopAlarm() {
        stopAlarmTone()
        stopForeground(STOP_FOREGROUND_REMOVE)
    }

    private fun stopAlarmTone() {
        mediaPlayer?.run {
            try {
                stop()
            } catch (_: IllegalStateException) {
            }
            release()
        }
        mediaPlayer = null
        vibrator?.cancel()
    }

    companion object {
        const val ACTION_STOP_ALARM = "com.huesixteen.ACTION_STOP_ALARM"
        private const val CHANNEL_ID = "huesixteen_alarm_channel"

        fun start(context: Context, intent: Intent) {
            val serviceIntent = Intent(context, AlarmService::class.java).apply {
                putExtras(intent)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ContextCompat.startForegroundService(context, serviceIntent)
            } else {
                context.startService(serviceIntent)
            }
        }
    }
}

object AlarmActionReceiver {
    fun stopIntent(context: Context, ruleId: String) =
        android.app.PendingIntent.getService(
            context,
            ruleId.hashCode(),
            Intent(context, AlarmService::class.java).apply {
                action = AlarmService.ACTION_STOP_ALARM
                putExtra(AlarmReceiver.EXTRA_RULE_ID, ruleId)
            },
            android.app.PendingIntent.FLAG_UPDATE_CURRENT or android.app.PendingIntent.FLAG_IMMUTABLE,
        )
}
