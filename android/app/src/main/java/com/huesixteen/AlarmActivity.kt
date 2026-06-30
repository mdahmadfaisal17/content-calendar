package com.huesixteen

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class AlarmActivity : AppCompatActivity() {

    private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON)
        }

        setContentView(R.layout.activity_alarm)

        val title = intent.getStringExtra(AlarmReceiver.EXTRA_TITLE) ?: "HueSixteen"
        val topic = intent.getStringExtra(AlarmReceiver.EXTRA_TOPIC) ?: "Scheduled content"
        val timeLabel = intent.getStringExtra(AlarmReceiver.EXTRA_TIME_LABEL) ?: ""
        findViewById<TextView>(R.id.alarmTitle).text = title
        findViewById<TextView>(R.id.alarmSubtitle).text = if (timeLabel.isBlank()) topic else "$topic • $timeLabel"

        startAlarmTone(this)
        startVibration(this)

        findViewById<Button>(R.id.dismissButton).setOnClickListener {
            stopAlarmTone()
            finishAndRemoveTask()
        }
    }

    override fun onDestroy() {
        stopAlarmTone()
        super.onDestroy()
    }

    private fun startAlarmTone(context: Context) {
        stopAlarmTone()

        val uri: Uri = android.provider.Settings.System.DEFAULT_ALARM_ALERT_URI
        mediaPlayer = MediaPlayer().apply {
            setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build(),
            )
            setDataSource(context, uri)
            isLooping = true
            prepare()
            start()
        }
    }

    private fun startVibration(context: Context) {
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = context.getSystemService(VibratorManager::class.java)
            manager.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Vibrator::class.java)
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
}
