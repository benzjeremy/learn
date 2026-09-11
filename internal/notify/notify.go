package notify

import (
	"fmt"
	"os/exec"
	"runtime"
	"time"

	"github.com/benzjeremy/learn/internal/domain"
)

// NotificationService handles purely local notification triggers.
type NotificationService struct {
	settings domain.UserSettings
}

// NewNotificationService initializes a local notification manager.
func NewNotificationService(settings domain.UserSettings) *NotificationService {
	return &NotificationService{settings: settings}
}

// ShouldTriggerDailyReminder checks if the daily reminder time has arrived.
func (s *NotificationService) ShouldTriggerDailyReminder(now time.Time) bool {
	if !s.settings.ReminderDaily {
		return false
	}
	currentTimeStr := now.Format("15:04")
	return currentTimeStr == s.settings.ReminderTime
}

// ShouldTriggerInactivityNudge checks if the user has been inactive for >= threshold days.
func (s *NotificationService) ShouldTriggerInactivityNudge(now time.Time) bool {
	if !s.settings.ReminderInactivity || s.settings.LastActive.IsZero() {
		return false
	}
	days := int(now.Sub(s.settings.LastActive).Hours() / 24)
	return days >= s.settings.InactivityDays
}

// SendLocalNotification dispatches a local system notification without cloud servers.
func (s *NotificationService) SendLocalNotification(title, message string) error {
	switch runtime.GOOS {
	case "linux":
		// Native freedesktop notification via notify-send
		cmd := exec.Command("notify-send", "-a", "learn", "-i", "dialog-information", title, message)
		return cmd.Run()
	case "windows":
		// Windows PowerShell Toast notification
		psScript := fmt.Sprintf(`[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null; $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02); $textNodes = $template.GetElementsByTagName("text"); $textNodes.Item(0).AppendChild($template.CreateTextNode('%s')) > $null; $textNodes.Item(1).AppendChild($template.CreateTextNode('%s')) > $null; $toast = [Windows.UI.Notifications.ToastNotification]::new($template); [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('learn').Show($toast)`, title, message)
		cmd := exec.Command("powershell", "-NoProfile", "-NonInteractive", "-Command", psScript)
		return cmd.Run()
	default:
		// Fallback log
		fmt.Printf("[LOCAL NOTIFICATION] %s: %s\n", title, message)
		return nil
	}
}
