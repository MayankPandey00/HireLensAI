import { ResumeRealityCheck, AssessmentQuestion, StudentAnswer, PlacementReadinessReport } from '../../types/schema';

export interface AIProvider {
  analyzeResume(resumeText: string, company: string, role: string): Promise<ResumeRealityCheck>;
  generateAssessment(realityCheck: ResumeRealityCheck): Promise<AssessmentQuestion[]>;
  evaluateAssessment(
    assessmentId: string,
    realityCheck: ResumeRealityCheck,
    questions: AssessmentQuestion[],
    answers: StudentAnswer[]
  ): Promise<PlacementReadinessReport>;
}
