import { Router } from 'express';
import multer from 'multer';
import { analyzeResumeHandler, getRealityCheckHandler } from '../controllers/resumeController';
import { generateAssessmentHandler, getAssessmentHandler } from '../controllers/assessmentController';
import { evaluateAssessmentHandler, getReportHandler } from '../controllers/evaluationController';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = Router();

// Resume reality check endpoints
router.post('/resume/analyze', upload.single('resume'), analyzeResumeHandler);
router.get('/resume/session/:sessionId', getRealityCheckHandler);

// Assessment endpoints
router.post('/assessment/generate', generateAssessmentHandler);
router.get('/assessment/:assessmentId', getAssessmentHandler);

// Evaluation & report endpoints
router.post('/assessment/evaluate', evaluateAssessmentHandler);
router.get('/report/:reportId', getReportHandler);

export default router;
