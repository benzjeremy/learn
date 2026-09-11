package storage

import (
	"os"
	"path/filepath"
	"testing"
)

func TestStorageLifecycle(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "learn_test_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	dbPath := filepath.Join(tempDir, "test_learn.db")
	s, err := NewStorage(dbPath)
	if err != nil {
		t.Fatalf("NewStorage failed: %v", err)
	}
	defer s.Close()

	// Test settings
	if err := s.SetSetting("test_key", "hello_world"); err != nil {
		t.Fatalf("SetSetting failed: %v", err)
	}
	val := s.GetSetting("test_key", "default")
	if val != "hello_world" {
		t.Fatalf("expected 'hello_world', got '%s'", val)
	}

	// Test progress
	if err := s.SaveProgress("sec-01", "ch-01", "go", 10); err != nil {
		t.Fatalf("SaveProgress failed: %v", err)
	}
	if err := s.SaveProgress("sec-02", "ch-01", "go", 15); err != nil {
		t.Fatalf("SaveProgress failed: %v", err)
	}

	up, err := s.GetUserProgress()
	if err != nil {
		t.Fatalf("GetUserProgress failed: %v", err)
	}

	if up.XP != 25 {
		t.Fatalf("expected 25 XP, got %d", up.XP)
	}
	if !up.CompletedSections["sec-01"] || !up.CompletedSections["sec-02"] {
		t.Fatalf("expected both sections completed")
	}
}
