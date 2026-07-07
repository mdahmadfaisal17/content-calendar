package com.huesixteen

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

object AlarmScheduler {

    private const val PREFS_NAME = "huesixteen_alarm_prefs"
    private const val KEY_SCHEDULES = "scheduled_content_json"
    private val formatter: DateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

    data class ScheduledAlarm(
        val id: String,
        val platformTitle: String,
        val topic: String,
        val dateTime: LocalDateTime,
        val timeLabel: String,
    )

    fun replaceSchedules(context: Context, scheduleJson: String) {
        cancelAll(context)
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_SCHEDULES, scheduleJson)
            .apply()
        scheduleAll(context)
    }

    fun scheduleAll(context: Context) {
        val alarms = readSchedules(context)
        alarms.forEach { scheduleAlarm(context, it) }
    }

    fun markDelivered(context: Context, alarmId: String) {
        val remaining = readSchedules(context).filterNot { it.id == alarmId }
        persistSchedules(context, remaining)
    }

    private fun persistSchedules(context: Context, schedules: List<ScheduledAlarm>) {
        val json = JSONArray()
        schedules.forEach { alarm ->
            json.put(
                JSONObject()
                    .put("id", alarm.id)
                    .put("platformTitle", alarm.platformTitle)
                    .put("topic", alarm.topic)
                    .put("dateTime", formatter.format(alarm.dateTime))
                    .put("timeLabel", alarm.timeLabel),
            )
        }

        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_SCHEDULES, json.toString())
            .apply()
    }

    private fun readSchedules(context: Context): List<ScheduledAlarm> {
        val raw = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(KEY_SCHEDULES, "[]") ?: "[]"

        val now = LocalDateTime.now()
        val array = JSONArray(raw)
        val alarms = mutableListOf<ScheduledAlarm>()

        for (index in 0 until array.length()) {
            val item = array.getJSONObject(index)
            val dateTime = LocalDateTime.parse(item.getString("dateTime"), formatter)
            if (!dateTime.isAfter(now)) {
                continue
            }

            alarms += ScheduledAlarm(
                id = item.getString("id"),
                platformTitle = item.getString("platformTitle"),
                topic = item.getString("topic"),
                dateTime = dateTime,
                timeLabel = item.optString("timeLabel", ""),
            )
        }

        return alarms.sortedBy { it.dateTime }
    }

    private fun cancelAll(context: Context) {
        val alarmManager = context.getSystemService(AlarmManager::class.java)
        readSchedules(context).forEach { alarm ->
            alarmManager.cancel(buildPendingIntent(context, alarm))
        }
    }

    private fun scheduleAlarm(context: Context, alarm: ScheduledAlarm) {
        val triggerAt = alarm.dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        val alarmManager = context.getSystemService(AlarmManager::class.java)
        val pendingIntent = buildPendingIntent(context, alarm)
        val showIntent = PendingIntent.getActivity(
            context,
            alarm.id.hashCode(),
            Intent(context, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            alarmManager.setAlarmClock(AlarmManager.AlarmClockInfo(triggerAt, showIntent), pendingIntent)
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
            return
        }

        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
    }

    private fun buildPendingIntent(context: Context, alarm: ScheduledAlarm): PendingIntent {
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            action = "com.huesixteen.ALARM_${alarm.id.uppercase()}"
            putExtra(AlarmReceiver.EXTRA_TITLE, alarm.platformTitle)
            putExtra(AlarmReceiver.EXTRA_RULE_ID, alarm.id)
            putExtra(AlarmReceiver.EXTRA_TOPIC, alarm.topic)
            putExtra(AlarmReceiver.EXTRA_TIME_LABEL, alarm.timeLabel)
        }

        return PendingIntent.getBroadcast(
            context,
            alarm.id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }
}
