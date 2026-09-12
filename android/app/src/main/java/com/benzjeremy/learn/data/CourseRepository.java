package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CourseRepository {
    private static final List<Course> COURSES = new ArrayList<>();

    static {
        initCourses();
    }

    public static List<Course> getAllCourses() {
        return Collections.unmodifiableList(COURSES);
    }

    public static Course getCourseById(String id) {
        for (Course c : COURSES) {
            if (c.getId().equalsIgnoreCase(id)) return c;
        }
        return COURSES.isEmpty() ? null : COURSES.get(0);
    }

    private static void initCourses() {
        COURSES.add(GoCourseData.getCourse());
        COURSES.add(SecurityCourseData.getCourse());
        COURSES.add(SqlCourseData.getCourse());
        COURSES.add(PythonCourseData.getCourse());
        COURSES.add(WebCourseData.getCourse());
        COURSES.add(JsCourseData.getCourse());
        COURSES.add(CsharpCourseData.getCourse());
        COURSES.add(AstroCourseData.getCourse());
        COURSES.add(PhpCourseData.getCourse());
    }
}
