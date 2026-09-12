package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SqlCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "sql-1",
                "1. Was ist eine relationale Datenbank?",
                "Warum speichern Firmen ihre Daten nicht einfach in einer Excel-Tabelle oder Textdatei? Textdateien korrumpieren bei gleichzeitigen Zugriffen von tausenden Nutzern, suchen extrem langsam und können Beziehungen zwischen Daten nicht garantieren.",
                "Eine relationale Datenbank speichert Daten in Tabellen (wie ein Adressbuch). Jede Zeile (Row) ist ein konkreter Datensatz. Jede Spalte (Column) hat einen festen Datentyp (z. B. 'id INT', 'name VARCHAR(100)'). Der Primärschlüssel (Primary Key) ist ein eindeutiger Ausweis, der jeden Datensatz unverwechselbar macht.",
                "CREATE TABLE users (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(150) UNIQUE NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);",
                Arrays.asList(
                        new Question(
                                "q-sql-1-1",
                                "Was zeichnet einen Primärschlüssel (Primary Key) in einer SQL-Tabelle aus?",
                                new String[]{
                                        "Er identifiziert jeden Datensatz in der Tabelle unverwechselbar und eindeutig.",
                                        "Er speichert das Passwort des Administrators.",
                                        "Er darf in jeder Zeile denselben Wert haben.",
                                        "Er löscht alte Daten automatisch nach 24 Stunden."
                                },
                                0,
                                new String[]{
                                        "Korrekt! Ein Primärschlüssel garantiert die Eindeutigkeit jedes einzelnen Datensatzes (Entity Integrity).",
                                        "Falsch: Passwörter gehören in geschützte Passwortspalten.",
                                        "Falsch: Ein Primärschlüssel muss strikt eindeutig sein (keine Duplikate).",
                                        "Falsch: Ein Primärschlüssel löscht keine Datensätze."
                                },
                                "IHK Datenbankentwurf & Entity Integrity"
                        ),
                        new Question(
                                "q-sql-1-2",
                                "Was bewirkt der Zusatz 'NOT NULL' bei der Definition einer Tabellenspalte?",
                                new String[]{
                                        "Die Spalte darf nur die Zahl Null enthalten.",
                                        "In dieser Spalte muss immer ein gültiger Wert eingetragen werden (kein Leerwert erlaubt).",
                                        "Die Spalte wird für normale Nutzer ausgeblendet.",
                                        "Die Spalte wird bei jedem Neustart geleert."
                                },
                                1,
                                new String[]{
                                        "Falsch: NOT NULL verbietet den Null-Wert, erzwingt ihn nicht.",
                                        "Korrekt! NOT NULL erzwingt, dass beim Einfügen eines neuen Datensatzes zwingend ein Wert für diese Spalte angegeben wird.",
                                        "Falsch: Sichtbarkeit wird über Berechtigungen und SELECT gesteuert.",
                                        "Falsch: Tabellendaten bleiben persistent gespeichert."
                                },
                                "SQL DDL & Constraints"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "sql-2",
                "2. Daten abfragen mit SELECT, WHERE & ORDER BY",
                "Du hast eine Tabelle mit 500.000 Kunden. Dein Chef möchte wissen: 'Zeige mir alle aktiven Kunden aus Berlin, sortiert nach dem Registrierungsdatum.' Genau dafür wurde SQL (Structured Query Language) erfunden.",
                "'SELECT spalten' bestimmt, welche Spalten du sehen willst (oder '*' für alle). 'FROM tabelle' nennt die Datenquelle. 'WHERE bedingung' filtert die Datensätze gezielt heraus. 'ORDER BY spalte DESC/ASC' sortiert die Treffer absteigend oder aufsteigend. 'LIMIT n' beschränkt die Anzahl der Treffer.",
                "SELECT name, email, city\nFROM users\nWHERE city = 'Berlin' AND status = 'ACTIVE'\nORDER BY created_at DESC\nLIMIT 10;",
                Arrays.asList(
                        new Question(
                                "q-sql-2-1",
                                "Mit welchem SQL-Schlüsselwort filtert man Zeilen nach bestimmten Kriterien?",
                                new String[]{"FILTER BY", "WHERE", "HAVING ONLY", "SEARCH"},
                                1,
                                new String[]{
                                        "Falsch: 'FILTER BY' existiert in Standard-SQL nicht.",
                                        "Korrekt! Mit 'WHERE' schränkt man die abzufragenden Datensätze auf diejenigen ein, die die Bedingung erfüllen.",
                                        "Falsch: 'HAVING' filtert aggregierte Gruppen, nicht rohe Einzelzeilen.",
                                        "Falsch: 'SEARCH' ist kein Standard-SQL-Befehl."
                                },
                                "IHK SQL-Abfragen & Datenfilterung"
                        ),
                        new Question(
                                "q-sql-2-2",
                                "Was bewirkt die Anweisung 'ORDER BY created_at DESC'?",
                                new String[]{
                                        "Sortiert aufsteigend (älteste zuerst).",
                                        "Sortiert absteigend (neueste zuerst).",
                                        "Löscht Datensätze, die kein Datum haben.",
                                        "Benennt die Spalte um."
                                },
                                1,
                                new String[]{
                                        "Falsch: Aufsteigende Sortierung erreicht man mit 'ASC'.",
                                        "Korrekt! 'DESC' steht für Descending (absteigend), sodass die höchsten bzw. neuesten Werte ganz oben stehen.",
                                        "Falsch: ORDER BY liest Daten nur sortiert aus, löscht aber nichts.",
                                        "Falsch: Umbenennen erfolgt mit 'AS alias'."
                                },
                                "SQL Sortierung & Projektion"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "sql-3",
                "3. Daten einfügen, ändern & löschen (INSERT, UPDATE, DELETE)",
                "Ein neuer Kunde registriert sich, ändert seine Lieferadresse oder kündigt sein Profil. Wie modifiziert man Datenbestände in SQL sicher, ohne versehentlich die gesamte Datenbank zu überschreiben?",
                "'INSERT INTO tabelle (spalten) VALUES (werte)' fügt neue Zeilen ein. 'UPDATE tabelle SET spalte = wert WHERE bedingung' ändert existierende Zeilen. 'DELETE FROM tabelle WHERE bedingung' löscht Zeilen. Wichtigste Faustregel jedes Administrators: Führe NIEMALS ein UPDATE oder DELETE ohne WHERE aus, sonst sind alle Daten verloren!",
                "-- 1. Neu anlegen\nINSERT INTO users (name, email, city) VALUES ('Max Mustermann', 'max@example.com', 'Berlin');\n\n-- 2. Aktualisieren (IMMER mit WHERE!)\nUPDATE users SET city = 'Hamburg' WHERE email = 'max@example.com';\n\n-- 3. Löschen\nDELETE FROM users WHERE id = 42;",
                Arrays.asList(
                        new Question(
                                "q-sql-3-1",
                                "Was passiert, wenn du 'DELETE FROM users;' ohne eine WHERE-Klausel ausführst?",
                                new String[]{
                                        "Es wird nur der allererste Nutzer gelöscht.",
                                        "Es werden ausnahmslos ALLE Zeilen der Tabelle gelöscht.",
                                        "SQL gibt einen Fehler aus und bricht ab.",
                                        "Es wird eine Sicherheitskopie erstellt."
                                },
                                1,
                                new String[]{
                                        "Falsch: SQL löscht alle zutreffenden Zeilen – ohne WHERE trifft das auf jede Zeile zu.",
                                        "Korrekt! Ohne einschränkende WHERE-Bedingung löscht DELETE gnadenlos den gesamten Tabelleninhalt.",
                                        "Falsch: Standard-SQL führt den Befehl direkt aus.",
                                        "Falsch: Backups müssen separat konfiguriert werden."
                                },
                                "IHK Datenmanipulation & Datensicherheit"
                        ),
                        new Question(
                                "q-sql-3-2",
                                "Welcher SQL-Befehl wird genutzt, um neue Datensätze in eine Tabelle zu schreiben?",
                                new String[]{"ADD RECORD", "INSERT INTO", "NEW ROW", "CREATE DATA"},
                                1,
                                new String[]{
                                        "Falsch: 'ADD' wird in ALTER TABLE für neue Spalten genutzt.",
                                        "Korrekt! 'INSERT INTO' ist der standardisierte SQL-Befehl zum Erzeugen neuer Datensätze.",
                                        "Falsch: 'NEW ROW' existiert in SQL nicht.",
                                        "Falsch: 'CREATE' erstellt Datenbank-Objekte wie Tabellen, keine Zeilen."
                                },
                                "SQL DML Befehle"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "sql-4",
                "4. Tabellen verbinden mit JOINs & Fremdschlüsseln",
                "Ein Kunde kauft 10 Produkte. Würden wir Name und Adresse des Kunden bei jeder einzelnen Bestellung wiederholen, hätten wir gigantische Daten-Redundanz. Wenn der Kunde umzieht, müsste man hunderte Zeilen ändern.",
                "In relationalen Datenbanken trennt man Kunden und Bestellungen in zwei Tabellen. In 'orders' speichert man nur die 'user_id' als Fremdschlüssel (Foreign Key). Mit einem 'INNER JOIN' führt SQL beide Tabellen blitzschnell zusammen. Ein 'LEFT JOIN' liefert alle Kunden, auch wenn sie noch keine Bestellung aufgegeben haben.",
                "SELECT u.name, o.order_number, o.total_amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nWHERE o.status = 'COMPLETED';",
                Arrays.asList(
                        new Question(
                                "q-sql-4-1",
                                "Was ist die Funktion eines Fremdschlüssels (Foreign Key)?",
                                new String[]{
                                        "Er verweist auf den Primärschlüssel einer anderen Tabelle und stellt so eine Beziehung her.",
                                        "Er verschlüsselt die Festplatte.",
                                        "Er dient als Administrator-Passwort.",
                                        "Er verhindert, dass Daten gelöscht werden können."
                                },
                                0,
                                new String[]{
                                        "Korrekt! Ein Fremdschlüssel verknüpft Datensätze tabellenübergreifend (Referentielle Integrität).",
                                        "Falsch: Fremdschlüssel haben nichts mit Dateisystem-Verschlüsselung zu tun.",
                                        "Falsch: Fremdschlüssel sind Datenbank-Constraints, keine Passwörter.",
                                        "Falsch: Löschen ist weiterhin möglich (bzw. konfigurierbar über CASCADE)."
                                },
                                "IHK Relationale Beziehungen & Referentielle Integrität"
                        ),
                        new Question(
                                "q-sql-4-2",
                                "Was ist das Ergebnis eines 'LEFT JOIN' zwischen Tabelle A und Tabelle B?",
                                new String[]{
                                        "Nur Zeilen, die in beiden Tabellen vorkommen.",
                                        "Alle Zeilen aus Tabelle A, ergänzt um passende Treffer aus Tabelle B (oder NULL, falls kein Treffer existiert).",
                                        "Ausschließlich die Daten der rechten Tabelle B.",
                                        "Beide Tabellen werden gelöscht."
                                },
                                1,
                                new String[]{
                                        "Falsch: Das ist die Definition eines INNER JOIN.",
                                        "Korrekt! Der LEFT JOIN behält alle Datensätze der linken Tabelle vollständig bei.",
                                        "Falsch: Das wäre ein RIGHT JOIN.",
                                        "Falsch: Ein JOIN modifiziert keine Daten, er fragt sie nur ab."
                                },
                                "SQL Joins & Mengenlehre"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "sql-5",
                "5. Normalisierung (1NF-3NF) & ACID-Transaktionen",
                "Wie stellt man sicher, dass ein Datenbanksystem über Jahre fehlerfrei und ohne doppelte Daten arbeitet? Und was passiert, wenn während einer Banküberweisung plötzlich der Strom ausfällt?",
                "Normalisierung (nach Codd): 1NF (alle Attribute sind atomar, keine Listen in Feldern), 2NF (1NF + jedes Feld hängt voll vom Primärschlüssel ab), 3NF (keine transitiven Abhängigkeiten). ACID garantiert verlässliche Transaktionen: Atomicity (Alles oder Nichts), Consistency (Konsistenz), Isolation (Nebenläufigkeit stört nicht), Durability (Dauerhaftigkeit auch bei Stromausfall).",
                "START TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1; -- Max -100€\nUPDATE accounts SET balance = balance + 100 WHERE id = 2; -- Lisa +100€\nCOMMIT; -- Erst jetzt ist die Buchung dauerhaft festgeschrieben!",
                Arrays.asList(
                        new Question(
                                "q-sql-5-1",
                                "Was bedeutet 'Atomicity' (Atomarität) im ACID-Prinzip?",
                                new String[]{
                                        "Dass die Datenbank mit Atomstrom betrieben werden muss.",
                                        "Dass eine Transaktion entweder vollständig oder gar nicht ausgeführt wird (Alles-oder-Nichts).",
                                        "Dass alle Daten unverschlüsselt bleiben.",
                                        "Dass nur eine einzige Tabelle existieren darf."
                                },
                                1,
                                new String[]{
                                        "Falsch: Der Begriff hat keinen physikalischen Strombezug.",
                                        "Korrekt! Scheitert ein Einzelschritt einer Transaktion, werden alle vorherigen Änderungen per Rollback rückgängig gemacht.",
                                        "Falsch: Atomarität betrifft die Unteilbarkeit von Transaktionsschritten.",
                                        "Falsch: ACID gilt für beliebig komplexe Datenbanksysteme."
                                },
                                "IHK ACID-Transaktionen & Fehlertoleranz"
                        ),
                        new Question(
                                "q-sql-5-2",
                                "Wann befindet sich eine Tabelle in der 1. Normalform (1NF)?",
                                new String[]{
                                        "Wenn alle Attributwerte atomar (unteilbar) sind und keine Wertelisten in einem Feld stehen.",
                                        "Wenn die Tabelle mindestens 1000 Zeilen besitzt.",
                                        "Wenn alle Spalten denselben Datentyp haben.",
                                        "Wenn keine Zahlen verwendet werden."
                                },
                                0,
                                new String[]{
                                        "Korrekt! In der 1NF darf eine Zelle nicht mehrere Werte (z.B. Telefonnummern im Kommaformat) bündeln.",
                                        "Falsch: Die Zeilenanzahl ist für Normalformen irrelevant.",
                                        "Falsch: Spalten haben unterschiedliche, passgenaue Datentypen.",
                                        "Falsch: Zahlen sind elementare Datentypen."
                                },
                                "Normalisierung nach Codd & 1NF"
                        )
                )
        ));

        return new Course("sql", "SQL & Datenbank-Architektur", "🗄️", "ACID & Relational", "Tabellen, SELECT, INSERT/UPDATE, JOINs, Normalisierung & ACID.", lessons);
    }
}
