# 📱 learn

[![CI Pipeline](https://github.com/benzjeremy/learn/actions/workflows/ci.yml/badge.svg)](https://github.com/benzjeremy/learn/actions/workflows/ci.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Go Report Card](https://goreportcard.com/badge/github.com/benzjeremy/learn)](https://goreportcard.com/report/github.com/benzjeremy/learn)
[![Website](https://img.shields.io/badge/Web-Live%20Cockpit-brightgreen)](https://benzjeremy.github.io/learn/)

> **Non-linear, privacy-first open-source code learning application** for Go, Astro, Python, HTML/CSS, JavaScript, and PHP.

An uncompromising, ad-free alternative to commercial platforms like Mimo or SoloLearn. Free from artificial paywalls, gating mechanics, and intrusive telemetry.

---

## 🌟 Key Highlights

* **🔓 100% Non-Linear:** Jump directly into any chapter (e.g. Go Concurrency or Astro SSR) without having to click through trivial basics.
* **🛡️ Zero-Telemetry & Offline-First:** No analytics SDKs, no Google Firebase, 100% GDPR-compliant. Works offline on planes and subways via local SQLite WAL storage and IndexedDB.
* **📱 Native Go & Fyne v2:** Compact Android APK (< 20 MB) and native desktop binaries for Linux (Wayland/X11) and Windows. Only ~25 MB RAM.
* **🌐 2-Tier Static Web Routing:**
  * **Landingpage & Showcase:** [`https://benzjeremy.github.io/learn/`](https://benzjeremy.github.io/learn/)
  * **Interactive Web Cockpit:** [`https://benzjeremy.github.io/learn/app/`](https://benzjeremy.github.io/learn/app/)
* **🔀 Git-Powered Content (`content` branch):** Didactics and lessons are cleanly decoupled from the engine. Contribute new languages via Pull Request!
* **🔔 Local Reminder System:** Daily habit reminders (configurable time, e.g. 18:00) and gentle inactivity nudges running 100% locally through native OS alarms.
* **🤖 Floating AI Robot Tutor:** Docked at the screen edge in every session for future interactive code assistance.

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
