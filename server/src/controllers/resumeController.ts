import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { parsePdfBuffer } from '../services/pdfService';
import { getAIProvider } from '../services/ai/aiService';
import { sessionStore } from '../store/sessionStore';

export async function analyzeResumeHandler(req: Request, res: Response) {
  try {
    const file = req.file;
    const bodyText = req.body.resumeText as string | undefined;
    const targetCompany = (req.body.targetCompany as string) || 'Google';
    const targetRole = (req.body.targetRole as string) || 'Software Engineer';

    let resumeText = '';

    if (file) {
      const parsed = await parsePdfBuffer(file.buffer);
      resumeText = parsed.rawText;
    } else if (bodyText && bodyText.trim().length > 0) {
      resumeText = bodyText.trim();
    } else {
      return res.status(400).json({ error: 'Please provide a PDF resume file or paste resume text.' });
    }

    const aiProvider = getAIProvider();
    const realityCheck = await aiProvider.analyzeResume(resumeText, targetCompany, targetRole);

    const sessionId = uuidv4();
    sessionStore.setRealityCheck(sessionId, realityCheck);

    return res.status(200).json({
      success: true,
      sessionId,
      realityCheck,
    });
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze resume.',
    });
  }
}

export function getRealityCheckHandler(req: Request, res: Response) {
  const { sessionId } = req.params;
  const data = sessionStore.getRealityCheck(sessionId);
  if (!data) {
    return res.status(404).json({ error: 'Session not found or expired.' });
  }
  return res.status(200).json({ success: true, realityCheck: data });
}
