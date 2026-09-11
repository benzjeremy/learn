package domain

import (
	"testing"
	"time"
)

func TestUserProgress(t *testing.T) {
	up := UserProgress{
		CompletedSections: make(map[string]bool),
		XP:                0,
		Streak:            1,
		LastActive:        time.Now(),
	}

	up.CompletedSections["go-01-s1"] = true
	up.XP += 10

	if up.XP != 10 {
		t.Fatalf("expected 10 XP, got %d", up.XP)
	}
	if !up.CompletedSections["go-01-s1"] {
		t.Fatalf("expected section go-01-s1 to be completed")
	}
}

func TestUserSettings(t *testing.T) {
	s := UserSettings{
		ReminderDaily:      true,
		ReminderTime:       "18:00",
		ReminderInactivity: true,
		InactivityDays:     3,
		LastActive:         time.Now(),
	}

	if !s.ReminderDaily || s.ReminderTime != "18:00" {
		t.Fatalf("unexpected settings values")
	}
}

func TestExamResult(t *testing.T) {
	up := UserProgress{
		CompletedSections: make(map[string]bool),
		ExamResults:       make(map[string]ExamResult),
	}

	up.ExamResults["go-exam-90min"] = ExamResult{
		Score:     95,
		Grade:     1,
		Timestamp: time.Now(),
	}

	res, ok := up.ExamResults["go-exam-90min"]
	if !ok || res.Score != 95 || res.Grade != 1 {
		t.Fatalf("expected score 95 and grade 1, got %+v", res)
	}
}
