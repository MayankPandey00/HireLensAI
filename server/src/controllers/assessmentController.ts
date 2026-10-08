import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAIProvider } from '../services/ai/aiService';
import { sessionStore } from '../store/sessionStore';
import { AssessmentBundle } from '../types/schema';

export async function generateAssessmentHandler(req: Request, res: Response) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required.' });
    }

    const realityCheck = sessionStore.getRealityCheck(sessionId);
    if (!realityCheck) {
      return res.status(404).json({ error: 'Resume reality check session not found.' });
    }

    const aiProvider = getAIProvider();
    const questions = await aiProvider.generateAssessment(realityCheck);

    const assessmentId = uuidv4();
    const bundle: AssessmentBundle = {
      assessmentId,
      targetCompany: realityCheck.targetAlignment.targetCompany,
      targetRole: realityCheck.targetAlignment.targetRole,
      questions,
      createdAt: new Date().toISOString(),
    };

    sessionStore.setAssessment(assessmentId, bundle);

    return res.status(200).json({
      success: true,
      assessmentId,
      bundle,
    });
  } catch (error: any) {
    console.error('Error generating assessment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate assessment questions.',
    });
  }
}

export function getAssessmentHandler(req: Request, res: Response) {
  const { assessmentId } = req.params;
  const bundle = sessionStore.getAssessment(assessmentId);
  if (!bundle) {
    return res.status(404).json({ error: 'Assessment not found.' });
  }
  return res.status(200).json({ success: true, bundle });
}
