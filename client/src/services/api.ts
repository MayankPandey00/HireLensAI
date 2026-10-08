import { 
  ResumeRealityCheck, 
  AssessmentBundle, 
  StudentAnswer, 
  PlacementReadinessReport 
} from '../types';

const BASE_URL = '/api';

export async function analyzeResume(formData: FormData): Promise<{ sessionId: string; realityCheck: ResumeRealityCheck }> {
  const res = await fetch(`${BASE_URL}/resume/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Failed to analyze resume' }));
    throw new Error(errorData.error || 'Failed to analyze resume');
  }
  return res.json();
}

export async function getRealityCheck(sessionId: string): Promise<{ realityCheck: ResumeRealityCheck }> {
  const res = await fetch(`${BASE_URL}/resume/session/${sessionId}`);
  if (!res.ok) throw new Error('Session not found');
  return res.json();
}

export async function generateAssessment(sessionId: string): Promise<{ assessmentId: string; bundle: AssessmentBundle }> {
  const res = await fetch(`${BASE_URL}/assessment/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Failed to generate assessment' }));
    throw new Error(errorData.error || 'Failed to generate assessment');
  }
  return res.json();
}

export async function getAssessment(assessmentId: string): Promise<{ bundle: AssessmentBundle }> {
  const res = await fetch(`${BASE_URL}/assessment/${assessmentId}`);
  if (!res.ok) throw new Error('Assessment not found');
  return res.json();
}

export async function evaluateAssessment(
  assessmentId: string,
  sessionId: string,
  answers: StudentAnswer[]
): Promise<{ report: PlacementReadinessReport }> {
  const res = await fetch(`${BASE_URL}/assessment/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assessmentId, sessionId, answers }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Failed to evaluate assessment' }));
    throw new Error(errorData.error || 'Failed to evaluate assessment');
  }
  return res.json();
}

export async function getReport(reportId: string): Promise<{ report: PlacementReadinessReport }> {
  const res = await fetch(`${BASE_URL}/report/${reportId}`);
  if (!res.ok) throw new Error('Report not found');
  return res.json();
}
