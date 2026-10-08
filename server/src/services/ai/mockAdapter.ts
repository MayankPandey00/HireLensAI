import { AIProvider } from './aiInterface';
import { 
  ResumeRealityCheck, 
  AssessmentQuestion, 
  StudentAnswer, 
  PlacementReadinessReport, 
  ResumeClaim, 
  TopRisk, 
  FlowNode, 
  FlowEdge 
} from '../../types/schema';
import { getCompanyBenchmark } from '../companyBenchmarkService';
import { generateDynamicQuestions } from './questionBank';

export class MockAIAdapter implements AIProvider {
  async analyzeResume(resumeText: string, company: string, role: string): Promise<ResumeRealityCheck> {
    const textLower = resumeText.toLowerCase();

    // Extract candidate name if available
    let candidateName = 'Engineering Candidate';
    const lines = resumeText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0 && lines[0].length < 35 && !lines[0].toLowerCase().includes('resume')) {
      candidateName = lines[0];
    }

    // Dynamic skill extraction based on common tech terms
    const candidateSkillPool = [
      'React.js', 'TypeScript', 'Node.js', 'Express', 'Python', 'Java', 'C++',
      'Docker', 'AWS', 'Redis', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Kubernetes',
      'Git', 'System Design', 'Kafka', 'REST APIs', 'Tailwind CSS', 'Redux'
    ];

    const extractedSkills = candidateSkillPool.filter(skill => 
      textLower.includes(skill.toLowerCase().replace('.js', '')) ||
      (skill === 'C++' && (textLower.includes('c++') || textLower.includes('cpp'))) ||
      (skill === 'React.js' && textLower.includes('react'))
    );

    // Fallback if resume text was short or scanned
    if (extractedSkills.length === 0) {
      extractedSkills.push('JavaScript', 'React.js', 'Node.js', 'SQL', 'Git', 'Data Structures');
    }

    // Extract or synthesize high-risk technical claims from resume
    const claims: ResumeClaim[] = [];

    if (textLower.includes('redis') || textLower.includes('cache')) {
      claims.push({
        id: 'claim-redis',
        claim: 'Implemented high-throughput Redis caching layer reducing API response time by 45%.',
        projectOrExperience: 'Backend Microservices Architecture',
        riskLevel: 'HIGH',
        defenseQuestion: 'Walk me through your cache eviction policy (e.g., LRU vs LFU) and how you prevented cache stampede/thundering herd under peak load.',
        contextSnippet: 'Caching optimization claim in backend architecture.'
      });
    }

    if (textLower.includes('docker') || textLower.includes('kubernetes') || textLower.includes('aws') || textLower.includes('deploy')) {
      claims.push({
        id: 'claim-infra',
        claim: 'Containerized microservices using Docker and deployed automated CI/CD pipeline on AWS.',
        projectOrExperience: 'Cloud Infrastructure Pipeline',
        riskLevel: 'HIGH',
        defenseQuestion: 'If one of your microservice containers starts crashing with OOMKilled in production, what specific debugging sequence do you take to isolate the memory leak?',
        contextSnippet: 'DevOps & Cloud scalability claims.'
      });
    }

    if (textLower.includes('sql') || textLower.includes('postgres') || textLower.includes('mongo') || textLower.includes('database')) {
      claims.push({
        id: 'claim-db',
        claim: 'Architected relational database schema with indexed queries handling 50,000+ customer records.',
        projectOrExperience: 'Database Layer & Data Modeling',
        riskLevel: 'MEDIUM',
        defenseQuestion: 'Explain the internal B-tree index structure of your relational database. When would a composite index fail to be utilized by the query planner?',
        contextSnippet: 'Database query optimization claim.'
      });
    }

    // Default baseline claim if no specific matches
    if (claims.length === 0) {
      claims.push({
        id: 'claim-fullstack',
        claim: 'Built end-to-end full-stack web application featuring user authentication and real-time state synchronization.',
        projectOrExperience: 'Capstone Placement Project',
        riskLevel: 'HIGH',
        defenseQuestion: 'How did you handle secure session token storage and mitigate Cross-Site Scripting (XSS) and CSRF attacks on your client and server?',
        contextSnippet: 'Core web architecture claim.'
      });
    }

