package com.benzjeremy.learn;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.AlertDialog;
import android.app.PendingIntent;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import com.benzjeremy.learn.data.CodeLabRepository;
import com.benzjeremy.learn.data.CourseRepository;
import com.benzjeremy.learn.data.ExamRepository;
import com.benzjeremy.learn.model.CodeChallenge;
import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;
import com.benzjeremy.learn.receiver.ReminderReceiver;

import java.util.Calendar;
import java.util.List;
import java.util.Locale;

public class MainActivity extends Activity implements View.OnClickListener, TimePickerDialog.OnTimeSetListener {
    private static final String PREFS_NAME = "learn_app_prefs";
    private static final String PREF_REMINDER_HOUR = "reminder_hour";
    private static final String PREF_REMINDER_MINUTE = "reminder_minute";
    private static final String PREF_REMINDER_ENABLED = "reminder_enabled";

    // Action Tags
    private static final String TAG_NAV_COURSES = "nav_0";
    private static final String TAG_NAV_EXAM = "nav_1";
    private static final String TAG_NAV_CODELAB = "nav_2";
    private static final String TAG_NAV_SETTINGS = "nav_3";

    private LinearLayout rootContainer;
    private LinearLayout contentContainer;
    private SharedPreferences prefs;

    // Navigation state
    private int currentTab = 0; // 0: Courses, 1: Exam, 2: CodeLab, 3: Settings
    private Button tabCoursesBtn, tabExamBtn, tabLabBtn, tabSettingsBtn;

    // Exam state
    private ExamCountdownTimer examTimer;
    private long examTimeLeftMillis = 90 * 60 * 1000; // 90 minutes
    private boolean isExamRunning = false;
    private int examCurrentQuestionIndex = 0;
    private int[] examUserAnswers;
    private TextView examTimerView;
    private Button examStartPauseBtn;
    private LinearLayout examQuestionBox;

    // Settings state
    private TextView reminderTimeLabel;
    private Button reminderToggleBtn;

