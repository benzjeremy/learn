package com.benzjeremy.learn;

import android.os.CountDownTimer;

public class ExamCountdownTimer extends CountDownTimer {
    private final MainActivity activity;

    public ExamCountdownTimer(MainActivity activity, long millisInFuture, long countDownInterval) {
        super(millisInFuture, countDownInterval);
        this.activity = activity;
    }

    @Override
    public void onTick(long millisUntilFinished) {
        if (activity != null) {
            activity.updateExamTimer(millisUntilFinished);
        }
    }

    @Override
    public void onFinish() {
        if (activity != null) {
            activity.onExamTimerFinish();
        }
    }
}
