# PeerPrep — Campus Skill Exchange Platform

PeerPrep is a slick, frontend-only web application designed to connect university students for mutual skill trading and academic support. Built with a modern, futuristic glassmorphism aesthetic, it operates on a peer-to-peer system where students earn **PeerPoints** by teaching their skills and spend them to learn from others.

---

## ✦ Key Features

* **Campus Skill Network:** Browse a curated feed of available peer tutors filtering through Tech, Design, Academic, Languages, Music, and Business categories.
* **The Bounty Board:** A live community request board where students can post urgent help requests (e.g., debugging a pointer issue) and offer custom compensation swaps.
* **AI CV & Resume Builder:** Simulated integration with Claude AI that processes user profile details, experience, and custom styling rules to generate structured, download-ready text resumes.
* **Gamified Ledger & Achievements:** Dynamic tracking of profile reputation scores, a live point progression bar, session scheduling statuses, and unlockable achievement badges.

---

## 📁 Repository Structure

The project features a highly modular layout organized cleanly within a single directory:

```plaintext
peer-prep/
├── peerprep.html   # Main application structure, layouts, modals, and templates
├── style.css       # Fully custom Syne & DM Sans styling variables, responsive grids, and orb animations
└── script.js      # App state configuration, search filtering, dynamic feed rendering, and UI flows

```

---

## 🛠️ Technical Breakdown

### Core Stack

* **HTML5 & CSS3:** Semantic content structure matched with modular custom properties (`:root`), flex/grid layouts, responsive breakpoints, and modern hardware-accelerated animations (`@keyframes`).
* **Vanilla JavaScript (ES6+):** Pure script architecture handling mock database states (`PEERS`, `BOUNTIES_INIT`, `BADGES`), client-side query searching/filtering routines, state transitions, and file generation blobs.

### Key Workflows Implemented

* **Contextual Routing:** Simulated multi-page layout via dynamic toggling of explicit visual container nodes (`.page.active`).
* **Live DOM Rendering:** Generates real-time structural cards dynamically matching user interactions (adding a custom skill, logging custom bounties).
* **File Streaming System:** Uses natural JavaScript client-side APIs (`Blob`, `URL.createObjectURL`) to safely convert processed visual strings into standard `.txt` text document downloads.

---

## 🚀 Getting Started Locally

Because PeerPrep runs purely on native client-side technologies, it requires **no external compilers, build tools, or package installations**.

### Quick Start

1. Extract the contents of the `peer-prep.zip` file.
2. Navigate to the `peer-prep/` folder directory.
3. Double-click `peerprep.html` or open it using any modern desktop web browser (Chrome, Edge, Safari, Firefox).

*Alternatively, right-click `peerprep.html` inside visual IDEs like VS Code and click **Open with Live Server** to keep updates synchronized seamlessly.*

---

## 💡 Usage Notes

* **Google Authentication:** Clicking "Continue with Google" on the login screen automatically signs you in with a pre-configured sample profile (`Aryan Sharma`) so you can explore full workspace functionality immediately.
* **Claude AI Connection:** The CV generation section uses an experimental asynchronous API structure. If a mock interface loop occurs or direct firewall blocks occur, fallback error handling switches to clean visual placeholders.