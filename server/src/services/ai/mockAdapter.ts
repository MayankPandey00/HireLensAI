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
    const questions: AssessmentQuestion[] = [
      // 5 Aptitude Questions
      {
        id: 'apt-1',
        category: 'aptitude',
        subtopic: 'Quantitative - Work & Time',
        prompt: 'Pipe A can fill a tank in 12 hours, while Pipe B can empty it in 18 hours. If both pipes are opened simultaneously, in how many hours will the tank be completely filled?',
        type: 'multiple_choice',
        options: ['24 hours', '30 hours', '36 hours', '48 hours'],
        estimatedMinutes: 2
      },
      {
        id: 'apt-2',
        category: 'aptitude',
        subtopic: 'Quantitative - Profit & Loss',
        prompt: 'A trader sells an article at 20% profit. If the cost price had been 10% less and the selling price $18 less, the profit would have been 30%. What is the cost price?',
        type: 'multiple_choice',
        options: ['$600', '$500', '$450', '$400'],
        estimatedMinutes: 2
      },
      {
        id: 'apt-3',
        category: 'aptitude',
        subtopic: 'Logical Reasoning - Blood Relations & Sequences',
        prompt: 'Pointing to a photograph, Rohit said, "His mother is the only daughter of my mother." How is Rohit related to the person in the photograph?',
        type: 'multiple_choice',
        options: ['Father', 'Maternal Uncle', 'Brother', 'Grandfather'],
        estimatedMinutes: 2
      },
      {
        id: 'apt-4',
        category: 'aptitude',
        subtopic: 'Logical Reasoning - Syllogisms',
        prompt: 'Statements: 1. All engineers are problem solvers. 2. Some problem solvers are leaders. Conclusions: I. Some engineers are leaders. II. All leaders are problem solvers.',
        type: 'multiple_choice',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows'],
        estimatedMinutes: 2
      },
      {
        id: 'apt-5',
        category: 'aptitude',
        subtopic: 'Data Interpretation - Probability',
        prompt: 'Two fair six-sided dice are rolled. What is the probability that the sum of the numbers is a prime number?',
        type: 'multiple_choice',
        options: ['5/12', '7/18', '15/36', '1/2'],
        estimatedMinutes: 2
      },

      // 5 CS Fundamentals Questions
      {
        id: 'cs-1',
        category: 'cs_fundamentals',
        subtopic: 'DBMS - Query Optimization & Indexing',
        prompt: 'You have a table `Orders` with 10M rows and columns `(user_id, order_date, total_amount)`. An index exists on `(user_id, order_date)`. Which query can FULLY utilize this index?',
        type: 'multiple_choice',
        options: [
          'SELECT * FROM Orders WHERE order_date = "2024-01-01"',
          'SELECT * FROM Orders WHERE user_id = 104 ORDER BY order_date DESC',
          'SELECT * FROM Orders WHERE YEAR(order_date) = 2024',
          'SELECT * FROM Orders WHERE total_amount > 500'
        ],
        estimatedMinutes: 2
      },
      {
        id: 'cs-2',
        category: 'cs_fundamentals',
        subtopic: 'Operating Systems - Concurrency & Deadlocks',
        prompt: 'Which of the following conditions is NOT strictly required for a deadlock to occur under Coffman criteria?',
        type: 'multiple_choice',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption allowed by OS', 'Circular Wait'],
        estimatedMinutes: 2
      },
      {
        id: 'cs-3',
        category: 'cs_fundamentals',
        subtopic: 'Computer Networks - TCP vs UDP & Handshake',
        prompt: 'During TCP connection termination, why does the client enter the `TIME_WAIT` state for 2*MSL (Maximum Segment Lifetime)?',
        type: 'multiple_choice',
        options: [
          'To conserve memory buffers on the server',
          'To ensure the final ACK was received and prevent old duplicate packets from interfering with new connections',
          'To renegotiate sliding window size',
          'To wait for ARP cache resolution'
        ],
        estimatedMinutes: 2
      },
      {
        id: 'cs-4',
        category: 'cs_fundamentals',
        subtopic: 'Operating Systems - Virtual Memory & Page Faults',
        prompt: 'What happens in hardware/kernel when a page fault occurs?',
        type: 'multiple_choice',
        options: [
          'The CPU executes an interrupt, switches to kernel mode, swaps the page from disk into RAM, updates page table, and restarts instruction',
          'The process is immediately terminated with SIGSEGV',
          'The CPU clears L1/L2 cache and retries fetch',
          'The virtual address is silently rewritten to physical address 0'
        ],
        estimatedMinutes: 2
      },
      {
        id: 'cs-5',
        category: 'cs_fundamentals',
        subtopic: 'OOP & System Design Patterns',
        prompt: 'Which design pattern is best suited for decoupling an abstraction from its implementation so that both can vary independently without subclass explosion?',
        type: 'multiple_choice',
        options: ['Bridge Pattern', 'Singleton Pattern', 'Decorator Pattern', 'Factory Pattern'],
        estimatedMinutes: 2
      },

      // 2 DSA Questions
      {
        id: 'dsa-1',
        category: 'dsa',
        subtopic: 'DSA - Sliding Window & Two Pointers',
        prompt: 'Problem: Given an array of integers `nums` and an integer `k`, find the maximum sum of any contiguous subarray of size `k`. Describe your algorithm approach, edge cases, and state time & space complexity.',
        type: 'code_approach',
        starterCode: `function maxSubarraySum(nums: number[], k: number): number {\n  // Implement sliding window approach\n}`,
        estimatedMinutes: 4
      },
      {
        id: 'dsa-2',
        category: 'dsa',
        subtopic: 'DSA - Trees & Lowest Common Ancestor',
        prompt: 'Problem: Given a Binary Search Tree (BST) and two nodes `p` and `q`, write the algorithm to find their Lowest Common Ancestor (LCA). Explain how BST ordering allows an O(h) solution without auxiliary memory.',
        type: 'code_approach',
        starterCode: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {\n  // Exploit BST properties\n}`,
        estimatedMinutes: 4
      },

      // 3 Communication / Behavioral Questions
      {
        id: 'com-1',
        category: 'communication',
        subtopic: 'Behavioral - STAR Conflict Resolution',
        prompt: 'Describe a situation where a team member disagreed with your architectural or technical choice during a college group project. How did you handle the conflict and what was the outcome?',
        type: 'scenario_defense',
        estimatedMinutes: 3
      },
      {
        id: 'com-2',
        category: 'communication',
        subtopic: 'Behavioral - Ownership Under Failure',
        prompt: 'Tell me about a time you pushed a bug to production or broke the build shortly before a deadline. What immediate action did you take, how did you communicate it, and what was your post-mortem fix?',
        type: 'scenario_defense',
        estimatedMinutes: 3
      },
      {
        id: 'com-3',
        category: 'communication',
        subtopic: 'Behavioral - Learning Under Pressure',
        prompt: 'You are assigned a critical ticket requiring a technology or framework you have never used before, with only 48 hours to deliver. Walk me step-by-step through how you ramp up and validate your solution.',
        type: 'scenario_defense',
        estimatedMinutes: 3
      }
    ];

    // Add Resume Project Defense Questions dynamically generated from the candidate's claims!
    realityCheck.technicalClaims.forEach((claim, idx) => {
      questions.push({
        id: `defense-${claim.id || idx}`,
        category: 'project_defense',
        subtopic: `Project Defense - ${claim.projectOrExperience}`,
        prompt: `[Resume Reality Check] You claimed: "${claim.claim}"\n\nInterviewer Defense Question: ${claim.defenseQuestion}`,
        type: 'scenario_defense',
        defenseClaimId: claim.id,
        claimReference: claim.claim,
        estimatedMinutes: 3
      });
    });

    return questions;
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

    // Evaluate Aptitude (correct choices: apt-1: 36h (idx 2), apt-2: $400 (idx 3), apt-3: Maternal Uncle (idx 1), apt-4: Neither (idx 3), apt-5: 15/36 (idx 2))
    const correctAptitude: Record<string, number> = {
      'apt-1': 2,
      'apt-2': 3,
      'apt-3': 1,
      'apt-4': 3,
      'apt-5': 2,
    };

    let aptCorrect = 0;
    let aptAnswered = 0;
    ['apt-1', 'apt-2', 'apt-3', 'apt-4', 'apt-5'].forEach(qId => {
      const ans = answerMap.get(qId);
      if (ans && ans.selectedOptionIndex !== undefined) {
        aptAnswered++;
        if (ans.selectedOptionIndex === correctAptitude[qId]) {
          aptCorrect++;
        }
      }
    });

    // Baseline aptitude score around 70-80% if answered, fallback realistic hackathon score
    const aptitudeScore = aptAnswered > 0 ? Math.round((aptCorrect / 5) * 100) : 68;

    // Evaluate CS Fundamentals (correct: cs-1: idx 1, cs-2: idx 2, cs-3: idx 1, cs-4: idx 0, cs-5: idx 0)
    const correctCS: Record<string, number> = {
      'cs-1': 1,
      'cs-2': 2,
      'cs-3': 1,
      'cs-4': 0,
      'cs-5': 0
    };

    let csCorrect = 0;
    ['cs-1', 'cs-2', 'cs-3', 'cs-4', 'cs-5'].forEach(qId => {
      const ans = answerMap.get(qId);
      if (ans && ans.selectedOptionIndex === correctCS[qId]) {
        csCorrect++;
      }
    });
    // Typical placement reality: CS Fundamentals is often 60-70%
    const csScore = Math.max(55, Math.min(90, Math.round((csCorrect / 5) * 100) || 64));

    // Evaluate DSA (based on text answer quality or length)
    const dsaAns1 = answerMap.get('dsa-1')?.answerText || '';
    const dsaAns2 = answerMap.get('dsa-2')?.answerText || '';
    let dsaScore = 58; // DSA is typically an identified risk area for college students
    if (dsaAns1.length > 50 && dsaAns2.length > 50) {
      dsaScore = 74;
    } else if (dsaAns1.length > 20 || dsaAns2.length > 20) {
      dsaScore = 65;
    }

    // Evaluate Communication
    const comm1 = answerMap.get('com-1')?.answerText || '';
    const comm2 = answerMap.get('com-2')?.answerText || '';
    const comm3 = answerMap.get('com-3')?.answerText || '';
    let commScore = 76;
    const avgCommLen = (comm1.length + comm2.length + comm3.length) / 3;
    if (avgCommLen > 100) commScore = 84;
    else if (avgCommLen < 30) commScore = 62;

    // Evaluate Project Defense (claims)
    let projectDefenseScore = 56; // High risk area by default!
    const defenseAnswers = answers.filter(a => a.questionId.startsWith('defense-'));
    if (defenseAnswers.length > 0) {
      const avgDefenseLen = defenseAnswers.reduce((acc, curr) => acc + (curr.answerText?.length || 0), 0) / defenseAnswers.length;
      if (avgDefenseLen > 120) projectDefenseScore = 78;
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
