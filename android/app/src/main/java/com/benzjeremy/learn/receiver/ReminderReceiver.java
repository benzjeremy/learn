package com.benzjeremy.learn.receiver;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import com.benzjeremy.learn.MainActivity;

public class ReminderReceiver extends BroadcastReceiver {
    public static final String CHANNEL_ID = "learn_daily_reminder";
    public static final int NOTIFICATION_ID = 2026;

    @Override
    public void onReceive(Context context, Intent intent) {
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Tägliche Lern-Erinnerung",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("Erinnert an deine täglichen Programmier-Lektionen und Prüfungen");
            nm.createNotificationChannel(channel);
        }

        Intent openIntent = new Intent(context, MainActivity.class);
        openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        android.app.Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new android.app.Notification.Builder(context, CHANNEL_ID);
        } else {
            builder = new android.app.Notification.Builder(context);
        }

        builder.setContentTitle("Zeit für deine tägliche Code-Lektion! 🚀")
                .setContentText("Festige dein Wissen in Go, Cybersecurity & SQL. Jetzt weitermachen!")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        nm.notify(NOTIFICATION_ID, builder.build());
    }
}
