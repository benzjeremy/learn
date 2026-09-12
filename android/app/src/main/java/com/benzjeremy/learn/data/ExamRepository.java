package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ExamRepository {
    private static final List<Question> EXAM_QUESTIONS = new ArrayList<>();

    static {
        initExamQuestions();
    }

    public static List<Question> getExamQuestions() {
        return Collections.unmodifiableList(EXAM_QUESTIONS);
    }

    private static void initExamQuestions() {
        EXAM_QUESTIONS.add(new Question(
                "ex-1",
                "Welches der folgenden Protokolle bietet authentifizierte Verschlüsselung (AEAD) auf Blockchiffre-Ebene?",
                new String[]{"AES-256-ECB", "AES-256-CBC", "AES-256-GCM", "DES"},
                2,
                new String[]{
                        "ECB ist extrem unsicher, da identische Klartextblöcke in identische Chiffreblöcke transformiert werden (Electronic Codebook Pengiun).",
                        "CBC verschlüsselt, bietet jedoch keine native Integritäts- und Authentizitätsprüfung (anfällig für Padding-Oracle-Angriffe ohne HMAC).",
                        "Korrekt! Galois/Counter Mode (GCM) kombiniert Vertraulichkeit und Integritätssicherung (AEAD) bei hoher Hardware-Effizienz.",
                        "DES verwendet nur 56 Bit Schlüssellänge und ist seit Jahrzehnten kryptografisch gebrochen."
                },
                "Kryptografie & Netzwerksicherheit"
        ));

        EXAM_QUESTIONS.add(new Question(
                "ex-2",
                "Was besagt das Isolation-Level 'Serializable' im ACID-Modell von relationalen Datenbanken?",
                new String[]{
                        "Transaktionen werden garantiert parallel ohne jegliche Sperren ausgeführt.",
                        "Transaktionen werden so ausgeführt, als ob sie nacheinander in einer seriellen Reihenfolge ablaufen würden (verhindert Dirty Reads, Non-Repeatable Reads und Phantom Reads).",
                        "Alle Daten werden automatisch als JSON auf die Festplatte geschrieben.",
                        "Transaktionen können jederzeit Daten anderer unbestätigter Transaktionen lesen."
                },
                1,
                new String[]{
                        "Falsch: Serializable erfordert oft strenge Sperren oder MVCC-Prüfungen zur Vermeidung von Konflikten.",
                        "Korrekt! Serializable ist das höchste Isolationslevel und schließt alle Leseanomalien mathematisch aus.",
                        "Falsch: Serialisierbarkeit bezieht sich auf die Transaktionsabfolge, nicht auf Dateiformate.",
                        "Falsch: Das Lesen unbestätigter Änderungen nennt man 'Dirty Read' (unter Read Uncommitted)."
                },
                "Datenbanktransaktionen & ACID"
        ));

        EXAM_QUESTIONS.add(new Question(
                "ex-3",
                "Wie verhält sich eine unbuffered (ungespufferte) Channel-Kommunikation in Go?",
                new String[]{
                        "Der Sender schreibt den Wert in einen unendlichen Puffer und läuft sofort weiter.",
                        "Sender und Empfänger blockieren, bis beide Seiten zur Übergabe bereit sind (Rendezvous-Semantik).",
                        "Der Channel speichert standardmäßig 10 Einträge im Ringpuffer.",
                        "Unbuffered Channels können nur von einer einzigen Goroutine gelesen werden."
                },
                1,
                new String[]{
                        "Falsch: Ein unbuffered Channel besitzt Puffergröße 0.",
                        "Korrekt! Ungespufferte Channels synchronisieren beide Goroutines exakt im Moment der Datenübergabe (Rendezvous).",
                        "Falsch: Puffergrößen müssen mit make(chan T, size) explizit deklariert werden.",
                        "Falsch: Beliebig viele Goroutines können auf einen Channel zugreifen."
                },
                "Nebenläufigkeit & Concurrency"
        ));

        EXAM_QUESTIONS.add(new Question(
                "ex-4",
                "Welcher HTTP-Header verhindert, dass eine Website in einem fremden <frame> oder <iframe> eingebunden wird (Clickjacking-Schutz)?",
                new String[]{
                        "X-Frame-Options: DENY / Content-Security-Policy: frame-ancestors 'none'",
                        "Access-Control-Allow-Origin: *",
                        "Cache-Control: no-cache",
                        "Strict-Transport-Security: max-age=31536000"
                },
                0,
                new String[]{
                        "Korrekt! X-Frame-Options: DENY oder modern CSP frame-ancestors 'none' verbieten das Einbetten in Frames und unterbinden Clickjacking.",
                        "Falsch: CORS (Access-Control-Allow-Origin) regelt clientseitige AJAX/Fetch-Zugriffe, schützt aber nicht vor Frame-Embedding.",
                        "Falsch: Cache-Control steuert das Caching im Browser.",
                        "Falsch: HSTS erzwingt HTTPS-Verbindungen."
                },
                "Websicherheit & OWASP Top 10"
        ));

        EXAM_QUESTIONS.add(new Question(
                "ex-5",
                "Was ist der primäre Vorteil von Prepared Statements mit gebundenen Parametern gegenüber String-Konkatenation in SQL?",
                new String[]{
                        "Die SQL-Abfrage wird schneller kompiliert, schützt jedoch nicht vor Injection.",
                        "SQL-Logik und Datenwerte werden strikt getrennt an den Datenbankserver übertragen; Parameter können den Parse-Tree niemals verändern (vollständiger SQL-Injection Schutz).",
                        "Tabellen werden automatisch in die 3. Normalform konvertiert.",
                        "Die Abfrage benötigt keine Primärschlüssel."
                },
                1,
                new String[]{
                        "Falsch: Prepared Statements sind gerade wegen des Sicherheitsgewinns Industriestandard.",
                        "Korrekt! Da der SQL-Parser das Abfragegerüst vor Einsetzen der Parameter analysiert, werden Eingaben niemals als Befehlscode interpretiert.",
                        "Falsch: Normalisierung ist ein Schemaentwurf, keine SQL-Syntax.",
                        "Falsch: Primärschlüssel sind unabhängig von Abfragetechniken."
                },
                "Datenbanksicherheit & Injection-Defense"
        ));
    }
}
