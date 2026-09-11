# 📚 Learn App Content Repository (`content` branch)

This branch acts as a lightweight, headless content server for the open-source **learn** platform. It contains all structured courses, chapters, quizzes, and code challenges in versioned JSON and Markdown formats.

## 🗂️ Directory Structure

```text
.
├── courses.json                     # Root course catalog listing all languages
├── schemas/
│   └── chapter-v1.json             # JSON Schema specification for chapters
├── go/
│   ├── manifest.json                # Chapter indices and metadata for Go
│   ├── 01-basics.json               # Chapter 1: Variables, Types & Control Flow
│   └── 04-concurrency.json          # Chapter 4: Goroutines, Channels & Concurrency
├── astro/
│   ├── manifest.json
│   └── 01-intro.json                # Chapter 1: Island Architecture & Components
├── python/
│   ├── manifest.json
│   └── 01-basics.json
├── html-css/
│   ├── manifest.json
│   └── 01-basics.json
├── javascript/
│   ├── manifest.json
│   └── 01-basics.json
└── php/
    ├── manifest.json
    └── 01-basics.json
```

## 🤝 Contributing New Lessons
1. Fork this repository and branch off `content`.
2. Ensure your chapter JSON validates against `schemas/chapter-v1.json`.
3. Provide high quality, non-linear lessons in both German (`de`) and English (`en`).
4. Submit a Pull Request. Once merged, all clients (Mobile APK, Desktop, Web) will automatically pull the updated lessons without requiring binary rebuilds!

## 📜 License
Licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).
