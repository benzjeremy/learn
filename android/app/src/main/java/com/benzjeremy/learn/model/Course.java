package com.benzjeremy.learn.model;

import java.util.List;

public class Course {
    private final String id;
    private final String name;
    private final String icon;
    private final String badge;
    private final String summary;
    private final List<Lesson> lessons;

    public Course(String id, String name, String icon, String badge, String summary, List<Lesson> lessons) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.badge = badge;
        this.summary = summary;
        this.lessons = lessons;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getIcon() { return icon; }
    public String getBadge() { return badge; }
    public String getSummary() { return summary; }
    public List<Lesson> getLessons() { return lessons; }
}
