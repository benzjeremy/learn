package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.CodeChallenge;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CodeLabRepository {
    private static final List<CodeChallenge> CHALLENGES = new ArrayList<>();

    static {
        initChallenges();
    }

    public static List<CodeChallenge> getChallenges() {
        return Collections.unmodifiableList(CHALLENGES);
    }

    private static void initChallenges() {
        CHALLENGES.add(new CodeChallenge(
                "lab-go-1",
                "Deadlock in Go-Channel beheben",
                "Go (Golang)",
                "Aufgabe: Der folgende Code erzeugt einen fatalen Deadlock ('all goroutines are asleep - deadlock!'), weil in einen ungespufferten Channel geschrieben wird, ohne dass zeitgleich ein Empfänger bereitsteht. Korrigiere die Channel-Initialisierung mit einem Puffer von mindestens 1 Element oder starte eine Goroutine.",
                "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // FEHLER: unbuffered Channel blockiert main-Thread\n    ch := make(chan string)\n    ch <- \"Hello Go Concurrency\"\n    fmt.Println(<-ch)\n}",
                "make(chan string, 1)",
                "Tipp: Nutze make(chan string, 1) für einen gepufferten Channel mit Kapazität 1.",
                "Hello Go Concurrency\n[Process completed successfully with exit code 0]"
        ));

        CHALLENGES.add(new CodeChallenge(
                "lab-sec-1",
                "SQL-Injection zu Prepared Statement refaktorisieren",
                "Cybersecurity / SQL",
                "Aufgabe: Dieser Code baut die SQL-Abfrage unsicher per String-Konkatenation zusammen und ist verwundbar für ' OR '1'='1. Ersetze die Konkatenation durch den sicheren Parameter-Platzhalter '?' mit Parameter-Binding.",
                "// UNSICHER: String-Konkatenation\nquery := \"SELECT * FROM users WHERE email = '\" + userInput + \"'\"\nrows, err := db.Query(query)",
                "db.Query(\"SELECT * FROM users WHERE email = ?\", userInput)",
                "Tipp: Nutze Platzhalter '?' in der Abfrage und übergib die Variable getrennt als Argument an db.Query().",
                "[SECURITY AUDIT PASSED: Query parameterized. SQL injection surface eliminated.]"
        ));

        CHALLENGES.add(new CodeChallenge(
                "lab-py-1",
                "Speicherhungrige Schleife zu Generator (yield) wandeln",
                "Python",
                "Aufgabe: Wandle die speicherintensive Funktion, die eine riesige Liste mit 1.000.000 quadrierten Zahlen im RAM alloziiert, in einen speichereffizienten Generator mit 'yield' um.",
                "# INEFFIZIENT: Alloziiert O(N) RAM\ndef square_numbers(n):\n    result = []\n    for i in range(n):\n        result.append(i * i)\n    return result",
                "def square_numbers(n):\n    for i in range(n):\n        yield i * i",
                "Tipp: Entferne die Liste result = [] und ersetze result.append(...) durch yield i * i.",
                "[MEMORY AUDIT: RAM consumption reduced from 42.8 MB to 120 Bytes (O(1) Lazy Evaluation).]"
        ));
    }
}