    // CodeLab state
    private EditText currentEditor;
    private TextView currentConsole;
    private CodeChallenge currentChallenge;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);

        // Native Root Container
        rootContainer = new LinearLayout(this);
        rootContainer.setOrientation(LinearLayout.VERTICAL);
        rootContainer.setBackgroundColor(Color.parseColor("#080B11"));
        rootContainer.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // 1. Header
        rootContainer.addView(createHeaderView());

        // 2. Dynamic Scrollable Content Area
        ScrollView scrollView = new ScrollView(this);
        scrollView.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f));
        scrollView.setFillViewport(true);

        contentContainer = new LinearLayout(this);
        contentContainer.setOrientation(LinearLayout.VERTICAL);
        contentContainer.setPadding(dp(16), dp(12), dp(16), dp(24));
        scrollView.addView(contentContainer);

        rootContainer.addView(scrollView);

        // 3. Native Bottom Navigation Bar
        rootContainer.addView(createBottomNavBar());

        setContentView(rootContainer);

        // Render initial tab (Courses)
        switchTab(0);
    }

    private View createHeaderView() {
        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setBackgroundColor(Color.parseColor("#0C101A"));
        header.setPadding(dp(16), dp(16), dp(16), dp(16));
        header.setGravity(Gravity.CENTER_VERTICAL);

        LinearLayout titleBlock = new LinearLayout(this);
        titleBlock.setOrientation(LinearLayout.VERTICAL);
        titleBlock.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f));

        TextView title = new TextView(this);
        title.setText("learn");
        title.setTextColor(Color.parseColor("#F8FAFC"));
        title.setTextSize(22);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        titleBlock.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("Open-Source Berufsausbildung & Prüfungssimulation");
        subtitle.setTextColor(Color.parseColor("#64748B"));
        subtitle.setTextSize(11);
        titleBlock.addView(subtitle);

        header.addView(titleBlock);

        // Native Version Badge
        TextView badge = new TextView(this);
        badge.setText("v1.0 Native");
        badge.setTextColor(Color.parseColor("#38BDF8"));
        badge.setTextSize(11);
        badge.setTypeface(Typeface.DEFAULT_BOLD);
        badge.setPadding(dp(8), dp(4), dp(8), dp(4));
        badge.setBackgroundResource(R.drawable.chip_bg);
        header.addView(badge);

        return header;
    }

    private View createBottomNavBar() {
        LinearLayout nav = new LinearLayout(this);
        nav.setOrientation(LinearLayout.HORIZONTAL);
        nav.setBackgroundResource(R.drawable.nav_bg);
        nav.setPadding(dp(4), dp(8), dp(4), dp(8));

        tabCoursesBtn = createNavButton("📚 Lernen", TAG_NAV_COURSES);
        tabExamBtn = createNavButton("⏱️ Prüfung", TAG_NAV_EXAM);
        tabLabBtn = createNavButton("💻 Labor", TAG_NAV_CODELAB);
        tabSettingsBtn = createNavButton("⚙️ Einstellungen", TAG_NAV_SETTINGS);

        nav.addView(tabCoursesBtn);
        nav.addView(tabExamBtn);
        nav.addView(tabLabBtn);
        nav.addView(tabSettingsBtn);

        return nav;
    }

    private Button createNavButton(String label, String tag) {
        Button btn = new Button(this);
        btn.setText(label);
        btn.setTextSize(11);
        btn.setAllCaps(false);
        btn.setTag(tag);
        btn.setBackgroundColor(Color.TRANSPARENT);
        btn.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f));
        btn.setOnClickListener(this);
        return btn;
    }

    public void switchTab(int tabIndex) {
        currentTab = tabIndex;
        updateNavButtonStyles();
        contentContainer.removeAllViews();

        switch (tabIndex) {
            case 0:
                renderCoursesView();
                break;
            case 1:
                renderExamView();
                break;
            case 2:
                renderCodeLabView();
                break;
            case 3:
                renderSettingsView();
                break;
        }
    }

    private void updateNavButtonStyles() {
        tabCoursesBtn.setTextColor(currentTab == 0 ? Color.parseColor("#38BDF8") : Color.parseColor("#94A3B8"));
        tabExamBtn.setTextColor(currentTab == 1 ? Color.parseColor("#38BDF8") : Color.parseColor("#94A3B8"));
        tabLabBtn.setTextColor(currentTab == 2 ? Color.parseColor("#38BDF8") : Color.parseColor("#94A3B8"));
        tabSettingsBtn.setTextColor(currentTab == 3 ? Color.parseColor("#38BDF8") : Color.parseColor("#94A3B8"));
    }

    // ==========================================
    // TAB 1: COURSES & LESSONS (NATIVE)
    // ==========================================
    private void renderCoursesView() {
        TextView heading = new TextView(this);
        heading.setText("Lernpfade & Curricula");
        heading.setTextColor(Color.parseColor("#F8FAFC"));
        heading.setTextSize(20);
        heading.setTypeface(Typeface.DEFAULT_BOLD);
        heading.setPadding(0, 0, 0, dp(12));
        contentContainer.addView(heading);

        List<Course> courses = CourseRepository.getAllCourses();
        for (int i = 0; i < courses.size(); i++) {
            Course course = courses.get(i);
            LinearLayout card = new LinearLayout(this);
            card.setOrientation(LinearLayout.VERTICAL);
            card.setBackgroundResource(R.drawable.card_bg);
            card.setPadding(dp(16), dp(16), dp(16), dp(16));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            lp.setMargins(0, 0, 0, dp(14));
            card.setLayoutParams(lp);

            LinearLayout topRow = new LinearLayout(this);
            topRow.setOrientation(LinearLayout.HORIZONTAL);
            topRow.setGravity(Gravity.CENTER_VERTICAL);

            TextView icon = new TextView(this);
            icon.setText(course.getIcon());
            icon.setTextSize(24);
            icon.setPadding(0, 0, dp(12), 0);
            topRow.addView(icon);

            LinearLayout titleBlock = new LinearLayout(this);
            titleBlock.setOrientation(LinearLayout.VERTICAL);
            titleBlock.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f));

            TextView cName = new TextView(this);
            cName.setText(course.getName());
            cName.setTextColor(Color.parseColor("#F8FAFC"));
            cName.setTextSize(16);
            cName.setTypeface(Typeface.DEFAULT_BOLD);
            titleBlock.addView(cName);

            TextView badge = new TextView(this);
            badge.setText(course.getBadge());
            badge.setTextColor(Color.parseColor("#38BDF8"));
            badge.setTextSize(11);
            titleBlock.addView(badge);

            topRow.addView(titleBlock);
            card.addView(topRow);

            TextView summary = new TextView(this);
            summary.setText(course.getSummary());
            summary.setTextColor(Color.parseColor("#94A3B8"));
            summary.setTextSize(13);
            summary.setPadding(0, dp(10), 0, dp(14));
            card.addView(summary);

            Button startBtn = new Button(this);
            startBtn.setText("Lektionen öffnen (" + course.getLessons().size() + ")");
            startBtn.setTextColor(Color.WHITE);
            startBtn.setTextSize(13);
            startBtn.setTag("open_course_" + course.getId());
            startBtn.setBackgroundResource(R.drawable.btn_primary);
            startBtn.setOnClickListener(this);
            card.addView(startBtn);

            contentContainer.addView(card);
        }
    }

    private void renderCourseDetailView(Course course) {
        contentContainer.removeAllViews();

        Button backBtn = new Button(this);
        backBtn.setText("← Zurück zu allen Lernpfaden");
        backBtn.setTextColor(Color.parseColor("#38BDF8"));
        backBtn.setTag("back_to_courses");
        backBtn.setBackgroundColor(Color.TRANSPARENT);
        backBtn.setOnClickListener(this);
        contentContainer.addView(backBtn);

        TextView courseTitle = new TextView(this);
        courseTitle.setText(course.getIcon() + " " + course.getName());
        courseTitle.setTextColor(Color.parseColor("#F8FAFC"));
        courseTitle.setTextSize(22);
        courseTitle.setTypeface(Typeface.DEFAULT_BOLD);
        courseTitle.setPadding(0, dp(8), 0, dp(4));
        contentContainer.addView(courseTitle);

        TextView courseSummary = new TextView(this);
        courseSummary.setText(course.getSummary());
        courseSummary.setTextColor(Color.parseColor("#94A3B8"));
        courseSummary.setTextSize(13);
        courseSummary.setPadding(0, 0, 0, dp(16));
        contentContainer.addView(courseSummary);

        for (int i = 0; i < course.getLessons().size(); i++) {
            Lesson lesson = course.getLessons().get(i);
            LinearLayout lessonCard = new LinearLayout(this);
            lessonCard.setOrientation(LinearLayout.VERTICAL);
            lessonCard.setBackgroundResource(R.drawable.card_bg_accent);
            lessonCard.setPadding(dp(16), dp(16), dp(16), dp(16));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            lp.setMargins(0, 0, 0, dp(16));
            lessonCard.setLayoutParams(lp);

            TextView lTitle = new TextView(this);
            lTitle.setText("📖 " + lesson.getTitle());
            lTitle.setTextColor(Color.parseColor("#F8FAFC"));
            lTitle.setTextSize(17);
            lTitle.setTypeface(Typeface.DEFAULT_BOLD);
            lessonCard.addView(lTitle);

            TextView motivationHeader = new TextView(this);
            motivationHeader.setText("EINFÜHRUNG & INTUITION");
            motivationHeader.setTextColor(Color.parseColor("#38BDF8"));
            motivationHeader.setTextSize(11);
            motivationHeader.setTypeface(Typeface.DEFAULT_BOLD);
            motivationHeader.setPadding(0, dp(12), 0, dp(2));
            lessonCard.addView(motivationHeader);

            TextView motivationText = new TextView(this);
            motivationText.setText(lesson.getMotivation());
            motivationText.setTextColor(Color.parseColor("#CBD5E1"));
            motivationText.setTextSize(13);
            motivationText.setLineSpacing(dp(2), 1.1f);
            lessonCard.addView(motivationText);

            TextView conceptHeader = new TextView(this);
            conceptHeader.setText("KERNKONZEPT & FUNKTIONSWEISE");
            conceptHeader.setTextColor(Color.parseColor("#A855F7"));
            conceptHeader.setTextSize(11);
            conceptHeader.setTypeface(Typeface.DEFAULT_BOLD);
            conceptHeader.setPadding(0, dp(12), 0, dp(2));
            lessonCard.addView(conceptHeader);

            TextView conceptText = new TextView(this);
            conceptText.setText(lesson.getCoreConcept());
            conceptText.setTextColor(Color.parseColor("#CBD5E1"));
            conceptText.setTextSize(13);
            conceptText.setLineSpacing(dp(2), 1.1f);
            lessonCard.addView(conceptText);

            // Code Snippet Box
            if (lesson.getCodeSnippet() != null && !lesson.getCodeSnippet().isEmpty()) {
                TextView codeHeader = new TextView(this);
                codeHeader.setText("BEISPIEL-CODE:");
                codeHeader.setTextColor(Color.parseColor("#64748B"));
                codeHeader.setTextSize(11);
                codeHeader.setPadding(0, dp(12), 0, dp(4));
                lessonCard.addView(codeHeader);

                TextView codeBox = new TextView(this);
                codeBox.setText(lesson.getCodeSnippet());
                codeBox.setTextColor(Color.parseColor("#38BDF8"));
                codeBox.setTextSize(12);
                codeBox.setTypeface(Typeface.MONOSPACE);
                codeBox.setBackgroundResource(R.drawable.code_editor_bg);
                codeBox.setPadding(dp(12), dp(12), dp(12), dp(12));
                lessonCard.addView(codeBox);
            }

            // Interactive Questions with Detailed Explanations
            if (lesson.getQuestions() != null && !lesson.getQuestions().isEmpty()) {
                for (int qIdx = 0; qIdx < lesson.getQuestions().size(); qIdx++) {
                    lessonCard.addView(createInteractiveQuestionView(lesson.getQuestions().get(qIdx)));
                }
            }

            contentContainer.addView(lessonCard);
        }
    }

    private View createInteractiveQuestionView(Question q) {
        LinearLayout qCard = new LinearLayout(this);
        qCard.setOrientation(LinearLayout.VERTICAL);
        qCard.setBackgroundResource(R.drawable.card_bg);
        qCard.setPadding(dp(14), dp(14), dp(14), dp(14));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.setMargins(0, dp(16), 0, dp(8));
        qCard.setLayoutParams(lp);

        TextView contextBadge = new TextView(this);
        contextBadge.setText("🎯 PRÜFUNGSRELEVANTE FRAGE (" + q.getContextInfo() + ")");
        contextBadge.setTextColor(Color.parseColor("#F59E0B"));
        contextBadge.setTextSize(10);
        contextBadge.setTypeface(Typeface.DEFAULT_BOLD);
        qCard.addView(contextBadge);

        TextView prompt = new TextView(this);
        prompt.setText(q.getPrompt());
        prompt.setTextColor(Color.parseColor("#F8FAFC"));
        prompt.setTextSize(14);
        prompt.setTypeface(Typeface.DEFAULT_BOLD);
        prompt.setPadding(0, dp(6), 0, dp(12));
        qCard.addView(prompt);

        LinearLayout optionsGroup = new LinearLayout(this);
        optionsGroup.setOrientation(LinearLayout.VERTICAL);

        TextView feedbackText = new TextView(this);
        feedbackText.setTextSize(13);
        feedbackText.setPadding(dp(12), dp(10), dp(12), dp(10));
        feedbackText.setVisibility(View.GONE);

        Button[] optionButtons = new Button[q.getOptions().length];
        for (int i = 0; i < q.getOptions().length; i++) {
            Button optBtn = new Button(this);
            optBtn.setText((char)('A' + i) + ") " + q.getOptions()[i]);
            optBtn.setTextColor(Color.parseColor("#CBD5E1"));
            optBtn.setTextSize(12);
            optBtn.setAllCaps(false);
            optBtn.setBackgroundResource(R.drawable.btn_secondary);
            optBtn.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
            optBtn.setPadding(dp(12), dp(10), dp(12), dp(10));
            LinearLayout.LayoutParams optLp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            optLp.setMargins(0, 0, 0, dp(8));
            optBtn.setLayoutParams(optLp);

            optBtn.setTag(new QuestionOptionTag(q, i, optionButtons, feedbackText));
            optBtn.setOnClickListener(this);

            optionButtons[i] = optBtn;
            optionsGroup.addView(optBtn);
        }

        qCard.addView(optionsGroup);
        qCard.addView(feedbackText);

        return qCard;
    }

    // ==========================================
    // TAB 2: PRÜFUNG (90-MIN EXAM SIMULATION)
    // ==========================================
    private void renderExamView() {
        List<Question> examQuestions = ExamRepository.getExamQuestions();
        if (examUserAnswers == null || examUserAnswers.length != examQuestions.size()) {
            examUserAnswers = new int[examQuestions.size()];
            for (int i = 0; i < examUserAnswers.length; i++) examUserAnswers[i] = -1;
        }

        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(R.drawable.card_bg_accent);
        card.setPadding(dp(16), dp(16), dp(16), dp(16));
        contentContainer.addView(card);

        TextView title = new TextView(this);
        title.setText("⏱️ Abschluss-Prüfung Simulation");
        title.setTextColor(Color.parseColor("#F8FAFC"));
        title.setTextSize(20);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        card.addView(title);

        TextView desc = new TextView(this);
        desc.setText("Simuliere eine vollwertige 90-minütige Prüfung über alle Fächer (Go, Cybersecurity, SQL, Web-Architektur). Zeitlimit: 90 Minuten.");
        desc.setTextColor(Color.parseColor("#94A3B8"));
        desc.setTextSize(13);
        desc.setPadding(0, dp(4), 0, dp(14));
        card.addView(desc);

        // Timer Bar
        examTimerView = new TextView(this);
        examTimerView.setText(formatTimer(examTimeLeftMillis));
        examTimerView.setTextColor(Color.parseColor("#38BDF8"));
        examTimerView.setTextSize(28);
        examTimerView.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
        examTimerView.setGravity(Gravity.CENTER);
        examTimerView.setPadding(0, dp(8), 0, dp(14));
        card.addView(examTimerView);

        // Progress Bar
        ProgressBar progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(examQuestions.size());
        progressBar.setProgress(examCurrentQuestionIndex + 1);
        card.addView(progressBar);

        // Question Container
        examQuestionBox = new LinearLayout(this);
        examQuestionBox.setOrientation(LinearLayout.VERTICAL);
        examQuestionBox.setPadding(0, dp(14), 0, dp(14));
        card.addView(examQuestionBox);

        updateExamQuestionUI(examQuestions, examCurrentQuestionIndex);

        // Action Buttons Row
        LinearLayout btnRow = new LinearLayout(this);
        btnRow.setOrientation(LinearLayout.HORIZONTAL);

        examStartPauseBtn = new Button(this);
        examStartPauseBtn.setText(isExamRunning ? "⏸️ Pause" : "▶️ Prüfung starten");
        examStartPauseBtn.setTextColor(Color.WHITE);
        examStartPauseBtn.setTag("exam_start_pause");
        examStartPauseBtn.setBackgroundResource(isExamRunning ? R.drawable.btn_secondary : R.drawable.btn_primary);
        examStartPauseBtn.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f));
        examStartPauseBtn.setOnClickListener(this);
        btnRow.addView(examStartPauseBtn);

        Button submitBtn = new Button(this);
        submitBtn.setText("🏁 Prüfung abgeben");
        submitBtn.setTextColor(Color.WHITE);
        submitBtn.setTag("exam_submit");
        submitBtn.setBackgroundResource(R.drawable.btn_accent);
        LinearLayout.LayoutParams subLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        subLp.setMargins(dp(8), 0, 0, 0);
        submitBtn.setLayoutParams(subLp);
        submitBtn.setOnClickListener(this);
        btnRow.addView(submitBtn);

        card.addView(btnRow);
    }

    private void updateExamQuestionUI(List<Question> questions, int index) {
        if (examQuestionBox == null) return;
        examQuestionBox.removeAllViews();
        Question q = questions.get(index);

        TextView qNum = new TextView(this);
        qNum.setText("Frage " + (index + 1) + " von " + questions.size() + " (" + q.getContextInfo() + ")");
        qNum.setTextColor(Color.parseColor("#38BDF8"));
        qNum.setTextSize(12);
        qNum.setTypeface(Typeface.DEFAULT_BOLD);
        examQuestionBox.addView(qNum);

        TextView prompt = new TextView(this);
        prompt.setText(q.getPrompt());
        prompt.setTextColor(Color.parseColor("#F8FAFC"));
        prompt.setTextSize(15);
        prompt.setTypeface(Typeface.DEFAULT_BOLD);
        prompt.setPadding(0, dp(6), 0, dp(12));
        examQuestionBox.addView(prompt);

        Button[] buttons = new Button[q.getOptions().length];
        for (int i = 0; i < q.getOptions().length; i++) {
            Button b = new Button(this);
            b.setText((char)('A' + i) + ") " + q.getOptions()[i]);
            b.setAllCaps(false);
            b.setTextSize(12);
            b.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
            b.setPadding(dp(12), dp(10), dp(12), dp(10));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            lp.setMargins(0, 0, 0, dp(8));
            b.setLayoutParams(lp);

            if (examUserAnswers[index] == i) {
                b.setBackgroundResource(R.drawable.btn_primary);
                b.setTextColor(Color.WHITE);
            } else {
                b.setBackgroundResource(R.drawable.btn_secondary);
                b.setTextColor(Color.parseColor("#CBD5E1"));
            }

            b.setTag(new ExamOptionTag(index, i, buttons));
            b.setOnClickListener(this);

            buttons[i] = b;
            examQuestionBox.addView(b);
        }

        // Navigation Prev / Next
        LinearLayout navRow = new LinearLayout(this);
        navRow.setOrientation(LinearLayout.HORIZONTAL);
        navRow.setPadding(0, dp(8), 0, 0);

        if (index > 0) {
            Button prevBtn = new Button(this);
            prevBtn.setText("← Vorherige");
            prevBtn.setTextColor(Color.parseColor("#94A3B8"));
            prevBtn.setTag("exam_prev");
            prevBtn.setBackgroundResource(R.drawable.btn_secondary);
            prevBtn.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f));
            prevBtn.setOnClickListener(this);
            navRow.addView(prevBtn);
        }

        if (index < questions.size() - 1) {
            Button nextBtn = new Button(this);
            nextBtn.setText("Nächste Frage →");
            nextBtn.setTextColor(Color.WHITE);
            nextBtn.setTag("exam_next");
            nextBtn.setBackgroundResource(R.drawable.btn_primary);
            LinearLayout.LayoutParams nLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
            if (index > 0) nLp.setMargins(dp(8), 0, 0, 0);
            nextBtn.setLayoutParams(nLp);
            nextBtn.setOnClickListener(this);
            navRow.addView(nextBtn);
        }

        examQuestionBox.addView(navRow);
    }

    private void toggleExamRunning() {
        if (isExamRunning) {
            pauseExamTimer();
            if (examStartPauseBtn != null) {
                examStartPauseBtn.setText("▶️ Fortsetzen");
                examStartPauseBtn.setBackgroundResource(R.drawable.btn_primary);
            }
        } else {
            isExamRunning = true;
            startExamTimer();
            if (examStartPauseBtn != null) {
                examStartPauseBtn.setText("⏸️ Pause");
                examStartPauseBtn.setBackgroundResource(R.drawable.btn_secondary);
            }
        }
    }

    private void startExamTimer() {
        pauseExamTimer();
        examTimer = new ExamCountdownTimer(this, examTimeLeftMillis, 1000);
        examTimer.start();
        isExamRunning = true;
    }

    public void updateExamTimer(long millisLeft) {
        examTimeLeftMillis = millisLeft;
        if (examTimerView != null) {
            examTimerView.setText(formatTimer(millisLeft));
        }
    }

    public void onExamTimerFinish() {
        isExamRunning = false;
        if (examTimerView != null) {
            examTimerView.setText("00:00 - ZEIT ABGELAUFEN");
        }
        finishExamAndShowGrading(ExamRepository.getExamQuestions());
    }

    private void pauseExamTimer() {
        if (examTimer != null) {
            examTimer.cancel();
            examTimer = null;
        }
        isExamRunning = false;
    }

    private String formatTimer(long millis) {
        long minutes = (millis / 1000) / 60;
        long seconds = (millis / 1000) % 60;
        return String.format(Locale.getDefault(), "%02d:%02d", minutes, seconds);
    }

    private void finishExamAndShowGrading(List<Question> questions) {
        pauseExamTimer();
        int correctCount = 0;
        for (int i = 0; i < questions.size(); i++) {
            if (examUserAnswers[i] == questions.get(i).getCorrectIndex()) {
                correctCount++;
            }
        }
        int percentage = (int) (((double) correctCount / questions.size()) * 100);

        String note;
        String colorHex;
        if (percentage >= 92) {
            note = "Note 1 · Sehr Gut (Hervorragende Leistung)";
            colorHex = "#10B981";
        } else if (percentage >= 81) {
            note = "Note 2 · Gut (Voll den Anforderungen entsprochen)";
            colorHex = "#38BDF8";
        } else if (percentage >= 67) {
            note = "Note 3 · Befriedigend (Solide Kenntnisse)";
            colorHex = "#F59E0B";
        } else if (percentage >= 50) {
            note = "Note 4 · Ausreichend (Bestanden mit Mängeln)";
            colorHex = "#FB923C";
        } else {
            note = "Nicht bestanden · Mangelhaft (Unter 50%)";
            colorHex = "#F43F5E";
        }

        contentContainer.removeAllViews();

        LinearLayout resultCard = new LinearLayout(this);
        resultCard.setOrientation(LinearLayout.VERTICAL);
        resultCard.setBackgroundResource(R.drawable.card_bg_accent);
        resultCard.setPadding(dp(18), dp(20), dp(18), dp(20));
        contentContainer.addView(resultCard);

        TextView resTitle = new TextView(this);
        resTitle.setText("🏆 Prüfungs-Ergebnis");
        resTitle.setTextColor(Color.parseColor("#F8FAFC"));
        resTitle.setTextSize(22);
        resTitle.setTypeface(Typeface.DEFAULT_BOLD);
        resultCard.addView(resTitle);

        TextView scoreView = new TextView(this);
        scoreView.setText(correctCount + " von " + questions.size() + " Punkten (" + percentage + "%)");
        scoreView.setTextColor(Color.parseColor(colorHex));
        scoreView.setTextSize(26);
        scoreView.setTypeface(Typeface.DEFAULT_BOLD);
        scoreView.setPadding(0, dp(10), 0, dp(4));
        resultCard.addView(scoreView);

        TextView noteView = new TextView(this);
        noteView.setText(note);
        noteView.setTextColor(Color.parseColor("#CBD5E1"));
        noteView.setTextSize(14);
        noteView.setPadding(0, 0, 0, dp(16));
        resultCard.addView(noteView);

        // Question breakdown
        for (int i = 0; i < questions.size(); i++) {
            Question q = questions.get(i);
            int userChoice = examUserAnswers[i];
            boolean right = (userChoice == q.getCorrectIndex());

            LinearLayout qReview = new LinearLayout(this);
            qReview.setOrientation(LinearLayout.VERTICAL);
            qReview.setBackgroundResource(R.drawable.card_bg);
            qReview.setPadding(dp(12), dp(10), dp(12), dp(10));
            LinearLayout.LayoutParams rLp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            rLp.setMargins(0, 0, 0, dp(10));
            qReview.setLayoutParams(rLp);

            TextView qH = new TextView(this);
            qH.setText((right ? "✅ " : "❌ ") + "Frage " + (i + 1) + ": " + q.getPrompt());
            qH.setTextColor(Color.parseColor(right ? "#10B981" : "#F43F5E"));
            qH.setTextSize(13);
            qH.setTypeface(Typeface.DEFAULT_BOLD);
            qReview.addView(qH);

            TextView exp = new TextView(this);
            exp.setText("Erklärung: " + q.getExplanationFor(q.getCorrectIndex()));
            exp.setTextColor(Color.parseColor("#94A3B8"));
            exp.setTextSize(12);
            exp.setPadding(0, dp(4), 0, 0);
            qReview.addView(exp);

            resultCard.addView(qReview);
        }

        Button restartBtn = new Button(this);
        restartBtn.setText("🔄 Prüfung wiederholen");
        restartBtn.setTextColor(Color.WHITE);
        restartBtn.setTag("exam_restart");
        restartBtn.setBackgroundResource(R.drawable.btn_primary);
        restartBtn.setOnClickListener(this);
        resultCard.addView(restartBtn);
    }

    // ==========================================
    // TAB 3: CODE-LABOR (INTERACTIVE LAB)
    // ==========================================
    private void renderCodeLabView() {
        TextView heading = new TextView(this);
        heading.setText("💻 Code-Labor & Compiler-Simulator");
        heading.setTextColor(Color.parseColor("#F8FAFC"));
        heading.setTextSize(20);
        heading.setTypeface(Typeface.DEFAULT_BOLD);
        contentContainer.addView(heading);

        TextView sub = new TextView(this);
        sub.setText("Praxis-Aufgaben zur Fehleranalyse, Concurrency und Clean Code. Passe den Quellcode an und führe die statische Syntaxprüfung aus.");
        sub.setTextColor(Color.parseColor("#94A3B8"));
        sub.setTextSize(13);
        sub.setPadding(0, dp(4), 0, dp(14));
        contentContainer.addView(sub);

        List<CodeChallenge> challenges = CodeLabRepository.getChallenges();
        for (int i = 0; i < challenges.size(); i++) {
            CodeChallenge c = challenges.get(i);
            LinearLayout cCard = new LinearLayout(this);
            cCard.setOrientation(LinearLayout.VERTICAL);
            cCard.setBackgroundResource(R.drawable.card_bg);
            cCard.setPadding(dp(16), dp(16), dp(16), dp(16));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            lp.setMargins(0, 0, 0, dp(16));
            cCard.setLayoutParams(lp);

            TextView cLang = new TextView(this);
            cLang.setText("⚡ " + c.getLanguage() + " · " + c.getTitle());
            cLang.setTextColor(Color.parseColor("#38BDF8"));
            cLang.setTextSize(12);
            cLang.setTypeface(Typeface.DEFAULT_BOLD);
            cCard.addView(cLang);

            TextView cTask = new TextView(this);
            cTask.setText(c.getTaskDescription());
            cTask.setTextColor(Color.parseColor("#CBD5E1"));
            cTask.setTextSize(13);
            cTask.setPadding(0, dp(6), 0, dp(10));
            cCard.addView(cTask);

            // Code Editor
            EditText editor = new EditText(this);
            editor.setText(c.getInitialCode());
            editor.setTextColor(Color.parseColor("#F8FAFC"));
            editor.setTypeface(Typeface.MONOSPACE);
            editor.setTextSize(12);
            editor.setBackgroundResource(R.drawable.code_editor_bg);
            editor.setPadding(dp(12), dp(12), dp(12), dp(12));
            editor.setGravity(Gravity.TOP | Gravity.START);
            editor.setMinLines(5);
            cCard.addView(editor);

            // Output Console Box
            TextView console = new TextView(this);
            console.setVisibility(View.GONE);
            console.setTypeface(Typeface.MONOSPACE);
            console.setTextSize(11);
            console.setPadding(dp(10), dp(10), dp(10), dp(10));
            console.setBackgroundColor(Color.parseColor("#020408"));
            LinearLayout.LayoutParams conLp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            conLp.setMargins(0, dp(8), 0, dp(8));
            console.setLayoutParams(conLp);
            cCard.addView(console);

            // Run & Hint Buttons
            LinearLayout btnRow = new LinearLayout(this);
            btnRow.setOrientation(LinearLayout.HORIZONTAL);
            btnRow.setPadding(0, dp(8), 0, 0);

            Button runBtn = new Button(this);
            runBtn.setText("▶️ Code kompilieren & ausführen");
            runBtn.setTextColor(Color.WHITE);
            runBtn.setTextSize(12);
            runBtn.setBackgroundResource(R.drawable.btn_primary);
            runBtn.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f));
            runBtn.setTag(new CodeLabRunTag(editor, console, c));
            runBtn.setOnClickListener(this);
            btnRow.addView(runBtn);

            Button hintBtn = new Button(this);
            hintBtn.setText("💡 Tipp");
            hintBtn.setTextColor(Color.parseColor("#94A3B8"));
            hintBtn.setTextSize(12);
            hintBtn.setTag("hint_" + c.getHint());
            hintBtn.setBackgroundResource(R.drawable.btn_secondary);
            LinearLayout.LayoutParams hLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            hLp.setMargins(dp(8), 0, 0, 0);
            hintBtn.setLayoutParams(hLp);
            hintBtn.setOnClickListener(this);
            btnRow.addView(hintBtn);

            cCard.addView(btnRow);
            contentContainer.addView(cCard);
        }
    }

    // ==========================================
    // TAB 4: EINSTELLUNGEN & ERINNERUNG (NATIVE)
    // ==========================================
    private void renderSettingsView() {
        TextView heading = new TextView(this);
        heading.setText("⚙️ Einstellungen & Benachrichtigungen");
        heading.setTextColor(Color.parseColor("#F8FAFC"));
        heading.setTextSize(20);
        heading.setTypeface(Typeface.DEFAULT_BOLD);
        contentContainer.addView(heading);

        // Reminder Card
        LinearLayout reminderCard = new LinearLayout(this);
        reminderCard.setOrientation(LinearLayout.VERTICAL);
        reminderCard.setBackgroundResource(R.drawable.card_bg);
        reminderCard.setPadding(dp(16), dp(16), dp(16), dp(16));
        LinearLayout.LayoutParams rLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        rLp.setMargins(0, dp(12), 0, dp(16));
        reminderCard.setLayoutParams(rLp);

        TextView rTitle = new TextView(this);
        rTitle.setText("⏰ Tägliche Lern-Erinnerung");
        rTitle.setTextColor(Color.parseColor("#F8FAFC"));
        rTitle.setTextSize(16);
        rTitle.setTypeface(Typeface.DEFAULT_BOLD);
        reminderCard.addView(rTitle);

        TextView rDesc = new TextView(this);
        rDesc.setText("Lass dich jeden Tag zu einer festen Uhrzeit an deine Code-Lektionen erinnern, damit du nicht vergisst weiterzumachen.");
        rDesc.setTextColor(Color.parseColor("#94A3B8"));
        rDesc.setTextSize(13);
        rDesc.setPadding(0, dp(4), 0, dp(12));
        reminderCard.addView(rDesc);

        int savedH = prefs.getInt(PREF_REMINDER_HOUR, 18);
        int savedM = prefs.getInt(PREF_REMINDER_MINUTE, 0);
        boolean isEnabled = prefs.getBoolean(PREF_REMINDER_ENABLED, true);

        reminderTimeLabel = new TextView(this);
        reminderTimeLabel.setText("Erinnerungszeit: " + String.format(Locale.getDefault(), "%02d:%02d Uhr", savedH, savedM));
        reminderTimeLabel.setTextColor(Color.parseColor("#38BDF8"));
        reminderTimeLabel.setTextSize(16);
        reminderTimeLabel.setTypeface(Typeface.DEFAULT_BOLD);
        reminderCard.addView(reminderTimeLabel);

        LinearLayout btnRow = new LinearLayout(this);
        btnRow.setOrientation(LinearLayout.HORIZONTAL);
        btnRow.setPadding(0, dp(10), 0, 0);

        Button changeTimeBtn = new Button(this);
        changeTimeBtn.setText("Uhrzeit ändern");
        changeTimeBtn.setTextColor(Color.WHITE);
        changeTimeBtn.setTag("settings_change_time");
        changeTimeBtn.setBackgroundResource(R.drawable.btn_secondary);
        changeTimeBtn.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f));
        changeTimeBtn.setOnClickListener(this);
        btnRow.addView(changeTimeBtn);

        reminderToggleBtn = new Button(this);
        reminderToggleBtn.setText(isEnabled ? "Aktiviert (An)" : "Deaktiviert (Aus)");
        reminderToggleBtn.setTextColor(Color.WHITE);
        reminderToggleBtn.setTag("settings_toggle_reminder");
        reminderToggleBtn.setBackgroundResource(isEnabled ? R.drawable.btn_correct : R.drawable.btn_wrong);
        LinearLayout.LayoutParams tLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        tLp.setMargins(dp(8), 0, 0, 0);
        reminderToggleBtn.setLayoutParams(tLp);
        reminderToggleBtn.setOnClickListener(this);
        btnRow.addView(reminderToggleBtn);
        reminderCard.addView(btnRow);

        contentContainer.addView(reminderCard);

        // App Info & License Card
        LinearLayout infoCard = new LinearLayout(this);
        infoCard.setOrientation(LinearLayout.VERTICAL);
        infoCard.setBackgroundResource(R.drawable.card_bg);
        infoCard.setPadding(dp(16), dp(16), dp(16), dp(16));
        LinearLayout.LayoutParams infoLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        infoLp.setMargins(0, 0, 0, dp(16));
        infoCard.setLayoutParams(infoLp);

        TextView aTitle = new TextView(this);
        aTitle.setText("⚖️ Impressum, DSGVO & Lizenz");
        aTitle.setTextColor(Color.parseColor("#F8FAFC"));
        aTitle.setTextSize(16);
        aTitle.setTypeface(Typeface.DEFAULT_BOLD);
        infoCard.addView(aTitle);

        TextView aIntro = new TextView(this);
        aIntro.setText("Vollständige gesetzliche Pflichtangaben (§ 5 DDG, DSGVO) offline & nativ direkt in der Anwendung hinterlegt.");
        aIntro.setTextColor(Color.parseColor("#94A3B8"));
        aIntro.setTextSize(12);
        aIntro.setPadding(0, dp(4), 0, dp(12));
        infoCard.addView(aIntro);

        Button btnLegalDialog = new Button(this);
        btnLegalDialog.setText("📜 Vollständiges Impressum & Datenschutz öffnen");
        btnLegalDialog.setTextColor(Color.WHITE);
        btnLegalDialog.setTag("open_legal_dialog");
        btnLegalDialog.setBackgroundResource(R.drawable.btn_primary);
        btnLegalDialog.setOnClickListener(this);
        infoCard.addView(btnLegalDialog);

        addInlineLegalBlock(infoCard, "1. Impressum (§ 5 DDG & § 18 MStV)",
                "Diensteanbieter: Jeremy Benz (@benzjeremy)\nSoftware-Entwickler & Open-Source Maintainer\nStandort: Nordrhein-Westfalen (NRW), Deutschland\nE-Mail: benzjeremy@pm.me • Web: https://benzjeremy.github.io\nRedaktionell verantwortlich nach § 18 Abs. 2 MStV: Jeremy Benz, NRW.\nRein private, nicht-kommerzielle Open-Source-Bildungsapp.");

        addInlineLegalBlock(infoCard, "2. Datenschutzerklärung (DSGVO & § 25 TDDDG)",
                "100% Offline & Absolute Privatsphäre:\n• Keine Internet-Berechtigung: Im Android-Manifest ist absichtlich keine INTERNET-Permission deklariert. Ein Senden oder Empfangen von Daten ist technisch unmöglich.\n• Null Tracking, Null SDKs: Keine Analytics, kein Firebase, keine Werbe-IDs.\n• Lokale Speicherung: Alle Fortschritte und Erinnerungen verbleiben exklusiv auf Ihrem Gerät.\n• Betroffenenrechte nach Art. 15–21 DSGVO: Werden durch 100% lokale Speicherung gewahrt; durch Deinstallation oder App-Daten löschen rückstandslos entfernbar.");

        addInlineLegalBlock(infoCard, "3. Kontakt & Lizenz (GPL-3.0)",
                "E-Mail: benzjeremy@pm.me (Reaktionszeit < 48 Std.)\nLizenziert unter GNU General Public License v3.0 (GPL-3.0).\nQuellcode: https://github.com/benzjeremy/learn");

        contentContainer.addView(infoCard);
    }

    private void addInlineLegalBlock(LinearLayout parent, String title, String content) {
        TextView t = new TextView(this);
        t.setText(title);
        t.setTextColor(Color.parseColor("#38BDF8"));
        t.setTextSize(13);
        t.setTypeface(Typeface.DEFAULT_BOLD);
        t.setPadding(0, dp(12), 0, dp(2));
        parent.addView(t);

        TextView c = new TextView(this);
        c.setText(content);
        c.setTextColor(Color.parseColor("#CBD5E1"));
        c.setTextSize(11);
        c.setLineSpacing(dp(2), 1.15f);
        parent.addView(c);
    }

    private void showLegalDialog() {
        ScrollView sv = new ScrollView(this);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(dp(18), dp(14), dp(18), dp(14));

        addLegalCardToContainer(layout, "1. Impressum (§ 5 DDG & § 18 MStV)",
                "Diensteanbieter:\nJeremy Benz (@benzjeremy)\nSoftware-Entwickler & Open-Source Maintainer\nStandort: Nordrhein-Westfalen (NRW), Deutschland\nE-Mail: benzjeremy@pm.me\nWeb: https://benzjeremy.github.io\n\nRedaktionell verantwortlich nach § 18 Abs. 2 MStV:\nJeremy Benz, NRW, Deutschland\n\nHinweis: Rein private, nicht-kommerzielle Bildungs- und Open-Source-Software ohne Gewinnerzielungsabsicht.");

        addLegalCardToContainer(layout, "2. Datenschutzerklärung (DSGVO & § 25 TDDDG)",
                "100% Datenschutz & Garantierte Offline-Privatsphäre:\n• KEINE Internet-Berechtigung: Diese App besitzt absichtlich KEINE 'android.permission.INTERNET'-Berechtigung im Android-Manifest. Die App kann technisch und physikalisch zu keinem Zeitpunkt Daten ins Internet senden oder empfangen.\n• Null Tracking, Null SDKs: Weder Google Analytics, Firebase, Sentry noch Werbe-Netzwerke oder Tracker sind enthalten.\n• Lokale Speicherung: Gelöste Aufgaben, Notizen, Code-Entwürfe und die tägliche Erinnerungszeit verbleiben ausschließlich lokal im privaten App-Speicher (SharedPreferences) auf Ihrem Endgerät.\n• Betroffenenrechte: Gemäß Art. 15–21 DSGVO haben Sie das volle Recht auf Datenlöschung. Durch Deinstallation der App oder 'App-Daten löschen' in Android werden alle lokalen Datensätze vollständig und unwiderruflich gelöscht.");

        addLegalCardToContainer(layout, "3. Kontakt & Responsible Disclosure",
                "E-Mail: benzjeremy@pm.me\nSicherheitsmeldungen: Koordinierte Schwachstellenmeldungen werden binnen 48 Stunden beantwortet.");

        addLegalCardToContainer(layout, "4. Freie Software Lizenz (GNU GPL-3.0)",
                "Diese Anwendung ist freie Open-Source-Software unter der GNU General Public License v3.0 (GPL-3.0).\nSie dürfen den Code studieren, verändern, forken und frei weiterverbreiten.\nQuellcode: https://github.com/benzjeremy/learn");

        sv.addView(layout);

        new AlertDialog.Builder(this, android.R.style.Theme_DeviceDefault_Dialog_Alert)
                .setTitle("⚖️ Rechtliche Hinweise & Datenschutz")
                .setView(sv)
                .setPositiveButton("Schließen", null)
                .show();
    }

    private void addLegalCardToContainer(LinearLayout container, String title, String content) {
        TextView tvTitle = new TextView(this);
        tvTitle.setText(title);
        tvTitle.setTextColor(Color.parseColor("#38BDF8"));
        tvTitle.setTextSize(14);
        tvTitle.setTypeface(Typeface.DEFAULT_BOLD);
        tvTitle.setPadding(0, dp(8), 0, dp(4));
        container.addView(tvTitle);

        TextView tvContent = new TextView(this);
        tvContent.setText(content);
        tvContent.setTextColor(Color.parseColor("#CBD5E1"));
        tvContent.setTextSize(12);
        tvContent.setLineSpacing(dp(3), 1.15f);
        tvContent.setPadding(0, 0, 0, dp(12));
        container.addView(tvContent);
    }

    // ==========================================
    // GLOBAL ONCLICK DISPATCHER (NO ANONYMOUS CLASSES)
    // ==========================================
    @Override
    public void onClick(View v) {
        Object tag = v.getTag();
        if (tag instanceof String) {
            String tagStr = (String) tag;
            if (TAG_NAV_COURSES.equals(tagStr)) {
                switchTab(0);
            } else if (TAG_NAV_EXAM.equals(tagStr)) {
                switchTab(1);
            } else if (TAG_NAV_CODELAB.equals(tagStr)) {
                switchTab(2);
            } else if (TAG_NAV_SETTINGS.equals(tagStr)) {
                switchTab(3);
            } else if (tagStr.startsWith("open_course_")) {
                String courseId = tagStr.substring("open_course_".length());
                Course c = CourseRepository.getCourseById(courseId);
                if (c != null) renderCourseDetailView(c);
            } else if ("back_to_courses".equals(tagStr)) {
                renderCoursesView();
            } else if ("exam_start_pause".equals(tagStr)) {
                toggleExamRunning();
            } else if ("exam_submit".equals(tagStr)) {
                finishExamAndShowGrading(ExamRepository.getExamQuestions());
            } else if ("exam_prev".equals(tagStr)) {
                if (examCurrentQuestionIndex > 0) {
                    examCurrentQuestionIndex--;
                    updateExamQuestionUI(ExamRepository.getExamQuestions(), examCurrentQuestionIndex);
                }
            } else if ("exam_next".equals(tagStr)) {
                if (examCurrentQuestionIndex < ExamRepository.getExamQuestions().size() - 1) {
                    examCurrentQuestionIndex++;
                    updateExamQuestionUI(ExamRepository.getExamQuestions(), examCurrentQuestionIndex);
                }
            } else if ("exam_restart".equals(tagStr)) {
                examTimeLeftMillis = 90 * 60 * 1000;
                examCurrentQuestionIndex = 0;
                if (examUserAnswers != null) {
                    for (int i = 0; i < examUserAnswers.length; i++) examUserAnswers[i] = -1;
                }
                renderExamView();
            } else if (tagStr.startsWith("hint_")) {
                String hint = tagStr.substring("hint_".length());
                Toast.makeText(this, hint, Toast.LENGTH_LONG).show();
            } else if ("settings_change_time".equals(tagStr)) {
                int curH = prefs.getInt(PREF_REMINDER_HOUR, 18);
                int curM = prefs.getInt(PREF_REMINDER_MINUTE, 0);
                new TimePickerDialog(this, this, curH, curM, true).show();
            } else if ("settings_toggle_reminder".equals(tagStr)) {
                boolean cur = prefs.getBoolean(PREF_REMINDER_ENABLED, true);
                boolean newState = !cur;
                prefs.edit().putBoolean(PREF_REMINDER_ENABLED, newState).apply();
                if (reminderToggleBtn != null) {
                    reminderToggleBtn.setText(newState ? "Aktiviert (An)" : "Deaktiviert (Aus)");
                    reminderToggleBtn.setBackgroundResource(newState ? R.drawable.btn_correct : R.drawable.btn_wrong);
                }
                if (newState) {
                    scheduleDailyNotification(prefs.getInt(PREF_REMINDER_HOUR, 18), prefs.getInt(PREF_REMINDER_MINUTE, 0));
                    Toast.makeText(this, "Erinnerung aktiviert!", Toast.LENGTH_SHORT).show();
                } else {
                    cancelDailyNotification();
                    Toast.makeText(this, "Erinnerung deaktiviert.", Toast.LENGTH_SHORT).show();
                }
            } else if ("open_legal_dialog".equals(tagStr)) {
                showLegalDialog();
            }
        } else if (tag instanceof QuestionOptionTag) {
            QuestionOptionTag qTag = (QuestionOptionTag) tag;
            boolean isCorrect = (qTag.optionIndex == qTag.question.getCorrectIndex());

            for (int j = 0; j < qTag.buttons.length; j++) {
                if (j == qTag.question.getCorrectIndex()) {
                    qTag.buttons[j].setBackgroundResource(R.drawable.btn_correct);
                    qTag.buttons[j].setTextColor(Color.WHITE);
                } else if (j == qTag.optionIndex && !isCorrect) {
                    qTag.buttons[j].setBackgroundResource(R.drawable.btn_wrong);
                    qTag.buttons[j].setTextColor(Color.WHITE);
                } else {
                    qTag.buttons[j].setBackgroundResource(R.drawable.btn_secondary);
                    qTag.buttons[j].setTextColor(Color.parseColor("#64748B"));
                }
            }

            qTag.feedbackView.setVisibility(View.VISIBLE);
            String explanation = qTag.question.getExplanationFor(qTag.optionIndex);
            if (isCorrect) {
                qTag.feedbackView.setText("✅ KORREKT!\n" + explanation);
                qTag.feedbackView.setTextColor(Color.parseColor("#10B981"));
                qTag.feedbackView.setBackgroundResource(R.drawable.btn_correct);
            } else {
                qTag.feedbackView.setText("❌ NICHT KORREKT:\n" + explanation);
                qTag.feedbackView.setTextColor(Color.parseColor("#F43F5E"));
                qTag.feedbackView.setBackgroundResource(R.drawable.btn_wrong);
            }
        } else if (tag instanceof ExamOptionTag) {
            ExamOptionTag eTag = (ExamOptionTag) tag;
            examUserAnswers[eTag.questionIndex] = eTag.optionIndex;
            for (int j = 0; j < eTag.buttons.length; j++) {
                if (j == eTag.optionIndex) {
                    eTag.buttons[j].setBackgroundResource(R.drawable.btn_primary);
                    eTag.buttons[j].setTextColor(Color.WHITE);
                } else {
                    eTag.buttons[j].setBackgroundResource(R.drawable.btn_secondary);
                    eTag.buttons[j].setTextColor(Color.parseColor("#CBD5E1"));
                }
            }
        } else if (tag instanceof CodeLabRunTag) {
            CodeLabRunTag cTag = (CodeLabRunTag) tag;
            String userCode = cTag.editor.getText().toString();
            cTag.console.setVisibility(View.VISIBLE);
            if (userCode.contains(cTag.challenge.getExpectedSolution()) ||
                    userCode.replaceAll("\\s+", "").contains(cTag.challenge.getExpectedSolution().replaceAll("\\s+", ""))) {
                cTag.console.setTextColor(Color.parseColor("#10B981"));
                cTag.console.setText("✔ BUILD SUCCESSFUL\n" + cTag.challenge.getSimulatedOutput());
            } else {
                cTag.console.setTextColor(Color.parseColor("#F43F5E"));
                cTag.console.setText("✖ BUILD ERROR: Die erwartete Lösung wurde noch nicht korrekt implementiert.\n" + cTag.challenge.getHint());
            }
        }
    }

    @Override
    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
        prefs.edit()
                .putInt(PREF_REMINDER_HOUR, hourOfDay)
                .putInt(PREF_REMINDER_MINUTE, minute)
                .apply();
        if (reminderTimeLabel != null) {
            reminderTimeLabel.setText("Erinnerungszeit: " + String.format(Locale.getDefault(), "%02d:%02d Uhr", hourOfDay, minute));
        }
        scheduleDailyNotification(hourOfDay, minute);
        Toast.makeText(this, "Tägliche Erinnerung auf " + String.format(Locale.getDefault(), "%02d:%02d", hourOfDay, minute) + " Uhr gesetzt!", Toast.LENGTH_SHORT).show();
    }

    private void scheduleDailyNotification(int hour, int minute) {
        AlarmManager am = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        Intent intent = new Intent(this, ReminderReceiver.class);
        PendingIntent pi = PendingIntent.getBroadcast(
                this, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, minute);
        cal.set(Calendar.SECOND, 0);

        if (cal.getTimeInMillis() <= System.currentTimeMillis()) {
            cal.add(Calendar.DAY_OF_YEAR, 1);
        }

        am.setInexactRepeating(
                AlarmManager.RTC_WAKEUP,
                cal.getTimeInMillis(),
                AlarmManager.INTERVAL_DAY,
                pi
        );
    }

    private void cancelDailyNotification() {
        AlarmManager am = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        Intent intent = new Intent(this, ReminderReceiver.class);
        PendingIntent pi = PendingIntent.getBroadcast(
                this, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );
        am.cancel(pi);
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density);
    }

    @Override
    protected void onDestroy() {
        pauseExamTimer();
        super.onDestroy();
    }
}
