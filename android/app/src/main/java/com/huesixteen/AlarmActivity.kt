package com.huesixteen

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class AlarmActivity : AppCompatActivity() {

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

        findViewById<Button>(R.id.dismissButton).setOnClickListener {
            stopService(Intent(this, AlarmService::class.java).apply {
                action = AlarmService.ACTION_STOP_ALARM
                putExtra(AlarmReceiver.EXTRA_RULE_ID, intent.getStringExtra(AlarmReceiver.EXTRA_RULE_ID) ?: "unknown")
            })
            finishAndRemoveTask()
        }
    }
}
