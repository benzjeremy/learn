/**
 * learn Web App - Interactive Client Logic
 * 100% Static HTML/JS, Local-First, Zero-Telemetry
 * IHK Fachinformatiker Curriculum & 90-Minute Exam Engine
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

  // 100% Offline-Resilient IHK-Curriculum Course Catalog
  const BUNDLED_COURSES = [
    {
      id: "go",
      title: { de: "Go (Golang)", en: "Go (Golang)" },
      icon: "⚡",
      badge: "Modern Systems",
      desc: { de: "Systemprogrammierung, CSP-Concurrency (Goroutines & Channels), Kompilation & Microservices.", en: "Systems programming, CSP concurrency (goroutines & channels), compilation & microservices." },
      chapters: [
        {
          id: "go-01-basics",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. Warum Go? Syntax, Speichermodell & Goroutines", en: "1. Why Go? Syntax, Memory Model & Goroutines" },
          duration: "25 min",
          sections: [
            {
              id: "go-01-s1",
              type: "concept",
              title: { de: "Warum Go? Das Problem moderner Server", en: "Why Go? The Modern Server Problem" },
              content: {
                de: "Go wurde 2007 von Robert Griesemer, Rob Pike und Ken Thompson bei Google entwickelt. Das Problem: C++ brauchte Stunden zum Kompilieren und litt unter Memory Leaks. Python und Java hatten zu viel Overhead oder Thread-Sperren (GIL). Go bietet direkte Maschinencode-Kompilierung in Sekunden und Concurrency als Kernparadigma.",
                en: "Go was developed in 2007 at Google by Robert Griesemer, Rob Pike, and Ken Thompson. The issue: C++ build times were painful and memory management risky. Python/Java suffered from runtime overhead or thread locks. Go delivers seconds-fast native compilation and concurrency as a core paradigm."
              },
              code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Native Maschinencode-Ausführung ohne VM-Overhead\n    fmt.Println(\"Hello, Go Systems Architecture!\")\n}"
            },
            {
              id: "go-01-s2",
              type: "concept",
              title: { de: "Speichermodell: Pointer & Escape Analysis", en: "Memory Model: Pointers & Escape Analysis" },
              content: {
                de: "Go übergibt Argumente standardmäßig 'by value' (als Kopie). Pointer (*T) erlauben das direkte Modifizieren einer Speicheradresse. Der Go-Compiler entscheidet per Escape Analysis eigenständig, ob eine Variable auf dem schnellen Stack bleibt oder auf den Heap auswandert.",
                en: "Go passes arguments by value (by copy) by default. Pointers (*T) allow direct memory mutation. Go's compiler automatically uses Escape Analysis to decide whether a variable stays on the high-speed stack or escapes to the heap."
              },
              code: "type Config struct { Port int }\n\n// *Config empfängt einen Zeiger auf den Speicher\nfunc setPort(c *Config, p int) {\n    c.Port = p\n}"
            },
            {
              id: "go-01-s3",
              type: "quiz_choice",
              title: { de: "IHK-Konzept: Goroutines vs. OS-Threads", en: "IHK Concept: Goroutines vs. OS Threads" },
              prompt: {
                de: "Warum kann ein Go-Server problemlos hunderttausende Goroutines gleichzeitig ausführen, während herkömmliche OS-Threads das System überlasten würden?",
                en: "Why can a Go server run hundreds of thousands of goroutines simultaneously, whereas traditional OS threads exhaust system resources?"
              },
              options: [
                "Eine Goroutine startet mit nur ca. 2 KB dynamischem Stack, während ein OS-Thread 1–2 MB fest reserviert.",
                "Weil Go die Daten im Internet und nicht im Arbeitsspeicher ablegt.",
                "Weil Go-Code im Browser simuliert wird.",
                "Weil Goroutines nur bei Vollmond ausgeführt werden."
              ],
              solution: 0,
              explanation: {
                de: "Betriebssystem-Threads reservieren typischerweise 1–2 MB Stack und erfordern teure Kernel-Kontextwechsel. Go verwaltet Goroutines im User-Space über seinen eigenen M:N-Scheduler mit schlanken 2 KB Startspeicher.",
                en: "OS threads allocate 1–2 MB fixed stack space and require expensive kernel context switches. Go manages goroutines in user space with a lightweight 2 KB initial stack."
              }
            },
            {
              id: "go-01-s4",
              type: "quiz_code_puzzle",
              title: { "de": "Code-Puzzle: Channel-Senden", "en": "Code Puzzle: Sending to Channels" },
              prompt: {
                de: "Mit welchem Operator sendet man in Go einen Wert in einen Channel?",
                en: "Which operator sends a value into a Go channel?"
              },
              codeSnippet: "resultsChan ___ \"Task fertig\"",
              options: ["<-", "->", "=>", ":="],
              solution: "<-",
              explanation: {
                de: "Der Pfeil-Operator `<-` dient in Go sowohl zum Senden (`ch <- val`) als auch zum Empfangen (`val := <-ch`) aus Channels.",
                en: "The arrow operator `<-` handles both channel sending (`ch <- val`) and receiving (`val := <-ch`)."
              }
            }
          ]
        },
        {
          id: "go-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): Go Cloud-Native & Concurrency", en: "🏛️ IHK Exam Module (90 Min): Go Cloud-Native & Concurrency" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Sie sind Software-Architekt/in bei einem Cloud-Native-Dienstleister. Für ein Telemetrie-Gateway, das 50.000 Sensor-Datenströme pro Sekunde aggregiert, entwickeln Sie einen Hochleistungs-Daemon in Go. Beantworten Sie die Prüfungsfragen zur Vermeidung von Race Conditions, Deadlocks und inkorrektem Error-Handling.",
            en: "Scenario: You are a software architect at a cloud-native consultancy. You are building a high-throughput telemetry gateway in Go aggregating 50,000 sensor streams/sec. Answer questions on preventing race conditions, deadlocks, and incorrect error handling."
          },
          sections: [
            {
              id: "ex-go-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): Data Races & Race Detector", en: "Question 1 (20 Points): Data Races & Race Detector" },
              prompt: {
                de: "Mehrere Goroutines greifen gleichzeitig lesend und schreibend auf eine gemeinsame Variable `counter++` zu. Welches Tool der Go-Toolchain identifiziert dieses Problem im Testlauf?",
                en: "Multiple goroutines read and write a shared `counter++` concurrently. Which Go toolchain flag detects this during testing?"
              },
              options: [
                "go test -race ./... (Integrierter ThreadSanitizer Race Detector)",
                "go fmt ./...",
                "go version",
                "go env -debug"
              ],
              solution: 0,
              explanation: {
                de: "Das Flag `-race` kompiliert Code mit Go's integriertem Race Detector (ThreadSanitizer). Es protokolliert nicht synchronisierte konkurrierende Speicherzugriffe zur Laufzeit mit exaktem Stacktrace.",
                en: "The `-race` flag instruments code with Go's built-in ThreadSanitizer race detector, identifying unsynchronized memory accesses with precise stacktraces."
              }
            },
            {
              id: "ex-go-02",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 2 (20 Punkte): sync.WaitGroup Synchronisation", en: "Question 2 (20 Points): sync.WaitGroup Synchronization" },
              prompt: {
                de: "Wo muss der Methodenaufruf `wg.Add(1)` platziert werden, wenn eine Goroutine gestartet wird, um eine Race Condition mit `wg.Wait()` zuverlässig auszuschließen?",
                en: "Where must `wg.Add(1)` be called when launching a goroutine to avoid race conditions with `wg.Wait()`?"
              },
              options: [
                "Unmittelbar VOR dem Aufruf `go func()` im aufrufenden Kontext.",
                "Innerhalb der Goroutine als allererste Anweisung.",
                "Nach dem Aufruf von `wg.Wait()`.",
                "In der `init()`-Funktion des Packages."
              ],
              solution: 0,
              explanation: {
                de: "`wg.Add(1)` muss zwingend VOR dem Aufruf `go func()` erfolgen. Würde es innerhalb der Goroutine aufgerufen, könnte `wg.Wait()` ausgeführt werden, bevor die Goroutine überhaupt anläuft.",
                en: "`wg.Add(1)` must be invoked BEFORE `go func()`. Calling it inside the goroutine creates a race where `wg.Wait()` might complete before the goroutine starts scheduling."
              }
            },
            {
              id: "ex-go-03",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 3 (20 Punkte): defer LIFO-Reihenfolge", en: "Question 3 (20 Points): defer LIFO Execution Order" },
              prompt: {
                de: "In einer Funktion stehen hintereinander die drei Anweisungen `defer fmt.Print(\"1\")`, `defer fmt.Print(\"2\")`, `defer fmt.Print(\"3\")`. Welche Ausgabe erscheint beim Verlassen der Funktion?",
                en: "A function contains `defer fmt.Print(\"1\")`, `defer fmt.Print(\"2\")`, `defer fmt.Print(\"3\")`. What is the printed output upon function exit?"
              },
              options: [
                "321 (LIFO - Last In, First Out)",
                "123 (FIFO - First In, First Out)",
                "Es wird nichts ausgegeben.",
                "Eine zufällige Permutation wie 213."
              ],
              solution: 0,
              explanation: {
                de: "`defer`-Aufrufe werden in Go auf einem Stack abgelegt und beim Verlassen der Funktion in umgekehrter Reihenfolge (LIFO) ausgeführt.",
                en: "Deferred calls are pushed onto a stack and evaluated in Last-In-First-Out (LIFO) order upon function return."
              }
            },
            {
              id: "ex-go-04",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 4 (20 Punkte): Implizite Interfaces", en: "Question 4 (20 Points): Implicit Interfaces" },
              prompt: {
                de: "Wie deklariert eine Struct in Go, dass sie ein bestimmtes Interface erfüllt?",
                en: "How does a struct in Go declare that it satisfies an interface?"
              },
              options: [
                "Implizit: Die Struct implementiert einfach alle Methoden des Interfaces mit passender Signatur. Es gibt kein `implements`-Schlüsselwort.",
                "Explizit über das Schlüsselwort `implements MyInterface` in der Typdeklaration.",
                "Über eine Annotation `@Implements(MyInterface)` vor der Struct.",
                "Durch Vererbung von einer abstrakten Basisklasse."
              ],
              solution: 0,
              explanation: {
                de: "Go nutzt strukturelles Subtyping (Duck Typing zur Compile-Zeit). Sobald ein Typ alle im Interface deklarierten Methoden implementiert, erfüllt er das Interface automatisch.",
                en: "Go uses structural typing. A type implements an interface simply by implementing its required methods. No `implements` keyword exists."
              }
            },
            {
              id: "ex-go-05",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 5 (20 Punkte): Idiomatisches Error-Handling", en: "Question 5 (20 Points): Idiomatic Error Handling" },
              prompt: {
                de: "Was ist der kanonische Weg, um in Go mit erwartbaren Fehlern umzugehen?",
                en: "What is the canonical pattern in Go for handling anticipated errors?"
              },
              options: [
                "Die Funktion gibt `error` als letzten Rückgabewert zurück; der Aufrufer prüft sofort `if err != nil`.",
                "Es wird immer ein `panic()` ausgelöst.",
                "Fehler werden in eine globale Variable geschrieben.",
                "Fehler werden stillschweigend ignoriert."
              ],
              solution: 0,
              explanation: {
                de: "In Go sind Fehler reguläre Werte (`error`-Interface). Funktionen geben Fehler explizit zurück (`(result, error)`), und der aufrufende Code behandelt diese transparent ohne versteckten Exception-Kontrollfluss.",
                en: "In Go, errors are normal values returned explicitly as the last tuple value. Callers handle them immediately using `if err != nil`."
              }
            }
          ]
        }
      ]
    },
    {
      id: "cybersecurity",
      title: { de: "Cybersecurity & IT-Sicherheit", en: "Cybersecurity & IT Security" },
      icon: "🛡️",
      badge: "IHK Kernfach",
      desc: { de: "CIA-Schutzziele, OWASP Top 10, Kryptografie (AES-256-GCM, PBKDF2), Härtung & DSGVO/LDI.", en: "CIA triad, OWASP Top 10, cryptography (AES-256-GCM, PBKDF2), hardening & GDPR compliance." },
      chapters: [
        {
          id: "cyber-01-fundamentals",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. Schutzziele (CIA), Bedrohungen & OWASP Top 10", en: "1. Protection Goals (CIA), Threats & OWASP Top 10" },
          duration: "25 min",
          sections: [
            {
              id: "cyb-01-s1",
              type: "concept",
              title: { de: "Die CIA-Triade der IT-Sicherheit", en: "The CIA Triad of IT Security" },
              content: {
                de: "Jedes IT-System muss gegen die drei Kern-Schutzziele evaluiert werden:\n1. Confidentiality (Vertraulichkeit): Zugriff nur für Berechtigte (AES-256-GCM, RBAC).\n2. Integrity (Integrität): Schutz vor unbemerkter Datenmanipulation (SHA-256 Hashes, Signaturen).\n3. Availability (Verfügbarkeit): Zuverlässiger Dienstbetrieb (Redundanz, 3-2-1 Backups).",
                en: "Every system must be evaluated against the three core security pillars:\n1. Confidentiality: Authorized access only (AES-256-GCM, RBAC).\n2. Integrity: Prevention of undetected tampering (SHA-256 hashes, signatures).\n3. Availability: Resilient uptime (redundancy, 3-2-1 backups)."
              },
              code: "// Produktionssicherheit nach BSI IT-Grundschutz:\n// 1. AES-256-GCM für authentifizierte Verschlüsselung\n// 2. PBKDF2 mit mind. 100.000 Iterationen für Schlüsselableitung"
            },
            {
              id: "cyb-01-s2",
              type: "quiz_choice",
              title: { de: "IHK-Fallanalyse: Verletzung von Schutzzielen", en: "IHK Case Analysis: Security Goals" },
              prompt: {
                de: "Ein Angreifer verändert unbemerkt die IBAN in einer noch nicht ausgeführten Überweisungsdatei auf dem Server. Welches Schutzziel wurde hier primär verletzt?",
                en: "An attacker covertly alters the IBAN in an unexecuted bank transfer file stored on a server. Which primary security objective was violated?"
              },
              options: [
                "Vertraulichkeit (Confidentiality)",
                "Integrität (Integrity)",
                "Verfügbarkeit (Availability)",
                "Nichtabstreitbarkeit (Non-Repudiation)"
              ],
              solution: 1,
              explanation: {
                de: "Die Integrität garantiert die Korrektheit und Unverfälschtheit von Daten. Da die Kontonummer verändert wurde, ist der Datenbestand manipuliert worden (Integritätsverletzung).",
                en: "Integrity guarantees data accuracy and authenticity. Altering an account number is a direct compromise of integrity."
              }
            },
            {
              id: "cyb-01-s3",
              type: "quiz_code_puzzle",
              title: { de: "Code-Puzzle: Schlüsselableitung mit PBKDF2", en: "Code Puzzle: Key Derivation with PBKDF2" },
              prompt: {
                de: "Welcher Algorithmus verlangsamt Brute-Force-Attacken gegen Passwörter durch 100.000 Berechnungszyklen?",
                en: "Which algorithm impedes brute-force attacks via 100,000 computational iterations?"
              },
              codeSnippet: "key := ___ .Key([]byte(pwd), salt, 100000, 32, sha256.New)",
              options: ["pbkdf2", "md5", "rot13", "base64"],
              solution: "pbkdf2",
              explanation: {
                de: "PBKDF2 (Password-Based Key Derivation Function 2) wendet mit 100.000 Iterationen gezielt Rechenzeit auf, um Wörterbuch- und Brute-Force-Attacken abzuwehren.",
                en: "PBKDF2 uses 100,000 iterations to make dictionary and brute-force attacks computationally infeasible."
              }
            }
          ]
        },
        {
          id: "cyber-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): Security Audit & Härtung", en: "🏛️ IHK Exam Module (90 Min): Security Audit & Hardening" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Sie sind Fachinformatiker/in bei der CyberSecure GmbH. Ihr Kunde betreibt einen webbasierten Onlineshop mit angeschlossener Kundendatenbank. Im Rahmen eines Sicherheitsaudits sollen Sie die Architektur auf Schwachstellen prüfen, Incident-Response-Maßnahmen festlegen und Härtungsstandards nach BSI IT-Grundschutz umsetzen.",
            en: "Scenario: You are an IT specialist at CyberSecure GmbH. Your client operates an e-commerce shop connected to a customer database. In a comprehensive security audit, you must identify vulnerabilities, specify incident response measures, and enforce hardening standards."
          },
          sections: [
            {
              id: "ex-cyb-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): DMZ-Architektur nach BSI", en: "Question 1 (20 Points): DMZ Architecture" },
              prompt: {
                de: "Der Webserver des Kunden kommuniziert mit der internen MySQL-Kundendatenbank. Welche Platzierung entspricht dem BSI-Sicherheitsstandard für mehrstufige Firewalls?",
                en: "The client's web server communicates with the MySQL customer database. Which placement conforms to tiered firewall standards?"
              },
              options: [
                "Der Webserver steht in der DMZ (Demilitarisierte Zone); der Datenbankserver steht im internen, geschützten LAN.",
                "Sowohl Webserver als auch Datenbankserver stehen ungeschützt direkt im WAN.",
                "Der Datenbankserver steht in der DMZ; der Webserver steht im internen LAN.",
                "Beide Server stehen zusammen in der DMZ und sind von außen direkt über Port 3306 erreichbar."
              ],
              solution: 0,
              explanation: {
                de: "Öffentlich erreichbare Dienste gehören in eine DMZ. Sensible Backend-Datenbanken dürfen niemals direkt aus dem WAN erreichbar sein, sondern stehen im internen Netz und dürfen nur über strikte Firewall-Regeln exklusiv von der DMZ angesprochen werden.",
                en: "Public services belong in a DMZ. Databases must never face the WAN directly; they reside in the internal network with strictly filtered ingress from the DMZ."
              }
            },
            {
              id: "ex-cyb-02",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 2 (20 Punkte): OWASP Broken Object Level Authorization (IDOR)", en: "Question 2 (20 Points): OWASP IDOR Vulnerability" },
              prompt: {
                de: "Ein angemeldeter Kunde (User-ID 402) ruft seine Rechnung über `https://shop.example.com/api/invoice/402` ab. Ändert er die Zahl auf 403, sieht er fremde Rechnungen. Welches Schutzkonzept fehlt?",
                en: "An authenticated user (ID 402) views an invoice at `.../invoice/402`. Changing the URL to 403 displays another user's invoice. What protection is missing?"
              },
              options: [
                "Serverseitige Autorisierungsprüfung auf Objektebene (Rechteprüfung: Gehört Objekt 403 zur authentifizierten Session?)",
                "Eine Umstellung von HTTPS auf unverschlüsseltes HTTP",
                "Ausblendung der URL-Leiste im Browser",
                "Erhöhung der Passwortlänge des Nutzers"
              ],
              solution: 0,
              explanation: {
                de: "Das Phänomen heißt IDOR (Insecure Direct Object Reference / OWASP A01). Eine Authentifizierung genügt nicht – der Server muss bei jeder Anfrage prüfen, ob dieser Nutzer berechtigt ist, auf diese Ressourcen-ID zuzugreifen.",
                en: "This is IDOR (OWASP A01). Authentication alone is insufficient; every request requires object-level authorization checking whether the session owns the resource."
              }
            },
            {
              id: "ex-cyb-03",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 3 (20 Punkte): Hybride TLS-Verschlüsselung", en: "Question 3 (20 Points): Hybrid TLS Encryption" },
              prompt: {
                de: "Warum nutzt TLS (HTTPS) ein hybrides Verschlüsselungsverfahren aus asymmetrischer und symmetrischer Kryptografie?",
                en: "Why does TLS (HTTPS) employ hybrid encryption combining asymmetric and symmetric cryptography?"
              },
              options: [
                "Asymmetrische Verschlüsselung dient sicher zum Schlüsselaustausch; die eigentlichen Massendaten werden schnell und effizient symmetrisch (z. B. AES-GCM) verschlüsselt.",
                "Symmetrische Verschlüsselung ist unsicher, wird aber aus Gewohnheit genutzt.",
                "Weil Zertifikate nur mit unverschlüsseltem Klartext funktionieren.",
                "Um Daten doppelt zu verschlüsseln."
              ],
              solution: 0,
              explanation: {
                de: "Asymmetrische Verfahren (RSA, ECDH) lösen den sicheren Schlüsselaustausch über unsichere Kanäle, sind aber rechenintensiv. Die symmetrische Verschlüsselung (AES) ist um Faktoren schneller und übernimmt den Transport der Massendaten.",
                en: "Asymmetric encryption solves the secure key-exchange problem over untrusted channels but is computationally expensive. Symmetric encryption (AES) is drastically faster and handles payload encryption."
              }
            },
            {
              id: "ex-cyb-04",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 4 (20 Punkte): DSGVO-Meldepflicht bei Datenlecks", en: "Question 4 (20 Points): GDPR Breach Notification Deadline" },
              prompt: {
                de: "In einer Kundendatenbank wurden sensible personenbezogene Daten entwendet. Innerhalb welcher Frist muss dieser Vorfall nach Art. 33 DSGVO an die zuständige Aufsichtsbehörde (z. B. LDI NRW) gemeldet werden?",
                en: "A security breach exposed sensitive personal customer data. Within what timeframe must this incident be reported to the supervisory authority under Art. 33 GDPR?"
              },
              options: [
                "Binnen 72 Stunden ab Bekanntwerden des Vorfalls.",
                "Innerhalb von 30 Werktagen nach Abschluss der internen Ermittlungen.",
                "Erst zum Ende des laufenden Geschäftsjahres.",
                "Es besteht keine Meldepflicht."
              ],
              solution: 0,
              explanation: {
                de: "Nach Art. 33 Abs. 1 DSGVO muss eine Verletzung des Schutzes personenbezogener Daten unverzüglich und möglichst binnen 72 Stunden nach Bekanntwerden der zuständigen Aufsichtsbehörde gemeldet werden.",
                en: "Under Art. 33(1) GDPR, personal data breaches must be reported to the competent supervisory authority without undue delay and, where feasible, not later than 72 hours after becoming aware."
              }
            },
            {
              id: "ex-cyb-05",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 5 (20 Punkte): CSRF-Schutz mit SameSite", en: "Question 5 (20 Points): CSRF Protection with SameSite" },
              prompt: {
                de: "Welches Cookie-Attribut verhindert zuverlässig, dass ein Browser bei manipulierten Cross-Site-Requests Session-Cookies mitsendet?",
                en: "Which cookie attribute reliably blocks browsers from attaching session cookies on malicious cross-site requests?"
              },
              options: [
                "SameSite=Strict oder SameSite=Lax",
                "HttpOnly=false",
                "Secure=disabled",
                "Path=/public"
              ],
              solution: 0,
              explanation: {
                de: "Das Cookie-Attribut `SameSite=Strict` unterbindet die Übermittlung von Cookies bei allen Cross-Site-Anfragen. `SameSite=Lax` erlaubt Cookies nur bei sicheren Top-Level-GET-Navigationen.",
                en: "The `SameSite=Strict` cookie attribute blocks cookie transmission on all cross-site requests. `SameSite=Lax` permits it only on top-level safe GET navigations."
              }
            }
          ]
        }
      ]
    },
    {
      id: "sql",
      title: { de: "SQL & Relationale Datenbanken", en: "SQL & Relational Databases" },
      icon: "🗄️",
      badge: "Data Integrity",
      desc: { de: "Relationales Modell, ACID, Normalisierung (1NF–3NF), Joins, Indizes & Transaktionen.", en: "Relational model, ACID, normalization (1NF–3NF), joins, indexes & transactions." },
      chapters: [
        {
          id: "sql-01-relational-model",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. Relationales Modell, Normalisierung & ACID", en: "1. Relational Model, Normalization & ACID" },
          duration: "25 min",
          sections: [
            {
              id: "sql-01-s1",
              type: "concept",
              title: { de: "Das relationale Modell nach Codd", en: "The Relational Model by Codd" },
              content: {
                de: "Edgar F. Codd definierte relationale Datenbanken über mathematische Relationen (Tabellen mit Zeilen/Tupeln und Spalten/Attributen). Primärschlüssel (Primary Key) identifizieren jeden Datensatz eindeutig. Fremdschlüssel (Foreign Key) verknüpfen Tabellen und sichern referentielle Integrität.",
                en: "Edgar F. Codd proved data independence using mathematical relations (tables with rows/tuples and columns/attributes). Primary keys uniquely identify records. Foreign keys guarantee referential integrity."
              },
              code: "CREATE TABLE kunden (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    nachname VARCHAR(100) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL\n);"
            },
            {
              id: "sql-01-s2",
              type: "quiz_choice",
              title: { de: "IHK-Prüfungsfrage: Die 3. Normalform (3NF)", en: "IHK Exam Question: 3rd Normal Form" },
              prompt: {
                de: "Gegeben ist eine Tabelle mit Kundendaten in 2NF. Das Attribut 'Wohnort' hängt jedoch von der 'Postleitzahl' ab (Nicht-Schlüssel hängt von Nicht-Schlüssel ab). Welcher Verstoß liegt vor?",
                en: "A 2NF table has attribute 'City' functionally dependent on 'ZIP' (non-key on non-key). Which normalization rule is violated?"
              },
              options: [
                "Verletzung der 3. Normalform (transitive Abhängigkeit)",
                "Verletzung der 1. Normalform (fehlende Atomarität)",
                "Verletzung der 2. Normalform (partielle Abhängigkeit)",
                "Verletzung der Boyce-Codd-Normalform (BCNF)"
              ],
              solution: 0,
              explanation: {
                de: "Die 3NF verlangt, dass kein Nicht-Schlüsselattribut transitiv von einem anderen Nicht-Schlüsselattribut abhängt (PK -> PLZ -> Ort). PLZ und Ort müssen in eine separate Tabelle ausgelagert werden.",
                en: "The 3rd Normal Form mandates that no non-key attribute transitively depends on another non-key attribute. ZIP/City must be normalized into an external table."
              }
            },
            {
              id: "sql-01-s3",
              type: "quiz_code_puzzle",
              title: { de: "Code-Puzzle: Inner Join Verknüpfung", en: "Code Puzzle: Inner Join Syntax" },
              prompt: {
                de: "Verknüpfe die Tabelle `kunden` mit `bestellungen` über das gemeinsame Schlüsselattribut:",
                en: "Join table `kunden` with `bestellungen` using the shared key:"
              },
              codeSnippet: "SELECT k.nachname, b.betrag FROM kunden k ___ JOIN bestellungen b ON k.id = b.kunden_id",
              options: ["INNER", "OUTER", "CROSS", "UNION"],
              solution: "INNER",
              explanation: {
                de: "`INNER JOIN` selektiert nur diejenigen Zeilen, für die in beiden verknüpften Tabellen eine Übereinstimmung der Join-Bedingung vorliegt.",
                en: "`INNER JOIN` selects only rows having matching values in both joined tables."
              }
            }
          ]
        },
        {
          id: "sql-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): Datenbankdesign & SQL-Abfragen", en: "🏛️ IHK Exam Module (90 Min): Database Design & SQL Queries" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Sie sind Anwendungsentwickler/in bei einem Logistikdienstleister. Für die Erfassung von Frachtaufträgen, LKW-Flotten und Fahrern soll ein neues relationales Datenbankschema entworfen und optimiert werden. Beantworten Sie die anstehenden Fachfragen zur Datenmodellierung und SQL-Syntax.",
            en: "Scenario: You are a software developer at a logistics provider. A new relational schema for freight orders, vehicle fleets, and drivers must be designed and tuned. Answer the questions regarding data modeling and SQL syntax."
          },
          sections: [
            {
              id: "ex-sql-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): Auflösung von n:m Beziehungen", en: "Question 1 (20 Points): Resolving n:m Relationships" },
              prompt: {
                de: "Ein Fahrer kann mehrere Fahrzeuge führen, und ein Fahrzeug kann von mehreren Fahrern gefahren werden (n:m). Wie wird dies relational korrekt gelöst?",
                en: "A driver can operate multiple vehicles, and a vehicle can be driven by multiple drivers (n:m). How is this resolved relationally?"
              },
              options: [
                "Über eine eigenständige Zuordnungstabelle (Assoziationstabelle) mit Fremdschlüsseln auf Fahrer und Fahrzeug.",
                "Durch Hinzufügen einer kommagetrennten Fahrzeugliste in die Fahrertabelle.",
                "Indem der Fahrzeug-Primärschlüssel direkt in die Fahrertabelle eingetragen wird.",
                "Eine n:m Beziehung kann in relationalen Datenbanken nicht abgebildet werden."
              ],
              solution: 0,
              explanation: {
                de: "Relational können n:m Beziehungen ausschließlich über eine eigenständige Zwischentabelle aufgelöst werden, die Fremdschlüssel auf beide Entitäten enthält.",
                en: "In relational design, n:m relationships must be resolved through a junction table holding foreign keys referencing both entities."
              }
            },
            {
              id: "ex-sql-02",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 2 (20 Punkte): Filterung von Aggregaten mit HAVING", en: "Question 2 (20 Points): Aggregate Filtering with HAVING" },
              prompt: {
                de: "Sie möchten alle Kunden ermitteln, die in Summe mehr als 1.000 € Umsatz generiert haben. Welche Klausel filtert die Bedingung `SUM(betrag) > 1000`?",
                en: "You want to find all customers with total sales exceeding 1,000 €. Which clause filters `SUM(betrag) > 1000`?"
              },
              options: [
                "HAVING SUM(betrag) > 1000",
                "WHERE SUM(betrag) > 1000",
                "ORDER BY SUM(betrag) > 1000",
                "GROUP BY SUM(betrag) > 1000"
              ],
              solution: 0,
              explanation: {
                de: "`WHERE` filtert einzelne Zeilen VOR der Gruppierung. `HAVING` filtert Gruppen NACH der Aggregation. Bedingungen mit Aggregatfunktionen wie `SUM()` verlangen zwingend `HAVING`.",
                en: "`WHERE` filters rows before grouping. `HAVING` filters aggregated groups after `GROUP BY`. Aggregates require `HAVING`."
              }
            },
            {
              id: "ex-sql-03",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 3 (20 Punkte): Verhalten von LEFT OUTER JOIN", en: "Question 3 (20 Points): LEFT OUTER JOIN Behavior" },
              prompt: {
                de: "Ein `LEFT JOIN` verbindet die Tabelle `kunden` mit `bestellungen`. Was steht in den Spalten der Bestellungen, wenn ein Kunde bisher noch keine Bestellung getätigt hat?",
                en: "A `LEFT JOIN` connects `kunden` with `bestellungen`. What appears in the order columns if a customer has no orders?"
              },
              options: [
                "Die Spalten enthalten den Wert NULL.",
                "Die Zeile dieses Kunden wird in der Ergebnismenge komplett ignoriert.",
                "Die Spalten enthalten die Zahl 0.",
                "Die Datenbank bricht die Abfrage mit einem Fehler ab."
              ],
              solution: 0,
              explanation: {
                de: "Ein `LEFT JOIN` liefert immer alle Zeilen der linken Tabelle. Findet sich in der rechten Tabelle kein Treffer, werden die rechten Spalten mit `NULL` aufgefüllt.",
                en: "A `LEFT JOIN` preserves all rows from the left table, populating right-side columns with `NULL` when no match exists."
              }
            },
            {
              id: "ex-sql-04",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 4 (20 Punkte): B-Tree Indexierung & Query Performance", en: "Question 4 (20 Points): B-Tree Indexing & Performance" },
              prompt: {
                de: "Eine Tabelle mit 5.000.000 Kundendatensätzen wird häufig über `email` abgefragt. Wie verhindert man einen zeitintensiven Full Table Scan?",
                en: "A table with 5,000,000 records is frequently queried by `email`. How do you avoid a slow full table scan?"
              },
              options: [
                "Anlegen eines B-Tree Indexes: CREATE INDEX idx_email ON kunden(email);",
                "Verkürzen der E-Mail-Adressen auf maximal 5 Zeichen",
                "Löschen von 4.000.000 Datensätzen",
                "Nutzung von SELECT * statt Spaltenauswahl"
              ],
              solution: 0,
              explanation: {
                de: "Ein B-Tree-Index ermöglicht logarithmische Suchzeiten O(log n) anstelle linearer Tabellenabtastung O(n). Der Query Optimizer nutzt den Index gezielt für Index-Seek-Operationen.",
                en: "A B-Tree index provides logarithmic search complexity O(log n) instead of linear scans O(n)."
              }
            },
            {
              id: "ex-sql-05",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 5 (20 Punkte): SQL-Injection Prävention", en: "Question 5 (20 Points): SQL Injection Defense" },
              prompt: {
                de: "Ein Web-Formular prüft Login-Daten. Welche Methode schützt auf Software-Ebene absolut zuverlässig gegen SQL-Injections?",
                en: "A form validates logins. Which method reliably protects against SQL injection?"
              },
              options: [
                "Die konsequente Verwendung von Prepared Statements mit gebundenen Parametern.",
                "Das Ersetzen von einfachen durch doppelte Anführungszeichen per Regex.",
                "Die Verschlüsselung der Festplatte mit BitLocker.",
                "Das Deaktivieren der Fehleranzeige im Browser."
              ],
              solution: 0,
              explanation: {
                de: "Prepared Statements trennen den ausführbaren SQL-Code strikt von den Eingabedaten. Parameter werden von der DB-Engine niemals als SQL-Syntax interpretiert.",
                en: "Prepared statements strictly separate executable SQL grammar from user parameter values. Untrusted input is never parsed as code."
              }
            }
          ]
        }
      ]
    },
    {
      id: "csharp",
      title: { de: "C# & .NET Enterprise", en: "C# & .NET Enterprise" },
      icon: "🔷",
      badge: "Enterprise Core",
      desc: { de: "Kompilierte CLR, Managed Memory, Garbage Collection, LINQ, OOP & Entwurfsmuster.", en: "Compiled CLR, managed memory, garbage collection, LINQ, OOP & design patterns." },
      chapters: [
        {
          id: "cs-01-fundamentals",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. CLR, Managed Memory & Objektorientierung", en: "1. CLR, Managed Memory & Object Orientation" },
          duration: "25 min",
          sections: [
            {
              id: "cs-01-s1",
              type: "concept",
              title: { de: "Die Common Language Runtime (CLR) & CIL", en: "The CLR & Common Intermediate Language" },
              content: {
                de: "C#-Quellcode kompiliert in die Common Intermediate Language (CIL). Die CLR führt diesen Zwischencode über einen Just-In-Time (JIT) Compiler direkt auf der Ziel-CPU aus. Managed Memory befreit Entwickler von manuellem Speichermanagement über den automatischen Garbage Collector.",
                en: "C# compiles to Common Intermediate Language (CIL). The CLR executes this bytecode via a JIT compiler. Managed Memory frees developers from manual deallocation through automatic garbage collection."
              },
              code: "using System;\n\npublic class Greeter {\n    public static void Main() {\n        Console.WriteLine(\"Hello .NET Enterprise!\");\n    }\n}"
            },
            {
              id: "cs-01-s2",
              type: "quiz_choice",
              title: { de: "Speichermodell: Value Type vs. Reference Type", en: "Memory: Value Type vs. Reference Type" },
              prompt: {
                de: "Wo werden in C# Instanzen von Klassen (`class`) und wo lokale `int`-Variablen typischerweise im RAM abgelegt?",
                en: "Where are class instances (`class`) and local primitive `int` variables typically allocated in RAM?"
              },
              options: [
                "Klassen-Instanzen liegen auf dem Heap (Referenztypen); lokale `int`-Variablen liegen direkt auf dem Stack (Werttypen).",
                "Alle Datenstrukturen liegen ausnahmslos auf dem Stack.",
                "Klassen liegen auf der Festplatte; primitive Typen im CPU-Cache.",
                "Klassen liegen auf dem Stack; `int` liegt auf dem Heap."
              ],
              solution: 0,
              explanation: {
                de: "Klassen sind Referenztypen und leben auf dem Garbage-Collected Heap. Lokale primitive Typen (`int`, `struct`, `bool`) sind Werttypen und liegen auf dem schnellen Aufruf-Stack.",
                en: "Classes are reference types allocated on the managed heap. Local value types live directly on the call stack."
              }
            },
            {
              id: "cs-01-s3",
              type: "quiz_code_puzzle",
              title: { de: "Code-Puzzle: LINQ-Filterung", en: "Code Puzzle: LINQ Filtering" },
              prompt: {
                de: "Vervollständige die LINQ-Abfrage, um alle Kunden ab 18 Jahren zu filtern:",
                en: "Complete the LINQ query to filter customers aged 18 or older:"
              },
              codeSnippet: "var adults = customers. ___ (c => c.Age >= 18).ToList();",
              options: ["Where", "Filter", "Select", "Find"],
              solution: "Where",
              explanation: {
                de: "In LINQ dient die Erweiterungsmethode `.Where()` dem Filtern von Auflistungen anhand eines Prädikats.",
                en: "In LINQ, the `.Where()` extension method filters collections based on a predicate."
              }
            }
          ]
        },
        {
          id: "cs-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): C# Enterprise & Design Patterns", en: "🏛️ IHK Exam Module (90 Min): C# Enterprise & Design Patterns" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Sie arbeiten als Fachinformatiker/in für Anwendungsentwicklung bei einem Maschinenbau-Konzern. Eine Steuerungssoftware soll auf modernstes .NET refaktoriert werden. Es gilt, lose Kopplung durch Dependency Injection zu etablieren, Deadlocks im Multithreading zu vermeiden und Enterprise-Design-Patterns anzuwenden.",
            en: "Scenario: You are a software developer at an engineering corporation. A legacy control system is being refactored to modern .NET. You must ensure loose coupling via Dependency Injection, prevent multithreading deadlocks, and apply enterprise design patterns."
          },
          sections: [
            {
              id: "ex-cs-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): SOLID Dependency Inversion Principle", en: "Question 1 (20 Points): SOLID Dependency Inversion" },
              prompt: {
                de: "Eine Geschäftslogik-Klasse instanziiert ihre Datenbankverbindung fest mit `new SqlRepository()`. Welches SOLID-Prinzip wird verletzt und wie lautet die Lösung?",
                en: "A business logic class hard-instantiates database access with `new SqlRepository()`. Which SOLID principle is violated?"
              },
              options: [
                "Verletzung des Dependency Inversion Principle. Lösung: Die Klasse soll von einer Schnittstelle `IRepository` abhängen, die per Konstruktor-Injektion übergeben wird.",
                "Verletzung des Single Responsibility Principle. Lösung: Alle Methoden statisch machen.",
                "Verletzung des Open-Closed Principle. Lösung: Den Konstruktor privat machen.",
                "Es liegt kein Verstoß vor; direkte Instanziierung ist der Standard."
              ],
              solution: 0,
              explanation: {
                de: "Das Dependency Inversion Principle besagt: High-Level-Module dürfen nicht von Low-Level-Modulen abhängen. Beide müssen von Abstraktionen (Interfaces) abhängen. Konstruktor-Injektion entkoppelt die Implementierung.",
                en: "The Dependency Inversion Principle states high-level modules should depend on abstractions (interfaces), not concrete low-level implementations. Constructor injection provides the necessary inversion."
              }
            },
            {
              id: "ex-cs-02",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 2 (20 Punkte): Async/Await & Deadlock-Vermeidung", en: "Question 2 (20 Points): Async/Await Deadlock Prevention" },
              prompt: {
                de: "Warum sollte man in modernem C#-Code den Aufruf `.Result` oder `.Wait()` auf einem laufenden `Task` vermeiden?",
                en: "Why should you avoid calling `.Result` or `.Wait()` on a running `Task` in modern C#?"
              },
              options: [
                "Es blockiert den Thread synchron und kann in UI- oder ASP.NET-Umgebungen zu Deadlocks führen.",
                "Weil `.Result` den Task sofort abbricht.",
                "Weil `.Result` nur für Zahlen und nicht für Strings verwendet werden darf.",
                "Weil dadurch der Garbage Collector komplett deaktiviert wird."
              ],
              solution: 0,
              explanation: {
                de: "Synchrones Warten (`.Result` / `.Wait()`) blockiert den aufrufenden Thread. Wenn der fortsetzende Code auf denselben SynchronizationContext zugreifen will, blockieren sich Thread und Task gegenseitig (Deadlock). Immer `await` nutzen.",
                en: "Synchronous blocking (`.Result` / `.Wait()`) blocks the thread, risking deadlocks in environments with a SynchronizationContext. Always use `await`."
              }
            },
            {
              id: "ex-cs-03",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 3 (20 Punkte): LINQ Deferred Execution", en: "Question 3 (20 Points): LINQ Deferred Execution" },
              prompt: {
                de: "Was bedeutet 'Deferred Execution' (verzögerte Ausführung) bei LINQ-Abfragen wie `var q = users.Where(u => u.IsActive);`?",
                en: "What does 'Deferred Execution' mean regarding LINQ queries?"
              },
              options: [
                "Die Abfrage wird erst in dem Moment evaluiert, in dem über das Ergebnis iteriert wird (z. B. durch `foreach` oder `.ToList()`).",
                "Die Abfrage wird um genau 5 Sekunden verzögert ausgeführt.",
                "Die Abfrage wird nur ausgeführt, wenn der Server im Leerlauf ist.",
                "Die Abfrage wird auf einen externen Server ausgelagert."
              ],
              solution: 0,
              explanation: {
                de: "LINQ-Abfragen auf `IEnumerable` werden nicht sofort bei der Deklaration ausgeführt, sondern erst dann, wenn die Daten tatsächlich angefordert werden (z. B. `foreach`, `.ToList()`, `.Count()`).",
                en: "LINQ queries against `IEnumerable` defer materialization until the sequence is enumerated (e.g., via `foreach`, `.ToList()`, or `.Count()`)."
              }
            },
            {
              id: "ex-cs-04",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 4 (20 Punkte): Reihenfolge bei Exception-Handling", en: "Question 4 (20 Points): Exception Catch Ordering" },
              prompt: {
                de: "In welcher Reihenfolge müssen `catch`-Blöcke in C# strukturiert sein, wenn spezifische und allgemeine Fehler abgefangen werden sollen?",
                en: "In what order must `catch` blocks be arranged when handling both specific and general errors?"
              },
              options: [
                "Spezifische Exceptions immer zuerst, gefolgt von der allgemeinen Basis-Klasse `Exception` am Schluss.",
                "Die allgemeinste `Exception` immer zuerst.",
                "Die Reihenfolge ist beliebig, da der Compiler alphabetisch sortiert.",
                "Es darf immer nur ein einziger catch-Block existieren."
              ],
              solution: 0,
              explanation: {
                de: "Der Compiler wertet `catch`-Blöcke von oben nach unten aus. Würde `catch (Exception)` an oberster Stelle stehen, würde dieser Block jede Exception abfangen und spezifischere Blöcke wären toter Code.",
                en: "Catch blocks are evaluated sequentially from top to bottom. Specific exceptions must precede general ones to prevent unreachable handler code."
              }
            },
            {
              id: "ex-cs-05",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 5 (20 Punkte): Deterministische Ressourcenfreigabe mit using", en: "Question 5 (20 Points): Resource Cleanup with using" },
              prompt: {
                de: "Welches Interface müssen Klassen implementieren, damit ihre Ressourcen deterministisch mit dem C#-Statement `using` freigegeben werden können?",
                en: "Which interface must classes implement to support deterministic cleanup with the `using` statement?"
              },
              options: [
                "IDisposable (mit der Methode Dispose())",
                "ICloneable",
                "IEnumerable",
                "IComparable"
              ],
              solution: 0,
              explanation: {
                de: "Das `using`-Statement erfordert Klassen, die `IDisposable` implementieren. Es garantiert, dass `Dispose()` beim Verlassen des Gültigkeitsbereichs aufgerufen wird, selbst bei Exceptions.",
                en: "The `using` statement requires `IDisposable`. It guarantees that `Dispose()` is invoked upon exiting scope, even on exceptions."
              }
            }
          ]
        }
      ]
    },
    {
      id: "astro",
      title: { de: "Astro Framework", en: "Astro Framework" },
      icon: "🚀",
      badge: "Web Architecture",
      desc: { de: "Island Architecture, SSR und Content-First Webentwicklung mit Zero-JS-Default.", en: "Island architecture, SSR and content-first web development with zero-JS default." },
      chapters: [
        {
          id: "astro-01-islands",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. Warum Astro? Island Architecture & Zero-JS", en: "1. Why Astro? Island Architecture & Zero-JS" },
          duration: "25 min",
          sections: [
            {
              id: "astro-01-s1",
              type: "concept",
              title: { de: "Das SPA-Problem & Astros Island Architecture", en: "The SPA Issue & Astro Island Architecture" },
              content: {
                de: "Klassische Single Page Applications (React, Vue) senden Megabytes an JavaScript an den Client, nur um statischen Text zu rendern. Astro dreht das Modell um: Komponenten werden zur Build-Zeit zu reinem HTML kompiliert. Standardmäßig liefert Astro 0 KB JavaScript aus. Nur gezielte interaktive Inseln werden partiell hydriert.",
                en: "Traditional SPAs send megabytes of JavaScript just to render static copy. Astro inverts this: Components compile to pure static HTML at build time with 0 KB JS by default. Only designated interactive islands receive partial hydration."
              },
              code: "---\n// Astro Frontmatter: Läuft NUR auf dem Server/Build-System!\nconst data = await fetch('https://api.example.com/items').then(r => r.json());\n---\n<!-- Reines statisches HTML ohne Client-JS -->\n<ul>\n  {data.map(item => <li>{item.name}</li>)}\n</ul>"
            },
            {
              id: "astro-01-s2",
              type: "quiz_choice",
              title: { de: "Client-Direktiven: client:visible", en: "Client Directives: client:visible" },
              prompt: {
                de: "Welche Astro-Direktive hydriert eine React/Vue-Komponente erst dann, wenn sie in das Sichtfeld des Nutzers gescrollt wird?",
                en: "Which Astro directive hydrates a component only once it scrolls into the viewport?"
              },
              options: [
                "client:visible",
                "client:load",
                "client:idle",
                "client:only"
              ],
              solution: 0,
              explanation: {
                de: "`client:visible` nutzt einen IntersectionObserver, um das Laden und Hydrieren der Komponente so lange aufzuschieben, bis der Anwender tatsächlich dorthin scrollt.",
                en: "`client:visible` uses an IntersectionObserver to defer component hydration until scrolled into view."
              }
            }
          ]
        },
        {
          id: "astro-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): Web-Architektur & Performance", en: "🏛️ IHK Exam Module (90 Min): Web Architecture & Performance" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Sie arbeiten in einer Digitalagentur. Ein Medienverlag klagt über schlechte Google-Rankings und hohe Absprungraten auf mobilen Endgeräten. Sie sollen die bestehende SPA-Architektur analysieren und auf ein modernes, performantes Static-Site- bzw. Island-Architekturmodell migrieren.",
            en: "Scenario: You are working at a digital agency. A media publishing client reports dropping search rankings and high mobile bounce rates caused by SPA overhead. You must evaluate the architecture and migrate to modern Island Architecture and SSG."
          },
          sections: [
            {
              id: "ex-ast-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): Largest Contentful Paint (LCP)", en: "Question 1 (20 Points): Largest Contentful Paint (LCP)" },
              prompt: {
                de: "Was misst der Core Web Vital LCP und wie verbessert Static Site Generation (SSG) diesen Wert maßgeblich?",
                en: "What does LCP measure and how does SSG improve it?"
              },
              options: [
                "LCP misst die Zeit bis zum Rendern des größten sichtbaren Inhaltselements. SSG liefert fertiges HTML direkt vom Server, wodurch der Browser den Inhalt ohne vorherigen JS-Download sofort anzeigen kann.",
                "LCP misst die Zeilenanzahl im JavaScript-Code.",
                "LCP misst die Ladezeit der Favicon-Grafik.",
                "LCP misst die Klickfrequenz der Maus."
              ],
              solution: 0,
              explanation: {
                de: "LCP misst die Ladezeit des Hauptinhalts. Bei klassischen SPAs muss erst das JavaScript geladen und ausgeführt werden, bevor das DOM aufgebaut wird. SSG liefert fertiges HTML direkt aus.",
                en: "LCP tracks main content paint time. SSG delivers pre-rendered HTML on the initial network response, eliminating render-blocking client JavaScript execution."
              }
            },
            {
              id: "ex-ast-02",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 2 (20 Punkte): Cumulative Layout Shift (CLS)", en: "Question 2 (20 Points): Cumulative Layout Shift (CLS)" },
              prompt: {
                de: "Wie verhindert man das visuelle Springen von Texten und Layout-Elementen (CLS), wenn Bilder über das Netzwerk nachgeladen werden?",
                en: "How do you prevent layout shifts (CLS) when images finish downloading?"
              },
              options: [
                "Durch explizite Angabe der Attribute `width` und `height` auf dem `<img>`-Tag oder per CSS `aspect-ratio`.",
                "Indem alle Bilder als PNG statt WebP gespeichert werden.",
                "Durch Deaktivierung des Browser-Caches.",
                "Indem man Bildern `display: none` zuweist."
              ],
              solution: 0,
              explanation: {
                de: "Mit gesetzten `width`- und `height`-Attributen berechnet der Browser das Seitenverhältnis bereits vor dem Download und reserviert den Platz im Layout.",
                en: "Specifying `width` and `height` attributes allows the browser to reserve layout space before the image binary is fetched."
              }
            }
          ]
        }
      ]
    },
    {
      id: "python",
      title: { de: "Python 3", en: "Python 3" },
      icon: "🐍",
      badge: "Scripting & AI",
      desc: { de: "Vielseitige Syntax, Systemautomation, Data Science, GIL & moderne Typisierung.", en: "Versatile syntax, system automation, data science, GIL & modern typing." },
      chapters: [
        {
          id: "py-01-core-concepts",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. Warum Python? Typsystem, GIL & Automation", en: "1. Why Python? Type System, GIL & Automation" },
          duration: "25 min",
          sections: [
            {
              id: "py-01-s1",
              type: "concept",
              title: { de: "Python Philosophie & Memory Model", en: "Python Philosophy & Memory Model" },
              content: {
                de: "Guido van Rossum entwarf Python nach dem Grundsatz 'Readability counts'. In Python ist alles ein First-Class-Objekt auf dem Heap. Die Speicherfreigabe erfolgt primär über Reference Counting. CPython besitzt den Global Interpreter Lock (GIL), der Multithreading auf einen CPU-Kern limitiert – echte Parallelität erfordert Multiprocessing.",
                en: "Guido van Rossum designed Python prioritizing human readability. Everything is a first-class heap object managed by reference counting. CPython's GIL restricts bytecode execution to one thread at a time; true parallelism requires multiprocessing."
              },
              code: "import sys\n\nx = [1, 2, 3]\nprint(f\"Referenzzähler: {sys.getrefcount(x) - 1}\")"
            },
            {
              id: "py-01-s2",
              type: "quiz_choice",
              title: { de: "Mutable vs. Immutable Datenstrukturen", en: "Mutable vs. Immutable Data Structures" },
              prompt: {
                de: "Welche Datenstruktur in Python ist 'immutable' (unveränderlich) und kann gefahrlos als Dictionary-Schlüssel dienen?",
                en: "Which Python data structure is immutable and can safely serve as a dictionary key?"
              },
              options: [
                "Tuple (`(1, 2, 3)`)",
                "List (`[1, 2, 3]`)",
                "Set (`{1, 2, 3}`)",
                "Dictionary (`{'a': 1}`)"
              ],
              solution: 0,
              explanation: {
                de: "Tupel sind unveränderlich (`immutable`) und besitzen einen unveränderlichen Hash-Wert. Listen und Sets sind veränderlich (`mutable`) und nicht hashbar.",
                en: "Tuples are immutable and hashable. Lists and sets are mutable and unhashable."
              }
            }
          ]
        },
        {
          id: "py-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): Python Automation & Data Structures", en: "🏛️ IHK Exam Module (90 Min): Python Automation & Data Structures" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Als Fachinformatiker/in für Systemintegration (FISI) sollen Sie ein automatisiertes Monitoring- und Log-Parsing-Tool für eine Server-Farm entwerfen. Das Tool soll Logfiles im Terabyte-Bereich speicherschonend durchsuchen, Fehler filtern und Statusberichte per API übertragen.",
            en: "Scenario: As an IT systems engineer, you are designing a memory-efficient log parsing and alerting pipeline for a server cluster. The script must process multi-gigabyte log archives without memory exhaustion."
          },
          sections: [
            {
              id: "ex-py-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): Generatoren zur Speicheroptimierung", en: "Question 1 (20 Points): Memory Optimization with Generators" },
              prompt: {
                de: "Ein Logfile ist 50 GB groß. Warum führt `f.readlines()` zum Out-of-Memory-Absturz und wie lautet die Lösung?",
                en: "A logfile is 50 GB. Why does `f.readlines()` trigger an OOM crash and what is the fix?"
              },
              options: [
                "`readlines()` lädt alle 50 GB auf einmal in den RAM. Lösung: Zeilenweises Iterieren mit einem Generator (`for line in f:`), wodurch immer nur eine einzelne Zeile im RAM liegt.",
                "`readlines()` funktioniert nur bei Bilddateien.",
                "Man muss den Server neu starten.",
                "Python muss auf 32-Bit umgestellt werden."
              ],
              solution: 0,
              explanation: {
                de: "Dateiobjekte in Python implementieren das Iterator-Protokoll. Beim Durchlaufen mit `for line in f:` wird immer nur die aktuelle Zeile in den Speicher gestreamt, was selbst riesige Dateien mit wenigen Kilobyte RAM lesbar macht.",
                en: "Iterating with `for line in f:` streams line-by-line, consuming constant memory regardless of file size."
              }
            }
          ]
        }
      ]
    },
    {
      id: "html-css",
      title: { de: "HTML5 & CSS3", en: "HTML5 & CSS3" },
      icon: "🎨",
      badge: "Web Foundation",
      desc: { de: "Semantisches HTML, Box-Modell, CSS Grid, Flexbox, Design Tokens & Barrierefreiheit.", en: "Semantic HTML, box model, CSS grid, flexbox, design tokens & accessibility." },
      chapters: [
        {
          id: "html-01-boxmodel-semantics",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. Semantisches HTML, Box-Modell & Modernes Grid", en: "1. Semantic HTML, Box Model & Modern Grid" },
          duration: "25 min",
          sections: [
            {
              id: "html-01-s1",
              type: "concept",
              title: { de: "Semantische HTML5-Elemente", en: "Semantic HTML5 Elements" },
              content: {
                de: "Nutze semantische Container wie `<header>`, `<nav>`, `<main>`, `<article>` und `<footer>` anstelle unstrukturierter `<div>`-Tags. Semantik verbessert Barrierefreiheit (Screenreader für sehbehinderte Menschen) und Suchmaschinen-Indexierung.",
                en: "Use semantic elements like `<header>`, `<nav>`, `<main>`, `<article>`, and `<footer>` instead of div soup. Semantics empower screenreaders and search indexing."
              },
              code: "<main>\n  <article>\n    <h1>Moderne Web-Entwicklung</h1>\n    <p>Semantische Struktur nach W3C-Standard.</p>\n  </article>\n</main>"
            },
            {
              id: "html-01-s2",
              type: "quiz_choice",
              title: { de: "CSS Box-Modell: border-box", en: "CSS Box Model: border-box" },
              prompt: {
                de: "Warum ist `box-sizing: border-box;` die Standard-Einstellung in modernen Web-Projekten?",
                en: "Why is `box-sizing: border-box;` standard across modern web projects?"
              },
              options: [
                "`padding` und `border` werden in die angegebene Breite eingerechnet, sodass Elemente ihre definierte Dimension exakt beibehalten.",
                "Weil es Bilder automatisch verkleinert.",
                "Weil es CSS-Code schneller herunterlädt.",
                "Es schützt vor Viren."
              ],
              solution: 0,
              explanation: {
                de: "Im Standard `content-box` vergrößern Padding und Border die Box über die angegebene Breite hinaus. `border-box` rechnet beides ein und verhindert Layout-Bugs.",
                en: "`border-box` includes padding and borders inside the declared width and height, preserving exact layout dimensions."
              }
            }
          ]
        },
        {
          id: "html-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): Responsive Layouts & Barrierefreiheit", en: "🏛️ IHK Exam Module (90 Min): Responsive Layouts & Accessibility" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Als Web-Entwickler/in bei einem kommunalen IT-Dienstleister sollen Sie das Bürgerportal der Stadt barrierefrei nach den gesetzlichen Vorgaben der BITV 2.0 / WCAG 2.1 umgestalten. Gleichzeitig müssen mobile Darstellungsfehler behoben und die CSS-Spezifität bereinigt werden.",
            en: "Scenario: As a web developer at a municipal agency, you are overhauling the public citizen portal to comply with statutory accessibility directives (BITV 2.0 / WCAG 2.1) while resolving responsive mobile defects and CSS specificity conflicts."
          },
          sections: [
            {
              id: "ex-html-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): CSS-Spezifität", en: "Question 1 (20 Points): CSS Specificity" },
              prompt: {
                de: "Welcher der folgenden Selektoren hat die höchste Spezifität?",
                en: "Which of the following selectors has the highest specificity?"
              },
              options: [
                "#header .nav-item (1 ID, 1 Klasse)",
                ".nav .nav-item.active (3 Klassen)",
                "nav ul li a (4 Element-Selektoren)",
                "* (Universalselektor)"
              ],
              solution: 0,
              explanation: {
                de: "Ein einzelner ID-Selektor (0,1,0,0) sticht beliebig viele Klassenselektoren (0,0,x,0) aus. `#header .nav-item` besitzt Spezifität (0,1,1,0).",
                en: "A single ID (0,1,0,0) outweighs any number of classes. `#header .nav-item` scores (0,1,1,0)."
              }
            }
          ]
        }
      ]
    },
    {
      id: "javascript",
      title: { de: "JavaScript & TypeScript", en: "JavaScript & TypeScript" },
      icon: "📜",
      badge: "Client & Server",
      desc: { de: "Event Loop, Call Stack, Microtasks, Async/Await & statische Typisierung mit TypeScript.", en: "Event loop, call stack, microtasks, async/await & static typing with TypeScript." },
      chapters: [
        {
          id: "js-01-eventloop-ts",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. Warum TypeScript? Event Loop, Promises & Types", en: "1. Why TypeScript? Event Loop, Promises & Types" },
          duration: "25 min",
          sections: [
            {
              id: "js-01-s1",
              type: "concept",
              title: { de: "Der Event Loop & Asynchronität", en: "The Event Loop & Asynchrony" },
              content: {
                de: "JavaScript ist single-threaded (ein Call Stack). Asynchrone Operationen (Netzwerk, Timer) werden an Web-APIs übergeben. Aufgelöste Promises landen in der Microtask Queue, die Vorrang vor der Macrotask Queue (setTimeout) hat.",
                en: "JavaScript is single-threaded. Asynchronous operations offload to Web APIs. Resolved promises land in the microtask queue, which drains prior to macrotasks (setTimeout)."
              },
              code: "console.log(\"1\");\nsetTimeout(() => console.log(\"4 (Macrotask)\"), 0);\nPromise.resolve().then(() => console.log(\"3 (Microtask)\"));\nconsole.log(\"2\");\n// Ausgabe: 1 -> 2 -> 3 -> 4"
            },
            {
              id: "js-01-s2",
              type: "quiz_choice",
              title: { de: "XSS-Schutz im DOM", en: "DOM XSS Prevention" },
              prompt: {
                de: "Welche Eigenschaft verhindert Cross-Site Scripting (XSS) beim Einfügen von Nutzereingaben ins DOM?",
                en: "Which property safely prevents DOM XSS when inserting user input?"
              },
              options: [
                "element.textContent = input; (wird als reiner Text escaped)",
                "element.innerHTML = input;",
                "element.outerHTML = input;",
                "document.write(input);"
              ],
              solution: 0,
              explanation: {
                de: "`textContent` escaped HTML-Sonderzeichen wie `<` und `>` und rendert reinen Text. `innerHTML` würde `<script>`-Tags oder `onload`-Attribute direkt ausführen.",
                en: "`textContent` safely escapes markup characters, treating input strictly as literal text."
              }
            }
          ]
        },
        {
          id: "js-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): Fullstack JS & Statische Typisierung", en: "🏛️ IHK Exam Module (90 Min): Fullstack JS & Static Typing" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Sie sind Fullstack-Entwickler/in bei einem Fintech-Startup. Das webbasierte Dashboard friert bei hohen Datenmengen ein, und im Frontend-Code wurden unbereinigte HTML-Strings gefunden. Ihre Aufgabe ist es, den Event Loop zu entlasten, typsichere TypeScript-APIs zu bauen und XSS-Lücken zu schließen.",
            en: "Scenario: You are a fullstack developer at a fintech startup. The web dashboard freezes under heavy load, and unsanitized HTML injections threaten user balances. You must decouple the event loop, author type-safe TypeScript interfaces, and eliminate XSS vulnerabilities."
          },
          sections: [
            {
              id: "ex-js-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): Paralleles Promise.all", en: "Question 1 (20 Points): Parallel Promise.all" },
              prompt: {
                de: "Wie führt man drei voneinander unabhängige API-Aufrufe parallel und nicht sequentiell aus?",
                en: "How do you execute three independent API requests concurrently?"
              },
              options: [
                "const [r1, r2, r3] = await Promise.all([fetch1(), fetch2(), fetch3()]);",
                "await fetch1(); await fetch2(); await fetch3();",
                "fetch1(); while(true) { fetch2(); }",
                "fetch1().wait()"
              ],
              solution: 0,
              explanation: {
                de: "`Promise.all` stößt alle Promises gleichzeitig an. Sequentielle `await`-Aufrufe würden die Requests nacheinander ausführen und die Wartezeit verdreifachen.",
                en: "`Promise.all` executes promises concurrently, resolving when all finish."
              }
            }
          ]
        }
      ]
    },
    {
      id: "php",
      title: { de: "Modernes PHP 8+", en: "Modern PHP 8+" },
      icon: "🐘",
      badge: "Backend Engine",
      desc: { de: "Shared-Nothing Lifecycle, Constructor Promotion, PDO Prepared Statements & OOP.", en: "Shared-nothing lifecycle, constructor promotion, PDO prepared statements & OOP." },
      chapters: [
        {
          id: "php-01-oop-security",
          index: 1,
          type: "lesson",
          level: { de: "Grundlagen", en: "Fundamentals" },
          title: { de: "1. Warum PHP 8? Lifecycle, OOP & PDO-Sicherheit", en: "1. Why PHP 8? Lifecycle, OOP & PDO Security" },
          duration: "25 min",
          sections: [
            {
              id: "php-01-s1",
              type: "concept",
              title: { de: "Das 'Shared Nothing' Modell", en: "The 'Shared Nothing' Model" },
              content: {
                de: "PHP-FPM instanziiert bei jedem HTTP-Request eine saubere, isolierte Laufzeitumgebung und gibt den gesamten Speicher nach Auslieferung restlos frei. Ein Speicherleck in einem Skript kann niemals den gesamten Server lahmlegen. PHP 8 ergänzt JIT-Kompilierung und Constructor Property Promotion.",
                en: "PHP-FPM spins up an isolated execution environment per request and purges memory immediately upon response completion. Memory leaks cannot crash the server daemon. Modern PHP 8 introduces JIT compilation and constructor property promotion."
              },
              code: "<?php\ndeclare(strict_types=1);\n\nclass UserDTO {\n    public function __construct(\n        public readonly int $id,\n        public readonly string $email\n    ) {}\n}"
            },
            {
              id: "php-01-s2",
              type: "quiz_choice",
              title: { de: "Sicheres Passwort-Hashing", en: "Secure Password Hashing" },
              prompt: {
                de: "Welche native PHP-Funktion erzeugt kryptografisch sichere Hashes mit Salt nach Argon2id/Bcrypt?",
                en: "Which native PHP function generates cryptographically secure salted hashes with Argon2id/Bcrypt?"
              },
              options: [
                "password_hash($pwd, PASSWORD_ARGON2ID)",
                "md5($pwd)",
                "sha1($pwd)",
                "base64_encode($pwd)"
              ],
              solution: 0,
              explanation: {
                de: "`password_hash()` wählt kryptografisch sichere Zufallssalze und unterstützt modernste Hashing-Standards wie Argon2id und Bcrypt.",
                en: "`password_hash()` creates cryptographic salts and supports Argon2id and Bcrypt."
              }
            }
          ]
        },
        {
          id: "php-exam-90min",
          index: 2,
          type: "exam_90min",
          level: { de: "IHK-Prüfung", en: "IHK Exam" },
          title: { de: "🏛️ IHK-Prüfungsmodul (90 Min): Backend Architecture & Session Security", en: "🏛️ IHK Exam Module (90 Min): Backend Architecture & Session Security" },
          duration: "90 min",
          scenario: {
            de: "Handlungssituation: Sie sind Anwendungsentwickler/in bei einem E-Commerce-Dienstleister. Eine Shop-Plattform auf PHP-Basis soll auditiert werden. Sie müssen Session-Entführungen (Session Hijacking / Fixation) unterbinden, ein robustes MVC-Routing einrichten und Datenbankzugriffe gegen SQL-Injektionen absichern.",
            en: "Scenario: You are a software developer at an e-commerce agency. A PHP web platform requires a security audit. You must neutralize session hijacking and fixation risks, implement MVC routing, and harden database connections against injection."
          },
          sections: [
            {
              id: "ex-php-01",
              type: "quiz_choice",
              scoreWeight: 20,
              title: { de: "Aufgabe 1 (20 Punkte): Session Fixation Schutz", en: "Question 1 (20 Points): Session Fixation Defense" },
              prompt: {
                de: "Welche Funktion muss nach erfolgreichem Login unmittelbar aufgerufen werden, um Session Fixation zu unterbinden?",
                en: "Which function must be called immediately after successful login to prevent session fixation?"
              },
              options: [
                "session_regenerate_id(true); (rotiert die ID und löscht alte Session-Dateien)",
                "session_destroy();",
                "session_start();",
                "setcookie('login', 'true');"
              ],
              solution: 0,
              explanation: {
                de: "`session_regenerate_id(true)` invalidiert die alte Session-ID und vergibt eine neue ID, sodass eine vom Angreifer vorbereitete Session-ID wertlos wird.",
                en: "`session_regenerate_id(true)` invalidates the existing session ID and generates a new cryptographic identifier."
              }
            }
          ]
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
    dom.xpDisplay.textContent = state.progress.xp;
    dom.streakDisplay.textContent = state.progress.streak;
  }

  // Render Courses in Sidebar
  function renderCourseList() {
    dom.courseList.innerHTML = '';
    state.courses.forEach(course => {
      const btn = document.createElement('button');
      btn.className = `course-card-btn ${course.id === state.currentCourseId ? 'active' : ''}`;
      btn.onclick = () => selectCourse(course.id);
      
      const title = course.title[state.lang] || course.title.en;
      const desc = course.desc[state.lang] || course.desc.en;

      btn.innerHTML = `
        <div class="course-icon-box">${course.icon}</div>
        <div class="course-card-info">
          <div class="course-card-title">
            <span>${title}</span>
            <span class="course-badge">${course.badge}</span>
          </div>
          <div class="course-card-desc">${desc}</div>
        </div>
      `;
      dom.courseList.appendChild(btn);
    });
  }

  // Select Course
  function selectCourse(courseId) {
    if (state.exam.active && !confirm(state.lang === 'de' ? 'Laufende IHK-Prüfung wirklich abbrechen?' : 'Do you really want to abort the active IHK exam?')) {
      return;
    }
    stopExamTimer();
    state.exam.active = false;
    state.currentCourseId = courseId;
    state.currentChapter = null;
    renderCourseList();
    renderCourseStage();
  }

  // Render Course Stage & Chapters
  function renderCourseStage() {
    const course = state.courses.find(c => c.id === state.currentCourseId);
    if (!course) return;

    dom.stageCourseTitle.textContent = course.title[state.lang] || course.title.en;
    dom.stageCourseDesc.textContent = course.desc[state.lang] || course.desc.en;
    dom.stageBadge.textContent = course.badge;

    // Show Chapter Grid, hide player and exam
    dom.chapterView.style.display = 'block';
    dom.lessonPlayer.style.display = 'none';
    if (dom.examRunner) dom.examRunner.style.display = 'none';

    dom.chapterGrid.innerHTML = '';
    course.chapters.forEach(ch => {
      const card = document.createElement('div');
      const isCompleted = ch.sections.every(s => state.progress.completedSections.includes(s.id));
      const isExam = ch.type === 'exam_90min';
      card.className = `chapter-card ${isCompleted ? 'completed' : ''} ${isExam ? 'exam-card' : ''}`;
      card.onclick = () => startChapter(ch);

      const title = ch.title[state.lang] || ch.title.en;
      const levelLabel = ch.level ? (ch.level[state.lang] || ch.level.en) : (isExam ? 'IHK-Prüfung' : 'Grundlagen');
      const statusBadge = isCompleted ? (state.lang === 'de' ? '✅ Abgeschlossen' : '✅ Completed') : levelLabel;

      card.innerHTML = `
        <div class="chapter-card-header">
          <span class="chapter-number">${isExam ? '🏛️ IHK KLAUSUR' : `Kapitel ${ch.index}`}</span>
          <span class="chapter-status ${isExam ? 'status-exam' : ''}">${statusBadge}</span>
        </div>
        <h3 class="chapter-title">${title}</h3>
        <div class="chapter-footer">
          <span>⏱️ ${ch.duration}</span>
          <span class="btn-start-chapter">${isExam ? (state.lang === 'de' ? 'Prüfung starten ⏱️' : 'Start Exam ⏱️') : (state.lang === 'de' ? 'Lektion starten →' : 'Start Lesson →')}</span>
        </div>
      `;
      dom.chapterGrid.appendChild(card);
    });
  }

  // Start Chapter or Exam
  function startChapter(chapter) {
    if (chapter.type === 'exam_90min') {
      startExamMode(chapter);
      return;
    }
    state.currentChapter = chapter;
    state.currentSectionIndex = 0;
    dom.chapterView.style.display = 'none';
    dom.lessonPlayer.style.display = 'flex';
    if (dom.examRunner) dom.examRunner.style.display = 'none';
    renderLessonSection();
  }

  // Close Player
  window.closePlayer = function() {
    state.currentChapter = null;
    renderCourseStage();
  };

  // Render Lesson Section
  function renderLessonSection() {
    const ch = state.currentChapter;
    if (!ch || !ch.sections[state.currentSectionIndex]) return;

    const section = ch.sections[state.currentSectionIndex];
    const total = ch.sections.length;
    const currentIdx = state.currentSectionIndex;

    const pct = Math.round(((currentIdx + 1) / total) * 100);
    dom.playerProgress.style.width = `${pct}%`;
    dom.playerTitle.textContent = `${ch.title[state.lang] || ch.title.en} (${currentIdx + 1}/${total})`;
    dom.playerFeedback.innerHTML = '';
    dom.playerContent.innerHTML = '';

    if (section.type === 'concept') {
      const title = section.title[state.lang] || section.title.en;
      const text = section.content[state.lang] || section.content.en;

      dom.playerContent.innerHTML = `
        <div class="concept-box">
          <h2 class="concept-title">${title}</h2>
          <p class="concept-body">${text}</p>
          ${section.code ? `<pre class="code-block-container"><code>${escapeHtml(section.code)}</code></pre>` : ''}
        </div>
      `;

      dom.playerActions.innerHTML = `
        <button class="btn-action" onclick="nextSection()">${state.lang === 'de' ? 'Verstanden & Weiter →' : 'Understood & Next →'}</button>
      `;

    } else if (section.type === 'quiz_choice') {
      const prompt = section.prompt[state.lang] || section.prompt.en;

      let optionsHtml = '';
      section.options.forEach((opt, idx) => {
        optionsHtml += `
          <button class="option-btn" onclick="selectQuizOption(${idx})">
            <span>${idx + 1}.</span>
            <span>${escapeHtml(opt)}</span>
          </button>
        `;
      });

      dom.playerContent.innerHTML = `
        <div class="quiz-box">
          <p class="quiz-prompt">${prompt}</p>
          <div class="options-grid" id="quizOptionsGrid">${optionsHtml}</div>
        </div>
      `;

      dom.playerActions.innerHTML = '';

    } else if (section.type === 'quiz_code_puzzle') {
      const prompt = section.prompt[state.lang] || section.prompt.en;

      let chipsHtml = '';
      section.options.forEach(opt => {
        chipsHtml += `<button class="option-btn" style="padding: 8px 14px;" onclick="selectPuzzleOption('${escapeHtml(opt)}')">${escapeHtml(opt)}</button>`;
      });

      dom.playerContent.innerHTML = `
        <div class="quiz-box">
          <p class="quiz-prompt">${prompt}</p>
          <pre class="code-block-container"><code id="puzzleCodePreview">${escapeHtml(section.codeSnippet)}</code></pre>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">${chipsHtml}</div>
        </div>
      `;

      dom.playerActions.innerHTML = '';
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Select Quiz Choice
  window.selectQuizOption = function(selectedIdx) {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const isCorrect = selectedIdx === section.solution;

    const buttons = document.querySelectorAll('#quizOptionsGrid .option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === section.solution) btn.classList.add('correct');
      if (idx === selectedIdx && !isCorrect) btn.classList.add('wrong');
    });

    const explanation = section.explanation[state.lang] || section.explanation.en;

    if (isCorrect) {
      addXP(10, section.id);
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner success">
          <strong>${state.lang === 'de' ? '🎉 Richtig gelöst! (+10 XP)' : '🎉 Correct! (+10 XP)'}</strong>
          <span>${explanation}</span>
        </div>
      `;
    } else {
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner error">
          <strong>${state.lang === 'de' ? 'Nicht ganz! Fachliche Erläuterung:' : 'Not quite! Technical explanation:'}</strong>
          <span>${explanation}</span>
        </div>
      `;
    }

    dom.playerActions.innerHTML = `
      <button class="btn-action" onclick="nextSection()">${state.lang === 'de' ? 'Weiter →' : 'Continue →'}</button>
    `;
  };

  // Select Puzzle Option
  window.selectPuzzleOption = function(selectedWord) {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const isCorrect = selectedWord === section.solution;
    const explanation = section.explanation[state.lang] || section.explanation.en;

    if (isCorrect) {
      addXP(15, section.id);
      document.getElementById('puzzleCodePreview').textContent = section.codeSnippet.replace('___', selectedWord);
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner success">
          <strong>${state.lang === 'de' ? '🎉 Perfekt eingesetzt! (+15 XP)' : '🎉 Well done! (+15 XP)'}</strong>
          <span>${explanation}</span>
        </div>
      `;
    } else {
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner error">
          <strong>${state.lang === 'de' ? 'Syntaktisch inkorrekt:' : 'Syntax mismatch:'}</strong>
          <span>${explanation}</span>
        </div>
      `;
    }

    dom.playerActions.innerHTML = `
      <button class="btn-action" onclick="nextSection()">${state.lang === 'de' ? 'Weiter →' : 'Continue →'}</button>
    `;
  };

  // Add XP
  function addXP(amount, sectionId) {
    if (!state.progress.completedSections.includes(sectionId)) {
      state.progress.completedSections.push(sectionId);
      state.progress.xp += amount;
      saveProgress();
    }
  }

  // Next Section
  window.nextSection = function() {
    const ch = state.currentChapter;
    if (state.currentSectionIndex + 1 < ch.sections.length) {
      state.currentSectionIndex++;
      renderLessonSection();
    } else {
      dom.playerProgress.style.width = '100%';
      dom.playerContent.innerHTML = `
        <div class="concept-box" style="text-align: center; padding: 32px 0;">
          <div style="font-size: 3.5rem; margin-bottom: 12px;">🏆</div>
          <h2 class="concept-title">${state.lang === 'de' ? 'Lektion erfolgreich abgeschlossen!' : 'Lesson Completed!'}</h2>
          <p class="concept-body">${state.lang === 'de' ? 'Hervorragend. Du hast dieses Fachgebiet vertieft und kannst jederzeit in die IHK-Prüfung starten.' : 'Outstanding! You have deepened this topic and can now attempt the IHK exam.'}</p>
        </div>
      `;
      dom.playerFeedback.innerHTML = '';
      dom.playerActions.innerHTML = `
        <button class="btn-action" onclick="closePlayer()">${state.lang === 'de' ? 'Zurück zur Übersicht' : 'Back to Overview'}</button>
      `;
    }
  };

  // ==========================================
  // 🏛️ 90-MINUTE IHK EXAM ENGINE & EVALUATION
  // ==========================================

  function startExamMode(chapter) {
    state.exam.active = true;
    state.exam.chapter = chapter;
    state.exam.timeRemaining = 5400; // 90 min (5400s)
    state.exam.currentQuestionIdx = 0;
    state.exam.answers = {};
    state.exam.flagged = {};
    state.exam.submitted = false;

    dom.chapterView.style.display = 'none';
    dom.lessonPlayer.style.display = 'none';

    // Ensure Exam Runner container exists
    let examRunner = document.getElementById('examRunner');
    if (!examRunner) {
      examRunner = document.createElement('div');
      examRunner.id = 'examRunner';
      examRunner.className = 'exam-runner-container';
      dom.lessonPlayer.parentNode.appendChild(examRunner);
      dom.examRunner = examRunner;
    }
    dom.examRunner.style.display = 'flex';

    startExamTimer();
    renderExamQuestion();
  }

  function startExamTimer() {
    stopExamTimer();
    state.exam.timerId = setInterval(() => {
      if (state.exam.timeRemaining > 0) {
        state.exam.timeRemaining--;
        updateExamTimerUI();
      } else {
        stopExamTimer();
        alert(state.lang === 'de' ? '⏱️ Die 90 Minuten Prüfungszeit sind abgelaufen! Ihre Prüfung wird nun automatisch abgegeben.' : '⏱️ The 90-minute exam time has expired! Your exam will now be submitted automatically.');
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

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateExamTimerUI() {
    const timerElem = document.getElementById('examLiveTimer');
    if (!timerElem) return;
    timerElem.textContent = formatTime(state.exam.timeRemaining);
    if (state.exam.timeRemaining <= 120) {
      timerElem.className = 'exam-timer timer-critical';
    } else if (state.exam.timeRemaining <= 600) {
      timerElem.className = 'exam-timer timer-warning';
    } else {
      timerElem.className = 'exam-timer';
    }
  }

  function renderExamQuestion() {
    const ch = state.exam.chapter;
    if (!ch) return;

    if (state.exam.submitted) {
      renderExamResults();
      return;
    }

    const qIdx = state.exam.currentQuestionIdx;
    const questions = ch.sections;
    const q = questions[qIdx];
    const totalQ = questions.length;
    const isFlagged = !!state.exam.flagged[qIdx];
    const selectedAns = state.exam.answers[qIdx];

    let navPillsHtml = '';
    questions.forEach((item, idx) => {
      const isAnswered = state.exam.answers[idx] !== undefined;
      const isCur = idx === qIdx;
      const isFlg = !!state.exam.flagged[idx];
      let classes = ['exam-q-pill'];
      if (isCur) classes.push('current');
      if (isAnswered) classes.push('answered');
      if (isFlg) classes.push('flagged');
      navPillsHtml += `
        <button type="button" class="${classes.join(' ')}" onclick="jumpToExamQuestion(${idx})">
          ${idx + 1}${isFlg ? ' 🚩' : ''}
        </button>
      `;
    });

    let optionsHtml = '';
    q.options.forEach((opt, oIdx) => {
      const isSelected = selectedAns === oIdx;
      optionsHtml += `
        <button type="button" class="exam-option-btn ${isSelected ? 'selected' : ''}" onclick="selectExamAnswer(${oIdx})">
          <span class="opt-letter">${String.fromCharCode(65 + oIdx)}</span>
          <span class="opt-text">${escapeHtml(opt)}</span>
        </button>
      `;
    });

    const scenarioText = ch.scenario ? (ch.scenario[state.lang] || ch.scenario.en) : '';

    dom.examRunner.innerHTML = `
      <div class="exam-header-bar">
        <div class="exam-badge-group">
          <span class="badge-ihk">🏛️ IHK-ABSCHLUSSPRÜFUNG</span>
          <span class="exam-course-label">${ch.title[state.lang] || ch.title.en}</span>
        </div>
        <div class="exam-timer-box">
          <span class="timer-icon">⏱️</span>
          <span class="exam-timer" id="examLiveTimer">${formatTime(state.exam.timeRemaining)}</span>
        </div>
        <button class="btn-quit-exam" onclick="confirmQuitExam()">✕ ${state.lang === 'de' ? 'Abbrechen' : 'Cancel'}</button>
      </div>

      ${scenarioText ? `
        <div class="exam-scenario-card">
          <div class="scenario-title">📋 ${state.lang === 'de' ? 'Betriebliche Handlungssituation' : 'Business Scenario'}</div>
          <div class="scenario-body">${escapeHtml(scenarioText)}</div>
        </div>
      ` : ''}

      <div class="exam-nav-toolbar">
        <div class="exam-pills-row">${navPillsHtml}</div>
        <button type="button" class="btn-flag ${isFlagged ? 'active' : ''}" onclick="toggleFlagQuestion()">
          ${isFlagged ? (state.lang === 'de' ? '🚩 Markiert' : '🚩 Flagged') : (state.lang === 'de' ? '🏳️ Zur Wiedervorlage' : '🏳️ Flag for Review')}
        </button>
      </div>

      <div class="exam-question-card">
        <div class="exam-question-header">
          <span class="q-number">${state.lang === 'de' ? `Handlungsschritt ${qIdx + 1} von ${totalQ}` : `Action Step ${qIdx + 1} of ${totalQ}`}</span>
          <span class="q-points">${q.scoreWeight || 20} ${state.lang === 'de' ? 'Punkte' : 'Points'}</span>
        </div>
        <h2 class="exam-q-prompt">${q.prompt[state.lang] || q.prompt.en}</h2>
        <div class="exam-options-list">${optionsHtml}</div>
      </div>

      <div class="exam-footer-controls">
        <button type="button" class="btn-secondary" ${qIdx === 0 ? 'disabled' : ''} onclick="jumpToExamQuestion(${qIdx - 1})">
          ← ${state.lang === 'de' ? 'Vorherige Frage' : 'Previous Question'}
        </button>
        <button type="button" class="btn-action submit-exam-btn" onclick="confirmSubmitExam()">
          📥 ${state.lang === 'de' ? 'Prüfung jetzt abgeben' : 'Submit Exam Now'}
        </button>
        <button type="button" class="btn-primary" ${qIdx === totalQ - 1 ? 'disabled' : ''} onclick="jumpToExamQuestion(${qIdx + 1})">
          ${state.lang === 'de' ? 'Nächste Frage' : 'Next Question'} →
        </button>
      </div>
    `;

    updateExamTimerUI();
  }

  window.jumpToExamQuestion = function(idx) {
    state.exam.currentQuestionIdx = idx;
    renderExamQuestion();
  };

  window.selectExamAnswer = function(optIdx) {
    state.exam.answers[state.exam.currentQuestionIdx] = optIdx;
    renderExamQuestion();
  };

  window.toggleFlagQuestion = function() {
    const idx = state.exam.currentQuestionIdx;
    state.exam.flagged[idx] = !state.exam.flagged[idx];
    renderExamQuestion();
  };

  window.confirmQuitExam = function() {
    if (confirm(state.lang === 'de' ? 'Prüfung wirklich ohne Wertung abbrechen?' : 'Abort exam without grading?')) {
      stopExamTimer();
      state.exam.active = false;
      renderCourseStage();
    }
  };

  window.confirmSubmitExam = function() {
    const ch = state.exam.chapter;
    const answeredCount = Object.keys(state.exam.answers).length;
    const totalCount = ch.sections.length;
    const unanswered = totalCount - answeredCount;

    let msg = state.lang === 'de' 
      ? `Möchten Sie die Prüfung jetzt verbindlich abgeben?\nBeantwortet: ${answeredCount} von ${totalCount} Fragen.`
      : `Submit your exam now?\nAnswered: ${answeredCount} of ${totalCount} questions.`;

    if (unanswered > 0) {
      msg += state.lang === 'de'
        ? `\n⚠️ Achtung: ${unanswered} Frage(n) sind noch unbeantwortet und bringen 0 Punkte!`
        : `\n⚠️ Warning: ${unanswered} question(s) are unanswered and award 0 points!`;
    }

    if (confirm(msg)) {
      submitExam();
    }
  };

  function calculateIhkGrade(scorePct) {
    if (scorePct >= 92) return { grade: 1, label: { de: "Sehr gut (1)", en: "Very Good (1)" }, status: { de: "🏆 Bestanden mit Prädikat", en: "🏆 Passed with Distinction" }, color: "var(--brand-green)" };
    if (scorePct >= 81) return { grade: 2, label: { de: "Gut (2)", en: "Good (2)" }, status: { de: "✅ Bestanden", en: "✅ Passed" }, color: "var(--brand-blue)" };
    if (scorePct >= 67) return { grade: 3, label: { de: "Befriedigend (3)", en: "Satisfactory (3)" }, status: { de: "✅ Bestanden", en: "✅ Passed" }, color: "var(--brand-blue)" };
    if (scorePct >= 50) return { grade: 4, label: { de: "Ausreichend (4)", en: "Sufficient (4)" }, status: { de: "⚠️ Bestanden (Bestehensgrenze)", en: "⚠️ Passed (Minimum Requirement)" }, color: "var(--brand-amber)" };
    if (scorePct >= 30) return { grade: 5, label: { de: "Mangelhaft (5)", en: "Poor (5)" }, status: { de: "❌ Nicht bestanden", en: "❌ Failed" }, color: "#f85149" };
    return { grade: 6, label: { de: "Ungenügend (6)", en: "Inadequate (6)" }, status: { de: "❌ Nicht bestanden", en: "❌ Failed" }, color: "#f85149" };
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
    const gradeInfo = calculateIhkGrade(scorePct);

    state.exam.score = scorePct;
    state.exam.earnedPoints = earnedPoints;
    state.exam.totalMaxPoints = totalMaxPoints;
    state.exam.gradeInfo = gradeInfo;

    // Save in progress
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
            <span class="review-step-label">${state.lang === 'de' ? `Handlungsschritt ${idx + 1}` : `Action Step ${idx + 1}`}: ${q.title[state.lang] || q.title.en}</span>
            <span class="review-score-badge ${isCorrect ? 'score-green' : 'score-red'}">
              ${isCorrect ? `+${weight} / ${weight} Pkt.` : `0 / ${weight} Pkt.`}
            </span>
          </div>
          <p class="review-prompt"><strong>${q.prompt[state.lang] || q.prompt.en}</strong></p>
          
          <div class="review-answers-box">
            <div class="user-ans ${isCorrect ? 'ans-correct' : 'ans-wrong'}">
              <span class="ans-label">${state.lang === 'de' ? 'Ihre Lösung:' : 'Your Answer:'}</span>
              <span>${escapeHtml(userChoiceText)} ${isCorrect ? '✓' : '✗'}</span>
            </div>
            ${!isCorrect ? `
              <div class="correct-ans">
                <span class="ans-label">${state.lang === 'de' ? 'IHK-Musterlösung:' : 'Official Answer:'}</span>
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
        <div class="result-badge-top">🏛️ IHK-PRÜFUNGSERGEBNIS</div>
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
            <div class="metric-lbl">${state.lang === 'de' ? 'IHK-Note' : 'IHK Grade'}</div>
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
          📋 ${state.lang === 'de' ? 'Detaillierte Aufgaben-Analyse & IHK-Musterlösung' : 'Detailed Analysis & Model Solutions'}
        </h2>
        ${reviewsHtml}
      </div>
    `;
  }

  window.closeExamMode = function() {
    stopExamTimer();
    state.exam.active = false;
    renderCourseStage();
  };

  // Floating AI Robot Drawer Handlers
  function setupRobotWidget() {
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
          new Notification("learn · Zeit für deinen IHK Code-Sprint! 🚀", {
            body: "Dein IHK-Kurs wartet auf dich. Nimm dir 5 Minuten Zeit!",
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
          body: "Dein IHK-Kurs wartet auf dich. Schließe heute ein kurzes Kapitel ab!",
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
