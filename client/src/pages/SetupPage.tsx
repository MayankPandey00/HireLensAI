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

const SAMPLE_RESUMES = [
  `ALEX RIVERS
Final Year B.Tech Computer Science & Engineering
Email: alex.rivers@sample-university.edu | GitHub: github.com/alex-rivers-sample | Portfolio: alexrivers.dev

EDUCATION:
Bachelor of Technology in Computer Science & Engineering (2021 - 2025)
CGPA: 8.9 / 10.0

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
- Solved 450+ problems on LeetCode across Data Structures, Dynamic Programming, and Graph algorithms.
- Core Coursework: Database Management Systems (DBMS), Operating Systems, Computer Networks, Object-Oriented Programming (OOP).`,

  `JORDAN LEE
Final Year B.Tech Computer Science & Engineering
Email: jordan.lee@sample-university.edu | GitHub: github.com/jordan-lee-sample | Portfolio: jordanlee.dev

EDUCATION:
Bachelor of Technology in Computer Science & Engineering (2021 - 2025)
CGPA: 9.1 / 10.0

TECHNICAL SKILLS:
Languages: Java, C++, Go, Python, SQL
Backend & Systems: Spring Boot, gRPC, Apache Kafka, Microservices Architecture
Databases & Storage: PostgreSQL, Redis, Cassandra, ElasticSearch
DevOps & Cloud: Docker, Kubernetes, AWS (Lambda, ECS, DynamoDB), Git, CI/CD

PROJECTS:
1. High-Throughput Event Streaming & Analytics Engine
- Developed an asynchronous event ingestion pipeline using Go, Apache Kafka, and Redis caching.
- Processed 10,000+ mock events/sec with sub-50ms latency using partition key tuning and worker pool pattern.
- Optimized PostgreSQL database indexes and execution plans, reducing query overhead by 60%.

2. Containerized Microservices Payment Gateway
- Built resilient payment processing backend in Spring Boot with circuit breaker pattern and retry logic.
- Implemented JWT authentication with rate-limiting middleware to defend against DDoS attacks.
- Automated multi-container orchestration using Docker Compose and Kubernetes deployment manifests.

ACHIEVEMENTS & RELEVANT COURSEWORK:
- Global Rank Top 5% in competitive programming contests (LeetCode / CodeChef).
- Core Coursework: Distributed Systems, Operating Systems, Advanced Database Systems, Computer Networks.`,

  `SAM TAYLOR
Final Year B.Tech Computer Science & Engineering
Email: sam.taylor@sample-university.edu | GitHub: github.com/sam-taylor-sample | Portfolio: samtaylor.dev

EDUCATION:
Bachelor of Technology in Computer Science & Engineering (2021 - 2025)
CGPA: 8.7 / 10.0

TECHNICAL SKILLS:
Languages: TypeScript, Python, Java, SQL, Rust
Frontend & Mobile: React.js, Next.js, Tailwind CSS, WebSockets
Backend & Cloud: Node.js, FastAPI, Docker, Kubernetes, AWS, Serverless
Databases & Caching: MongoDB, PostgreSQL, Redis, DynamoDB

PROJECTS:
1. Real-Time Distributed Task Queue & Monitoring Dashboard
- Designed distributed task scheduling platform using Python, Redis Streams, and FastAPI.
- Implemented real-time telemetry streaming via WebSockets to a React/Next.js dashboard.
- Containerized application with Docker and configured horizontal pod autoscaling on Kubernetes.

2. Cloud-Native Media Processing Microservices
- Engineered serverless video processing workflow leveraging AWS S3, Lambda, and DynamoDB.
- Integrated JWT authentication and RBAC authorization middleware to secure API endpoints.
- Managed infrastructure as code using Terraform and automated testing via GitHub Actions.

ACHIEVEMENTS & RELEVANT COURSEWORK:
- Open-source contributor to modern web frameworks and developer toolings.
- Core Coursework: Cloud Computing, Software Architecture, Web Security, System Design.`,

  `MORGAN CHEN
Final Year B.Tech Computer Science & Engineering
Email: morgan.chen@sample-university.edu | GitHub: github.com/morgan-chen-sample | Portfolio: morganchen.dev

EDUCATION:
Bachelor of Technology in Computer Science & Engineering (2021 - 2025)
CGPA: 9.0 / 10.0

TECHNICAL SKILLS:
Languages: Python, Scala, Java, SQL, C++
Big Data & Streaming: Apache Spark, Apache Kafka, Airflow, Hadoop
Databases & Cloud: Snowflake, PostgreSQL, MongoDB, Redis, AWS (S3, EMR)
Tools & DevOps: Docker, Git, Linux/Unix Shell Scripting, CI/CD

PROJECTS:
1. Real-Time Fraud Detection Pipeline
- Built scalable streaming pipeline with Apache Spark Streaming and Kafka to process transaction streams.
- Achieved real-time feature generation and anomaly detection with under 100ms end-to-end processing delay.
- Optimized query performance on PostgreSQL analytics tables using partitioning and materialized views.

2. Automated Data Pipeline Orchestration Engine
- Developed modular Apache Airflow DAGs for automated ETL workflows processing 100GB+ daily synthetic datasets.
- Implemented automated data validation checks and alert notifications for pipeline failures.
- Containerized workflow execution environment using Docker and deployed on AWS EC2.

ACHIEVEMENTS & RELEVANT COURSEWORK:
- Winner at National Level Hackathon for Data Platform Innovation.
- Core Coursework: Big Data Processing, Data Structures & Algorithms, Database Systems, Computer Networks.`
];

