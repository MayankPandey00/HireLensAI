import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { SetupPage } from './pages/SetupPage';
import { RealityCheckPage } from './pages/RealityCheckPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { InterviewDefensePage } from './pages/InterviewDefensePage';
import { ResultsDashboardPage } from './pages/ResultsDashboardPage';
import { LearningMindmapPage } from './pages/LearningMindmapPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/reality-check" element={<RealityCheckPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/interview" element={<InterviewDefensePage />} />
            <Route path="/results" element={<ResultsDashboardPage />} />
            <Route path="/mindmap" element={<LearningMindmapPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
