package domain

import "time"

// LocalizedText holds German and English strings.
type LocalizedText struct {
	DE string `json:"de"`
	EN string `json:"en"`
}

// Section represents an individual lesson unit (concept, quiz, puzzle).
type Section struct {
	ID              string        `json:"id"`
	Type            string        `json:"type"` // "concept", "quiz_choice", "quiz_code_puzzle"
	Title           LocalizedText `json:"title"`
	ContentMarkdown LocalizedText `json:"contentMarkdown"`
	CodeSnippet     string        `json:"codeSnippet,omitempty"`
	Prompt          LocalizedText `json:"prompt,omitempty"`
	StarterCode     string        `json:"starterCode,omitempty"`
	Options         []string      `json:"options,omitempty"`
	Solution        any           `json:"solution,omitempty"`
	Explanation     LocalizedText `json:"explanation,omitempty"`
}

// Chapter represents a collection of sections within a course.
type Chapter struct {
	ID          string        `json:"id"`
	CourseID    string        `json:"courseId"`
	Index       int           `json:"chapterIndex"`
	FreeEntry   bool          `json:"freeEntry"`
	Title       LocalizedText `json:"title"`
	Description LocalizedText `json:"description"`
	Sections    []Section     `json:"sections"`
}

// Course represents a programming language course.
type Course struct {
	ID            string        `json:"id"`
	Title         LocalizedText `json:"title"`
	Icon          string        `json:"icon"`
	Badge         string        `json:"badge"`
	Description   LocalizedText `json:"description"`
	Level         string        `json:"level"`
	TotalChapters int           `json:"totalChapters"`
	ManifestURL   string        `json:"manifestUrl"`
	Chapters      []Chapter     `json:"chapters,omitempty"`
}

// UserProgress tracks completed sections and achievements locally.
type UserProgress struct {
	CompletedSections map[string]bool `json:"completedSections"`
	XP                int             `json:"xp"`
	Streak            int             `json:"streak"`
	LastActive        time.Time       `json:"lastActive"`
}

// UserSettings holds notification and preference values.
type UserSettings struct {
	ReminderDaily      bool      `json:"reminderDaily"`
	ReminderTime       string    `json:"reminderTime"` // e.g. "18:00"
	ReminderInactivity bool      `json:"reminderInactivity"`
	InactivityDays     int       `json:"inactivityDays"`
	LastActive         time.Time `json:"lastActive"`
}
