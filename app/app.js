/**
 * learn Web App - Interactive Client Logic
 * 100% Static HTML/JS, Local-First, Zero-Telemetry
 */

(function() {
  'use strict';

  // State
  const state = {
    lang: localStorage.getItem('learn_lang') || 'de',
    theme: localStorage.getItem('site_theme') || 'dark',
    currentCourseId: 'go',
    currentChapter: null,
    currentSectionIndex: 0,
    courses: [],
    progress: JSON.parse(localStorage.getItem('learn_progress') || '{"completedSections":[],"xp":0,"streak":1,"lastActive":0}'),
    settings: JSON.parse(localStorage.getItem('learn_settings') || '{"reminderDaily":true,"reminderTime":"18:00","reminderInactivity":true}')
  };

  // Fallback Embedded Courses Data (100% Offline Resilience)
  const BUNDLED_COURSES = [
    {
      id: "go",
      title: { de: "Go (Golang)", en: "Go (Golang)" },
      icon: "⚡",
      badge: "Modern Systems",
      desc: { de: "Moderne Systemprogrammierung, Concurrency & Microservices.", en: "Modern systems programming, concurrency & microservices." },
      chapters: [
        {
          id: "go-01-basics",
          index: 1,
          title: { de: "1. Syntax, Variablen & Kontrollfluss", en: "1. Syntax, Variables & Control Flow" },
          duration: "10 min",
          sections: [
            {
              id: "go-01-s1",
              type: "concept",
              title: { de: "Das Go Package-System", en: "The Go Package System" },
              content: {
                de: "Jedes Go-Programm besteht aus Packages. Ausführbare Programme deklarieren immer `package main` und besitzen eine Funktion `func main()`.",
                en: "Every Go program consists of packages. Executable programs always declare `package main` and define a `func main()`."
              },
              code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Go!\")\n}"
            },
            {
              id: "go-01-s2",
              type: "quiz_choice",
              title: { de: "Variablen & Kurzdeklaration", en: "Variables & Short Declaration" },
              prompt: {
                de: "Welche Syntax initialisiert eine Variable in Go mit automatischer Typinferenz?",
                en: "Which syntax initializes a variable in Go with automatic type inference?"
              },
              options: ["x := 42", "var x = 42;", "let x = 42", "int x = 42"],
              solution: 0,
              explanation: {
                de: "`:=` ist der kanonische Kurzdeklarations-Operator für Variablen innerhalb von Go-Funktionen.",
                en: "`:=` is the canonical short declaration operator for local variables inside Go functions."
              }
            },
            {
              id: "go-01-s3",
              type: "quiz_code_puzzle",
              title: { de: "Schleifen in Go", en: "Loops in Go" },
              prompt: {
                de: "In Go gibt es nur ein einziges Schleifen-Schlüsselwort. Wähle das richtige Keyword:",
                en: "Go features only a single loop keyword. Select the correct keyword:"
              },
              codeSnippet: "___ i := 0; i < 5; i++ {\n    fmt.Println(i)\n}",
              options: ["while", "for", "loop", "repeat"],
              solution: "for",
              explanation: {
                de: "Go verzichtet bewusst auf `while`. Alle Schleifenarten werden mit `for` ausgedrückt.",
                en: "Go intentionally omits `while`. All looping logic is constructed via `for`."
              }
            }
          ]
        },
        {
          id: "go-04-concurrency",
          index: 4,
          title: { de: "4. Goroutines & Channels (Concurrency)", en: "4. Goroutines & Channels (Concurrency)" },
          duration: "20 min",
          sections: [
            {
              id: "go-04-s1",
              type: "concept",
              title: { de: "Goroutines starten", en: "Starting Goroutines" },
              content: {
                de: "Goroutines sind extrem leichtgewichtige Threads, die von der Go-Runtime verwaltet werden. Starte jede Funktion asynchron mit dem Keyword `go`.",
                en: "Goroutines are extremely lightweight threads managed by the Go runtime. Start any function concurrently using `go`."
              },
              code: "go doBackgroundWork()\n\n// Teilen von Speicher vermeiden — über Channels kommunizieren!"
            },
            {
              id: "go-04-s2",
              type: "quiz_choice",
              title: { de: "Ungepufferte Channels", en: "Unbuffered Channels" },
              prompt: {
                de: "Wie wird ein ungebufferter Channel für Strings korrekt erzeugt?",
                en: "How do you correctly create an unbuffered string channel?"
              },
              options: ["ch := make(chan string)", "ch := new(channel string)", "var ch = channel(string)", "ch := make(chan string, 10)"],
              solution: 0,
              explanation: {
                de: "`make(chan string)` erzeugt einen synchronen, ungepufferten Channel.",
                en: "`make(chan string)` initializes a synchronous, unbuffered channel."
              }
            }
          ]
        }
      ]
    },
    {
      id: "astro",
      title: { de: "Astro Framework", en: "Astro Framework" },
      icon: "🚀",
      badge: "Web Architecture",
      desc: { de: "Island Architecture, SSR und Content-First Webentwicklung.", en: "Island architecture, SSR and content-first web development." },
      chapters: [
        {
          id: "astro-01-intro",
          index: 1,
          title: { de: "1. Island Architecture & Zero-JS", en: "1. Island Architecture & Zero-JS" },
          duration: "10 min",
          sections: [
            {
              id: "astro-01-s1",
              type: "concept",
              title: { de: "Die Astro-Komponente", en: "The Astro Component" },
              content: {
                de: "Astro liefert standardmäßig 0 KB clientseitiges JavaScript aus. Komponenten werden im Dateiformat `.astro` geschrieben.",
                en: "Astro ships 0 KB client-side JavaScript by default. Components use the `.astro` extension."
              },
              code: "---\nconst title = \"Astro Island\";\n---\n<h1>{title}</h1>"
            },
            {
              id: "astro-01-s2",
              type: "quiz_choice",
              title: { de: "Interaktive Inseln", en: "Interactive Islands" },
              prompt: {
                de: "Welche Direktive hydriert eine interaktive UI-Komponente sofort beim Laden der Seite?",
                en: "Which directive hydrates an interactive UI component immediately on page load?"
              },
              options: ["client:load", "client:idle", "client:visible", "client:only"],
              solution: 0,
              explanation: {
                de: "`client:load` hydriert die Komponente mit höchster Priorität direkt beim Seitenstart.",
                en: "`client:load` hydrates the component with high priority immediately upon page load."
              }
            }
          ]
        }
      ]
    },
    {
      id: "python",
      title: { de: "Python 3", en: "Python 3" },
      icon: "🐍",
      badge: "Scripting & AI",
      desc: { de: "Elegante Syntax, Data Science & moderne Typisierung.", en: "Elegant syntax, data science & modern typing." },
      chapters: [
        {
          id: "py-01-basics",
          index: 1,
          title: { de: "1. List Comprehensions & F-Strings", en: "1. List Comprehensions & F-Strings" },
          duration: "10 min",
          sections: [
            {
              id: "py-01-s1",
              type: "concept",
              title: { de: "List Comprehension", en: "List Comprehension" },
              content: {
                de: "List Comprehensions ermöglichen das elegante Filtern und Transformieren von Listen in einer einzigen Zeile.",
                en: "List comprehensions offer concise one-liners to transform and filter lists."
              },
              code: "squares = [x**2 for x in range(5) if x % 2 != 0]\nprint(squares) # [1, 9]"
            },
            {
              id: "py-01-s2",
              type: "quiz_choice",
              title: { de: "F-Strings", en: "F-Strings" },
              prompt: {
                de: "Welcher Buchstabe kennzeichnet formatierte Strings in Python?",
                en: "Which prefix identifies formatted strings in Python?"
              },
              options: ["f", "s", "r", "format"],
              solution: 0,
              explanation: {
                de: "Das Präfix `f\"...\"` interpoliert Variablen direkt in den String.",
                en: "The prefix `f\"...\"` interpolates variables directly inside the string literal."
              }
            }
          ]
        }
      ]
    },
    {
      id: "html-css",
      title: { de: "HTML5 & CSS3", en: "HTML5 & CSS3" },
      icon: "🎨",
      badge: "Web Foundation",
      desc: { de: "Semantisches HTML, CSS Grid, Flexbox & WCAG AAA Kontraste.", en: "Semantic HTML, CSS Grid, Flexbox & WCAG AAA contrast." },
      chapters: [
        {
          id: "html-01-basics",
          index: 1,
          title: { de: "1. Semantische Struktur & Modernes Grid", en: "1. Semantic Structure & Modern Grid" },
          duration: "10 min",
          sections: [
            {
              id: "html-01-s1",
              type: "concept",
              title: { de: "Semantische Tags", en: "Semantic Tags" },
              content: {
                de: "Nutze semantische Container wie `<header>`, `<main>`, `<nav>` und `<article>` anstelle unstrukturierter `<div>`-Tags.",
                en: "Use semantic elements like `<header>`, `<main>`, `<nav>`, and `<article>` instead of div-soup."
              },
              code: "<main>\n  <article aria-labelledby=\"title\">\n    <h1 id=\"title\">Modern Web</h1>\n  </article>\n</main>"
            }
          ]
        }
      ]
    },
    {
      id: "javascript",
      title: { de: "JavaScript & TS", en: "JavaScript & TS" },
      icon: "📜",
      badge: "Fullstack",
      desc: { de: "Modernes ES6+, Asynchronität, Promises & Event-Loops.", en: "Modern ES6+, async/await, promises & event loops." },
      chapters: [
        {
          id: "js-01-basics",
          index: 1,
          title: { de: "1. Modernes Async/Await", en: "1. Modern Async/Await" },
          duration: "10 min",
          sections: [
            {
              id: "js-01-s1",
              type: "concept",
              title: { de: "Asynchronität mit Await", en: "Asynchrony with Await" },
              content: {
                de: "`async/await` vereinfacht den Umgang mit Promises radikal und sorgt für klaren Kontrollfluss.",
                en: "`async/await` flattens promise chains into clean, readable code."
              },
              code: "async function load() {\n  const res = await fetch('/data');\n  return await res.json();\n}"
            }
          ]
        }
      ]
    },
    {
      id: "php",
      title: { de: "Modernes PHP 8+", en: "Modern PHP 8+" },
      icon: "🐘",
      badge: "Backend Engine",
      desc: { de: "Objektorientierte Architektur & Constructor Property Promotion.", en: "Object-oriented architecture & constructor property promotion." },
      chapters: [
        {
          id: "php-01-basics",
          index: 1,
          title: { de: "1. PHP 8 Constructor Promotion", en: "1. PHP 8 Constructor Promotion" },
          duration: "10 min",
          sections: [
            {
              id: "php-01-s1",
              type: "concept",
              title: { de: "Constructor Property Promotion", en: "Constructor Property Promotion" },
              content: {
                de: "Properties können in PHP 8 direkt im Konstruktor mit Sichtbarkeit und Typ deklariert werden.",
                en: "In PHP 8, properties can be declared and typed directly inside constructor parameters."
              },
              code: "class User {\n    public function __construct(\n        public readonly string $id,\n        public string $email\n    ) {}\n}"
            }
          ]
        }
      ]
    }
  ];

  // DOM Elements
  let dom = {};

  function initDOM() {
    dom = {
      courseList: document.getElementById('courseList'),
      stageCourseTitle: document.getElementById('stageCourseTitle'),
      stageCourseDesc: document.getElementById('stageCourseDesc'),
      stageBadge: document.getElementById('stageBadge'),
      chapterGrid: document.getElementById('chapterGrid'),
      chapterView: document.getElementById('chapterView'),
      lessonPlayer: document.getElementById('lessonPlayer'),
      playerTitle: document.getElementById('playerTitle'),
      playerProgress: document.getElementById('playerProgress'),
      playerContent: document.getElementById('playerContent'),
      playerFeedback: document.getElementById('playerFeedback'),
      playerActions: document.getElementById('playerActions'),
      xpDisplay: document.getElementById('xpDisplay'),
      streakDisplay: document.getElementById('streakDisplay'),
      // Robot Widget
      robotBtn: document.getElementById('robotBtn'),
      robotDrawerBackdrop: document.getElementById('robotDrawerBackdrop'),
      closeRobotDrawer: document.getElementById('closeRobotDrawer'),
      // Settings Modal
      settingsBtn: document.getElementById('settingsBtn'),
      settingsModal: document.getElementById('settingsModal'),
      closeSettingsModal: document.getElementById('closeSettingsModal'),
      settingDailyReminder: document.getElementById('settingDailyReminder'),
      settingReminderTime: document.getElementById('settingReminderTime'),
      settingInactivity: document.getElementById('settingInactivity'),
      btnSaveSettings: document.getElementById('btnSaveSettings'),
      btnTestNotification: document.getElementById('btnTestNotification')
    };
  }

  // Set Language
  window.setLang = function(lang) {
    state.lang = lang;
    localStorage.setItem('learn_lang', lang);
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('btn-lang-' + lang);
    if (btn) btn.classList.add('active');
    
    // Refresh Current View
    renderCourseList();
    renderCourseStage();
    if (state.currentChapter) {
      renderLessonSection();
    }
  };

  // Toggle Theme
  window.toggleTheme = function() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('site_theme', state.theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = state.theme === 'dark' ? '🌙' : '☀️';
  };

  // Save Progress
  function saveProgress() {
    state.progress.lastActive = Date.now();
    localStorage.setItem('learn_progress', JSON.stringify(state.progress));
    dom.xpDisplay.textContent = state.progress.xp;
    dom.streakDisplay.textContent = state.progress.streak;
  }

  // Render Courses in Sidebar
  function renderCourseList() {
    dom.courseList.innerHTML = '';
    state.courses.forEach(course => {
      const btn = document.createElement('button');
      btn.className = `course-card-btn ${course.id === state.currentCourseId ? 'active' : ''}`;
      btn.onclick = () => selectCourse(course.id);
      
      const title = course.title[state.lang] || course.title.en;
      const desc = course.desc[state.lang] || course.desc.en;

      btn.innerHTML = `
        <div class="course-icon-box">${course.icon}</div>
        <div class="course-card-info">
          <div class="course-card-title">
            <span>${title}</span>
            <span class="course-badge">${course.badge}</span>
          </div>
          <div class="course-card-desc">${desc}</div>
        </div>
      `;
      dom.courseList.appendChild(btn);
    });
  }

  // Select Course
  function selectCourse(courseId) {
    state.currentCourseId = courseId;
    state.currentChapter = null;
    renderCourseList();
    renderCourseStage();
  }

  // Render Course Stage & Chapters
  function renderCourseStage() {
    const course = state.courses.find(c => c.id === state.currentCourseId);
    if (!course) return;

    dom.stageCourseTitle.textContent = course.title[state.lang] || course.title.en;
    dom.stageCourseDesc.textContent = course.desc[state.lang] || course.desc.en;
    dom.stageBadge.textContent = course.badge;

    // Show Chapter Grid, hide player
    dom.chapterView.style.display = 'block';
    dom.lessonPlayer.style.display = 'none';

    dom.chapterGrid.innerHTML = '';
    course.chapters.forEach(ch => {
      const card = document.createElement('div');
      const isCompleted = ch.sections.every(s => state.progress.completedSections.includes(s.id));
      card.className = `chapter-card ${isCompleted ? 'completed' : ''}`;
      card.onclick = () => startChapter(ch);

      const title = ch.title[state.lang] || ch.title.en;
      const statusText = isCompleted ? '✅ Abgeschlossen' : '🔓 Freier Einstieg';
      const statusTextEn = isCompleted ? '✅ Completed' : '🔓 Free Entry';

      card.innerHTML = `
        <div class="chapter-card-header">
          <span class="chapter-number">Kapitel ${ch.index}</span>
          <span class="chapter-status">${state.lang === 'de' ? statusText : statusTextEn}</span>
        </div>
        <h3 class="chapter-title">${title}</h3>
        <div class="chapter-footer">
          <span>⏱️ ${ch.duration}</span>
          <span class="btn-start-chapter">${state.lang === 'de' ? 'Starten →' : 'Start →'}</span>
        </div>
      `;
      dom.chapterGrid.appendChild(card);
    });
  }

  // Start Chapter
  function startChapter(chapter) {
    state.currentChapter = chapter;
    state.currentSectionIndex = 0;
    dom.chapterView.style.display = 'none';
    dom.lessonPlayer.style.display = 'flex';
    renderLessonSection();
  }

  // Close Player
  window.closePlayer = function() {
    state.currentChapter = null;
    renderCourseStage();
  };

  // Render Current Lesson Section
  function renderLessonSection() {
    const ch = state.currentChapter;
    if (!ch || !ch.sections[state.currentSectionIndex]) return;

    const section = ch.sections[state.currentSectionIndex];
    const total = ch.sections.length;
    const currentIdx = state.currentSectionIndex;

    // Progress
    const pct = Math.round(((currentIdx + 1) / total) * 100);
    dom.playerProgress.style.width = `${pct}%`;
    dom.playerTitle.textContent = `${ch.title[state.lang] || ch.title.en} (${currentIdx + 1}/${total})`;
    dom.playerFeedback.innerHTML = '';

    dom.playerContent.innerHTML = '';

    if (section.type === 'concept') {
      const title = section.title[state.lang] || section.title.en;
      const text = section.content[state.lang] || section.content.en;

      dom.playerContent.innerHTML = `
        <div class="concept-box">
          <h2 class="concept-title">${title}</h2>
          <p class="concept-body">${text}</p>
          ${section.code ? `<pre class="code-block-container"><code>${escapeHtml(section.code)}</code></pre>` : ''}
        </div>
      `;

      dom.playerActions.innerHTML = `
        <button class="btn-action" onclick="nextSection()">${state.lang === 'de' ? 'Verstanden & Weiter →' : 'Understood & Next →'}</button>
      `;

    } else if (section.type === 'quiz_choice') {
      const prompt = section.prompt[state.lang] || section.prompt.en;

      let optionsHtml = '';
      section.options.forEach((opt, idx) => {
        optionsHtml += `
          <button class="option-btn" onclick="selectQuizOption(${idx})">
            <span>${idx + 1}.</span>
            <span>${escapeHtml(opt)}</span>
          </button>
        `;
      });

      dom.playerContent.innerHTML = `
        <div class="quiz-box">
          <p class="quiz-prompt">${prompt}</p>
          <div class="options-grid" id="quizOptionsGrid">${optionsHtml}</div>
        </div>
      `;

      dom.playerActions.innerHTML = '';

    } else if (section.type === 'quiz_code_puzzle') {
      const prompt = section.prompt[state.lang] || section.prompt.en;

      let chipsHtml = '';
      section.options.forEach(opt => {
        chipsHtml += `<button class="option-btn" style="padding: 8px 14px;" onclick="selectPuzzleOption('${escapeHtml(opt)}')">${escapeHtml(opt)}</button>`;
      });

      dom.playerContent.innerHTML = `
        <div class="quiz-box">
          <p class="quiz-prompt">${prompt}</p>
          <pre class="code-block-container"><code id="puzzleCodePreview">${escapeHtml(section.codeSnippet)}</code></pre>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">${chipsHtml}</div>
        </div>
      `;

      dom.playerActions.innerHTML = '';
    }
  }

  // Escape HTML helper
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Select Quiz Choice
  window.selectQuizOption = function(selectedIdx) {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const isCorrect = selectedIdx === section.solution;

    const buttons = document.querySelectorAll('#quizOptionsGrid .option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === section.solution) btn.classList.add('correct');
      if (idx === selectedIdx && !isCorrect) btn.classList.add('wrong');
    });

    const explanation = section.explanation[state.lang] || section.explanation.en;

    if (isCorrect) {
      addXP(10, section.id);
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner success">
          <strong>${state.lang === 'de' ? '🎉 Richtig gelöst! (+10 XP)' : '🎉 Correct! (+10 XP)'}</strong>
          <span>${explanation}</span>
        </div>
      `;
    } else {
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner error">
          <strong>${state.lang === 'de' ? 'Nicht ganz! Erläuterung:' : 'Not quite! Explanation:'}</strong>
          <span>${explanation}</span>
        </div>
      `;
    }

    dom.playerActions.innerHTML = `
      <button class="btn-action" onclick="nextSection()">${state.lang === 'de' ? 'Weiter →' : 'Continue →'}</button>
    `;
  };

  // Select Puzzle Option
  window.selectPuzzleOption = function(selectedWord) {
    const ch = state.currentChapter;
    const section = ch.sections[state.currentSectionIndex];
    const isCorrect = selectedWord === section.solution;

    const explanation = section.explanation[state.lang] || section.explanation.en;

    if (isCorrect) {
      addXP(15, section.id);
      document.getElementById('puzzleCodePreview').textContent = section.codeSnippet.replace('___', selectedWord);
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner success">
          <strong>${state.lang === 'de' ? '🎉 Perfekt eingesetzt! (+15 XP)' : '🎉 Well done! (+15 XP)'}</strong>
          <span>${explanation}</span>
        </div>
      `;
    } else {
      dom.playerFeedback.innerHTML = `
        <div class="feedback-banner error">
          <strong>${state.lang === 'de' ? 'Das passt syntaktisch nicht:' : 'Syntax mismatch:'}</strong>
          <span>${explanation}</span>
        </div>
      `;
    }

    dom.playerActions.innerHTML = `
      <button class="btn-action" onclick="nextSection()">${state.lang === 'de' ? 'Weiter →' : 'Continue →'}</button>
    `;
  };

  // Add XP
  function addXP(amount, sectionId) {
    if (!state.progress.completedSections.includes(sectionId)) {
      state.progress.completedSections.push(sectionId);
      state.progress.xp += amount;
      saveProgress();
    }
  }

  // Next Section
  window.nextSection = function() {
    const ch = state.currentChapter;
    if (state.currentSectionIndex + 1 < ch.sections.length) {
      state.currentSectionIndex++;
      renderLessonSection();
    } else {
      // Chapter finished
      dom.playerProgress.style.width = '100%';
      dom.playerContent.innerHTML = `
        <div class="concept-box" style="text-align: center; padding: 24px 0;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🏆</div>
          <h2 class="concept-title">${state.lang === 'de' ? 'Kapitel erfolgreich abgeschlossen!' : 'Chapter Completed!'}</h2>
          <p class="concept-body">${state.lang === 'de' ? 'Großartige Leistung. Du kannst jederzeit in ein anderes Kapitel springen.' : 'Great job! You can jump into any other chapter at any time.'}</p>
        </div>
      `;
      dom.playerFeedback.innerHTML = '';
      dom.playerActions.innerHTML = `
        <button class="btn-action" onclick="closePlayer()">${state.lang === 'de' ? 'Zurück zur Übersicht' : 'Back to Overview'}</button>
      `;
    }
  };

  // Floating AI Robot Drawer Handlers
  function setupRobotWidget() {
    dom.robotBtn.onclick = () => {
      dom.robotDrawerBackdrop.classList.add('open');
    };

    dom.closeRobotDrawer.onclick = () => {
      dom.robotDrawerBackdrop.classList.remove('open');
    };

    dom.robotDrawerBackdrop.onclick = (e) => {
      if (e.target === dom.robotDrawerBackdrop) {
        dom.robotDrawerBackdrop.classList.remove('open');
      }
    };
  }

  // Settings Modal Handlers
  function setupSettingsModal() {
    dom.settingsBtn.onclick = () => {
      dom.settingDailyReminder.checked = state.settings.reminderDaily;
      dom.settingReminderTime.value = state.settings.reminderTime || '18:00';
      dom.settingInactivity.checked = state.settings.reminderInactivity;
      dom.settingsModal.classList.add('open');
    };

    dom.closeSettingsModal.onclick = () => {
      dom.settingsModal.classList.remove('open');
    };

    dom.settingsModal.onclick = (e) => {
      if (e.target === dom.settingsModal) {
        dom.settingsModal.classList.remove('open');
      }
    };

    dom.btnSaveSettings.onclick = () => {
      state.settings.reminderDaily = dom.settingDailyReminder.checked;
      state.settings.reminderTime = dom.settingReminderTime.value;
      state.settings.reminderInactivity = dom.settingInactivity.checked;
      localStorage.setItem('learn_settings', JSON.stringify(state.settings));
      dom.settingsModal.classList.remove('open');
    };

    dom.btnTestNotification.onclick = () => {
      if (!("Notification" in window)) {
        alert("Benachrichtigungen werden von diesem Browser nicht unterstützt.");
        return;
      }
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("learn · Zeit für deinen Code-Sprint! 🚀", {
            body: "Dein Go / Astro Kurs wartet auf dich. Nimm dir 5 Minuten Zeit!",
            icon: "assets/icon.png"
          });
        } else {
          alert("Benachrichtigungen wurden abgelehnt.");
        }
      });
    };
  }

  // Inactivity Check
  function checkInactivity() {
    if (!state.settings.reminderInactivity || !state.progress.lastActive) return;
    const now = Date.now();
    const daysSinceActive = (now - state.progress.lastActive) / (1000 * 60 * 60 * 24);
    if (daysSinceActive >= 3) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("learn · Hast du uns vergessen? 👋", {
          body: "Dein Kurs wartet auf dich. Schließe heute ein kurzes Kapitel ab!",
          icon: "assets/icon.png"
        });
      }
    }
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    state.courses = BUNDLED_COURSES;
    saveProgress();
    renderCourseList();
    renderCourseStage();
    setupRobotWidget();
    setupSettingsModal();
    checkInactivity();
  });

})();