    const benchmark = getCompanyBenchmark(company, role);
    const missingSkills = benchmark.coreTechStack.filter(s => 
      !extractedSkills.some(es => es.toLowerCase().includes(s.toLowerCase()))
    ).slice(0, 4);

    const alignmentScore = Math.min(88, Math.max(58, Math.floor(100 - (missingSkills.length * 11))));

    return {
      candidateName,
      yearsOfExperience: 'Final Year College Student / 0-1 yr',
      extractedSkills,
      technicalClaims: claims,
      targetAlignment: {
        targetCompany: benchmark.companyName,
        targetRole: benchmark.role,
        alignmentScore,
        matchedSkills: extractedSkills.slice(0, 5),
        missingSkills,
        gapSummary: `Resume displays practical development skills but lacks evident depth in ${missingSkills.join(', ')} required by ${benchmark.companyName}'s technical hiring bar.`,
        companyBarInsight: benchmark.typicalBarDescription
      }
    };
  }

  async generateAssessment(realityCheck: ResumeRealityCheck): Promise<AssessmentQuestion[]> {
    return generateDynamicQuestions(realityCheck);
  }

  async evaluateAssessment(
    assessmentId: string,
    realityCheck: ResumeRealityCheck,
    questions: AssessmentQuestion[],
    answers: StudentAnswer[]
  ): Promise<PlacementReadinessReport> {
    // Scoring logic evaluating completeness, length, and technical substance
    const answerMap = new Map<string, StudentAnswer>();
    answers.forEach(a => answerMap.set(a.questionId, a));

    let aptCorrect = 0;
    let aptTotal = 0;
    let csCorrect = 0;
    let csTotal = 0;

    questions.forEach(q => {
      const ans = answerMap.get(q.id);
      if (q.category === 'aptitude') {
        aptTotal++;
        if (ans && ans.selectedOptionIndex !== undefined && q.correctOptionIndex !== undefined) {
          if (ans.selectedOptionIndex === q.correctOptionIndex) {
            aptCorrect++;
          }
        }
      } else if (q.category === 'cs_fundamentals') {
        csTotal++;
        if (ans && ans.selectedOptionIndex !== undefined && q.correctOptionIndex !== undefined) {
          if (ans.selectedOptionIndex === q.correctOptionIndex) {
            csCorrect++;
          }
        }
      }
    });

    const aptitudeScore = aptTotal > 0 ? Math.max(45, Math.min(95, Math.round((aptCorrect / aptTotal) * 100))) : 68;
    const csScore = csTotal > 0 ? Math.max(50, Math.min(92, Math.round((csCorrect / csTotal) * 100))) : 64;

    // Evaluate DSA questions dynamically
    const dsaQuestions = questions.filter(q => q.category === 'dsa');
    let dsaScore = 58;
    if (dsaQuestions.length > 0) {
      const dsaAnswers = dsaQuestions.map(q => answerMap.get(q.id)?.answerText || '');
      const avgDsaLen = dsaAnswers.reduce((acc, text) => acc + text.length, 0) / dsaQuestions.length;
      if (avgDsaLen > 60) dsaScore = 78;
      else if (avgDsaLen > 20) dsaScore = 66;
      else dsaScore = 55;
    }

    // Evaluate Communication questions dynamically
    const commQuestions = questions.filter(q => q.category === 'communication');
    let commScore = 74;
    if (commQuestions.filter(Boolean).length > 0) {
      const commAnswers = commQuestions.map(q => answerMap.get(q.id)?.answerText || '');
      const avgCommLen = commAnswers.reduce((acc, text) => acc + text.length, 0) / commQuestions.length;
      if (avgCommLen > 100) commScore = 85;
      else if (avgCommLen > 30) commScore = 72;
      else commScore = 60;
    }

    // Evaluate Project Defense (claims)
    let projectDefenseScore = 56;
    const defenseQuestions = questions.filter(q => q.category === 'project_defense');
    if (defenseQuestions.length > 0) {
      const defenseAnswers = defenseQuestions.map(q => answerMap.get(q.id)?.answerText || '');
      const avgDefenseLen = defenseAnswers.reduce((acc, text) => acc + text.length, 0) / defenseQuestions.length;
      if (avgDefenseLen > 120) projectDefenseScore = 80;
      else if (avgDefenseLen > 40) projectDefenseScore = 68;
      else projectDefenseScore = 54;
    }

    const roleAlignmentScore = realityCheck.targetAlignment.alignmentScore || 72;

    // Overall Readiness Score: Benchmark requested e.g., ~71/100
    const rawOverall = (
      aptitudeScore * 0.15 +
      csScore * 0.20 +
      dsaScore * 0.25 +
      commScore * 0.10 +
      projectDefenseScore * 0.20 +
      roleAlignmentScore * 0.10
    );
    const overallReadiness = Math.min(95, Math.max(45, Math.round(rawOverall || 71)));

    // TOP 3 RISKS strictly as requested:
    // 1. Project Defense
    // 2. DSA - Sliding Window
    // 3. DBMS - Query Optimization
    const topRisks: TopRisk[] = [
      {
        rank: 1,
        area: 'Project Defense',
        severity: 'CRITICAL',
        whyItIsWeak: 'High gap between technical claims listed on resume (e.g. distributed caching, cloud infra) and concrete architectural explanations provided under interview scrutiny.',
        evidence: 'Inability to articulate cache invalidation strategies, thundering herd mitigation, and production container failure isolation sequences.',
        recommendedAction: 'Re-audit every line of your resume. Practice 3-minute architectural deep-dives for each bullet point covering: why chosen, trade-offs, and failure failure modes.'
      },
      {
        rank: 2,
        area: 'DSA - Sliding Window & Two Pointers',
        severity: 'HIGH',
        whyItIsWeak: 'Struggled to clearly define window boundaries, monotonic state management, and edge conditions for variable-size sliding window patterns.',
        evidence: 'Assessment answer lacked rigorous O(N) single-pass window invariant proof and had off-by-one boundary handling vulnerability.',
        recommendedAction: 'Solve 15 curated Sliding Window & Two-Pointer problems on LeetCode (e.g., Minimum Window Substring, Longest Substring Without Repeating Characters).'
      },
      {
        rank: 3,
        area: 'DBMS - Query Optimization & Indexing',
        severity: 'HIGH',
        whyItIsWeak: 'Unclear understanding of B-Tree composite index leftmost prefix rule and query execution planner behavior under WHERE/ORDER BY clauses.',
        evidence: 'Missed index utilization question for composite key queries and could not explain why functions on indexed columns trigger full table scans.',
        recommendedAction: 'Study relational database B-Tree index structure, composite index ordering rules, and inspect `EXPLAIN ANALYZE` output on PostgreSQL or MySQL queries.'
      }
    ];

    // Generate React Flow Interactive Mindmap Nodes and Edges
    const mindmapNodes: FlowNode[] = [
      // Central Root Node
      {
        id: 'root-readiness',
        position: { x: 380, y: 30 },
        type: 'rootNode',
        data: {
          label: `${realityCheck.targetAlignment.targetCompany} Placement Readiness`,
          category: 'Readiness Core',
          status: 'MODERATE',
          whyYouNeedIt: 'Central hub mapping your readiness journey to crack your target company hiring bar.',
          topicsToLearn: ['Placement Strategy', 'Mock Interview Drills', 'Timed Coding Assessments'],
          recommendedResources: [
            { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/', type: 'guide' },
            { title: 'NeetCode Roadmap', url: 'https://neetcode.io/roadmap', type: 'practice' }
          ],
          estimatedEffort: '2-3 Weeks Plan',
          practiceRecommendation: 'Focus on high-leverage weak areas first before general revisions.'
        }
      },

      // Risk 1: Project Defense (WEAK - Red/Orange)
      {
        id: 'node-project-defense',
        position: { x: 40, y: 190 },
        type: 'mindmapNode',
        data: {
          label: 'Project Defense & Architecture',
          category: 'Project Defense',
          status: 'WEAK',
          severityRank: 1,
          whyYouNeedIt: 'Interviewers immediately test whether you actually built your projects or copied them from tutorials. Failing here is the #1 rejection reason in technical rounds.',
          topicsToLearn: [
            'System Architecture diagrams of your projects',
            'Redis cache eviction policies (LRU, TTL) & Cache Stampede',
            'Database schema normalization and indexing choices',
            'Handling concurrent requests and latency bottlenecks'
          ],
          recommendedResources: [
            { title: 'System Design Primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer', type: 'guide' },
            { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'guide' },
            { title: 'Mock Technical Resume Defense Drills', url: '#', type: 'practice' }
          ],
          estimatedEffort: '6-8 Hours',
          practiceRecommendation: 'Record a 5-minute Loom video defending your project architecture without reading notes. Address every tech choice and trade-off.'
        }
      },

      // Risk 2: DSA - Sliding Window (WEAK - Red/Orange)
      {
        id: 'node-dsa-sliding-window',
        position: { x: 380, y: 220 },
        type: 'mindmapNode',
        data: {
          label: 'DSA: Sliding Window & Arrays',
          category: 'Algorithms',
          status: 'WEAK',
          severityRank: 2,
          whyYouNeedIt: 'Sliding window is the most frequently tested pattern in online assessments for companies like Amazon, Microsoft, and high-growth tech firms.',
          topicsToLearn: [
            'Fixed-size sliding window pattern',
            'Dynamic-size sliding window with hash map frequency',
            'Monotonic Deque (Sliding Window Maximum)',
            'Two-pointer pointer contraction techniques'
          ],
          recommendedResources: [
            { title: 'LeetCode Pattern 3: Sliding Window', url: 'https://leetcode.com/discuss/general-discussion/657507/sliding-window-for-beginners-problems-template-sample-solutions', type: 'practice' },
            { title: 'NeetCode Sliding Window Playlist', url: 'https://neetcode.io/', type: 'video' }
          ],
          estimatedEffort: '8-10 Hours',
          practiceRecommendation: 'Complete 10 Medium-level sliding window problems without looking at solutions for the first 25 minutes.'
        }
      },

      // Risk 3: DBMS Query Optimization (WEAK - Red/Orange)
      {
        id: 'node-dbms-indexing',
        position: { x: 720, y: 190 },
        type: 'mindmapNode',
        data: {
          label: 'DBMS: Indexing & Query Plans',
          category: 'CS Fundamentals',
          status: 'WEAK',
          severityRank: 3,
          whyYouNeedIt: 'Backend rounds mandate knowing how data is retrieved at scale. Naive queries that pass tests will fail architectural evaluation.',
          topicsToLearn: [
            'B-Tree vs Hash indexing internal mechanics',
            'Leftmost prefix rule in composite indices',
            'EXPLAIN ANALYZE interpretation',
            'ACID properties and isolation levels (Dirty Read vs Phantom Read)'
          ],
          recommendedResources: [
            { title: 'Use The Index, Luke! (SQL Indexing Guide)', url: 'https://use-the-index-luke.com/', type: 'guide' },
            { title: 'CMU 15-445 Database Systems Lecture series', url: 'https://15445.courses.cs.cmu.edu/', type: 'video' }
          ],
          estimatedEffort: '5-6 Hours',
          practiceRecommendation: 'Set up local Postgres, populate a 1M-row table, run EXPLAIN on unindexed vs indexed queries, and measure latency reduction.'
        }
      },

      // Strong / Moderate Nodes
      {
        id: 'node-aptitude-quant',
        position: { x: 100, y: 400 },
        type: 'mindmapNode',
        data: {
          label: 'Aptitude: Speed & Quant',
          category: 'Aptitude',
          status: aptitudeScore >= 75 ? 'STRONG' : 'MODERATE',
          whyYouNeedIt: 'Initial screening filters 80% of applicants purely based on quantitative speed and accuracy.',
          topicsToLearn: ['Work & Time ratios', 'Permutations & Probability', 'Data sufficiency shortcuts'],
          recommendedResources: [
            { title: 'IndiaBIX Aptitude Practice', url: 'https://www.indiabix.com/', type: 'practice' }
          ],
          estimatedEffort: '3 Hours',
          practiceRecommendation: 'Do 20 timed questions daily under 1.5 minutes per question constraint.'
        }
      },
      {
        id: 'node-behavioral-star',
        position: { x: 420, y: 430 },
        type: 'mindmapNode',
        data: {
          label: 'Behavioral: STAR Storytelling',
          category: 'Communication',
          status: commScore >= 75 ? 'STRONG' : 'MODERATE',
          whyYouNeedIt: 'Culture fit and bar-raiser rounds evaluate ownership, conflict resolution, and maturity under pressure.',
          topicsToLearn: [
            'STAR method: Situation, Task, Action, Result',
            'Amazon 16 Leadership Principles application',
            'Constructive technical disagreement handling'
          ],
          recommendedResources: [
            { title: 'Exponent STAR Method Guide', url: 'https://www.tryexponent.com/', type: 'guide' }
          ],
          estimatedEffort: '2 Hours',
          practiceRecommendation: 'Draft 5 reusable STAR stories covering: failure, leadership, tight deadline, conflict, and innovation.'
        }
      },
      {
        id: 'node-os-concurrency',
        position: { x: 740, y: 400 },
        type: 'mindmapNode',
        data: {
          label: 'OS: Threads & Concurrency',
          category: 'CS Fundamentals',
          status: 'MODERATE',
          whyYouNeedIt: 'Crucial for multi-threaded systems, web server scaling, and understanding CPU scheduling.',
          topicsToLearn: ['Race conditions and mutex locks', 'Process vs Thread memory layouts', 'Virtual memory paging'],
          recommendedResources: [
            { title: 'Operating Systems: Three Easy Pieces (OSTEP)', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', type: 'guide' }
          ],
          estimatedEffort: '4 Hours',
          practiceRecommendation: 'Implement a thread-safe counter with mutex locks in your preferred programming language.'
        }
      }
    ];

    const mindmapEdges: FlowEdge[] = [
      { id: 'e-root-defense', source: 'root-readiness', target: 'node-project-defense', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
      { id: 'e-root-dsa', source: 'root-readiness', target: 'node-dsa-sliding-window', animated: true, style: { stroke: '#f97316', strokeWidth: 2 } },
      { id: 'e-root-dbms', source: 'root-readiness', target: 'node-dbms-indexing', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e-defense-star', source: 'node-project-defense', target: 'node-behavioral-star', animated: false, style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e-dsa-apt', source: 'node-dsa-sliding-window', target: 'node-aptitude-quant', animated: false, style: { stroke: '#10b981', strokeWidth: 1.5 } },
      { id: 'e-dbms-os', source: 'node-dbms-indexing', target: 'node-os-concurrency', animated: false, style: { stroke: '#06b6d4', strokeWidth: 1.5 } },
    ];

    return {
      reportId: `rep-${Date.now()}`,
      assessmentId,
      candidateName: realityCheck.candidateName,
      targetCompany: realityCheck.targetAlignment.targetCompany,
      targetRole: realityCheck.targetAlignment.targetRole,
      overallReadiness,
      verdict: overallReadiness >= 75 ? 'Ready' : 'Needs Targeted Practice',
      verdictSummary: `Candidate has strong base qualifications (${overallReadiness}/100 readiness), but requires focused defensive preparation on resume technical claims and high-frequency algorithmic problem patterns prior to ${realityCheck.targetAlignment.targetCompany} interviews.`,
      categoryScores: {
        technicalKnowledge: csScore,
        aptitude: aptitudeScore,
        dsa: dsaScore,
        communication: commScore,
        projectDefense: projectDefenseScore,
        roleAlignment: roleAlignmentScore
      },
      topRisks,
      mindmap: {
        nodes: mindmapNodes,
        edges: mindmapEdges
      },
      generatedAt: new Date().toISOString()
    };
  }
}
