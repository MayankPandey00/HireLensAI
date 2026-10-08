import { CompanyBenchmark } from '../types/schema';

const COMPANY_PROFILES: Record<string, CompanyBenchmark> = {
  google: {
    companyName: 'Google',
    role: 'Software Engineer (L3 / Early Career)',
    typicalBarDescription: 'High algorithmic rigor, distributed systems fundamentals, clean code hygiene, and Googleyness & leadership principles.',
    coreTechStack: ['C++', 'Java', 'Python', 'Go', 'Distributed Systems', 'Data Structures & Algorithms'],
    roundsStructure: [
      'Round 1: Screening DSA (Arrays, Graphs, DP)',
      'Round 2: Algorithmic Problem Solving & Big-O Complexity',
      'Round 3: System Design / Concurrency Fundamentals',
      'Round 4: Googleyness & Behavioral (STAR format)',
    ],
    focusAreas: ['Dynamic Programming', 'Graph Traversals', 'Operating Systems Concurrency', 'Behavioral STAR stories'],
  },
  amazon: {
    companyName: 'Amazon',
    role: 'Software Development Engineer I (SDE 1)',
    typicalBarDescription: 'Deep dive into resume project claims, OOP design principles, medium/hard DSA, and Amazon Leadership Principles (Customer Obsession, Ownership).',
    coreTechStack: ['Java', 'C++', 'AWS', 'Spring Boot', 'DynamoDB', 'Microservices'],
    roundsStructure: [
      'Round 1: Online Assessment (Debugging + 2 DSA + Work Style Simulation)',
      'Round 2: Technical & Low-Level Design (OOP & Design Patterns)',
      'Round 3: Resume Deep Dive & Project Defense',
      'Round 4: Bar Raiser & Leadership Principles',
    ],
    focusAreas: ['Trees & Graphs', 'Object Oriented Design', 'Project Architecture Defense', 'Leadership Principles'],
  },
  microsoft: {
    companyName: 'Microsoft',
    role: 'Software Engineer',
    typicalBarDescription: 'Solid CS fundamentals (OS, Computer Networks, DBMS), data structures, and ability to handle edge cases.',
    coreTechStack: ['C#', '.NET', 'TypeScript', 'Azure', 'C++', 'SQL'],
    roundsStructure: [
      'Round 1: Online Coding Assessment',
      'Round 2: Data Structures & Algorithms (LinkedLists, Trees, Strings)',
      'Round 3: CS Fundamentals (OS Virtual Memory, DBMS Indexing)',
      'Round 4: Hiring Manager / Values & Culture Fit',
    ],
    focusAreas: ['Strings & Hash Maps', 'DBMS Indexing & Normalization', 'OS Threads vs Processes', 'System Architecture'],
  },
  atlassian: {
    companyName: 'Atlassian',
    role: 'Associate Software Engineer',
    typicalBarDescription: 'Emphasis on clean code, crafting robust tests, concurrency, and real-world project defense.',
    coreTechStack: ['Java', 'React', 'AWS', 'PostgreSQL', 'Microservices'],
    roundsStructure: [
      'Round 1: Coding Challenge (Clean code & unit tests)',
      'Round 2: Data Structures & Real-World Problem Solving',
      'Round 3: System Architecture & Resume Project Defense',
      'Round 4: Values & Collaboration Interview',
    ],
    focusAreas: ['Clean Code Principles', 'Sliding Window & Hash Tables', 'Project Defense', 'Cross-functional Teamwork'],
  },
};

export function getCompanyBenchmark(companyName: string, roleName: string): CompanyBenchmark {
  const normalizedKey = (companyName || '').toLowerCase().trim();
  for (const [key, profile] of Object.entries(COMPANY_PROFILES)) {
    if (normalizedKey.includes(key)) {
      return {
        ...profile,
        role: roleName || profile.role,
      };
    }
  }

  // Smart heuristic for any custom company
  const formattedCompany = companyName ? companyName.trim() : 'Tech Tier 1 Firm';
  const formattedRole = roleName ? roleName.trim() : 'Software Development Engineer';

  return {
    companyName: formattedCompany,
    role: formattedRole,
    typicalBarDescription: `Rigorous technical evaluation focusing on algorithmic efficiency, practical resume project defense, CS fundamentals (OS, DBMS, Networks), and structured communication.`,
    coreTechStack: ['Data Structures & Algorithms', 'System Architecture', 'SQL & Databases', 'Core Backend / Frontend Technologies'],
    roundsStructure: [
      'Round 1: Aptitude & Online Coding Assessment',
      'Round 2: Core Technical & DSA Problem Solving',
      'Round 3: Project Defense & CS Fundamentals Deep Dive',
      'Round 4: Behavioral & Culture Alignment',
    ],
    focusAreas: ['DSA Problem Solving', 'Database Optimization & Schema Design', 'Defending Resume Claims', 'Structured STAR Communication'],
  };
}
