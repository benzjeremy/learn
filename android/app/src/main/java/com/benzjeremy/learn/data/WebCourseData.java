package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class WebCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "web-1",
                "1. Das Skelett des Webs: Was ist HTML?",
                "Jede Website im Internet – von Wikipedia bis YouTube – basiert im Kern auf HTML (HyperText Markup Language). HTML ist keine Programmiersprache mit Logik, sondern eine Auszeichnungssprache, die Texten und Medien Struktur verleiht.",
                "HTML besteht aus Tags in spitzen Klammern: '<tag>Inhalt</tag>'. Das Grundgerüst: '<!DOCTYPE html>' signalisiert modernes HTML5, '<head>' enthält Metadaten und Titel, '<body>' beinhaltet alles Sichtbare. Wichtige Basiselemente: Überschriften '<h1>' bis '<h6>', Absätze '<p>', Hyperlinks '<a href=\"...\">' und Bilder '<img src=\"...\" alt=\"...\">'.",
                "<!DOCTYPE html>\n<html lang=\"de\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Meine erste Webseite</title>\n</head>\n<body>\n  <h1>Willkommen im Web!</h1>\n  <p>Ich lerne heute HTML und erstelle meine erste Seite.</p>\n  <a href=\"https://example.com\">Hier klicken für mehr Infos</a>\n</body>\n</html>",
                Arrays.asList(
                        new Question(
                                "q-web-1-1",
                                "In welchem Bereich eines HTML-Dokuments werden Zeichensatz, Metadaten und Seitentitel definiert?",
                                new String[]{"Im <body> Bereich", "Im <head> Bereich", "Im <footer> Bereich", "Im <main> Bereich"},
                                1,
                                new String[]{
                                        "Falsch: Der Body enthält die für den Nutzer sichtbaren Inhalte.",
                                        "Korrekt! Im '<head>' liegen alle technischen Dokument-Metadaten und Ressourcen-Verknüpfungen.",
                                        "Falsch: Der Footer ist die sichtbare Fußzeile.",
                                        "Falsch: Das Main-Tag umschließt den primären Seiteninhalt."
                                },
                                "IHK Web-Standards & HTML5 Anatomie"
                        ),
                        new Question(
                                "q-web-1-2",
                                "Welches HTML-Tag repräsentiert die wichtigste Hauptüberschrift einer Seite?",
                                new String[]{"<h6>", "<header>", "<h1>", "<title>"},
                                2,
                                new String[]{
                                        "Falsch: '<h6>' ist die kleinste Unterüberschrift.",
                                        "Falsch: '<header>' ist ein semantischer Container, keine Überschrift.",
                                        "Korrekt! '<h1>' (Heading 1) ist die hierarchisch oberste Hauptüberschrift.",
                                        "Falsch: '<title>' definiert den Browsertab-Namen im Head."
                                },
                                "HTML Text-Semantik & Hierarchie"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "web-2",
                "2. Semantisches HTML & Barrierefreiheit (WCAG AAA)",
                "Viele Anfänger bauen Webseiten nur mit '<div>' und '<span>' auf ('Div-Suppe'). Doch blinde Menschen nutzen Screenreader, die Webseiten vorlesen. Ein Screenreader kann ein '<div>' nicht von einem Button unterscheiden.",
                "Semantische Tags geben dem Aufbau Bedeutung (Landmarks): '<header>' (Kopfbereich), '<nav>' (Navigation), '<main>' (Hauptinhalt), '<article>' (eigenständiger Beitrag), '<footer>' (Fußzeile). Klickbare Aktionen gehören zwingend in '<button>', Verlinkungen zu neuen Seiten in '<a>'. Jedes Bild benötigt ein beschreibendes 'alt'-Attribut.",
                "<header>\n  <nav aria-label=\"Hauptmenü\">\n    <a href=\"/\">Home</a>\n    <a href=\"/kurse\">Kurse</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h2>Barrierefreies Webdesign</h2>\n    <p>Semantische Tags machen Seiten für alle Menschen bedienbar.</p>\n  </article>\n</main>",
                Arrays.asList(
                        new Question(
                                "q-web-2-1",
                                "Warum sollte eine Hauptnavigation immer mit <nav> statt mit einem <div> ausgezeichnet werden?",
                                new String[]{
                                        "Weil <div> in HTML5 verboten ist.",
                                        "Weil assistive Technologien (Screenreader) den Bereich als Navigations-Landmark erkennen und blind anspringen können.",
                                        "Weil <nav> automatisch CSS-Animationen aktiviert.",
                                        "Weil die Ladezeit dadurch halbiert wird."
                                },
                                1,
                                new String[]{
                                        "Falsch: <div> ist für bedeutungsfreie Gruppierungen weiterhin erlaubt.",
                                        "Korrekt! Semantische Landmark-Rollen ermöglichen sehbehinderten Nutzern eine zielgerichtete Tastatur-Navigation.",
                                        "Falsch: HTML steuert keine automatischen Animationen.",
                                        "Falsch: Tags beeinflussen die Ladezeit kaum messbar."
                                },
                                "WCAG 2.2 Barrierefreiheit & ISO 9241"
                        ),
                        new Question(
                                "q-web-2-2",
                                "Wann sollte man ein <button> Element anstelle eines <a> Hyperlinks nutzen?",
                                new String[]{
                                        "Nur wenn der Button rot eingefärbt sein soll.",
                                        "Wenn eine Aktion auf der aktuellen Seite ausgelöst wird (z. B. Absenden, Öffnen eines Modals), statt auf eine neue URL zu springen.",
                                        "Niemals, Links sind immer besser.",
                                        "Nur auf Android-Smartphones."
                                },
                                1,
                                new String[]{
                                        "Falsch: Farben werden über CSS gesteuert.",
                                        "Korrekt! Links (<a>) navigieren zu Adressen, Buttons (<button>) lösen JavaScript-Aktionen oder Formularübermittlungen aus.",
                                        "Falsch: Die Unterscheidung ist für Tastatur- und Barrierefreiheit essenziell.",
                                        "Falsch: Es ist ein weltweiter W3C-Standard für alle Plattformen."
                                },
                                "UI-Ergonomie & W3C Standards"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "web-3",
                "3. CSS Grundlagen: Das Box-Modell & Farben",
                "HTML liefert den nackten Text – sieht aber ohne Gestaltung aus wie ein Word-Dokument aus den 90ern. CSS (Cascading Style Sheets) ist die Design-Sprache, die Farben, Schriften, Rahmen und Abstände festlegt.",
                "Eine CSS-Regel besteht aus Selektor und Eigenschaften: 'selektor { eigenschaft: wert; }'. Das Box-Modell ist das wichtigste Konzept: Jedes HTML-Element ist eine Box bestehend aus Content (Inhalt) -> Padding (Innenabstand) -> Border (Rahmen) -> Margin (Außenabstand). 'box-sizing: border-box;' stellt sicher, dass Padding nicht die Gesamtbreite sprengt.",
                "* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n.card {\n  background-color: #111827;\n  color: #f8fafc;\n  padding: 16px;        /* Innenabstand */\n  border: 1px solid #38bdf8; /* Rahmen */\n  border-radius: 12px;\n  margin-bottom: 24px;  /* Außenabstand */\n}",
                Arrays.asList(
                        new Question(
                                "q-web-3-1",
                                "Aus welchen vier Schichten besteht das CSS-Box-Modell von innen nach außen?",
                                new String[]{
                                        "Content, Padding, Border, Margin",
                                        "Margin, Border, Padding, Content",
                                        "Header, Main, Aside, Footer",
                                        "Color, Font, Display, Position"
                                },
                                0,
                                new String[]{
                                        "Korrekt! Von innen nach außen: Inhalt (Content), Innenabstand (Padding), Rahmen (Border) und Außenabstand (Margin).",
                                        "Falsch: Das wäre von außen nach innen.",
                                        "Falsch: Das sind HTML-Strukturelemente.",
                                        "Falsch: Das sind allgemeine CSS-Eigenschaften."
                                },
                                "IHK CSS-Boxmodell & Layoutgrundlagen"
                        ),
                        new Question(
                                "q-web-3-2",
                                "Was bewirkt die CSS-Regel 'box-sizing: border-box'?",
                                new String[]{
                                        "Sie blendet alle Rahmen aus.",
                                        "Padding und Border werden in die definierte Gesamtbreite des Elements eingerechnet, statt sie hinzuzufügen.",
                                        "Sie macht die Box kreisrund.",
                                        "Sie erzwingt 3D-Schatten."
                                },
                                1,
                                new String[]{
                                        "Falsch: Rahmen bleiben normal sichtbar.",
                                        "Korrekt! Mit 'border-box' bleibt ein 300px breites Element exakt 300px breit, auch wenn Padding oder Rahmen hinzugefügt werden.",
                                        "Falsch: Runde Ecken macht 'border-radius'.",
                                        "Falsch: Schatten erzeugt 'box-shadow'."
                                },
                                "Modern CSS Layout Engineering"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "web-4",
                "4. Moderne Layouts mit Flexbox & CSS Grid",
                "Früher bauten Webentwickler Layouts mit unzuverlässigen Tabellen oder Float-Hacks. Heute besitzt CSS zwei geniale, mathematisch präzise Werkzeuge, um Elemente perfekt auszurichten: Flexbox und Grid.",
                "Flexbox ('display: flex;'): Perfekt für eindimensionale Ausrichtungen (in einer Zeile oder Spalte). Mit 'justify-content: center;' und 'align-items: center;' zentriert man Elemente kinderleicht. CSS Grid ('display: grid;'): Ideal für zweidimensionale Raster (Zeilen UND Spalten). Mit 'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));' erstellt man ein responsives Kartenraster ohne Media Queries!",
                "/* Navigationsleiste mit Flexbox ausrichten */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n/* Responsives Kurskarten-Raster mit CSS Grid */\n.course-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}",
                Arrays.asList(
                        new Question(
                                "q-web-4-1",
                                "Für welche Art von Layout-Aufgabe ist CSS Flexbox primär ausgelegt?",
                                new String[]{
                                        "Für eindimensionale Anordnungen entlang einer Hauptachse (Reihe oder Spalte)",
                                        "Nur für 3D-Spiele",
                                        "Für zweidimensionale Tabellenkalkulationen",
                                        "Ausschließlich für Bildunterschriften"
                                },
                                0,
                                new String[]{
                                        "Korrekt! Flexbox steuert Fluss und Verteilung entlang einer einzelnen Hauptachse.",
                                        "Falsch: Flexbox dient dem 2D-Weblayout.",
                                        "Falsch: Für 2D-Zeilen und -Spalten nutzt man CSS Grid.",
                                        "Falsch: Flexbox ist universell einsetzbar."
                                },
                                "IHK CSS Flexbox Spezifikation"
                        ),
                        new Question(
                                "q-web-4-2",
                                "Mit welcher Eigenschaft zentriert man Kindelemente in einem Flex-Container entlang der Hauptachse?",
                                new String[]{"text-align: middle;", "justify-content: center;", "float: center;", "margin: auto-center;"},
                                1,
                                new String[]{
                                        "Falsch: 'text-align' wirkt nur auf Inline-Text.",
                                        "Korrekt! 'justify-content: center;' zentriert Flex-Items auf der Hauptachse.",
                                        "Falsch: 'float: center' existiert in CSS nicht.",
                                        "Falsch: Ungültige Syntax."
                                },
                                "CSS Layouting & Alignment"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "web-5",
                "5. Responsive Webdesign & Design Tokens (CSS Variablen)",
                "Nutzer öffnen Websites heute auf Smartphones, Tablets und 4K-Monitoren. Wie sorgt man dafür, dass die Darstellung überall perfekt skaliert und Farben konsistent im gesamten Projekt verwaltet werden?",
                "Design Tokens werden in CSS als Custom Properties definiert: ':root { --color-primary: #38bdf8; }' und mit 'var(--color-primary)' wiederverwendet. Ändert man die Variable an einer Stelle, aktualisiert sich die gesamte Website sofort. Mit Media Queries ('@media (min-width: 768px) { ... }') passt man das Layout nach dem Mobile-First Prinzip für größere Bildschirme an.",
                ":root {\n  --color-primary: #38bdf8;\n  --bg-dark: #080b11;\n  --spacing-base: 1rem;\n}\n\nbody {\n  background-color: var(--bg-dark);\n  color: #f8fafc;\n  font-size: 1rem;\n}\n\n@media (min-width: 768px) {\n  body {\n    font-size: 1.125rem;\n  }\n}",
                Arrays.asList(
                        new Question(
                                "q-web-5-1",
                                "Wie greift man in CSS auf eine definierte Custom Property (CSS-Variable) zu?",
                                new String[]{"get(--variable)", "$variable", "var(--variable)", "@variable"},
                                2,
                                new String[]{
                                        "Falsch: 'get()' ist kein CSS-Befehl.",
                                        "Falsch: '$variable' stammt aus SCSS/Sass.",
                                        "Korrekt! Nativer CSS-Variablenzugriff erfolgt über 'var(--name)'.",
                                        "Falsch: '@' wird für At-Rules wie @media genutzt."
                                },
                                "CSS Custom Properties & Design Tokens"
                        ),
                        new Question(
                                "q-web-5-2",
                                "Was besagt das Konzept 'Mobile-First' im responsiven Webdesign?",
                                new String[]{
                                        "Dass eine Website nur auf Smartphones, nicht aber am PC funktionieren darf.",
                                        "Dass das Grundlayout zuerst für kleine Bildschirme optimiert wird und dann per Media Queries für größere Displays erweitert wird.",
                                        "Dass man keine Bilder auf Webseiten verwenden darf.",
                                        "Dass jede Website im App Store gekauft werden muss."
                                },
                                1,
                                new String[]{
                                        "Falsch: Mobile-First bedient alle Geräteklassen.",
                                        "Korrekt! Mobile-First garantiert schlanken Code für Mobilgeräte und vermeidet überladene Desktop-Overheads.",
                                        "Falsch: Bilder werden responsiv skaliert.",
                                        "Falsch: Mobile-First bezieht sich auf Web-Technologien."
                                },
                                "IHK Responsive Web Design & Breakpoints"
                        )
                )
        ));

        return new Course("htmlcss", "HTML5 & Modern CSS", "🎨", "WCAG AAA & Responsive", "HTML5 Tags, Barrierefreiheit, Box-Modell, Flexbox, Grid & Design Tokens.", lessons);
    }
}
