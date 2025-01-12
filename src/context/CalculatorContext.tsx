import React, { createContext, useContext, useReducer } from 'react';

interface ProjectData {
  projectName: string;
  totalLoc: number;
  complexity: string;
  timeline: number;
}

interface LLMModel {
  name: string;
  inputCost: number;
  outputCost: number;
  usageShare: number;
  // Performance metrics from SynthLang evaluation
  executionTime: number;      // Response time in seconds
  accuracy: number;           // Accuracy percentage
  tokenEfficiency: number;    // Token efficiency percentage
  reasoningScore: number;     // Reasoning capability score
  memoryUsage: number;        // Memory usage in MB
  errorRate: number;          // Error rate percentage
  apiCallsPerTask: number;    // Average API calls per task
  cacheHitRate: number;       // Cache hit rate percentage
  // Category-specific scores
  patternRecognition: number; // Pattern recognition score
  contextUnderstanding: number; // Context understanding score
  algorithmOptimization: number; // Algorithm optimization score
  schemaHandling: number;     // Schema handling score
}

interface Overheads {
  // Primary Overheads
  iterationOverhead: number;  // α: Code rewriting/iteration multiplier
  retryFactor: number;        // ε: Retry factor for incorrect outputs
  bugFixOverhead: number;     // δ: Bug fix overhead multiplier
  testingOverhead: number;    // γ: Testing overhead multiplier
  
  // Operational Expenses (OPEX)
  infrastructureCost?: number;    // Cloud/server infrastructure costs per month
  apiServicesCost?: number;       // Third-party API costs per month
  monitoringCost?: number;        // Monitoring and observability tools cost
  securityCost?: number;          // Security and compliance tools cost
  backupCost?: number;            // Backup and disaster recovery cost
  networkingCost?: number;        // Data transfer and networking costs
  licensingCost?: number;         // Software licenses and tools cost
  maintenanceCost?: number;       // Regular maintenance and updates cost
  
  // Advanced Overheads
  contextSwitchOverhead?: number;  // Time lost when switching between tasks
  toolingOverhead?: number;        // Additional overhead from tool setup and management
  documentationOverhead?: number;  // Extra tokens for documentation generation
  reviewOverhead?: number;         // Code review and quality assurance
  
  // Quality Factors
  qualityThreshold?: number;      // Minimum acceptable quality level
  complexityFactor?: number;      // Additional overhead for complex tasks
  debuggingMode?: boolean;        // Enhanced debugging and logging
  optimizationLevel?: 'minimal' | 'balanced' | 'aggressive';  // Optimization strategy
}

export interface HumanMetrics {
  hourlyRate: number;
  locPerDay: number;
  developers: number;
  experienceLevel?: 'junior' | 'mid' | 'senior';
  onboardingWeeks?: number;
  meetingsPerWeek?: number;
  codeReviewTime?: number;
  documentationTime?: number;
  qaTime?: number;
  technicalDebtTime?: number;
}

export interface AgentConfig {
  mode: 'single' | 'swarm' | 'parallel' | 'concurrent';
  agentCount: number;         // Number of agents in the system
  parallelTasks: number;      // Number of tasks that can run in parallel
  coordinationOverhead: number; // Additional overhead for agent coordination
  errorPropagation: number;   // How errors compound in multi-agent systems
  swarmEfficiency: number;    // Efficiency gain/loss from swarm behavior
  batchSize: number;          // For batch processing mode
  maxConcurrentTokens: number; // Token limit for concurrent operations
  // Advanced settings
  taskDistribution: 'round-robin' | 'load-balanced' | 'priority-based' | 'adaptive';
  resourceAllocation: 'static' | 'dynamic' | 'predictive';
  communicationProtocol: 'broadcast' | 'p2p' | 'hierarchical';
  learningRate: number;       // Rate of agent learning and adaptation
  specialization: number;     // Degree of agent specialization
  consensusThreshold: number; // Required agreement level for decisions
  failureRecovery: 'restart' | 'checkpoint' | 'adaptive';
  debugMode: boolean;         // Enable detailed debugging
  memoryManagement: {
    cacheSize: number;        // Size of agent memory cache
    retentionPeriod: number;  // How long to retain context
    pruningStrategy: 'lru' | 'priority' | 'adaptive';
  };
  monitoring: {
    metrics: string[];        // Metrics to track
    alertThresholds: Record<string, number>;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };
}

interface CalculationResults {
  llmCost: number;           // Pure LLM API costs
  operationalCost: number;   // Pro-rated OPEX costs
  totalAgentCost: number;    // Combined LLM + OPEX costs
  humanCost: number;
  llmDuration: number;       // In hours instead of days
  humanDuration: number;
  tokenUsage: {
    input: number;
    output: number;
  };
  agentMetrics?: {
    totalAgents: number;
    effectiveParallelism: number;
    coordinationCost: number;
    errorRate: number;
    timeReduction: number;    // Time saved due to parallelization
    costIncrease: number;     // Additional cost due to agent overhead
  };
  opexMetrics?: {
    monthlyOpex: number;      // Total monthly operational expenses
    proRatedFactor: number;   // Project duration as fraction of month
    projectDurationDays: number; // Project duration in days
  };
}

