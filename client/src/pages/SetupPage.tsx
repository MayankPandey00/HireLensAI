import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  Building2, 
  Briefcase, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Code
} from 'lucide-react';
import { analyzeResume } from '../services/api';
import { LoadingOverlay } from '../components/LoadingOverlay';

const SAMPLE_RESUME_TEXT = `MAYANK PANDEY
Final Year B.Tech Computer Science & Engineering
Email: mayank.pandey@university.edu | GitHub: github.com/mayank | Portfolio: mayank.dev

EDUCATION:
Bachelor of Technology in Computer Science & Engineering (2021 - 2025)
CGPA: 8.8 / 10.0

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript, Python, C++, SQL
Frontend: React.js, Tailwind CSS, Redux Toolkit, Next.js
Backend: Node.js, Express.js, RESTful APIs, GraphQL
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2), Git

PROJECTS:
1. Distributed E-Commerce Microservices Platform
- Architected high-throughput backend services using Node.js, Express, and Docker containers.
- Implemented high-throughput Redis caching layer reducing API response time by 45% and mitigating database read bottlenecks.
- Designed relational PostgreSQL database schema with indexed queries handling 50,000+ mock order records.

2. Real-Time Collaborative Code Canvas
- Built full-stack collaborative editor using React.js and WebSocket protocol supporting concurrent editing.
- Engineered conflict resolution mechanism and automated state synchronization across 20+ simultaneous clients.
- Deployed automated CI/CD pipeline using GitHub Actions and AWS EC2 with Nginx reverse proxy.

ACHIEVEMENTS & RELEVANT COURSEWORK:
- Solved 400+ problems on LeetCode across Data Structures, Dynamic Programming, and Graph algorithms.
- Core Coursework: Database Management Systems (DBMS), Operating Systems, Computer Networks, Object-Oriented Programming (OOP).`;

const COMPANY_SUGGESTIONS = [
  { name: 'Google', defaultRole: 'Software Engineer (L3)' },
  { name: 'Amazon', defaultRole: 'Software Development Engineer I (SDE 1)' },
  { name: 'Microsoft', defaultRole: 'Software Engineer' },
  { name: 'Atlassian', defaultRole: 'Associate Software Engineer' },
];

export const SetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [targetRole, setTargetRole] = useState<string>('Software Engineer (L3)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setErrorMessage('Please upload a valid PDF document.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handlePreloadSample = () => {
    setActiveTab('text');
    setResumeText(SAMPLE_RESUME_TEXT);
    setTargetCompany('Google');
    setTargetRole('Software Engineer (L3)');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (activeTab === 'upload' && !selectedFile) {
      setErrorMessage('Please select a PDF resume file to upload, or switch to the text tab.');
      return;
    }

    if (activeTab === 'text' && (!resumeText || resumeText.trim().length < 50)) {
      setErrorMessage('Please provide sufficient resume text (at least 50 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (activeTab === 'upload' && selectedFile) {
        formData.append('resume', selectedFile);
      } else {
        formData.append('resumeText', resumeText);
      }
      formData.append('targetCompany', targetCompany);
      formData.append('targetRole', targetRole);

      const response = await analyzeResume(formData);

      // Save session info to sessionStorage
      sessionStorage.setItem('hirelens_sessionId', response.sessionId);
      sessionStorage.setItem('hirelens_realityCheck', JSON.stringify(response.realityCheck));

      navigate('/reality-check');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Failed to complete resume reality check.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {isSubmitting && (
        <LoadingOverlay
          title="Performing Resume Reality Check"
          steps={[
            'Extracting text & technical claims from resume...',
            `Benchmarking requirements for ${targetCompany} (${targetRole})...`,
            'Identifying high-risk claims & potential gaps...',
            'Synthesizing interviewer defense questions...',
          ]}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs text-cyan-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stage 1 of 5: Setup & Intake</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Upload Your Resume & Target Role
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          HireLens tests whether your resume can withstand tough technical interviewers and identifies what to fix.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Target Company & Role Selection Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Target Recruiter & Role
            </h2>
            <span className="text-xs text-slate-400">Calibrates the evaluation bar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Target Company
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google, Amazon, Microsoft, Atlassian"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {COMPANY_SUGGESTIONS.map((comp) => (
                  <button
                    type="button"
                    key={comp.name}
                    onClick={() => {
                      setTargetCompany(comp.name);
                      setTargetRole(comp.defaultRole);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      targetCompany.toLowerCase() === comp.name.toLowerCase()
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Target Job Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer (L3), SDE 1, Graduate Engineer"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                HireLens uses this to simulate the exact round structure and focus topics.
              </p>
            </div>
          </div>
        </div>

        {/* Resume Input Mode (Upload vs Text) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Candidate Resume
              </span>
            </div>

            {/* Tab switchers + Sample Pre-fill */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreloadSample}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-900/80 transition-all shadow-sm"
              >
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pre-fill Sample Resume (1-Click)</span>
              </button>

              <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'upload'
                      ? 'bg-cyan-500 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'text'
                      ? 'bg-cyan-500 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'upload' ? (
            /* PDF Upload Box */
            <div className="relative border-2 border-dashed border-slate-700/80 hover:border-cyan-500/60 rounded-2xl p-8 text-center transition-colors bg-slate-900/30">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-700/40 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-950/50">
                  <UploadCloud className="w-7 h-7" />
                </div>
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 justify-center">
                      <CheckCircle className="w-4 h-4" />
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-200 mb-1">
                      Drag and drop your PDF resume, or <span className="text-cyan-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Standard single or multi-page PDF resumes up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Paste Text Area */
            <div className="space-y-2">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your plain resume text here..."
                rows={12}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 flex justify-between">
                <span>Text mode is ideal for rapid testing and formatted exports.</span>
                <span>{resumeText.length} characters</span>
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span>Analyze Resume & Run Reality Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
