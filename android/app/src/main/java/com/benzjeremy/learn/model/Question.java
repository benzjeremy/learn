package com.benzjeremy.learn.model;

public class Question {
    private final String id;
    private final String prompt;
    private final String[] options;
    private final int correctIndex;
    private final String[] explanations;
    private final String contextInfo;

    public Question(String id, String prompt, String[] options, int correctIndex, String[] explanations, String contextInfo) {
        this.id = id;
        this.prompt = prompt;
        this.options = options;
        this.correctIndex = correctIndex;
        this.explanations = explanations;
        this.contextInfo = contextInfo;
    }

    public String getId() { return id; }
    public String getPrompt() { return prompt; }
    public String[] getOptions() { return options; }
    public int getCorrectIndex() { return correctIndex; }
    public String[] getExplanations() { return explanations; }
    public String getContextInfo() { return contextInfo; }

    public String getExplanationFor(int index) {
        if (index >= 0 && index < explanations.length) {
            return explanations[index];
        }
        return "Keine spezifische Erklärung verfügbar.";
    }
}