const COMPANY_SUGGESTIONS = [
  { name: 'Google', defaultRole: 'Software Engineer (L3)' },
  { name: 'Amazon', defaultRole: 'Software Development Engineer I (SDE 1)' },
  { name: 'Microsoft', defaultRole: 'Software Engineer' },
  { name: 'Atlassian', defaultRole: 'Associate Software Engineer' },
];

export const SetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sampleResumeText, setSampleResumeText] = useState<string>('');
  const [sampleCandidateName, setSampleCandidateName] = useState<string>('');
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
      setSampleResumeText('');
      setSampleCandidateName('');
      setErrorMessage(null);
    }
  };

  const handlePreloadSample = () => {
    let randomIndex = Math.floor(Math.random() * SAMPLE_RESUMES.length);
    if (SAMPLE_RESUMES.length > 1 && SAMPLE_RESUMES[randomIndex] === sampleResumeText) {
      randomIndex = (randomIndex + 1) % SAMPLE_RESUMES.length;
    }
    const chosenSample = SAMPLE_RESUMES[randomIndex];
    const candidateName = chosenSample.split('\n')[0].trim();

    setSampleResumeText(chosenSample);
    setSampleCandidateName(candidateName);
    setSelectedFile(null);
    setTargetCompany('Google');
    setTargetRole('Software Engineer (L3)');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedFile && !sampleResumeText) {
      setErrorMessage('Please upload a PDF resume file or click "Pre-fill Random Sample Resume".');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append('resume', selectedFile);
      } else if (sampleResumeText) {
        formData.append('resumeText', sampleResumeText);
      }
      formData.append('targetCompany', targetCompany);
      formData.append('targetRole', targetRole);

      const response = await analyzeResume(formData);

      // Clear previous session flags so a fresh new assessment can be taken
      sessionStorage.removeItem('hirelens_test_completed');
      sessionStorage.removeItem('hirelens_test_startTime');
      sessionStorage.removeItem('hirelens_assessmentBundle');
      sessionStorage.removeItem('hirelens_assessmentId');
      sessionStorage.removeItem('hirelens_answers');
      sessionStorage.removeItem('hirelens_report');

      // Save new session info to sessionStorage
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

        {/* Candidate Resume Upload Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Candidate Resume
              </span>
            </div>

            {/* Sample Pre-fill Button */}
            <button
              type="button"
              onClick={handlePreloadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-900/80 transition-all shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pre-fill Random Sample Resume</span>
            </button>
          </div>

          {/* PDF Upload Box */}
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
              ) : sampleCandidateName ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-cyan-300 flex items-center gap-1.5 justify-center">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    Sample Resume Pre-filled: {sampleCandidateName}
                  </p>
                  <p className="text-xs text-slate-400">
                    Sample profile loaded • Drag & drop a PDF anytime to replace, or click Pre-fill again for another sample
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
