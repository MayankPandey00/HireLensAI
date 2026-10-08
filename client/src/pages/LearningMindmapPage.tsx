import React, { useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Network, 
  ArrowLeft, 
  Sparkles, 
  Info, 
  Target, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PlacementReadinessReport, MindmapNodeData } from '../types';
import { Drawer } from '../components/Drawer';

// Custom Node Component for Mindmap Topics
const MindmapCustomNode = ({ data }: { data: MindmapNodeData }) => {
  const isWeak = data.status === 'WEAK';
  const isModerate = data.status === 'MODERATE';
  const isStrong = data.status === 'STRONG';

  const borderColor = isWeak
    ? 'border-rose-500/80 shadow-rose-950/60 shadow-lg'
    : isModerate
    ? 'border-amber-500/80 shadow-amber-950/60 shadow-lg'
    : 'border-emerald-500/80 shadow-emerald-950/60 shadow-lg';

  const badgeBg = isWeak
    ? 'bg-rose-950/90 text-rose-300 border-rose-800'
    : isModerate
    ? 'bg-amber-950/90 text-amber-300 border-amber-800'
    : 'bg-emerald-950/90 text-emerald-300 border-emerald-800';

  const glowDot = isWeak
    ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
    : isModerate
    ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
    : 'bg-emerald-400 shadow-[0_0_8px_#34d399]';

  return (
    <div
      className={`relative min-w-[220px] max-w-[260px] p-4 rounded-2xl bg-[#0e1626]/95 border ${borderColor} backdrop-blur-xl transition-all hover:scale-105 group`}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-2.5 !h-2.5" />
      
      {/* Top Category & Status Header */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">
          {data.category}
        </span>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${badgeBg} flex items-center gap-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${glowDot}`} />
          {data.status}
        </span>
      </div>

      {/* Node Title */}
      <div className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
        {data.label}
      </div>

      {/* Effort & Quick Tip */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-cyan-400" />
          {data.estimatedEffort || '4-6h'}
        </span>
        <span className="text-cyan-400 text-[10px] font-semibold underline underline-offset-2">
          Click to view plan →
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400 !w-2.5 !h-2.5" />
    </div>
  );
};

// Custom Node for the Central Placement Readiness Root
const RootCustomNode = ({ data }: { data: MindmapNodeData }) => {
  return (
    <div className="relative min-w-[270px] p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-950/80 text-center">
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
        <span className="text-[11px] font-mono uppercase font-bold text-cyan-300 tracking-wider">
          Readiness Target Hub
        </span>
      </div>
      <div className="text-base font-extrabold text-white tracking-tight">
        {data.label}
      </div>
      <div className="text-[11px] text-slate-400 mt-1">
        Click to review master preparation timeline
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !w-3 !h-3" />
    </div>
  );
};

export const LearningMindmapPage: React.FC = () => {
  const [report, setReport] = useState<PlacementReadinessReport | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<MindmapNodeData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Default fallback nodes matching our architecture
  const defaultNodes: Node[] = [
    {
      id: 'root-readiness',
      type: 'rootNode',
      position: { x: 420, y: 30 },
      data: {
        label: 'Google SDE Readiness Hub',
        category: 'Target Master',
        status: 'MODERATE',
        whyYouNeedIt: 'Orchestrates high-priority topics required to crack early career software engineering rounds.',
        topicsToLearn: ['Placement Strategy', 'Mock Interview Drills', 'Timed Coding Assessments'],
        recommendedResources: [
          { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/', type: 'guide' },
          { title: 'NeetCode 150 Roadmap', url: 'https://neetcode.io/roadmap', type: 'practice' }
        ],
        estimatedEffort: '2-3 Weeks',
        practiceRecommendation: 'Prioritize red/orange weak areas before tackling moderate review items.'
      }
    },
    {
      id: 'node-project-defense',
      type: 'mindmapNode',
      position: { x: 60, y: 190 },
      data: {
        label: 'Project Defense & Architecture',
        category: 'Project Defense',
        status: 'WEAK',
        severityRank: 1,
        whyYouNeedIt: 'Interviewers immediately test whether you actually built your projects or copied them from tutorials. Failing here is the #1 rejection reason.',
        topicsToLearn: [
          'System Architecture diagrams of your projects',
          'Redis cache eviction policies (LRU, TTL) & Cache Stampede',
          'Database schema normalization and indexing choices',
          'Handling concurrent requests and latency bottlenecks'
        ],
        recommendedResources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'guide' },
          { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'guide' }
        ],
        estimatedEffort: '6-8 Hours',
        practiceRecommendation: 'Record a 5-minute video defending your project architecture without reading notes. Address every choice and trade-off.'
      }
    },
    {
      id: 'node-dsa-sliding-window',
      type: 'mindmapNode',
      position: { x: 420, y: 220 },
      data: {
        label: 'DSA: Sliding Window & Arrays',
        category: 'Algorithms',
        status: 'WEAK',
        severityRank: 2,
        whyYouNeedIt: 'Sliding window is the most frequently tested pattern in online assessments for Tier 1 tech firms.',
        topicsToLearn: [
          'Fixed-size sliding window pattern',
          'Dynamic-size sliding window with hash map frequency',
          'Monotonic Deque (Sliding Window Maximum)',
          'Two-pointer pointer contraction techniques'
        ],
        recommendedResources: [
          { title: 'LeetCode Pattern 3: Sliding Window', url: 'https://leetcode.com/', type: 'practice' },
          { title: 'NeetCode Sliding Window Playlist', url: 'https://neetcode.io/', type: 'video' }
        ],
        estimatedEffort: '8-10 Hours',
        practiceRecommendation: 'Complete 10 Medium-level sliding window problems without looking at solutions for 25 minutes.'
      }
    },
    {
      id: 'node-dbms-indexing',
      type: 'mindmapNode',
      position: { x: 780, y: 190 },
      data: {
        label: 'DBMS: Indexing & Query Plans',
        category: 'CS Fundamentals',
        status: 'WEAK',
        severityRank: 3,
        whyYouNeedIt: 'Backend rounds mandate knowing how data is retrieved at scale. Naive queries will fail technical rounds.',
        topicsToLearn: [
          'B-Tree vs Hash indexing internal mechanics',
          'Leftmost prefix rule in composite indices',
          'EXPLAIN ANALYZE interpretation',
          'ACID properties and isolation levels'
        ],
        recommendedResources: [
          { title: 'Use The Index, Luke! (SQL Indexing Guide)', url: 'https://use-the-index-luke.com/', type: 'guide' },
          { title: 'CMU 15-445 Database Systems Lecture series', url: 'https://15445.courses.cs.cmu.edu/', type: 'video' }
        ],
        estimatedEffort: '5-6 Hours',
        practiceRecommendation: 'Populate 1M rows on PostgreSQL, run EXPLAIN on unindexed vs indexed queries, and inspect execution cost.'
      }
    },
    {
      id: 'node-aptitude-quant',
      type: 'mindmapNode',
      position: { x: 120, y: 410 },
      data: {
        label: 'Aptitude: Speed & Quant',
        category: 'Aptitude',
        status: 'STRONG',
        whyYouNeedIt: 'Initial online screening filters 80% of applicants based on quantitative speed and accuracy.',
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
      type: 'mindmapNode',
      position: { x: 440, y: 440 },
      data: {
        label: 'Behavioral: STAR Storytelling',
        category: 'Communication',
        status: 'STRONG',
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
      type: 'mindmapNode',
      position: { x: 790, y: 410 },
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

  const defaultEdges: Edge[] = [
    { id: 'e-root-defense', source: 'root-readiness', target: 'node-project-defense', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
    { id: 'e-root-dsa', source: 'root-readiness', target: 'node-dsa-sliding-window', animated: true, style: { stroke: '#f97316', strokeWidth: 2 } },
    { id: 'e-root-dbms', source: 'root-readiness', target: 'node-dbms-indexing', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e-defense-star', source: 'node-project-defense', target: 'node-behavioral-star', animated: false, style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    { id: 'e-dsa-apt', source: 'node-dsa-sliding-window', target: 'node-aptitude-quant', animated: false, style: { stroke: '#10b981', strokeWidth: 1.5 } },
    { id: 'e-dbms-os', source: 'node-dbms-indexing', target: 'node-os-concurrency', animated: false, style: { stroke: '#06b6d4', strokeWidth: 1.5 } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);

  useEffect(() => {
    const rawReport = sessionStorage.getItem('hirelens_report');
    if (rawReport) {
      try {
        const parsed: PlacementReadinessReport = JSON.parse(rawReport);
        setReport(parsed);

        if (parsed.mindmap && parsed.mindmap.nodes && parsed.mindmap.nodes.length > 0) {
          const flowNodes: Node[] = parsed.mindmap.nodes.map(n => ({
            id: n.id,
            position: n.position,
            type: n.type || (n.id.includes('root') ? 'rootNode' : 'mindmapNode'),
            data: n.data,
          }));
          const flowEdges: Edge[] = parsed.mindmap.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            animated: e.animated,
            style: e.style,
          }));
          setNodes(flowNodes);
          setEdges(flowEdges);
        }
      } catch (e) {
        console.error('Failed to parse report for mindmap');
      }
    }
  }, [setNodes, setEdges]);

  const nodeTypes = useMemo(() => ({
    mindmapNode: MindmapCustomNode,
    rootNode: RootCustomNode,
  }), []);

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNodeData(node.data as MindmapNodeData);
    setIsDrawerOpen(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col bg-[#070b12] overflow-hidden">
      
      {/* Top Banner Controls & Legend */}
      <div className="z-20 w-full px-4 sm:px-6 py-3 border-b border-slate-800 bg-[#080c14]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/results"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Interactive Placement Learning Mindmap
            </h1>
            <p className="text-[11px] text-slate-400">
              Click any node to open learning objectives, estimated effort, and targeted practice plans.
            </p>
          </div>
        </div>

        {/* Color Legend (Red/Orange = Weak, Yellow = Moderate, Green = Strong) */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            <span className="font-semibold text-[11px]">Weak (Top Risks)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
            <span className="font-semibold text-[11px]">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="font-semibold text-[11px]">Strong</span>
          </div>
        </div>
      </div>

      {/* Main React Flow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.4}
          maxZoom={1.6}
        >
          <Background color="#1e293b" gap={20} size={1.2} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-slate-900 !border-slate-800 !fill-white [&>button]:!bg-slate-900 [&>button]:!border-slate-800 [&>button]:!text-slate-300" />
          <MiniMap
            nodeColor={(n) => {
              if (n.data?.status === 'WEAK') return '#f43f5e';
              if (n.data?.status === 'MODERATE') return '#f59e0b';
              if (n.data?.status === 'STRONG') return '#10b981';
              return '#6366f1';
            }}
            maskColor="rgba(8, 12, 20, 0.75)"
            className="!bg-slate-950 !border !border-slate-800 !rounded-xl"
          />
        </ReactFlow>
      </div>

      {/* Slide-out Drawer for Node Details */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        nodeData={selectedNodeData}
      />

    </div>
  );
};
