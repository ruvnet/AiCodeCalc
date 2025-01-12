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
}

interface Overheads {
  iterationOverhead: number;  // α: Code rewriting/iteration multiplier
  retryFactor: number;        // ε: Retry factor for incorrect outputs
  bugFixOverhead: number;     // δ: Bug fix overhead multiplier
  testingOverhead: number;    // γ: Testing overhead multiplier
}

interface HumanMetrics {
  hourlyRate: number;
  locPerDay: number;
  developers: number;
}

interface AgentConfig {
  mode: 'single' | 'swarm' | 'parallel' | 'concurrent';
  agentCount: number;         // Number of agents in the system
  parallelTasks: number;      // Number of tasks that can run in parallel
  coordinationOverhead: number; // Additional overhead for agent coordination
  errorPropagation: number;   // How errors compound in multi-agent systems
  swarmEfficiency: number;    // Efficiency gain/loss from swarm behavior
  batchSize: number;          // For batch processing mode
  maxConcurrentTokens: number; // Token limit for concurrent operations
}

interface CalculationResults {
  llmCost: number;
  humanCost: number;
  llmDuration: number;        // In hours instead of days
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
    iterationOverhead: 1.5,
    retryFactor: 1.1,
    bugFixOverhead: 1.2,
    testingOverhead: 1.3,
  },
  humanMetrics: {
    hourlyRate: 80,
    locPerDay: 50,
    developers: 1,
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
  },
  results: {
    llmCost: 0,
    humanCost: 0,
    llmDuration: 0,
    humanDuration: 0,
    tokenUsage: {
      input: 0,
      output: 0,
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
