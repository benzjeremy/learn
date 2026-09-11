/**
 * learn Web App - Interactive Client Logic
 * 100% Static HTML/JS, Local-First, Zero-Telemetry
 * Fachinformatiker Ausbildungsstandard & 90-Minuten-Prüfungsengine
 */

(function() {
  'use strict';

  // State
  const state = {
    lang: localStorage.getItem('learn_lang') || 'de',
    theme: localStorage.getItem('site_theme') || 'dark',
    currentCourseId: 'go',
    currentChapter: null,
    currentSectionIndex: 0,
    courses: [],
    progress: JSON.parse(localStorage.getItem('learn_progress') || '{"completedSections":[],"xp":0,"streak":1,"lastActive":0,"examResults":{}}'),
    settings: JSON.parse(localStorage.getItem('learn_settings') || '{"reminderDaily":true,"reminderTime":"18:00","reminderInactivity":true}'),
    // Exam Mode State
    exam: {
      active: false,
      chapter: null,
      timeRemaining: 5400, // 90 minutes in seconds
      timerId: null,
      currentQuestionIdx: 0,
      answers: {},
      flagged: {},
      submitted: false,
      score: 0,
      gradeInfo: null
    }
  };

  // 100% Offline-Resilient Course Catalog
  const BUNDLED_COURSES = [
  {
    "id": "go",
    "title": {
      "de": "Go (Golang)",
      "en": "Go (Golang)"
    },
    "icon": "⚡",
    "badge": "Modern Systems",
    "desc": {
      "de": "Systemprogrammierung, CSP-Concurrency (Goroutines, Channels), Kompilation & Microservices.",
      "en": "Systems programming, CSP concurrency (goroutines, channels), compilation & microservices."
    },
    "chapters": [
      {
        "id": "go-01-basics",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. Warum Go? Syntax, Speichermodell & Goroutines",
          "en": "1. Why Go? Syntax, Memory Model & Goroutines"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "go-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Warum Go? Das Problem moderner Server-Architekturen",
              "en": "Why Go? The Problem of Modern Server Architectures"
            },
            "content": {
              "de": "Go wurde 2007 von Robert Griesemer, Rob Pike und Ken Thompson bei Google entwickelt.\n\n* **Das Problem:** C++ hatte unerträgliche Kompilierzeiten und gefährliches Speichermanagement. Java und Python verbrauchten zu viel RAM und litten unter VM-Overhead oder Threading-Einschränkungen (GIL).\n* **Der Go-Ansatz:** Eine Sprache, die so schnell kompiliert wie ein Skript ausgeführt wird, direkt in eine statische Maschinencode-Binary ohne Abhängigkeiten übersetzt wird und Concurrency (Nebenläufigkeit) als Kernprinzip in die Sprache einbettet.",
              "en": "Go was designed in 2007 by Robert Griesemer, Rob Pike, and Ken Thompson at Google.\n\n* **The Problem:** C++ suffered from sluggish compile times and manual memory perils. Java/Python incurred runtime overhead and threading constraints.\n* **The Go Solution:** A language compiling in seconds directly into a standalone machine-code binary, featuring native concurrency via lightweight goroutines."
            },
            "code": "package main\n\nimport (\n    \"fmt\"\n    \"runtime\"\n)\n\nfunc main() {\n    // Go nutzt alle verfügbaren CPU-Kerne nativ\n    fmt.Printf(\"Go läuft auf %d logischen CPU-Kernen\\n\", runtime.NumCPU())\n}",
            "codeSnippet": "package main\n\nimport (\n    \"fmt\"\n    \"runtime\"\n)\n\nfunc main() {\n    // Go nutzt alle verfügbaren CPU-Kerne nativ\n    fmt.Printf(\"Go läuft auf %d logischen CPU-Kernen\\n\", runtime.NumCPU())\n}"
          },
          {
            "id": "go-01-sec-02",
            "type": "concept",
            "title": {
              "de": "Speichermodell: Pointer vs. Value & Escape Analysis",
              "en": "Memory Model: Pointer vs. Value & Escape Analysis"
            },
            "content": {
              "de": "In Go hat jede Variable einen festen Speicherort:\n\n* **Call by Value:** Go übergibt Parameter standardmäßig als Kopie. Modifikationen in einer Funktion wirken sich nicht auf das Original aus.\n* **Pointer (`*T`):** Übergeben Sie einen Pointer (`&variable`), greift die Funktion direkt auf dieselbe Speicheradresse zu.\n* **Escape Analysis des Compilers:** Der Go-Compiler analysiert beim Kompilieren, ob eine Variable die Funktion überlebt. Tut sie das, 'escaped' sie automatisch auf den Heap; andernfalls bleibt sie auf dem extrem schnellen Stack.",
              "en": "In Go, memory allocation is deterministic:\n\n* **Call by Value:** Arguments are passed by copy by default.\n* **Pointers (`*T`):** Passing a pointer (`&variable`) references the shared memory address.\n* **Escape Analysis:** The compiler detects whether a variable outlives its stack frame; if so, it escapes to the heap automatically."
            },
            "code": "type ServerConfig struct {\n    Port int\n}\n\n// Erhält einen Pointer und modifiziert den Originalwert auf dem Heap/Stack\nfunc updatePort(cfg *ServerConfig, newPort int) {\n    cfg.Port = newPort\n}",
            "codeSnippet": "type ServerConfig struct {\n    Port int\n}\n\n// Erhält einen Pointer und modifiziert den Originalwert auf dem Heap/Stack\nfunc updatePort(cfg *ServerConfig, newPort int) {\n    cfg.Port = newPort\n}"
          },
          {
            "id": "go-01-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Fachliche Verständnisfrage: Goroutines vs. OS-Threads",
              "en": "Technical Concept Check: Goroutines vs. OS Threads"
            },
            "prompt": {
              "de": "Warum kann ein Go-Server problemlos hunderttausende Goroutines gleichzeitig verwalten, während herkömmliche Betriebssystem-Threads den Server bei wenigen tausend Threads überlasten würden?",
              "en": "Why can a Go process run hundreds of thousands of goroutines, while conventional OS threads exhaust system resources at only a few thousand?"
            },
            "options": [
              "Eine Goroutine startet mit nur ca. 2 KB dynamischem Stack, während ein OS-Thread 1–2 MB festen Stack reserviert.",
              "Weil Go die Daten im Internet und nicht im Arbeitsspeicher ablegt.",
              "Weil Goroutines nur bei Vollmond ausgeführt werden.",
              "Weil Go-Code nicht kompiliert, sondern simuliert wird."
            ],
            "distractorExplanations": {
              "1": {
                "de": "Go ist eine kompilierte Systemsprache. Daten werden lokal im physischen RAM abgelegt, um Zugriffszeiten im Nanosekunden-Bereich zu garantieren. Eine Auslagerung ins Internet wäre extrem langsam und unsicher.",
                "en": "Go is a compiled systems language storing memory in local RAM for nanosecond access times. Offloading RAM to the internet would be slow and insecure."
              },
              "2": {
                "de": "Goroutines arbeiten streng deterministisch und werden vom internen Go-Runtime-Scheduler gesteuert, völlig unabhängig von astronomischen Phänomenen.",
                "en": "Goroutines are scheduled deterministically by the runtime scheduler."
              },
              "3": {
                "de": "Go ist eine Ahead-of-Time (AOT) kompilierte Sprache. Der Go-Compiler erzeugt direkt eigenständigen Maschinencode für die Zielarchitektur (z. B. AMD64, ARM64) ohne Interpretation oder Simulation.",
                "en": "Go is an AOT-compiled language generating standalone native machine code directly without simulation."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "Betriebssystem-Threads reservieren typischerweise 1–2 MB Stack-Speicher und erfordern teure Kernel-Kontextwechsel. Go verwaltet Goroutines im User-Space über seinen eigenen M:N-Scheduler mit einem winzigen initialen Stack von 2 KB.",
              "en": "OS threads allocate 1–2 MB fixed stack space and require kernel context switching. The Go runtime multiplexes lightweight goroutines (initial 2 KB stack) entirely in user space."
            }
          },
          {
            "id": "go-01-sec-04",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: Sichere Channel-Kommunikation",
              "en": "Code Puzzle: Safe Channel Communication"
            },
            "starterCode": "msgChan ___ \"Task completed\"",
            "prompt": {
              "de": "Mit welchem Operator sendet man in Go einen Wert in einen Channel?",
              "en": "Which operator sends a value into a channel in Go?"
            },
            "options": [
              "<-",
              "->",
              "=>",
              ":="
            ],
            "distractorExplanations": {
              ":=": {
                "de": "':=' ist Gos Kurzdeklarations-Operator für neue Variablen (z. B. 'count := 10'). Er reserviert eine neue Variable mit Typableitung, kann jedoch nicht zum Senden oder Empfangen aus Channels genutzt werden.",
                "en": "':=' is Go's short variable declaration syntax (e.g. 'count := 10'). It cannot be used to send into channels."
              },
              "->": {
                "de": "'->' existiert in Go als Operator überhaupt nicht. In Sprachen wie C oder C++ dient er zum Zugriff auf Struct-Elemente über Pointer; in Go nutzt man dafür einfach den Punkt ('.').",
                "en": "'->' does not exist in Go. In C/C++ it is used for pointer member access; Go uses '.' instead."
              },
              "=>": {
                "de": "'=>' existiert in Go nicht. Dieser 'Fat-Arrow' ist bekannt aus JavaScript (Arrow Functions) oder PHP (Match/Arrays), hat in Go aber keine Gültigkeit.",
                "en": "'=>' does not exist in Go (known from JavaScript arrow functions or PHP arrays)."
              }
            },
            "solution": "<-",
            "explanation": {
              "de": "Der Pfeil-Operator `<-` dient in Go sowohl zum Senden (`ch <- val`) als auch zum Empfangen (`val := <-ch`) aus Channels.",
              "en": "The arrow operator `<-` handles both sending (`ch <- val`) and receiving (`val := <-ch`) via channels."
            }
          },
          {
            "id": "go-01-sec-05",
            "type": "quiz_compiler_fix",
            "title": {
              "de": "Compiler-Labor: Syntaxfehler im Go-Code beheben",
              "en": "Compiler Lab: Fix Syntax Error in Go Code"
            },
            "prompt": {
              "de": "Der Go-Compiler meldet beim Kompilieren den untenstehenden Fehler. Das Programm soll 'Hallo Go-Entwickler!' ausgeben. Korrigiere den Tippfehler im Funktionsaufruf von `fmt.Println` direkt im Editor und klicke auf 'Code Kompilieren & Ausführen'!",
              "en": "The Go compiler reports the error below. The program should print 'Hello Go Developer!'. Correct the typo in `fmt.Println` in the editor and click 'Compile & Run'!"
            },
            "explanation": {
              "de": "In Go sind alle Bezeichner case-sensitive. Funktionen, die mit einem Großbuchstaben beginnen (wie `Println`), sind aus ihrem Package exportiert (public). Ein Tippfehler wie `Printlln` führt sofort zu einem Kompilierungsabbruch (`undefined symbol`).",
              "en": "Go identifiers are case-sensitive. Functions starting with an uppercase letter are exported. A typo like `Printlln` causes an immediate compilation failure (`undefined symbol`)."
            },
            "buggyCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Printlln(\"Hallo Go-Entwickler!\")\n}",
            "solutionCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hallo Go-Entwickler!\")\n}",
            "compilerOutput": {
              "error": "./main.go:6:5: undefined: fmt.Printlln (did you mean fmt.Println?)",
              "success": "[go run ./main.go]\nKompilierung fehlerfrei (0.02s) · Exit Code: 0\nAusgabe: Hallo Go-Entwickler!"
            }
          },
          {
            "id": "go-01-sec-06",
            "type": "quiz_inline_code",
            "title": {
              "de": "Inline-Code: Variablen-Kurzdeklaration",
              "en": "Inline Code: Short Variable Declaration"
            },
            "starterCode": "port ___ 8080",
            "prompt": {
              "de": "Vervollständige die Zeile so, dass die Variable `port` mit dem Wert 8080 unter Verwendung von Gos Kurzdeklarations-Operator deklariert und initialisiert wird.",
              "en": "Complete the line declaring and initializing `port` with 8080 using Go's short declaration operator."
            },
            "options": [
              ":=",
              "=",
              "==",
              "var"
            ],
            "distractorExplanations": {
              "=": {
                "de": "'=' ist der Zuweisungs-Operator für bereits zuvor deklarierte Variablen. Wenn 'port' noch nicht deklariert wurde, meldet der Compiler 'undefined: port'.",
                "en": "'=' is the assignment operator for pre-existing variables. It fails if 'port' has not been declared."
              },
              "==": {
                "de": "'==' ist der Vergleichs-Operator (Gleichheitstest), keine Zuweisung oder Variablendeklaration.",
                "en": "'==' is the comparison equality operator, not a declaration."
              },
              "var": {
                "de": "'var' steht vor dem Variablennamen (z. B. 'var port = 8080' oder 'var port int = 8080'), nicht zwischen Name und Wert.",
                "en": "'var' precedes the variable name (e.g. 'var port = 8080'), not placed in between."
              }
            },
            "solution": ":=",
            "explanation": {
              "de": "Der Kurzdeklarations-Operator `:=` deklariert und initialisiert eine neue Variable innerhalb einer Funktion in einem Schritt mit automatischer Typinferenz.",
              "en": "The short declaration operator `:=` declares and initializes a new variable inside a function in a single step with type inference."
            }
          }
        ]
      },
      {
        "id": "go-02-control-flow",
        "index": 2,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "2. Kontrollstrukturen, Fehlerbehandlung & defer",
          "en": "2. Control Flow, Error Handling & defer"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "go-02-sec-01",
            "type": "concept",
            "title": {
              "de": "Kontrollstrukturen: if-Initializer & die universelle for-Schleife",
              "en": "Control Flow: if-Initializers & the Unified for-Loop"
            },
            "content": {
              "de": "Go verzichtet bewusst auf redundante Syntax (es gibt kein `while`, kein `do-while` und keine runden Klammern um Bedingungen):\n\n* **if mit Short-Statement:** Variablen können direkt im if-Kopf deklariert und geprüft werden: `if val, err := fetch(); err != nil { ... }`. Die Variable `val` ist danach strikt auf den Scope des if/else-Blocks begrenzt.\n* **Die universelle for-Schleife:** Go kennt nur `for`. Sie erfüllt drei Rollen:\n  1. Klassisch: `for i := 0; i < 10; i++ { ... }`\n  2. While-Ersatz: `for condition { ... }`\n  3. Endlosschleife: `for { ... }` (Abbruch mit `break`)\n* **for range:** Iteriert elegant über Slices, Strings oder Maps: `for index, item := range items { ... }`.",
              "en": "Go eliminates syntactic bloat (no `while`, no `do-while`, and no parentheses around conditions):\n\n* **if with Short-Statement:** Variables can be declared in the if-header: `if val, err := fetch(); err != nil { ... }`. `val` is scoped strictly to the if/else block.\n* **Unified for-Loop:** Only `for` exists:\n  1. C-style: `for i := 0; i < 10; i++ { ... }`\n  2. While-style: `for condition { ... }`\n  3. Infinite: `for { ... }` (exit via `break`)\n* **for range:** Iterates over slices, maps, or channels: `for index, item := range items { ... }`."
            },
            "code": "if err := processData(input); err != nil {\n    log.Printf(\"Verarbeitungsfehler: %v\", err)\n    return err\n}\n\nfor i, val := range []string{\"Alpha\", \"Beta\"} {\n    fmt.Printf(\"[%d] = %s\\n\", i, val)\n}",
            "codeSnippet": "if err := processData(input); err != nil {\n    log.Printf(\"Verarbeitungsfehler: %v\", err)\n    return err\n}\n\nfor i, val := range []string{\"Alpha\", \"Beta\"} {\n    fmt.Printf(\"[%d] = %s\\n\", i, val)\n}"
          },
          {
            "id": "go-02-sec-02",
            "type": "concept",
            "title": {
              "de": "Fehler als Werte & Ressourcen-Cleanup mit defer",
              "en": "Errors as Values & Resource Cleanup with defer"
            },
            "content": {
              "de": "Go verzichtet auf Exceptions (`try/catch`), weil Exceptions Kontrollflüsse verschleiern und zu unkontrollierten Abstürzen führen:\n\n* **Fehler als Werte:** Funktionen geben `(T, error)` zurück. Wenn `err != nil`, wird der Fehler sofort behandelt.\n* **Ressourcensicherheit mit `defer`:** Anweisungen mit `defer` werden garantiert ausgeführt, sobald die umgebende Funktion zurückkehrt – selbst bei vorzeitigen `return`-Aufrufen. Mehrere `defer`-Statements werden nach dem **LIFO-Prinzip** (Last-In, First-Out / Stack) abgearbeitet.\n* **Typischer Anwendungsfall:** Datei öffnen und sofort `defer file.Close()` notieren. So wird das Schließen niemals vergessen.",
              "en": "Go avoids exceptions (`try/catch`) because exceptions obscure execution flow:\n\n* **Errors as Values:** Functions return `(T, error)`. Callers immediately inspect `if err != nil`.\n* **Guaranteed Cleanup with `defer`:** Statements prefixed with `defer` are guaranteed to execute upon function return, even during early returns. Multiple `defer` calls execute in **LIFO** (Last-In, First-Out) order.\n* **Canonical Pattern:** Open a resource and immediately defer its cleanup: `f, err := os.Open(name); defer f.Close()`."
            },
            "code": "f, err := os.Open(\"config.json\")\nif err != nil {\n    return fmt.Errorf(\"konnte Datei nicht öffnen: %w\", err)\n}\ndefer f.Close() // Wird garantiert am Funktionsende ausgeführt!",
            "codeSnippet": "f, err := os.Open(\"config.json\")\nif err != nil {\n    return fmt.Errorf(\"konnte Datei nicht öffnen: %w\", err)\n}\ndefer f.Close() // Wird garantiert am Funktionsende ausgeführt!"
          },
          {
            "id": "go-02-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Verständnisfrage: Ausführungsreihenfolge von defer",
              "en": "Concept Check: defer Execution Order"
            },
            "prompt": {
              "de": "Welche Ausgabe erzeugt eine Go-Funktion, die nacheinander `defer fmt.Print(\"A\")`, `defer fmt.Print(\"B\")` und `defer fmt.Print(\"C\")` ausführt?",
              "en": "What output is produced by a function executing `defer fmt.Print(\"A\")`, `defer fmt.Print(\"B\")`, and `defer fmt.Print(\"C\")`?"
            },
            "options": [
              "CBA (LIFO - Last In, First Out)",
              "ABC (FIFO - First In, First Out)",
              "BAC (Zufällige Reihenfolge)",
              "Gar keine Ausgabe, da defer Ausgaben unterdrückt"
            ],
            "distractorExplanations": {
              "1": {
                "de": "FIFO ('First In, First Out') gilt für Queues. Der Go-defer-Mechanismus arbeitet hingegen als Stack (LIFO), sodass der zuletzt registrierte Aufruf zuerst abarbeitet.",
                "en": "FIFO applies to queues. Go's defer works as a call stack (LIFO), executing the most recently deferred call first."
              },
              "2": {
                "de": "defer-Aufrufe sind streng deterministisch und niemals zufällig. Sie folgen der exakten LIFO-Stackreihenfolge.",
                "en": "defer statements are completely deterministic and never random."
              },
              "3": {
                "de": "defer verzögert die Ausführung lediglich bis zum Verlassen der Funktion, unterdrückt aber keine Ausgaben.",
                "en": "defer merely postpones execution until function exit, it does not suppress output."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "`defer` legt Aufrufe auf einen internen Funktions-Stack ab. Beim Verlassen der Funktion werden sie in umgekehrter Reihenfolge (LIFO: C, danach B, danach A) ausgeführt.",
              "en": "`defer` pushes calls onto a function-scoped stack, executing them in reverse order (LIFO: C, then B, then A)."
            }
          },
          {
            "id": "go-02-sec-04",
            "type": "quiz_compiler_fix",
            "title": {
              "de": "Compiler-Labor: Fehlende Fehlerprüfung beheben",
              "en": "Compiler Lab: Handle Returned Error"
            },
            "prompt": {
              "de": "Im folgenden Code ignoriert der Entwickler den Rückgabewert der Funktion `strconv.Atoi`. Passe die Funktion so an, dass sie `num, err := strconv.Atoi(s)` aufruft und bei `err != nil` sofort den Fehler protokolliert, statt den Fehlerwert unbesehen weiterzureichen!",
              "en": "In the code below, the developer ignores error checking for `strconv.Atoi`. Adjust the function to capture `num, err := strconv.Atoi(s)` and check `if err != nil`!"
            },
            "explanation": {
              "de": "In Go erzwingt der Compiler, dass alle Rückgabewerte entgegengenommen werden. Gibt eine Funktion `(int, error)` zurück, muss `num, err := ...` verwendet werden. Das Ignorieren führt zu einem Kompilierungsfehler.",
              "en": "The Go compiler enforces capturing all return values. A function returning `(int, error)` must be unpacked into two variables."
            },
            "buggyCode": "package main\n\nimport (\n    \"fmt\"\n    \"strconv\"\n)\n\nfunc parsePort(s string) (int, error) {\n    num := strconv.Atoi(s) // Fehler: strconv.Atoi gibt (int, error) zurück!\n    return num, nil\n}",
            "solutionCode": "package main\n\nimport (\n    \"fmt\"\n    \"strconv\"\n)\n\nfunc parsePort(s string) (int, error) {\n    num, err := strconv.Atoi(s)\n    if err != nil {\n        return 0, err\n    }\n    return num, nil\n}",
            "compilerOutput": {
              "error": "./main.go:9:9: assignment mismatch: 1 variable but strconv.Atoi returns 2 values (int, error)",
              "success": "[go build ./main.go]\nKompilierung erfolgreich (0.02s) · Exit Code: 0\nStatus: Robuste Fehlerbehandlung nach Go-Standard implementiert!"
            }
          },
          {
            "id": "go-02-sec-05",
            "type": "quiz_inline_code",
            "title": {
              "de": "Inline-Code: Idiomatischer Error-Check",
              "en": "Inline Code: Idiomatic Error Check"
            },
            "starterCode": "if err ___ nil {\n    return err\n}",
            "prompt": {
              "de": "Ergänze das fundamentale Go-Idiom zur Prüfung, ob ein Fehler vorliegt:",
              "en": "Complete the fundamental Go idiom checking whether an error occurred:"
            },
            "options": [
              "!=",
              "==",
              "is",
              "not"
            ],
            "distractorExplanations": {
              "==": {
                "de": "'err == nil' bedeutet, dass KEIN Fehler aufgetreten ist (die Operation war erfolgreich). Um einen Fehler abzufangen, muss auf Ungleichheit '!=' geprüft werden.",
                "en": "'err == nil' checks for absence of error. To handle an error, you must test for inequality '!='."
              },
              "is": {
                "de": "'is' ist ein Python-Schlüsselwort für Identitätsprüfungen und existiert in Go nicht.",
                "en": "'is' is a Python keyword that does not exist in Go."
              },
              "not": {
                "de": "'not' existiert in Go nicht. Go verwendet den C-Standard '!' für logische Verneinung und '!=' für Ungleichheit.",
                "en": "'not' does not exist in Go. Go uses '!' and '!='."
              }
            },
            "solution": "!=",
            "explanation": {
              "de": "`if err != nil` ist das Herzstück des Go-Error-Handlings. Nur wenn der Fehlerwert ungleich `nil` ist, liegt ein tatsächlicher Fehler vor.",
              "en": "`if err != nil` is the core of idiomatic Go error handling, signaling that an error actually occurred."
            }
          }
        ]
      },
      {
        "id": "go-03-data-structures",
        "index": 3,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "3. Datenstrukturen: Slices, Arrays & Maps",
          "en": "3. Data Structures: Slices, Arrays & Maps"
        },
        "duration": "30 min",
        "sections": [
          {
            "id": "go-03-sec-01",
            "type": "concept",
            "title": {
              "de": "Arrays vs. Slices & der SliceHeader",
              "en": "Arrays vs. Slices & the SliceHeader"
            },
            "content": {
              "de": "In Go sind Arrays und Slices grundverschieden:\n\n* **Arrays (`[N]T`):** Haben eine feste, zur Compile-Zeit unveränderliche Länge. Arrays sind Werte (Values): Die Übergabe an eine Funktion kopiert das gesamte Array im Speicher!\n* **Slices (`[]T`):** Sind dynamische Fenster (Views) auf ein zugrundeliegendes Array. Ein Slice besteht intern aus einem winzigen 24-Byte-Header (`SliceHeader`):\n  1. `Data`: Pointer auf das erste Element des Backing-Arrays\n  2. `Len`: Aktuelle Elementanzahl (`len(s)`)\n  3. `Cap`: Maximale Kapazität bis zur Re-Allokation (`cap(s)`)\n* **Dynamisches Wachsen:** Mit `append(s, elem)` fügst du Elemente hinzu. Übersteigt `len` die `cap`, allokiert Go im Hintergrund automatisch ein doppelt so großes neues Array und kopiert die Daten.",
              "en": "Arrays and slices differ fundamentally in Go:\n\n* **Arrays (`[N]T`):** Fixed compile-time size. Passing an array copies all elements by value.\n* **Slices (`[]T`):** Dynamic views over a backing array. Slices consist of a 24-byte `SliceHeader`:\n  1. `Data`: Pointer to backing array\n  2. `Len`: Element count (`len(s)`)\n  3. `Cap`: Capacity before reallocation (`cap(s)`)\n* **Growth:** `append(s, elem)` automatically allocates a larger backing array when capacity is exceeded."
            },
            "code": "// Slice mit Länge 0 und initialer Kapazität 5 erstellen\nports := make([]int, 0, 5)\nports = append(ports, 8080, 8443)\nfmt.Printf(\"len=%d, cap=%d\\n\", len(ports), cap(ports)) // len=2, cap=5",
            "codeSnippet": "// Slice mit Länge 0 und initialer Kapazität 5 erstellen\nports := make([]int, 0, 5)\nports = append(ports, 8080, 8443)\nfmt.Printf(\"len=%d, cap=%d\\n\", len(ports), cap(ports)) // len=2, cap=5"
          },
          {
            "id": "go-03-sec-02",
            "type": "concept",
            "title": {
              "de": "Maps & das Komma-Ok-Idiom",
              "en": "Maps & the Comma-Ok Idiom"
            },
            "content": {
              "de": "Eine `map[K]V` ist Gos integrierte Hashmap:\n\n* **Initialisierung erforderlich:** Eine uninitialisierte Map (`var m map[string]int`) ist `nil`. Das Lesen liefert den Nullwert (0), aber das **Schreiben führt zu einem Laufzeit-Panic** (`panic: assignment to entry in nil map`). Nutze immer `make(map[K]V)` oder ein Literal `map[string]int{}`!\n* **Das Komma-Ok-Idiom:** In Go liefert der Zugriff auf einen nicht existierenden Key den Nullwert des Typs. Um zu unterscheiden, ob ein Key tatsächlich mit dem Wert 0 existiert oder gar nicht vorhanden ist, nutzt man den zweiten booleschen Rückgabewert:\n  `val, ok := m[\"port\"]`\n  Ist `ok == true`, existiert der Schlüssel in der Map.",
              "en": "A `map[K]V` is Go's built-in hash table:\n\n* **Initialization Required:** An uninitialized map is `nil`. Reading returns the zero value, but **writing triggers a panic** (`panic: assignment to entry in nil map`). Always initialize with `make(map[K]V)`!\n* **Comma-Ok Idiom:** Accessing a missing key returns the zero value. To check if a key actually exists, use the second boolean return value: `val, ok := m[\"key\"]`."
            },
            "code": "users := make(map[string]int)\nusers[\"admin\"] = 1001\n\nif id, ok := users[\"guest\"]; ok {\n    fmt.Printf(\"Gefunden: %d\\n\", id)\n} else {\n    fmt.Println(\"Benutzer nicht in Map vorhanden!\")\n}",
            "codeSnippet": "users := make(map[string]int)\nusers[\"admin\"] = 1001\n\nif id, ok := users[\"guest\"]; ok {\n    fmt.Printf(\"Gefunden: %d\\n\", id)\n} else {\n    fmt.Println(\"Benutzer nicht in Map vorhanden!\")\n}"
          },
          {
            "id": "go-03-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Verständnisfrage: Schreiben in eine Nil-Map",
              "en": "Concept Check: Writing to a Nil Map"
            },
            "prompt": {
              "de": "Was passiert zur Laufzeit, wenn folgender Code ausgeführt wird:\n`var scores map[string]int`\n`scores[\"alex\"] = 42`",
              "en": "What happens at runtime when the following executes:\n`var scores map[string]int`\n`scores[\"alex\"] = 42`"
            },
            "options": [
              "Das Programm stürzt mit einem Panic ab ('panic: assignment to entry in nil map').",
              "Die Map wird automatisch im Hintergrund initialisiert.",
              "Der Wert 42 wird ignoriert und nicht gespeichert.",
              "Der Go-Compiler meldet bereits vor der Ausführung einen Syntaxfehler."
            ],
            "distractorExplanations": {
              "1": {
                "de": "Go initialisiert Maps nicht stillschweigend im Hintergrund. Das Allokieren der internen Hash-Buckets muss explizit via 'make(map[string]int)' erfolgen.",
                "en": "Go does not implicitly allocate backing hash buckets for nil maps upon write."
              },
              "2": {
                "de": "Werte werden nicht stillschweigend verworfen. Ein Schreibzugriff auf 'nil' ist eine unzulässige Pointer-Dereferenzierung und führt zum sofortigen Programmabsturz (Panic).",
                "en": "Values are not discarded silently; writing to nil causes a runtime panic."
              },
              "3": {
                "de": "Syntaktisch ist die Zeile valide, daher kompiliert der Code fehlerfrei. Erst beim Start stürzt das Programm zur Laufzeit ab.",
                "en": "Syntactically valid at compile time; fails at runtime upon dereferencing the nil map."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "Eine mit `var m map[...]...` deklarierte Map besitzt den Wert `nil`. Während das Lesen von `nil`-Maps gefahrlos den Nullwert liefert, löst jeder Schreibzugriff einen Laufzeit-Panic aus. Maps müssen stets mit `make()` initialisiert werden.",
              "en": "A zero-value map is `nil`. Reading from a nil map returns the zero-value, but writing to it panics immediately."
            }
          },
          {
            "id": "go-03-sec-04",
            "type": "quiz_compiler_fix",
            "title": {
              "de": "Compiler-Labor: Laufzeit-Panic bei Nil-Map beheben",
              "en": "Compiler Lab: Fix Runtime Nil-Map Panic"
            },
            "prompt": {
              "de": "Die Funktion `RegisterService` stürzt bei Ausführung ab, weil die Map `services` nicht mit `make()` initialisiert wurde. Korrigiere die Deklaration so, dass die Map allokiert wird und der Service sicher gespeichert werden kann!",
              "en": "The `RegisterService` function panics because `services` is not initialized with `make()`. Fix the declaration to properly allocate the map!"
            },
            "explanation": {
              "de": "Mit `services := make(map[string]int)` werden die internen Hash-Buckets der Map initialisiert. Erst danach können Schlüssel-Wert-Paare ohne Panic gespeichert werden.",
              "en": "Using `make(map[string]int)` allocates the internal hash buckets, permitting safe write operations."
            },
            "buggyCode": "package main\n\nimport \"fmt\"\n\nfunc RegisterService(name string, port int) map[string]int {\n    var services map[string]int // Fehler: services ist nil!\n    services[name] = port\n    return services\n}",
            "solutionCode": "package main\n\nimport \"fmt\"\n\nfunc RegisterService(name string, port int) map[string]int {\n    services := make(map[string]int)\n    services[name] = port\n    return services\n}",
            "compilerOutput": {
              "error": "panic: assignment to entry in nil map\ngoroutine 1 [running]:\nmain.RegisterService(0x4a100, 0x4, 0x1f90)\n\t/main.go:7 +0x3d",
              "success": "[go run ./main.go]\nKompilierung erfolgreich (0.02s) · Exit Code: 0\nService erfolgreich in allokierte Map registriert!"
            }
          },
          {
            "id": "go-03-sec-05",
            "type": "quiz_inline_code",
            "title": {
              "de": "Inline-Code: Dynamisches Hinzufügen zu Slices",
              "en": "Inline Code: Dynamic Slice Append"
            },
            "starterCode": "numbers = ___(numbers, 42)",
            "prompt": {
              "de": "Mit welcher eingebauten Go-Funktion fügt man ein neues Element an einen Slice an und fängt das möglicherweise re-allokierte Slice-Ergebnis auf?",
              "en": "Which built-in Go function appends an element to a slice and returns the updated slice header?"
            },
            "options": [
              "append",
              "push",
              "add",
              "insert"
            ],
            "distractorExplanations": {
              "push": {
                "de": "'push' existiert in Go nicht (bekannt aus JavaScript-Arrays wie 'arr.push()').",
                "en": "'push' is a JavaScript Array method, not Go."
              },
              "add": {
                "de": "'add' ist keine Go-Builtin-Funktion für Slices.",
                "en": "'add' is not a Go built-in slice function."
              },
              "insert": {
                "de": "'insert' existiert in Go nicht als Standardfunktion.",
                "en": "'insert' is not a Go standard slice built-in."
              }
            },
            "solution": "append",
            "explanation": {
              "de": "`append(slice, elem)` ist Gos fundamentale Builtin-Funktion zum Erweitern von Slices. Da bei Überschreitung der Kapazität ein neues Backing-Array erzeugt werden kann, muss das Ergebnis stets der Slice-Variable zugewiesen werden: `s = append(s, val)`.",
              "en": "`append(slice, elem)` is Go's built-in for expanding slices. Since a reallocation may occur, the result must be reassigned to the slice variable."
            }
          }
        ]
      },
      {
        "id": "go-04-structs-methods",
        "index": 4,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "4. Structs, Pointer & Methoden-Receiver",
          "en": "4. Structs, Pointers & Method Receivers"
        },
        "duration": "30 min",
        "sections": [
          {
            "id": "go-04-sec-01",
            "type": "concept",
            "title": {
              "de": "Structs & Pointer: Adress- vs. Dereferenzierungs-Operator",
              "en": "Structs & Pointers: Address vs. Dereference Operator"
            },
            "content": {
              "de": "Go ist keine klassische OOP-Sprache mit Vererbung (`class`), sondern setzt auf Komposition mit **Structs**:\n\n* **Struct-Definition:** Bündelt verwandte Felder zu einem neuen Typ:\n  `type ServerConfig struct { Host string; Port int }`\n* **Pointer (`*T`):** Ein Zeiger speichert die Speicheradresse eines Werts.\n* **Der Adress-Operator (`&`):** Erzeugt einen Pointer auf eine Variable: `ptr := &myConfig`.\n* **Der Dereferenzierungs-Operator (`*`):** Liest oder verändert den Wert an der Speicheradresse: `*ptr = newConfig`.\n* **Effizienz:** Die Übergabe großer Structs per Pointer verhindert teure Speicherkopien und erlaubt direkte Mutationen.",
              "en": "Go avoids class-based inheritance, favoring composition with **structs**:\n\n* **Struct Definition:** Bundles fields into a typed unit:\n  `type ServerConfig struct { Host string; Port int }`\n* **Pointers (`*T`):** Hold the memory address of an instance.\n* **Address Operator (`&`):** Yields a pointer to a value: `ptr := &myConfig`.\n* **Dereference Operator (`*`):** Accesses or writes value at address: `*ptr = newConfig`.\n* **Efficiency:** Passing large structs by pointer avoids memory copies."
            },
            "code": "type Client struct {\n    ID   string `json:\"id\"`\n    Host string `json:\"host\"`\n}\n\n// Erstellt eine Instanz und übergibt deren Adresse\nfunc NewClient(id, host string) *Client {\n    return &Client{ID: id, Host: host}\n}",
            "codeSnippet": "type Client struct {\n    ID   string `json:\"id\"`\n    Host string `json:\"host\"`\n}\n\n// Erstellt eine Instanz und übergibt deren Adresse\nfunc NewClient(id, host string) *Client {\n    return &Client{ID: id, Host: host}\n}"
          },
          {
            "id": "go-04-sec-02",
            "type": "concept",
            "title": {
              "de": "Methoden: Value-Receiver vs. Pointer-Receiver",
              "en": "Methods: Value vs. Pointer Receivers"
            },
            "content": {
              "de": "In Go können Methoden an Structs gebunden werden. Der Parameter vor dem Funktionsnamen heißt **Receiver**:\n\n* **Value-Receiver `func (s Server) Status() string`:**\n  Die Methode erhält eine **Kopie** der Struct. Änderungen an den Feldern wirken sich **nicht** auf das aufrufende Original aus. Ideal für schreibgeschützte Abfragen.\n* **Pointer-Receiver `func (s *Server) SetPort(p int)`:**\n  Die Methode operiert direkt auf dem **Original** im Speicher. Änderungen an Feldern bleiben persistent erhalten!\n* **Faustregel:** Wenn eine Methode den Zustand verändern soll oder die Struct groß ist: **immer Pointer-Receiver `*T` nutzen**.",
              "en": "In Go, methods attach to types via a **receiver** parameter:\n\n* **Value Receiver `func (s Server) Status() string`:** Operates on an isolated **copy**. Mutating fields does **not** affect the caller.\n* **Pointer Receiver `func (s *Server) SetPort(p int)`:** Operates directly on the shared **memory address**. Mutated fields persist.\n* **Rule of thumb:** If the method mutates fields or the struct is large, always use a pointer receiver `*T`."
            },
            "code": "type Counter struct {\n    count int\n}\n\n// Pointer-Receiver modifiziert das Original\nfunc (c *Counter) Increment() {\n    c.count++\n}",
            "codeSnippet": "type Counter struct {\n    count int\n}\n\n// Pointer-Receiver modifiziert das Original\nfunc (c *Counter) Increment() {\n    c.count++\n}"
          },
          {
            "id": "go-04-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Verständnisfrage: Warum mutiert mein Value-Receiver nicht?",
              "en": "Concept Check: Why Did My Value Receiver Fail to Mutate?"
            },
            "prompt": {
              "de": "Ein Entwickler deklariert `func (cfg ServerConfig) UpdateHost(newHost string) { cfg.Host = newHost }`. Nach dem Aufruf im Hauptprogramm ist `cfg.Host` jedoch unverändert. Warum?",
              "en": "A developer declares `func (cfg ServerConfig) UpdateHost(newHost string) { cfg.Host = newHost }`. After calling it, `cfg.Host` remains unchanged. Why?"
            },
            "options": [
              "Weil `ServerConfig` als Value-Receiver deklariert wurde und die Methode nur auf einer lokalen Kopie gearbeitet hat.",
              "Weil Strings in Go unveränderlich sind und nicht neu zugewiesen werden können.",
              "Weil Methoden in Go nur mit Großbuchstaben aufgerufen werden dürfen.",
              "Weil der Hostname vorher mit chmod gesperrt wurde."
            ],
            "distractorExplanations": {
              "1": {
                "de": "Strings sind zwar immutable Bytesequenzen, aber Variablen können jederzeit einen neuen String-Header zugewiesen bekommen. Das Problem liegt hier am Struct-Receiver, nicht am String-Typ.",
                "en": "String variables can be reassigned; the failure stems entirely from receiver value copying."
              },
              "2": {
                "de": "Groß- und Kleinschreibung steuert in Go die Paketsichtbarkeit (Export), verhindert aber keine Methodenaufrufe innerhalb desselben Packages.",
                "en": "Capitalization controls package export visibility, not internal method execution."
              },
              "3": {
                "de": "chmod ist ein UNIX-Dateisystem-Kommando und hat keine Auswirkung auf Go-Speicherstrukturen.",
                "en": "chmod is a filesystem permissions utility, completely unrelated to memory mutation."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "Value-Receiver übergeben die Struct als Wertkopie (Call by Value). Um das Original zu modifizieren, muss der Receiver als Zeiger deklariert werden: `func (cfg *ServerConfig) UpdateHost(...)`.",
              "en": "Value receivers operate on a copy. To mutate the caller's struct, declare a pointer receiver: `func (cfg *ServerConfig) UpdateHost(...)`."
            }
          },
          {
            "id": "go-04-sec-04",
            "type": "quiz_compiler_fix",
            "title": {
              "de": "Compiler-Labor: Struct-Mutation mit Pointer-Receiver beheben",
              "en": "Compiler Lab: Fix Struct Mutation with Pointer Receiver"
            },
            "prompt": {
              "de": "Die Methode `EnableTLS` modifiziert die Konfiguration, bewirkt aber nichts, da sie als Value-Receiver deklariert ist. Korrigiere die Receiver-Deklaration zu einem Pointer-Receiver `*TLSConfig`, damit die Änderung auf dem Originalobjekt wirksam wird!",
              "en": "The `EnableTLS` method fails to mutate state because it uses a value receiver. Change the receiver to a pointer receiver `*TLSConfig` so the mutation takes effect!"
            },
            "explanation": {
              "de": "Durch `func (cfg *TLSConfig)` erhält die Methode die echte Speicheradresse der Konfiguration. Die Zuweisung `cfg.Enabled = true` modifiziert nun das Original.",
              "en": "By declaring `func (cfg *TLSConfig)`, the method receives the instance's pointer, allowing in-place field mutations."
            },
            "buggyCode": "package main\n\nimport \"fmt\"\n\ntype TLSConfig struct {\n    Enabled bool\n    Port    int\n}\n\n// Fehler: Value-Receiver verwirft Änderungen am Ende der Funktion!\nfunc (cfg TLSConfig) EnableTLS() {\n    cfg.Enabled = true\n    cfg.Port = 443\n}\n\nfunc main() {\n    cfg := TLSConfig{Enabled: false, Port: 80}\n    cfg.EnableTLS()\n    fmt.Printf(\"TLS=%v, Port=%d\\n\", cfg.Enabled, cfg.Port)\n}",
            "solutionCode": "package main\n\nimport \"fmt\"\n\ntype TLSConfig struct {\n    Enabled bool\n    Port    int\n}\n\n// Korrekt: Pointer-Receiver modifiziert die Original-Speicheradresse\nfunc (cfg *TLSConfig) EnableTLS() {\n    cfg.Enabled = true\n    cfg.Port = 443\n}\n\nfunc main() {\n    cfg := TLSConfig{Enabled: false, Port: 80}\n    cfg.EnableTLS()\n    fmt.Printf(\"TLS=%v, Port=%d\\n\", cfg.Enabled, cfg.Port)\n}",
            "compilerOutput": {
              "error": "[Laufzeit-Warnung: Mutation ohne Effekt]\nAusgabe: TLS=false, Port=80\nStatus: Keine dauerhafte Änderung im Originalobjekt!",
              "success": "[go run ./main.go]\nKompilierung erfolgreich (0.02s) · Exit Code: 0\nAusgabe: TLS=true, Port=443\nStatus: Pointer-Receiver aktualisiert Speicheradresse erfolgreich!"
            }
          },
          {
            "id": "go-04-sec-05",
            "type": "quiz_inline_code",
            "title": {
              "de": "Inline-Code: Struct-Pointer Referenzierung",
              "en": "Inline Code: Struct Pointer Reference"
            },
            "starterCode": "ptr := ___ServerConfig{Port: 8080}",
            "prompt": {
              "de": "Welcher Operator wird vor einer Struct-Instanz verwendet, um ihre Speicheradresse als Pointer zu erhalten?",
              "en": "Which operator precedes a struct instance to obtain its memory address as a pointer?"
            },
            "options": [
              "&",
              "*",
              "->",
              "@"
            ],
            "distractorExplanations": {
              "*": {
                "de": "'*' dient bei Typen zur Deklaration von Pointer-Typen (*ServerConfig) und bei Variablen zur Dereferenzierung (*ptr). Um eine neue Adresse zu ermitteln, wird '&' benötigt.",
                "en": "'*' declares pointer types (*ServerConfig) or dereferences existing pointers, whereas '&' yields an address."
              },
              "->": {
                "de": "'->' existiert in Go überhaupt nicht als Operator.",
                "en": "'->' does not exist in Go."
              },
              "@": {
                "de": "'@' wird in Sprachen wie Python oder Java für Annotationen/Dekoratoren genutzt, existiert in Go jedoch nicht.",
                "en": "'@' is used for annotations in Java/Python, not in Go."
              }
            },
            "solution": "&",
            "explanation": {
              "de": "Der Adress-Operator `&` nimmt die Speicheradresse eines Werts und erzeugt damit einen Pointer (`*ServerConfig`).",
              "en": "The address operator `&` yields the memory address of the struct instance, producing a `*ServerConfig` pointer."
            }
          }
        ]
      },
      {
        "id": "go-05-interfaces",
        "index": 5,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "5. Interfaces & Duck-Typing",
          "en": "5. Interfaces & Duck-Typing"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "go-05-sec-01",
            "type": "concept",
            "title": {
              "de": "Implizite Interfaces: Entkopplung ohne Hierarchien",
              "en": "Implicit Interfaces: Decoupling Without Hierarchies"
            },
            "content": {
              "de": "In Go deklariert ein Interface eine Menge von Methoden-Signaturen. Die Implementierung erfolgt **rein implizit**:\n\n* **Kein `implements`-Keyword:** Wenn ein Typ alle im Interface geforderten Methoden mit identischer Signatur implementiert, erfüllt er das Interface automatisch ('Duck Typing').\n* **Vorteil:** Konsumenten können eigene schlanke Interfaces definieren, ohne dass Drittbibliotheken oder Quellcodes angepasst werden müssen.\n* **Kanonisches Standardbeispiel: `fmt.Stringer`:**\n  ```go\n  type Stringer interface {\n      String() string\n  }\n  ```\n  Implementiert ein Typ `String() string`, wird diese Methode von `fmt.Println` automatisch zur Textausgabe herangezogen.",
              "en": "In Go, an interface defines a contract of method signatures. Implementation is **entirely implicit**:\n\n* **No `implements` Keyword:** A type implements an interface simply by declaring the matching method signatures.\n* **Advantage:** Consumers define minimal interfaces without modifying upstream library code.\n* **Canonical Example: `fmt.Stringer`:**\n  ```go\n  type Stringer interface {\n      String() string\n  }\n  ```\n  Any type implementing `String() string` is automatically formatted by `fmt.Println`."
            },
            "code": "type Greeter interface {\n    Greet() string\n}\n\ntype Developer struct{ Name string }\n\n// Erfüllt das Interface 'Greeter' implizit\nfunc (d Developer) Greet() string {\n    return \"Hallo, ich bin \" + d.Name\n}",
            "codeSnippet": "type Greeter interface {\n    Greet() string\n}\n\ntype Developer struct{ Name string }\n\n// Erfüllt das Interface 'Greeter' implizit\nfunc (d Developer) Greet() string {\n    return \"Hallo, ich bin \" + d.Name\n}"
          },
          {
            "id": "go-05-sec-02",
            "type": "concept",
            "title": {
              "de": "Type Assertions & Type Switches",
              "en": "Type Assertions & Type Switches"
            },
            "content": {
              "de": "Ein Interface-Wert kann jeden konkreten Typ speichern, der das Interface erfüllt (z. B. `any` bzw. `interface{}`):\n\n* **Type Assertion (`v, ok := i.(T)`):** Extrahiert den darunterliegenden konkreten Typ. Nutze stets die Zwei-Wert-Form mit dem Komma-Ok-Idiom, um einen Panic bei fehlerhaftem Typ zu verhindern!\n* **Type Switch (`switch v := i.(type)`):** Prüft den konkreten Typ zur Laufzeit über mehrere Verzweigungen.",
              "en": "An interface value holds both a dynamic value and a concrete type:\n\n* **Type Assertion (`v, ok := i.(T)`):** Extracts the concrete underlying type. Always use the two-value comma-ok form to prevent runtime panics on mismatch.\n* **Type Switch (`switch v := i.(type)`):** Inspects dynamic types across multiple clean cases."
            },
            "code": "func printValue(val any) {\n    switch v := val.(type) {\n    case int:\n        fmt.Printf(\"Ganzzahl: %d\\n\", v)\n    case string:\n        fmt.Printf(\"Text: %s\\n\", v)\n    default:\n        fmt.Println(\"Unbekannter Typ\")\n    }\n}",
            "codeSnippet": "func printValue(val any) {\n    switch v := val.(type) {\n    case int:\n        fmt.Printf(\"Ganzzahl: %d\\n\", v)\n    case string:\n        fmt.Printf(\"Text: %s\\n\", v)\n    default:\n        fmt.Println(\"Unbekannter Typ\")\n    }\n}"
          },
          {
            "id": "go-05-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Verständnisfrage: Type Assertion ohne Komma-Ok",
              "en": "Concept Check: Type Assertion Without Comma-Ok"
            },
            "prompt": {
              "de": "Was passiert bei `val := i.(string)`, wenn die Variable `i` zur Laufzeit eine Ganzzahl `int` enthält?",
              "en": "What happens during `val := i.(string)` if `i` dynamically holds an `int` at runtime?"
            },
            "options": [
              "Das Programm stürzt mit einem Laufzeit-Panic ab ('panic: interface conversion: ...').",
              "Es wird ein leerer String \"\" zurückgegeben.",
              "Der Go-Compiler bricht den Build-Vorgang ab.",
              "Der int-Wert wird automatisch in einen ASCII-String umgewandelt."
            ],
            "distractorExplanations": {
              "1": {
                "de": "Der Nullwert '\"\"' wird nur dann geliefert, wenn die sichere Zwei-Wert-Form 'val, ok := i.(string)' verwendet wird und 'ok == false' ist.",
                "en": "Zero value is returned only when using the two-value form `val, ok := i.(string)`."
              },
              "2": {
                "de": "Der Compiler kann den konkreten Typ hinter einem 'any'-Interface nicht im Voraus kennen, daher kompiliert der Code ohne Warnung.",
                "en": "The compiler cannot determine dynamic interface types at build time; it compiles clean."
              },
              "3": {
                "de": "Go führt niemals automatische Typumwandlungen (Type Coercion) durch. Typkonvertierungen müssen explizit programmiert werden.",
                "en": "Go does not perform implicit type coercion; assertions must match strictly."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "Die Ein-Wert-Form `val := i.(T)` löst einen Panic aus, wenn der Typ nicht übereinstimmt. Daher ist in Go stets die sichere Form `val, ok := i.(T)` Pflicht.",
              "en": "The single-value assertion `val := i.(T)` panics on type mismatch. The comma-ok idiom `val, ok := i.(T)` must be used for safe handling."
            }
          },
          {
            "id": "go-05-sec-04",
            "type": "quiz_compiler_fix",
            "title": {
              "de": "Compiler-Labor: Interface-Methodensignatur erfüllen",
              "en": "Compiler Lab: Satisfy Interface Signature"
            },
            "prompt": {
              "de": "Der Compiler meldet, dass `ConsoleLogger` das Interface `Logger` nicht implementiert, weil die Methode `Log` den falschen Rückgabetyp deklariert (erwartet wird `error`, deklariert ist `string`). Korrigiere die Signatur in `ConsoleLogger`, damit das Interface erfüllt wird!",
              "en": "The compiler reports `ConsoleLogger` does not satisfy `Logger` due to a return type mismatch (expects `error`, declared `string`). Fix the method signature in `ConsoleLogger`!"
            },
            "explanation": {
              "de": "Damit ein Typ ein Interface erfüllt, müssen alle Methodennamen, Eingabeparameter und Rückgabetypen exakt übereinstimmen. `ConsoleLogger.Log` muss `error` (und im Erfolgsfall `return nil`) zurückgeben.",
              "en": "Types implement interfaces only when all method names, parameter types, and return types match precisely."
            },
            "buggyCode": "package main\n\nimport \"fmt\"\n\ntype Logger interface {\n    Log(msg string) error\n}\n\ntype ConsoleLogger struct{}\n\n// Fehler: Gibt string zurück statt error!\nfunc (c ConsoleLogger) Log(msg string) string {\n    fmt.Println(msg)\n    return \"ok\"\n}\n\nfunc Run(l Logger) {\n    l.Log(\"System gestartet\")\n}",
            "solutionCode": "package main\n\nimport \"fmt\"\n\ntype Logger interface {\n    Log(msg string) error\n}\n\ntype ConsoleLogger struct{}\n\n// Korrekt: Gibt error zurück (nil bei Erfolg)\nfunc (c ConsoleLogger) Log(msg string) error {\n    fmt.Println(msg)\n    return nil\n}\n\nfunc Run(l Logger) {\n    l.Log(\"System gestartet\")\n}",
            "compilerOutput": {
              "error": "./main.go:19:9: cannot use ConsoleLogger{} (value of type ConsoleLogger) as Logger value in argument to Run:\n\tConsoleLogger does not implement Logger (wrong type for method Log)\n\t\thave Log(msg string) string\n\t\twant Log(msg string) error",
              "success": "[go build ./main.go]\nKompilierung erfolgreich (0.02s) · Exit Code: 0\nStatus: ConsoleLogger erfüllt Interface 'Logger' vollständig!"
            }
          },
          {
            "id": "go-05-sec-05",
            "type": "quiz_inline_code",
            "title": {
              "de": "Inline-Code: Sichere Type Assertion",
              "en": "Inline Code: Safe Type Assertion"
            },
            "starterCode": "str, ___ := val.(string)\nif ok {\n    fmt.Println(str)\n}",
            "prompt": {
              "de": "Ergänze die zweite Variable, mit der geprüft wird, ob die Type Assertion auf `string` erfolgreich war:",
              "en": "Complete the second variable checking whether the type assertion to `string` succeeded:"
            },
            "options": [
              "ok",
              "err",
              "valid",
              "found"
            ],
            "distractorExplanations": {
              "err": {
                "de": "Type Assertions geben keinen 'error' zurück, sondern ein 'bool' (true/false). Das idiomatische Bezeichnerkürzel in Go lautet 'ok'.",
                "en": "Type assertions return a boolean flag named 'ok', not an 'error'."
              },
              "valid": {
                "de": "'valid' funktioniert syntaktisch, aber die nachfolgende if-Bedingung prüft 'if ok'. Das Standardkürzel in Go ist 'ok'.",
                "en": "The standard Go idiom for boolean success flags is 'ok'."
              },
              "found": {
                "de": "In Go ist 'ok' die universelle Konvention für Type Assertions, Map-Lookups und Channel-Empfangstests.",
                "en": "'ok' is the universal Go convention for assertions and lookups."
              }
            },
            "solution": "ok",
            "explanation": {
              "de": "Das Komma-Ok-Idiom `val, ok := i.(T)` schützt vor Abstürzen. Ist `ok == false`, bleibt `val` der Nullwert und das Programm läuft sicher weiter.",
              "en": "The comma-ok pattern `val, ok := i.(T)` guarantees safety, setting `ok = false` instead of panicking on mismatch."
            }
          }
        ]
      },
      {
        "id": "go-06-concurrency",
        "index": 6,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "6. Concurrency: Goroutines, Channels & WaitGroups",
          "en": "6. Concurrency: Goroutines, Channels & WaitGroups"
        },
        "duration": "35 min",
        "sections": [
          {
            "id": "go-06-sec-01",
            "type": "concept",
            "title": {
              "de": "Das CSP-Paradigma & Goroutines",
              "en": "The CSP Paradigm & Goroutines"
            },
            "content": {
              "de": "Go folgt Rob Pikes berühmtem Leitsatz:\n> *\"Do not communicate by sharing memory; instead, share memory by communicating.\"*\n\n* **Goroutines:** Werden mit dem Keyword `go` vor einem Funktionsaufruf gestartet. Sie besitzen einen minimalen dynamischen Stack (ca. 2 KB) und werden im User-Space durch Gos M:N-Scheduler auf Kernel-Threads verteilt.\n* **Keine geteilten Variablen:** Statt komplexer Mutex-Sperren kommunizieren Goroutines über typsichere Datenleitungen: **Channels**.",
              "en": "Go follows Rob Pike's core axiom:\n> *\"Do not communicate by sharing memory; instead, share memory by communicating.\"*\n\n* **Goroutines:** Started with the `go` keyword. They run with a tiny initial 2 KB stack multiplexed over OS threads via Go's user-space M:N scheduler.\n* **No Shared Mutable State:** Instead of locks, goroutines communicate via typed pipes called **Channels**."
            },
            "code": "go func(id int) {\n    fmt.Printf(\"Worker %d arbeitet nebenläufig\\n\", id)\n}(1)",
            "codeSnippet": "go func(id int) {\n    fmt.Printf(\"Worker %d arbeitet nebenläufig\\n\", id)\n}(1)"
          },
          {
            "id": "go-06-sec-02",
            "type": "concept",
            "title": {
              "de": "Channels: Ungepuffert vs. Gepuffert & sync.WaitGroup",
              "en": "Channels: Unbuffered vs. Buffered & sync.WaitGroup"
            },
            "content": {
              "de": "* **Ungepufferte Channels (`make(chan T)`):** Synchronisieren Sender und Empfänger. Der Sender blockiert, bis der Empfänger bereit ist, und umgekehrt (Handshake).\n* **Gepufferte Channels (`make(chan T, 10)`):** Besitzen einen internen Ringpuffer. Der Sender blockiert erst, wenn die Puffergrenze (10) erreicht ist.\n* **`sync.WaitGroup`:** Wartet auf die Fertigstellung mehrerer Goroutines:\n  - `wg.Add(n)`: Erhöht den Zähler (muss **vor** dem `go`-Start aufgerufen werden!)\n  - `defer wg.Done()`: Signalisiert Fertigstellung am Ende der Goroutine\n  - `wg.Wait()`: Blockiert, bis der Zähler 0 erreicht",
              "en": "* **Unbuffered Channels (`make(chan T)`):** Synchronous handshake. The sender blocks until the receiver is ready, and vice versa.\n* **Buffered Channels (`make(chan T, 10)`):** Contains an internal ring buffer. Senders only block when capacity is exhausted.\n* **`sync.WaitGroup`:** Coordinates goroutine completion:\n  - `wg.Add(n)`: Increments counter (**must** precede `go` call)\n  - `defer wg.Done()`: Decrements counter when goroutine exits\n  - `wg.Wait()`: Blocks until counter reaches zero"
            },
            "code": "var wg sync.WaitGroup\nfor i := 0; i < 3; i++ {\n    wg.Add(1)\n    go func(id int) {\n        defer wg.Done()\n        fmt.Printf(\"Task %d erledigt\\n\", id)\n    }(i)\n}\nwg.Wait() // Wartet auf alle 3 Worker",
            "codeSnippet": "var wg sync.WaitGroup\nfor i := 0; i < 3; i++ {\n    wg.Add(1)\n    go func(id int) {\n        defer wg.Done()\n        fmt.Printf(\"Task %d erledigt\\n\", id)\n    }(i)\n}\nwg.Wait() // Wartet auf alle 3 Worker"
          },
          {
            "id": "go-06-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Verständnisfrage: Ungepufferter Channel Deadlock",
              "en": "Concept Check: Unbuffered Channel Deadlock"
            },
            "prompt": {
              "de": "Was passiert bei `ch := make(chan int); ch <- 42` in einer einzelnen Goroutine (ohne parallelen Empfänger)?",
              "en": "What happens when executing `ch := make(chan int); ch <- 42` in a single goroutine without a concurrent receiver?"
            },
            "options": [
              "Das Programm stoppt mit einem fatalen Deadlock-Absturz ('fatal error: all goroutines are asleep - deadlock!').",
              "Die Zahl 42 wird zwischengespeichert und später abgerufen.",
              "Der Wert wird gelöscht und das Programm läuft normal weiter.",
              "Go startet automatisch eine Hintergrund-Goroutine für den Empfang."
            ],
            "distractorExplanations": {
              "1": {
                "de": "Ein ungepufferter Channel besitzt keine Speicherkapazität (Cap=0). Ein Zwischenspeichern ist nur bei gepufferten Channels wie 'make(chan int, 1)' möglich.",
                "en": "Unbuffered channels have zero capacity; buffering requires `make(chan int, 1)`."
              },
              "2": {
                "de": "Werte werden niemals stillschweigend verworfen. Go blockiert die Goroutine so lange, bis ein Empfänger bereitsteht.",
                "en": "Channels never discard data; the runtime halts until an active receiver reads the value."
              },
              "3": {
                "de": "Go startet niemals eigenmächtig Hintergrund-Goroutines ohne den expliziten Befehl 'go'.",
                "en": "Go never spawns hidden background goroutines automatically."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "Bei ungepufferten Channels blockiert das Senden `ch <- 42`, bis eine andere Goroutine `<-ch` ausführt. Da keine andere Goroutine existiert, schläft das gesamte Programm und die Go-Runtime erkennt den fatalen Deadlock.",
              "en": "Unbuffered sends block indefinitely until a peer reads `<-ch`. With no other goroutines running, the runtime triggers a fatal deadlock panic."
            }
          },
          {
            "id": "go-06-sec-04",
            "type": "quiz_compiler_fix",
            "title": {
              "de": "Compiler-Labor: WaitGroup Deadlock beheben",
              "en": "Compiler Lab: Fix WaitGroup Deadlock"
            },
            "prompt": {
              "de": "Im folgenden Worker-Programm blockiert `wg.Wait()` für immer, weil die Goroutine vergisst, `wg.Done()` aufzurufen. Füge `defer wg.Done()` in der Goroutine ein, damit der Zähler dekrementiert wird und das Programm fehlerfrei terminiert!",
              "en": "In the worker below, `wg.Wait()` deadlocks because the worker never calls `wg.Done()`. Add `defer wg.Done()` inside the goroutine so the counter decrements and the program finishes!"
            },
            "explanation": {
              "de": "Jedes `wg.Add(1)` muss mit einem korrespondierenden `wg.Done()` quittiert werden. Durch `defer wg.Done()` wird sichergestellt, dass die WaitGroup selbst im Falle vorzeitiger Returns oder Panics dekrementiert wird.",
              "en": "Every `wg.Add(1)` must be balanced with `wg.Done()`. Placing `defer wg.Done()` at the top of the goroutine ensures clean decrementing."
            },
            "buggyCode": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    wg.Add(1)\n\n    go func() {\n        // Fehler: wg.Done() fehlt! wg.Wait() wartet ewig!\n        fmt.Println(\"Datenverarbeitung abgeschlossen\")\n    }()\n\n    wg.Wait()\n    fmt.Println(\"Hauptprogramm beendet\")\n}",
            "solutionCode": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    wg.Add(1)\n\n    go func() {\n        defer wg.Done()\n        fmt.Println(\"Datenverarbeitung abgeschlossen\")\n    }()\n\n    wg.Wait()\n    fmt.Println(\"Hauptprogramm beendet\")\n}",
            "compilerOutput": {
              "error": "fatal error: all goroutines are asleep - deadlock!\ngoroutine 1 [semacquire]:\nsync.runtime_Semacquire(0x40c110)\n\t/usr/local/go/src/runtime/sema.go:62 +0x25\nsync.(*WaitGroup).Wait(0x40c108)\n\t/usr/local/go/src/sync/waitgroup.go:116 +0x7b",
              "success": "[go run ./main.go]\nKompilierung erfolgreich (0.03s) · Exit Code: 0\nAusgabe: Datenverarbeitung abgeschlossen\nHauptprogramm beendet"
            }
          },
          {
            "id": "go-06-sec-05",
            "type": "quiz_inline_code",
            "title": {
              "de": "Inline-Code: Werte aus Channel empfangen",
              "en": "Inline Code: Receive from Channel"
            },
            "starterCode": "msg := ___msgChan",
            "prompt": {
              "de": "Mit welchem Operator liest man einen Wert aus einem Channel aus?",
              "en": "Which operator reads a value from a channel?"
            },
            "options": [
              "<-",
              "->",
              "=>",
              ":="
            ],
            "distractorExplanations": {
              "->": {
                "de": "'->' existiert in Go nicht als Operator.",
                "en": "'->' does not exist in Go."
              },
              "=>": {
                "de": "'=>' ist der Fat-Arrow aus JS/PHP und existiert in Go nicht.",
                "en": "'=>' is not a valid Go operator."
              },
              ":=": {
                "de": "':=' steht links vor dem Variablennamen ('msg := ...'), nicht direkt vor dem Channel.",
                "en": "':=' precedes the variable name, not placed directly before the channel."
              }
            },
            "solution": "<-",
            "explanation": {
              "de": "Der Pfeil `<-` vor dem Channel-Namen (`val := <-ch`) empfängt den nächsten Wert aus dem Channel. Steht er hinter dem Channel (`ch <- val`), sendet er hinein.",
              "en": "Prefixing a channel with `<-` (`val := <-ch`) reads from it; postfixing (`ch <- val`) writes to it."
            }
          }
        ]
      },
      {
        "id": "go-07-tooling",
        "index": 7,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "7. Tooling, Module & HTTP-Webserver",
          "en": "7. Tooling, Modules & HTTP Web Servers"
        },
        "duration": "30 min",
        "sections": [
          {
            "id": "go-07-sec-01",
            "type": "concept",
            "title": {
              "de": "Die Go-Toolchain: Testen, Formatieren & Module",
              "en": "The Go Toolchain: Testing, Formatting & Modules"
            },
            "content": {
              "de": "Go bringt alle Entwickler-Werkzeuge nativ mit:\n\n* **`go mod init <name>`:** Initialisiert ein Modul mit `go.mod` und `go.sum` (kryptografische Hash-Prüfung aller Abhängigkeiten).\n* **`go test -v -race ./...`:** Führt alle Unit-Tests aus und aktiviert den ThreadSanitizer Race Detector.\n* **`go fmt ./...`:** Formatiert den gesamten Code nach dem universellen Go-Standard (keine Style-Diskussionen!).\n* **`go vet ./...`:** Statische Code-Analyse für subtile Bugs (z. B. ungenutzte Mutex-Kopien oder fehlerhafte Printf-Formatstrings).\n* **`go build -ldflags=\"-s -w\"`:** Kompiliert ein schlankes, gestripptes Single-Binary ohne externe Laufzeit-Abhängigkeiten.",
              "en": "Go ships with a complete built-in toolchain:\n\n* **`go mod init <name>`:** Sets up a module tracking dependencies via `go.mod` and cryptographic hashes in `go.sum`.\n* **`go test -v -race ./...`:** Runs all test suites instrumented with the ThreadSanitizer race detector.\n* **`go fmt ./...`:** Applies standard formatting across the codebase.\n* **`go vet ./...`:** Performs static analysis detecting suspicious constructs and printf mismatches.\n* **`go build -ldflags=\"-s -w\"`:** Generates optimized, stripped standalone binaries without external runtime dependencies."
            },
            "code": "# Neues Projekt initialisieren und testen\ngo mod init github.com/benzjeremy/api\ngo test -v -race ./...",
            "codeSnippet": "# Neues Projekt initialisieren und testen\ngo mod init github.com/benzjeremy/api\ngo test -v -race ./..."
          },
          {
            "id": "go-07-sec-02",
            "type": "concept",
            "title": {
              "de": "Native HTTP-Services mit net/http & JSON",
              "en": "Native HTTP Services with net/http & JSON"
            },
            "content": {
              "de": "Gos Standardbibliothek enthält mit `net/http` einen vollwertigen, extrem performanten HTTP/1.1- und HTTP/2-Server:\n\n* **Handler-Signatur:** Jeder HTTP-Endpunkt folgt der Signatur:\n  `func(w http.ResponseWriter, r *http.Request)`\n* **JSON-Encoding:** Mit `json.NewEncoder(w).Encode(data)` werden Structs direkt als JSON in den HTTP-Response-Stream geschrieben.\n* **Security & Performance:** Kein Apache, kein Nginx und kein NodeJS nötig. Go startet pro HTTP-Request automatisch eine eigene isolierte Goroutine.",
              "en": "Go's standard library `net/http` provides a battle-tested HTTP/1.1 and HTTP/2 engine:\n\n* **Handler Signature:** All handlers follow the standard contract:\n  `func(w http.ResponseWriter, r *http.Request)`\n* **JSON Encoding:** `json.NewEncoder(w).Encode(data)` streams serialized JSON directly to the client.\n* **Concurrency:** The runtime spawns an isolated goroutine for every incoming HTTP connection automatically."
            },
            "code": "package main\n\nimport (\n    \"encoding/json\"\n    \"net/http\"\n)\n\nfunc healthHandler(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    json.NewEncoder(w).Encode(map[string]string{\"status\": \"healthy\"})\n}\n\nfunc main() {\n    http.HandleFunc(\"/health\", healthHandler)\n    http.ListenAndServe(\":8080\", nil)\n}",
            "codeSnippet": "package main\n\nimport (\n    \"encoding/json\"\n    \"net/http\"\n)\n\nfunc healthHandler(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    json.NewEncoder(w).Encode(map[string]string{\"status\": \"healthy\"})\n}\n\nfunc main() {\n    http.HandleFunc(\"/health\", healthHandler)\n    http.ListenAndServe(\":8080\", nil)\n}"
          },
          {
            "id": "go-07-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Verständnisfrage: Race Conditions in Unit-Tests aufspüren",
              "en": "Concept Check: Detecting Race Conditions in Tests"
            },
            "prompt": {
              "de": "Mit welchem Befehl führst du in Go alle Unit-Tests deines Projekts aus und prüfst gleichzeitig auf ungeschützte nebenläufige Speicherzugriffe (Data Races)?",
              "en": "Which command runs all unit tests in Go while detecting unsynchronized memory races?"
            },
            "options": [
              "`go test -race ./...`",
              "`go check -all`",
              "`go sanitize --threads`",
              "`go debug -memory`"
            ],
            "distractorExplanations": {
              "1": {
                "de": "'go check' ist kein gültiger Befehl der Go-Toolchain.",
                "en": "'go check' is not a valid command in the Go toolchain."
              },
              "2": {
                "de": "'go sanitize' existiert nicht. Die Sanitizer-Funktionalität wird über das '-race'-Flag in 'go test' und 'go run' aktiviert.",
                "en": "'go sanitize' does not exist; thread checking is controlled via `-race`."
              },
              "3": {
                "de": "'go debug' ist kein Go-Befehl; zum Debuggen wird Delve ('dlv') verwendet.",
                "en": "'go debug' is not part of the Go CLI (use Delve / `dlv`)."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "`go test -race ./...` kompiliert alle Testpakete mit dem integrierten ThreadSanitizer und warnt zuverlässig bei konkurrierenden Variablen-Zugriffen.",
              "en": "`go test -race ./...` activates the built-in ThreadSanitizer instrumentation detecting concurrent access bugs."
            }
          },
          {
            "id": "go-07-sec-04",
            "type": "quiz_compiler_fix",
            "title": {
              "de": "Compiler-Labor: HTTP-Handler Signatur korrigieren",
              "en": "Compiler Lab: Fix HTTP Handler Signature"
            },
            "prompt": {
              "de": "Der folgende HTTP-Handler kompiliert nicht, weil die Parameterliste nicht der Standard-Signatur `http.HandlerFunc` (`w http.ResponseWriter, r *http.Request`) entspricht (der Request-Pointer fehlt). Korrigiere die Signatur in `StatusHandler`, damit der Server gebaut werden kann!",
              "en": "The HTTP handler fails to compile because the parameter signature does not match `http.HandlerFunc` (`w http.ResponseWriter, r *http.Request`). Fix the signature in `StatusHandler`!"
            },
            "explanation": {
              "de": "In Go ist `http.ResponseWriter` ein Interface (kein Pointer nötig), während `*http.Request` stets ein Pointer auf die konkrete Request-Struktur ist. Nur mit `(w http.ResponseWriter, r *http.Request)` ist der Handler kompatibel zu `http.HandleFunc`.",
              "en": "`http.ResponseWriter` is an interface, whereas `*http.Request` is always passed as a pointer. The handler signature must match `(w http.ResponseWriter, r *http.Request)`."
            },
            "buggyCode": "package main\n\nimport \"net/http\"\n\n// Fehler: Request muss *http.Request sein!\nfunc StatusHandler(w http.ResponseWriter, r http.Request) {\n    w.Write([]byte(\"OK\"))\n}\n\nfunc main() {\n    http.HandleFunc(\"/status\", StatusHandler)\n    http.ListenAndServe(\":8080\", nil)\n}",
            "solutionCode": "package main\n\nimport \"net/http\"\n\n// Korrekt: *http.Request als Zeiger\nfunc StatusHandler(w http.ResponseWriter, r *http.Request) {\n    w.Write([]byte(\"OK\"))\n}\n\nfunc main() {\n    http.HandleFunc(\"/status\", StatusHandler)\n    http.ListenAndServe(\":8080\", nil)\n}",
            "compilerOutput": {
              "error": "./main.go:10:29: cannot use StatusHandler (value of type func(w http.ResponseWriter, r http.Request)) as func(http.ResponseWriter, *http.Request) in argument to http.HandleFunc",
              "success": "[go build ./main.go]\nKompilierung fehlerfrei (0.02s) · Exit Code: 0\nHTTP Webserver erfolgreich kompiliert und startbereit!"
            }
          },
          {
            "id": "go-07-sec-05",
            "type": "quiz_inline_code",
            "title": {
              "de": "Inline-Code: HTTP-Route registrieren",
              "en": "Inline Code: Register HTTP Route"
            },
            "starterCode": "http.___(\"/api/v1\", apiHandler)",
            "prompt": {
              "de": "Mit welcher Funktion aus `net/http` registrierst du einen Pfad mit seiner zugehörigen Handler-Funktion am Standard-ServeMux?",
              "en": "Which function in `net/http` registers a path pattern with its handler function on the default ServeMux?"
            },
            "options": [
              "HandleFunc",
              "RegisterRoute",
              "AddEndpoint",
              "Listen"
            ],
            "distractorExplanations": {
              "RegisterRoute": {
                "de": "'RegisterRoute' ist keine Funktion der Go-Standardbibliothek (bekannt aus Third-Party Routern).",
                "en": "'RegisterRoute' is not a standard library function."
              },
              "AddEndpoint": {
                "de": "'AddEndpoint' existiert nicht in 'net/http'.",
                "en": "'AddEndpoint' does not exist in 'net/http'."
              },
              "Listen": {
                "de": "'http.ListenAndServe' startet den Netzwerk-Socket, registriert jedoch keine einzelnen Pfade.",
                "en": "'ListenAndServe' binds the network listener, rather than mapping handler paths."
              }
            },
            "solution": "HandleFunc",
            "explanation": {
              "de": "`http.HandleFunc(pattern, handler)` registriert einen HTTP-Pfad auf dem DefaultServeMux der Go-Standardbibliothek.",
              "en": "`http.HandleFunc(pattern, handler)` maps a pattern to a handler function on Go's default ServeMux."
            }
          }
        ]
      },
      {
        "id": "go-exam-90min",
        "index": 8,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): Go Cloud-Native & Concurrency",
          "en": "🎓 Final Exam (90 Min): Go Cloud-Native & Concurrency"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-go-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): Data Races & Race Detector",
              "en": "Question 1 (20 Points): Data Races & Race Detector"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Mehrere Goroutines greifen gleichzeitig lesend und schreibend auf eine gemeinsame Variable `counter++` zu, ohne Mutex oder Atomic-Operationen. Welches Tool der Go-Toolchain identifiziert dieses Problem im Testlauf?",
              "en": "Multiple goroutines read and write a shared `counter++` concurrently without a mutex or atomic operations. Which Go toolchain flag detects this during testing?"
            },
            "options": [
              "`go test -race ./...` (Der integrierte ThreadSanitizer Race Detector)",
              "`go fmt ./...`",
              "`go version`",
              "`go env -debug`"
            ],
            "distractorExplanations": {
              "1": {
                "de": "'go fmt' formatiert ausschließlich Quellcodedateien nach Style-Richtlinien, führt aber keinen Code aus und führt keine Laufzeitanalysen durch.",
                "en": "'go fmt' reformats source files and does not analyze runtime concurrency."
              },
              "2": {
                "de": "'go version' gibt lediglich die aktuell installierte Go-Compiler-Version aus.",
                "en": "'go version' simply outputs compiler version information."
              },
              "3": {
                "de": "'go env' zeigt Go-Umgebungsvariablen an (GOPATH, GOROOT, GOOS, GOARCH), prüft jedoch keine Programmlogik.",
                "en": "'go env' displays configuration variables, not race conditions."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "Das Flag `-race` kompiliert Code mit Go's integriertem Race Detector (auf Basis von ThreadSanitizer). Es protokolliert nicht synchronisierte konkurrierende Speicherzugriffe zur Laufzeit mit exaktem Stacktrace.",
              "en": "The `-race` flag instruments code with Go's built-in ThreadSanitizer race detector, identifying unsynchronized memory accesses with precise stacktraces."
            }
          },
          {
            "id": "exam-go-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): Korrekte Nutzung von sync.WaitGroup",
              "en": "Question 2 (20 Points): Proper sync.WaitGroup Usage"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Wo muss der Methodenaufruf `wg.Add(1)` platziert werden, wenn eine Goroutine gestartet wird, um eine Race Condition mit `wg.Wait()` zuverlässig auszuschließen?",
              "en": "Where must `wg.Add(1)` be called when launching a goroutine to avoid race conditions with `wg.Wait()`?"
            },
            "options": [
              "Unmittelbar VOR dem Start der Goroutine im aufrufenden Kontext.",
              "Innerhalb der Goroutine als allererste Anweisung.",
              "Nach dem Aufruf von `wg.Wait()`.",
              "In der `init()`-Funktion des Packages."
            ],
            "distractorExplanations": {
              "1": {
                "de": "Wird 'wg.Add(1)' innerhalb der Goroutine aufgerufen, kann 'wg.Wait()' im Hauptthread bereits durchlaufen sein, bevor der OS-Scheduler die Goroutine anstartet. Dies führt zu vorzeitigem Programmende!",
                "en": "Calling `wg.Add(1)` inside the goroutine allows `wg.Wait()` to return before the goroutine starts scheduling, causing premature termination."
              },
              "2": {
                "de": "Nach 'wg.Wait()' hat das Warten bereits geendet. Ein nachträgliches 'Add(1)' blockiert niemanden mehr.",
                "en": "Calling after `wg.Wait()` is too late, as synchronization has already finished."
              },
              "3": {
                "de": "Die 'init()'-Funktion läuft einmalig beim Programmstart; 'wg.Add(1)' muss jedoch dynamisch für jede neu erzeugte Goroutine aufgerufen werden.",
                "en": "`init()` runs once at boot and cannot dynamically track runtime goroutines."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "`wg.Add(1)` muss zwingend VOR dem Aufruf `go func()` erfolgen. Würde es innerhalb der Goroutine aufgerufen, könnte `wg.Wait()` ausgeführt werden, bevor die Goroutine überhaupt anläuft und den Zähler erhöht.",
              "en": "`wg.Add(1)` must be invoked BEFORE `go func()`. Calling it inside the goroutine creates a race where `wg.Wait()` might complete before the goroutine starts scheduling."
            }
          },
          {
            "id": "exam-go-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): Ausführungsreihenfolge von defer-Anweisungen",
              "en": "Question 3 (20 Points): Defer Execution Order"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "In einer Funktion stehen hintereinander die drei Anweisungen `defer fmt.Print(\"1\")`, `defer fmt.Print(\"2\")`, `defer fmt.Print(\"3\")`. Welche Ausgabe erscheint beim Verlassen der Funktion?",
              "en": "A function contains `defer fmt.Print(\"1\")`, `defer fmt.Print(\"2\")`, `defer fmt.Print(\"3\")`. What is the printed output upon function exit?"
            },
            "options": [
              "321 (LIFO - Last In, First Out)",
              "123 (FIFO - First In, First Out)",
              "Es wird nichts ausgegeben.",
              "Eine zufällige Permutation wie 213."
            ],
            "distractorExplanations": {
              "1": {
                "de": "FIFO ('First In, First Out') ist das Queue-Prinzip. 'defer' legt Aufrufe jedoch auf einen Call-Stack (LIFO), sodass der letzte Befehl als erster ausgeführt wird.",
                "en": "FIFO applies to queues; `defer` pushes onto a LIFO stack, executing the last added statement first."
              },
              "2": {
                "de": "'defer' verzögert die Ausführung lediglich, unterdrückt sie aber nicht.",
                "en": "`defer` postpones execution, it does not suppress output."
              },
              "3": {
                "de": "Die Ausführung ist streng deterministisch und niemals zufällig.",
                "en": "Execution is strictly deterministic and never random."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "`defer`-Aufrufe werden in Go auf einem Stack abgelegt und beim Verlassen der umgebenden Funktion in umgekehrter Reihenfolge (LIFO) ausgeführt. 3 wird daher zuerst ausgeführt, gefolgt von 2 und 1.",
              "en": "Deferred calls are pushed onto a stack and evaluated in Last-In-First-Out (LIFO) order when the surrounding function returns."
            }
          },
          {
            "id": "exam-go-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): Implizite Interfaces in Go",
              "en": "Question 4 (20 Points): Implicit Interfaces in Go"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Wie deklariert eine Struct in Go, dass sie ein bestimmtes Interface erfüllt?",
              "en": "How does a struct in Go declare that it satisfies an interface?"
            },
            "options": [
              "Implizit: Die Struct implementiert einfach alle Methoden des Interfaces mit passender Signatur. Es gibt kein `implements`-Schlüsselwort.",
              "Explizit über das Schlüsselwort `implements MyInterface` in der Typdeklaration.",
              "Über eine Annotation `@Implements(MyInterface)` vor der Struct.",
              "Durch Vererbung von einer abstrakten Basisklasse."
            ],
            "distractorExplanations": {
              "1": {
                "de": "Ein Schlüsselwort 'implements' existiert in Go nicht (bekannt aus Java/PHP/TypeScript). Go verzichtet bewusst auf explizite Bindung.",
                "en": "'implements' does not exist in Go (known from Java/PHP/TypeScript)."
              },
              "2": {
                "de": "Go besitzt keine Annotationen oder Dekoratoren mit '@'.",
                "en": "Go does not feature decorators or '@' annotations."
              },
              "3": {
                "de": "Go kennt keine Vererbung und keine abstrakten Basisklassen ('inheritance'). Stattdessen setzt Go auf Komposition ('composition over inheritance').",
                "en": "Go has no class inheritance or abstract classes; it favors composition."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "Go nutzt strukturelles Subtyping (Duck Typing zur Compile-Zeit). Sobald ein Typ alle im Interface deklarierten Methoden implementiert, erfüllt er das Interface automatisch ohne explizite Kopplung.",
              "en": "Go uses structural typing. A type implements an interface simply by implementing its required methods. No `implements` keyword exists."
            }
          },
          {
            "id": "exam-go-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Idiomatisches Error-Handling",
              "en": "Question 5 (20 Points): Idiomatic Error Handling"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Was ist der kanonische Weg, um in Go mit erwartbaren Fehlern (z. B. Datei nicht gefunden, Netzwerk-Timeout) umzugehen?",
              "en": "What is the canonical pattern in Go for handling anticipated errors (e.g., file not found, timeout)?"
            },
            "options": [
              "Die Funktion gibt `error` als letzten Rückgabewert zurück; der Aufrufer prüft sofort `if err != nil`.",
              "Es wird immer ein `panic()` ausgelöst, der im Root abgefangen wird.",
              "Fehler werden in eine globale Variable `errno` geschrieben.",
              "Fehler werden ignoriert, da Go fehlerfreien Code erzwingt."
            ],
            "distractorExplanations": {
              "1": {
                "de": "'panic()' ist in Go ausschließlich für unvorhersehbare Programmierfehler (z. B. Index out of range, Nil-Pointer) reserviert, nicht für reguläre Laufzeitfehler.",
                "en": "'panic()' is reserved for unexpected fatal defects, not standard control flow."
              },
              "2": {
                "de": "Globale Fehlervariablen wie 'errno' sind thread-unsicher und ein C-Relikt, das in Go durch explizite Rückgabewerte abgelöst wurde.",
                "en": "Global errno variables are thread-unsafe C patterns obsolete in Go."
              },
              "3": {
                "de": "Fehler dürfen in Go niemals ignoriert werden; unberücksichtigte Fehler führen zu unberechenbarem Systemverhalten.",
                "en": "Errors must be checked explicitly to ensure system resilience."
              }
            },
            "solution": 0,
            "explanation": {
              "de": "In Go sind Fehler reguläre Werte (`error`-Interface). Funktionen geben Fehler explizit zurück (`(result, error)`), und der aufrufende Code behandelt diese transparent ohne versteckten Exception-Kontrollfluss.",
              "en": "In Go, errors are normal values returned explicitly as the last tuple value. Callers handle them immediately using `if err != nil`."
            }
          }
        ],
        "scenario": {
          "de": "Handlungssituation: Sie sind Software-Architekt/in bei einem Cloud-Native-Dienstleister. Für ein Telemetrie-Gateway, das 50.000 Sensor-Datenströme pro Sekunde aggregiert, entwickeln Sie einen Hochleistungs-Daemon in Go. Beantworten Sie die Prüfungsfragen zur Vermeidung von Race Conditions, Deadlocks und inkorrektem Error-Handling.",
          "en": "Scenario: You are a software architect at a cloud-native consultancy. You are building a high-throughput telemetry gateway in Go aggregating 50,000 sensor streams/sec. Answer questions on preventing race conditions, deadlocks, and incorrect error handling."
        }
      }
    ]
  },
  {
    "id": "cybersecurity",
    "title": {
      "de": "Cybersecurity & IT-Sicherheit",
      "en": "Cybersecurity & IT Security"
    },
    "icon": "🛡️",
    "badge": "Kernfach",
    "desc": {
      "de": "CIA-Schutzziele, OWASP Top 10, Kryptografie (AES-256-GCM, PBKDF2), Härtung & DSGVO/LDI.",
      "en": "CIA triad, OWASP Top 10, cryptography (AES-256-GCM, PBKDF2), hardening & GDPR compliance."
    },
    "chapters": [
      {
        "id": "cyber-01-fundamentals",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. Schutzziele (CIA), Bedrohungen & OWASP Top 10",
          "en": "1. Protection Goals (CIA), Threats & OWASP Top 10"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "cyber-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Die CIA-Triade: Das Fundament aller Sicherheitskonzepte",
              "en": "The CIA Triad: Foundation of All Security Concepts"
            },
            "content": {
              "de": "Bevor eine einzige Zeile Code geschrieben wird, muss jedes Softwaresystem gegen die drei klassischen Schutzziele evaluiert werden:\n\n1. **Confidentiality (Vertraulichkeit):** Daten dürfen ausschließlich von autorisierten Entitäten eingesehen werden. Mittel: Ende-zu-Ende-Verschlüsselung (AES-256-GCM), Zugriffskontrolllisten (ACLs, RBAC).\n2. **Integrity (Integrität):** Daten dürfen nicht unbemerkt modifiziert oder gelöscht werden. Mittel: Kryptografische Hashes (SHA-256), HMACs, digitale Signaturen.\n3. **Availability (Verfügbarkeit):** Dienste und Systeme müssen für berechtigte Nutzer erreichbar sein. Mittel: Redundanz, USV, Lastverteilung, DDoS-Schutz, 3-2-1 Backup-Strategie.",
              "en": "Before writing a single line of code, any system must be evaluated against the three classic security objectives:\n\n1. **Confidentiality:** Data must only be accessible to authorized entities. Tools: End-to-end encryption (AES-256-GCM), Access Control Lists (ACLs, RBAC).\n2. **Integrity:** Data cannot be modified or deleted undetected. Tools: Cryptographic hashes (SHA-256), HMACs, digital signatures.\n3. **Availability:** Services and data must be accessible to authorized users when needed. Tools: Redundancy, UPS, load balancing, DDoS mitigation, 3-2-1 backup strategy."
            },
            "code": "// Zero-Dummy-Security: Strikte Authentifizierung und Integrität\n// 1. AES-256-GCM für Vertraulichkeit & Manipulationserkennung\n// 2. PBKDF2 (100.000 Iterationen) oder Argon2id für Schlüsselableitung",
            "codeSnippet": "// Zero-Dummy-Security: Strikte Authentifizierung und Integrität\n// 1. AES-256-GCM für Vertraulichkeit & Manipulationserkennung\n// 2. PBKDF2 (100.000 Iterationen) oder Argon2id für Schlüsselableitung"
          },
          {
            "id": "cyber-01-sec-02",
            "type": "quiz_choice",
            "title": {
              "de": "Fachliche Fallanalyse: Zuordnung von Schutzzielen",
              "en": "Case Analysis: Protection Goal Mapping"
            },
            "prompt": {
              "de": "Ein Angreifer verändert unbemerkt die IBAN in einer noch nicht ausgeführten Überweisungsdatei auf einem Server. Welches Schutzziel der Informationssicherheit wurde hierbei primär verletzt?",
              "en": "An attacker covertly alters the IBAN in an unexecuted bank transfer file stored on a server. Which primary security objective has been violated?"
            },
            "options": [
              "Vertraulichkeit (Confidentiality)",
              "Integrität (Integrity)",
              "Verfügbarkeit (Availability)",
              "Nichtabstreitbarkeit (Non-Repudiation)"
            ],
            "solution": 1,
            "explanation": {
              "de": "Die Integrität garantiert die Korrektheit und Unverfälschtheit von Daten. Da die Kontonummer verändert wurde, ist der Datenbestand manipuliert worden (Integritätsverletzung).",
              "en": "Integrity guarantees the accuracy and completeness of data. Since the account number was altered, data has been tampered with (loss of integrity)."
            }
          },
          {
            "id": "cyber-01-sec-03",
            "type": "concept",
            "title": {
              "de": "OWASP Top 10: SQL-Injection & Prepared Statements",
              "en": "OWASP Top 10: SQL Injection & Prepared Statements"
            },
            "content": {
              "de": "SQL-Injection tritt auf, wenn unvalidierte Nutzereingaben direkt in SQL-Befehlsstrings verkettet werden (`\"SELECT * FROM users WHERE user = '\" + input + \"'\"`).\n\n**Die einzige wirksame Schutzmaßnahme auf Code-Ebene:**\nNiemals Eingaben in den SQL-String einbauen! Verwende **Prepared Statements** (parametrisierte Abfragen). Hierbei sendet der Treiber zuerst die Abfragestruktur mit Platzhaltern an die Datenbank und in einem getrennten Schritt die Rohdaten. Die Datenbank-Engine behandelt Eingaben prinzipbedingt als reine Werte und niemals als ausführbaren SQL-Code.",
              "en": "SQL Injection occurs when untrusted user input is directly concatenated into SQL query strings.\n\n**The only reliable defense on code level:**\nNever concatenate raw input! Use **Prepared Statements** (parameterized queries). The query structure is compiled first, and parameters are sent separately. The database engine treats parameters strictly as data, rendering code injection impossible."
            },
            "code": "// FALSCH (Gefahr von SQL-Injection):\n// db.Query(\"SELECT * FROM users WHERE name = '\" + userInput + \"'\")\n\n// RICHTIG (Prepared Statement mit Platzhalter):\nstmt, err := db.Prepare(\"SELECT id, email FROM users WHERE name = ?\")\nrows, err := stmt.Query(userInput)",
            "codeSnippet": "// FALSCH (Gefahr von SQL-Injection):\n// db.Query(\"SELECT * FROM users WHERE name = '\" + userInput + \"'\")\n\n// RICHTIG (Prepared Statement mit Platzhalter):\nstmt, err := db.Prepare(\"SELECT id, email FROM users WHERE name = ?\")\nrows, err := stmt.Query(userInput)"
          },
          {
            "id": "cyber-01-sec-04",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: Sicheres Passwort-Hashing",
              "en": "Code Puzzle: Secure Password Hashing"
            },
            "starterCode": "hashedKey := ___ .Key([]byte(password), salt, 100000, 32, sha256.New)",
            "prompt": {
              "de": "Passwörter dürfen niemals im Klartext oder mit schnellen Algorithmen wie MD5/SHA-1 gespeichert werden. Welcher kryptografische Schlüsselableitungsstandard verlangsamt Brute-Force-Angriffe?",
              "en": "Passwords must never be stored in plaintext or with fast algorithms like MD5/SHA-1. Which key derivation standard slows down brute-force attacks?"
            },
            "options": [
              "pbkdf2",
              "md5",
              "rot13",
              "base64"
            ],
            "solution": "pbkdf2",
            "explanation": {
              "de": "PBKDF2 (Password-Based Key Derivation Function 2) wendet mit 100.000 Iterationen gezielt Rechenzeit auf, um Wörterbuch- und Brute-Force-Attacken wirtschaftlich sinnlos zu machen.",
              "en": "PBKDF2 applies 100,000 iterations to make dictionary and brute-force attacks computationally impractical."
            }
          }
        ]
      },
      {
        "id": "cyber-exam-90min",
        "index": 2,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): Security Audit & Härtung",
          "en": "🎓 Final Exam (90 Min): Security Audit & Hardening"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-cyb-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): Netzwerkarchitektur & DMZ",
              "en": "Question 1 (20 Points): Network Architecture & DMZ"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Der Webserver des Kunden kommuniziert mit der MySQL-Kundendatenbank. Welche Platzierung entspricht dem BSI-Sicherheitsstandard für eine mehrstufige Firewall-Architektur?",
              "en": "The client's web server communicates with the MySQL customer database. Which placement conforms to security best practices for a tiered firewall architecture?"
            },
            "options": [
              "Sowohl Webserver als auch Datenbankserver stehen direkt im ungeschützten WAN.",
              "Der Webserver steht in der DMZ (Demilitarisierte Zone); der Datenbankserver steht im internen, geschützten LAN.",
              "Der Datenbankserver steht in der DMZ; der Webserver steht im internen LAN.",
              "Beide Server stehen zusammen in der DMZ und sind von außen direkt über Port 3306 erreichbar."
            ],
            "solution": 1,
            "explanation": {
              "de": "Öffentlich erreichbare Dienste (wie HTTP/HTTPS) gehören in eine DMZ. Sensible Backend-Datenbanken dürfen niemals direkt aus dem WAN erreichbar sein, sondern stehen im internen Netz und dürfen nur über strikte Firewall-Regeln exklusiv von der DMZ angesprochen werden.",
              "en": "Public-facing services (HTTP/HTTPS) belong in a DMZ. Sensitive databases must never be directly accessible from the WAN; they reside in the internal network with strictly filtered ingress from the DMZ."
            }
          },
          {
            "id": "exam-cyb-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): OWASP Broken Object Level Authorization (IDOR)",
              "en": "Question 2 (20 Points): OWASP Broken Object Level Authorization (IDOR)"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Ein angemeldeter Kunde (User-ID 402) ruft seine Rechnung über die URL `https://shop.example.com/api/invoice/402` ab. Ändert er die Zahl in der URL manuell auf 403, erhält er die Rechnung eines anderen Kunden. Welches Schutzkonzept fehlt hier?",
              "en": "An authenticated user (ID 402) accesses an invoice via `https://shop.example.com/api/invoice/402`. Changing the URL to 403 displays another user's invoice. What protection is missing?"
            },
            "options": [
              "Serverseitige Autorisierungsprüfung auf Objektebene (Rechteprüfung: Gehört Objekt 403 zur authentifizierten Session?)",
              "Eine Umstellung von HTTPS auf HTTP",
              "Ausblendung der URL-Leiste im Browser des Benutzers",
              "Erhöhung der Passwortlänge des Nutzers auf mindestens 20 Zeichen"
            ],
            "solution": 0,
            "explanation": {
              "de": "Das Phänomen heißt IDOR (Insecure Direct Object Reference / OWASP A01). Eine Authentifizierung (Wer bist du?) genügt nicht – der Server muss bei jeder Anfrage autorisieren (Darf dieser Nutzer auf genau diese Ressourcen-ID zugreifen?).",
              "en": "This is IDOR (Insecure Direct Object Reference / OWASP A01). Authentication alone is insufficient; every request requires object-level authorization checking whether the session owns the resource."
            }
          },
          {
            "id": "exam-cyb-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): Hybrid-Kryptografie im TLS-Handshake",
              "en": "Question 3 (20 Points): Hybrid Cryptography in TLS Handshake"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Warum nutzt TLS (HTTPS) ein hybrides Verschlüsselungsverfahren aus asymmetrischer und symmetrischer Kryptografie?",
              "en": "Why does TLS (HTTPS) employ hybrid encryption combining asymmetric and symmetric cryptography?"
            },
            "options": [
              "Asymmetrische Verschlüsselung ist rechenintensiv, daher dient sie nur zum Schlüsselaustausch; die eigentlichen Nutzdaten werden schnell und effizient symmetrisch (z. B. AES-GCM) verschlüsselt.",
              "Symmetrische Verschlüsselung ist sicherer als asymmetrische, weshalb asymmetrische Verfahren gar nicht mehr genutzt werden.",
              "Weil Zertifikate nur mit unverschlüsselten Texten funktionieren.",
              "Um Daten doppelt zu verschlüsseln, damit zwei Passwörter gleichzeitig eingegeben werden müssen."
            ],
            "solution": 0,
            "explanation": {
              "de": "Asymmetrische Verfahren (RSA, ECDH) lösen das Problem des sicheren Schlüsselaustauschs über unsichere Kanäle, sind jedoch rechenaufwendig. Die symmetrische Verschlüsselung (AES) ist um Faktoren schneller und übernimmt den Transport der Massendaten.",
              "en": "Asymmetric encryption solves the secure key-exchange problem over untrusted channels but is computationally expensive. Symmetric encryption (AES) is drastically faster and handles payload encryption."
            }
          },
          {
            "id": "exam-cyb-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): DSGVO-Meldepflicht bei Sicherheitsvorfällen",
              "en": "Question 4 (20 Points): GDPR Breach Notification Deadline"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "In einer Kundendatenbank wurden sensible personenbezogene Daten entwendet. Innerhalb welcher Frist muss dieser Vorfall nach Art. 33 DSGVO an die zuständige Aufsichtsbehörde (z. B. LDI NRW) gemeldet werden?",
              "en": "A security breach exposed sensitive personal customer data. Within what timeframe must this incident be reported to the supervisory authority under Art. 33 GDPR?"
            },
            "options": [
              "Binnen 72 Stunden ab Bekanntwerden des Vorfalls.",
              "Innerhalb von 30 Werktagen nach Abschluss der internen Ermittlungen.",
              "Erst zum Ende des laufenden Geschäftsjahres.",
              "Es besteht keine Meldepflicht, solange die Backups noch vorhanden sind."
            ],
            "solution": 0,
            "explanation": {
              "de": "Nach Art. 33 Abs. 1 DSGVO muss eine Verletzung des Schutzes personenbezogener Daten unverzüglich und möglichst binnen 72 Stunden nach Bekanntwerden der zuständigen Aufsichtsbehörde gemeldet werden.",
              "en": "Under Art. 33(1) GDPR, personal data breaches must be reported to the competent supervisory authority without undue delay and, where feasible, not later than 72 hours after becoming aware."
            }
          },
          {
            "id": "exam-cyb-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Cross-Site Request Forgery (CSRF) & SameSite",
              "en": "Question 5 (20 Points): Cross-Site Request Forgery (CSRF) & SameSite"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Ein Nutzer besucht eine schadhafte Website, die unbemerkt im Hintergrund ein POST-Formular an seine Bank sendet. Welches Attribut im Session-Cookie verhindert, dass der Browser das Cookie bei Cross-Site-Requests mitsendet?",
              "en": "A user visits a malicious website that covertly submits a POST form to their bank. Which cookie attribute prevents the browser from attaching session cookies on cross-site requests?"
            },
            "options": [
              "SameSite=Strict oder SameSite=Lax",
              "HttpOnly=false",
              "Secure=disabled",
              "Path=/public"
            ],
            "solution": 0,
            "explanation": {
              "de": "Das Cookie-Attribut `SameSite=Strict` unterbindet die Übermittlung von Cookies bei allen Cross-Site-Anfragen. `SameSite=Lax` erlaubt Cookies nur bei sicheren Top-Level-GET-Navigationen.",
              "en": "The `SameSite=Strict` cookie attribute blocks cookie transmission on all cross-site requests. `SameSite=Lax` permits it only on top-level safe GET navigations."
            }
          }
        ],
        "scenario": {
          "de": "Ausgangssituation: Sie sind Fachinformatiker/in bei der CyberSecure GmbH. Ihr Kunde betreibt einen webbasierten Onlineshop mit angeschlossener Kundendatenbank. Im Rahmen eines Sicherheitsaudits sollen Sie die Architektur auf Schwachstellen prüfen, Incident-Response-Maßnahmen festlegen und Härtungsstandards nach BSI IT-Grundschutz umsetzen.",
          "en": "Scenario: You are an IT specialist at CyberSecure GmbH. Your client operates an e-commerce shop connected to a customer database. In a comprehensive security audit, you must identify vulnerabilities, specify incident response measures, and enforce hardening standards."
        }
      }
    ]
  },
  {
    "id": "sql",
    "title": {
      "de": "SQL & Relationale Datenbanken",
      "en": "SQL & Relational Databases"
    },
    "icon": "🗄️",
    "badge": "Data Integrity",
    "desc": {
      "de": "Relationales Modell, ACID, Normalisierung (1NF–3NF), Joins, Indizes & Transaktionen.",
      "en": "Relational model, ACID, normalization (1NF–3NF), joins, indexes & transactions."
    },
    "chapters": [
      {
        "id": "sql-01-relational-model",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. Relationales Modell, Normalisierung & ACID",
          "en": "1. Relational Model, Normalization & ACID"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "sql-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Das relationale Modell: Tabellen, Zeilen & Relationen",
              "en": "The Relational Model: Tables, Rows & Relations"
            },
            "content": {
              "de": "1970 bewies Edgar F. Codd, dass Datenunabhängigkeit erreicht werden kann, indem Daten als mathematische Relationen (Tabellen) modelliert werden.\n\n* **Tupel (Zeilen):** Repräsentieren einzelne Datensätze (Entitäten).\n* **Attribute (Spalten):** Beschreiben Eigenschaften mit festem Datentyp.\n* **Primärschlüssel (Primary Key):** Identifiziert jedes Tupel eineindeutig und darf niemals `NULL` sein.\n* **Fremdschlüssel (Foreign Key):** Verweist auf den Primärschlüssel einer anderen Tabelle und garantiert **referentielle Integrität** (`ON DELETE CASCADE` / `RESTRICT`).",
              "en": "In 1970, Edgar F. Codd demonstrated that data independence is achieved by structuring data into mathematical relations (tables).\n\n* **Tuples (Rows):** Represent individual entity records.\n* **Attributes (Columns):** Describe properties with defined data types.\n* **Primary Key:** Uniquely identifies each tuple and must never be `NULL`.\n* **Foreign Key:** References the primary key of another table, ensuring **referential integrity**."
            },
            "code": "CREATE TABLE kunden (\n    kunden_nr INT PRIMARY KEY AUTO_INCREMENT,\n    nachname VARCHAR(100) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL\n);\n\nCREATE TABLE bestellungen (\n    bestell_nr INT PRIMARY KEY,\n    kunden_nr INT NOT NULL,\n    betrag DECIMAL(10, 2) NOT NULL,\n    FOREIGN KEY (kunden_nr) REFERENCES kunden(kunden_nr) ON DELETE RESTRICT\n);",
            "codeSnippet": "CREATE TABLE kunden (\n    kunden_nr INT PRIMARY KEY AUTO_INCREMENT,\n    nachname VARCHAR(100) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL\n);\n\nCREATE TABLE bestellungen (\n    bestell_nr INT PRIMARY KEY,\n    kunden_nr INT NOT NULL,\n    betrag DECIMAL(10, 2) NOT NULL,\n    FOREIGN KEY (kunden_nr) REFERENCES kunden(kunden_nr) ON DELETE RESTRICT\n);"
          },
          {
            "id": "sql-01-sec-02",
            "type": "quiz_choice",
            "title": {
              "de": "Prüfungsfrage: Die 3. Normalform (3NF)",
              "en": "Exam Question: Third Normal Form (3NF)"
            },
            "prompt": {
              "de": "Gegeben ist eine Tabelle mit Kundendaten, die bereits die 2. Normalform erfüllt. Das Attribut 'Wohnort' ist jedoch funktional abhängig von der 'Postleitzahl' (PLZ), welche selbst kein Primärschlüssel ist. Welcher Regelverstoß liegt vor?",
              "en": "A table fulfills 2NF. However, the attribute 'City' is functionally dependent on 'Postal Code' (ZIP), which is not a candidate key. Which normalization rule is violated?"
            },
            "options": [
              "Verletzung der 1. Normalform wegen fehlender atomarer Werte",
              "Verletzung der 2. Normalform wegen partieller Schlüsselabhängigkeit",
              "Verletzung der 3. Normalform wegen einer transitiven Abhängigkeit",
              "Verletzung der Boyce-Codd-Normalform (BCNF)"
            ],
            "solution": 2,
            "explanation": {
              "de": "Die 3. Normalform verlangt, dass kein Nicht-Schlüsselattribut transitiv von einem anderen Nicht-Schlüsselattribut abhängt (Primärschlüssel -> PLZ -> Ort). Die Lösung besteht darin, PLZ und Ort in eine eigene Referenztabelle auszulagern.",
              "en": "The 3rd Normal Form mandates that no non-key attribute is transitively dependent on another non-key attribute (PK -> ZIP -> City). This requires extracting ZIP/City into a dedicated table."
            }
          },
          {
            "id": "sql-01-sec-03",
            "type": "concept",
            "title": {
              "de": "ACID-Prinzipien für verlässliche Transaktionen",
              "en": "ACID Principles for Reliable Transactions"
            },
            "content": {
              "de": "Eine Transaktion ist eine Folge von Operationen, die als logische Einheit ausgeführt wird:\n\n* **Atomicity (Atomarität):** Alles oder nichts. Scheitert ein Teilschritt, erfolgt ein `ROLLBACK`.\n* **Consistency (Konsistenz):** Die Datenbank befindet sich vor und nach der Transaktion in einem gültigen Zustand nach allen Constraints.\n* **Isolation (Isolation):** Gleichzeitige Transaktionen sehen keine unfertigen Zwischenzustände anderer Transaktionen.\n* **Durability (Dauerhaftigkeit):** Nach einem erfolgreichen `COMMIT` gehen Daten selbst bei einem totalen Stromausfall nicht verloren (Write-Ahead-Log).",
              "en": "A transaction is a sequence of database operations executed as a single logical unit:\n\n* **Atomicity:** All-or-nothing execution. Partial failure triggers a `ROLLBACK`.\n* **Consistency:** Constraints remain valid before and after transaction execution.\n* **Isolation:** Concurrent transactions execute without mutual interference.\n* **Durability:** Committed changes persist reliably across system crashes."
            },
            "code": "START TRANSACTION;\nUPDATE konto SET saldo = saldo - 500 WHERE konto_nr = 101;\nUPDATE konto SET saldo = saldo + 500 WHERE konto_nr = 202;\nCOMMIT;",
            "codeSnippet": "START TRANSACTION;\nUPDATE konto SET saldo = saldo - 500 WHERE konto_nr = 101;\nUPDATE konto SET saldo = saldo + 500 WHERE konto_nr = 202;\nCOMMIT;"
          },
          {
            "id": "sql-01-sec-04",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: Inner Join Verknüpfung",
              "en": "Code Puzzle: Inner Join Linking"
            },
            "starterCode": "SELECT k.nachname, b.betrag FROM kunden k ___ JOIN bestellungen b ON k.kunden_nr = b.kunden_nr",
            "prompt": {
              "de": "Verknüpfe die Tabelle `kunden` mit der Tabelle `bestellungen` über das gemeinsame Schlüsselattribut `kunden_nr`:",
              "en": "Join the `kunden` table with `bestellungen` using the shared key `kunden_nr`:"
            },
            "options": [
              "INNER",
              "OUTER",
              "CROSS",
              "UNION"
            ],
            "solution": "INNER",
            "explanation": {
              "de": "`INNER JOIN` selektiert nur diejenigen Zeilen, für die in beiden verknüpften Tabellen eine Übereinstimmung der Join-Bedingung vorliegt.",
              "en": "`INNER JOIN` returns only rows that have matching records in both joined tables."
            }
          }
        ]
      },
      {
        "id": "sql-exam-90min",
        "index": 2,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): Datenbankdesign & SQL-Abfragen",
          "en": "🎓 Final Exam (90 Min): Database Design & SQL Queries"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-sql-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): Auflösung einer n:m Kardinalität",
              "en": "Question 1 (20 Points): Resolving an n:m Cardinality"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Ein Fahrer kann mehrere Fahrzeuge führen, und ein Fahrzeug kann von mehreren Fahrern genutzt werden (n:m Beziehung). Wie wird diese Beziehung in einem relationalen Datenbankschema fachgerecht aufgelöst?",
              "en": "A driver can operate multiple vehicles, and a vehicle can be driven by multiple drivers (n:m relationship). How is this relationship correctly resolved in a relational schema?"
            },
            "options": [
              "Durch Hinzufügen einer kommagetrennten Fahrzeug-Liste in die Tabelle `fahrer`.",
              "Über eine eigenständige Zuordnungstabelle (Assoziationstabelle), die Fremdschlüssel auf Fahrer und Fahrzeug enthält.",
              "Indem der Primärschlüssel der Fahrzeugtabelle direkt als Fremdschlüssel in die Fahrertabelle eingefügt wird.",
              "Eine n:m Beziehung kann in SQL-Datenbanken prinzipbedingt nicht abgebildet werden."
            ],
            "solution": 1,
            "explanation": {
              "de": "Relational können n:m Beziehungen ausschließlich über eine eigenständige Zwischentabelle (z. B. `fahrer_fahrzeug`) aufgelöst werden. Diese enthält Fremdschlüssel auf beide Entitäten, die zusammen oft den zusammengesetzten Primärschlüssel bilden.",
              "en": "In relational theory, n:m relationships must be resolved through a junction (associative) table holding foreign keys referencing both primary entities."
            }
          },
          {
            "id": "exam-sql-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): Filterung von Aggregaten mit HAVING",
              "en": "Question 2 (20 Points): Aggregate Filtering with HAVING"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Sie möchten alle Kunden ermitteln, die in Summe mehr als 1.000 € Umsatz generiert haben. Welcher Filter-Befehl muss für die Bedingung `SUM(betrag) > 1000` verwendet werden?",
              "en": "You want to find all customers who generated total sales exceeding 1,000 €. Which clause must filter the condition `SUM(betrag) > 1000`?"
            },
            "options": [
              "WHERE SUM(betrag) > 1000",
              "HAVING SUM(betrag) > 1000",
              "ORDER BY SUM(betrag) > 1000",
              "GROUP BY SUM(betrag) > 1000"
            ],
            "solution": 1,
            "explanation": {
              "de": "`WHERE` filtert einzelne Zeilen VOR der Gruppierung. `HAVING` filtert Gruppen NACH der Aggregation. Bedingungen mit Aggregatfunktionen wie `SUM()` oder `COUNT()` verlangen zwingend `HAVING`.",
              "en": "`WHERE` filters individual rows BEFORE grouping. `HAVING` filters aggregated groups AFTER `GROUP BY`. Aggregate functions must be placed in `HAVING`."
            }
          },
          {
            "id": "exam-sql-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): Verhalten von LEFT JOIN bei fehlenden Partnerdaten",
              "en": "Question 3 (20 Points): LEFT JOIN Behavior on Missing Data"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Ein `LEFT OUTER JOIN` verbindet die linke Tabelle `kunden` mit der rechten Tabelle `bestellungen`. Was steht in den Spalten der Tabelle `bestellungen`, wenn ein Kunde bisher noch keine Bestellung aufgegeben hat?",
              "en": "A `LEFT OUTER JOIN` connects left table `kunden` with right table `bestellungen`. What values appear in the `bestellungen` columns if a customer has placed no orders?"
            },
            "options": [
              "Die Zeile dieses Kunden wird in der Ergebnismenge komplett ignoriert.",
              "Die Spalten enthalten den Wert `NULL`.",
              "Die Spalten enthalten die Zahl 0 bzw. Leerstrings.",
              "Die Datenbank bricht die Abfrage mit einem Constraint-Error ab."
            ],
            "solution": 1,
            "explanation": {
              "de": "Ein `LEFT JOIN` liefert immer alle Zeilen der linken Tabelle. Findet sich in der rechten Tabelle kein korrespondierender Datensatz, werden alle Spalten der rechten Seite mit `NULL` aufgefüllt.",
              "en": "A `LEFT JOIN` guarantees preservation of all rows from the left table. If no match exists in the right table, right-side columns are populated with `NULL`."
            }
          },
          {
            "id": "exam-sql-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): B-Tree Indexierung & Query Performance",
              "en": "Question 4 (20 Points): B-Tree Indexing & Query Performance"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Eine Tabelle mit 5.000.000 Kundendatensätzen wird häufig über die Spalte `email` abgefragt (`WHERE email = ?`). Wie verhindert man einen zeitintensiven Full Table Scan?",
              "en": "A table with 5,000,000 customer records is frequently queried via `email` (`WHERE email = ?`). How do you avoid a slow full table scan?"
            },
            "options": [
              "Anlegen eines B-Tree Indexes: `CREATE INDEX idx_kunden_email ON kunden(email);`",
              "Verkürzen der E-Mail-Adressen auf maximal 5 Zeichen",
              "Löschen von 4.000.000 Datensätzen aus der Datenbank",
              "Nutzung von `SELECT *` statt gezielter Spaltenauswahl"
            ],
            "solution": 0,
            "explanation": {
              "de": "Ein B-Tree-Index ermöglicht logarithmische Suchzeiten `O(log n)` anstelle linearer Tabellenabtastung `O(n)`. Der Datenbank-Optimizer nutzt den Index gezielt für Index-Seek-Operationen.",
              "en": "A B-Tree index provides logarithmic search complexity `O(log n)` instead of linear scans `O(n)`. The query optimizer uses index seeks."
            }
          },
          {
            "id": "exam-sql-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Verhinderung von SQL-Injections",
              "en": "Question 5 (20 Points): Preventing SQL Injections"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Ein Login-Formular prüft Benutzername und Passwort. Welche Methode schützt auf Software-Ebene absolut zuverlässig gegen SQL-Injection-Angriffe?",
              "en": "A login form validates username and password. Which method reliably protects against SQL injection on application level?"
            },
            "options": [
              "Die konsequente Verwendung von Prepared Statements mit gebundenen Parametern.",
              "Das Ersetzen von einfachen Anführungszeichen durch doppelte Anführungszeichen via Regex.",
              "Die Verschlüsselung des Webservers mit BitLocker.",
              "Das Deaktivieren der Fehleranzeige in der HTML-Oberfläche."
            ],
            "solution": 0,
            "explanation": {
              "de": "Prepared Statements trennen den SQL-Befehlscode strikt von den Benutzereingabedaten. Nutzereingaben werden vom RDBMS-Parser niemals als SQL-Syntax interpretiert.",
              "en": "Prepared statements strictly separate executable SQL grammar from user parameter values. Untrusted input is never parsed as SQL syntax."
            }
          }
        ],
        "scenario": {
          "de": "Handlungssituation: Sie sind Anwendungsentwickler/in bei einem Logistikdienstleister. Für die Erfassung von Frachtaufträgen, LKW-Flotten und Fahrern soll ein neues relationales Datenbankschema entworfen und optimiert werden. Beantworten Sie die anstehenden Fachfragen zur Datenmodellierung und SQL-Syntax.",
          "en": "Scenario: You are a software developer at a logistics provider. A new relational schema for freight orders, vehicle fleets, and drivers must be designed and tuned. Answer the questions regarding data modeling and SQL syntax."
        }
      }
    ]
  },
  {
    "id": "csharp",
    "title": {
      "de": "C# & .NET Enterprise",
      "en": "C# & .NET Enterprise"
    },
    "icon": "🎯",
    "badge": "Enterprise Core",
    "desc": {
      "de": "Kompilierte CLR, Managed Memory, Garbage Collection, LINQ, OOP & Entwurfsmuster.",
      "en": "Compiled CLR, managed memory, garbage collection, LINQ, OOP & design patterns."
    },
    "chapters": [
      {
        "id": "csharp-01-fundamentals",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. CLR, Managed Memory & Objektorientierung",
          "en": "1. CLR, Managed Memory & Object Orientation"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "cs-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Die Common Language Runtime (CLR) & CIL",
              "en": "The Common Language Runtime (CLR) & CIL"
            },
            "content": {
              "de": "Wenn C#-Code kompiliert wird, entsteht kein nativer Maschinencode, sondern Zwischencode: die **Common Intermediate Language (CIL)**.\n\nDie Ausführung übernimmt die **CLR (Common Language Runtime)**:\n1. Der **Just-In-Time (JIT) Compiler** übersetzt CIL zur Laufzeit hochoptimiert in native CPU-Befehle.\n2. **Managed Memory:** Entwickler müssen keinen Speicher manuell per `free()` oder `delete` freigeben – der Garbage Collector verwaltet den Heap automatisch.",
              "en": "Compiling C# produces Common Intermediate Language (CIL) bytecode rather than machine code.\n\nThe **CLR (Common Language Runtime)** executes the application:\n1. The **JIT Compiler** turns CIL into native machine instructions on the fly.\n2. **Managed Memory:** Memory is safely collected by the runtime's Garbage Collector."
            },
            "code": "using System;\n\nnamespace EnterpriseApp\n{\n    public class Program\n    {\n        public static void Main(string[] args)\n        {\n            Console.WriteLine(\"Hello .NET Enterprise!\");\n        }\n    }\n}",
            "codeSnippet": "using System;\n\nnamespace EnterpriseApp\n{\n    public class Program\n    {\n        public static void Main(string[] args)\n        {\n            Console.WriteLine(\"Hello .NET Enterprise!\");\n        }\n    }\n}"
          },
          {
            "id": "cs-01-sec-02",
            "type": "quiz_choice",
            "title": {
              "de": "Speichermodell: Value Type vs. Reference Type",
              "en": "Memory Model: Value Type vs. Reference Type"
            },
            "prompt": {
              "de": "Wo werden in C# Instanzen von Klassen (`class`) und wo elementare Typen wie `int` (wenn sie als lokale Variablen in Methoden deklariert sind) typischerweise im Arbeitsspeicher abgelegt?",
              "en": "Where are class instances (`class`) and local primitive types like `int` typically located in memory?"
            },
            "options": [
              "Klassen-Instanzen liegen auf dem Heap (Referenztypen); lokale `int`-Variablen liegen direkt auf dem Stack (Werttypen).",
              "Alle Datenstrukturen liegen ausnahmslos auf dem Stack.",
              "Klassen liegen auf der Festplatte; primitive Typen im CPU-Cache.",
              "Klassen liegen auf dem Stack; `int` liegt auf dem Heap."
            ],
            "solution": 0,
            "explanation": {
              "de": "In C# sind Klassen Referenztypen (`Reference Types`) und werden auf dem Garbage-Collected Heap alloziiert. Lokale Variablen von primitiven Typen (`struct`, `int`, `bool`) sind Werttypen (`Value Types`) und liegen direkt auf dem schnellen Aufruf-Stack.",
              "en": "Classes are reference types allocated on the managed heap. Local value types (`struct`, `int`, `bool`) live directly on the call stack."
            }
          },
          {
            "id": "cs-01-sec-03",
            "type": "concept",
            "title": {
              "de": "Deterministische Ressourcenfreigabe mit 'using'",
              "en": "Deterministic Resource Cleanup with 'using'"
            },
            "content": {
              "de": "Obwohl der Garbage Collector den Speicher bereinigt, weiß er nicht, wann Betriebssystem-Ressourcen wie Dateihandles, Netzwerk-Sockets oder Datenbankverbindungen geschlossen werden müssen.\n\nKlassen, die unmanaged Ressourcen halten, implementieren das Interface `IDisposable`. Das C#-Schlüsselwort `using` stellt sicher, dass die Methode `Dispose()` garantiert aufgerufen wird – selbst wenn innerhalb des Blocks eine Ausnahme (`Exception`) auftritt!",
              "en": "While the GC cleans up memory, it does not manage unmanaged OS resources like file handles or database connections.\n\nClasses wrapping unmanaged resources implement `IDisposable`. The `using` statement guarantees that `Dispose()` is called reliably, even if exceptions are thrown."
            },
            "code": "// Deterministische Freigabe mit using-Statement:\nusing (var stream = new FileStream(\"report.pdf\", FileMode.Open))\n{\n    // Lese Daten aus Datei\n} // stream.Dispose() wird hier automatisch aufgerufen!",
            "codeSnippet": "// Deterministische Freigabe mit using-Statement:\nusing (var stream = new FileStream(\"report.pdf\", FileMode.Open))\n{\n    // Lese Daten aus Datei\n} // stream.Dispose() wird hier automatisch aufgerufen!"
          },
          {
            "id": "cs-01-sec-04",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: LINQ-Filterung",
              "en": "Code Puzzle: LINQ Filtering"
            },
            "starterCode": "var adults = customers. ___ (c => c.Age >= 18).ToList();",
            "prompt": {
              "de": "Vervollständige die LINQ-Abfrage, um alle Kunden herauszufiltern, deren Alter mindestens 18 beträgt:",
              "en": "Complete the LINQ query to filter all customers who are at least 18 years old:"
            },
            "options": [
              "Where",
              "Filter",
              "Select",
              "Find"
            ],
            "solution": "Where",
            "explanation": {
              "de": "In LINQ (Language Integrated Query) dient die Erweiterungsmethode `.Where()` dem Filtern von Auflistungen anhand eines Prädikats.",
              "en": "In LINQ, the `.Where()` extension method filters collections based on a predicate function."
            }
          }
        ]
      },
      {
        "id": "csharp-exam-90min",
        "index": 2,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): C# Enterprise & Design Patterns",
          "en": "🎓 Final Exam (90 Min): C# Enterprise & Design Patterns"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-cs-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): SOLID-Prinzip - Dependency Inversion",
              "en": "Question 1 (20 Points): SOLID Principle - Dependency Inversion"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Eine Geschäftslogik-Klasse instanziiert ihre Datenbankverbindung direkt mit `new SqlServerRepository()`. Welches SOLID-Prinzip wird hier verletzt und wie lautet die fachgerechte Behebung?",
              "en": "A business logic class instantiates its database access directly with `new SqlServerRepository()`. Which SOLID principle is violated and what is the proper fix?"
            },
            "options": [
              "Verletzung des Dependency Inversion Principle (DIP). Lösung: Die Klasse soll stattdessen von einer Schnittstelle `IRepository` abhängen, die per Konstruktor-Injektion übergeben wird.",
              "Verletzung des Single Responsibility Principle. Lösung: Alle Methoden in eine einzige statische Klasse verschieben.",
              "Verletzung des Open-Closed Principle. Lösung: Den Konstruktor als `private` deklarieren.",
              "Es liegt kein Verstoß vor; direkte Instanziierung ist der empfohlene Weg in .NET."
            ],
            "solution": 0,
            "explanation": {
              "de": "Das Dependency Inversion Principle besagt: High-Level-Module dürfen nicht von Low-Level-Modulen abhängen. Beide müssen von Abstraktionen (Interfaces) abhängen. Konstruktor-Injektion entkoppelt die Implementierung.",
              "en": "The Dependency Inversion Principle states high-level modules should depend on abstractions (interfaces), not concrete low-level implementations. Constructor injection provides the necessary inversion."
            }
          },
          {
            "id": "exam-cs-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): Asynchrone Programmierung mit async/await",
              "en": "Question 2 (20 Points): Asynchronous Programming with async/await"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Warum sollte man in modernem C#-Code den Aufruf `.Result` oder `.Wait()` auf einem laufenden `Task` vermeiden?",
              "en": "Why should you avoid calling `.Result` or `.Wait()` on a running `Task` in modern C#?"
            },
            "options": [
              "Es blockiert den aktuellen Thread synchron und kann in UI- oder ASP.NET-Umgebungen zu Deadlocks führen.",
              "Weil `.Result` den Task sofort abbricht.",
              "Weil `.Result` nur für Zahlen und nicht für Strings verwendet werden darf.",
              "Weil dadurch der Garbage Collector komplett deaktiviert wird."
            ],
            "solution": 0,
            "explanation": {
              "de": "Synchrones Warten (`.Result` / `.Wait()`) blockiert den aufrufenden Thread. Wenn der fortsetzende Code auf denselben SynchronizationContext zugreifen will, blockieren sich Thread und Task gegenseitig (Deadlock). Korrekt ist die Nutzung von `await`.",
              "en": "Synchronous blocking (`.Result` / `.Wait()`) blocks the thread. In environments with a SynchronizationContext, this risks deadlocks when continuations queue up. Always use `await`."
            }
          },
          {
            "id": "exam-cs-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): LINQ Deferred Execution",
              "en": "Question 3 (20 Points): LINQ Deferred Execution"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Was bedeutet 'Deferred Execution' (verzögerte Ausführung) bei LINQ-Abfragen wie `var query = users.Where(u => u.IsActive);`?",
              "en": "What does 'Deferred Execution' mean regarding LINQ queries like `var query = users.Where(u => u.IsActive);`?"
            },
            "options": [
              "Die Abfrage wird erst in dem Moment tatsächlich evaluiert, in dem über das Ergebnis iteriert wird (z. B. durch `foreach` oder `.ToList()`).",
              "Die Abfrage wird um genau 5 Sekunden verzögert ausgeführt.",
              "Die Abfrage wird nur ausgeführt, wenn der Server im Leerlauf ist.",
              "Die Abfrage wird auf einen externen Cloud-Server ausgelagert."
            ],
            "solution": 0,
            "explanation": {
              "de": "LINQ-Abfragen auf `IEnumerable` werden nicht sofort bei der Deklaration ausgeführt, sondern erst dann, wenn die Daten tatsächlich angefordert werden (z. B. `foreach`, `.ToList()`, `.Count()`).",
              "en": "LINQ queries against `IEnumerable` defer materialization until the sequence is enumerated (e.g., via `foreach`, `.ToList()`, or `.Count()`)."
            }
          },
          {
            "id": "exam-cs-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): Reihenfolge bei Exception-Handling (try-catch)",
              "en": "Question 4 (20 Points): Exception Handling Order (try-catch)"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "In welcher Reihenfolge müssen `catch`-Blöcke in C# strukturiert sein, wenn sowohl spezifische (`FileNotFoundException`) als auch allgemeine (`Exception`) Fehler abgefangen werden sollen?",
              "en": "In what order must `catch` blocks be arranged when handling both specific (`FileNotFoundException`) and general (`Exception`) errors?"
            },
            "options": [
              "Spezifische Exceptions immer zuerst, gefolgt von der allgemeinsten Basis-Exception `Exception` am Schluss.",
              "Die allgemeinste `Exception` immer zuerst.",
              "Die Reihenfolge ist beliebig, da der Compiler alphabetisch sortiert.",
              "Es darf immer nur ein einziger `catch`-Block pro Methode existieren."
            ],
            "solution": 0,
            "explanation": {
              "de": "Der Compiler wertet `catch`-Blöcke von oben nach unten aus. Würde `catch (Exception)` an oberster Stelle stehen, würde dieser Block jede Exception abfangen und spezifischere Blöcke wären unerreichbarer toter Code.",
              "en": "Catch blocks are evaluated sequentially from top to bottom. Specific exceptions must precede general ones to prevent unreachable handler code."
            }
          },
          {
            "id": "exam-cs-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Interface vs. Abstrakte Klasse",
              "en": "Question 5 (20 Points): Interface vs. Abstract Class"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Wann sollte in C# ein `interface` anstelle einer `abstract class` als Architekturvertrag gewählt werden?",
              "en": "When should you choose an `interface` over an `abstract class` in C#?"
            },
            "options": [
              "Wenn völlig unabhängige, nicht verwandte Klassen denselben Verhaltensvertrag implementieren sollen und Mehrfachvererbung von Verträgen nötig ist.",
              "Wenn man gemeinsamen Programmcode vererben möchte.",
              "Wenn private Hilfsvariablen vorgegeben werden müssen.",
              "Interfaces dürfen in C# seit .NET 6 nicht mehr verwendet werden."
            ],
            "solution": 0,
            "explanation": {
              "de": "C# unterstützt keine Mehrfachvererbung von Klassen, aber eine Klasse kann beliebig viele Interfaces implementieren. Ein Interface definiert einen reinen Vertrag ohne Zustand.",
              "en": "C# does not allow multiple class inheritance, but classes can implement multiple interfaces. Interfaces represent pure behavioural contracts."
            }
          }
        ],
        "scenario": {
          "de": "Handlungssituation: Sie arbeiten als Fachinformatiker/in für Anwendungsentwicklung bei einem Maschinenbau-Konzern. Eine veraltete monolithische Steuerungssoftware soll auf modernstes .NET refaktoriert werden. Es gilt, lose Kopplung durch Dependency Injection zu etablieren, Deadlocks im Multithreading zu vermeiden und Enterprise-Design-Patterns anzuwenden.",
          "en": "Scenario: You are a software developer at an engineering corporation. A legacy control system is being refactored to modern .NET. You must ensure loose coupling via Dependency Injection, prevent multithreading deadlocks, and apply enterprise design patterns."
        }
      }
    ]
  },
  {
    "id": "astro",
    "title": {
      "de": "Astro Framework",
      "en": "Astro Framework"
    },
    "icon": "🚀",
    "badge": "Web Architecture",
    "desc": {
      "de": "Island Architecture, SSR und Content-First Webentwicklung mit Zero-JS-Default.",
      "en": "Island architecture, SSR and content-first web development with zero-JS default."
    },
    "chapters": [
      {
        "id": "astro-01-islands",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. Warum Astro? Island Architecture & Zero-JS",
          "en": "1. Why Astro? Island Architecture & Zero-JS"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "astro-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Das SPA-Ermüdungsproblem & Astros Lösung",
              "en": "The SPA Fatigue Problem & Astro's Solution"
            },
            "content": {
              "de": "Single Page Applications (React, Vue, Angular) bürden dem Client alles auf: Der Browser muss Megabytes an JavaScript laden, parsen und ausführen, nur um Text und Bilder zu rendern.\n\n**Astro geht den entgegengesetzten Weg:**\n1. **Server-First & SSG:** Astro kompiliert Komponenten serverseitig zu purem, schnellem HTML.\n2. **Zero-JS by Default:** Es wird standardmäßig kein einziges Byte JavaScript an den Client ausgeliefert.\n3. **Islands of Interactivity:** Nur isolierte Widgets (z. B. ein interaktiver Warenkorb), die zwingend DOM-Events benötigen, werden als interaktive Inseln mit JS hydriert.",
              "en": "SPAs force browsers to download megabytes of JavaScript before rendering basic content.\n\n**Astro reverses this model:**\n1. **Server-First & SSG:** Components render to pure static HTML.\n2. **Zero-JS by Default:** Zero client-side JS is shipped unless explicitly requested.\n3. **Islands of Interactivity:** Only components requiring client-side interactivity receive JavaScript hydration."
            },
            "code": "---\n// Astro Frontmatter: Läuft NUR zur Build-/Server-Zeit!\nconst response = await fetch('https://api.example.com/data');\nconst items = await response.json();\n---\n<!-- Reines statisches HTML ohne Client-JS-Overhead -->\n<ul>\n  {items.map(item => <li>{item.title}</li>)}\n</ul>",
            "codeSnippet": "---\n// Astro Frontmatter: Läuft NUR zur Build-/Server-Zeit!\nconst response = await fetch('https://api.example.com/data');\nconst items = await response.json();\n---\n<!-- Reines statisches HTML ohne Client-JS-Overhead -->\n<ul>\n  {items.map(item => <li>{item.title}</li>)}\n</ul>"
          },
          {
            "id": "astro-01-sec-02",
            "type": "quiz_choice",
            "title": {
              "de": "Client-Direktiven zur Hydrierungs-Steuerung",
              "en": "Client Directives for Hydration Control"
            },
            "prompt": {
              "de": "Welche Astro-Direktive verzögert die Ausführung des clientseitigen JavaScripts einer React/Vue-Komponente so lange, bis das Element tatsächlich in den sichtbaren Bereich des Bildschirms gescrollt wird?",
              "en": "Which Astro client directive defers component hydration until the element enters the visible viewport?"
            },
            "options": [
              "client:visible",
              "client:load",
              "client:idle",
              "client:media"
            ],
            "solution": 0,
            "explanation": {
              "de": "`client:visible` nutzt den modernen `IntersectionObserver`, um das JavaScript einer Komponente erst dann zu laden und auszuführen, wenn der Anwender zu dieser Stelle scrollt. Dies maximiert die anfängliche Ladezeit (LCP).",
              "en": "`client:visible` uses an IntersectionObserver to defer JS hydration until scrolled into view, optimizing Largest Contentful Paint (LCP)."
            }
          },
          {
            "id": "astro-01-sec-03",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: Frontmatter-Trennzeichen",
              "en": "Code Puzzle: Frontmatter Delimiters"
            },
            "starterCode": "___\nconst { pageTitle } = Astro.props;\n---\n<h1>{pageTitle}</h1>",
            "prompt": {
              "de": "Mit welchen drei Zeichen wird der serverseitige Komponenten-Code (Frontmatter) in einer `.astro`-Datei umschlossen?",
              "en": "Which 3-character delimiter encloses component script frontmatter in an `.astro` file?"
            },
            "options": [
              "---",
              "===",
              "***",
              "###"
            ],
            "solution": "---",
            "explanation": {
              "de": "Der Frontmatter-Block wird durch drei Bindestriche `---` eingeleitet und beendet (analog zu Markdown).",
              "en": "Astro frontmatter is delimited by triple dashes `---`."
            }
          }
        ]
      },
      {
        "id": "astro-exam-90min",
        "index": 2,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): Web-Architektur & Performance",
          "en": "🎓 Final Exam (90 Min): Web Architecture & Performance"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-astro-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): Core Web Vitals - LCP Optimierung",
              "en": "Question 1 (20 Points): Core Web Vitals - LCP Optimization"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Was misst die Google Core Web Vital Metrik 'Largest Contentful Paint' (LCP) und wie verbessert serverseitiges Pre-Rendering (SSG) diesen Wert maßgeblich?",
              "en": "What does the Largest Contentful Paint (LCP) metric measure, and how does SSG improve it?"
            },
            "options": [
              "LCP misst die Zeit bis zum Rendern des größten sichtbaren Inhaltselements. SSG liefert fertiges HTML direkt vom Server, sodass der Browser den Inhalt ohne vorherigen JS-Download sofort anzeigen kann.",
              "LCP misst die Anzahl der Zeilen im JavaScript-Code.",
              "LCP misst die Downloadzeit der Favicon-Datei.",
              "LCP misst die Reaktionszeit der Maus auf Klicks."
            ],
            "solution": 0,
            "explanation": {
              "de": "LCP misst die Ladezeit des Hauptinhalts. Bei klassischen SPAs muss erst das JavaScript geladen und ausgeführt werden, bevor das DOM aufgebaut wird. SSG liefert fertiges HTML direkt aus, was den LCP drastisch verkürzt.",
              "en": "LCP tracks main content paint time. SSG delivers pre-rendered HTML on the initial network response, eliminating render-blocking client JavaScript execution."
            }
          },
          {
            "id": "exam-astro-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): Cumulative Layout Shift (CLS) Vermeidung",
              "en": "Question 2 (20 Points): Cumulative Layout Shift (CLS) Mitigation"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Wie verhindert man das plötzliche visuelle Springen von Texten und Layout-Elementen (CLS), wenn Bilder über das Netzwerk nachgeladen werden?",
              "en": "How do you prevent unexpected visual layout jumps (CLS) when images finish loading over the network?"
            },
            "options": [
              "Durch explizite Angabe der Attribute `width` und `height` auf dem `<img>`-Tag oder per CSS `aspect-ratio`.",
              "Indem alle Bilder im PNG-Format statt WebP gespeichert werden.",
              "Durch Deaktivierung des Browser-Caches.",
              "Indem man Bildern `display: none` zuweist."
            ],
            "solution": 0,
            "explanation": {
              "de": "Mit gesetzten `width`- und `height`-Attributen berechnet der Browser das Seitenverhältnis (`aspect-ratio`) bereits vor dem Download des Bildes und reserviert den benötigten Platz im Layout. Dadurch springt der umgebende Text nicht nach.",
              "en": "Specifying `width` and `height` attributes allows the browser to compute the aspect-ratio and reserve layout space before the image binary is fetched."
            }
          },
          {
            "id": "exam-astro-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): Static Site Generation (SSG) vs. Server-Side Rendering (SSR)",
              "en": "Question 3 (20 Points): SSG vs. SSR"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Wann ist SSG (Generierung zur Build-Zeit) gegenüber dynamischem SSR (Generierung bei jedem HTTP-Request) klar zu bevorzugen?",
              "en": "When is SSG (build-time generation) clearly superior to SSR (per-request generation)?"
            },
            "options": [
              "Wenn sich die Seiteninhalte nicht bei jedem einzelnen Request ändern (z. B. Dokumentationen, Landingpages, Blogs), wodurch statische HTML-Dateien extrem schnell und günstig über CDNs ausgeliefert werden können.",
              "Wenn minütlich wechselnde Aktienkurse dargestellt werden müssen.",
              "Wenn personalisierte Live-Bankkontostände berechnet werden.",
              "SSG sollte niemals verwendet werden, da Server-Requests immer schneller sind."
            ],
            "solution": 0,
            "explanation": {
              "de": "SSG generiert unveränderliche HTML-Dateien vorab beim Deployment. Diese können weltweit über Edge-CDNs ohne Server-CPU-Last und mit Antwortzeiten von unter 20 ms ausgeliefert werden.",
              "en": "SSG compiles unchanging content during build time, enabling instant, serverless delivery via global CDNs with sub-20ms TTFB."
            }
          },
          {
            "id": "exam-astro-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): Interaction to Next Paint (INP)",
              "en": "Question 4 (20 Points): Interaction to Next Paint (INP)"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Welche Ursache führt im Browser zu einem schlechten INP-Wert (Verzögerung der UI-Reaktion nach Benutzerinteraktion)?",
              "en": "What browser-level condition primarily degrades Interaction to Next Paint (INP)?"
            },
            "options": [
              "Lange laufende synchrone JavaScript-Aufgaben (Long Tasks > 50ms), die den Main Thread blockieren und Rendering-Updates aufschieben.",
              "Die Nutzung von HTTPS anstelle von unverschlüsseltem HTTP.",
              "Das Vorhandensein von semantischen HTML-Tags.",
              "Die Komprimierung von CSS-Dateien via Gzip."
            ],
            "solution": 0,
            "explanation": {
              "de": "Da der Browser den Main Thread für JavaScript und das Rendering teilt, blockieren schwere synchrone JS-Ausführungen den Thread. Der Browser kann den nächsten Bildframe (Next Paint) erst zeichnen, wenn der Main Thread frei wird.",
              "en": "JavaScript execution and UI painting share the main thread. Synchronous long tasks (>50ms) block frame rendering, causing noticeable input latency."
            }
          },
          {
            "id": "exam-astro-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Barrierefreiheit nach WCAG 2.1 AAA",
              "en": "Question 5 (20 Points): WCAG 2.1 AAA Accessibility"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Welches Mindestkontrastverhältnis zwischen normalem Text und Hintergrund verlangt die Stufe AAA der Web Content Accessibility Guidelines (WCAG)?",
              "en": "What minimum contrast ratio for regular text does WCAG 2.1 Level AAA require?"
            },
            "options": [
              "Mindestens 7:1 für normalen Fließtext.",
              "Mindestens 3:1.",
              "Mindestens 4.5:1 (dies ist nur Stufe AA).",
              "Ein Kontrast ist laut WCAG nicht vorgeschrieben."
            ],
            "solution": 0,
            "explanation": {
              "de": "WCAG Level AA verlangt 4.5:1 für Fließtext und 3:1 für Großtext. Der strengere Standard **WCAG Level AAA** verlangt mindestens **7:1** für normalen Text und **4.5:1** für Großtext.",
              "en": "While WCAG Level AA mandates 4.5:1 for body text, Level AAA requires a minimum contrast ratio of 7:1 for normal text."
            }
          }
        ],
        "scenario": {
          "de": "Handlungssituation: Sie arbeiten in einer Digitalagentur. Ein Medienverlag klagt über schlechte Google-Rankings und hohe Absprungraten auf mobilen Endgeräten. Sie sollen die bestehende SPA-Architektur analysieren und auf ein modernes, performantes Static-Site- bzw. Island-Architekturmodell migrieren.",
          "en": "Scenario: You are working at a digital agency. A media publishing client reports dropping search rankings and high mobile bounce rates caused by SPA overhead. You must evaluate the architecture and migrate to modern Island Architecture and SSG."
        }
      }
    ]
  },
  {
    "id": "python",
    "title": {
      "de": "Python 3",
      "en": "Python 3"
    },
    "icon": "🐍",
    "badge": "Scripting & AI",
    "desc": {
      "de": "Vielseitige Syntax, Systemautomation, Data Science, GIL & moderne Typisierung.",
      "en": "Versatile syntax, system automation, data science, GIL & modern typing."
    },
    "chapters": [
      {
        "id": "py-01-core-concepts",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. Warum Python? Typsystem, GIL & Automation",
          "en": "1. Why Python? Type System, GIL & Automation"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "py-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Die Philosophie von Python & Das Speichermodell",
              "en": "Python Philosophy & Memory Model"
            },
            "content": {
              "de": "Python wurde um 1991 mit dem Fokus auf maximale menschliche Lesbarkeit konzipiert.\n\n* **Alles ist ein Objekt:** In Python ist jede Zahl, Funktion und Klasse ein First-Class-Objekt auf dem Heap mit einem Header (`PyObject`), der Referenzzähler und Typzeiger enthält.\n* **Speicherbereinigung:** Primär über **Reference Counting** (wird der Zähler 0, erfolgt sofortige Freigabe) ergänzt durch einen zyklischen Garbage Collector für Selbstreferenzen.\n* **Der GIL (Global Interpreter Lock):** CPython nutzt einen Mutex, der sicherstellt, dass zu jedem Zeitpunkt nur ein nativer Thread Python-Bytecode ausführt. Echte CPU-Parallelität erfordert Multiprocessing (`multiprocessing`).",
              "en": "Python was designed in 1991 emphasizing readability and developer productivity.\n\n* **Everything is an Object:** All variables, functions, and classes are first-class heap objects with reference counting headers.\n* **Memory Reclamation:** Primarily driven by reference counting alongside a generational cyclic GC.\n* **The GIL:** CPython uses a global lock ensuring only one thread executes bytecode at a time. True parallelism requires multiprocessing."
            },
            "code": "import sys\n\nx = [1, 2, 3]\nprint(f\"Speicheradresse: {hex(id(x))}\")\nprint(f\"Referenzzähler: {sys.getrefcount(x) - 1}\")",
            "codeSnippet": "import sys\n\nx = [1, 2, 3]\nprint(f\"Speicheradresse: {hex(id(x))}\")\nprint(f\"Referenzzähler: {sys.getrefcount(x) - 1}\")"
          },
          {
            "id": "py-01-sec-02",
            "type": "quiz_choice",
            "title": {
              "de": "Mutable vs. Immutable Datenstrukturen",
              "en": "Mutable vs. Immutable Data Structures"
            },
            "prompt": {
              "de": "Welche der folgenden Datenstrukturen in Python ist 'immutable' (unveränderlich) und kann daher gefahrlos als Schlüssel in einem `dict` verwendet werden?",
              "en": "Which of the following Python data structures is immutable and can safely serve as a `dict` key?"
            },
            "options": [
              "Tuple (`(1, 2, 3)`)",
              "List (`[1, 2, 3]`)",
              "Set (`{1, 2, 3}`)",
              "Dictionary (`{'a': 1}`)"
            ],
            "solution": 0,
            "explanation": {
              "de": "Tupel (`tuple`) sind nach ihrer Erzeugung unveränderlich (`immutable`) und besitzen einen unveränderlichen Hash-Wert, sofern ihre Elemente ebenfalls hashbar sind. Listen und Sets sind veränderlich (`mutable`) und erzeugen einen `TypeError: unhashable type`.",
              "en": "Tuples are immutable and hashable (provided contained elements are hashable). Lists and sets are mutable and unhashable."
            }
          },
          {
            "id": "py-01-sec-03",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: Sichere Dateiverwaltung mit Context Manager",
              "en": "Code Puzzle: Safe File Management with Context Manager"
            },
            "starterCode": "___ open(\"server.log\", \"r\") as f:\n    data = f.read()",
            "prompt": {
              "de": "Welches Schlüsselwort garantiert, dass eine geöffnete Datei selbst bei einem unerwarteten Fehler garantiert geschlossen wird?",
              "en": "Which keyword guarantees a file handle is closed cleanly even if an exception occurs?"
            },
            "options": [
              "with",
              "using",
              "try",
              "open"
            ],
            "solution": "with",
            "explanation": {
              "de": "Das `with`-Statement ruft den Context Manager auf (`__enter__` und `__exit__`), der den Dateideskriptor beim Verlassen des Blocks deterministisch schließt.",
              "en": "The `with` statement utilizes context managers (`__enter__` and `__exit__`) to reliably close file handles."
            }
          }
        ]
      },
      {
        "id": "py-exam-90min",
        "index": 2,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): Python Automation & Data Structures",
          "en": "🎓 Final Exam (90 Min): Python Automation & Data Structures"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-py-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): Speicheroptimierung mit Generatoren (yield)",
              "en": "Question 1 (20 Points): Memory Optimization with Generators (yield)"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Ein Logfile ist 50 GB groß. Ein Skript soll jede Zeile auf das Wort 'CRITICAL' prüfen. Warum führt `f.readlines()` zum Absturz und wie lautet die fachgerechte Lösung?",
              "en": "A logfile is 50 GB. Why does `f.readlines()` trigger an Out-Of-Memory crash, and what is the proper solution?"
            },
            "options": [
              "`readlines()` lädt die gesamten 50 GB auf einmal in den RAM. Lösung: Zeilenweises Iterieren mit einem Generator (`for line in f:`), wodurch immer nur eine einzelne Zeile im RAM liegt.",
              "`readlines()` ist nur für Bilddateien gedacht.",
              "Man muss den Server neu starten und das Logfile löschen.",
              "Man muss Python auf 32-Bit downgraden."
            ],
            "solution": 0,
            "explanation": {
              "de": "Dateiobjekte in Python implementieren das Iterator-Protokoll (Generator-Prinzip). Beim Durchlaufen mit `for line in f:` wird immer nur die aktuelle Zeile in den Speicher gestreamt, was selbst riesige Dateien mit wenigen Kilobyte RAM lesbar macht.",
              "en": "Python file objects implement the iterator protocol. Iterating with `for line in f:` streams line-by-line, consuming constant memory regardless of file size."
            }
          },
          {
            "id": "exam-py-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): Default-Argument-Falle bei veränderlichen Typen",
              "en": "Question 2 (20 Points): Mutable Default Argument Trap"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Was geschieht, wenn eine Funktion mit dem Standard-Parameter `def append_to(item, target_list=[])` mehrfach ohne zweiten Parameter aufgerufen wird?",
              "en": "What happens when calling `def append_to(item, target_list=[])` multiple times without supplying a second argument?"
            },
            "options": [
              "Die Liste `target_list` wird nur einmalig beim Definieren der Funktion erzeugt und behält Werte über nachfolgende Aufrufe hinweg bei (unerwarteter Seiteneffekt).",
              "Bei jedem Aufruf wird garantiert eine neue leere Liste erzeugt.",
              "Python meldet beim zweiten Aufruf einen SyntaxError.",
              "Die Elemente werden automatisch gelöscht."
            ],
            "solution": 0,
            "explanation": {
              "de": "In Python werden Standardargumente genau einmal beim Parsen der Funktionsdefinition ausgewertet. Veränderliche Typen (`list`, `dict`) werden geteilt. Die korrekte Lösung lautet: `target_list=None` und im Funktionskörper `if target_list is None: target_list = []`.",
              "en": "Default arguments evaluate once at function definition time. Mutable defaults accumulate across calls. Use `target_list=None` and initialize inside the body."
            }
          },
          {
            "id": "exam-py-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): Paralleles Multiprocessing vs. Multithreading",
              "en": "Question 3 (20 Points): Multiprocessing vs. Multithreading under GIL"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Für eine rechenintensive Bildkonvertierung (CPU-Bound) auf einer 16-Core-Workstation soll Python eingesetzt werden. Warum muss das Modul `multiprocessing` statt `threading` gewählt werden?",
              "en": "For CPU-bound image encoding on a 16-core system, why must Python use `multiprocessing` instead of `threading`?"
            },
            "options": [
              "Weil der Global Interpreter Lock (GIL) in CPython verhindert, dass mehrere Threads echten CPU-Code parallel auf mehreren Kernen ausführen; Multiprocessing startet eigenständige OS-Prozesse mit je eigenem Interpreter.",
              "Weil Threads in Python keine Zahlen berechnen können.",
              "Weil `threading` seit Python 3.8 verboten ist.",
              "Weil Multiprocessing keinen Arbeitsspeicher verbraucht."
            ],
            "solution": 0,
            "explanation": {
              "de": "Aufgrund des GIL kann immer nur ein Thread gleichzeitig Python-Bytecode ausführen. Für CPU-intensive Aufgaben nutzt man `multiprocessing`, da jeder Prozess eine eigene Instanz des Python-Interpreters und damit echte CPU-Kern-Parallelität besitzt.",
              "en": "The GIL restricts bytecode execution to one thread at a time. CPU-bound concurrency requires `multiprocessing` to fork independent interpreter instances across cores."
            }
          },
          {
            "id": "exam-py-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): Virtuelle Umgebungen (venv)",
              "en": "Question 4 (20 Points): Virtual Environments (venv)"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Warum verlangt der Qualitätsstandard für Softwareentwicklung, dass Python-Projekte immer in einer virtuellen Umgebung (`python -m venv .venv`) betrieben werden?",
              "en": "Why do software engineering standards mandate isolating Python projects inside virtual environments (`python -m venv .venv`)?"
            },
            "options": [
              "Um Abhängigkeiten und Paketversionen für jedes Projekt isoliert zu halten und Versionskonflikte mit systemweiten Linux-Paketen (`apt`/`dnf`) zu verhindern.",
              "Damit der Code im Dark Mode ausgeführt wird.",
              "Um Festplattenspeicherplatz auf dem Computer einzusparen.",
              "Weil Python ohne venv nicht starten kann."
            ],
            "solution": 0,
            "explanation": {
              "de": "Virtuelle Umgebungen isolieren `site-packages`. Dadurch wird verhindert, dass Projekt A mit Package-Version 1.0 durch ein Update von Projekt B auf Version 2.0 bricht (Dependency Hell) oder das Host-Betriebssystem beschädigt wird (PEP 668).",
              "en": "Virtual environments isolate package dependencies per project, eliminating version conflicts with host OS packages and ensuring reproducible deployments."
            }
          },
          {
            "id": "exam-py-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Ausnahmebehandlung mit 'finally'",
              "en": "Question 5 (20 Points): Exception Handling with 'finally'"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Wann wird der `finally`-Block eines `try-except-finally`-Konstrukts garantiert ausgeführt?",
              "en": "Under which condition does the `finally` block in `try-except-finally` execute?"
            },
            "options": [
              "Ausnahmslos immer, egal ob im `try`-Block ein Fehler aufgetreten ist oder nicht, und selbst wenn der Block per `return` verlassen wird.",
              "Nur wenn ein Fehler aufgetreten ist.",
              "Nur wenn kein Fehler aufgetreten ist.",
              "Nur wenn der Administrator im Betriebssystem angemeldet ist."
            ],
            "solution": 0,
            "explanation": {
              "de": "Der `finally`-Block wird unabhängig vom Erfolg oder Misserfolg des `try`-Blocks immer ausgeführt. Er dient klassischen Aufräumarbeiten, Freigabe von Sperren oder dem Schließen von Sockets.",
              "en": "The `finally` block runs unconditionally, whether an exception occurred, was handled, or a return statement was executed."
            }
          }
        ],
        "scenario": {
          "de": "Handlungssituation: Als Fachinformatiker/in für Systemintegration (FISI) sollen Sie ein automatisiertes Monitoring- und Log-Parsing-Tool für eine Server-Farm entwerfen. Das Tool soll Logfiles im Terabyte-Bereich speicherschonend durchsuchen, Fehler filtern und Statusberichte per API übertragen.",
          "en": "Scenario: As an IT systems engineer, you are designing a memory-efficient log parsing and alerting pipeline for a server cluster. The script must process multi-gigabyte log archives without memory exhaustion."
        }
      }
    ]
  },
  {
    "id": "html-css",
    "title": {
      "de": "HTML5 & CSS3",
      "en": "HTML5 & CSS3"
    },
    "icon": "🎨",
    "badge": "Web Foundation",
    "desc": {
      "de": "Semantisches HTML, Box-Modell, CSS Grid, Flexbox, Design Tokens & Barrierefreiheit.",
      "en": "Semantic HTML, box model, CSS grid, flexbox, design tokens & accessibility."
    },
    "chapters": [
      {
        "id": "html-01-boxmodel-semantics",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. Semantisches HTML, Box-Modell & Modernes Grid",
          "en": "1. Semantic HTML, Box Model & Modern Grid"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "html-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Semantische HTML5-Struktur statt Div-Suppe",
              "en": "Semantic HTML5 Structure vs. Div Soup"
            },
            "content": {
              "de": "Vor HTML5 bestand das Web aus unzähligen bedeutungslosen `<div>`-Containern. Moderne Webstandards fordern **semantische Tags**:\n\n* `<header>`: Kopfbereich mit Logo, Navigation oder Titel.\n* `<nav>`: Hauptnavigationsleiste für Screenreader und Tastatur-Tabs.\n* `<main>`: Der zentrale, einmalige Hauptinhalt der Seite.\n* `<article>`: In sich geschlossener, eigenständiger Inhalt (z. B. Blogbeitrag, Produktkarte).\n* `<aside>`: Begleitender Inhalt (Sidebar, weiterführende Links).\n* `<footer>`: Rechtliche Angaben, Impressum, Copyright.",
              "en": "Prior to HTML5, websites were built with generic `<div>` tags. Modern standards mandate **semantic elements**:\n\n* `<header>`: Page or section branding and heading.\n* `<nav>`: Primary navigation region.\n* `<main>`: The unique central content of the document.\n* `<article>`: Self-contained content item.\n* `<aside>`: Tangentially related sidebars.\n* `<footer>`: Legal disclosures and metadata."
            },
            "code": "<header>\n  <nav aria-label=\"Hauptnavigation\">\n    <a href=\"/\">Home</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h1>Moderne Webarchitektur</h1>\n    <p>Semantischer Code verbessert SEO und Accessibility.</p>\n  </article>\n</main>",
            "codeSnippet": "<header>\n  <nav aria-label=\"Hauptnavigation\">\n    <a href=\"/\">Home</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h1>Moderne Webarchitektur</h1>\n    <p>Semantischer Code verbessert SEO und Accessibility.</p>\n  </article>\n</main>"
          },
          {
            "id": "html-01-sec-02",
            "type": "concept",
            "title": {
              "de": "Das CSS-Box-Modell: content-box vs. border-box",
              "en": "CSS Box Model: content-box vs. border-box"
            },
            "content": {
              "de": "Jedes Element im Browser ist eine rechteckige Box aus vier Schichten: `Content` -> `Padding` -> `Border` -> `Margin`.\n\n* **Standard (`content-box`):** Wenn Sie `width: 200px` und `padding: 20px` setzen, wird die Box insgesamt **240px** breit! Dies bricht häufig responsive Layouts.\n* **Der moderne Standard (`border-box`):** `padding` und `border` werden in die angegebene Breite **eingerechnet**. Die Box bleibt exakt **200px** breit!",
              "en": "Every rendered element is a 4-layer box: `Content` -> `Padding` -> `Border` -> `Margin`.\n\n* **Legacy Default (`content-box`):** A `width: 200px` with `padding: 20px` results in an actual width of **240px**, breaking grids.\n* **Modern Standard (`border-box`):** Padding and borders are absorbed inside the specified dimension, locking the box to exactly **200px**."
            },
            "code": "/* Universal CSS Reset: Pflicht in jedem Projekt */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}",
            "codeSnippet": "/* Universal CSS Reset: Pflicht in jedem Projekt */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}"
          },
          {
            "id": "html-01-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Flexbox (1D) vs. CSS Grid (2D)",
              "en": "Flexbox (1D) vs. CSS Grid (2D)"
            },
            "prompt": {
              "de": "Wann ist CSS Grid gegenüber Flexbox das architektonisch überlegene Werkzeug?",
              "en": "When is CSS Grid architecturally superior to Flexbox?"
            },
            "options": [
              "Wenn Elemente gleichzeitig in Zeilen UND Spalten (2-dimensionale Raster) zueinander ausgerichtet werden müssen.",
              "Wenn man nur einen einzigen Button in einem Header zentrieren möchte.",
              "CSS Grid sollte vermieden werden, da es langsamer als Tabellen ist.",
              "Wenn die Website nur auf Windows-Computern laufen soll."
            ],
            "solution": 0,
            "explanation": {
              "de": "Flexbox ist für eindimensionale Layouts (entweder Zeile ODER Spalte) optimiert. CSS Grid steuert beide Dimensionen (Zeilen und Spalten gleichzeitig) und ermöglicht responsive Auto-Fit-Spalten ohne Media Queries.",
              "en": "Flexbox manages 1-dimensional layouts (row or column). CSS Grid controls 2-dimensional rows and columns simultaneously."
            }
          },
          {
            "id": "html-01-sec-04",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: Responsive Grid Spalten",
              "en": "Code Puzzle: Responsive Grid Columns"
            },
            "starterCode": "grid-template-columns: repeat(___ , minmax(280px, 1fr));",
            "prompt": {
              "de": "Vervollständige die moderne CSS-Grid-Deklaration, die automatisch so viele Spalten mit mindestens 280px Breite erzeugt, wie in den Viewport passen:",
              "en": "Complete the modern CSS Grid declaration that automatically fits as many columns (min 280px) as the viewport allows:"
            },
            "options": [
              "auto-fit",
              "flex-wrap",
              "100%",
              "auto-fill-columns"
            ],
            "solution": "auto-fit",
            "explanation": {
              "de": "`repeat(auto-fit, minmax(280px, 1fr))` erzeugt vollautomatisch responsive Spalten, ohne dass ein einziger Media-Query geschrieben werden muss.",
              "en": "`repeat(auto-fit, minmax(280px, 1fr))` dynamically packs columns without requiring media queries."
            }
          }
        ]
      },
      {
        "id": "html-exam-90min",
        "index": 2,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): Responsive Layouts & Barrierefreiheit",
          "en": "🎓 Final Exam (90 Min): Responsive Layouts & Accessibility"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-html-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): CSS-Spezifitätsberechnung",
              "en": "Question 1 (20 Points): CSS Specificity Calculation"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Welcher der folgenden CSS-Selektoren besitzt die höchste Spezifität und überschreibt alle anderen regulären Stile?",
              "en": "Which of the following CSS selectors has the highest specificity and overrides regular styles?"
            },
            "options": [
              "`#header .nav-item` (1 ID, 1 Klasse)",
              "`.nav .nav-item.active` (3 Klassen)",
              "`nav ul li a` (4 Element-Selektoren)",
              "`*` (Universalselektor)"
            ],
            "solution": 0,
            "explanation": {
              "de": "Die Spezifität wird in (Inline, IDs, Klassen/Attribute, Elemente) berechnet. Ein einzelner ID-Selektor (`0,1,0,0`) sticht beliebig viele Klassen (`0,0,x,0`) aus. `#header .nav-item` hat Spezifität `(0,1,1,0)`.",
              "en": "Specificity is calculated as (Inline, IDs, Classes, Elements). A single ID (0,1,0,0) outweighs any number of classes. Selector `#header .nav-item` scores (0,1,1,0)."
            }
          },
          {
            "id": "exam-html-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): Barrierefreie Touch-Targets (WCAG 2.5.5 / 2.5.8)",
              "en": "Question 2 (20 Points): Accessible Touch Target Size"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Welche Mindestabmessung muss eine interaktive Klickfläche (Button, Icon) auf Mobilgeräten nach modernen Usability- und WCAG-Standards aufweisen, um motorisch eingeschränkten Personen eine zielsichere Bedienung zu ermöglichen?",
              "en": "What minimum dimensions must interactive touch controls meet under modern usability and accessibility standards?"
            },
            "options": [
              "Mindestens 44 × 44 px bzw. 48 × 48 px (inklusive Padding)",
              "Mindestens 10 × 10 px",
              "Maximal 20 × 20 px",
              "Eine Mindestgröße ist auf Touchscreens nicht erforderlich"
            ],
            "solution": 0,
            "explanation": {
              "de": "WCAG 2.1/2.2 und Google Material Design fordern für berührungsempfindliche Displays mindestens 44 × 44 bzw. 48 × 48 CSS-Pixel Klickfläche, um Fehltippen zu vermeiden.",
              "en": "WCAG guidelines and ergonomics standards prescribe at least 44×44px to 48×48px clickable target area on touchscreens."
            }
          },
          {
            "id": "exam-html-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): Tastaturbedienbarkeit & Focus Ring (:focus-visible)",
              "en": "Question 3 (20 Points): Keyboard Accessibility & Focus Ring"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Warum gilt das pauschale CSS-Styling `* { outline: none; }` als gravierender Fehler gegen die Barrierefreiheit?",
              "en": "Why is `* { outline: none; }` considered a severe accessibility violation?"
            },
            "options": [
              "Weil Tastaturnutzer (z. B. blinde oder motorisch eingeschränkte Menschen) den sichtbaren Tastaturfokus verlieren und nicht mehr erkennen können, welcher Button gerade aktiv ist.",
              "Weil dadurch der Text kleiner dargestellt wird.",
              "Weil die Website auf Android-Geräten abstürzt.",
              "Weil `outline` zwingend für die Farbwiedergabe benötigt wird."
            ],
            "solution": 0,
            "explanation": {
              "de": "Der sichtbare Fokusring ist für Personen, die Websites per Tab-Taste bedienen, die einzige Orientierung. Entfernt man die Outline ohne Ersatz, wird die Website für Tastaturnutzer unbedienbar.",
              "en": "The focus ring is essential for keyboard navigators to locate their active cursor position. Removing outlines without accessible alternatives makes websites unusable for assistive technologies."
            }
          },
          {
            "id": "exam-html-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): Relative Einheiten - rem vs. em",
              "en": "Question 4 (20 Points): Relative Units - rem vs. em"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Warum sollten Schriftgrößen im Webdesign mit `rem` statt `px` deklariert werden?",
              "en": "Why should typography be declared using `rem` rather than `px`?"
            },
            "options": [
              "Weil `rem` sich an der im Browser eingestellten Basisschriftgröße des Nutzers orientiert und die Schrift skaliert, wenn sehbehinderte Menschen die Browser-Standardschrift vergrößern.",
              "Weil `px` auf Apple-Computern nicht unterstützt wird.",
              "Weil `rem` weniger CSS-Code benötigt.",
              "Weil `rem` automatisch Bilder komprimiert."
            ],
            "solution": 0,
            "explanation": {
              "de": "`rem` (Root EM) bezieht sich auf die `font-size` des `<html>`-Wurzelelements. Ändert der Nutzer seine bevorzugte Schriftgröße in den Browser-Einstellungen (z. B. auf 20px), passen sich alle `rem`-Werte proportional an.",
              "en": "`rem` references the root element font size. If users configure larger base typography in their browser settings, `rem`-based designs scale proportionally."
            }
          },
          {
            "id": "exam-html-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Formular-Validierung & Label-Verknüpfung",
              "en": "Question 5 (20 Points): Form Labels & Validation"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Wie verknüpft man ein `<label>`-Element technisch korrekt mit einem Eingabefeld `<input>`, damit ein Klick auf die Beschriftung das Eingabefeld fokussiert?",
              "en": "How do you correctly bind a `<label>` to an `<input>` element so that clicking the label focuses the input field?"
            },
            "options": [
              "Das `for`-Attribut des Labels muss dem `id`-Attribut des Input-Feldes exakt entsprechen (oder das Input liegt direkt innerhalb des Labels).",
              "Man weist beiden Elementen denselben Klassennamen zu.",
              "Man schreibt den Text direkt in das `placeholder`-Attribut.",
              "Man benötigt dafür ein JavaScript-Klick-Event."
            ],
            "solution": 0,
            "explanation": {
              "de": "Das Attribut `for=\"inputID\"` im `<label>` verknüpft dieses semantisch mit `id=\"inputID\"`. Screenreader lesen den Labeltext beim Fokussieren des Feldes vor und Klicks auf das Label aktivieren das Feld.",
              "en": "The `<label for=\"fieldId\">` semantically associates with `<input id=\"fieldId\">`, enabling screenreader announcements and larger click hitboxes."
            }
          }
        ],
        "scenario": {
          "de": "Handlungssituation: Als Web-Entwickler/in bei einem kommunalen IT-Dienstleister sollen Sie das Bürgerportal der Stadt barrierefrei nach den gesetzlichen Vorgaben der BITV 2.0 / WCAG 2.1 umgestalten. Gleichzeitig müssen mobile Darstellungsfehler behoben und die CSS-Spezifität bereinigt werden.",
          "en": "Scenario: As a web developer at a municipal agency, you are overhauling the public citizen portal to comply with statutory accessibility directives (BITV 2.0 / WCAG 2.1) while resolving responsive mobile defects and CSS specificity conflicts."
        }
      }
    ]
  },
  {
    "id": "javascript",
    "title": {
      "de": "JavaScript & TypeScript",
      "en": "JavaScript & TypeScript"
    },
    "icon": "📜",
    "badge": "Client & Server",
    "desc": {
      "de": "Event Loop, Call Stack, Microtasks, Async/Await & statische Typisierung mit TypeScript.",
      "en": "Event loop, call stack, microtasks, async/await & static typing with TypeScript."
    },
    "chapters": [
      {
        "id": "js-01-eventloop-ts",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. Warum TypeScript? Event Loop, Promises & Types",
          "en": "1. Why TypeScript? Event Loop, Promises & Types"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "js-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Der JavaScript Event Loop: Single-Threaded Concurrency",
              "en": "The JavaScript Event Loop: Single-Threaded Concurrency"
            },
            "content": {
              "de": "JavaScript besitzt nur einen einzigen Haupt-Ausführungsthread (**Call Stack**). Wie kann ein Webserver oder Browser dennoch zehntausende Netzwerkanfragen gleichzeitig abarbeiten?\n\n1. **Call Stack:** Führt den synchronen Code Zeile für Zeile aus.\n2. **Web / Node APIs:** Asynchrone Operationen (Netzwerk-Fetch, Dateisystem, Timer) werden an Hintergrund-Threads des Betriebssystems übergeben.\n3. **Microtask Queue (Promises):** Hat höchste Priorität. Sobald der Stack leer ist, werden alle aufgelösten Promises (`Promise.then()`, `await`) abgearbeitet, bevor Macrotasks (`setTimeout`) an die Reihe kommen.",
              "en": "JavaScript operates on a single execution thread (**Call Stack**). How does it handle massive I/O concurrency?\n\n1. **Call Stack:** Processes synchronous frames sequentially.\n2. **Web / Node APIs:** Offloads I/O (fetch, timers, disk) to OS thread pools.\n3. **Microtask Queue:** Highest priority. When the stack drains, all pending promise microtasks are cleared before processing macrotasks."
            },
            "code": "console.log(\"1. Synchron\");\nsetTimeout(() => console.log(\"4. Macrotask (Timer)\"), 0);\nPromise.resolve().then(() => console.log(\"3. Microtask (Promise)\"));\nconsole.log(\"2. Synchron\");\n// Ausgabe-Reihenfolge: 1 -> 2 -> 3 -> 4",
            "codeSnippet": "console.log(\"1. Synchron\");\nsetTimeout(() => console.log(\"4. Macrotask (Timer)\"), 0);\nPromise.resolve().then(() => console.log(\"3. Microtask (Promise)\"));\nconsole.log(\"2. Synchron\");\n// Ausgabe-Reihenfolge: 1 -> 2 -> 3 -> 4"
          },
          {
            "id": "js-01-sec-02",
            "type": "concept",
            "title": {
              "de": "Warum TypeScript? Statische Typensicherheit zur Entwicklungszeit",
              "en": "Why TypeScript? Static Type Safety at Design Time"
            },
            "content": {
              "de": "Reines JavaScript prüft Typen erst zur Laufzeit beim Benutzer. Tippfehler wie `user.emial` oder unerwartete `null`-Werte führen zu den gefürchteten Fehlern `TypeError: Cannot read properties of undefined`.\n\n**TypeScript** ergänzt JavaScript um ein mächtiges, statisches Typsystem, das vom Compiler komplett zu reinem JavaScript transpiliert wird:\n* Typsichere Schnittstellen (`interface User { id: string; email: string; }`)\n* Erkennung von Nullability (`strictNullChecks`)\n* Intelligente Autovervollständigung und Refaktorisierung in der IDE.",
              "en": "Vanilla JavaScript evaluates types at runtime, causing production crashes on undefined property accesses.\n\n**TypeScript** overlays static compile-time type verification:\n* Strict interfaces\n* Null-safety enforcement (`strictNullChecks`)\n* IDE autocompletion and safe refactoring."
            },
            "code": "interface UserProfile {\n    readonly id: string;\n    name: string;\n    email?: string; // Optionales Feld\n}\n\nfunction sendEmail(user: UserProfile) {\n    if (user.email) {\n        console.log(`Sending mail to ${user.email}`);\n    }\n}",
            "codeSnippet": "interface UserProfile {\n    readonly id: string;\n    name: string;\n    email?: string; // Optionales Feld\n}\n\nfunction sendEmail(user: UserProfile) {\n    if (user.email) {\n        console.log(`Sending mail to ${user.email}`);\n    }\n}"
          },
          {
            "id": "js-01-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Microtask Queue vs. Macrotask Queue",
              "en": "Microtask Queue vs. Macrotask Queue"
            },
            "prompt": {
              "de": "Welcher Code wird nach Leeren des synchronen Call Stacks zuerst ausgeführt: Ein Callback in `setTimeout(fn, 0)` oder ein `Promise.resolve().then(fn)`?",
              "en": "Which callback executes first once the synchronous call stack empties: `setTimeout(fn, 0)` or `Promise.resolve().then(fn)`?"
            },
            "options": [
              "Das Promise, da Promises in der Microtask Queue priorisiert vor der Macrotask Queue abgearbeitet werden.",
              "`setTimeout`, weil Timer Vorrang vor Netzwerkanfragen haben.",
              "Beide laufen gleichzeitig auf zwei CPU-Kernen.",
              "Die Reihenfolge ist vollkommen zufällig."
            ],
            "solution": 0,
            "explanation": {
              "de": "Der Event Loop leert immer zuerst die gesamte Microtask Queue (Promises, `queueMicrotask`), bevor der nächste Macrotask (Timer, I/O-Events) aus der Task Queue entnommen wird.",
              "en": "The event loop completely drains the microtask queue (promises) before dispatching the next macrotask from the task queue."
            }
          },
          {
            "id": "js-01-sec-04",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: Nullish Coalescing Operator",
              "en": "Code Puzzle: Nullish Coalescing Operator"
            },
            "starterCode": "const port = process.env.PORT ___ 8080;",
            "prompt": {
              "de": "Welcher Operator liefert den rechten Wert NUR DANN, wenn der linke Wert `null` oder `undefined` ist (und nicht bei `0` oder `false` wie `||`)?",
              "en": "Which operator returns the right-hand operand ONLY when the left operand is `null` or `undefined`?"
            },
            "options": [
              "??",
              "||",
              "&&",
              "?:"
            ],
            "solution": "??",
            "explanation": {
              "de": "Der Nullish Coalescing Operator `??` prüft strikt auf `null` und `undefined`. Der logische OR-Operator `||` würde fälschlicherweise auch bei `0` oder `\"\"` den Fallback wählen.",
              "en": "The nullish coalescing operator `??` checks specifically for nullish values (`null` or `undefined`), preserving valid falsy values like `0` or `\"\"`."
            }
          }
        ]
      },
      {
        "id": "js-exam-90min",
        "index": 2,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): Fullstack JS & Statische Typisierung",
          "en": "🎓 Final Exam (90 Min): Fullstack JS & Static Typing"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-js-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): XSS-Prävention im DOM",
              "en": "Question 1 (20 Points): DOM XSS Prevention"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Ein Entwickler möchte einen vom Benutzer eingegebenen Namen in ein `<div>`-Element einfügen. Welche Eigenschaft muss verwendet werden, um Cross-Site Scripting (XSS) sicher zu verhindern?",
              "en": "A developer needs to insert untrusted user input into a `<div>`. Which DOM property safely prevents Cross-Site Scripting (XSS)?"
            },
            "options": [
              "`element.textContent = userInput;` (wird als reiner Text escaped)",
              "`element.innerHTML = userInput;`",
              "`element.outerHTML = userInput;`",
              "`document.write(userInput);`"
            ],
            "solution": 0,
            "explanation": {
              "de": "`textContent` behandelt Eingaben ausschließlich als reinen Text und escaped HTML-Sonderzeichen (`<`, `>`, `&`). `innerHTML` würde `<script>`-Tags oder `onload`-Attribute direkt ausführen.",
              "en": "`textContent` treats input strictly as literal text, safely escaping markup characters. `innerHTML` parses input as HTML, exposing DOM XSS."
            }
          },
          {
            "id": "exam-js-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): Lexikalischer Scope & Closures",
              "en": "Question 2 (20 Points): Lexical Scopes & Closures"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Was ist eine 'Closure' in JavaScript?",
              "en": "What is a 'closure' in JavaScript?"
            },
            "options": [
              "Die Kombination aus einer Funktion und der lexikalischen Umgebung, in der sie deklariert wurde; die Funktion behält Zugriff auf die Variablen ihrer Elternfunktion, selbst nachdem diese beendet ist.",
              "Ein Fehler, der das Browserfenster schließt.",
              "Das Schlüsselwort `close()` in einer Schleife.",
              "Ein privates Zertifikat für HTTPS-Verbindungen."
            ],
            "solution": 0,
            "explanation": {
              "de": "Eine Closure erlaubt es einer inneren Funktion, auf Variablen der äußeren Funktion zuzugreifen, selbst wenn die äußere Funktion ihren Aufruf-Stack bereits verlassen hat. Dies ist die Basis für Kapselung und Fabrikfunktionen.",
              "en": "A closure bundles a function with references to its surrounding lexical environment, retaining access to outer variables even after the outer execution context exits."
            }
          },
          {
            "id": "exam-js-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): Paralleles Ausführen von Promises mit Promise.all",
              "en": "Question 3 (20 Points): Parallel Promises with Promise.all"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Drei voneinander unabhängige API-Endpunkte sollen gleichzeitig abgefragt werden. Welches Muster garantiert, dass alle drei Anfragen parallel und nicht nacheinander ausgeführt werden?",
              "en": "Three independent API endpoints must be queried simultaneously. Which pattern ensures requests run in parallel?"
            },
            "options": [
              "`const [res1, res2, res3] = await Promise.all([fetch1(), fetch2(), fetch3()]);`",
              "`await fetch1(); await fetch2(); await fetch3();`",
              "`fetch1(); while(true) { fetch2(); }`",
              "`fetch1().wait().then(fetch2)`"
            ],
            "solution": 0,
            "explanation": {
              "de": "`Promise.all` stößt alle Promises parallel an und wartet, bis alle erfolgreich aufgelöst wurden. Hintereinander geschaltete `await`-Aufrufe würden die Requests sequentiell ausführen und die Ladezeit verdreifachen.",
              "en": "`Promise.all` fires promises concurrently, resolving when all succeed. Sequential `await` calls block sequentially, tripling total latency."
            }
          },
          {
            "id": "exam-js-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): TypeScript Generics",
              "en": "Question 4 (20 Points): TypeScript Generics"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Welchen Vorteil bieten TypeScript Generics wie `function identity<T>(arg: T): T` gegenüber der Verwendung des Typs `any`?",
              "en": "What advantage do TypeScript generics (`<T>`) offer over the `any` type?"
            },
            "options": [
              "Sie bewahren die exakte Typinformation des übergebenen Arguments für den Rückgabewert, während `any` die Typprüfung komplett deaktiviert.",
              "Generics beschleunigen die Ausführungsgeschwindigkeit im Browser um 50%.",
              "Generics sind Pflicht in Node.js.",
              "Es gibt keinen Unterschied."
            ],
            "solution": 0,
            "explanation": {
              "de": "Generics ermöglichen wiederverwendbare Funktionen und Klassen, die mit verschiedenen Typen arbeiten, während die konkrete Typsicherheit vollständig erhalten bleibt. `any` hingegen schaltet den TypeScript-Compiler faktisch aus.",
              "en": "Generics create type-safe parameterized components, preserving exact type propagation unlike `any`, which disables compiler safety."
            }
          },
          {
            "id": "exam-js-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Gleichheit - == vs. ===",
              "en": "Question 5 (20 Points): Equality - == vs. ==="
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Warum verlangt der Coding-Standard in Projekten immer die Verwendung des strikten Gleichheitsoperators `===` anstelle von `==`?",
              "en": "Why do engineering standards enforce strict equality `===` over loose equality `==`?"
            },
            "options": [
              "`===` vergleicht Wert UND Datentyp ohne implizite Typumwandlung, während `==` unerwartete Typkonvertierungen durchführt (`0 == ''` ist true).",
              "Weil `==` in modernem JavaScript verboten ist.",
              "Weil `===` den Code verschlüsselt.",
              "`===` ist eine mathematische Formel."
            ],
            "solution": 0,
            "explanation": {
              "de": "Der lose Vergleichsoperator `==` führt implizite Typzwänge (Type Coercion) nach komplexen ECMAScript-Regeln durch, was häufig zu unentdeckten Logikfehlern führt. `===` prüft Typ und Wert strikt.",
              "en": "Loose equality `==` triggers implicit type coercion rules. Strict equality `===` verifies both type and value identity without coercion."
            }
          }
        ],
        "scenario": {
          "de": "Handlungssituation: Sie sind Fullstack-Entwickler/in bei einem Fintech-Startup. Das webbasierte Dashboard friert bei hohen Datenmengen ein, und im Frontend-Code wurden unbereinigte HTML-Strings gefunden. Ihre Aufgabe ist es, den Event Loop zu entlasten, typsichere TypeScript-APIs zu bauen und XSS-Lücken zu schließen.",
          "en": "Scenario: You are a fullstack developer at a fintech startup. The web dashboard freezes under heavy load, and unsanitized HTML injections threaten user balances. You must decouple the event loop, author type-safe TypeScript interfaces, and eliminate XSS vulnerabilities."
        }
      }
    ]
  },
  {
    "id": "php",
    "title": {
      "de": "Modernes PHP 8+",
      "en": "Modern PHP 8+"
    },
    "icon": "🐘",
    "badge": "Backend Engine",
    "desc": {
      "de": "Shared-Nothing Lifecycle, Constructor Promotion, PDO Prepared Statements & OOP.",
      "en": "Shared-nothing lifecycle, constructor promotion, PDO prepared statements & OOP."
    },
    "chapters": [
      {
        "id": "php-01-oop-security",
        "index": 1,
        "type": "lesson",
        "level": {
          "de": "Grundlagen",
          "en": "Fundamentals"
        },
        "title": {
          "de": "1. Warum PHP 8? Lifecycle, OOP & PDO-Sicherheit",
          "en": "1. Why PHP 8? Lifecycle, OOP & PDO Security"
        },
        "duration": "25 min",
        "sections": [
          {
            "id": "php-01-sec-01",
            "type": "concept",
            "title": {
              "de": "Das 'Shared Nothing' Architekturmodell von PHP",
              "en": "PHP's 'Shared Nothing' Architecture Model"
            },
            "content": {
              "de": "Warum treibt PHP auch heute noch über drei Viertel aller Websites und Content-Management-Systeme weltweit an?\n\n* **Isolierter Request-Lifecycle:** Bei jedem HTTP-Request instanziiert der PHP-FPM-Prozess die Laufzeitumgebung völlig neu. Nach Beantwortung des Requests wird der gesamte Arbeitsspeicher restlos freigegeben.\n* **Keine akkumulierten Speicherlecks:** Ein memory leak in einem einzelnen Skript kann niemals über Stunden den gesamten Server zum Absturz bringen, wie es bei dauerhaft im RAM laufenden Node- oder Java-Daemons passieren kann.\n* **PHP 8 Revolution:** Just-In-Time (JIT) Compiler, Attributes, Enums und strikte Typisierung (`declare(strict_types=1);`).",
              "en": "Why does PHP power over 75% of websites worldwide?\n\n* **Isolated Request Lifecycle:** FastCGI Process Manager (PHP-FPM) provisions fresh runtime state per request and flushes memory completely upon response completion.\n* **No Cumulative Memory Leaks:** A leak in one request cannot starve server RAM over time.\n* **Modern PHP 8:** JIT compilation, native attributes, enums, and strict typing."
            },
            "code": "<?php\ndeclare(strict_types=1);\n\n// PHP 8 Constructor Promotion & Readonly Properties\nfinal class UserDTO {\n    public function __construct(\n        public readonly int $id,\n        public readonly string $email,\n        public string $displayName\n    ) {}\n}",
            "codeSnippet": "<?php\ndeclare(strict_types=1);\n\n// PHP 8 Constructor Promotion & Readonly Properties\nfinal class UserDTO {\n    public function __construct(\n        public readonly int $id,\n        public readonly string $email,\n        public string $displayName\n    ) {}\n}"
          },
          {
            "id": "php-01-sec-02",
            "type": "concept",
            "title": {
              "de": "Datenbankzugriff mit PDO & Prepared Statements",
              "en": "Database Access with PDO & Prepared Statements"
            },
            "content": {
              "de": "Veralteter PHP-Code nutzte unsichere `mysql_*`-Funktionen. Der moderne IHK-Standard verlangt ausnahmslos **PDO (PHP Data Objects)**:\n\n* **Zweistufige Ausführung:** `prepare()` sendet die Abfragestruktur an die Datenbank-Engine; `execute()` bindet die Nutzereingaben getrennt an Platzhalter (`:param`).\n* **Emulated Prepares deaktivieren:** Mit `PDO::ATTR_EMULATE_PREPARES => false` zwingt man den Datenbanktreiber, echte serverseitige Prepared Statements des RDBMS zu verwenden.",
              "en": "Legacy PHP relied on flawed `mysql_*` routines. Modern standards mandate **PDO (PHP Data Objects)**:\n\n* **Two-Step Execution:** `prepare()` compiles grammar; `execute()` binds parameters separately.\n* **Disable Emulation:** Set `PDO::ATTR_EMULATE_PREPARES => false` to enforce true native database-level parameterized execution."
            },
            "code": "$stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE email = :email');\n$stmt->execute(['email' => $userEmail]);\n$user = $stmt->fetch(PDO::FETCH_ASSOC);",
            "codeSnippet": "$stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE email = :email');\n$stmt->execute(['email' => $userEmail]);\n$user = $stmt->fetch(PDO::FETCH_ASSOC);"
          },
          {
            "id": "php-01-sec-03",
            "type": "quiz_choice",
            "title": {
              "de": "Passwort-Hashing nach aktuellem BSI-Standard",
              "en": "Password Hashing per Security Guidelines"
            },
            "prompt": {
              "de": "Welche native PHP-Funktion erzeugt kryptografisch sichere, mit Salt und Work-Factor versehene Hashes nach modernen Standards wie Argon2id oder Bcrypt?",
              "en": "Which native PHP function produces cryptographically secure, salted hashes using standards like Argon2id or Bcrypt?"
            },
            "options": [
              "`password_hash($password, PASSWORD_ARGON2ID)`",
              "`md5($password)`",
              "`sha1($password . 'salt')`",
              "`base64_encode($password)`"
            ],
            "solution": 0,
            "explanation": {
              "de": "`password_hash()` wählt kryptografisch sichere Salze, steuert Arbeitsfaktoren und nutzt standardmäßig modernste Algorithmen (Argon2id bzw. Bcrypt). Zum Verifizieren dient `password_verify()`.",
              "en": "`password_hash()` generates secure cryptographic salts and work factors using Argon2id/Bcrypt. Paired with `password_verify()`, it prevents timing attacks."
            }
          },
          {
            "id": "php-01-sec-04",
            "type": "quiz_code_puzzle",
            "title": {
              "de": "Code-Puzzle: Strikte Typisierung aktivieren",
              "en": "Code Puzzle: Enabling Strict Types"
            },
            "starterCode": "declare(___ = 1);",
            "prompt": {
              "de": "Mit welcher Direktive an oberster Stelle einer PHP-Datei wird die implizite Typkonvertierung von Argumenten und Rückgabewerten unterbunden?",
              "en": "Which directive at the top of a PHP file enforces strict type checks on arguments and return values?"
            },
            "options": [
              "strict_types",
              "type_check",
              "strict_mode",
              "enforce_types"
            ],
            "solution": "strict_types",
            "explanation": {
              "de": "`declare(strict_types=1);` zwingt PHP dazu, bei Typabweichungen einen fatalen `TypeError` auszulösen, anstatt Typen stillschweigend umzuwandeln.",
              "en": "`declare(strict_types=1);` triggers fatal `TypeError` exceptions upon type mismatches rather than performing silent casting."
            }
          }
        ]
      },
      {
        "id": "php-exam-90min",
        "index": 2,
        "type": "exam_90min",
        "level": {
          "de": "Abschlussprüfung",
          "en": "Final Exam"
        },
        "title": {
          "de": "🎓 Abschlussprüfung (90 Min): Backend Architecture & Session Security",
          "en": "🎓 Final Exam (90 Min): Backend Architecture & Session Security"
        },
        "duration": "90 min",
        "sections": [
          {
            "id": "exam-php-q01",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 1 (20 Punkte): Session Fixation & session_regenerate_id",
              "en": "Question 1 (20 Points): Session Fixation Defense"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Ein Angreifer gibt einem Opfer eine präparierte Session-ID vor. Sobald sich das Opfer anmeldet, behält die Session dieselbe ID und der Angreifer übernimmt das Konto. Welche Funktion muss unmittelbar nach erfolgreichem Login aufgerufen werden, um diese Schwachstelle zu schließen?",
              "en": "An attacker predetermines a victim's session ID. Once the victim logs in, the session ID remains unchanged, enabling hijacking. Which function prevents this when invoked immediately upon successful authentication?"
            },
            "options": [
              "`session_regenerate_id(true);` (erzeugt eine neue Session-ID und löscht die alte Session-Datei)",
              "`session_destroy();`",
              "`session_start();`",
              "`setcookie(\"logged_in\", \"yes\");`"
            ],
            "solution": 0,
            "explanation": {
              "de": "`session_regenerate_id(true)` invalidiert die alte Session-ID und weist dem authentifizierten Benutzer eine völlig neue, kryptografisch zufällige ID zu. Damit läuft die vom Angreifer vorgegebene ID sofort ins Leere.",
              "en": "`session_regenerate_id(true)` rotates the session identifier and purges old session storage, rendering the attacker's hijacked token obsolete."
            }
          },
          {
            "id": "exam-php-q02",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 2 (20 Punkte): Cookie-Sicherheitsflags (HttpOnly, Secure, SameSite)",
              "en": "Question 2 (20 Points): Cookie Security Flags"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Welche Konfiguration in `php.ini` bzw. `session_set_cookie_params()` verhindert, dass JavaScript über XSS das Session-Cookie `PHPSESSID` auslesen kann (`document.cookie`)?",
              "en": "Which configuration prevents client-side JavaScript from reading the session cookie `PHPSESSID` via XSS (`document.cookie`)?"
            },
            "options": [
              "`session.cookie_httponly = 1;`",
              "`session.cookie_secure = 0;`",
              "`session.use_trans_sid = 1;`",
              "`session.auto_start = 1;`"
            ],
            "solution": 0,
            "explanation": {
              "de": "Das `HttpOnly`-Flag weist den Browser an, den Zugriff auf das Cookie über DOM-Schnittstellen wie `document.cookie` komplett zu blockieren. Selbst wenn ein Angreifer schadhaften JavaScript-Code einschleust, kann er das Session-Cookie nicht stehlen.",
              "en": "The `HttpOnly` directive instructs browsers to deny client-side scripts access to the cookie, shielding session tokens against XSS exfiltration."
            }
          },
          {
            "id": "exam-php-q03",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 3 (20 Punkte): MVC-Architekturmuster",
              "en": "Question 3 (20 Points): MVC Architectural Pattern"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Welche Aufgabe übernimmt der 'Controller' im klassischen Model-View-Controller (MVC) Architekturmuster einer Webanwendung?",
              "en": "What is the primary responsibility of the 'Controller' in classical MVC architecture?"
            },
            "options": [
              "Er nimmt den HTTP-Request entgegen, interagiert mit dem Model (Geschäftslogik / Daten) und wählt die passende View zur Rückgabe an den Client aus.",
              "Er formatiert das CSS-Layout der Website.",
              "Er speichert die Datenbank-Tabellen auf der Festplatte.",
              "Er verwaltet die Netzwerkkabel im Serverraum."
            ],
            "solution": 0,
            "explanation": {
              "de": "Der Controller agiert als Vermittler (Orchestrator): Er verarbeitet Benutzeraktionen, ruft Geschäftslogik im Model auf und reicht die Daten an die View weiter, die das HTML generiert.",
              "en": "The Controller acts as coordinator: It ingests requests, delegates business operations to the Model, and selects the appropriate View template to render."
            }
          },
          {
            "id": "exam-php-q04",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 4 (20 Punkte): Schutz vor Cross-Site Request Forgery (CSRF)",
              "en": "Question 4 (20 Points): Anti-CSRF Token Validation"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Wie schützt das 'Synchronizer Token Pattern' in PHP ein Formular zuverlässig vor CSRF-Angriffen?",
              "en": "How does the Synchronizer Token Pattern protect web forms against CSRF attacks in PHP?"
            },
            "options": [
              "In der Session wird ein kryptografischer Zufallswert gespeichert und als verstecktes `<input type=\"hidden\" name=\"csrf_token\">` im Formular mitgesendet; beim POST-Empfang vergleicht der Server beide Werte.",
              "Durch Deaktivierung von POST-Requests.",
              "Indem man Passwörter im Formular im Klartext mitsendet.",
              "Indem der Benutzer bei jedem Klick ein Captcha lösen muss."
            ],
            "solution": 0,
            "explanation": {
              "de": "Ein fremder Angreifer kann zwar vom Browser des Opfers einen POST-Request absenden, kann jedoch aufgrund der Same-Origin-Policy das geheime CSRF-Token aus dem Formular nicht auslesen. Stimmt das übermittelte Token nicht mit dem Session-Token überein, weist der Server den Request ab.",
              "en": "The Synchronizer Token Pattern generates an unpredictable token bound to the session. Attackers cannot read this token cross-origin; mismatched POST submissions are rejected."
            }
          },
          {
            "id": "exam-php-q05",
            "type": "quiz_choice",
            "title": {
              "de": "Frage 5 (20 Punkte): Composer & Dependency Management",
              "en": "Question 5 (20 Points): Composer & Dependency Management"
            },
            "scoreWeight": 20,
            "prompt": {
              "de": "Welche Datei legt in einem PHP-Projekt die exakten, reproduzierbaren Versionen aller installierten Drittbibliotheken fest und muss zwingend in Git versioniert werden?",
              "en": "Which file locks the exact, reproducible versions of all installed third-party libraries and must be committed to Git?"
            },
            "options": [
              "`composer.lock`",
              "`vendor/` (dieser Ordner gehört in `.gitignore`)",
              "`composer.json` (definiert nur Versionsbereiche)",
              "`php.ini`"
            ],
            "solution": 0,
            "explanation": {
              "de": "`composer.lock` speichert die exakten Git-Commits und Prüfsummen aller installierten Pakete. Dadurch installieren alle Entwickler und CI/CD-Pipelines mit `composer install` auf das Bit genau denselben Codebestand.",
              "en": "`composer.lock` pins the exact commit hashes and dependency trees, guaranteeing identical reproducible installs across production and team environments."
            }
          }
        ],
        "scenario": {
          "de": "Handlungssituation: Sie sind Anwendungsentwickler/in bei einem E-Commerce-Dienstleister. Eine Shop-Plattform auf PHP-Basis soll auditiert werden. Sie müssen Session-Entführungen (Session Hijacking / Fixation) unterbinden, ein robustes MVC-Routing einrichten und Datenbankzugriffe gegen SQL-Injektionen absichern.",
          "en": "Scenario: You are a software developer at an e-commerce agency. A PHP web platform requires a security audit. You must neutralize session hijacking and fixation risks, implement MVC routing, and harden database connections against injection."
        }
      }
    ]
  }
];

  // DOM Elements
  let dom = {};

  function initDOM() {
    dom = {
      courseList: document.getElementById('courseList'),
      stageCourseTitle: document.getElementById('stageCourseTitle'),
      stageCourseDesc: document.getElementById('stageCourseDesc'),
      stageBadge: document.getElementById('stageBadge'),
      chapterGrid: document.getElementById('chapterGrid'),
      chapterView: document.getElementById('chapterView'),
      lessonPlayer: document.getElementById('lessonPlayer'),
      examRunner: document.getElementById('examRunner'),
      playerTitle: document.getElementById('playerTitle'),
      playerProgress: document.getElementById('playerProgress'),
      playerContent: document.getElementById('playerContent'),
      playerFeedback: document.getElementById('playerFeedback'),
      playerActions: document.getElementById('playerActions'),
      xpDisplay: document.getElementById('xpDisplay'),
      streakDisplay: document.getElementById('streakDisplay'),
      // Robot Widget
      robotBtn: document.getElementById('robotBtn'),
      robotDrawerBackdrop: document.getElementById('robotDrawerBackdrop'),
      closeRobotDrawer: document.getElementById('closeRobotDrawer'),
      // Settings Modal
      settingsBtn: document.getElementById('settingsBtn'),
      settingsModal: document.getElementById('settingsModal'),
      closeSettingsModal: document.getElementById('closeSettingsModal'),
      settingDailyReminder: document.getElementById('settingDailyReminder'),
      settingReminderTime: document.getElementById('settingReminderTime'),
      settingInactivity: document.getElementById('settingInactivity'),
      btnSaveSettings: document.getElementById('btnSaveSettings'),
      btnTestNotification: document.getElementById('btnTestNotification')
    };
  }

  // Set Language
  window.setLang = function(lang) {
    state.lang = lang;
    localStorage.setItem('learn_lang', lang);
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('btn-lang-' + lang);
    if (btn) btn.classList.add('active');
    
    // Refresh Current View
    renderCourseList();
    renderCourseStage();
    if (state.exam.active) {
      renderExamQuestion();
    } else if (state.currentChapter) {
      renderLessonSection();
    }
  };

  // Toggle Theme
  window.toggleTheme = function() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('site_theme', state.theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = state.theme === 'dark' ? '🌙' : '☀️';
  };

  // Save Progress
  function saveProgress() {
    state.progress.lastActive = Date.now();
    localStorage.setItem('learn_progress', JSON.stringify(state.progress));
    if (dom.xpDisplay) dom.xpDisplay.textContent = state.progress.xp;
    if (dom.streakDisplay) dom.streakDisplay.textContent = state.progress.streak;
  }

  // Render Courses in Sidebar
  function renderCourseList() {
    if (!dom.courseList) return;
    dom.courseList.innerHTML = '';
    state.courses.forEach(course => {
      const btn = document.createElement('button');
      btn.className = `course-card-btn ${course.id === state.currentCourseId ? 'active' : ''}`;
      btn.onclick = () => selectCourse(course.id);
      
      const title = course.title[state.lang] || course.title.en;
      const desc = course.desc[state.lang] || course.desc.en;

      btn.innerHTML = `
        <div class="c-card-icon">${course.icon}</div>
        <div class="c-card-info">
          <div class="c-card-title">${escapeHtml(title)}</div>
          <div class="c-card-badge">${escapeHtml(course.badge)}</div>
          <div class="c-card-desc">${escapeHtml(desc)}</div>
        </div>
      `;
      dom.courseList.appendChild(btn);
    });
  }

  // Select Course
  window.selectCourse = function(courseId) {
    if (state.exam.active && !confirm(state.lang === 'de' ? 'Laufende Abschlussprüfung wirklich abbrechen?' : 'Do you really want to abort the active exam?')) {
      return;
    }
    if (state.exam.active) stopExamTimer();

    state.currentCourseId = courseId;
    state.currentChapter = null;
    state.currentSectionIndex = 0;
    renderCourseList();
    renderCourseStage();
  };

  // Render Course Stage
  function renderCourseStage() {
    const course = state.courses.find(c => c.id === state.currentCourseId);
    if (!course) return;

    dom.stageCourseTitle.textContent = course.title[state.lang] || course.title.en;
    dom.stageCourseDesc.textContent = course.desc[state.lang] || course.desc.en;
    dom.stageBadge.textContent = course.badge.toUpperCase();

    dom.chapterView.style.display = 'block';
    dom.lessonPlayer.style.display = 'none';

    dom.chapterGrid.innerHTML = '';

    course.chapters.forEach(ch => {
      const isExam = ch.type === 'exam_90min';
      const card = document.createElement('div');
      card.className = `chapter-card ${isExam ? 'exam-card' : ''}`;

      const title = ch.title[state.lang] || ch.title.en;
      const levelLabel = ch.level ? (ch.level[state.lang] || ch.level.en) : (isExam ? (state.lang === 'de' ? 'Abschlussprüfung' : 'Final Exam') : (state.lang === 'de' ? 'Grundlagen' : 'Fundamentals'));
      
      const totalSec = ch.sections.length;
      let completedSec = 0;
      ch.sections.forEach(s => {
        if (state.progress.completedSections.includes(s.id)) completedSec++;
      });

      const isCompleted = isExam ? (state.progress.examResults && !!state.progress.examResults[ch.id]) : (completedSec === totalSec && totalSec > 0);
      const examResult = (state.progress.examResults && state.progress.examResults[ch.id]) || null;

      card.innerHTML = `
        <div class="chapter-card-header">
          <span class="chapter-number">${isExam ? '🎓 ABSCHLUSSPRÜFUNG' : (state.lang === 'de' ? `Kapitel ${ch.index}` : `Chapter ${ch.index}`)}</span>
          <span class="chapter-level-pill ${isExam ? 'pill-exam' : ''}">${escapeHtml(levelLabel)}</span>
        </div>
        <h3 class="chapter-title">${escapeHtml(title)}</h3>
        <div class="chapter-meta">
          <span>⏱️ ${ch.duration}</span>
          <span>•</span>
          <span>${isExam ? `${totalSec} ${state.lang === 'de' ? 'Prüfungsaufgaben' : 'Exam Tasks'}` : `${totalSec} ${state.lang === 'de' ? 'Lektionen' : 'Lessons'}`}</span>
          ${isCompleted ? `<span class="completed-check">✓ ${state.lang === 'de' ? 'Abgeschlossen' : 'Completed'}</span>` : ''}
        </div>
        ${examResult ? `
          <div class="chapter-exam-score-pill">
            🏆 ${state.lang === 'de' ? 'Bestanden mit Note' : 'Passed with Grade'} ${examResult.grade} (${examResult.score}%)
          </div>
        ` : ''}
        <button type="button" class="btn-card ${isExam ? 'highlight' : ''}" onclick="startChapter('${ch.id}')">
          ${isExam ? (state.lang === 'de' ? '⏱️ Prüfung starten (90 Min.)' : '⏱️ Start Exam (90 min)') : (isCompleted ? (state.lang === 'de' ? 'Wiederholen' : 'Review') : (state.lang === 'de' ? 'Starten' : 'Start'))}
        </button>
      `;

      dom.chapterGrid.appendChild(card);
    });
  }

  // Start Chapter or Exam
  window.startChapter = function(chapterId) {
    const course = state.courses.find(c => c.id === state.currentCourseId);
    if (!course) return;

    const chapter = course.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return;

    if (chapter.type === 'exam_90min') {
      startExamMode(chapter);
      return;
    }

    state.currentChapter = chapter;
    state.currentSectionIndex = 0;

    dom.chapterView.style.display = 'none';
    dom.lessonPlayer.style.display = 'block';

    renderLessonSection();
  };

  // Close Lesson Player
  window.closePlayer = function() {
    state.currentChapter = null;
    state.currentSectionIndex = 0;
    renderCourseStage();
  };

  // Render Lesson Section
  function renderLessonSection() {
    const ch = state.currentChapter;
    if (!ch) return;

    const section = ch.sections[state.currentSectionIndex];
    if (!section) {
      showChapterCompleted();
      return;
    }

    // Update Header
    const pct = Math.round(((state.currentSectionIndex) / ch.sections.length) * 100);
    dom.playerProgress.style.width = pct + '%';
    dom.playerTitle.textContent = `${state.lang === 'de' ? 'Abschnitt' : 'Step'} ${state.currentSectionIndex + 1} / ${ch.sections.length}`;

    // Clear Feedback
    dom.playerFeedback.innerHTML = '';
    dom.playerActions.innerHTML = '';

    renderSectionContent(section);
  }

  // Render Section by Type
  function renderSectionContent(section) {
    if (section.type === 'concept') {
      const title = section.title[state.lang] || section.title.en;
      const text = section.content ? (section.content[state.lang] || section.content.en) : '';

      dom.playerContent.innerHTML = `
        <div class="concept-box">
          <h2 class="concept-title">${escapeHtml(title)}</h2>
          <div class="concept-body">${formatMarkdownText(text)}</div>
          ${section.code ? `<pre class="code-block-container"><code>${escapeHtml(section.code)}</code></pre>` : ''}
        </div>
      `;

      dom.playerActions.innerHTML = `
        <button type="button" class="btn-action" onclick="nextSection()">${state.lang === 'de' ? 'Verstanden & Weiter →' : 'Understood & Next →'}</button>
      `;

    } else if (section.type === 'quiz_choice') {
      const prompt = section.prompt[state.lang] || section.prompt.en;

      let optionsHtml = '';
      section.options.forEach((opt, idx) => {
        optionsHtml += `
          <button type="button" class="option-btn" onclick="selectQuizOption(${idx})">
            <span>${idx + 1}.</span>
            <span>${escapeHtml(opt)}</span>
          </button>
        `;
      });

      dom.playerContent.innerHTML = `
        <div class="quiz-box">
          <p class="quiz-prompt">${escapeHtml(prompt)}</p>
          <div class="options-grid" id="quizOptionsGrid">${optionsHtml}</div>
        </div>
      `;

      dom.playerActions.innerHTML = '';

    } else if (section.type === 'quiz_code_puzzle') {
      const prompt = section.prompt[state.lang] || section.prompt.en;
      const snippet = section.codeSnippet || section.starterCode || '';

      let chipsHtml = '';
      section.options.forEach(opt => {
        chipsHtml += `<button type="button" class="option-btn" style="padding: 8px 16px; font-family: var(--font-mono);" onclick="selectPuzzleOption('${escapeHtml(opt)}')">${escapeHtml(opt)}</button>`;
      });

      dom.playerContent.innerHTML = `
        <div class="quiz-box">
          <p class="quiz-prompt">${escapeHtml(prompt)}</p>
          <pre class="code-block-container"><code id="puzzleCodePreview">${escapeHtml(snippet)}</code></pre>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px;">${chipsHtml}</div>
        </div>
      `;

      dom.playerActions.innerHTML = '';

    } else if (section.type === 'quiz_compiler_fix') {
      const prompt = section.prompt[state.lang] || section.prompt.en;
      const initialCode = section.buggyCode || '';
      const initialError = section.compilerOutput && section.compilerOutput.error 
        ? section.compilerOutput.error 
        : (state.lang === 'de' ? 'Kompilierungsfehler im Quellcode vorhanden.' : 'Compilation error present in source code.');

      dom.playerContent.innerHTML = `
        <div class="quiz-box">
          <p class="quiz-prompt">${escapeHtml(prompt)}</p>
          
          <div class="compiler-playground">
            <div class="compiler-topbar">
              <div class="compiler-tabs">
                <span class="compiler-tab">📄 main.go</span>
              </div>
              <span class="compiler-lang-badge">⚡ Go 1.22 Native Compiler</span>
            </div>

            <div class="compiler-editor-wrap">
              <textarea class="compiler-textarea" id="compilerSourceEditor" spellcheck="false">${escapeHtml(initialCode)}</textarea>
            </div>

            <div class="compiler-actions-bar">
              <button type="button" class="btn-reset-code" onclick="resetCompilerCode()">
                🔄 ${state.lang === 'de' ? 'Code zurücksetzen' : 'Reset Code'}
              </button>
              <button type="button" class="btn-compile" onclick="runCompilerCheck()">
                ▶️ ${state.lang === 'de' ? 'Code Kompilieren & Ausführen' : 'Compile & Run Code'}
              </button>
            </div>

            <div class="compiler-terminal">
              <div class="terminal-header">
                <span>Terminal / Build Diagnostics</span>
                <span class="terminal-status-pill error" id="terminalStatusPill">Build Failed (Exit 1)</span>
              </div>
              <pre class="terminal-output error" id="terminalOutputText">${escapeHtml(initialError)}</pre>
            </div>
          </div>
        </div>
      `;

      dom.playerActions.innerHTML = '';

    } else if (section.type === 'quiz_inline_code') {
      const prompt = section.prompt[state.lang] || section.prompt.en;
      let chipsHtml = '';
      (section.options || []).forEach(opt => {
        chipsHtml += `<button type="button" class="option-btn" style="padding: 8px 16px; font-family: var(--font-mono);" onclick="selectInlineOption('${escapeHtml(opt)}')">${escapeHtml(opt)}</button>`;
      });

      dom.playerContent.innerHTML = `
        <div class="quiz-box">
          <p class="quiz-prompt">${escapeHtml(prompt)}</p>
          <div class="inline-code-snippet">
            <code id="inlineCodePreview">${escapeHtml(section.starterCode || '')}</code>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px;">
            ${chipsHtml}
          </div>
        </div>
      `;

      dom.playerActions.innerHTML = '';
    }
  }

  function formatMarkdownText(text) {
    if (!text) return '';
    return text
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n\* /g, '<br>• ')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background: var(--bg-surface); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.875em;">$1</code>');
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Select Quiz Choice - With Distractor Explanations
  window.selectQuizOption = function(selectedIdx) {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const isCorrect = selectedIdx === section.solution;
    const isDe = state.lang === 'de';

    const buttons = document.querySelectorAll('#quizOptionsGrid .option-btn');

    if (isCorrect) {
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === section.solution) {
          btn.classList.remove('wrong');
          btn.classList.add('correct');
        }
      });

      addXP(10, section.id);
      const explanation = section.explanation[state.lang] || section.explanation.en;
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner success">
          <strong>${isDe ? '🎉 Richtig gelöst! (+10 XP)' : '🎉 Correct! (+10 XP)'}</strong>
          <span>${escapeHtml(explanation)}</span>
        </div>
      `;

      dom.playerActions.innerHTML = `
        <button type="button" class="btn-action" onclick="nextSection()">${isDe ? 'Weiter →' : 'Continue →'}</button>
      `;
    } else {
      const clickedBtn = buttons[selectedIdx];
      if (clickedBtn) {
        clickedBtn.classList.add('wrong');
      }

      let distractorNote = '';
      if (section.distractorExplanations && section.distractorExplanations[selectedIdx]) {
        distractorNote = section.distractorExplanations[selectedIdx][state.lang] || section.distractorExplanations[selectedIdx].en;
      } else {
        distractorNote = isDe
          ? 'Diese Auswahl ist fachlich nicht zutreffend. Überprüfe die Konzepte und versuche eine andere Antwort.'
          : 'This option is incorrect. Review the concepts and try another choice.';
      }

      const selectedText = section.options[selectedIdx];
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner distractor-note">
          <strong>⚠️ ${isDe ? `Hinweis zu deiner Auswahl ("${escapeHtml(selectedText)}"):` : `Note on your choice ("${escapeHtml(selectedText)}"):`}</strong>
          <span>${escapeHtml(distractorNote)}</span>
        </div>
      `;
    }
  };

  // Select Puzzle Option - With Distractor Explanations
  window.selectPuzzleOption = function(selectedWord) {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const isCorrect = selectedWord === section.solution;
    const isDe = state.lang === 'de';

    if (isCorrect) {
      addXP(15, section.id);
      const preview = document.getElementById('puzzleCodePreview');
      if (preview) {
        preview.textContent = (section.codeSnippet || section.starterCode || '').replace('___', selectedWord);
      }

      const buttons = document.querySelectorAll('#playerContent .option-btn');
      buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent.trim() === selectedWord) btn.classList.add('correct');
      });

      const explanation = section.explanation[state.lang] || section.explanation.en;
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner success">
          <strong>${isDe ? '🎉 Perfekt eingesetzt! (+15 XP)' : '🎉 Well done! (+15 XP)'}</strong>
          <span>${escapeHtml(explanation)}</span>
        </div>
      `;

      dom.playerActions.innerHTML = `
        <button type="button" class="btn-action" onclick="nextSection()">${isDe ? 'Weiter →' : 'Continue →'}</button>
      `;
    } else {
      let distractorNote = '';
      if (section.distractorExplanations && section.distractorExplanations[selectedWord]) {
        distractorNote = section.distractorExplanations[selectedWord][state.lang] || section.distractorExplanations[selectedWord].en;
      } else {
        distractorNote = isDe
          ? `Der Operator oder Bezeichner '${selectedWord}' ist an dieser Stelle syntaktisch unzulässig.`
          : `The operator or identifier '${selectedWord}' is syntactically invalid here.`;
      }

      const buttons = document.querySelectorAll('#playerContent .option-btn');
      buttons.forEach(btn => {
        if (btn.textContent.trim() === selectedWord) btn.classList.add('wrong');
      });

      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner distractor-note">
          <strong>⚠️ ${isDe ? `Hinweis zu deiner Auswahl ("${escapeHtml(selectedWord)}"):` : `Note on selection ("${escapeHtml(selectedWord)}"):`}</strong>
          <span>${escapeHtml(distractorNote)}</span>
        </div>
      `;
    }
  };

  // Select Inline Option
  window.selectInlineOption = function(selectedWord) {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const isCorrect = selectedWord === section.solution;
    const isDe = state.lang === 'de';

    if (isCorrect) {
      addXP(15, section.id);
      const preview = document.getElementById('inlineCodePreview');
      if (preview) {
        preview.textContent = (section.starterCode || '').replace('___', selectedWord);
      }

      const buttons = document.querySelectorAll('#playerContent .option-btn');
      buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent.trim() === selectedWord) btn.classList.add('correct');
      });

      const explanation = section.explanation[state.lang] || section.explanation.en;
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner success">
          <strong>${isDe ? '🎉 Richtig eingesetzt! (+15 XP)' : '🎉 Correctly filled! (+15 XP)'}</strong>
          <span>${escapeHtml(explanation)}</span>
        </div>
      `;

      dom.playerActions.innerHTML = `
        <button type="button" class="btn-action" onclick="nextSection()">${isDe ? 'Weiter →' : 'Continue →'}</button>
      `;
    } else {
      let distractorNote = '';
      if (section.distractorExplanations && section.distractorExplanations[selectedWord]) {
        distractorNote = section.distractorExplanations[selectedWord][state.lang] || section.distractorExplanations[selectedWord].en;
      } else {
        distractorNote = isDe ? `Die Auswahl '${selectedWord}' ist syntaktisch inkorrekt.` : `Selection '${selectedWord}' is invalid.`;
      }

      const buttons = document.querySelectorAll('#playerContent .option-btn');
      buttons.forEach(btn => {
        if (btn.textContent.trim() === selectedWord) btn.classList.add('wrong');
      });

      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner distractor-note">
          <strong>⚠️ ${isDe ? `Hinweis zu deiner Auswahl ("${escapeHtml(selectedWord)}"):` : `Note on selection ("${escapeHtml(selectedWord)}"):`}</strong>
          <span>${escapeHtml(distractorNote)}</span>
        </div>
      `;
    }
  };

  // Compiler Playground Handlers
  window.resetCompilerCode = function() {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const editor = document.getElementById('compilerSourceEditor');
    const termOutput = document.getElementById('terminalOutputText');
    const statusPill = document.getElementById('terminalStatusPill');
    if (editor && section.buggyCode) {
      editor.value = section.buggyCode;
    }
    if (termOutput && section.compilerOutput && section.compilerOutput.error) {
      termOutput.className = 'terminal-output error';
      termOutput.textContent = section.compilerOutput.error;
    }
    if (statusPill) {
      statusPill.className = 'terminal-status-pill error';
      statusPill.textContent = 'Build Failed (Exit 1)';
    }
    dom.playerFeedback.innerHTML = '';
    dom.playerActions.innerHTML = '';
  };

  window.runCompilerCheck = function() {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const editor = document.getElementById('compilerSourceEditor');
    const termOutput = document.getElementById('terminalOutputText');
    const statusPill = document.getElementById('terminalStatusPill');
    const isDe = state.lang === 'de';

    if (!editor) return;
    const userCode = editor.value;

    function normalizeCode(c) {
      return c.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
    }

    const expectedNormalized = normalizeCode(section.solutionCode || '');
    const userNormalized = normalizeCode(userCode);

    let isFixed = false;
    if (userNormalized === expectedNormalized) {
      isFixed = true;
    } else if (section.id === 'go-01-sec-05' && userCode.includes('fmt.Println') && !userCode.includes('fmt.Printlln')) {
      isFixed = true;
    } else if (section.id === 'go-02-sec-04' && userCode.includes('strconv.Atoi') && userCode.includes('if err != nil')) {
      isFixed = true;
    } else if (section.id === 'go-03-sec-04' && userCode.includes('make(map[string]int)')) {
      isFixed = true;
    } else if (section.id === 'go-04-sec-04' && userCode.includes('func (cfg *TLSConfig)')) {
      isFixed = true;
    } else if (section.id === 'go-05-sec-04' && userCode.includes('func (c ConsoleLogger) Log(msg string) error') && userCode.includes('return nil')) {
      isFixed = true;
    } else if (section.id === 'go-06-sec-04' && userCode.includes('defer wg.Done()')) {
      isFixed = true;
    } else if (section.id === 'go-07-sec-04' && userCode.includes('func StatusHandler(w http.ResponseWriter, r *http.Request)')) {
      isFixed = true;
    }

    if (isFixed) {
      addXP(20, section.id);
      const successText = (section.compilerOutput && section.compilerOutput.success) 
        ? section.compilerOutput.success 
        : `[go build ./...]\n${isDe ? 'Kompilierung fehlerfrei abgeschlossen (0.02s) · Exit Code: 0\nStatus: Programm erfolgreich ausgeführt!' : 'Build succeeded (0.02s) · Exit Code: 0\nStatus: Execution finished successfully!'}`;
      
      if (termOutput) {
        termOutput.className = 'terminal-output success';
        termOutput.textContent = successText;
      }
      if (statusPill) {
        statusPill.className = 'terminal-status-pill success';
        statusPill.textContent = 'Build Succeeded (Exit 0)';
      }

      const explanation = section.explanation[state.lang] || section.explanation.en;
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner success">
          <strong>${isDe ? '🎉 Perfekt behoben! Compiler baut fehlerfrei (+20 XP)' : '🎉 Successfully fixed! Build succeeded (+20 XP)'}</strong>
          <span>${escapeHtml(explanation)}</span>
        </div>
      `;

      dom.playerActions.innerHTML = `
        <button type="button" class="btn-action" onclick="nextSection()">${isDe ? 'Weiter →' : 'Continue →'}</button>
      `;
    } else {
      const errText = (section.compilerOutput && section.compilerOutput.error)
        ? section.compilerOutput.error
        : `[go build ./...]\n./main.go: Fehler nicht vollständig korrigiert. Prüfe Syntax und Signaturen.`;

      if (termOutput) {
        termOutput.className = 'terminal-output error';
        termOutput.textContent = errText;
      }
      if (statusPill) {
        statusPill.className = 'terminal-status-pill error';
        statusPill.textContent = 'Build Failed (Exit 1)';
      }

      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner distractor-note">
          <strong>⚠️ ${isDe ? 'Compiler meldet noch Fehler:' : 'Compiler still reports errors:'}</strong>
          <span>${isDe ? 'Der Bug ist noch nicht vollständig behoben. Überprüfe die Aufgabenstellung und die rote Fehlermeldung im Terminal oben!' : 'The bug is not resolved yet. Review the instructions and compiler output above.'}</span>
        </div>
      `;
    }
  };

  // Advance Section
  window.nextSection = function() {
    state.currentSectionIndex++;
    renderLessonSection();
  };

  // Show Chapter Completed Screen
  function showChapterCompleted() {
    dom.playerProgress.style.width = '100%';
    dom.playerTitle.textContent = state.lang === 'de' ? 'Kapitel Abgeschlossen' : 'Chapter Completed';

    dom.playerContent.innerHTML = `
      <div class="concept-box" style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 3.5rem; margin-bottom: 16px;">🏆</div>
        <h2 class="concept-title">${state.lang === 'de' ? 'Hervorragende Leistung!' : 'Outstanding Achievement!'}</h2>
        <p class="concept-body">${state.lang === 'de' ? 'Du hast alle Lektionen und Übungen dieses Kapitels erfolgreich gemeistert.' : 'You have completed all lessons and exercises in this chapter.'}</p>
      </div>
    `;

    dom.playerFeedback.innerHTML = '';
    dom.playerActions.innerHTML = `
      <button type="button" class="btn-action" onclick="closePlayer()">${state.lang === 'de' ? 'Zurück zur Übersicht' : 'Back to Overview'}</button>
    `;
  }

  function addXP(points, sectionId) {
    if (!state.progress.completedSections.includes(sectionId)) {
      state.progress.completedSections.push(sectionId);
      state.progress.xp += points;
      saveProgress();
    }
  }

  // 🎓 90-MINUTE EXAM ENGINE & EVALUATION
  window.startExamMode = function(examChapter) {
    state.exam.active = true;
    state.exam.chapter = examChapter;
    state.exam.timeRemaining = (examChapter.examDurationMinutes || 90) * 60;
    state.exam.currentQuestionIdx = 0;
    state.exam.answers = {};
    state.exam.flagged = {};
    state.exam.submitted = false;
    state.exam.score = 0;
    state.exam.gradeInfo = null;

    dom.chapterView.style.display = 'none';
    dom.lessonPlayer.style.display = 'none';

    if (!dom.examRunner) {
      const examDiv = document.createElement('div');
      examDiv.id = 'examRunner';
      examDiv.className = 'exam-runner-container';
      document.querySelector('.content-stage').appendChild(examDiv);
      dom.examRunner = examDiv;
    }
    dom.examRunner.style.display = 'block';

    startExamTimer();
    renderExamQuestion();
  };

  function startExamTimer() {
    stopExamTimer();
    state.exam.timerId = setInterval(() => {
      state.exam.timeRemaining--;
      updateExamTimerDisplay();
      if (state.exam.timeRemaining <= 0) {
        stopExamTimer();
        alert(state.lang === 'de' ? 'Die Bearbeitungszeit von 90 Minuten ist abgelaufen! Die Prüfung wird automatisch ausgewertet.' : 'The 90-minute time limit has expired! The exam will now be evaluated.');
        submitExam();
      }
    }, 1000);
  }

  function stopExamTimer() {
    if (state.exam.timerId) {
      clearInterval(state.exam.timerId);
      state.exam.timerId = null;
    }
  }

  function updateExamTimerDisplay() {
    const timerEl = document.getElementById('examTimerClock');
    if (!timerEl) return;
    const totalSec = Math.max(0, state.exam.timeRemaining);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    timerEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (totalSec < 300) {
      timerEl.className = 'exam-timer-clock pulse-red';
    } else if (totalSec < 900) {
      timerEl.className = 'exam-timer-clock text-amber';
    } else {
      timerEl.className = 'exam-timer-clock';
    }
  }

  function renderExamQuestion() {
    const ch = state.exam.chapter;
    if (!ch) return;

    const questions = ch.sections;
    const qIdx = state.exam.currentQuestionIdx;
    const currentQ = questions[qIdx];
    const totalQ = questions.length;
    const isDe = state.lang === 'de';

    let pillsHtml = '';
    questions.forEach((q, idx) => {
      const isAnswered = state.exam.answers[idx] !== undefined;
      const isCurrent = idx === qIdx;
      const isFlagged = state.exam.flagged[idx] === true;

      let pillClasses = 'q-pill';
      if (isCurrent) pillClasses += ' active';
      if (isAnswered) pillClasses += ' answered';
      if (isFlagged) pillClasses += ' flagged';

      pillsHtml += `
        <button type="button" class="${pillClasses}" onclick="jumpToExamQuestion(${idx})" title="${isDe ? `Handlungsschritt ${idx + 1}` : `Action Step ${idx + 1}`}">
          <span>${idx + 1}</span>
          ${isFlagged ? '<span class="pill-flag-dot">🚩</span>' : ''}
        </button>
      `;
    });

    const title = currentQ.title[state.lang] || currentQ.title.en;
    const prompt = currentQ.prompt[state.lang] || currentQ.prompt.en;
    const weight = currentQ.scoreWeight || 20;

    let optionsHtml = '';
    currentQ.options.forEach((opt, optIdx) => {
      const isSelected = state.exam.answers[qIdx] === optIdx;
      optionsHtml += `
        <button type="button" class="exam-option-btn ${isSelected ? 'selected' : ''}" onclick="selectExamAnswer(${optIdx})">
          <span class="opt-letter">${String.fromCharCode(65 + optIdx)}</span>
          <span class="opt-text">${escapeHtml(opt)}</span>
        </button>
      `;
    });

    const isLast = qIdx === totalQ - 1;
    const isFirst = qIdx === 0;
    const currentIsFlagged = state.exam.flagged[qIdx] === true;

    dom.examRunner.innerHTML = `
      <div class="exam-header-bar">
        <div class="exam-header-title">
          <div class="exam-badge-group">
            <span class="badge-ihk">🎓 ABSCHLUSSPRÜFUNG</span>
            <span class="exam-course-label">${escapeHtml(ch.title[state.lang] || ch.title.en)}</span>
          </div>
        </div>
        <div class="exam-header-right">
          <div class="exam-timer-box">
            <span class="timer-label">${isDe ? 'Verbleibende Zeit:' : 'Time Remaining:'}</span>
            <span id="examTimerClock" class="exam-timer-clock">01:30:00</span>
          </div>
          <button type="button" class="btn-abort-exam" onclick="abortExam()">${isDe ? '✕ Beenden' : '✕ Exit'}</button>
        </div>
      </div>

      <div class="exam-question-nav">
        <span class="nav-label">${isDe ? 'Aufgaben-Navigator:' : 'Task Navigator:'}</span>
        <div class="q-pills-row">${pillsHtml}</div>
      </div>

      <div class="exam-body-card">
        <div class="exam-q-header">
          <span class="exam-step-tag">${isDe ? `Handlungsschritt ${qIdx + 1} von ${totalQ}` : `Step ${qIdx + 1} of ${totalQ}`}</span>
          <span class="exam-weight-pill">${weight} ${isDe ? 'Punkte' : 'Points'}</span>
        </div>

        <h2 class="exam-q-title">${escapeHtml(title)}</h2>
        <div class="exam-q-prompt">${escapeHtml(prompt)}</div>

        <div class="exam-options-list">${optionsHtml}</div>

        <div class="exam-actions-footer">
          <div class="left-actions">
            <button type="button" class="btn-flag ${currentIsFlagged ? 'flagged' : ''}" onclick="toggleFlagCurrentQuestion()">
              ${currentIsFlagged ? (isDe ? '🚩 Zurückgestellt (aktiv)' : '🚩 Flagged for review') : (isDe ? '🏳️ Zur Wiedervorlage vormerken' : '🏳️ Flag for review')}
            </button>
          </div>
          <div class="right-actions">
            <button type="button" class="btn-action secondary" onclick="prevExamQuestion()" ${isFirst ? 'disabled' : ''}>
              ← ${isDe ? 'Vorherige' : 'Previous'}
            </button>
            ${!isLast ? `
              <button type="button" class="btn-action" onclick="nextExamQuestion()">
                ${isDe ? 'Nächste Aufgabe →' : 'Next Task →'}
              </button>
            ` : `
              <button type="button" class="btn-compile" onclick="confirmSubmitExam()">
                🏁 ${isDe ? 'Abschlussprüfung einreichen' : 'Submit Final Exam'}
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    updateExamTimerDisplay();
  }

  window.selectExamAnswer = function(optIdx) {
    state.exam.answers[state.exam.currentQuestionIdx] = optIdx;
    renderExamQuestion();
  };

  window.jumpToExamQuestion = function(idx) {
    state.exam.currentQuestionIdx = idx;
    renderExamQuestion();
  };

  window.nextExamQuestion = function() {
    const totalQ = state.exam.chapter.sections.length;
    if (state.exam.currentQuestionIdx < totalQ - 1) {
      state.exam.currentQuestionIdx++;
      renderExamQuestion();
    }
  };

  window.prevExamQuestion = function() {
    if (state.exam.currentQuestionIdx > 0) {
      state.exam.currentQuestionIdx--;
      renderExamQuestion();
    }
  };

  window.toggleFlagCurrentQuestion = function() {
    const idx = state.exam.currentQuestionIdx;
    state.exam.flagged[idx] = !state.exam.flagged[idx];
    renderExamQuestion();
  };

  window.abortExam = function() {
    if (confirm(state.lang === 'de' ? 'Abschlussprüfung wirklich abbrechen? Dein bisheriger Fortschritt wird nicht gewertet.' : 'Abort final exam? Current progress will not be graded.')) {
      closeExamMode();
    }
  };

  window.confirmSubmitExam = function() {
    const totalQ = state.exam.chapter.sections.length;
    const answeredCount = Object.keys(state.exam.answers).length;
    const unAnswered = totalQ - answeredCount;

    if (unAnswered > 0) {
      if (!confirm(state.lang === 'de' 
        ? `Achtung: Du hast ${unAnswered} von ${totalQ} Aufgaben noch nicht beantwortet! Wirklich abgeben?` 
        : `Warning: You have not answered ${unAnswered} of ${totalQ} tasks! Submit anyway?`)) {
        return;
      }
    }
    submitExam();
  };

  function calculateGrade(scorePct) {
    if (scorePct >= 92) return { grade: 1, label: { de: 'Sehr gut (1)', en: 'Very Good (1)' }, status: { de: '🏆 Mit Prädikat bestanden!', en: '🏆 Passed with Distinction!' }, color: '#10b981' };
    if (scorePct >= 81) return { grade: 2, label: { de: 'Gut (2)', en: 'Good (2)' }, status: { de: '✅ Bestanden', en: '✅ Passed' }, color: '#34d399' };
    if (scorePct >= 67) return { grade: 3, label: { de: 'Befriedigend (3)', en: 'Satisfactory (3)' }, status: { de: '✅ Bestanden', en: '✅ Passed' }, color: '#38bdf8' };
    if (scorePct >= 50) return { grade: 4, label: { de: 'Ausreichend (4)', en: 'Sufficient (4)' }, status: { de: '⚠️ Bestanden (Bestehensgrenze)', en: '⚠️ Passed (Passing threshold)' }, color: '#f59e0b' };
    if (scorePct >= 30) return { grade: 5, label: { de: 'Mangelhaft (5)', en: 'Deficient (5)' }, status: { de: '❌ Nicht bestanden', en: '❌ Failed' }, color: '#f97316' };
    return { grade: 6, label: { de: 'Ungenügend (6)', en: 'Insufficient (6)' }, status: { de: '❌ Nicht bestanden', en: '❌ Failed' }, color: '#ef4444' };
  }

  function submitExam() {
    stopExamTimer();
    state.exam.submitted = true;

    const ch = state.exam.chapter;
    const questions = ch.sections;
    let earnedPoints = 0;
    let totalMaxPoints = 0;

    questions.forEach((q, idx) => {
      const weight = q.scoreWeight || 20;
      totalMaxPoints += weight;
      const userChoice = state.exam.answers[idx];
      if (userChoice === q.solution) {
        earnedPoints += weight;
      }
    });

    const scorePct = Math.round((earnedPoints / (totalMaxPoints || 100)) * 100);
    const gradeInfo = calculateGrade(scorePct);

    state.exam.score = scorePct;
    state.exam.earnedPoints = earnedPoints;
    state.exam.totalMaxPoints = totalMaxPoints;
    state.exam.gradeInfo = gradeInfo;

    if (scorePct >= 50) {
      questions.forEach(q => {
        if (!state.progress.completedSections.includes(q.id)) {
          state.progress.completedSections.push(q.id);
        }
      });
      state.progress.xp += 100;
    }
    state.progress.examResults[ch.id] = {
      score: scorePct,
      grade: gradeInfo.grade,
      timestamp: Date.now()
    };
    saveProgress();

    renderExamResults();
  }

  function renderExamResults() {
    const ch = state.exam.chapter;
    const questions = ch.sections;
    const grade = state.exam.gradeInfo;

    let reviewsHtml = '';
    questions.forEach((q, idx) => {
      const userChoice = state.exam.answers[idx];
      const isCorrect = userChoice === q.solution;
      const weight = q.scoreWeight || 20;
      const userChoiceText = userChoice !== undefined ? q.options[userChoice] : (state.lang === 'de' ? 'Keine Antwort abgegeben' : 'No answer selected');
      const correctChoiceText = q.options[q.solution];
      const explanation = q.explanation[state.lang] || q.explanation.en;

      reviewsHtml += `
        <div class="exam-review-card ${isCorrect ? 'correct' : 'wrong'}">
          <div class="review-header">
            <span class="review-step-label">${state.lang === 'de' ? `Handlungsschritt ${idx + 1}` : `Action Step ${idx + 1}`}: ${escapeHtml(q.title[state.lang] || q.title.en)}</span>
            <span class="review-score-badge ${isCorrect ? 'score-green' : 'score-red'}">
              ${isCorrect ? `+${weight} / ${weight} Pkt.` : `0 / ${weight} Pkt.`}
            </span>
          </div>
          <p class="review-prompt"><strong>${escapeHtml(q.prompt[state.lang] || q.prompt.en)}</strong></p>
          
          <div class="review-answers-box">
            <div class="user-ans ${isCorrect ? 'ans-correct' : 'ans-wrong'}">
              <span class="ans-label">${state.lang === 'de' ? 'Ihre Lösung:' : 'Your Answer:'}</span>
              <span>${escapeHtml(userChoiceText)} ${isCorrect ? '✓' : '✗'}</span>
            </div>
            ${!isCorrect ? `
              <div class="correct-ans">
                <span class="ans-label">${state.lang === 'de' ? 'Musterlösung:' : 'Official Solution:'}</span>
                <span>${escapeHtml(correctChoiceText)} ✓</span>
              </div>
            ` : ''}
          </div>

          <div class="review-explanation">
            <strong>💡 ${state.lang === 'de' ? 'Dozenten-Begründung & Fachliche Herleitung:' : 'Technical Justification & Solution Breakdown:'}</strong>
            <p>${escapeHtml(explanation)}</p>
          </div>
        </div>
      `;
    });

    dom.examRunner.innerHTML = `
      <div class="exam-result-banner" style="border-top: 4px solid ${grade.color};">
        <div class="result-badge-top">🎓 PRÜFUNGSERGEBNIS</div>
        <h1 class="result-title">${grade.label[state.lang] || grade.label.en}</h1>
        <div class="result-status-pill" style="color: ${grade.color};">${grade.status[state.lang] || grade.status.en}</div>
        
        <div class="result-metrics-grid">
          <div class="metric-card">
            <div class="metric-val">${state.exam.earnedPoints} / ${state.exam.totalMaxPoints}</div>
            <div class="metric-lbl">${state.lang === 'de' ? 'Punkte Gesamt' : 'Total Points'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-val">${state.exam.score}%</div>
            <div class="metric-lbl">${state.lang === 'de' ? 'Erreicht' : 'Percentage'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-val">${state.exam.gradeInfo.grade}</div>
            <div class="metric-lbl">${state.lang === 'de' ? 'Note' : 'Grade'}</div>
          </div>
        </div>

        <div class="result-actions-row">
          <button type="button" class="btn-action" onclick="closeExamMode()">
            ← ${state.lang === 'de' ? 'Zurück zur Kursübersicht' : 'Back to Course'}
          </button>
          <button type="button" class="btn-card highlight" onclick="startExamMode(state.exam.chapter)">
            🔄 ${state.lang === 'de' ? 'Prüfung wiederholen' : 'Retake Exam'}
          </button>
        </div>
      </div>

      <div class="exam-review-section">
        <h2 class="review-section-title">
          📋 ${state.lang === 'de' ? 'Detaillierte Aufgaben-Analyse & Musterlösung' : 'Detailed Analysis & Model Solutions'}
        </h2>
        ${reviewsHtml}
      </div>
    `;
  }

  window.closeExamMode = function() {
    stopExamTimer();
    state.exam.active = false;
    if (dom.examRunner) dom.examRunner.style.display = 'none';
    renderCourseStage();
  };

  // Floating AI Robot Drawer Handlers
  function setupRobotWidget() {
    if (!dom.robotBtn) return;
    dom.robotBtn.onclick = () => {
      dom.robotDrawerBackdrop.classList.add('open');
    };

    dom.closeRobotDrawer.onclick = () => {
      dom.robotDrawerBackdrop.classList.remove('open');
    };

    dom.robotDrawerBackdrop.onclick = (e) => {
      if (e.target === dom.robotDrawerBackdrop) {
        dom.robotDrawerBackdrop.classList.remove('open');
      }
    };
  }

  // Settings Modal Handlers
  function setupSettingsModal() {
    if (!dom.settingsBtn) return;
    dom.settingsBtn.onclick = () => {
      dom.settingDailyReminder.checked = state.settings.reminderDaily;
      dom.settingReminderTime.value = state.settings.reminderTime || '18:00';
      dom.settingInactivity.checked = state.settings.reminderInactivity;
      dom.settingsModal.classList.add('open');
    };

    dom.closeSettingsModal.onclick = () => {
      dom.settingsModal.classList.remove('open');
    };

    dom.settingsModal.onclick = (e) => {
      if (e.target === dom.settingsModal) {
        dom.settingsModal.classList.remove('open');
      }
    };

    dom.btnSaveSettings.onclick = () => {
      state.settings.reminderDaily = dom.settingDailyReminder.checked;
      state.settings.reminderTime = dom.settingReminderTime.value;
      state.settings.reminderInactivity = dom.settingInactivity.checked;
      localStorage.setItem('learn_settings', JSON.stringify(state.settings));
      dom.settingsModal.classList.remove('open');
    };

    dom.btnTestNotification.onclick = () => {
      if (!("Notification" in window)) {
        alert("Benachrichtigungen werden von diesem Browser nicht unterstützt.");
        return;
      }
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("learn · Zeit für deinen Code-Sprint! 🚀", {
            body: "Dein Programmier-Kurs wartet auf dich. Nimm dir 5 Minuten Zeit!",
            icon: "assets/icon.png"
          });
        } else {
          alert("Benachrichtigungen wurden abgelehnt.");
        }
      });
    };
  }

  // Inactivity Check
  function checkInactivity() {
    if (!state.settings.reminderInactivity || !state.progress.lastActive) return;
    const now = Date.now();
    const daysSinceActive = (now - state.progress.lastActive) / (1000 * 60 * 60 * 24);
    if (daysSinceActive >= 3) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("learn · Hast du uns vergessen? 👋", {
          body: "Dein Kurs wartet auf dich. Schließe heute ein kurzes Kapitel ab!",
          icon: "assets/icon.png"
        });
      }
    }
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    state.courses = BUNDLED_COURSES;
    saveProgress();
    renderCourseList();
    renderCourseStage();
    setupRobotWidget();
    setupSettingsModal();
    checkInactivity();
  });

})();
