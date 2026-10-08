import { Request, Response } from 'express';
import { getAIProvider } from '../services/ai/aiService';
import { sessionStore } from '../store/sessionStore';
import { StudentAnswer } from '../types/schema';

export async function evaluateAssessmentHandler(req: Request, res: Response) {
  try {
    const { assessmentId, sessionId, answers } = req.body as {
      assessmentId: string;
      sessionId: string;
      answers: StudentAnswer[];
    };

    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required.' });
    }

    const assessmentBundle = sessionStore.getAssessment(assessmentId);
    if (!assessmentBundle) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    const realityCheck = sessionStore.getRealityCheck(sessionId);
    if (!realityCheck) {
      return res.status(404).json({ error: 'Reality check session not found.' });
    }

    const studentAnswers = Array.isArray(answers) ? answers : [];
    const aiProvider = getAIProvider();

    const report = await aiProvider.evaluateAssessment(
      assessmentId,
      realityCheck,
      assessmentBundle.questions,
      studentAnswers
    );

    sessionStore.setReport(report.reportId, report);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Error evaluating assessment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to evaluate assessment.',
    });
  }
}

export function getReportHandler(req: Request, res: Response) {
  const { reportId } = req.params;
  const report = sessionStore.getReport(reportId);
  if (!report) {
    return res.status(404).json({ error: 'Report not found.' });
  }
  return res.status(200).json({ success: true, report });
}
