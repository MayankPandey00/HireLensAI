export interface ResumeClaim {
  id: string;
  claim: string;
  projectOrExperience: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  defenseQuestion: string;
  contextSnippet?: string;
}

export interface ResumeRealityCheck {
  candidateName: string;
  candidateEmail?: string;
  yearsOfExperience: string;
  extractedSkills: string[];
  technicalClaims: ResumeClaim[];
  targetAlignment: {
    targetCompany: string;
    targetRole: string;
    alignmentScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    gapSummary: string;
    companyBarInsight: string;
  };
}

export type AssessmentCategory = 
  | 'aptitude' 
  | 'cs_fundamentals' 
  | 'dsa' 
  | 'communication' 
  | 'project_defense';

export interface AssessmentQuestion {
  id: string;
  category: AssessmentCategory;
  subtopic: string;
  prompt: string;
  type: 'multiple_choice' | 'code_approach' | 'scenario_defense';
  options?: string[];
  correctOptionIndex?: number;
  starterCode?: string;
  defenseClaimId?: string;
  claimReference?: string;
  estimatedMinutes?: number;
}

export interface AssessmentBundle {
  assessmentId: string;
  targetCompany: string;
  targetRole: string;
  questions: AssessmentQuestion[];
  createdAt: string;
}

export interface StudentAnswer {
  questionId: string;
  answerText: string;
  selectedOptionIndex?: number;
  timeSpentSeconds?: number;
}

export interface TopRisk {
  rank: number;
  area: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  whyItIsWeak: string;
  evidence: string;
  recommendedAction: string;
}

export interface EvaluationCategoryScores {
  technicalKnowledge: number;
  aptitude: number;
  dsa: number;
  communication: number;
  projectDefense: number;
  roleAlignment: number;
}

export interface MindmapNodeResource {
  title: string;
  url: string;
  type: 'guide' | 'practice' | 'video' | 'docs';
}

export interface MindmapNodeData {
  label: string;
  category: string;
  status: 'WEAK' | 'MODERATE' | 'STRONG';
  severityRank?: number;
  whyYouNeedIt: string;
  topicsToLearn: string[];
  recommendedResources: MindmapNodeResource[];
  estimatedEffort: string;
  practiceRecommendation: string;
}

export interface FlowNode {
  id: string;
  position: { x: number; y: number };
  data: MindmapNodeData;
  type?: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: { stroke?: string; strokeWidth?: number; strokeDasharray?: string };
}

export interface PlacementReadinessReport {
  reportId: string;
  assessmentId: string;
  candidateName: string;
  targetCompany: string;
  targetRole: string;
  overallReadiness: number;
  verdict: 'Ready' | 'Needs Targeted Practice' | 'At Risk';
  verdictSummary: string;
  categoryScores: EvaluationCategoryScores;
  topRisks: TopRisk[];
  mindmap: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  generatedAt: string;
}
