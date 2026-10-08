import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  HelpCircle, 
  Clock, 
  Code, 
  ArrowRight, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { AssessmentBundle, AssessmentQuestion, StudentAnswer } from '../types';

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  const [bundle, setBundle] = useState<AssessmentBundle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'aptitude' | 'cs_fundamentals' | 'dsa'>('all');
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    const rawBundle = sessionStorage.getItem('hirelens_assessmentBundle');
    if (rawBundle) {
      try {
        const parsed: AssessmentBundle = JSON.parse(rawBundle);
        setBundle(parsed);

        // Load existing answers if any
        const savedAnswers = sessionStorage.getItem('hirelens_answers');
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
      } catch (e) {
        console.error('Failed to parse assessment bundle');
      }
    } else {
      navigate('/reality-check');
    }
  }, [navigate]);

  if (!bundle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading assessment questions...
      </div>
    );
  }

  // Filter questions for technical assessment (exclude communication/defense which is handled next)
  const technicalQuestions = bundle.questions.filter(q => 
    q.category === 'aptitude' || q.category === 'cs_fundamentals' || q.category === 'dsa'
  );

  const displayedQuestions = selectedCategory === 'all'
    ? technicalQuestions
    : technicalQuestions.filter(q => q.category === selectedCategory);

  const currentQuestion = displayedQuestions[activeQuestionIndex] || displayedQuestions[0];

  const handleSelectOption = (questionId: string, optionIndex: number, optionText: string) => {
    const updated = {
      ...answers,
      [questionId]: {
        questionId,
        selectedOptionIndex: optionIndex,
        answerText: optionText,
      },
    };
    setAnswers(updated);
    sessionStorage.setItem('hirelens_answers', JSON.stringify(updated));
  };

  const handleTextChange = (questionId: string, text: string) => {
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

  const handleQuickPreFillAnswers = () => {
    // Convenient for demo/testing to pre-fill realistic student responses
    const mockAns: Record<string, StudentAnswer> = {
      'apt-1': { questionId: 'apt-1', selectedOptionIndex: 2, answerText: '36 hours' },
      'apt-2': { questionId: 'apt-2', selectedOptionIndex: 3, answerText: '$400' },
      'apt-3': { questionId: 'apt-3', selectedOptionIndex: 1, answerText: 'Maternal Uncle' },
      'apt-4': { questionId: 'apt-4', selectedOptionIndex: 3, answerText: 'Neither I nor II follows' },
      'apt-5': { questionId: 'apt-5', selectedOptionIndex: 0, answerText: '5/12' }, // intentional subtle mistake to test risk detection!
      'cs-1': { questionId: 'cs-1', selectedOptionIndex: 0, answerText: 'SELECT * FROM Orders WHERE order_date = "2024-01-01"' }, // intentional mistake (leftmost prefix rule violation)
      'cs-2': { questionId: 'cs-2', selectedOptionIndex: 2, answerText: 'Preemption allowed by OS' },
      'cs-3': { questionId: 'cs-3', selectedOptionIndex: 1, answerText: 'To ensure the final ACK was received' },
      'cs-4': { questionId: 'cs-4', selectedOptionIndex: 0, answerText: 'The CPU executes an interrupt, switches to kernel mode' },
      'cs-5': { questionId: 'cs-5', selectedOptionIndex: 0, answerText: 'Bridge Pattern' },
      'dsa-1': { 
        questionId: 'dsa-1', 
        answerText: 'We can maintain a sliding window of size k. First calculate the sum of first k elements. Then slide right one element at a time by adding nums[i] and subtracting nums[i-k]. However, handling negative integers and sub-arrays with variable constraints might require monotonic queue.'
      },
      'dsa-2': {
        questionId: 'dsa-2',
        answerText: 'In a BST, if both p and q are less than current root, LCA is in left subtree. If both are greater, LCA is in right subtree. If one is smaller and one is larger, current node is the Lowest Common Ancestor. Time complexity is O(h) where h is tree height.'
      }
    };
    const combined = { ...answers, ...mockAns };
    setAnswers(combined);
    sessionStorage.setItem('hirelens_answers', JSON.stringify(combined));
  };

  const totalAnswered = technicalQuestions.filter(q => answers[q.id]?.answerText !== undefined).length;

  const handleNextStage = () => {
    navigate('/interview');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Bar with Stage & Pre-fill */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-xs text-indigo-300 mb-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Stage 3 of 5: Technical Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {bundle.targetCompany} Placement Readiness Assessment
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleQuickPreFillAnswers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-900/80 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Auto-fill Sample Answers (Demo)</span>
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Timed: 35m Remaining</span>
          </div>
        </div>
      </div>

      {/* Progress & Category Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-300">Progress:</span>
            <span className="font-mono text-cyan-400 font-bold">{totalAnswered} / {technicalQuestions.length} Answered</span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setSelectedCategory('all'); setActiveQuestionIndex(0); }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (12)
            </button>
            <button
              onClick={() => { setSelectedCategory('aptitude'); setActiveQuestionIndex(0); }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === 'aptitude' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Aptitude (5)
            </button>
            <button
              onClick={() => { setSelectedCategory('cs_fundamentals'); setActiveQuestionIndex(0); }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === 'cs_fundamentals' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              CS Core (5)
            </button>
            <button
              onClick={() => { setSelectedCategory('dsa'); setActiveQuestionIndex(0); }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === 'dsa' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              DSA (2)
            </button>
          </div>
        </div>

        {/* Question Selector Numbers */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {displayedQuestions.map((q, idx) => {
            const isAnswered = answers[q.id]?.answerText !== undefined;
            const isCurrent = idx === activeQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                    : isAnswered
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Display Box */}
      {currentQuestion && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 mb-8">
          
          {/* Question Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Question {activeQuestionIndex + 1} of {displayedQuestions.length}
              </span>
              <span className="text-xs font-semibold text-cyan-400">
                {currentQuestion.subtopic}
              </span>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Category: {currentQuestion.category.toUpperCase()}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
            {currentQuestion.prompt}
          </div>

          {/* Options / Answer Input */}
          {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = answers[currentQuestion.id]?.selectedOptionIndex === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, optIdx, option)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-950/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500 text-white'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm">{option}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Code / Algorithmic Response Box */
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  Algorithm Formulation & Complexity Proof
                </span>
                <span className="font-mono text-[11px]">Type/Explain in TypeScript or Pseudocode</span>
              </div>
              <textarea
                rows={10}
                value={answers[currentQuestion.id]?.answerText || ''}
                onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.starterCode || 'Type your solution approach, time/space complexity, and invariant proof here...'}
                className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors leading-relaxed"
              />
            </div>
          )}

          {/* Navigation Prev / Next */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 transition-colors"
            >
              Previous Question
            </button>

            {activeQuestionIndex < displayedQuestions.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleNextStage}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 hover:scale-[1.02] transition-all"
              >
                <span>Continue to Virtual Defense Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* Floating Bottom Action Bar */}
      <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-slate-800">
        <div className="text-xs text-slate-400">
          Completed {totalAnswered} of {technicalQuestions.length} questions. You can review and adjust anytime.
        </div>

        <button
          onClick={handleNextStage}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-cyan-500/20 hover:scale-[1.02] transition-all"
        >
          <span>Proceed to Virtual Interview Defense</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
