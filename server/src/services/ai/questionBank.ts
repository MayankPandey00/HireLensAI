import { AssessmentQuestion, ResumeRealityCheck } from '../../types/schema';

// Helper function to shuffle array in-place using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Aptitude Question Pool (15 questions)
const APTITUDE_POOL: Omit<AssessmentQuestion, 'id'>[] = [
  {
    category: 'aptitude',
    subtopic: 'Quantitative - Work & Time',
    prompt: 'Pipe A can fill a tank in 12 hours, while Pipe B can empty it in 18 hours. If both pipes are opened simultaneously, in how many hours will the tank be completely filled?',
    type: 'multiple_choice',
    options: ['24 hours', '30 hours', '36 hours', '48 hours'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Quantitative - Profit & Loss',
    prompt: 'A trader sells an article at 20% profit. If the cost price had been 10% less and the selling price $18 less, the profit would have been 30%. What is the cost price?',
    type: 'multiple_choice',
    options: ['$600', '$500', '$450', '$400'],
    correctOptionIndex: 3,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Logical Reasoning - Blood Relations & Sequences',
    prompt: 'Pointing to a photograph, Rohit said, "His mother is the only daughter of my mother." How is Rohit related to the person in the photograph?',
    type: 'multiple_choice',
    options: ['Father', 'Maternal Uncle', 'Brother', 'Grandfather'],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Logical Reasoning - Syllogisms',
    prompt: 'Statements: 1. All engineers are problem solvers. 2. Some problem solvers are leaders. Conclusions: I. Some engineers are leaders. II. All leaders are problem solvers.',
    type: 'multiple_choice',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows'],
    correctOptionIndex: 3,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Data Interpretation - Probability',
    prompt: 'Two fair six-sided dice are rolled. What is the probability that the sum of the numbers is a prime number?',
    type: 'multiple_choice',
    options: ['5/12', '7/18', '15/36', '1/2'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Quantitative - Speed, Distance & Time',
    prompt: 'A train 150 meters long passes a telegraph pole in 10 seconds. How long will it take to cross a platform 250 meters long at the same speed?',
    type: 'multiple_choice',
    options: ['20 seconds', '24 seconds', '26 seconds', '30 seconds'],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Quantitative - Permutations & Combinations',
    prompt: 'In how many different ways can the letters of the word "LEADING" be arranged such that the vowels always come together?',
    type: 'multiple_choice',
    options: ['360', '480', '720', '5040'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Quantitative - Mixtures & Alligations',
    prompt: 'A container contains 40 liters of milk. From this container, 4 liters of milk was taken out and replaced by water. This process was repeated further two times. How much milk is now contained by the container?',
    type: 'multiple_choice',
    options: ['26.34 liters', '29.16 liters', '30.00 liters', '32.40 liters'],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Logical Reasoning - Number Series & Coding',
    prompt: 'Find the missing term in the sequence: 4, 11, 30, 67, 128, ?',
    type: 'multiple_choice',
    options: ['219', '224', '231', '240'],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Logical Reasoning - Clocks & Angles',
    prompt: 'At what angle are the hands of a clock inclined at 15 minutes past 3 o\'clock?',
    type: 'multiple_choice',
    options: ['0°', '7.5°', '12.5°', '15°'],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Quantitative - Ratios & Proportions',
    prompt: 'Two numbers are in the ratio 3 : 5. If 9 is subtracted from each, the new ratio becomes 12 : 23. What is the smaller number?',
    type: 'multiple_choice',
    options: ['27', '33', '48', '55'],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Quantitative - Averages & Ages',
    prompt: 'The average age of a committee of 8 members is increased by 2 years when two men aged 35 years and 45 years are substituted by two women. What is the average age of the two women?',
    type: 'multiple_choice',
    options: ['48 years', '52 years', '44 years', '40 years'],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Logical Reasoning - Set Theory & Venn Diagrams',
    prompt: 'In a class of 60 students, 35 play Cricket, 20 play Football, and 10 play both sports. How many students play neither Cricket nor Football?',
    type: 'multiple_choice',
    options: ['15', '20', '10', '25'],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Quantitative - Simple & Compound Interest',
    prompt: 'A sum of money at compound interest doubles itself in 4 years. In how many years will it become 8 times itself at the same interest rate?',
    type: 'multiple_choice',
    options: ['8 years', '12 years', '16 years', '24 years'],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'aptitude',
    subtopic: 'Logical Reasoning - Direction Sense Test',
    prompt: 'A person walks 10 km North, turns right and walks 6 km, then turns right again and walks 10 km. How far and in which direction is he from his starting point?',
    type: 'multiple_choice',
    options: ['6 km East', '6 km West', '10 km South', '16 km East'],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  }
];

// CS Fundamentals Question Pool (20 questions)
const CS_FUNDAMENTALS_POOL: Omit<AssessmentQuestion, 'id'>[] = [
  {
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
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Operating Systems - Concurrency & Deadlocks',
    prompt: 'Which of the following conditions is NOT strictly required for a deadlock to occur under Coffman criteria?',
    type: 'multiple_choice',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption allowed by OS', 'Circular Wait'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
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
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
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
    correctOptionIndex: 0,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'OOP & System Design Patterns',
    prompt: 'Which design pattern is best suited for decoupling an abstraction from its implementation so that both can vary independently without subclass explosion?',
    type: 'multiple_choice',
    options: ['Bridge Pattern', 'Singleton Pattern', 'Decorator Pattern', 'Factory Pattern'],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'DBMS - ACID & Isolation Levels',
    prompt: 'Which transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but still allows Phantom Reads in SQL standards?',
    type: 'multiple_choice',
    options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Computer Networks - HTTP Protocol & WebSockets',
    prompt: 'What is the key structural difference between HTTP/1.1 and HTTP/2 regarding request multiplexing over a single TCP connection?',
    type: 'multiple_choice',
    options: [
      'HTTP/2 uses plain text headers while HTTP/1.1 uses binary frames',
      'HTTP/2 introduces binary framing and stream multiplexing over a single TCP connection, eliminating head-of-line blocking at application layer',
      'HTTP/2 deprecates TLS encryption',
      'HTTP/2 requires UDP protocol instead of TCP'
    ],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Operating Systems - Process vs Thread & Synchronization',
    prompt: 'What is the primary difference between a Mutex and a Counting Semaphore?',
    type: 'multiple_choice',
    options: [
      'A Mutex supports inter-process signaling whereas Semaphores only work inside one thread',
      'A Mutex has ownership properties (only the locking thread can unlock it), whereas a Semaphore can be signaled by any thread',
      'Semaphores prevent priority inversion automatically',
      'Mutexes are implemented purely in user-space without syscalls'
    ],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Computer Networks - Web Security & Tokens',
    prompt: 'Which HTTP header attribute prevents JavaScript running in the browser (XSS) from reading or stealing session authentication cookies?',
    type: 'multiple_choice',
    options: ['SameSite=Strict', 'Secure', 'HttpOnly', 'Domain=localhost'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'System Design - Distributed Caching & Invalidation',
    prompt: 'In a distributed system, what is the "Cache Stampede" (Thundering Herd) problem, and how is it mitigated?',
    type: 'multiple_choice',
    options: [
      'When high memory usage causes Redis to crash silently',
      'When a popular cache key expires and thousands of concurrent requests simultaneously hit the database, mitigated by mutex locking or probabilistic early expiration',
      'When cache invalidation messages fail across network partitions',
      'When cache keys overflow the LRU memory buffer'
    ],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'DBMS - Normalization & Schema Design',
    prompt: 'A relational table is in 3rd Normal Form (3NF) if it is in 2NF and what additional condition is satisfied?',
    type: 'multiple_choice',
    options: [
      'Every attribute is atomic and non-divisible',
      'There are no partial dependencies of non-prime attributes on a candidate key',
      'There are no transitive dependencies of non-prime attributes on candidate keys',
      'Every determinant is a super key (BCNF)'
    ],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Operating Systems - CPU Scheduling',
    prompt: 'Which CPU scheduling algorithm guarantees minimum average waiting time for a given set of processes?',
    type: 'multiple_choice',
    options: ['First-Come, First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF) / Shortest Remaining Time First', 'Priority Scheduling'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Computer Networks - DNS & CDN Routing',
    prompt: 'How does a Content Delivery Network (CDN) route a user request to the nearest edge server?',
    type: 'multiple_choice',
    options: [
      'By using Anycast DNS routing or Geo-DNS resolution to map the user IP to the closest edge server',
      'By modifying the client HTTP GET header in the browser',
      'By forcing all traffic through a centralized proxy in Silicon Valley',
      'By encrypting IP headers with SSL certificates'
    ],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'OOP - SOLID Principles',
    prompt: 'According to the Dependency Inversion Principle (DIP) in SOLID, high-level modules should:',
    type: 'multiple_choice',
    options: [
      'Depend directly on concrete low-level implementations',
      'Not depend on low-level modules; both should depend on abstractions',
      'Inherit from base classes rather than interfaces',
      'Avoid using dependency injection frameworks'
    ],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Data Structures - Hash Tables & Collisions',
    prompt: 'What is the worst-case time complexity for search in a Hash Table using Separate Chaining if all keys hash to the same bucket index?',
    type: 'multiple_choice',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'System Design - REST vs gRPC',
    prompt: 'Why does gRPC achieve higher performance and lower payload serialization overhead compared to traditional REST with JSON?',
    type: 'multiple_choice',
    options: [
      'gRPC uses binary Protocol Buffers over HTTP/2 instead of text-based JSON over HTTP/1.1',
      'gRPC eliminates network roundtrips completely',
      'gRPC bypasses TCP and runs directly on raw hardware sockets',
      'REST disables compression algorithms by default'
    ],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Operating Systems - Storage & File Systems',
    prompt: 'In Unix-like file systems, what information is stored in an inode?',
    type: 'multiple_choice',
    options: [
      'The file name and full directory path string',
      'File metadata (file size, permissions, owner, timestamps, pointers to disk data blocks), but NOT the file name',
      'The file data contents directly without disk pointers',
      'The user login passwords and group tokens'
    ],
    correctOptionIndex: 1,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Computer Networks - OSI Model & Layer 4/7',
    prompt: 'At which layer of the OSI model do Routers and Load Balancers operate when inspecting HTTP headers for Layer 7 traffic splitting?',
    type: 'multiple_choice',
    options: ['Layer 3 (Network Layer)', 'Layer 4 (Transport Layer)', 'Layer 7 (Application Layer)', 'Layer 2 (Data Link Layer)'],
    correctOptionIndex: 2,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'DBMS - NoSQL vs SQL & CAP Theorem',
    prompt: 'According to the CAP Theorem, a distributed database under a network partition MUST choose between which two properties?',
    type: 'multiple_choice',
    options: ['Consistency vs Availability', 'Consistency vs Partition Tolerance', 'Availability vs Scalability', 'Durability vs Atomicity'],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  },
  {
    category: 'cs_fundamentals',
    subtopic: 'Software Architecture - Memory Management',
    prompt: 'In garbage-collected runtimes (like Java JVM or Node.js V8), what causes a "Memory Leak" despite automated garbage collection?',
    type: 'multiple_choice',
    options: [
      'Unused objects remain reachable from active Root references (e.g. static maps, event listeners), preventing GC collection',
      'The CPU cache fails to flush L3 memory',
      'Garbage collector only runs when the application shuts down',
      'Pointers are manually allocated using malloc()'
    ],
    correctOptionIndex: 0,
    estimatedMinutes: 2
  }
];

// DSA Question Pool (10 questions)
const DSA_POOL: Omit<AssessmentQuestion, 'id'>[] = [
  {
    category: 'dsa',
    subtopic: 'DSA - Sliding Window & Two Pointers',
    prompt: 'Problem: Given an array of integers `nums` and an integer `k`, find the maximum sum of any contiguous subarray of size `k`. Describe your algorithm approach, edge cases, and state time & space complexity.',
    type: 'code_approach',
    starterCode: `function maxSubarraySum(nums: number[], k: number): number {\n  // Implement sliding window approach\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Trees & Lowest Common Ancestor',
    prompt: 'Problem: Given a Binary Search Tree (BST) and two nodes `p` and `q`, write the algorithm to find their Lowest Common Ancestor (LCA). Explain how BST ordering allows an O(h) solution without auxiliary memory.',
    type: 'code_approach',
    starterCode: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {\n  // Exploit BST properties\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Binary Search on Answer Space',
    prompt: 'Problem: Given an array of integer weights `weights` and an integer `days`, find the minimum ship capacity to convey all packages within `days`. Detail how binary search applies to monotonic search spaces.',
    type: 'code_approach',
    starterCode: `function shipWithinDays(weights: number[], days: number): number {\n  // Binary search on capacity bounds [max(weights), sum(weights)]\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Graph Traversal & Topological Sort',
    prompt: 'Problem: Given `numCourses` and a list of `prerequisites` pairs, determine if it is possible for a student to finish all courses. Explain how Kahn\'s Algorithm (BFS in-degree) detects cycles in directed graphs.',
    type: 'code_approach',
    starterCode: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  // Topological sort / cycle detection\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Dynamic Programming (Knapsack Pattern)',
    prompt: 'Problem: Given an integer array `coins` and a target amount `amount`, compute the fewest number of coins needed to make up that amount. Provide the DP state transitions and space optimization.',
    type: 'code_approach',
    starterCode: `function coinChange(coins: number[], amount: number): number {\n  // dp[i] = min coins to form amount i\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Heap / Priority Queue',
    prompt: 'Problem: Given an unsorted array of integers `nums` and an integer `k`, return the `k`th largest element in the array in O(N log K) time. Explain min-heap vs max-heap trade-offs.',
    type: 'code_approach',
    starterCode: `function findKthLargest(nums: number[], k: number): number {\n  // Maintain a min-heap of size k\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Stack & Monotonic Queue',
    prompt: 'Problem: Given an array of integers `temperatures`, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. Explain monotonic stack behavior.',
    type: 'code_approach',
    starterCode: `function dailyTemperatures(temperatures: number[]): number[] {\n  // Monotonic decreasing stack storing indices\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Interval Manipulation',
    prompt: 'Problem: Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of non-overlapping intervals sorted by start time.',
    type: 'code_approach',
    starterCode: `function merge(intervals: number[][]): number[][] {\n  // Sort by start time then merge sequentially\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Linked List Fast & Slow Pointers',
    prompt: 'Problem: Given the head of a linked list, determine if the linked list has a cycle in it and find the node where the cycle begins. Explain Floyd\'s Tortoise and Hare algorithm mathematical proof.',
    type: 'code_approach',
    starterCode: `function detectCycle(head: ListNode | null): ListNode | null {\n  // Floyd's cycle detection\n}`,
    estimatedMinutes: 4
  },
  {
    category: 'dsa',
    subtopic: 'DSA - Matrix Grid Traversal (BFS/DFS)',
    prompt: 'Problem: Given an `m x n` 2D binary grid `grid` representing a map of 1s (land) and 0s (water), return the number of islands. Compare BFS vs DFS queue/recursion stack memory impact.',
    type: 'code_approach',
    starterCode: `function numIslands(grid: string[][]): number {\n  // Grid traversal via BFS or DFS\n}`,
    estimatedMinutes: 4
  }
];

// Communication / Behavioral Pool (10 questions)
const COMMUNICATION_POOL: Omit<AssessmentQuestion, 'id'>[] = [
  {
    category: 'communication',
    subtopic: 'Behavioral - STAR Conflict Resolution',
    prompt: 'Describe a situation where a team member disagreed with your architectural or technical choice during a college group project. How did you handle the conflict and what was the outcome?',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Ownership Under Failure',
    prompt: 'Tell me about a time you pushed a bug to production or broke the build shortly before a deadline. What immediate action did you take, how did you communicate it, and what was your post-mortem fix?',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Learning Under Pressure',
    prompt: 'You are assigned a critical ticket requiring a technology or framework you have never used before, with only 48 hours to deliver. Walk me step-by-step through how you ramp up and validate your solution.',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Technical Debt vs Speed',
    prompt: 'How do you convince product managers or teammates to allocate time for technical debt cleanup or code refactoring when business stakeholders are pushing for rapid feature delivery?',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Handling Constructive Criticism',
    prompt: 'Describe a code review where a senior peer heavily criticized your implementation or requested major restructuring. How did you react, evaluate their feedback, and adapt your code?',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Communicating Complex Concepts',
    prompt: 'How do you explain a complex distributed system bottleneck (e.g. database locks or cache stampede) to a non-technical project stakeholder or client in plain, understandable terms?',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Cross-Functional Collaboration',
    prompt: 'Share an instance where missing or ambiguous requirements from a designer or backend lead threatened project progress. How did you proactively clarify expectations and keep the project moving forward?',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Prioritization & Trade-offs',
    prompt: 'When facing multiple high-priority bugs and feature requests concurrently with limited bandwidth, what framework or decision model do you use to prioritize what gets built first?',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Post-Mortem & Blameless Culture',
    prompt: 'Explain what a "Blameless Post-Mortem" means to you, and describe how you would facilitate a post-mortem discussion after a major technical outage caused by human error.',
    type: 'scenario_defense',
    estimatedMinutes: 3
  },
  {
    category: 'communication',
    subtopic: 'Behavioral - Onboarding & Knowledge Sharing',
    prompt: 'Describe a time you onboarded a junior student or team member onto a codebase. What documentation, walkthroughs, or pairing strategies did you employ to make them productive quickly?',
    type: 'scenario_defense',
    estimatedMinutes: 3
  }
];

export function generateDynamicQuestions(realityCheck: ResumeRealityCheck): AssessmentQuestion[] {
  const timestamp = Date.now().toString(36);
  const questions: AssessmentQuestion[] = [];

  // Pick 5 random Aptitude questions
  const shuffledAptitude = shuffleArray(APTITUDE_POOL);
  shuffledAptitude.slice(0, 5).forEach((q, idx) => {
    questions.push({
      ...q,
      id: `apt-${timestamp}-${idx + 1}`
    });
  });

  // Pick 5 random CS Fundamentals questions
  const shuffledCS = shuffleArray(CS_FUNDAMENTALS_POOL);
  shuffledCS.slice(0, 5).forEach((q, idx) => {
    questions.push({
      ...q,
      id: `cs-${timestamp}-${idx + 1}`
    });
  });

  // Pick 2 random DSA questions
  const shuffledDSA = shuffleArray(DSA_POOL);
  shuffledDSA.slice(0, 2).forEach((q, idx) => {
    questions.push({
      ...q,
      id: `dsa-${timestamp}-${idx + 1}`
    });
  });

  // Pick 3 random Communication/Behavioral questions
  const shuffledComm = shuffleArray(COMMUNICATION_POOL);
  shuffledComm.slice(0, 3).forEach((q, idx) => {
    questions.push({
      ...q,
      id: `com-${timestamp}-${idx + 1}`
    });
  });

  // Add candidate-specific Project Defense Questions dynamically generated from their resume claims!
  realityCheck.technicalClaims.forEach((claim, idx) => {
    questions.push({
      id: `defense-${timestamp}-${claim.id || idx}`,
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
