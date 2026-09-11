package storage

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"github.com/benzjeremy/learn/internal/domain"
	_ "modernc.org/sqlite"
)

// Storage handles local SQLite persistence in WAL mode.
type Storage struct {
	db *sql.DB
}

// NewStorage opens or creates a local SQLite database with WAL mode.
func NewStorage(dbPath string) (*Storage, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite database: %w", err)
	}

	// Enable WAL Mode and foreign keys
	if _, err := db.Exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;"); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to configure WAL mode: %w", err)
	}

	s := &Storage{db: db}
	if err := s.migrate(); err != nil {
		db.Close()
		return nil, fmt.Errorf("migration failed: %w", err)
	}

	return s, nil
}

// Close closes the database connection.
func (s *Storage) Close() error {
	return s.db.Close()
}

func (s *Storage) migrate() error {
	schema := `
	CREATE TABLE IF NOT EXISTS courses (
		id TEXT PRIMARY KEY,
		title_de TEXT NOT NULL,
		title_en TEXT NOT NULL,
		icon TEXT NOT NULL,
		badge TEXT,
		description_de TEXT,
		description_en TEXT,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS chapters (
		id TEXT PRIMARY KEY,
		course_id TEXT NOT NULL,
		chapter_index INTEGER NOT NULL,
		title_de TEXT NOT NULL,
		title_en TEXT NOT NULL,
		raw_json TEXT NOT NULL,
		sha256 TEXT NOT NULL,
		FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS progress (
		section_id TEXT PRIMARY KEY,
		chapter_id TEXT NOT NULL,
		course_id TEXT NOT NULL,
		completed_at DATETIME NOT NULL,
		xp_earned INTEGER DEFAULT 10
	);

	CREATE TABLE IF NOT EXISTS user_settings (
		key TEXT PRIMARY KEY,
		value TEXT NOT NULL
	);
	`
	_, err := s.db.Exec(schema)
	return err
}

// SaveProgress records a completed section and awards XP.
func (s *Storage) SaveProgress(sectionID, chapterID, courseID string, xpEarned int) error {
	query := `INSERT OR REPLACE INTO progress (section_id, chapter_id, course_id, completed_at, xp_earned) VALUES (?, ?, ?, ?, ?);`
	_, err := s.db.Exec(query, sectionID, chapterID, courseID, time.Now(), xpEarned)
	return err
}

// GetUserProgress fetches the completed sections and total XP.
func (s *Storage) GetUserProgress() (domain.UserProgress, error) {
	rows, err := s.db.Query(`SELECT section_id, xp_earned FROM progress;`)
	if err != nil {
		return domain.UserProgress{}, err
	}
	defer rows.Close()

	up := domain.UserProgress{
		CompletedSections: make(map[string]bool),
		XP:                0,
		Streak:            1,
		LastActive:        time.Now(),
	}

	for rows.Next() {
		var secID string
		var xp int
		if err := rows.Scan(&secID, &xp); err == nil {
			up.CompletedSections[secID] = true
			up.XP += xp
		}
	}

	return up, nil
}

// SetSetting stores a configuration key-value pair.
func (s *Storage) SetSetting(key, value string) error {
	query := `INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?);`
	_, err := s.db.Exec(query, key, value)
	return err
}

// GetSetting retrieves a setting string or returns defaultVal.
func (s *Storage) GetSetting(key, defaultVal string) string {
	var val string
	err := s.db.QueryRow(`SELECT value FROM user_settings WHERE key = ?;`, key).Scan(&val)
	if err != nil {
		return defaultVal
	}
	return val
}

// GetUserSettings returns structured settings.
func (s *Storage) GetUserSettings() domain.UserSettings {
	daily := s.GetSetting("reminder_daily", "true") == "true"
	rTime := s.GetSetting("reminder_time", "18:00")
	inactivity := s.GetSetting("reminder_inactivity", "true") == "true"
	inactivityDays, _ := strconv.Atoi(s.GetSetting("inactivity_days", "3"))

	var lastActive time.Time
	lastStr := s.GetSetting("last_active_epoch", "")
	if epoch, err := strconv.ParseInt(lastStr, 10, 64); err == nil && epoch > 0 {
		lastActive = time.Unix(epoch, 0)
	}

	return domain.UserSettings{
		ReminderDaily:      daily,
		ReminderTime:       rTime,
		ReminderInactivity: inactivity,
		InactivityDays:     inactivityDays,
		LastActive:         lastActive,
	}
}
