package com.benzjeremy.learn;

import android.widget.Button;
import android.widget.TextView;
import com.benzjeremy.learn.model.Question;

public class QuestionOptionTag {
    public final Question question;
    public final int optionIndex;
    public final Button[] buttons;
    public final TextView feedbackView;

    public QuestionOptionTag(Question question, int optionIndex, Button[] buttons, TextView feedbackView) {
        this.question = question;
        this.optionIndex = optionIndex;
        this.buttons = buttons;
        this.feedbackView = feedbackView;
    }
}
