# HireLens AI 🔍⚡
> **"Before the interviewer finds your weakness, HireLens finds it."**  
> AI-powered placement readiness & Resume Reality Check platform for engineering students.

---

## 💡 The Core Problem
College students prepare for technical campus placements using their resumes and generic resources, but they don't know:
1. **Resume Reality Check:** Whether they can actually defend the technical claims made on their resume (e.g., Redis caching, microservices, containerization, database indexing) when an interviewer presses them on failure modes and trade-offs.
2. **Alignment:** Whether their skill profile aligns with their target company's hiring bar (e.g. Google L3, Amazon SDE 1, Microsoft, Atlassian).
3. **Dynamic Assessment:** Practice questions that dynamically refresh on every test attempt across Aptitude, CS Core, DSA, and Behavioral.
4. **Top Risks:** What their biggest failure vulnerabilities are before walking into the interview.
5. **Interactive Remediation:** What exact topics they should learn next and in what order.

---

## 🚀 Key Features & Workflow

1. **Landing Page:** Hero with electric aesthetic, core USP, value propositions, and recruiter hiring bar calibrators.
2. **Resume Setup (`/setup`):** PDF resume drag-and-drop intake with 1-click **Pre-fill Random Sample Resume** rotation (Alex Rivers, Jordan Lee, Sam Taylor, Morgan Chen).
3. **Resume Reality Check (`/reality-check`):**
   - Extracts technical claims under scrutiny.
   - Rates claim verifiability risk (`HIGH`, `MEDIUM`, `LOW`).
   - Generates tough interviewer defense questions tailored to candidate claims.
   - Compares resume skills against target recruiter hiring bars.
4. **Dynamic Placement Assessment (`/assessment`):**
   - **100% Dynamic Questions:** Shuffled and generated fresh on every attempt from extensive topic banks (`questionBank.ts`).
   - 5 Quantitative & Logical Aptitude questions.
   - 5 CS Fundamentals questions (DBMS query plans, OS concurrency, TCP/IP, OOP).
   - 2 Algorithmic DSA problems with starter code and complexity proofs.
   - **Live Countdown Timer (`MM:SS`)**: Real-time test clock with color-coded warning (<5m amber, <1m red pulse).
   - **Strict Sequential Navigation:** Tab-jumping disabled, leaving confirmation dialogs, and test reset on exit.
5. **Virtual Interview Defense (`/interview`):**
   - Live architectural defense where candidate defends technical claims from their resume.
   - Behavioral scenario questions evaluated with the STAR framework (Situation, Task, Action, Result).
   - Assessment lock preventing unauthorized re-entry to completed tests.
6. **Results Dashboard (`/results`):**
   - Animated radial **Overall Readiness Score** (e.g., **71/100**).
   - 6 Category Competency Breakdown Cards with meters (Technical Knowledge, Aptitude, DSA, Communication, Project Defense, Role Alignment).
   - **TOP 3 RISKS Section** explicitly highlighting critical failure vulnerabilities.
7. **Interactive Learning Mindmap (`/mindmap`):**
   - Interactive visual graph built with **React Flow**.
   - Color-coded nodes (Red/Orange = Weak areas, Yellow = Moderate, Green = Strong).
   - Detail Drawer with curated recommended resources, key topics, and effort estimates.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Flow (`reactflow`), Lucide React, Canvas Confetti.
- **Backend:** Node.js, Express, TypeScript, `multer`, `pdf-parse`, `uuid`, CORS, `tsx`.
- **AI Engine (Dual-Mode):**
  - Live **Google Gemini API** adapter (`gemini-1.5-flash`) via `GEMINI_API_KEY`.
  - Fallback **High-Fidelity Placement Simulator** requiring zero configuration or external API keys out of the box.

---

## 🏃 Running Locally

```bash
# Build client and server
npm run build

# Start both Backend & Frontend concurrently
npm run dev
```

Visit **`http://localhost:5173`** (or `http://localhost:5174`).

---

## 🌐 Deploying on Render (Single Web Service)

HireLens AI is configured for a **1-click single Web Service deployment on Render** that hosts both the Express API and the React Vite Frontend together from one single URL.

### Single Web Service Deployment Steps:

1. Sign in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ Select **Web Service**.
3. Connect your GitHub repository: `https://github.com/MayankPandey00/HireLensAI`.
4. Configure the settings:
   - **Name:** `hirelens-ai`
   - **Language / Runtime:** `Node`
   - **Branch:** `main`
   - **Build Command:**
     ```bash
     npm install && npm --prefix server install && npm --prefix client install && npm run build
     ```
   - **Start Command:**
     ```bash
     node server/dist/server.js
     ```
   - **Instance Type:** `Free`
5. Environment Variables (optional under **Environment** tab):
   - `GEMINI_API_KEY` = *(Optional)* Your Google Gemini API key
6. Click **Create Web Service**.

Render will automatically build both frontend & backend and launch your full application under a single URL (e.g., `https://hirelens-ai.onrender.com`).

---

## 📤 Pushing Changes to GitHub

```bash
git add .
git commit -m "feat: single deployment config for render and readme update"
git push origin main
```
