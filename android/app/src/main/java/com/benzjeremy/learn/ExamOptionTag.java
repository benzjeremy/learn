package com.benzjeremy.learn;

import android.widget.Button;

public class ExamOptionTag {
    public final int questionIndex;
    public final int optionIndex;
    public final Button[] buttons;

    public ExamOptionTag(int questionIndex, int optionIndex, Button[] buttons) {
        this.questionIndex = questionIndex;
        this.optionIndex = optionIndex;
        this.buttons = buttons;
    }
}