interface CalculatorState {
  project: ProjectData;
  llmModels: LLMModel[];
  overheads: Overheads;
  humanMetrics: HumanMetrics;
  agentConfig: AgentConfig;
  results: CalculationResults;
}

type CalculatorAction =
  | { type: 'SET_PROJECT_DATA'; payload: Partial<ProjectData> }
  | { type: 'SET_LLM_MODELS'; payload: LLMModel[] }
  | { type: 'SET_OVERHEADS'; payload: Partial<Overheads> }
  | { type: 'SET_HUMAN_METRICS'; payload: Partial<HumanMetrics> }
  | { type: 'SET_AGENT_CONFIG'; payload: Partial<AgentConfig> }
  | { type: 'UPDATE_RESULTS'; payload: CalculationResults }
  | { type: 'RESET' };

const initialState: CalculatorState = {
  project: {
    projectName: '',
    totalLoc: 0,
    complexity: '',
    timeline: 0,
  },
  llmModels: [],
  overheads: {
    // Primary Overheads
    iterationOverhead: 3.5,
    retryFactor: 3.2,
    bugFixOverhead: 3.8,
    testingOverhead: 3.4,
    
    // Operational Expenses (OPEX)
    infrastructureCost: 200,     // $200/month for cloud infrastructure
    apiServicesCost: 50,         // $50/month for API services
    monitoringCost: 30,          // $30/month for monitoring tools
    securityCost: 40,            // $40/month for security tools
    backupCost: 20,              // $20/month for backup services
    networkingCost: 30,          // $30/month for networking
    licensingCost: 60,           // $60/month for licenses
    maintenanceCost: 80,         // $80/month for maintenance
    
    // Advanced Overheads
    contextSwitchOverhead: 1.8,
    toolingOverhead: 2.2,
    documentationOverhead: 1.6,
    reviewOverhead: 1.9,
    
    // Quality Factors
    qualityThreshold: 0.85,
    complexityFactor: 2.4,
    debuggingMode: false,
    optimizationLevel: 'balanced'
  },
  humanMetrics: {
    hourlyRate: 80,
    locPerDay: 50,
    developers: 1,
    experienceLevel: 'mid',
    onboardingWeeks: 2,
    meetingsPerWeek: 5,
    codeReviewTime: 0.2,
    documentationTime: 0.1,
    qaTime: 0.15,
    technicalDebtTime: 0.1,
  },
  agentConfig: {
    mode: 'single',
    agentCount: 1,
    parallelTasks: 1,
    coordinationOverhead: 1.1,
    errorPropagation: 1.0,
    swarmEfficiency: 1.0,
    batchSize: 1,
    maxConcurrentTokens: 4096,
    // Advanced settings defaults
    taskDistribution: 'round-robin',
    resourceAllocation: 'static',
    communicationProtocol: 'broadcast',
    learningRate: 0.1,
    specialization: 0.5,
    consensusThreshold: 0.8,
    failureRecovery: 'restart',
    debugMode: false,
    memoryManagement: {
      cacheSize: 1024,
      retentionPeriod: 3600,
      pruningStrategy: 'lru'
    },
    monitoring: {
      metrics: ['latency', 'throughput', 'error-rate', 'resource-usage'],
      alertThresholds: {
        latency: 1000,
        errorRate: 0.1,
        memoryUsage: 0.9,
        cpuUsage: 0.8
      },
      logLevel: 'info'
    }
  },
  results: {
    llmCost: 0,
    operationalCost: 0,
    totalAgentCost: 0,
    humanCost: 0,
    llmDuration: 0,
    humanDuration: 0,
    tokenUsage: {
      input: 0,
      output: 0,
    },
    opexMetrics: {
      monthlyOpex: 0,
      proRatedFactor: 0,
      projectDurationDays: 0,
    },
  },
};

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'SET_PROJECT_DATA':
      return {
        ...state,
        project: { ...state.project, ...action.payload },
      };
    case 'SET_LLM_MODELS':
      return {
        ...state,
        llmModels: action.payload,
      };
    case 'SET_OVERHEADS':
      return {
        ...state,
        overheads: { ...state.overheads, ...action.payload },
      };
    case 'SET_HUMAN_METRICS':
      return {
        ...state,
        humanMetrics: { ...state.humanMetrics, ...action.payload },
      };
    case 'SET_AGENT_CONFIG':
      return {
        ...state,
        agentConfig: { ...state.agentConfig, ...action.payload },
      };
    case 'UPDATE_RESULTS':
      return {
        ...state,
        results: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const CalculatorContext = createContext<{
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
} | null>(null);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
