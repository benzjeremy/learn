package com.benzjeremy.learn.data;

import com.benzjeremy.learn.model.Course;
import com.benzjeremy.learn.model.Lesson;
import com.benzjeremy.learn.model.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CsharpCourseData {
    public static Course getCourse() {
        List<Lesson> lessons = new ArrayList<>();

        // Lesson 1
        lessons.add(new Lesson(
                "csharp-1",
                "1. Einführung in C# & das .NET Ökosystem",
                "C# (gesprochen 'C-Sharp') wurde von Microsoft entwickelt und ist die führende Sprache für Unternehmensanwendungen, Bankensysteme, Cloud-Backends und die Unity-Game-Engine. C# vereint höchste Typsicherheit mit massiver Performance.",
                "C# ist streng typisiert und läuft auf der .NET CLR (Common Language Runtime). Ein Programm besteht aus Namespaces, Klassen und der statischen 'Main'-Methode als Einstiegspunkt. Ausgabe auf der Konsole erfolgt mit 'Console.WriteLine()'. Grundlegende Datentypen: 'int', 'double', 'string', 'bool'.",
                "using System;\n\nnamespace LearnApp\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            string devName = \"Jeremy\";\n            int experienceYears = 5;\n            Console.WriteLine($\"Willkommen {devName}! Erfahrung: {experienceYears} Jahre.\");\n        }\n    }\n}",
                Arrays.asList(
                        new Question(
                                "q-cs-1-1",
                                "Auf welcher virtuellen Ausführungsumgebung läuft kompilierter C#-Code?",
                                new String[]{"JVM", "CLR (Common Language Runtime)", "Node.js", "CPython"},
                                1,
                                new String[]{
                                        "Falsch: Die JVM gehört zu Java.",
                                        "Korrekt! Die CLR ist das Herzstück der .NET-Plattform und verwaltet Ausführung, JIT-Kompilierung und Garbage Collection.",
                                        "Falsch: Node.js führt JavaScript aus.",
                                        "Falsch: CPython ist der Standard-Python-Interpreter."
                                },
                                "IHK .NET Plattformarchitektur & CLR"
                        ),
                        new Question(
                                "q-cs-1-2",
                                "Mit welcher Methode gibt man Text auf der Konsole in C# aus?",
                                new String[]{"print()", "System.out.println()", "Console.WriteLine()", "echo"},
                                2,
                                new String[]{
                                        "Falsch: 'print()' wird in Python genutzt.",
                                        "Falsch: Das stammt aus Java.",
                                        "Korrekt! 'Console.WriteLine()' ist die Standard-Ausgabemethode im System-Namespace von C#.",
                                        "Falsch: 'echo' gehört zu PHP."
                                },
                                "C# Basis-I/O & System-Namespace"
                        )
                )
        ));

        // Lesson 2
        lessons.add(new Lesson(
                "csharp-2",
                "2. Kontrollfluss & Methoden in C#",
                "Programme müssen Entscheidungen treffen und wiederkehrende Aufgaben modularisieren. C# bietet ausdrucksstarke Kontrollstrukturen und strikt typisierte Methoden.",
                "Verzweigungen: 'if (bedingung) { ... } else { ... }' und moderne Switch-Expressions ('var status = code switch { ... };'). Schleifen: 'for', 'while' und besonders 'foreach (var item in collection)' zum sicheren Durchlaufen von Sammlungen. Methoden definieren zwingend ihren Rückgabetyp (oder 'void', falls kein Wert zurückgegeben wird).",
                "class Evaluator\n{\n    static bool IsPassed(int score)\n    {\n        return score >= 50;\n    }\n\n    static void Main()\n    {\n        int[] scores = { 45, 82, 90 };\n        foreach (int s in scores)\n        {\n            string msg = IsPassed(s) ? \"Bestanden ✅\" : \"Nicht bestanden ❌\";\n            Console.WriteLine($\"Score {s}: {msg}\");\n        }\n    }\n}",
                Arrays.asList(
                        new Question(
                                "q-cs-2-1",
                                "Welcher Rückgabetyp signalisiert in C#, dass eine Methode keinen Wert zurückgibt?",
                                new String[]{"null", "void", "empty", "none"},
                                1,
                                new String[]{
                                        "Falsch: 'null' ist ein Literal für leere Referenzen.",
                                        "Korrekt! 'void' kennzeichnet Methoden, die ausschließlich Seiteneffekte ausführen und keinen Wert zurückgeben.",
                                        "Falsch: 'empty' ist kein C#-Rückgabetyp.",
                                        "Falsch: 'none' stammt aus Python."
                                },
                                "IHK Methoden-Signaturen & Rückgabetypen"
                        ),
                        new Question(
                                "q-cs-2-2",
                                "Welche Schleife eignet sich in C# am besten, um alle Elemente einer Liste oder eines Arrays nacheinander zu durchlaufen?",
                                new String[]{"foreach", "repeat-until", "goto", "loop"},
                                0,
                                new String[]{
                                        "Korrekt! 'foreach' iteriert typsicher über jedes Element eines IEnumerable ohne manuelle Index-Verwaltung.",
                                        "Falsch: Existiert in C# nicht.",
                                        "Falsch: 'goto' ist ein Anti-Pattern für unstrukturierten Code.",
                                        "Falsch: 'loop' ist kein C#-Schlüsselwort."
                                },
                                "C# Kontrollstrukturen & Iteratoren"
                        )
                )
        ));

        // Lesson 3
        lessons.add(new Lesson(
                "csharp-3",
                "3. Objektorientierung (OOP: Klassen, Properties & Kapselung)",
                "In der realen Welt gibt es Autos, Kunden und Rechnungen. In der Objektorientierung modellieren wir diese Dinge als Klassen. Eine Klasse ist der Bauplan – ein Objekt ist die konkrete Instanz im Speicher.",
                "Klassen fassen Attribute und Methoden zusammen. In C# nutzt man Auto-Properties mit '{ get; set; }' für saubere Datenkapselung. Mit 'private set' darf der Wert von außen nur gelesen, aber nicht unkontrolliert manipuliert werden. Konstruktoren initialisieren neue Objekte.",
                "public class BankAccount\n{\n    public string AccountNumber { get; init; }\n    public decimal Balance { get; private set; }\n\n    public BankAccount(string accNum, decimal initialBalance)\n    {\n        AccountNumber = accNum;\n        Balance = initialBalance;\n    }\n\n    public void Deposit(decimal amount)\n    {\n        if (amount > 0) Balance += amount;\n    }\n}",
                Arrays.asList(
                        new Question(
                                "q-cs-3-1",
                                "Was ist der Unterschied zwischen einer Klasse und einem Objekt in C#?",
                                new String[]{
                                        "Eine Klasse ist der Bauplan; das Objekt ist die konkrete Instanz im Speicher.",
                                        "Objekte existieren nur im Internet, Klassen auf der Festplatte.",
                                        "Klassen sind Methoden, Objekte sind Variablen.",
                                        "Es gibt keinen Unterschied."
                                },
                                0,
                                new String[]{
                                        "Korrekt! Die Klasse definiert Struktur und Verhalten; das Objekt entsteht zur Laufzeit per 'new'.",
                                        "Falsch: Beide existieren im Prozessspeicher.",
                                        "Falsch: Klassen bündeln Felder, Properties und Methoden.",
                                        "Falsch: Das ist das Kernkonzept der Objektorientierung."
                                },
                                "IHK Objektorientierte Modellierung (OOP)"
                        ),
                        new Question(
                                "q-cs-3-2",
                                "Was bewirkt '{ get; private set; }' bei einer C#-Property?",
                                new String[]{
                                        "Niemand darf die Property lesen.",
                                        "Jeder darf den Wert lesen, aber nur Methoden der eigenen Klasse dürfen ihn verändern (Kapselung).",
                                        "Die Variable wird nach jedem Zugriff gelöscht.",
                                        "Der Wert wird verschlüsselt."
                                },
                                1,
                                new String[]{
                                        "Falsch: 'get' ist öffentlich lesbar.",
                                        "Korrekt! Dies schützt den internen Zustand vor unautorisierter Manipulation von außen.",
                                        "Falsch: Der Zustand bleibt erhalten.",
                                        "Falsch: Kapselung regelt Sichtbarkeit, keine Kryptografie."
                                },
                                "Kapselung & Access Modifier"
                        )
                )
        ));

        // Lesson 4
        lessons.add(new Lesson(
                "csharp-4",
                "4. Value Types vs. Reference Types (Stack vs. Heap)",
                "Wo legt der Computer Daten im Arbeitsspeicher ab? Das Verständnis von Stack und Heap unterscheidet Einsteiger von professionellen Software-Ingenieuren.",
                "Value Types ('struct', primitive Typen wie 'int', 'bool'): Liegen direkt auf dem extrem schnellen Stack. Bei Zuweisung wird der Wert kopiert. Reference Types ('class', 'string', 'Array'): Liegen auf dem Managed Heap. Die Variable auf dem Stack hält nur einen Zeiger (Referenz). Der Garbage Collector (GC) räumt verwaisten Heap-Speicher automatisch auf.",
                "// Value Type (Stack - Kopie):\nint a = 10;\nint b = a; // b hat eigenen Speicher mit Wert 10\n\n// Reference Type (Heap - Gemeinsamer Zeiger):\nvar acc1 = new BankAccount(\"DE123\", 500);\nvar acc2 = acc1; // acc2 zeigt auf dieselbe Adresse!\nacc2.Deposit(100);\n// acc1.Balance ist nun ebenfalls 600!",
                Arrays.asList(
                        new Question(
                                "q-cs-4-1",
                                "Wo werden primitive Wertetypen (Value Types wie int, double, struct) in C# gespeichert?",
                                new String[]{
                                        "Auf dem schnellen Call-Stack",
                                        "Auf einer externen Festplatte",
                                        "Auf dem Managed Heap",
                                        "In einer Cloud-Datenbank"
                                },
                                0,
                                new String[]{
                                        "Korrekt! Wertetypen werden direkt auf dem Stack des aktuellen Threads allokiert.",
                                        "Falsch: Variablen liegen im RAM.",
                                        "Falsch: Auf dem Heap liegen Referenztypen (Klassen).",
                                        "Falsch: Stack/Heap sind lokale Speicherbereiche."
                                },
                                "IHK .NET Speichermodell & Stack vs. Heap"
                        ),
                        new Question(
                                "q-cs-4-2",
                                "Was passiert bei einem sogenannten 'Boxing' in C#?",
                                new String[]{
                                        "Ein Reference Type wird in einen Value Type umgewandelt.",
                                        "Ein Value Type wird in ein System.Object auf dem Managed Heap verpackt.",
                                        "Eine Klasse wird gelöscht.",
                                        "Zwei Zahlen werden addiert."
                                },
                                1,
                                new String[]{
                                        "Falsch: Das Zurückwandeln nennt man 'Unboxing'.",
                                        "Korrekt! Boxing kapselt einen Stack-Wert in eine Objektreferenz auf dem Heap, was Allokations-Overhead erzeugt.",
                                        "Falsch: Boxing löscht keine Klassen.",
                                        "Falsch: Es ist ein Speichertyp-Vorgang."
                                },
                                "Boxing/Unboxing & Performance"
                        )
                )
        ));

        // Lesson 5
        lessons.add(new Lesson(
                "csharp-5",
                "5. Daten abfragen mit LINQ & Moderne C# Features",
                "Früher musste man endlose Schleifen schreiben, um Daten zu filtern oder zu sortieren. Mit LINQ (Language Integrated Query) formulierst du Datenabfragen direkt in C# deklarativ und absolut typsicher.",
                "Wichtige LINQ-Methoden: '.Where()' filtert Elemente, '.OrderBy()' sortiert, '.Select()' transformiert Felder, '.ToList()' materialisiert das Ergebnis. Nullable Reference Types ('string?') warnen den Entwickler bereits beim Kompilieren vor gefährlichen NullReferenceExceptions.",
                "using System.Linq;\n\nvar devs = new List<string> { \"Jeremy\", \"Anna\", \"Alexander\", \"Ben\" };\n\n// Alle Entwickler mit 'A' am Anfang, sortiert nach Länge:\nvar result = devs\n    .Where(d => d.StartsWith(\"A\"))\n    .OrderBy(d => d.Length)\n    .ToList();\n\nforeach (var name in result) Console.WriteLine(name);",
                Arrays.asList(
                        new Question(
                                "q-cs-5-1",
                                "Welche LINQ-Methode wird genutzt, um Elemente einer Sammlung nach einer Bedingung zu filtern?",
                                new String[]{".Filter()", ".Where()", ".FindAll()", ".Search()"},
                                1,
                                new String[]{
                                        "Falsch: In LINQ heißt die Standardmethode nicht '.Filter()'.",
                                        "Korrekt! '.Where(predicate)' ist der LINQ-Standard zum Filtern von Sammlungen.",
                                        "Falsch: '.FindAll()' ist eine List-Methode, gehört aber nicht zum Kern-LINQ-Standard.",
                                        "Falsch: Ungültige Methode."
                                },
                                "IHK LINQ & Deklarative Datenabfragen"
                        ),
                        new Question(
                                "q-cs-5-2",
                                "Was bedeutet das Fragezeichen bei der Typdeklaration 'string? name' in modernem C#?",
                                new String[]{
                                        "Dass die Variable unsicher ist.",
                                        "Dass die Variable explizit den Wert null annehmen darf (Nullable Reference Type).",
                                        "Dass die Variable nach einem Fehler sucht.",
                                        "Dass die Variable optional im HTML gerendert wird."
                                },
                                1,
                                new String[]{
                                        "Falsch: Es erhöht die Code-Sicherheit gegen NullPointer.",
                                        "Korrekt! Nullable Reference Types zwingen den Entwickler, vor dem Zugriff auf null zu prüfen.",
                                        "Falsch: Es ist eine statische Typ-Annotation.",
                                        "Falsch: Es betrifft die C#-Sprache, nicht HTML."
                                },
                                "C# Null-Safety & Type System"
                        )
                )
        ));

        return new Course("csharp", "C# & .NET Enterprise", "🔷", "Type-Safe & LINQ", "OOP, Memory Management, Generics, LINQ & Async/Await.", lessons);
    }
}
