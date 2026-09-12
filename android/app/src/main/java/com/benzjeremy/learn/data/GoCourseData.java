package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GoCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "go-1",
                "1. Was ist Programmieren & Go-Grundlagen",
                "Ein Computer versteht im Kern nur Strom: An (1) oder Aus (0). Quellcode ist eine für Menschen lesbare Anleitung. Ein Compiler wie der Go-Compiler übersetzt diesen Text in Millisekunden in blitzschnelle Maschinensprache. Go wurde von Google entwickelt, um einfach, aufgeräumt und extrem schnell zu sein.",
                "Jedes eigenständige Go-Programm beginnt mit 'package main' (dem Hauptpaket) und der Funktion 'func main()'. Dies ist der Startpunkt: Hier beginnt der Computer, Befehle von oben nach unten auszuführen. Mit 'import \"fmt\"' laden wir das Format-Paket, um mit 'fmt.Println()' Text auf dem Bildschirm anzuzeigen.",
                "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Der Computer führt diesen Befehl aus:\n    fmt.Println(\"Hallo Welt! Ich lerne programmieren mit Go.\")\n}",
                Arrays.asList(
                        new Question(
                                "q-go-1-1",
                                "Was ist die Hauptaufgabe eines Compilers wie in Go?",
                                new String[]{
                                        "Er übersetzt den vom Menschen geschriebenen Quellcode direkt in Maschinencode, den die CPU ausführen kann.",
                                        "Er korrigiert automatisch die Rechtschreibung in Webseiten.",
                                        "Er verbindet den PC mit dem Internet.",
                                        "Er löscht temporäre Dateien vom Desktop."
                                },
                                0,
                                new String[]{
                                        "Korrekt! Ein Compiler übersetzt menschenlesbaren Quelltext (Go) in native Maschinensprache für den Prozessor.",
                                        "Falsch: Ein Compiler prüft Programmsyntax, keine Rechtschreibung von Texten.",
                                        "Falsch: Für Netzwerkverbindungen sorgt das Betriebssystem.",
                                        "Falsch: Ein Compiler dient rein der Code-Übersetzung."
                                },
                                "IHK Grundlagen der Programmierung & Compiler"
                        ),
                        new Question(
                                "q-go-1-2",
                                "Welche Funktion ist in einem eigenständigen Go-Programm der offizielle Startpunkt?",
                                new String[]{
                                        "func start()",
                                        "func main()",
                                        "func execute()",
                                        "func init_all()"
                                },
                                1,
                                new String[]{
                                        "Falsch: 'func start()' ist kein Standard-Einstiegspunkt in Go.",
                                        "Korrekt! 'func main()' im Paket 'main' ist der definierte Startpunkt jedes Go-Programms.",
                                        "Falsch: 'execute' existiert als Standard-Einstiegspunkt nicht.",
                                        "Falsch: Go kennt zwar optionale 'init()'-Funktionen, das eigentliche Programm startet jedoch immer in 'main()'."
                                },
                                "Go Sprachspezifikation & Programmaufbau"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "go-2",
                "2. Variablen & Datentypen (Speicher verstehen)",
                "Programme müssen sich Informationen merken können: den Namen eines Nutzers, einen Punktestand oder den Preis im Warenkorb. Stell dir eine Variable wie eine beschriftete Schachtel im Arbeitsspeicher deines Computers vor. In Go hat jede Schachtel einen festen Typ, damit nichts durcheinandergerät (Typensicherheit).",
                "Grundlegende Typen: 'string' (Text in Anführungszeichen), 'int' (Ganzzahlen wie 42, -5), 'float64' (Kommazahlen mit Punkt wie 3.14), 'bool' (Wahrheitswerte 'true' oder 'false'). In Go deklariert man Variablen mit 'var name Typ = Wert' oder innerhalb von Funktionen verkürzt mit dem Walross-Operator ':=' (z. B. 'alter := 25').",
                "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var username string = \"Jeremy\"\n    level := 1\n    xp := 150.5\n    isOnline := true\n\n    fmt.Printf(\"User: %s, Level: %d, XP: %.1f, Online: %t\\n\", username, level, xp, isOnline)\n}",
                Arrays.asList(
                        new Question(
                                "q-go-2-1",
                                "Welcher Datentyp speichert Wahrheitswerte (wahr oder falsch)?",
                                new String[]{"string", "int", "bool", "float64"},
                                2,
                                new String[]{
                                        "Falsch: 'string' speichert Text.",
                                        "Falsch: 'int' speichert Ganzzahlen.",
                                        "Korrekt! 'bool' (Boolean) speichert ausschließlich die Wahrheitswerte 'true' oder 'false'.",
                                        "Falsch: 'float64' speichert Fließkommazahlen."
                                },
                                "IHK Datentypen & Speicherallokation"
                        ),
                        new Question(
                                "q-go-2-2",
                                "Was bewirkt der Operator ':=' in Go?",
                                new String[]{
                                        "Er prüft, ob zwei Variablen denselben Wert haben.",
                                        "Er deklariert eine neue Variable und leitet ihren Typ automatisch aus dem Initialwert ab.",
                                        "Er löscht eine Variable aus dem RAM.",
                                        "Er wandelt Text in Zahlen um."
                                },
                                1,
                                new String[]{
                                        "Falsch: Den Gleichheitstest macht man mit '=='.",
                                        "Korrekt! Der Short-Variable-Declaration-Operator ':=' erstellt die Variable und erkennt den Typ automatisch (Type Inference).",
                                        "Falsch: Go besitzt einen automatischen Garbage Collector.",
                                        "Falsch: Typumwandlung erfolgt in Go explizit, z. B. 'int(wert)'."
                                },
                                "Go Syntax & Typinferenz"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "go-3",
                "3. Entscheidungen treffen mit if/else & Bedingungen",
                "Software wird erst intelligent, wenn sie auf unterschiedliche Situationen reagieren kann: 'Wenn der Akku unter 15 Prozent fällt, aktiviere den Energiesparmodus. Andernfalls lade normal weiter.' In der Informatik nennt man das Verzweigung oder Kontrollfluss.",
                "Mit 'if bedingung { ... } else { ... }' prüft Go logische Aussagen. Vergleichsoperatoren sind: '==' (ist gleich), '!=' (ungleich), '<' (kleiner), '>' (größer). Logische Verknüpfungen: '&&' (UND - beide müssen wahr sein), '||' (ODER - mindestens eins muss wahr sein). In Go werden Bedingungen ohne runde Klammern geschrieben.",
                "package main\n\nimport \"fmt\"\n\nfunc main() {\n    battery := 12\n\n    if battery < 15 {\n        fmt.Println(\"⚠️ Warnung: Akkustand kritisch! Energiesparmodus an.\")\n    } else if battery < 50 {\n        fmt.Println(\"Normaler Akkubetrieb.\")\n    } else {\n        fmt.Println(\"Akku voll geladen.\")\n    }\n}",
                Arrays.asList(
                        new Question(
                                "q-go-3-1",
                                "Welcher Operator prüft in Go, ob zwei Werte identisch sind?",
                                new String[]{"=", "==", "===", ":="},
                                1,
                                new String[]{
                                        "Falsch: Ein einfaches '=' ist der Zuweisungsoperator.",
                                        "Korrekt! Der doppelte Gleichheitsoperator '==' prüft zwei Werte auf Gleichheit.",
                                        "Falsch: '===' existiert in Go nicht (stammt aus JavaScript).",
                                        "Falsch: ':=' deklariert und initialisiert eine neue Variable."
                                },
                                "IHK Kontrollstrukturen & Logik"
                        ),
                        new Question(
                                "q-go-3-2",
                                "Wann wird der Block bei 'if a && b' ausgeführt?",
                                new String[]{
                                        "Wenn mindestens eine der beiden Variablen wahr ist.",
                                        "Nur wenn ausnahmslos BEIDE Variablen (a UND b) wahr sind.",
                                        "Wenn beide Variablen falsch sind.",
                                        "Immer, unabhängig von den Werten."
                                },
                                1,
                                new String[]{
                                        "Falsch: Das wäre der ODER-Operator '||'.",
                                        "Korrekt! Das logische UND '&&' erfordert, dass alle Teilausdrücke 'true' ergeben.",
                                        "Falsch: Wenn beide falsch sind, wird der if-Block übersprungen.",
                                        "Falsch: Bedingungen steuern die Ausführung strikt."
                                },
                                "Logische Operatoren & Boolesche Algebra"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "go-4",
                "4. Wiederholungen mit for-Schleifen & Funktionen",
                "Stell dir vor, du müsstest 10.000 Rechnungen einzeln von Hand ausdrucken. Computer sind perfekt dafür geeignet, dieselbe Aufgabe millionenfach ohne Ermüdung zu wiederholen. In Go gibt es dafür genau ein universelles Werkzeug: die 'for'-Schleife.",
                "Eine 'for'-Schleife wiederholt einen Codeblock, solange eine Bedingung erfüllt ist ('for i := 0; i < 5; i++'). Funktionen ('func') bündeln wiederverwendbare Logik: Sie nehmen Eingaben entgegen (Parameter), führen Berechnungen durch und geben Ergebnisse mit 'return' zurück.",
                "package main\n\nimport \"fmt\"\n\nfunc addiere(a int, b int) int {\n    return a + b\n}\n\nfunc main() {\n    for i := 1; i <= 3; i++ {\n        ergebnis := addiere(i, 10)\n        fmt.Printf(\"Schritt %d: Summe = %d\\n\", i, ergebnis)\n    }\n}",
                Arrays.asList(
                        new Question(
                                "q-go-4-1",
                                "Welche Schleifenarten stellt die Sprache Go zur Verfügung?",
                                new String[]{
                                        "for, while, do-while und repeat",
                                        "Ausschließlich for (für alle Schleifenarten)",
                                        "Nur while und foreach",
                                        "Gar keine Schleifen, nur Rekursion"
                                },
                                1,
                                new String[]{
                                        "Falsch: Go verzichtet bewusst auf 'while' und 'do-while', um die Sprache minimalistisch zu halten.",
                                        "Korrekt! In Go existiert nur das Schlüsselwort 'for'. Es deckt Zählschleifen, Bedingungsschleifen (while) und Endlosschleifen ab.",
                                        "Falsch: 'while' existiert in Go nicht.",
                                        "Falsch: Go bietet vollwertige for-Schleifen."
                                },
                                "IHK Algorithmen & Schleifenstrukturen"
                        ),
                        new Question(
                                "q-go-4-2",
                                "Wozu dient das Schlüsselwort 'return' in einer Funktion?",
                                new String[]{
                                        "Es startet den PC neu.",
                                        "Es beendet die Funktion und gibt den berechneten Wert an den Aufrufer zurück.",
                                        "Es springt an den Anfang der Funktion zurück.",
                                        "Es druckt Text auf dem Drucker aus."
                                },
                                1,
                                new String[]{
                                        "Falsch: 'return' steuert nur die Funktionsausführung.",
                                        "Korrekt! 'return' verlässt die Funktion sofort und übermittelt die deklarierten Rückgabewerte.",
                                        "Falsch: Das Zurückspringen an den Schleifenanfang macht 'continue'.",
                                        "Falsch: 'return' hat keinen Bezug zu Druckern."
                                },
                                "Funktionen & Modularisierung"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "go-5",
                "5. Structs & Gleichzeitigkeit (Goroutines & Channels)",
                "In der echten Welt bestehen Dinge aus mehreren Merkmalen: Ein Benutzer hat Name, E-Mail und Alter. Ein 'struct' in Go fasst diese Felder zusammen. Und wenn ein Server tausende Anfragen gleichzeitig bearbeiten muss, nutzt Go Goroutines – leichtgewichtige parallele Arbeiter.",
                "'type User struct { ... }' definiert ein eigenes Datenmodell. Mit dem Schlüsselwort 'go meineFunktion()' startet Go eine Goroutine, die nebenläufig arbeitet, ohne den Haupt-Thread zu blockieren. Über typisierte Channels ('make(chan string)') tauschen Goroutines sicher Daten aus ('ch <- wert' zum Senden, 'wert := <-ch' zum Empfangen).",
                "package main\n\nimport \"fmt\"\n\ntype ServerConfig struct {\n    Name string\n    Port int\n}\n\nfunc worker(ch chan string) {\n    ch <- \"Hintergrund-Aufgabe erfolgreich beendet!\"\n}\n\nfunc main() {\n    cfg := ServerConfig{Name: \"CloudServer\", Port: 8080}\n    fmt.Printf(\"Server %s auf Port %d\\n\", cfg.Name, cfg.Port)\n\n    ch := make(chan string)\n    go worker(ch)\n    msg := <-ch\n    fmt.Println(\"Empfangen:\", msg)\n}",
                Arrays.asList(
                        new Question(
                                "q-go-5-1",
                                "Mit welchem Schlüsselwort startet man in Go eine Funktion nebenläufig?",
                                new String[]{"async", "thread", "go", "parallel"},
                                2,
                                new String[]{
                                        "Falsch: 'async' stammt aus JavaScript/C#.",
                                        "Falsch: 'thread' ist kein Go-Schlüsselwort.",
                                        "Korrekt! Mit dem einfachen Präfix 'go funktion()' wird die Funktion als eigenständige Goroutine ausgeführt.",
                                        "Falsch: 'parallel' existiert in Go nicht."
                                },
                                "IHK Concurrency & Goroutines"
                        ),
                        new Question(
                                "q-go-5-2",
                                "Welcher Operator wird in Go genutzt, um Daten in einen Channel zu senden oder zu empfangen?",
                                new String[]{":=", "<-", "->", "=="},
                                1,
                                new String[]{
                                        "Falsch: ':=' dient der Variablendeklaration.",
                                        "Korrekt! Der Pfeil-Operator '<-' steuert die Datenrichtung: 'ch <- val' sendet, 'val := <-ch' empfängt.",
                                        "Falsch: '->' existiert in Go nicht.",
                                        "Falsch: '==' ist der Gleichheitsvergleich."
                                },
                                "Go Channel-Architektur & CSP"
                        )
                )
        ));

        return new Course("go", "Go (Golang)", "🐹", "High-Performance Cloud", "Systemnahe Entwicklung, Datentypen, Goroutines & Channels.", lessons);
    }
}
