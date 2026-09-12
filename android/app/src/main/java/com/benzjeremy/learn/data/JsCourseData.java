package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class JsCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "js-1",
                "1. Was ist JavaScript? Interaktivität & Variablen",
                "HTML ist das Skelett, CSS ist das Design – doch JavaScript (JS) ist das Gehirn und die Muskulatur einer Website! Ohne JavaScript wäre das Web statisch wie ein PDF: Keine Popups, kein interaktiver Warenkorb, keine Live-Wetter-Updates.",
                "JavaScript läuft direkt im Browser des Benutzers. Variablen speichert man heute mit 'const' (für unveränderliche Werte) oder 'let' (für Werte, die neu zugewiesen werden). Das alte 'var' vermeidet man wegen unsauberem Scoping. 'console.log()' ist das wichtigste Werkzeug zum Testen in den Entwicklertools (Taste F12).",
                "// Konstante und veränderbare Variablen\nconst appName = \"learn Platform\";\nlet userPoints = 0;\n\nuserPoints += 25;\nconsole.log(`Willkommen bei ${appName}! Dein Score: ${userPoints}`);",
                Arrays.asList(
                        new Question(
                                "q-js-1-1",
                                "Welches Schlüsselwort wird in modernem JavaScript für Variablen verwendet, deren Wert sich niemals ändern soll?",
                                new String[]{"let", "var", "const", "static"},
                                2,
                                new String[]{
                                        "Falsch: 'let' erlaubt eine Neuzuweisung des Werts.",
                                        "Falsch: 'var' ist veraltet und hat Function-Scope.",
                                        "Korrekt! 'const' deklariert eine unveränderliche Konstante (Block-Scope).",
                                        "Falsch: 'static' gehört zu Klassen-Methoden."
                                },
                                "IHK ECMAScript Standards (ES6+)"
                        ),
                        new Question(
                                "q-js-1-2",
                                "Mit welcher Methode gibt man Nachrichten in die Entwickler-Konsole des Browsers aus?",
                                new String[]{"System.print()", "console.log()", "alert.show()", "document.echo()"},
                                1,
                                new String[]{
                                        "Falsch: 'System.print' existiert im Browser nicht.",
                                        "Korrekt! 'console.log()' ist die Standardmethode für Debug-Ausgaben in der Browser-Konsole.",
                                        "Falsch: 'alert()' öffnet ein blockierendes Dialogfenster.",
                                        "Falsch: Ungültige Methode."
                                },
                                "JavaScript Debugging & Console API"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "js-2",
                "2. Das DOM manipulieren & Klicks abfangen (Events)",
                "Wie öffnet sich das Menü, wenn du auf das Burger-Icon tippst? Wie wechselt der Schalter das Design von Hell auf Dunkel? JavaScript steuert das über das Document Object Model (DOM).",
                "Das DOM ist die Baumstruktur aller HTML-Elemente im Speicher des Browsers. Mit 'document.querySelector('#meinButton')' greifst du auf ein Element zu. Mit '.addEventListener('click', () => { ... })' fängst du Nutzerinteraktionen ab. Mit '.classList.toggle(\"dark-mode\")' oder '.textContent' veränderst du die Seite live, ohne neu zu laden.",
                "const themeBtn = document.querySelector('#theme-btn');\nconst body = document.body;\n\nthemeBtn.addEventListener('click', () => {\n    body.classList.toggle('dark-theme');\n    themeBtn.textContent = body.classList.contains('dark-theme') ? \"☀️ Hell\" : \"🌙 Dunkel\";\n});",
                Arrays.asList(
                        new Question(
                                "q-js-2-1",
                                "Mit welcher DOM-Methode wählt man ein Element anhand eines CSS-Selektors aus?",
                                new String[]{"document.find()", "document.querySelector()", "document.select()", "document.searchElement()"},
                                1,
                                new String[]{
                                        "Falsch: 'document.find()' existiert nicht.",
                                        "Korrekt! 'document.querySelector()' nutzt dieselbe Syntax wie CSS und liefert das erste passende Element.",
                                        "Falsch: 'select' ist kein nativer Selector-Befehl.",
                                        "Falsch: Ungültiger Methodenname."
                                },
                                "DOM API & Selektoren"
                        ),
                        new Question(
                                "q-js-2-2",
                                "Wie reagiert man in JavaScript auf einen Klick auf einen Button?",
                                new String[]{
                                        "button.on('tap')",
                                        "button.addEventListener('click', callback)",
                                        "button.trigger('mouse')",
                                        "button.listen('press')"
                                },
                                1,
                                new String[]{
                                        "Falsch: '.on()' stammt aus alten Bibliotheken wie jQuery.",
                                        "Korrekt! 'addEventListener' ist die offizielle W3C-Standardmethode zur Registrierung von Event-Handlern.",
                                        "Falsch: 'trigger' ist kein W3C Event-Listener.",
                                        "Falsch: Ungültige Syntax."
                                },
                                "IHK Event-Handling & Interaktivität"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "js-3",
                "3. Funktionen & Array-Methoden (map, filter, forEach)",
                "Früher schrieben Entwickler seitenlange Schleifen, um Daten umzuwandeln. Im modernen JavaScript nutzt man funktionale Array-Methoden: kürzer, lesbarer und deutlich weniger fehleranfällig.",
                "Pfeilfunktionen (Arrow Functions): '(a, b) => a + b' ist eine moderne Kurzschreibweise für Funktionen. Array-Werkzeuge: '.map()' transformiert jedes Element und gibt ein neues Array zurück. '.filter()' behält nur Elemente, die eine Bedingung erfüllen. '.forEach()' führt eine Aktion für jedes Element aus.",
                "const courses = [\n    { id: \"go\", title: \"Go\", completed: true },\n    { id: \"sec\", title: \"Security\", completed: true },\n    { id: \"sql\", title: \"SQL\", completed: false }\n];\n\n// Nur offene Kurse herausfiltern:\nconst openCourses = courses.filter(c => !c.completed);\n// Nur die Namen extrahieren:\nconst titles = courses.map(c => c.title);\nconsole.log(\"Offen:\", openCourses.length, \"Titel:\", titles);",
                Arrays.asList(
                        new Question(
                                "q-js-3-1",
                                "Welche Array-Methode erzeugt ein neues Array, das nur Elemente enthält, die eine Prüfbedingung mit true bestehen?",
                                new String[]{"map()", "filter()", "slice()", "push()"},
                                1,
                                new String[]{
                                        "Falsch: 'map()' transformiert alle Elemente.",
                                        "Korrekt! 'filter()' filtert eine Sammlung anhand einer Prädikatsfunktion.",
                                        "Falsch: 'slice()' schneidet Teilbereiche nach Index ab.",
                                        "Falsch: 'push()' fügt Elemente am Ende an."
                                },
                                "IHK Funktionale Array-Programmierung"
                        ),
                        new Question(
                                "q-js-3-2",
                                "Wie lautet die kompakte Arrow-Function-Syntax für eine Funktion, die eine Zahl verdoppelt?",
                                new String[]{"function double(x) { x * 2 }", "x => x * 2", "double: (x) -> x * 2", "x => return x * 2;"},
                                1,
                                new String[]{
                                        "Falsch: Es fehlt das return-Statement in geschweiften Klammern.",
                                        "Korrekt! Bei einzeiligen Arrow Functions ohne geschweifte Klammern ist das 'return' implizit.",
                                        "Falsch: '->' stammt aus Python oder CoffeeScript.",
                                        "Falsch: Mit 'return' müssen zwingend geschweifte Klammern gesetzt werden."
                                },
                                "ES6 Arrow Functions & Impliziter Return"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "js-4",
                "4. Asynchrones JavaScript: Fetch API, Promises & async/await",
                "Wenn du Wetterdaten von einem Server abrufst, dauert die Netzwerk-Antwort vielleicht 300 Millisekunden. Wenn der Browser währenddessen einfrieren würde, könnte der Nutzer weder scrollen noch klicken!",
                "JavaScript ist 'non-blocking': Asynchroner Code blockiert die Oberfläche nicht! Ein 'Promise' repräsentiert ein Ergebnis, das in der Zukunft eintreffen wird. Mit 'async' und 'await' schreibt man asynchronen Code so einfach wie normalen, synchronen Code. Die 'fetch()'-Funktion holt Daten über HTTP-REST-Schnittstellen aus dem Web.",
                "async function loadWeatherData() {\n    try {\n        const response = await fetch(\"https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m\");\n        const data = await response.json();\n        console.log(\"Temperatur:\", data.current.temperature_2m, \"°C\");\n    } catch (err) {\n        console.error(\"Netzwerkfehler:\", err);\n    }\n}",
                Arrays.asList(
                        new Question(
                                "q-js-4-1",
                                "Was bewirkt das Schlüsselwort 'await' vor einem Promise-Aufruf?",
                                new String[]{
                                        "Es pausiert die Ausführung der async-Funktion, bis das Promise aufgelöst ist, ohne den Browser-Thread einzufrieren.",
                                        "Es schaltet das WLAN aus.",
                                        "Es bricht das Programm sofort ab.",
                                        "Es zwingt den Server zum Neustart."
                                },
                                0,
                                new String[]{
                                        "Korrekt! 'await' wartet nicht-blockierend auf das Ergebnis einer asynchronen Operation.",
                                        "Falsch: Es steuert keine Hardware.",
                                        "Falsch: Es bricht nicht ab, sondern wartet auf die Rückgabe.",
                                        "Falsch: Es hat keinen Zugriff auf Server-Hardware."
                                },
                                "IHK Asynchrone Programmierung & Promises"
                        ),
                        new Question(
                                "q-js-4-2",
                                "Mit welcher Standardfunktion führt man im modernen JavaScript HTTP-Netzwerkanfragen durch?",
                                new String[]{"httpGet()", "fetch()", "ajax()", "requestURL()"},
                                1,
                                new String[]{
                                        "Falsch: 'httpGet' ist kein Browser-Standard.",
                                        "Korrekt! Die 'fetch()'-API ist der offizielle W3C-Standard für HTTP-Requests im Browser.",
                                        "Falsch: '$.ajax' gehört zur veralteten jQuery-Bibliothek.",
                                        "Falsch: Ungültige Methode."
                                },
                                "Fetch API & REST Kommunikation"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "js-5",
                "5. Die Event Loop & das Speichermodell",
                "Wie kann JavaScript gleichzeitig Mausklicks verarbeiten, Timer ablaufen lassen und Daten aus dem Internet laden, obwohl JavaScript nur auf einem einzigen Thread läuft?",
                "Die Event Loop ist der Herzschlag der JavaScript-Engine: 1. Call Stack: Führt den aktuellen synchronen Code aus. 2. Web APIs: Browser-Timer ('setTimeout') laufen im Hintergrund. 3. Microtask Queue: Promises haben nach dem Call Stack höchste Priorität! 4. Task Queue (Macrotasks): Timer warten, bis Stack UND Microtasks komplett abgearbeitet sind.",
                "console.log(\"1: Start\");\n\nsetTimeout(() => {\n    console.log(\"4: Timeout (Macrotask)\");\n}, 0);\n\nPromise.resolve().then(() => {\n    console.log(\"3: Promise (Microtask)\");\n});\n\nconsole.log(\"2: Ende\");\n// Ausgabe-Reihenfolge: 1, 2, 3, 4!",
                Arrays.asList(
                        new Question(
                                "q-js-5-1",
                                "In welcher Reihenfolge arbeitet die JavaScript Event Loop asynchrone Aufgaben ab?",
                                new String[]{
                                        "Synchroner Code -> Microtasks (Promises) -> Macrotasks (setTimeout)",
                                        "Macrotasks -> Microtasks -> Synchroner Code",
                                        "Völlig zufällig",
                                        "Zuerst alle Timer, dann der Call Stack"
                                },
                                0,
                                new String[]{
                                        "Korrekt! Zuerst wird der Call Stack geleert, dann werden anstehende Microtasks abgearbeitet, und erst im nächsten Loop-Tick folgt die Task Queue.",
                                        "Falsch: Synchroner Code hat immer Vorrang.",
                                        "Falsch: Die Event Loop arbeitet streng deterministisch.",
                                        "Falsch: Timer müssen warten, bis der Call Stack frei ist."
                                },
                                "IHK Event Loop & Single-Threaded Concurrency"
                        ),
                        new Question(
                                "q-js-5-2",
                                "Warum friert die Website ein, wenn man eine endlose synchrone while-Schleife in JavaScript startet?",
                                new String[]{
                                        "Weil JavaScript single-threaded ist und der blockierte Call Stack verhindert, dass Render-Events oder Klicks verarbeitet werden.",
                                        "Weil der Monitor überhitzt.",
                                        "Weil die Internetverbindung getrennt wird.",
                                        "Weil das Betriebssystem keine Schleifen erlaubt."
                                },
                                0,
                                new String[]{
                                        "Korrekt! Da JS auf dem Haupt-Thread läuft, blockiert eine Endlosschleife die Event Loop vollständig.",
                                        "Falsch: Hardware-Überhitzung ist nicht die Softwareursache.",
                                        "Falsch: Das Netzwerk ist davon unabhängig.",
                                        "Falsch: Betriebssysteme führen Schleifen problemlos aus."
                                },
                                "Browser Render Pipeline & Threading"
                        )
                )
        ));

        return new Course("javascript", "JavaScript & Runtime", "⚡", "Event Loop & ESNext", "Syntax, DOM-Events, Arrow Functions, Fetch/Async & die Event Loop.", lessons);
    }
}
