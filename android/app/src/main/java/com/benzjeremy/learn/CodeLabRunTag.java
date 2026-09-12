package com.benzjeremy.learn;

import android.widget.EditText;
import android.widget.TextView;
import com.benzjeremy.learn.model.CodeChallenge;

public class CodeLabRunTag {
    public final EditText editor;
    public final TextView console;
    public final CodeChallenge challenge;

    public CodeLabRunTag(EditText editor, TextView console, CodeChallenge challenge) {
        this.editor = editor;
        this.console = console;
        this.challenge = challenge;
    }
}
