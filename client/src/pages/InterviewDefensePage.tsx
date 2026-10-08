import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Lightbulb, 
  AlertTriangle,
  Award,
  CheckCircle2
} from 'lucide-react';
import { AssessmentBundle, StudentAnswer, ResumeRealityCheck } from '../types';
import { evaluateAssessment } from '../services/api';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const InterviewDefensePage: React.FC = () => {
  const navigate = useNavigate();

  const [bundle, setBundle] = useState<AssessmentBundle | null>(null);
  const [realityCheck, setRealityCheck] = useState<ResumeRealityCheck | null>(null);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHomePromptModal, setShowHomePromptModal] = useState(false);

  useEffect(() => {
    // Mark assessment completed so navigating back to /assessment is blocked
    sessionStorage.setItem('hirelens_test_completed', 'true');

    // Intercept back button popstate
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setShowHomePromptModal(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const rawBundle = sessionStorage.getItem('hirelens_assessmentBundle');
    const rawRC = sessionStorage.getItem('hirelens_realityCheck');
    const rawAns = sessionStorage.getItem('hirelens_answers');

    if (rawBundle && rawRC) {
      try {
        setBundle(JSON.parse(rawBundle));
        setRealityCheck(JSON.parse(rawRC));
        if (rawAns) {
          setAnswers(JSON.parse(rawAns));
        }
      } catch (e) {
        console.error('Failed to parse interview data');
      }
    } else {
      navigate('/assessment');
    }
  }, [navigate]);

  if (!bundle || !realityCheck) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading interview defense questions...
      </div>
    );
  }

  // Filter behavioral and project defense questions
  const interviewQuestions = bundle.questions.filter(q => 
    q.category === 'communication' || q.category === 'project_defense'
  );

  const handleAnswerChange = (questionId: string, text: string) => {
    const updated = {
      ...answers,
      [questionId]: {
        questionId,
        answerText: text,
      },
    };
    setAnswers(updated);
    sessionStorage.setItem('hirelens_answers', JSON.stringify(updated));
  };

  const handlePreFillInterviewAnswers = () => {
    const mockInterviewAns: Record<string, StudentAnswer> = {};

    interviewQuestions.forEach(q => {
      if (q.category === 'communication') {
        mockInterviewAns[q.id] = {
          questionId: q.id,
          answerText: 'In our capstone engineering project, when facing technical disagreement or high-pressure deadlines, I scheduled structured benchmarking sessions, evaluated trade-offs transparently using technical metrics (latency, schema consistency, maintainability), and communicated findings clearly to ensure alignment.'
        };
      } else if (q.category === 'project_defense') {
        mockInterviewAns[q.id] = {
          questionId: q.id,
          answerText: 'We implemented our technical claims using industry standard practices, modular architecture, and unit testing. Under load testing, we optimized query execution plans, tuned connection pooling parameters, and monitored resource utilization using APM metrics.'
        };
      }
    });

    const combined = { ...answers, ...mockInterviewAns };
    setAnswers(combined);
    sessionStorage.setItem('hirelens_answers', JSON.stringify(combined));
  };

  const handleSubmitEvaluation = async () => {
    const sessionId = sessionStorage.getItem('hirelens_sessionId');
    const assessmentId = sessionStorage.getItem('hirelens_assessmentId');

    if (!sessionId || !assessmentId) {
      setError('Missing session identifiers. Please restart setup.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const allAnswersArray = Object.values(answers);
      const res = await evaluateAssessment(assessmentId, sessionId, allAnswersArray);

      sessionStorage.setItem('hirelens_report', JSON.stringify(res.report));
      navigate('/results');
    } catch (err: any) {
      console.error('Evaluation error:', err);
      setError(err.message || 'Failed to submit evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {isSubmitting && (
        <LoadingOverlay
          title="Analyzing Assessment & Computing Readiness Score"
          steps={[
            'Scoring technical correctness across CS Fundamentals & DSA...',
            'Evaluating depth of Resume Claim defense explanations...',
            'Benchmarking overall readiness against 71/100 baseline...',
            'Extracting Top 3 Critical Risks with concrete evidence...',
            'Generating interactive React Flow learning mindmap...',
          ]}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-xs text-purple-300 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Stage 4 of 5: Virtual Defense & Behavioral</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Resume Reality Check & Behavioral Round
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Defend your technical claims and demonstrate structured STAR communication.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePreFillInterviewAnswers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-900/80 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Auto-fill Sample Defense (Demo)</span>
        </button>
      </div>

      {/* Project Claim Defense Section */}
      <div className="space-y-6 mb-10">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Part 1: Defending Your Resume Claims
          </h2>
          <p className="text-xs text-slate-400">
            Interviewers test whether you can defend specific architectural claims made on your resume.
          </p>
        </div>

        {interviewQuestions.filter(q => q.category === 'project_defense').map((q, idx) => (
          <div key={q.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">
                Claim Defense Question #{idx + 1}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                High Risk Defense
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm font-medium text-slate-200 leading-relaxed whitespace-pre-line">
              {q.prompt}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Your Architectural Defense:
                </span>
                <span className="text-[11px] text-slate-400">Explain trade-offs, eviction policies, failure modes</span>
              </div>
              <textarea
                rows={5}
                value={answers[q.id]?.answerText || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder="Walk through your architectural choices, why you picked this approach, and how you handled edge cases..."
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Behavioral & STAR Communication Section */}
      <div className="space-y-6 mb-10">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Part 2: Behavioral & Situational (STAR Framework)
          </h2>
          <p className="text-xs text-slate-400">
            Structure your answers with Situation, Task, Action, and measurable Result.
          </p>
        </div>

        {interviewQuestions.filter(q => q.category === 'communication').map((q, idx) => (
          <div key={q.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400">
                Behavioral Scenario #{idx + 1}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                STAR Communication
              </span>
            </div>

            <div className="text-sm font-medium text-slate-200 leading-relaxed">
              {q.prompt}
            </div>

            <div className="space-y-1.5">
              <textarea
                rows={4}
                value={answers[q.id]?.answerText || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder="Structure: Situation -> Task -> Action taken -> Final outcome / learning..."
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3.5 mb-6 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Final Submit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-white">Ready for your Placement Audit Report?</h4>
          <p className="text-xs text-slate-400">
            AI will calculate your overall readiness, top 3 failure risks, and build your interactive roadmap.
          </p>
        </div>

        <button
          onClick={handleSubmitEvaluation}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span>Generate Readiness Report & Mindmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Home Navigation Confirmation Modal */}
      {showHomePromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 max-w-md w-full shadow-2xl space-y-5 bg-slate-900/95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-700 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-indigo-950">
              <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Test is Completed</h3>
              <p className="text-xs text-slate-400">
                Your technical assessment is completed. Going back to assessment is disabled.
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Do you want to move to the Home page?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowHomePromptModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                Stay on Defense Page
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-white hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
              >
                Yes, Move to Home Page
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
