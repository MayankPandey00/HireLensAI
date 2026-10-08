# HireLens AI 🔍⚡
> **"Before the interviewer finds your weakness, HireLens finds it."**  
> AI-powered placement readiness & Resume Reality Check platform for engineering students.

---

## 💡 The Core Problem
College students prepare for technical campus placements using their resumes and generic resources, but they don't know:
1. **Resume Reality Check:** Whether they can actually defend the technical claims made on their resume (e.g., Redis caching, microservices, containerization, database indexing) when an interviewer presses them on failure modes and trade-offs.
2. **Alignment:** Whether their skill profile aligns with their target company's hiring bar (e.g. Google L3, Amazon SDE 1, Microsoft, Atlassian).
3. **Comprehensive Readiness:** Whether they are ready across Aptitude, CS Fundamentals, DSA, and Communication.
4. **Top Risks:** What their biggest failure vulnerabilities are before walking into the interview.
5. **Interactive Remediation:** What exact topics they should learn next and in what order.

---

## 🚀 Key Features & Flow

1. **Landing Page:** Hero with electric aesthetic, core USP, value propositions, and quick recruiter hiring bars.
2. **Resume Setup (`/setup`):** PDF resume drag-and-drop or text paste mode, with 1-click sample prefill for instant hackathon evaluation.
3. **Resume Reality Check (`/reality-check`):**
   - Extracts technical claims under scrutiny.
   - Rates claim verifiability risk (`HIGH`, `MEDIUM`, `LOW`).
   - Generates the exact tough defense question an interviewer will ask.
   - Compares resume skills against target recruiter hiring bars.
4. **Placement Assessment (`/assessment`):**
   - 5 Quantitative & Logical Aptitude questions.
   - 5 CS Fundamentals questions (DBMS query plans, OS concurrency, TCP/IP, OOP).
   - 2 Algorithmic DSA problems with starter code and complexity proofs.
   - Timed quiz interface with category filtering and answer tracking.
5. **Virtual Interview Defense (`/interview`):**
   - Live architectural defense where candidate must defend the claims on their resume.
   - 3 Behavioral scenario questions evaluated with the STAR framework (Situation, Task, Action, Result).
6. **Results Dashboard (`/results`):**
   - Animated radial **Overall Readiness Score** (e.g., **71/100**).
   - 6 Category Competency Breakdown Cards with meters (Technical Knowledge, Aptitude, DSA, Communication, Project Defense, Role Alignment).
   - **TOP 3 RISKS Section** explicitly highlighting:
     1. **Project Defense**
     2. **DSA - Sliding Window**
     3. **DBMS - Query Optimization**
     - Detailed explanation for each risk: *Why it is weak*, *Evidence from assessment*, and *Recommended action*.
7. **Interactive Learning Mindmap (`/mindmap`):**
   - Interactive visual graph built with **React Flow**.
   - Color-coded nodes:
     - 🔴 **Red/Orange:** Weak areas (Top Critical Risks)
     - 🟡 **Yellow:** Moderate proficiency
     - 🟢 **Green:** Strong competency
   - Clicking any node opens a slide-out **Detail Drawer** showing:
     - Why the student needs it
     - Key topics to learn
     - Curated recommended resources & links
     - Estimated effort (e.g. `6-8 Hours`)
     - Tactical practice recommendations.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Flow (`reactflow`), Lucide React, Canvas Confetti.
- **Backend:** Node.js, Express, TypeScript, `multer`, `pdf-parse`, `uuid`, CORS.
- **AI Engine (Dual-Mode):**
  - Live **Google Gemini API** adapter (`gemini-1.5-flash`) via `GEMINI_API_KEY`.
  - Fallback **High-Fidelity Placement Simulator** requiring zero configuration or external API keys out of the box.

---

## 🏃 Running Locally

Both the backend and frontend are pre-configured to run concurrently:

```bash
# Terminal 1: Start Backend (Port 5000)
cd server
npm run dev

# Terminal 2: Start Frontend (Port 5173)
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### Optional Live LLM Configuration:
In `server/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If left empty, HireLens automatically uses its built-in realistic placement intelligence adapter).*
