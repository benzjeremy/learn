# 📱 learn

[![CI Pipeline](https://github.com/benzjeremy/learn/actions/workflows/ci.yml/badge.svg)](https://github.com/benzjeremy/learn/actions/workflows/ci.yml)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Status: Pre-Release](https://img.shields.io/badge/Status-Pre--Release%20%2F%20WIP-orange.svg)](https://benzjeremy.github.io/learn/)
[![Go Report Card](https://goreportcard.com/badge/github.com/benzjeremy/learn)](https://goreportcard.com/report/github.com/benzjeremy/learn)
[![Website](https://img.shields.io/badge/Web-Live%20Cockpit-brightgreen)](https://benzjeremy.github.io/learn/)
[![Awesome Go](https://awesome.re/mentioned-badge.svg)](https://github.com/avelino/awesome-go)
[![Go Version](https://img.shields.io/badge/Go-1.22%2B-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![Security: Zero-Dummy](https://img.shields.io/badge/Security-Zero--Dummy--Standard-10b981.svg)](https://github.com/benzjeremy)

> [!IMPORTANT]
> ### 🚧 Pre-Release / Active Development Notice
> **This software is not yet finished and is under active development.**  
> All releases, Android APKs, and web modules are **Pre-Releases** (Work in Progress), even if not originally announced as such. Lessons, interactive exam simulators, and didactic feedback modules are continuously expanded and refined.

> **Privacy-first open-source code learning application** with interactive compiler lab, option-specific didactic feedback, and 90-minute final exams for Go, Astro, Python, HTML/CSS, JavaScript, SQL, C#, and PHP.

An uncompromising, ad-free alternative to commercial platforms like Mimo or SoloLearn. Free from artificial paywalls, gating mechanics, and intrusive telemetry.

---

## 🌟 Key Highlights

* **🛠️ Interactive Compiler Lab:** Real in-browser bugfixing challenges with realistic compiler diagnostic output, line numbers, and terminal exit codes.
* **💡 Option-Specific Didactic Feedback:** No solution-spoiling on incorrect inputs — the engine explains why your chosen token or operator is incorrect and encourages self-guided learning.
* **🎓 90-Minute Final Exam Simulations:** Realistic exam sessions with countdown timer, strict grading scale (grades 1–6), and complete reference solutions.
* **⚖️ Native In-App Legal & Privacy Notice (v2.2):** Embedded offline in-app legal disclosure complying with German § 5 DDG (Impressum), GDPR / DSGVO & TDDDG, and contact information without external redirects.
* **🛡️ Zero-Telemetry & Offline-First:** Zero network permissions requested (`android.permission.INTERNET` omitted), no analytics SDKs, no Google Firebase, 100% GDPR-compliant. Works offline anywhere.
* **📱 Native Android UI (v2.2):** Pure native Android application (zero WebView overhead) under 1 MB with 45 beginner lessons across 9 courses (Go, Python, Web, JS, SQL, C#, PHP, Astro, Security).
* **🌐 2-Tier Static Web Routing:**
  * **Landingpage & Showcase:** [`https://benzjeremy.github.io/learn/`](https://benzjeremy.github.io/learn/)
  * **Interactive Web Cockpit:** [`https://benzjeremy.github.io/learn/app/`](https://benzjeremy.github.io/learn/app/)
* **🔀 Git-Powered Content (`content` branch):** Didactics and lessons are cleanly decoupled from the engine. Contribute new languages via Pull Request!
* **🔔 Local Reminder System:** Daily habit reminders (configurable time, e.g. 18:00) and gentle inactivity nudges running 100% locally through native OS alarms.
* **🤖 Floating AI Robot Tutor:** Docked at the screen edge in every session for interactive code guidance.

---

## 🛡️ Zero-Dummy-Security Standards

- **AES-256-GCM** encryption for any persisted user state or configuration.
- **PBKDF2** key derivation with ≥100,000 iterations and 32-byte cryptographic random salt.
- **Strict Localhost Binding** (`127.0.0.1`) — no exposure to LAN or public interfaces without a reverse proxy.
- **Anti-DNS-Rebinding** and **Anti-CSRF** protection on all HTTP endpoints.
- **Cryptographic Token Authentication** for all API requests.
- **Zero Internet Permission** on Android — guaranteed offline operation.

---

## 🚀 Installation & Quick Start

### Go CLI
```bash
go install github.com/benzjeremy/learn/cmd/learn@latest
learn --cli
```

### Build from Source
```bash
git clone https://github.com/benzjeremy/learn.git
cd learn
go build -o learn ./cmd/learn
./learn --help
```

---

## 📦 Multi-Branch Architecture

* **`main`:** Core Go engine, CLI runner, local SQLite database, and Fyne v2 Android/Desktop client.
* **`web`:** 100% static bilingual showcase landingpage and interactive web learning cockpit on GitHub Pages.
* **`content`:** Pure JSON and Markdown curriculum with schema validation.

---

## 📜 License
This project is licensed under the [GNU General Public License v3.0](LICENSE).