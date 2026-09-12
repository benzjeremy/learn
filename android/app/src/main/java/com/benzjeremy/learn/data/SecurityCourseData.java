package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SecurityCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "sec-1",
                "1. Grundlagen der IT-Sicherheit: Das CIA-Triad",
                "Warum ist Cybersecurity überlebenswichtig? Wenn du dich beim Online-Banking oder in sozialen Medien anmeldest, möchtest du drei Dinge: Niemand darf dein Passwort mitlesen, niemand darf deine Überweisung fälschen und das System muss zuverlässig erreichbar sein.",
                "In der IT-Sicherheit wird dies durch das Schutzziele-Dreieck (CIA-Triad) definiert: 1. Confidentiality (Vertraulichkeit): Nur Berechtigte dürfen Daten lesen. 2. Integrity (Integrität): Daten dürfen unterwegs nicht unbemerkt verändert werden. 3. Availability (Verfügbarkeit): Systeme müssen gegen Ausfälle geschützt sein.",
                "// CIA-Triad in der Praxis:\n// [C] Vertraulichkeit: Verschlüsselung (z.B. AES-256-GCM)\n// [I] Integrität: Kryptografische Hashes & Signaturen (SHA-256)\n// [A] Verfügbarkeit: DoS-Schutz, Redundanz & Backups",
                Arrays.asList(
                        new Question(
                                "q-sec-1-1",
                                "Welches Schutzziel stellt sicher, dass Daten bei der Übertragung nicht heimlich manipuliert wurden?",
                                new String[]{"Integrität (Integrity)", "Verfügbarkeit (Availability)", "Anonymität", "Effizienz"},
                                0,
                                new String[]{
                                        "Korrekt! Integrität garantiert die Korrektheit und Unverfälschtheit von Daten.",
                                        "Falsch: Verfügbarkeit stellt sicher, dass Systeme erreichbar sind.",
                                        "Falsch: Anonymität ist ein Datenschutzaspekt, aber nicht das Schutzziel gegen Manipulation.",
                                        "Falsch: Effizienz betrifft die Leistung, nicht die Manipulationssicherheit."
                                },
                                "IHK IT-Sicherheitsgrundlagen (BSI)"
                        ),
                        new Question(
                                "q-sec-1-2",
                                "Was versteht man unter 'Vertraulichkeit' (Confidentiality)?",
                                new String[]{
                                        "Dass der Server niemals neu gestartet werden darf.",
                                        "Dass unbefugte Dritte keinen Einblick in sensible Daten erhalten.",
                                        "Dass jeder Mitarbeiter Zugriff auf alle Passwörter hat.",
                                        "Dass Daten nach 30 Tagen automatisch gelöscht werden."
                                },
                                1,
                                new String[]{
                                        "Falsch: Server-Neustarts betreffen die Administration.",
                                        "Korrekt! Vertraulichkeit schützt Daten durch Verschlüsselung und Zugriffsrechte vor unbefugter Einsicht.",
                                        "Falsch: Das widerspricht dem Least-Privilege-Prinzip fundamental.",
                                        "Falsch: Aufbewahrungsfristen sind gesetzliche Vorgaben."
                                },
                                "BSI IT-Grundschutz & Schutzbedarfsanalyse"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "sec-2",
                "2. Verschlüsselung: Symmetrisch vs. Asymmetrisch",
                "Stell dir vor, du möchtest deinem Freund einen geheimen Brief schicken. Wie stellst du sicher, dass der Postbote ihn nicht lesen kann? Du sperrst ihn in eine Kiste. Doch wie bekommt dein Freund den Schlüssel, wenn der Postbote auch den Schlüssel abfangen könnte?",
                "Symmetrische Verschlüsselung (z. B. AES-256): Derselbe Schlüssel sperrt zu und auf. Extrem schnell, aber der Schlüsselaustausch ist riskant. Asymmetrische Verschlüsselung (z. B. RSA, ECC): Es gibt ZWEI Schlüssel: Einen öffentlichen (Public Key, den jeder sehen darf) zum Zuschließen, und einen privaten (Private Key, den nur der Empfänger besitzt) zum Aufsperren.",
                "// Symmetrisch (AES):\n// Klartext + Geheimer_Schlüssel -> Geheimtext\n// Geheimtext + Geheimer_Schlüssel -> Klartext\n\n// Asymmetrisch (Public/Private Key):\n// Klartext + Public_Key_Empfänger -> Geheimtext\n// Geheimtext + Private_Key_Empfänger -> Klartext",
                Arrays.asList(
                        new Question(
                                "q-sec-2-1",
                                "Welcher Schlüssel wird bei asymmetrischer Verschlüsselung zum Entschlüsseln genutzt?",
                                new String[]{
                                        "Der öffentliche Schlüssel des Senders.",
                                        "Der private Schlüssel des Empfängers.",
                                        "Der öffentliche Schlüssel des Empfängers.",
                                        "Ein zufälliges Passwort des Providers."
                                },
                                1,
                                new String[]{
                                        "Falsch: Mit dem Public Key kann man nur verschlüsseln, nicht entschlüsseln.",
                                        "Korrekt! Nur der private Schlüssel (Private Key) des rechtmäßigen Empfängers kann die Nachricht wieder lesbar machen.",
                                        "Falsch: Der öffentliche Schlüssel dient dem Sender zum Verschlüsseln.",
                                        "Falsch: Asymmetrische Kryptografie basiert auf mathematischen Schlüsselpaaren."
                                },
                                "Kryptografie & Schlüsselmanagement"
                        ),
                        new Question(
                                "q-sec-2-2",
                                "Welcher Standard wird weltweit für hocheffiziente symmetrische Verschlüsselung eingesetzt?",
                                new String[]{"AES-256", "MD5", "Base64", "HTML5"},
                                0,
                                new String[]{
                                        "Korrekt! AES (Advanced Encryption Standard) mit 256 Bit Schlüssellänge ist der globale Standard für symmetrische Verschlüsselung.",
                                        "Falsch: MD5 ist eine veraltete, unsichere Hashfunktion, keine Verschlüsselung.",
                                        "Falsch: Base64 ist eine Zeichenkodierung, absolut keine Verschlüsselung.",
                                        "Falsch: HTML5 ist eine Web-Auszeichnungssprache."
                                },
                                "IHK Symmetrische Verschlüsselungsverfahren"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "sec-3",
                "3. Passwörter & Hashing (Warum Klartext verboten ist)",
                "Jeden Monat werden Datenbanken großer Webseiten gestohlen. Wenn ein Angreifer eine Datenbank knackt, in der Passwörter im Klartext oder mit schnellen Algorithmen wie SHA-256 gespeichert sind, kennt der Angreifer sofort alle Zugänge.",
                "Ein kryptografischer Hash ist eine unumkehrbare Einwegfunktion: Aus 'Geheim123' wird ein fixer Prüfwert, den man nicht zurückrechnen kann. Ein zufälliger Zusatztext ('Salt') verhindert Angriffe über vorberechnete Tabellen (Rainbow Tables). Moderne KDFs wie PBKDF2 (min. 100.000 Runden) oder Argon2id zwingen Angreifer zu gigantischem Rechenaufwand.",
                "// Pseudocode für sicheres Password-Hashing:\nsalt = generate_secure_random(32); // 32 Bytes Zufall\nhash = pbkdf2_argon2id(password, salt, iterations=100000);\n// In der Datenbank wird gespeichert:\n// salt + hash",
                Arrays.asList(
                        new Question(
                                "q-sec-3-1",
                                "Warum ist der Algorithmus SHA-256 alleine ungeeignet zum Speichern von Benutzerpasswörtern?",
                                new String[]{
                                        "Weil moderne Grafikkarten (GPUs) Milliarden SHA-256 Hashes pro Sekunde berechnen und Passwörter so per Brute-Force erraten können.",
                                        "Weil SHA-256 nur auf Apple-Computern funktioniert.",
                                        "Weil SHA-256 Passwörter automatisch an Dritte weiterleitet.",
                                        "Weil SHA-256 keine Umlaute verarbeiten kann."
                                },
                                0,
                                new String[]{
                                        "Korrekt! SHA-256 ist für schnelle Integritätsprüfungen optimiert. Für Passwörter benötigt man bewusst verlangsamte KDFs wie Argon2id, bcrypt oder PBKDF2.",
                                        "Falsch: SHA-256 ist plattformunabhängig.",
                                        "Falsch: Hashes leiten keine Daten weiter.",
                                        "Falsch: Hashes arbeiten auf Byte-Ebene unabhängig von Umlauten."
                                },
                                "IHK Passwortsicherheit & Hashfunktionen"
                        ),
                        new Question(
                                "q-sec-3-2",
                                "Was ist die Funktion eines 'Salts' beim Password-Hashing?",
                                new String[]{
                                        "Er beschleunigt den Hashvorgang.",
                                        "Er fügt dem Passwort zufällige Zeichen hinzu, damit identische Passwörter unterschiedliche Hashes erhalten und Rainbow Tables wirkungslos werden.",
                                        "Er speichert das Passwort auf einem USB-Stick.",
                                        "Er ersetzt das Passwort durch eine Zufallszahl."
                                },
                                1,
                                new String[]{
                                        "Falsch: Das Gegenteil ist der Fall, ein Salt soll Angreifer verlangsamen.",
                                        "Korrekt! Ein Salt stellt sicher, dass zwei Nutzer mit demselben Passwort völlig unterschiedliche Hashwerte besitzen.",
                                        "Falsch: Salts werden direkt in der Datenbank neben dem Hash abgelegt.",
                                        "Falsch: Der Salt modifiziert die Eingabe der Hashfunktion."
                                },
                                "Rainbow-Table Defense & Salting"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "sec-4",
                "4. Web-Sicherheitsrisiken: OWASP Top 10 (SQL-Injection & XSS)",
                "Die gefährlichsten Schwachstellen im Internet entstehen nicht durch Hacker-Magie, sondern durch Programmierfehler: Wenn Entwickler Benutzereingaben ungeprüft in die Datenbank einbetten oder im Browser anderer Nutzer anzeigen.",
                "SQL-Injection (SQLi): Ein Angreifer gibt im Login-Feld \"' OR '1'='1\" ein. Ohne Schutz wird die SQL-Abfrage manipuliert und der Angreifer als Admin eingeloggt. Schutz: Prepared Statements mit Parametern! Cross-Site Scripting (XSS): Ein Angreifer speichert bösartiges JavaScript in einem Kommentar. Beim Aufruf durch andere Nutzer stiehlt das Skript deren Session-Cookies. Schutz: Konsequentes HTML-Escaping.",
                "// UNSICHER (SQL-Injection!):\nquery = \"SELECT * FROM users WHERE email = '\" + userInput + \"'\";\n\n// SICHER (Prepared Statement mit Platzhaltern):\nstmt = db.prepare(\"SELECT * FROM users WHERE email = ?\");\nstmt.bind(1, userInput);",
                Arrays.asList(
                        new Question(
                                "q-sec-4-1",
                                "Wie schützt man eine Anwendung zuverlässig gegen SQL-Injection-Angriffe?",
                                new String[]{
                                        "Durch Prepared Statements mit parametrisierten Queries.",
                                        "Indem man Passwörter in Großbuchstaben erzwingt.",
                                        "Durch Abschalten der Datenbank nachts.",
                                        "Indem man SQL durch Microsoft Excel ersetzt."
                                },
                                0,
                                new String[]{
                                        "Korrekt! Prepared Statements trennen den SQL-Befehl strikt von den Benutzereingaben, sodass Eingaben niemals als Code ausgeführt werden können.",
                                        "Falsch: Großbuchstaben ändern nichts an der SQL-Syntax.",
                                        "Falsch: Nachts abschalten schützt tagsüber überhaupt nicht.",
                                        "Falsch: Excel ist keine sichere Datenbanklösung."
                                },
                                "OWASP Top 10: Injection Defense"
                        ),
                        new Question(
                                "q-sec-4-2",
                                "Was passiert bei einem Cross-Site Scripting (XSS) Angriff?",
                                new String[]{
                                        "Der Strom im Rechenzentrum fällt aus.",
                                        "Schädlicher JavaScript-Code wird im Browser anderer Nutzer ausgeführt, um z.B. Anmelde-Tokens zu stehlen.",
                                        "Die Festplatte des Webservers wird formatiert.",
                                        "Die Tastatur des Nutzers wird gesperrt."
                                },
                                1,
                                new String[]{
                                        "Falsch: XSS greift Web-Clients an, keine Hardware.",
                                        "Korrekt! XSS injiziert Client-Code in fremde Browsersitzungen, meist zur Entführung von Authentifizierungs-Cookies.",
                                        "Falsch: Server-Dateisysteme sind von XSS nicht direkt betroffen.",
                                        "Falsch: Tastatursperren sind kein typisches XSS-Szenario."
                                },
                                "OWASP Top 10: Cross-Site Scripting"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "sec-5",
                "5. Netzwerksicherheit: HTTPS, TLS & Zero-Trust",
                "Wenn du in einem öffentlichen Café-WLAN surfst, könnte theoretisch jeder im selben Raum deine Daten mitlesen. Warum ist das bei seriösen Webseiten trotzdem unmöglich? Dank HTTPS und dem Prinzip 'Zero-Trust'.",
                "HTTPS verschlüsselt die gesamte Kommunikation zwischen Browser und Server mittels TLS (Transport Layer Security). Digitale Zertifikate, ausgestellt von vertrauenswürdigen Zertifizierungsstellen (CAs), belegen die echte Identität der Gegenstelle. Das Zero-Trust-Modell besagt: 'Never trust, always verify' – traue keinem internen oder externen Netzwerk blind!",
                "Client                         Server\n  | --- ClientHello (TLS 1.3) ---> |\n  | <-- ServerHello + Zertifikat - |\n  | (Prüft Zertifikat & Handshake) |\n  | === Vollständig verschlüsselt (AES-GCM) === |",
                Arrays.asList(
                        new Question(
                                "q-sec-5-1",
                                "Wofür steht das 'S' in HTTPS?",
                                new String[]{"Server", "Standard", "Secure (gesichert mit TLS/SSL)", "Speed"},
                                2,
                                new String[]{
                                        "Falsch: HTTP steht für Hypertext Transfer Protocol.",
                                        "Falsch: Standard ist keine Sicherheitsbezeichnung.",
                                        "Korrekt! Das 'S' steht für Secure und kennzeichnet die Ende-zu-Ende-Verschlüsselung über TLS.",
                                        "Falsch: Speed ist nicht die Bedeutung des Buchstabens."
                                },
                                "Netzwerksicherheit & TLS-Protokolle"
                        ),
                        new Question(
                                "q-sec-5-2",
                                "Was ist die Kernphilosophie der Sicherheitsarchitektur 'Zero-Trust'?",
                                new String[]{
                                        "Dass man Passwörter auf Zetteln notiert.",
                                        "Dass keinem Netzwerk (auch nicht dem Firmennetzwerk) blind vertraut wird und jeder Request kryptografisch verifiziert werden muss.",
                                        "Dass keine Antivirensoftware mehr installiert wird.",
                                        "Dass alle Mitarbeiter ohne Authentifizierung arbeiten."
                                },
                                1,
                                new String[]{
                                        "Falsch: Passwörter auf Zetteln verletzen elementare Richtlinien.",
                                        "Korrekt! Zero-Trust geht davon aus, dass Angreifer bereits im Netzwerk sein könnten, und fordert strikte Authentifizierung für jeden einzelnen Dienstzugriff.",
                                        "Falsch: Endpoint-Security bleibt essenziell.",
                                        "Falsch: Das Gegenteil ist der Fall, Authentifizierung wird maximiert."
                                },
                                "IHK Enterprise Security & Zero-Trust"
                        )
                )
        ));

        return new Course("cybersecurity", "Cybersecurity & Kryptografie", "🛡️", "Zero-Trust Standard", "CIA-Triad, AES-256, Password-Hashing, OWASP Top 10 & TLS.", lessons);
    }
}
