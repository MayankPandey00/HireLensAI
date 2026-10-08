import { AIProvider } from './aiInterface';
import { ResumeRealityCheck, AssessmentQuestion, StudentAnswer, PlacementReadinessReport } from '../../types/schema';
import { MockAIAdapter } from './mockAdapter';

export class GeminiAIAdapter implements AIProvider {
  private apiKey: string;
  private fallbackAdapter: MockAIAdapter;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallbackAdapter = new MockAIAdapter();
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    const payload: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${err}`);
    }

    const data: any = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async analyzeResume(resumeText: string, company: string, role: string): Promise<ResumeRealityCheck> {
    try {
      const prompt = `You are the lead placement auditor at HireLens AI. Analyze this candidate's resume for the target company: "${company}" and target role: "${role}".
Extract candidateName, yearsOfExperience, extractedSkills (array), technicalClaims (array of objects with id, claim, projectOrExperience, riskLevel ('HIGH'|'MEDIUM'|'LOW'), defenseQuestion), and targetAlignment (targetCompany, targetRole, alignmentScore (0-100), matchedSkills, missingSkills, gapSummary, companyBarInsight).
Return strictly JSON matching ResumeRealityCheck.

Resume text:
${resumeText.substring(0, 4000)}`;

      const raw = await this.callGemini(prompt);
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (err: any) {
      console.warn('Gemini analyzeResume fallback to MockAdapter:', err.message);
      return this.fallbackAdapter.analyzeResume(resumeText, company, role);
    }
  }

  async generateAssessment(realityCheck: ResumeRealityCheck): Promise<AssessmentQuestion[]> {
    try {
      const prompt = `Generate a personalized placement assessment for candidate ${realityCheck.candidateName} targeting ${realityCheck.targetAlignment.targetCompany} for role ${realityCheck.targetAlignment.targetRole}.
Must include:
- 5 aptitude questions (category 'aptitude', subtopic, prompt, type 'multiple_choice', options [4 choices])
- 5 CS fundamentals questions (category 'cs_fundamentals', subtopic, prompt, type 'multiple_choice', options [4 choices])
- 2 DSA questions (category 'dsa', subtopic, prompt, type 'code_approach', starterCode)
- 3 communication/behavioral questions (category 'communication', subtopic, prompt, type 'scenario_defense')
- 1-3 project defense questions based on candidate technical claims: ${JSON.stringify(realityCheck.technicalClaims)} (category 'project_defense', defenseClaimId, claimReference)

Return strictly a JSON array of AssessmentQuestion.`;

      const raw = await this.callGemini(prompt);
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 10) {
        return parsed;
      }
      return this.fallbackAdapter.generateAssessment(realityCheck);
    } catch (err: any) {
      console.warn('Gemini generateAssessment fallback to MockAdapter:', err.message);
      return this.fallbackAdapter.generateAssessment(realityCheck);
    }
  }

  async evaluateAssessment(
    assessmentId: string,
    realityCheck: ResumeRealityCheck,
    questions: AssessmentQuestion[],
    answers: StudentAnswer[]
  ): Promise<PlacementReadinessReport> {
    try {
      const prompt = `Evaluate the student's placement assessment answers for target role at ${realityCheck.targetAlignment.targetCompany}.
Generate a comprehensive placement readiness report strictly formatted as JSON for PlacementReadinessReport.
Include:
- overallReadiness (number between 0 and 100, e.g. 71)
- verdict ('Ready' | 'Needs Targeted Practice' | 'At Risk')
- verdictSummary
- categoryScores: { technicalKnowledge, aptitude, dsa, communication, projectDefense, roleAlignment }
- topRisks: array of exactly 3 objects: { rank, area, severity, whyItIsWeak, evidence, recommendedAction }
- mindmap: { nodes: FlowNode[], edges: FlowEdge[] } where nodes have data: { label, category, status ('WEAK'|'MODERATE'|'STRONG'), whyYouNeedIt, topicsToLearn, recommendedResources, estimatedEffort, practiceRecommendation }

Candidate Reality Check: ${JSON.stringify(realityCheck)}
Answers: ${JSON.stringify(answers)}`;

      const raw = await this.callGemini(prompt);
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        reportId: `rep-${Date.now()}`,
        assessmentId,
        generatedAt: new Date().toISOString()
      };
    } catch (err: any) {
      console.warn('Gemini evaluateAssessment fallback to MockAdapter:', err.message);
      return this.fallbackAdapter.evaluateAssessment(assessmentId, realityCheck, questions, answers);
    }
  }
}
