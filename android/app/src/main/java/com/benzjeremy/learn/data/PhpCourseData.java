package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PhpCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "php-1",
                "1. Wie funktioniert das Web serverseitig? Einführung in PHP",
                "Wenn du eine HTML-Datei öffnest, siehst du festen Text. Doch was passiert, wenn du dich in einem Online-Shop anmeldest? Ein Server muss das Passwort prüfen, den Warenkorb aus der Datenbank laden und eine individuelle HTML-Seite generieren. Genau dafür wurde PHP erfunden – es treibt über 75% aller Websites im Web an!",
                "PHP-Code wird serverseitig ausgeführt: Der Browser des Nutzers sieht niemals deinen PHP-Quellcode, sondern nur das fertige HTML-Ergebnis! PHP-Code beginnt mit '<?php' und endet mit '?>'. Variablen beginnen IMMER mit einem Dollarzeichen '$'. Befehle enden mit ';'. Ausgabe erfolgt mit 'echo'.",
                "<?php\n// Der Server berechnet das aktuelle Jahr dynamisch:\n$appName = \"learn Plattform\";\n$year = date(\"Y\");\n\necho \"<h1>Willkommen bei $appName!</h1>\";\necho \"<p>Serverzeit: $year - Berechnet auf dem Server.</p>\";\n?>",
                Arrays.asList(
                        new Question(
                                "q-php-1-1",
                                "Mit welchem Zeichen müssen alle Variablennamen in PHP beginnen?",
                                new String[]{"#", "$", "@", "&"},
                                1,
                                new String[]{
                                        "Falsch: '#' leitet Kommentare ein.",
                                        "Korrekt! Alle PHP-Variablen beginnen zwingend mit dem Dollarzeichen '$' (z.B. $username).",
                                        "Falsch: '@' ist ein veralteter Fehlerunterdrückungsoperator.",
                                        "Falsch: '&' kennzeichnet Referenzen."
                                },
                                "PHP Syntax & Variablen-Deklaration"
                        ),
                        new Question(
                                "q-php-1-2",
                                "Wo wird der PHP-Code einer Website ausgeführt?",
                                new String[]{
                                        "Direkt im Web-Browser des Besuchers",
                                        "Auf dem Webserver, bevor das fertige HTML an den Browser gesendet wird",
                                        "Auf dem WLAN-Router des Nutzers",
                                        "Auf einer Smartwatch"
                                },
                                1,
                                new String[]{
                                        "Falsch: Im Browser läuft nur JavaScript.",
                                        "Korrekt! PHP ist eine serverseitige Skriptsprache. Der Client erhält nur das fertig generierte Ergebnis.",
                                        "Falsch: Router leiten nur Netzwerkpakete weiter.",
                                        "Falsch: Ausführung erfolgt auf dem Hosting-Server."
                                },
                                "IHK Client-Server-Modell & Webarchitektur"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "php-2",
                "2. Formulardaten verarbeiten ($_POST, $_GET) & XSS-Schutz",
                "Wie kommen die Eingaben aus dem Kontaktformular oder der Login-Maske beim Server an? Über HTTP POST- oder GET-Anfragen. Doch Achtung: Die wichtigste Regel jedes Entwicklers lautet: 'Traue niemals ungeprüften Benutzereingaben!'",
                "Formulardaten landen in den superglobalen Arrays '$_POST' oder '$_GET'. Gibt man diese Daten ohne Bereinigung mit 'echo' aus, kann ein Angreifer schädlichen HTML/JavaScript-Code einschleusen (Cross-Site Scripting, XSS). Die Standardfunktion 'htmlspecialchars()' entschärft Sonderzeichen wie '<' und '>' zuverlässig.",
                "<?php\nif ($_SERVER['REQUEST_METHOD'] === 'POST') {\n    $rawName = $_POST['username'] ?? '';\n    \n    // SICHERHEIT: HTML-Sonderzeichen maskieren!\n    $safeName = htmlspecialchars($rawName, ENT_QUOTES, 'UTF-8');\n    \n    echo \"Guten Tag, \" . $safeName . \"!\";\n}\n?>",
                Arrays.asList(
                        new Question(
                                "q-php-2-1",
                                "Welche PHP-Funktion schützt bei der Ausgabe von Benutzereingaben vor Cross-Site Scripting (XSS)?",
                                new String[]{"md5()", "htmlspecialchars()", "strip_all()", "protect_text()"},
                                1,
                                new String[]{
                                        "Falsch: md5 ist eine Hashfunktion.",
                                        "Korrekt! 'htmlspecialchars()' wandelt spitze Klammern in unschädliche HTML-Entities (&lt; und &gt;) um.",
                                        "Falsch: 'strip_all' existiert in PHP nicht.",
                                        "Falsch: Ungültige Funktion."
                                },
                                "IHK Eingabevalidierung & XSS-Prävention"
                        ),
                        new Question(
                                "q-php-2-2",
                                "In welchem superglobalen Array landen Formulardaten, die per HTTP-POST übertragen wurden?",
                                new String[]{"$_GET", "$_POST", "$_SERVER", "$_COOKIE"},
                                1,
                                new String[]{
                                        "Falsch: '$_GET' liest URL-Query-Parameter aus.",
                                        "Korrekt! '$_POST' speichert die im Request-Body übermittelten Formulardaten.",
                                        "Falsch: '$_SERVER' enthält Server- und Header-Informationen.",
                                        "Falsch: '$_COOKIE' liest Browser-Cookies."
                                },
                                "PHP Superglobals & Formular-Handling"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "php-3",
                "3. Daten organisieren mit Arrays & Funktionen",
                "Ein Server muss Produktlisten, Benutzerrechte oder Konfigurationen verwalten. In PHP sind Arrays das universelle Werkzeug für Sammlungen und Schlüssel-Wert-Speicher.",
                "Numerische Arrays: Geordnete Listen: '$farben = [\"rot\", \"grün\", \"blau\"];'. Zugriff mit '$farben[0]'. Assoziative Arrays (Key-Value): '$user = [\"name\" => \"Jeremy\", \"rolle\" => \"Admin\"];'. Zugriff mit '$user[\"rolle\"]'. Eigene Funktionen definiert man mit 'function name($param) { return ...; }'.",
                "<?php\nfunction berechneGesamt(array $preise): float {\n    $summe = 0.0;\n    foreach ($preise as $p) {\n        $summe += $p;\n    }\n    return $summe;\n}\n\n$warenkorb = [19.99, 49.50, 10.00];\n$gesamt = berechneGesamt($warenkorb);\necho \"Gesamtsumme: \" . number_format($gesamt, 2) . \" €\";\n?>",
                Arrays.asList(
                        new Question(
                                "q-php-3-1",
                                "Wie greift man in einem assoziativen Array '$produkt = [\"preis\" => 49.90]' auf den Preis zu?",
                                new String[]{"$produkt->preis", "$produkt[\"preis\"]", "$produkt(preis)", "$produkt.preis"},
                                1,
                                new String[]{
                                        "Falsch: Der Objekt-Operator '->' wird für Klassenobjekte genutzt.",
                                        "Korrekt! Über eckige Klammern und den Schlüsselnamen greift man auf Array-Elemente zu.",
                                        "Falsch: Runde Klammern sind für Funktionen.",
                                        "Falsch: Der Punkt dient in PHP der String-Verkettung."
                                },
                                "PHP Assoziative Arrays & Datenstrukturen"
                        ),
                        new Question(
                                "q-php-3-2",
                                "Mit welchem Operator weist man in PHP einem Schlüssel in einem Array einen Wert zu?",
                                new String[]{":=", "=>", "->", "=="},
                                1,
                                new String[]{
                                        "Falsch: ':=' stammt aus Go.",
                                        "Korrekt! Der Double-Arrow-Operator '=>' verknüpft in PHP Schlüssel mit Werten (key => value).",
                                        "Falsch: '->' greift auf Objekt-Properties zu.",
                                        "Falsch: '==' prüft auf Gleichheit."
                                },
                                "PHP Syntax & Operatoren"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "php-4",
                "4. Sichere Datenbankanbindung mit PDO & Prepared Statements",
                "Wie speichert ein PHP-Backend Benutzer oder Bestellungen in MySQL? Früher nutzten Entwickler alte Funktionen wie 'mysql_query', die millionenfach durch SQL-Injections gehackt wurden.",
                "Der moderne Sicherheitsstandard in PHP ist PDO (PHP Data Objects). Man nutzt Prepared Statements: Die SQL-Abfrage wird mit Platzhaltern (':email') an die Datenbank geschickt, und die Parameter werden getrennt gebunden. Ein Angreifer hat mathematisch keine Chance mehr, SQL-Code einzuschleusen.",
                "<?php\n$pdo = new PDO(\"mysql:host=localhost;dbname=app_db;charset=utf8mb4\", \"db_user\", \"geheim\");\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n\n// SICHER: Prepared Statement mit benanntem Platzhalter:\n$stmt = $pdo->prepare(\"SELECT id, username, password_hash FROM users WHERE email = :email\");\n$stmt->execute(['email' => $eingabeEmail]);\n$user = $stmt->fetch(PDO::FETCH_ASSOC);\n?>",
                Arrays.asList(
                        new Question(
                                "q-php-4-1",
                                "Warum sind Prepared Statements mit PDO die einzig sichere Methode für SQL-Abfragen?",
                                new String[]{
                                        "Weil SQL-Befehl und Benutzereingaben strikt getrennt übertragen werden und Eingaben niemals als ausführbarer SQL-Code interpretiert werden können.",
                                        "Weil PDO die Festplatte kühlt.",
                                        "Weil Passwörter dadurch automatisch gelöscht werden.",
                                        "Weil Abfragen dadurch langsamer werden."
                                },
                                0,
                                new String[]{
                                        "Korrekt! Prepared Statements verhindern SQL-Injections auf Protokollebene vollständig.",
                                        "Falsch: Es hat keinen Hardwarebezug.",
                                        "Falsch: Passwörter werden sicher verarbeitet.",
                                        "Falsch: Prepared Statements werden von der DB gecacht und sind oft sogar schneller."
                                },
                                "IHK Sichere Datenbankanbindung & PDO"
                        ),
                        new Question(
                                "q-php-4-2",
                                "Wofür steht die Abkürzung PDO in PHP?",
                                new String[]{"Public Data Output", "PHP Data Objects", "Private Database Option", "Process Data Operator"},
                                1,
                                new String[]{
                                        "Falsch: Nicht die korrekte Bezeichnung.",
                                        "Korrekt! PDO steht für PHP Data Objects – eine einheitliche, sichere Datenbank-Abstraktionsschicht.",
                                        "Falsch: Keine gültige Bezeichnung.",
                                        "Falsch: Erfundenes Akronym."
                                },
                                "PHP Standards & Datenbanktreiber"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "php-5",
                "5. Modernes PHP 8.3+: Strict Types, Klassen & Readonly",
                "Vergiss das alte, unstrukturierte PHP 5 von 2004! Modernes PHP 8.3+ ist eine streng typisierte, objektorientierte Hochgeschwindigkeitssprache mit JIT-Compiler (Just-In-Time) und klaren Enterprise-Standards.",
                "'declare(strict_types=1);' am Dateianfang erzwingt exakte Typprüfung. Constructor Property Promotion ('public function __construct(public string $name) {}') eliminiert überflüssigen Boilerplate-Code. Mit 'readonly class' stellt man sicher, dass erstellte Datenobjekte nach der Initialisierung unveränderlich (immutable) bleiben.",
                "<?php\ndeclare(strict_types=1);\n\nreadonly class UserDTO {\n    public function __construct(\n        public int $id,\n        public string $email,\n        public DateTimeImmutable $createdAt\n    ) {}\n}\n\n$user = new UserDTO(1, \"jeremy@example.com\", new DateTimeImmutable());\n// $user->id = 2; // Wirft sofort einen fatalen TypeError! (Readonly)\necho \"User ID: \" . $user->id;\n?>",
                Arrays.asList(
                        new Question(
                                "q-php-5-1",
                                "Welche Anweisung erzwingt in PHP eine strenge Typüberprüfung bei Funktionsaufrufen?",
                                new String[]{
                                        "use strict;",
                                        "declare(strict_types=1);",
                                        "ini_set('type_safety', 'true');",
                                        "#pragma strict"
                                },
                                1,
                                new String[]{
                                        "Falsch: 'use strict;' ist die Direktive für JavaScript.",
                                        "Korrekt! 'declare(strict_types=1);' schaltet Typ-Koerzierung in PHP ab und wirft TypeErrors bei falschen Parametern.",
                                        "Falsch: In der php.ini gibt es diese Direktive nicht.",
                                        "Falsch: '#pragma' gehört zu C/C++ Präprozessoren."
                                },
                                "IHK Modernes PHP & Typsicherheit"
                        ),
                        new Question(
                                "q-php-5-2",
                                "Was bewirkt das Schlüsselwort 'readonly' vor einer Klasse in PHP 8.2+?",
                                new String[]{
                                        "Die Klasse darf niemals instanziiert werden.",
                                        "Alle Eigenschaften der Klasse sind unveränderlich (immutable) und können nach der Initialisierung im Konstruktor nicht mehr modifiziert werden.",
                                        "Die Datei wird schreibgeschützt auf der Festplatte gespeichert.",
                                        "Die Klasse ist nur für den Gast-Nutzer sichtbar."
                                },
                                1,
                                new String[]{
                                        "Falsch: Das wäre eine 'abstract class'.",
                                        "Korrekt! 'readonly classes' garantieren Unveränderlichkeit (Immutability), was Seiteneffekte in modernen Architekturen drastisch reduziert.",
                                        "Falsch: Dateisystemrechte werden vom OS gesteuert.",
                                        "Falsch: Sichtbarkeitsprüfung erfolgt in der Anwendungslogik."
                                },
                                "PHP 8.2+ Readonly Classes & DTO Pattern"
                        )
                )
        ));

        return new Course("php", "Modernes PHP 8.3+", "🐘", "Strict Types & Architecture", "Strict Types, $_POST XSS-Schutz, Arrays, PDO Prepared Statements & Readonly DTOs.", lessons);
    }
}
