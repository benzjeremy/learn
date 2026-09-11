package notify

import (
	"testing"
	"time"

	"github.com/benzjeremy/learn/internal/domain"
)

func TestDailyReminderCheck(t *testing.T) {
	settings := domain.UserSettings{
		ReminderDaily:  true,
		ReminderTime:   "18:00",
		InactivityDays: 3,
	}

	svc := NewNotificationService(settings)

	// Matching time
	matchTime, _ := time.Parse("15:04", "18:00")
	if !svc.ShouldTriggerDailyReminder(matchTime) {
		t.Errorf("expected daily reminder to trigger at 18:00")
	}

	// Non-matching time
	diffTime, _ := time.Parse("15:04", "17:59")
	if svc.ShouldTriggerDailyReminder(diffTime) {
		t.Errorf("daily reminder should not trigger at 17:59")
	}
}

func TestInactivityNudgeCheck(t *testing.T) {
	now := time.Now()
	settings := domain.UserSettings{
		ReminderInactivity: true,
		InactivityDays:     3,
		LastActive:         now.Add(-4 * 24 * time.Hour), // 4 days ago
	}

	svc := NewNotificationService(settings)

	if !svc.ShouldTriggerInactivityNudge(now) {
		t.Errorf("expected inactivity nudge after 4 days with threshold 3")
	}

	// Recent activity
	settings.LastActive = now.Add(-1 * 24 * time.Hour)
	svc2 := NewNotificationService(settings)
	if svc2.ShouldTriggerInactivityNudge(now) {
		t.Errorf("inactivity nudge should not trigger after only 1 day")
	}
}
