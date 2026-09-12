package com.benzjeremy.learn.model;

import java.util.List;

public class Lesson {
    private final String id;
    private final String title;
    private final String motivation;
    private final String coreConcept;
    private final String codeSnippet;
    private final List<Question> questions;

    public Lesson(String id, String title, String motivation, String coreConcept, String codeSnippet, List<Question> questions) {
        this.id = id;
        this.title = title;
        this.motivation = motivation;
        this.coreConcept = coreConcept;
        this.codeSnippet = codeSnippet;
        this.questions = questions;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getMotivation() { return motivation; }
    public String getCoreConcept() { return coreConcept; }
    public String getCodeSnippet() { return codeSnippet; }
    public List<Question> getQuestions() { return questions; }
}
