package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AstroCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "astro-1",
                "1. Warum Astro? Das Problem überladener Websites",
                "Warum laden viele Websites heute quälend langsam, verbrauchen massig Akku und ruckeln auf älteren Mobilgeräten? Weil traditionelle JavaScript-Frameworks wie React standardmäßig Megabytes an Code an den Browser schicken, nur um einfachen Text anzuzeigen!",
                "Astro revolutioniert das moderne Web durch den radikalen Ansatz: 'Zero JavaScript by default'. Astro kompiliert Komponenten auf dem Server oder beim Build zu 100% in pures, federleichtes HTML und CSS. Das Ergebnis: Perfekte 100er Lighthouse-Scores und blitzschnelle Ladezeiten.",
                "---\n// Dieser Bereich läuft NUR auf dem Server / beim Build!\nconst pageTitle = \"Meine ultra-schnelle Astro-Website\";\nconst currentYear = new Date().getFullYear();\n---\n\n<!-- Im Browser des Nutzers landet 0 KB JavaScript! -->\n<h1>{pageTitle}</h1>\n<p>&copy; {currentYear} Jeremy Benz - 100% reine HTML-Ausgabe.</p>",
                Arrays.asList(
                        new Question(
                                "q-astro-1-1",
                                "Wie viel JavaScript schickt Astro standardmäßig an den Browser des Nutzers?",
                                new String[]{
                                        "Mindestens 5 Megabyte",
                                        "Zero JavaScript (standardmäßig 0 Kilobyte JS, nur reines HTML/CSS)",
                                        "Immer das gesamte Node.js Bundle",
                                        "100 Kilobyte pro Bild"
                                },
                                1,
                                new String[]{
                                        "Falsch: Astro eliminiert unnötigen JS-Bloat vollständig.",
                                        "Korrekt! Astro sendet standardmäßig 0 KB Client-JavaScript, es sei denn, man verlangt es explizit über Client-Direktiven.",
                                        "Falsch: Node.js läuft nur beim Build auf dem Server.",
                                        "Falsch: Bilder werden separat optimiert."
                                },
                                "Astro Core Philosophy & Zero-JS Default"
                        ),
                        new Question(
                                "q-astro-1-2",
                                "Was ist der größte Vorteil von Astros 'Zero JS Default' Ansatz?",
                                new String[]{
                                        "Dass Webseiten nicht mehr im Browser geöffnet werden können.",
                                        "Maximale Ladegeschwindigkeit, minimale Akkubelastung und perfekte Core Web Vitals.",
                                        "Dass keine CSS-Styles mehr erlaubt sind.",
                                        "Dass Webseiten nur noch schwarz-weiß sind."
                                },
                                1,
                                new String[]{
                                        "Falsch: Sie öffnen in jedem normalen Browser.",
                                        "Korrekt! Reines HTML rendert ohne Parsing-Verzögerung sofort auf dem Display.",
                                        "Falsch: Modernes CSS wird voll unterstützt und optimiert.",
                                        "Falsch: Design und Farben bleiben voll erhalten."
                                },
                                "Web Performance & Core Web Vitals"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "astro-2",
                "2. Die Astro-Dateianatomie: Frontmatter & HTML-Template",
                "Wie ist eine '.astro'-Datei aufgebaut? Astro kombiniert das Beste aus zwei Welten: Mächtige Server-Logik oben und sauberes HTML unten, getrennt durch einen klar definierten Zaun.",
                "Der Frontmatter-Bereich wird durch drei Bindestriche '---' umschlossen. Hier importierst du Komponenten oder holst Daten aus APIs. Unter dem zweiten '---' folgt das HTML-Template. Variablen bindest du einfach mit geschweiften Klammern '{variable}' direkt im HTML ein.",
                "---\nimport Header from '../components/Header.astro';\nconst courses = [\"Go\", \"Cybersecurity\", \"SQL\", \"Python\"];\n---\n\n<Header />\n<main>\n  <h2>Verfügbare Lernpfade:</h2>\n  <ul>\n    {courses.map(name => <li>{name}</li>)}\n  </ul>\n</main>",
                Arrays.asList(
                        new Question(
                                "q-astro-2-1",
                                "Durch welche Zeichenfolge wird der Frontmatter-Bereich in einer .astro-Datei begrenzt?",
                                new String[]{"///", "---", "<script>", "=== "},
                                1,
                                new String[]{
                                        "Falsch: Drei Schrägstriche sind kein Frontmatter-Trenner.",
                                        "Korrekt! Die drei Bindestriche '---' (Code Fence) grenzen den Server-Script-Bereich vom Template ab.",
                                        "Falsch: '<script>' definiert Client-Skripte.",
                                        "Falsch: Gleichheitszeichen sind unzulässig."
                                },
                                "Astro Komponenten-Syntax"
                        ),
                        new Question(
                                "q-astro-2-2",
                                "Wo wird der JavaScript-Code ausgeführt, der sich im Frontmatter-Bereich befindet?",
                                new String[]{
                                        "Immer im Browser des Benutzers.",
                                        "Ausschließlich serverseitig beim Build oder Request, niemals im Browser.",
                                        "Auf dem Smartphone des Besuchers.",
                                        "Im Router des Nutzers."
                                },
                                1,
                                new String[]{
                                        "Falsch: Frontmatter-Code wird niemals an den Client gesendet.",
                                        "Korrekt! Er läuft sicher beim Kompilieren auf dem Server. Datenbank-Passwörter oder API-Keys gelangen so niemals in den Browser.",
                                        "Falsch: Auf dem Endgerät landet nur das gerenderte HTML.",
                                        "Falsch: Router führen keinen App-Code aus."
                                },
                                "Server-Side Rendering & Build-Pipeline"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "astro-3",
                "3. Komponenten & Props (Modulare Bausteine)",
                "Wenn du 50 Kurskarten auf deiner Plattform anzeigst, schreibst du den HTML-Code nicht 50 Mal von Hand ab. Du baust eine wiederverwendbare Karten-Komponente.",
                "In Astro erstellst du z. B. 'Card.astro'. Über 'Astro.props' empfängt die Komponente Parameter wie Titel, Icon und Beschreibung. Mit Slots ('<slot />') kannst du flexiblen Inhalt direkt in den Rumpf der Komponente einbetten.",
                "---\n// Card.astro\ninterface Props {\n  title: string;\n  icon: string;\n}\nconst { title, icon } = Astro.props;\n---\n\n<div class=\"card\">\n  <span class=\"icon\">{icon}</span>\n  <h3>{title}</h3>\n  <slot /> <!-- Hier landet der übergebene Inhalt -->\n</div>",
                Arrays.asList(
                        new Question(
                                "q-astro-3-1",
                                "Über welches Objekt greift eine Astro-Komponente auf die an sie übergebenen Attribute zu?",
                                new String[]{"this.attributes", "Astro.props", "window.params", "request.get()"},
                                1,
                                new String[]{
                                        "Falsch: 'this' wird in Astro-Komponenten nicht genutzt.",
                                        "Korrekt! 'Astro.props' beinhaltet alle an die Komponente übergebenen Props.",
                                        "Falsch: 'window' existiert nur im Browser.",
                                        "Falsch: 'request.get()' liest HTTP-Parameter, keine Komponenten-Props."
                                },
                                "Astro Props & TypeScript Interfaces"
                        ),
                        new Question(
                                "q-astro-3-2",
                                "Wozu dient das <slot /> Element in einer Astro-Komponente?",
                                new String[]{
                                        "Als Platzhalter für verschachtelten Kind-Inhalt, der zwischen öffnendem und schließendem Tag übergeben wird.",
                                        "Zum Abspielen von Sounddateien.",
                                        "Zum Speichern von Passwörtern.",
                                        "Als Ladebalken."
                                },
                                0,
                                new String[]{
                                        "Korrekt! '<slot />' rendert Kind-Elemente, die von außen in die Komponente hineingereicht werden.",
                                        "Falsch: Audio wird über das '<audio>' Tag abgespielt.",
                                        "Falsch: Slots haben keinen Bezug zu Passwörtern.",
                                        "Falsch: Ladebalken werden über Progress/CSS gelöst."
                                },
                                "Komponenten-Komposition & Slots"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "astro-4",
                "4. Die Insel-Architektur (Islands Architecture)",
                "Was, wenn deine Website zwar statisch sein soll, du aber an einer Stelle ein interaktives Suchfeld oder ein Wetter-Widget brauchst? Musst du dafür die gesamte Seite in React umbauen? Nein!",
                "Die Insel-Architektur isoliert interaktive Inseln auf einem Meer aus statischem HTML. Mit Client-Direktiven steuerst du präzise, wann JS geladen wird: 'client:load' (sofort laden), 'client:visible' (erst laden, wenn der Nutzer zu der Komponente hinscrollt!), 'client:media' (nur bei bestimmten Bildschirmbreiten).",
                "---\nimport StaticHeader from './StaticHeader.astro';\nimport InteractiveChart from './Chart.jsx';\n---\n\n<StaticHeader /> <!-- 0 KB JavaScript -->\n\n<!-- JavaScript wird erst nachgeladen, wenn die Grafik sichtbar wird! -->\n<InteractiveChart client:visible />",
                Arrays.asList(
                        new Question(
                                "q-astro-4-1",
                                "Was bewirkt die Direktive 'client:visible' in Astro?",
                                new String[]{
                                        "Die Komponente wird sofort beim ersten Seitenaufruf im Hintergrund geladen.",
                                        "Die interaktive Komponente wird erst hydriert und heruntergeladen, sobald sie in den sichtbaren Viewport des Nutzers scrollt.",
                                        "Die Komponente wird im Browser ausgeblendet.",
                                        "Die Komponente schaltet auf Vollbild."
                                },
                                1,
                                new String[]{
                                        "Falsch: Sofortiges Laden erreicht man mit 'client:load'.",
                                        "Korrekt! 'client:visible' nutzt den IntersectionObserver, um Datenvolumen und CPU-Last zu minimieren.",
                                        "Falsch: Es steuert nicht die CSS-Sichtbarkeit, sondern die Hydrierung.",
                                        "Falsch: Vollbild hat damit nichts zu tun."
                                },
                                "Astro Islands & Selective Hydration"
                        ),
                        new Question(
                                "q-astro-4-2",
                                "Was versteht man unter 'Islands Architecture' im modernen Web?",
                                new String[]{
                                        "Dass Server auf echten Inseln im Meer stehen müssen.",
                                        "Isolierte interaktive UI-Komponenten innerhalb einer ansonsten rein statischen HTML-Seite.",
                                        "Dass jede Seite ein separates Browserfenster öffnet.",
                                        "Dass Webseiten nicht verlinkt werden dürfen."
                                },
                                1,
                                new String[]{
                                        "Falsch: Der Begriff ist eine architektonische Metapher.",
                                        "Korrekt! Inseln trennen interaktive Widgets strikt vom statischen Seitenrest für maximale Geschwindigkeit.",
                                        "Falsch: Es handelt sich um Komponenten auf derselben Seite.",
                                        "Falsch: Links sind das Fundament des Webs."
                                },
                                "Moderne Web-Architekturen & Islands"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "astro-5",
                "5. Content Collections & Typensicherheit",
                "Du verwaltest hunderte Lektionen oder Blog-Beiträge in Markdown ('.md'). Was passiert, wenn du in einer Datei das Veröffentlichungsdatum oder den Titel vergisst? Ein herkömmliches System stürzt still ab.",
                "Astro Content Collections verwalten Markdown- und MDX-Dateien mit Zod-Schemas typensicher! Wenn eine Datei ein fehlerhaftes Feld enthält, bricht der Astro-Compiler den Build sofort mit einer klaren Fehlermeldung ab. Fehlerhafte Inhalte gelangen so niemals in Produktion.",
                "// src/content/config.ts\nimport { defineCollection, z } from 'astro:content';\n\nconst lessonCollection = defineCollection({\n  schema: z.object({\n    title: z.string(),\n    level: z.enum(['beginner', 'advanced']),\n    publishedDate: z.date()\n  }),\n});\n\nexport const collections = { 'lessons': lessonCollection };",
                Arrays.asList(
                        new Question(
                                "q-astro-5-1",
                                "Welche Bibliothek nutzt Astro intern zur Schema-Validierung von Content Collections?",
                                new String[]{"jQuery", "Zod", "Lodash", "Moment.js"},
                                1,
                                new String[]{
                                        "Falsch: jQuery ist eine veraltete DOM-Bibliothek.",
                                        "Korrekt! Zod garantiert Typsicherheit zur Laufzeit und beim Build.",
                                        "Falsch: Lodash ist eine Hilfsbibliothek.",
                                        "Falsch: Moment.js ist eine veraltete Datumsbibliothek."
                                },
                                "Astro Content Collections & Zod"
                        ),
                        new Question(
                                "q-astro-5-2",
                                "In welchem Verzeichnis werden Content Collections in einem Astro-Projekt organisiert?",
                                new String[]{"src/content/", "public/files/", "node_modules/", "dist/cache/"},
                                0,
                                new String[]{
                                        "Korrekt! 'src/content/' ist der reservierte Astro-Standardordner für typensichere Sammlungen.",
                                        "Falsch: 'public/' ist für unberührte statische Dateien gedacht.",
                                        "Falsch: 'node_modules/' verwaltet externe Abhängigkeiten.",
                                        "Falsch: 'dist/' ist das Ausgabe-Build-Verzeichnis."
                                },
                                "Projektstruktur & Dateiorganisation"
                        )
                )
        ));

        return new Course("astro", "Astro Web Framework", "🚀", "Islands Architecture", "Zero-JS Default, Frontmatter, Komponenten, Islands Architecture & Collections.", lessons);
    }
}
