package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/benzjeremy/learn/internal/notify"
	"github.com/benzjeremy/learn/internal/storage"
)

const (
	Version = "v1.0"
	AppID   = "com.benzjeremy.learn"
)

func main() {
	versionFlag := flag.Bool("version", false, "Print version and exit")
	helpFlag := flag.Bool("help", false, "Show help overview")
	cliFlag := flag.Bool("cli", false, "Launch interactive CLI mode")
	checkReminderFlag := flag.Bool("check-reminder", false, "Run local notification check")
	dbPathFlag := flag.String("db", "", "Path to SQLite database")

	flag.Parse()

	if *helpFlag {
		printHelp()
		return
	}

	if *versionFlag {
		fmt.Printf("learn %s (Open-Source Educational Engine, GPL-3.0)\n", Version)
		return
	}

	// Resolve local DB path
	dbPath := *dbPathFlag
	if dbPath == "" {
		home, err := os.UserHomeDir()
		if err != nil {
			home = "."
		}
		appDir := filepath.Join(home, ".local", "share", "learn")
		_ = os.MkdirAll(appDir, 0750)
		dbPath = filepath.Join(appDir, "learn.db")
	}

	store, err := storage.NewStorage(dbPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error initializing database: %v\n", err)
		os.Exit(1)
	}
	defer store.Close()

	settings := store.GetUserSettings()
	notifySvc := notify.NewNotificationService(settings)

	if *checkReminderFlag {
		now := time.Now()
		if notifySvc.ShouldTriggerDailyReminder(now) {
			_ = notifySvc.SendLocalNotification("learn · Zeit für deinen Code-Sprint! 🚀", "Dein Programmierkurs wartet auf dich.")
		}
		if notifySvc.ShouldTriggerInactivityNudge(now) {
			_ = notifySvc.SendLocalNotification("learn · Hast du uns vergessen? 👋", "Schließe heute ein 5-Minuten-Kapitel ab!")
		}
		return
	}

	if *cliFlag {
		runCLI(store)
		return
	}

	// Default Output
	fmt.Printf("🚀 learn %s – Open-Source Learning Engine\n", Version)
	fmt.Println("• Database: ", dbPath)
	up, _ := store.GetUserProgress()
	fmt.Printf("• XP: %d | Completed Lessons: %d\n", up.XP, len(up.CompletedSections))
	fmt.Println("\nRun with --help for command line options.")
	fmt.Println("To launch the web cockpit, visit: https://benzjeremy.github.io/learn/app/")
}

func printHelp() {
	fmt.Printf("learn %s – Non-linear, privacy-first open-source code learning app\n\n", Version)
	fmt.Println("Usage: learn [flags]")
	fmt.Println("\nFlags:")
	fmt.Println("  --version          Print version information")
	fmt.Println("  --cli              Run in interactive terminal mode")
	fmt.Println("  --check-reminder   Check and trigger local daily/inactivity reminders")
	fmt.Println("  --db <path>        Custom path to SQLite database")
	fmt.Println("  --help             Display this help message")
}

func runCLI(s *storage.Storage) {
	fmt.Println("\n--- 📚 learn Interactive Terminal Runner ---")
	fmt.Println("1. Go (Golang) - Chapter 1: Basics & Syntax")
	fmt.Println("2. Go (Golang) - Chapter 4: Goroutines & Concurrency")
	fmt.Println("3. Check XP & Progress")
	fmt.Println("q. Exit")
	fmt.Print("\nSelect an option: ")

	var choice string
	_, _ = fmt.Scanln(&choice)

	switch choice {
	case "1":
		fmt.Println("\n[Concept: Package Main]")
		fmt.Println("Every executable Go program begins with package main and func main().")
		fmt.Println("\nCode:")
		fmt.Println("  package main")
		fmt.Println("  import \"fmt\"")
		fmt.Println("  func main() { fmt.Println(\"Hello, Go!\") }")
		_ = s.SaveProgress("cli-go-01", "go-01", "go", 10)
		fmt.Println("\n✅ Section completed! (+10 XP)")
	case "2":
		fmt.Println("\n[Concept: Goroutines]")
		fmt.Println("Start any function concurrently using the 'go' keyword.")
		fmt.Println("  go doWork()")
		_ = s.SaveProgress("cli-go-04", "go-04", "go", 15)
		fmt.Println("\n✅ Section completed! (+15 XP)")
	case "3":
		up, _ := s.GetUserProgress()
		fmt.Printf("\nCurrent XP: %d | Completed Sections: %d\n", up.XP, len(up.CompletedSections))
	default:
		fmt.Println("Exiting.")
	}
}
