package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PythonCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "py-1",
                "1. Allererste Schritte mit Python: Variablen & print()",
                "Python ist die weltweit beliebteste Sprache für Programmieranfänger, Data Science und Automatisierung. Warum? Weil Python-Code fast so leicht zu lesen ist wie normales Englisch! Man muss keine kryptischen Sonderzeichen lernen, um erste Ergebnisse zu sehen.",
                "In Python benötigt man keine Klassen oder komplizierte Boilerplates: 'print(\"Hallo Welt!\")' gibt sofort Text auf dem Bildschirm aus. Variablen werden ohne Typangabe einfach zugewiesen: 'name = \"Jeremy\"' oder 'punkte = 100'. Python erkennt den Datentyp automatisch (dynamische Typisierung). Kommentare beginnen mit '#'.",
                "# Mein erstes Python-Programm\nspieler_name = \"Jeremy\"\npunktzahl = 100\nmultiplikator = 1.5\n\ngesamt = punktzahl * multiplikator\nprint(f\"Spieler {spieler_name} hat {gesamt} Punkte erzielt!\")",
                Arrays.asList(
                        new Question(
                                "q-py-1-1",
                                "Wie werden einzeilige Kommentare in Python eingeleitet?",
                                new String[]{"//", "/*", "#", "--"},
                                2,
                                new String[]{
                                        "Falsch: '//' stammt aus C++, Java und Go.",
                                        "Falsch: '/*' leitet mehrzeilige Kommentare in C/Java ein.",
                                        "Korrekt! In Python beginnt ein Kommentar mit dem Rautezeichen '#'.",
                                        "Falsch: '--' ist der Kommentar-Operator in SQL."
                                },
                                "Python Syntax & PEP 8 Standards"
                        ),
                        new Question(
                                "q-py-1-2",
                                "Mit welchem Befehl gibt man Text in Python auf der Konsole aus?",
                                new String[]{"echo()", "Console.Write()", "print()", "System.out()"},
                                2,
                                new String[]{
                                        "Falsch: 'echo' stammt aus PHP und Bash.",
                                        "Falsch: 'Console.Write' gehört zu C#.",
                                        "Korrekt! 'print()' ist die standardmäßige Ausgabefunktion in Python.",
                                        "Falsch: 'System.out.println' wird in Java verwendet."
                                },
                                "IHK Grundlagen Python I/O"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "py-2",
                "2. Entscheidungen & Einrückungen: if, elif, else",
                "In den meisten Programmiersprachen nutzt man geschweifte Klammern '{}', um Codeblöcke zu definieren. Python hat eine geniale Besonderheit: Einrückungen (Indentation) mit Leerzeichen sind Teil der Grammatik! Das zwingt jeden Entwickler automatisch zu sauberem, lesbarem Code.",
                "Mit 'if bedingung:' prüft Python eine Aussage. Trifft sie nicht zu, kann mit 'elif andere_bedingung:' weitergeprüft werden. Für den Ausweichfall nutzt man 'else:'. Alles, was nach dem Doppelpunkt um 4 Leerzeichen eingerückt ist, gehört zu diesem Block. Logische Operatoren: 'and', 'or', 'not'.",
                "alter = 17\n\nif alter >= 18:\n    print(\"Zugang gewährt: Volljährig.\")\nelif alter >= 16:\n    print(\"Eingeschränkter Zugang ab 16 Jahren.\")\nelse:\n    print(\"Zugang verwehrt: Zu jung.\")",
                Arrays.asList(
                        new Question(
                                "q-py-2-1",
                                "Wie werden Codeblöcke (z. B. innerhalb einer if-Abfrage) in Python strukturiert?",
                                new String[]{
                                        "Durch geschweifte Klammern { }",
                                        "Durch einheitliche Einrückung (Indentation) nach einem Doppelpunkt",
                                        "Durch BEGIN und END Schlüsselwörter",
                                        "Durch Semikolons am Zeilenende"
                                },
                                1,
                                new String[]{
                                        "Falsch: Python nutzt keine geschweiften Klammern für Kontrollstrukturen.",
                                        "Korrekt! In Python ist Whitespace semantisch: Die Einrückung bestimmt die Blockzugehörigkeit.",
                                        "Falsch: Das stammt aus Pascal/SQL.",
                                        "Falsch: Python benötigt keine Semikolons."
                                },
                                "IHK Kontrollfluss & Einrückungskonventionen"
                        ),
                        new Question(
                                "q-py-2-2",
                                "Welches Schlüsselwort bedeutet in Python 'sonst wenn'?",
                                new String[]{"else if", "elseif", "elif", "case"},
                                2,
                                new String[]{
                                        "Falsch: 'else if' führt in Python zu einem Syntaxfehler.",
                                        "Falsch: 'elseif' stammt aus PHP.",
                                        "Korrekt! Python zieht 'else if' zu dem prägnanten Schlüsselwort 'elif' zusammen.",
                                        "Falsch: 'case' gehört zu Match-Statements."
                                },
                                "Python Schlüsselwörter"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "py-3",
                "3. Sammlungen: Listen & Dictionaries",
                "In einem Programm möchtest du nicht für jeden Artikel im Warenkorb eine eigene Variable 'artikel1', 'artikel2', 'artikel3' anlegen. Du benötigst dynamische Datenstrukturen, die beliebig viele Elemente speichern können.",
                "Listen ('list'): Geordnete Sammlungen in eckigen Klammern: 'fruechte = [\"Apfel\", \"Banane\", \"Mango\"]'. Das erste Element hat immer den Index 0 ('fruechte[0]'). Mit '.append()' hängt man neue Daten an. Dictionaries ('dict'): Schlüssel-Wert-Speicher in geschweiften Klammern: 'user = {\"name\": \"Jeremy\", \"rolle\": \"Admin\"}'. Zugriff erfolgt über den Schlüssel: 'user[\"rolle\"]'.",
                "warenkorb = [\"Tastatur\", \"Maus\"]\nwarenkorb.append(\"Monitor\")\n\npreise = {\n    \"Tastatur\": 49.99,\n    \"Maus\": 29.99,\n    \"Monitor\": 199.99\n}\n\nprint(\"Erster Artikel:\", warenkorb[0])\nprint(\"Preis des Monitors:\", preise[\"Monitor\"], \"€\")",
                Arrays.asList(
                        new Question(
                                "q-py-3-1",
                                "Welchen Index hat das allererste Element einer Liste in Python?",
                                new String[]{"Index 1", "Index 0", "Index -1", "Index null"},
                                1,
                                new String[]{
                                        "Falsch: Die meisten Programmiersprachen indizieren ab 0.",
                                        "Korrekt! Python nutzt Zero-Based Indexing, das erste Element liegt bei Index 0.",
                                        "Falsch: Index -1 greift auf das allerletzte Element der Liste zu.",
                                        "Falsch: 'null' existiert als Index nicht."
                                },
                                "IHK Datenstrukturen: Listen & Indexierung"
                        ),
                        new Question(
                                "q-py-3-2",
                                "Wie greift man in einem Dictionary 'user = {\"email\": \"test@test.de\"}' auf die E-Mail zu?",
                                new String[]{"user.get_all()", "user[\"email\"]", "user(0)", "user->email"},
                                1,
                                new String[]{
                                        "Falsch: Das gibt nicht den spezifischen Wert zurück.",
                                        "Korrekt! Über die eckigen Klammern und den Schlüsselnamen greift man auf Werte im Dictionary zu.",
                                        "Falsch: Runde Klammern rufen Funktionen auf.",
                                        "Falsch: Der Pfeil-Operator existiert in Python nicht."
                                },
                                "Python Dictionaries & Key-Value Lookup"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "py-4",
                "4. Schleifen (for / while) & Eigene Funktionen (def)",
                "Programmierer vermeiden Wiederholungen nach dem DRY-Prinzip ('Don't Repeat Yourself'). Wenn du denselben Rechenschritt an fünf verschiedenen Stellen brauchst, schreibst du eine eigene Funktion und rufst sie einfach auf.",
                "Schleifen: 'for element in liste:' durchläuft jedes Element nacheinander. 'range(5)' erzeugt eine Zahlenfolge von 0 bis 4. Funktionen: Werden mit dem Schlüsselwort 'def name(parameter):' deklariert. Mit 'return' gibt die Funktion ihr berechnetes Ergebnis an den Aufrufer zurück.",
                "def berechne_rabatt(preis, prozent):\n    ersparnis = preis * (prozent / 100)\n    return preis - ersparnis\n\npreise = [100.0, 50.0, 20.0]\nfor p in preise:\n    endpreis = berechne_rabatt(p, 20)\n    print(f\"{p}€ mit 20% Rabatt = {endpreis:.2f}€\")",
                Arrays.asList(
                        new Question(
                                "q-py-4-1",
                                "Mit welchem Schlüsselwort definiert man eine eigene Funktion in Python?",
                                new String[]{"function", "func", "def", "method"},
                                2,
                                new String[]{
                                        "Falsch: 'function' gehört zu JavaScript und PHP.",
                                        "Falsch: 'func' wird in Go verwendet.",
                                        "Korrekt! 'def' (kurz für define) leitet die Funktionsdefinition in Python ein.",
                                        "Falsch: 'method' ist kein Schlüsselwort in Python."
                                },
                                "IHK Modularisierung & Funktionen"
                        ),
                        new Question(
                                "q-py-4-2",
                                "Welche Zahlenfolge generiert 'range(3)' in einer for-Schleife?",
                                new String[]{"1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3, 2, 1"},
                                1,
                                new String[]{
                                        "Falsch: 'range(3)' beginnt standardmäßig bei 0.",
                                        "Korrekt! 'range(n)' startet bei 0 und stoppt exakt vor n (also 0, 1, 2).",
                                        "Falsch: Die Obergrenze n ist exklusiv.",
                                        "Falsch: Standardmäßig zählt range aufsteigend."
                                },
                                "Python Iteratoren & Range"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "py-5",
                "5. Fehler abfangen (try/except) & Generatoren (yield)",
                "Was passiert, wenn ein Nutzer statt einer Zahl ein Wort eintippt oder eine Datei nicht existiert? Ein unvorbereitetes Programm stürzt sofort mit einem Fehler ab. Professionelle Software fängt Probleme elegant ab, ohne zu crashen.",
                "Mit 'try:' führst du potenziell fehlerhaften Code aus. Mit 'except FehlerTyp:' fängst du die Exception sauber ab. Für speichereffiziente Datenverarbeitung nutzt man Generatoren mit 'yield': Statt Millionen Datensätze auf einmal in den RAM zu laden, berechnet ein Generator Elemente faul (lazy) einzeln bei Bedarf.",
                "eingabe = \"keine_zahl\"\ntry:\n    zahl = int(eingabe)\n    print(\"Ergebnis:\", zahl)\nexcept ValueError:\n    print(\"⚠️ Bitte gib eine gültige Ganzzahl ein!\")\n\n# Generator für minimale Speichernutzung\ndef quadrat_stream(n):\n    for i in range(n):\n        yield i * i",
                Arrays.asList(
                        new Question(
                                "q-py-5-1",
                                "Wozu dient die 'try ... except' Anweisung in Python?",
                                new String[]{
                                        "Zum Abfangen und Behandeln von Laufzeitfehlern (Exceptions), damit das Programm stabil weiterläuft.",
                                        "Zum Beschleunigen von Grafikkarten.",
                                        "Zum Verschlüsseln von Passwörtern.",
                                        "Zum Formatieren von Festplatten."
                                },
                                0,
                                new String[]{
                                        "Korrekt! Exceptions werden im try-Block überwacht und im except-Block kontrolliert behandelt.",
                                        "Falsch: Es hat keinen Bezug zu Grafikbeschleunigung.",
                                        "Falsch: Exception Handling dient nicht der Verschlüsselung.",
                                        "Falsch: Try/Except formatiert keine Datenträger."
                                },
                                "IHK Ausnahmebehandlung & Robustheit"
                        ),
                        new Question(
                                "q-py-5-2",
                                "Was ist der entscheidende Speichervorteil von 'yield' gegenüber 'return' in einer Funktion?",
                                new String[]{
                                        "yield speichert Daten dauerhaft auf einer Festplatte.",
                                        "yield generiert Elemente einzeln nach Bedarf (Lazy Evaluation) und benötigt O(1) statt O(N) Arbeitsspeicher.",
                                        "yield schaltet den Global Interpreter Lock (GIL) ab.",
                                        "yield verhindert das Beenden des Computers."
                                },
                                1,
                                new String[]{
                                        "Falsch: yield arbeitet ausschließlich im flüchtigen RAM.",
                                        "Korrekt! Mit yield erzeugte Generatoren halten nur das aktuelle Element im RAM, was riesige Datenmengen ohne Speicherüberlauf ermöglicht.",
                                        "Falsch: Der GIL regelt Threading und ist davon unabhängig.",
                                        "Falsch: yield betrifft nur die Funktionsausführung."
                                },
                                "Algorithmen & Speicherkomplexität"
                        )
                )
        ));

        return new Course("python", "Python Engineering", "🐍", "Data & Automation", "Syntax, Kontrollfluss, Listen/Dicts, Funktionen, Exceptions & Generatoren.", lessons);
    }
}
