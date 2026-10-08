export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ResumeClaim {
  id: string;
  claim: string;                // e.g. "Implemented distributed caching with Redis reducing latency by 40%"
  projectOrExperience: string;  // e.g. "Distributed E-Commerce API"
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  defenseQuestion: string;      // "How did you manage cache stampede and eviction policy?"
  contextSnippet?: string;
}

export interface CompanyBenchmark {
  companyName: string;
  role: string;
  typicalBarDescription: string;
  coreTechStack: string[];
  roundsStructure: string[];
  focusAreas: string[];
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
    alignmentScore: number;     // 0 - 100
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
  subtopic: string;              // e.g. "DBMS - Query Optimization", "DSA - Sliding Window"
  prompt: string;
  type: 'multiple_choice' | 'code_approach' | 'scenario_defense';
  options?: string[];            // For MCQs
  starterCode?: string;          // For coding/DSA
  defenseClaimId?: string;       // Linked to ResumeClaim
  claimReference?: string;       // e.g. "Regarding your claim about Redis caching..."
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
  area: string;                  // e.g. "Project Defense", "DSA - Sliding Window", "DBMS - Query Optimization"
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  whyItIsWeak: string;           // Clear reasoning
  evidence: string;              // Concrete evidence from answers or resume gap
  recommendedAction: string;     // Exact tactical next step
}

export interface EvaluationCategoryScores {
  technicalKnowledge: number;    // CS Fundamentals (0-100)
  aptitude: number;              // 0-100
  dsa: number;                   // 0-100
  communication: number;         // 0-100
  projectDefense: number;        // 0-100
  roleAlignment: number;         // 0-100
}

export interface MindmapNodeResource {
  title: string;
  url: string;
  type: 'guide' | 'practice' | 'video' | 'docs';
}

export interface MindmapNodeData {
  label: string;
  category: string;
  status: 'WEAK' | 'MODERATE' | 'STRONG'; // Colors: Red/Orange, Yellow, Green
  severityRank?: number; // 1, 2, 3 for Top 3 risks
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
  overallReadiness: number;      // e.g. 71/100
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
