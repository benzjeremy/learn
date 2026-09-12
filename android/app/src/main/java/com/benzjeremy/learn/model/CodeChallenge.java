package com.benzjeremy.learn.model;

public class CodeChallenge {
    private final String id;
    private final String title;
    private final String language;
    private final String taskDescription;
    private final String initialCode;
    private final String expectedSolution;
    private final String hint;
    private final String simulatedOutput;

    public CodeChallenge(String id, String title, String language, String taskDescription, String initialCode, String expectedSolution, String hint, String simulatedOutput) {
        this.id = id;
        this.title = title;
        this.language = language;
        this.taskDescription = taskDescription;
        this.initialCode = initialCode;
        this.expectedSolution = expectedSolution;
        this.hint = hint;
        this.simulatedOutput = simulatedOutput;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getLanguage() { return language; }
    public String getTaskDescription() { return taskDescription; }
    public String getInitialCode() { return initialCode; }
    public String getExpectedSolution() { return expectedSolution; }
    public String getHint() { return hint; }
    public String getSimulatedOutput() { return simulatedOutput; }
}
