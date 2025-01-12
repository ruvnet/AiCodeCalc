import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/CalculatorContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}

function formatDuration(hours: number): string {
  const totalSeconds = hours * 3600; // Convert hours to seconds
  
  const days = Math.floor(totalSeconds / (24 * 3600));
  const remainingHours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (remainingHours > 0) parts.push(`${remainingHours}h`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);

  return parts.join(' ') || '0m';
}

function calculateTokensPerLine(complexity: string): number {
  switch (complexity) {
    case 'simple': return 3;
    case 'moderate': return 5;
    case 'complex': return 8;
    case 'high-verbosity': return 12;
    default: return 5;
  }
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

// Calculate memory efficiency based on cache size and retention
function calculateMemoryEfficiency(config: AgentConfig): number {
  const { cacheSize, retentionPeriod, pruningStrategy } = config.memoryManagement;
  const baseCacheEfficiency = Math.log2(cacheSize / 1024) * 0.1; // 10% improvement per doubling
  const retentionFactor = Math.min(retentionPeriod / 3600, 2) * 0.05; // Up to 10% from retention
  const pruningBonus = {
    'lru': 0,
    'priority': 0.05,
    'adaptive': 0.1
  }[pruningStrategy];
  return 1 + baseCacheEfficiency + retentionFactor + pruningBonus;
}

// Calculate communication efficiency based on protocol and agent count
function calculateCommunicationEfficiency(config: AgentConfig): number {
  const protocolEfficiency = {
    'broadcast': 1,
    'p2p': 1.1,
    'hierarchical': 1.15
  }[config.communicationProtocol];
  return protocolEfficiency * (1 + config.learningRate * 0.2); // Learning improves communication
}

// Calculate resource allocation efficiency
function calculateResourceEfficiency(config: AgentConfig): number {
  const allocationBonus = {
    'static': 1,
    'dynamic': 1.1,
    'predictive': 1.2
  }[config.resourceAllocation];
  return allocationBonus * (1 + config.specialization * 0.15); // Specialization improves resource use
}

function calculateParallelizationFactor(config: AgentConfig): number {
  const { mode, agentCount, parallelTasks, swarmEfficiency } = config;
  
  // Base parallelization based on mode
  let baseFactor: number;
  switch (mode) {
    case 'single':
      baseFactor = 1;
      break;
    case 'parallel':
      // Parallel mode gets diminishing returns after certain point
      baseFactor = Math.min(agentCount, parallelTasks) * 0.8; // 80% efficiency
      break;
    case 'swarm': {
      // Swarm mode benefits more from additional agents due to collaboration
      const maxTasks = parallelTasks * 1.5; // Can handle 50% more tasks
      baseFactor = Math.min(agentCount, maxTasks) * swarmEfficiency;
      break;
    }
    case 'concurrent':
      // Concurrent mode balances between parallel and swarm
      baseFactor = Math.min(agentCount, parallelTasks * 1.2) * 0.9; // 90% efficiency, 20% more tasks
      break;
    default:
      baseFactor = 1;
  }

  // Apply advanced configuration effects
  const memoryEfficiency = calculateMemoryEfficiency(config);
  const communicationEfficiency = calculateCommunicationEfficiency(config);
  const resourceEfficiency = calculateResourceEfficiency(config);
  
  // Apply diminishing returns for large agent counts
  const diminishingFactor = 1 / (1 + Math.log10(Math.max(agentCount, 1)));
  const advancedFactor = (memoryEfficiency * communicationEfficiency * resourceEfficiency);
  
  return baseFactor * (0.5 + 0.5 * diminishingFactor) * advancedFactor;
}

export function Results() {
  const navigate = useNavigate();
  const { state, dispatch } = useCalculator();
  const [calculationDetails, setCalculationDetails] = React.useState({
    // Overhead factors
    compositeOverhead: 1,
    coordinationOverhead: 1,
    errorMultiplier: 1,
    teamOverhead: 1,
    
    // Processing rates
    baseTokensPerMinute: 500,
    baseTokensPerHour: 30000,
    baseTokensPerDay: 720000,
    effectiveTokensPerHour: 30000,
    effectiveTokensPerDay: 720000,
    
    // Token calculations
    totalBaseTokens: 0,
    totalEffectiveTokens: 0,
    
    // Time calculations
    tokenProcessingHours: 0,
    requestProcessingHours: 0,
    totalRequests: 0
  });

  // Check if we have all required data
  const hasRequiredData = React.useMemo(() => {
    // Skip validation during initial render
    if (!state.project || !state.humanMetrics || !state.llmModels) {
      return true;
    }
    
    return (
      state.project.totalLoc > 0 &&
      state.project.complexity &&
      state.llmModels.length > 0 &&
      state.humanMetrics.hourlyRate > 0 &&
      state.humanMetrics.locPerDay > 0
    );
  }, [
    state.project,
    state.humanMetrics,
    state.llmModels
  ]);

  // Redirect if missing data after initial load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasRequiredData) {
        navigate('/project');
      }
    }, 1000); // Give time for context to load

    return () => clearTimeout(timer);
  }, [hasRequiredData, navigate]);

  useEffect(() => {
    if (!hasRequiredData) return;

    // Calculate total costs and update results
    const tokensPerLine = calculateTokensPerLine(state.project.complexity);
    const totalTokens = state.project.totalLoc * tokensPerLine;
    
    // Calculate composite overhead
    const compositeOverhead = 
      state.overheads.iterationOverhead * 
      state.overheads.retryFactor * 
      state.overheads.bugFixOverhead * 
      state.overheads.testingOverhead;
    
    // Calculate parallelization factor
    const parallelFactor = calculateParallelizationFactor(state.agentConfig);
    
    // Calculate coordination overhead based on agent configuration
    const coordinationOverhead = state.agentConfig.mode === 'single' ? 
      1 : state.agentConfig.coordinationOverhead;
    
    // Calculate error propagation with learning rate reduction
    const baseErrorMultiplier = 1 + (state.agentConfig.errorPropagation - 1) * 
      (state.agentConfig.agentCount > 1 ? Math.log2(state.agentConfig.agentCount) : 0);
    const learningReduction = state.agentConfig.learningRate * 0.3; // Up to 30% error reduction
    const errorMultiplier = Math.max(1, baseErrorMultiplier * (1 - learningReduction));
    
    // Calculate LLM costs with agent configuration
    const llmCost = state.llmModels.reduce((total, model) => {
      const modelTokens = totalTokens * (model.usageShare / 100);
      const inputTokens = modelTokens * 0.3; // Assuming 30% input, 70% output
      const outputTokens = modelTokens * 0.7;
      
      return total + (
        (inputTokens * model.inputCost / 1000) +
        (outputTokens * model.outputCost / 1000)
      );
    }, 0) * compositeOverhead * coordinationOverhead * errorMultiplier;

    // Calculate time estimates for 24/7 operation
    const baseTokensPerMinute = 500;
    const baseTokensPerHour = baseTokensPerMinute * 60;
    const effectiveTokensPerHour = baseTokensPerHour * parallelFactor;
    const totalTokensWithOverhead = totalTokens * compositeOverhead * coordinationOverhead;
    
    // Calculate continuous 24/7 processing time
    const tokenProcessingHours = totalTokensWithOverhead / effectiveTokensPerHour;
    
    // Calculate request-based processing time
    const avgRequestTime = 5; // minutes per request
    const linesPerRequest = 50;
    const estimatedRequests = Math.ceil(state.project.totalLoc / linesPerRequest);
    const requestProcessingHours = (estimatedRequests * avgRequestTime) / 60;
    
    // Final LLM duration is max of token processing and request processing time
    const llmDuration = Math.max(tokenProcessingHours, requestProcessingHours);

    // Calculate human costs
    // Calculate total overhead percentage
    const totalOverheadPercentage = (state.humanMetrics.meetingsPerWeek / 40) + // Convert meetings to percentage
      state.humanMetrics.codeReviewTime +
      state.humanMetrics.documentationTime +
      state.humanMetrics.qaTime +
      state.humanMetrics.technicalDebtTime;
    
    // Add team coordination overhead
    const teamOverhead = state.humanMetrics.developers > 1 
      ? 1 + (Math.log2(state.humanMetrics.developers) * 0.1) // 10% overhead per doubling of team size
      : 1;
    
    // Calculate effective lines per day considering all overheads
    const effectiveLinesPerDay = (state.humanMetrics.locPerDay * state.humanMetrics.developers * (1 - totalOverheadPercentage)) / teamOverhead;
    
    // Calculate total working days needed
    const workingDays = state.project.totalLoc / effectiveLinesPerDay;
    const humanDuration = workingDays * 8; // Store duration in hours for cost calculation
    
    // Calculate total cost including overhead
    const humanCost = humanDuration * state.humanMetrics.hourlyRate * 
      state.humanMetrics.developers * teamOverhead;

    // Store calculation details for display
    setCalculationDetails({
      // Overhead factors
      compositeOverhead,
      coordinationOverhead,
      errorMultiplier,
      teamOverhead,
      
      // Processing rates
      baseTokensPerMinute: 500,
      baseTokensPerHour: baseTokensPerHour,
      baseTokensPerDay: baseTokensPerHour * 24,
      effectiveTokensPerHour: effectiveTokensPerHour,
      effectiveTokensPerDay: effectiveTokensPerHour * 24,
      
      // Token calculations
      totalBaseTokens: totalTokens,
      totalEffectiveTokens: totalTokensWithOverhead,
      
      // Time calculations
      tokenProcessingHours,
      requestProcessingHours,
      totalRequests: Math.ceil(state.project.totalLoc / 50)
    });

    // Update results
    // Calculate pro-rated monthly OPEX costs
    const daysInMonth = 30;
    const projectDurationDays = llmDuration / 24; // Convert hours to days
    const proRatedFactor = projectDurationDays / daysInMonth;
    
    const monthlyOpex = (
      (state.overheads.infrastructureCost || 0) +
      (state.overheads.apiServicesCost || 0) +
      (state.overheads.monitoringCost || 0) +
      (state.overheads.securityCost || 0) +
      (state.overheads.backupCost || 0) +
      (state.overheads.networkingCost || 0) +
      (state.overheads.licensingCost || 0) +
      (state.overheads.maintenanceCost || 0)
    );

    const operationalCost = monthlyOpex * proRatedFactor;
    const totalAgentCost = llmCost + operationalCost;

    dispatch({
      type: 'UPDATE_RESULTS',
      payload: {
        llmCost,
        operationalCost,
        totalAgentCost,
        humanCost,
        llmDuration,
        humanDuration,
        tokenUsage: {
          input: totalTokens * 0.3 * compositeOverhead * coordinationOverhead,
          output: totalTokens * 0.7 * compositeOverhead * coordinationOverhead,
        },
        agentMetrics: {
          totalAgents: state.agentConfig.agentCount,
          effectiveParallelism: parallelFactor,
          coordinationCost: coordinationOverhead,
          errorRate: errorMultiplier,
          timeReduction: (humanDuration - llmDuration) / humanDuration, // Actual time reduction percentage
          costIncrease: (totalAgentCost / humanCost) - 1, // Actual cost increase/decrease percentage
        },
        opexMetrics: {
          monthlyOpex,
          proRatedFactor,
          projectDurationDays,
        },
      },
    });
  }, [
    state.project.totalLoc,
    state.project.complexity,
    state.llmModels,
    state.overheads,
    state.agentConfig,
    state.humanMetrics,
    hasRequiredData
  ]);

  const agentMetrics = state.results.agentMetrics || {
    effectiveParallelism: 1,
    timeReduction: 0,
    costIncrease: 0
  };

  if (!hasRequiredData || !state.results.agentMetrics) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        Cost Analysis Results
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent Operational Costs */}
        <div className="bg-background-secondary shadow-lg p-6">
          <h2 className="text-xl font-mono matrix-text mb-4">Agent Operational Costs</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-mono text-terminal-bright">
                {formatCurrency(state.results.totalAgentCost)}
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                <p>LLM API: {formatCurrency(state.results.llmCost)}</p>
                <p>OPEX: {formatCurrency(state.results.operationalCost)} ({((state.results.opexMetrics?.proRatedFactor || 0) * 100).toFixed(1)}% of ${formatCurrency(state.results.opexMetrics?.monthlyOpex || 0)}/mo)</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Duration</p>
              <p className="text-2xl font-mono text-terminal-bright">
                {formatDuration(state.results.llmDuration)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Token Usage</p>
              <p className="text-base font-mono">
                Input: {formatNumber(state.results.tokenUsage.input)}
              </p>
              <p className="text-base font-mono">
                Output: {formatNumber(state.results.tokenUsage.output)}
              </p>
            </div>
          </div>
        </div>

        {/* Human Development */}
        <div className="bg-background-secondary shadow-lg p-6">
          <h2 className="text-xl font-mono matrix-text mb-4">Human Development</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-mono text-terminal-bright">
                {formatCurrency(state.results.humanCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Duration</p>
              <p className="text-2xl font-mono text-terminal-bright">
                {formatDuration(state.results.humanDuration)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-base font-mono">
                {state.humanMetrics.developers} developer{state.humanMetrics.developers > 1 ? 's' : ''} ({state.humanMetrics.experienceLevel} level)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Productivity</p>
              <p className="text-base font-mono">
                {state.humanMetrics.locPerDay} LOC/day per developer
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Allocation</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="font-mono">Meetings: {state.humanMetrics.meetingsPerWeek || 0}h/week ({((state.humanMetrics.meetingsPerWeek || 0) / 40 * 100).toFixed(1)}%)</p>
                <p className="font-mono">Code Review: {((state.humanMetrics.codeReviewTime || 0) * 100).toFixed(1)}%</p>
                <p className="font-mono">Documentation: {((state.humanMetrics.documentationTime || 0) * 100).toFixed(1)}%</p>
                <p className="font-mono">QA: {((state.humanMetrics.qaTime || 0) * 100).toFixed(1)}%</p>
                <p className="font-mono">Tech Debt: {((state.humanMetrics.technicalDebtTime || 0) * 100).toFixed(1)}%</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Overhead</p>
              <p className="text-xl font-mono text-terminal-bright">
                {(((state.humanMetrics.meetingsPerWeek || 0) / 40 + // Convert meetings to percentage
                   (state.humanMetrics.codeReviewTime || 0) +
                   (state.humanMetrics.documentationTime || 0) +
                   (state.humanMetrics.qaTime || 0) +
                   (state.humanMetrics.technicalDebtTime || 0)) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Agent Configuration Impact */}
        {agentMetrics && (
          <div className="md:col-span-2 bg-background-secondary shadow-lg p-6">
            <h2 className="text-xl font-mono matrix-text mb-4">Agent Configuration Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Effective Parallelism</p>
                <p className="text-2xl font-mono text-terminal-bright">
                  {agentMetrics.effectiveParallelism.toFixed(1)}x
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Reduction</p>
                <p className="text-2xl font-mono text-terminal-bright">
                  {Math.round(agentMetrics.timeReduction * 100)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cost Impact</p>
                <p className="text-2xl font-mono text-terminal-bright">
                  {Math.round(agentMetrics.costIncrease * -100)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cost Savings */}
        <div className="md:col-span-2 bg-background-secondary shadow-lg p-6">
          <h2 className="text-xl font-mono matrix-text mb-4">Cost Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Cost Savings</p>
              <p className="text-2xl font-mono text-terminal-bright">
                {formatCurrency(state.results.humanCost - state.results.totalAgentCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Savings</p>
              <p className="text-2xl font-mono text-terminal-bright">
                {formatDuration(state.results.humanDuration - state.results.llmDuration)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost Reduction</p>
              <p className="text-2xl font-mono text-terminal-bright">
                {Math.round((1 - state.results.totalAgentCost / state.results.humanCost) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-mono font-bold matrix-text">Detailed Metrics</h2>
        
        {/* Token Metrics */}
        <div className="bg-background-secondary shadow-lg p-6">
          <h3 className="text-lg font-mono matrix-text mb-4">Token Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tokens per Line</p>
              <p className="text-xl font-mono text-terminal-bright">
                {calculateTokensPerLine(state.project.complexity)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tokens</p>
              <p className="text-xl font-mono text-terminal-bright">
                {formatNumber(state.results.tokenUsage.input + state.results.tokenUsage.output)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Input/Output Ratio</p>
              <p className="text-xl font-mono text-terminal-bright">30/70</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-background-secondary shadow-lg p-6">
          <h3 className="text-lg font-mono matrix-text mb-4">Performance Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Processing Rate</p>
              <p className="text-xl font-mono text-terminal-bright">
                {formatNumber(30000)} tokens/hour
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Effective Rate</p>
              <p className="text-xl font-mono text-terminal-bright">
                {formatNumber(30000 * (agentMetrics?.effectiveParallelism || 1))} tokens/hour
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lines per Hour</p>
              <p className="text-xl font-mono text-terminal-bright">
                {formatNumber(30000 / calculateTokensPerLine(state.project.complexity))}
              </p>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="bg-background-secondary shadow-lg p-6">
          <h3 className="text-lg font-mono matrix-text mb-4">Efficiency Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cost per Line</p>
              <p className="text-xl font-mono text-terminal-bright">
                {formatCurrency(state.results.totalAgentCost / state.project.totalLoc)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost per Token</p>
              <p className="text-xl font-mono text-terminal-bright">
                {formatCurrency(state.results.totalAgentCost / (state.results.tokenUsage.input + state.results.tokenUsage.output))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lines per Dollar</p>
              <p className="text-xl font-mono text-terminal-bright">
                {formatNumber(state.project.totalLoc / state.results.totalAgentCost)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Details */}
      <div className="mt-8">
        <Accordion type="single" collapsible className="bg-background-secondary">
          <AccordionItem value="calculations">
            <AccordionTrigger className="px-6 text-lg font-mono matrix-text">
              Calculation Details
            </AccordionTrigger>
            <AccordionContent className="px-6 space-y-4">
              <div>
                <h4 className="font-mono text-terminal-bright mb-2">Token Calculations</h4>
                <pre className="text-sm bg-background-primary p-4 rounded">
                  {`Total Tokens = Lines of Code × Tokens per Line
${state.project.totalLoc} × ${calculateTokensPerLine(state.project.complexity)} = ${formatNumber(state.project.totalLoc * calculateTokensPerLine(state.project.complexity))} tokens

Input Tokens (30%) = ${formatNumber(state.results.tokenUsage.input)}
Output Tokens (70%) = ${formatNumber(state.results.tokenUsage.output)}`}
                </pre>
              </div>

              <div>
                <h4 className="font-mono text-terminal-bright mb-2">Advanced Configuration Impact</h4>
                <pre className="text-sm bg-background-primary p-4 rounded">
                  {`1. Memory Management:
Cache Size: ${state.agentConfig.memoryManagement.cacheSize}MB
Retention Period: ${state.agentConfig.memoryManagement.retentionPeriod}s
Pruning Strategy: ${state.agentConfig.memoryManagement.pruningStrategy}
Memory Efficiency: ${calculateMemoryEfficiency(state.agentConfig).toFixed(2)}x

2. Communication Protocol:
Protocol: ${state.agentConfig.communicationProtocol}
Learning Rate: ${state.agentConfig.learningRate}
Communication Efficiency: ${calculateCommunicationEfficiency(state.agentConfig).toFixed(2)}x

3. Resource Management:
Allocation Strategy: ${state.agentConfig.resourceAllocation}
Specialization: ${state.agentConfig.specialization}
Resource Efficiency: ${calculateResourceEfficiency(state.agentConfig).toFixed(2)}x

4. Combined Impact:
Total Efficiency Multiplier: ${(calculateMemoryEfficiency(state.agentConfig) * 
calculateCommunicationEfficiency(state.agentConfig) * 
calculateResourceEfficiency(state.agentConfig)).toFixed(2)}x`}
                </pre>
              </div>

              <div>
                <h4 className="font-mono text-terminal-bright mb-2">Duration Calculations (24/7 Operation)</h4>
                <pre className="text-sm bg-background-primary p-4 rounded">
                  {`1. Base Processing Rates:
Per Minute = ${formatNumber(500)} tokens/minute
Per Hour = ${formatNumber(500 * 60)} tokens/hour
Per Day (24/7) = ${formatNumber(500 * 60 * 24)} tokens/day

2. Parallelization Impact:
Parallel Factor = ${agentMetrics.effectiveParallelism.toFixed(2)}x
Effective Hourly Rate = ${formatNumber(30000 * agentMetrics.effectiveParallelism)} tokens/hour
Effective Daily Rate = ${formatNumber(30000 * 24 * agentMetrics.effectiveParallelism)} tokens/day

3. Total Tokens to Process:
Base Tokens = ${formatNumber(state.results.tokenUsage.input + state.results.tokenUsage.output)}
Overhead Multipliers:
- Composite = ${calculationDetails.compositeOverhead.toFixed(2)}x
- Coordination = ${calculationDetails.coordinationOverhead.toFixed(2)}x
Total Effective Tokens = ${formatNumber((state.results.tokenUsage.input + state.results.tokenUsage.output) * calculationDetails.compositeOverhead * calculationDetails.coordinationOverhead)}

4. Token Processing Time (24/7):
Total Hours = ${formatNumber((state.results.tokenUsage.input + state.results.tokenUsage.output) * calculationDetails.compositeOverhead * calculationDetails.coordinationOverhead)} tokens ÷ ${formatNumber(30000 * agentMetrics.effectiveParallelism)} tokens/hour
= ${((state.results.tokenUsage.input + state.results.tokenUsage.output) * calculationDetails.compositeOverhead * calculationDetails.coordinationOverhead / (30000 * agentMetrics.effectiveParallelism)).toFixed(2)} hours
= ${formatDuration(((state.results.tokenUsage.input + state.results.tokenUsage.output) * calculationDetails.compositeOverhead * calculationDetails.coordinationOverhead) / (30000 * agentMetrics.effectiveParallelism))}

5. Request Processing Time:
Total Requests = ${formatNumber(Math.ceil(state.project.totalLoc / 50))} (${state.project.totalLoc} lines ÷ 50 lines/request)
Processing Time = ${formatNumber(Math.ceil(state.project.totalLoc / 50))} requests × 5 minutes
= ${formatDuration(Math.ceil(state.project.totalLoc / 50) * 5 / 60)}

6. Final Duration (Maximum):
Token Processing Time: ${formatDuration(((state.results.tokenUsage.input + state.results.tokenUsage.output) * calculationDetails.compositeOverhead * calculationDetails.coordinationOverhead) / (30000 * agentMetrics.effectiveParallelism))}
Request Processing Time: ${formatDuration(Math.ceil(state.project.totalLoc / 50) * 5 / 60)}
Final Duration = ${formatDuration(state.results.llmDuration)}
(Continuous 24/7 Operation)`}
                </pre>
              </div>

              <div>
                <h4 className="font-mono text-terminal-bright mb-2">Cost Calculations</h4>
                <pre className="text-sm bg-background-primary p-4 rounded">
                  {`1. LLM Costs:
Base Cost = Σ(model_cost × token_share)
Overhead = ${calculationDetails.compositeOverhead.toFixed(2)} (composite) × ${calculationDetails.coordinationOverhead.toFixed(2)} (coordination) × ${calculationDetails.errorMultiplier.toFixed(2)} (error)
Final Cost = ${formatCurrency(state.results.llmCost)}

2. Human Development Costs:
Base Metrics:
- Hourly Rate: $${state.humanMetrics.hourlyRate}
- Team Size: ${state.humanMetrics.developers} developer(s)
- Experience Level: ${state.humanMetrics.experienceLevel}
- Base Productivity: ${state.humanMetrics.locPerDay} LOC/day/developer

Time Allocation (40-hour week):
- Meetings: ${state.humanMetrics.meetingsPerWeek}h = ${(state.humanMetrics.meetingsPerWeek / 40 * 100).toFixed(1)}%
- Code Review: ${(state.humanMetrics.codeReviewTime * 100).toFixed(1)}%
- Documentation: ${(state.humanMetrics.documentationTime * 100).toFixed(1)}%
- QA: ${(state.humanMetrics.qaTime * 100).toFixed(1)}%
- Technical Debt: ${(state.humanMetrics.technicalDebtTime * 100).toFixed(1)}%
Total Overhead: ${(((state.humanMetrics.meetingsPerWeek / 40) + state.humanMetrics.codeReviewTime + state.humanMetrics.documentationTime + state.humanMetrics.qaTime + state.humanMetrics.technicalDebtTime) * 100).toFixed(1)}%

Team Coordination:
- Base Team Overhead: ${calculationDetails.teamOverhead.toFixed(2)}x
- Onboarding Time: ${state.humanMetrics.onboardingWeeks} weeks

Productivity Calculations:
1. Base Productivity: ${state.humanMetrics.locPerDay} LOC/day/developer
2. Effective Time Available:
   - Weekly Hours: 40 hours
   - Meeting Time: -${state.humanMetrics.meetingsPerWeek} hours (${(state.humanMetrics.meetingsPerWeek / 40 * 100).toFixed(1)}%)
   - Code Review: -${(state.humanMetrics.codeReviewTime * 100).toFixed(1)}%
   - Documentation: -${(state.humanMetrics.documentationTime * 100).toFixed(1)}%
   - QA: -${(state.humanMetrics.qaTime * 100).toFixed(1)}%
   - Technical Debt: -${(state.humanMetrics.technicalDebtTime * 100).toFixed(1)}%
   Total Overhead: ${(((state.humanMetrics.meetingsPerWeek / 40) + state.humanMetrics.codeReviewTime + state.humanMetrics.documentationTime + state.humanMetrics.qaTime + state.humanMetrics.technicalDebtTime) * 100).toFixed(1)}%
   Effective Time: ${(100 - ((state.humanMetrics.meetingsPerWeek / 40) + state.humanMetrics.codeReviewTime + state.humanMetrics.documentationTime + state.humanMetrics.qaTime + state.humanMetrics.technicalDebtTime) * 100).toFixed(1)}%

3. Team Productivity:
   - Raw Team Output: ${state.humanMetrics.locPerDay} LOC × ${state.humanMetrics.developers} developers = ${state.humanMetrics.locPerDay * state.humanMetrics.developers} LOC/day
   - Team Overhead: ${calculationDetails.teamOverhead.toFixed(2)}x (${((calculationDetails.teamOverhead - 1) * 100).toFixed(1)}% coordination overhead)
   - Effective Team Output: ${Math.round((state.humanMetrics.locPerDay * state.humanMetrics.developers) / calculationDetails.teamOverhead)} LOC/day

4. Final Effective Productivity:
   - Available Time: ${(100 - ((state.humanMetrics.meetingsPerWeek / 40) + state.humanMetrics.codeReviewTime + state.humanMetrics.documentationTime + state.humanMetrics.qaTime + state.humanMetrics.technicalDebtTime) * 100).toFixed(1)}%
   - Team Output: ${Math.round((state.humanMetrics.locPerDay * state.humanMetrics.developers) / calculationDetails.teamOverhead)} LOC/day
   - Final Output: ${Math.round((state.humanMetrics.locPerDay * state.humanMetrics.developers * (1 - ((state.humanMetrics.meetingsPerWeek / 40) + state.humanMetrics.codeReviewTime + state.humanMetrics.documentationTime + state.humanMetrics.qaTime + state.humanMetrics.technicalDebtTime))) / calculationDetails.teamOverhead)} LOC/day

Duration Calculation:
- Total LOC: ${formatNumber(state.project.totalLoc)}
- Daily Output: ${Math.round((state.humanMetrics.locPerDay * state.humanMetrics.developers * (1 - ((state.humanMetrics.meetingsPerWeek / 40) + state.humanMetrics.codeReviewTime + state.humanMetrics.documentationTime + state.humanMetrics.qaTime + state.humanMetrics.technicalDebtTime))) / calculationDetails.teamOverhead)} LOC/day
- Working Days: ${Math.ceil(state.project.totalLoc / ((state.humanMetrics.locPerDay * state.humanMetrics.developers * (1 - ((state.humanMetrics.meetingsPerWeek / 40) + state.humanMetrics.codeReviewTime + state.humanMetrics.documentationTime + state.humanMetrics.qaTime + state.humanMetrics.technicalDebtTime))) / calculationDetails.teamOverhead))} days
- Total Hours: ${formatDuration(state.results.humanDuration)} (8-hour workdays)

Cost Calculation:
Hours × Rate × Developers × Team Overhead
= ${formatDuration(state.results.humanDuration)} × $${state.humanMetrics.hourlyRate} × ${state.humanMetrics.developers} × ${calculationDetails.teamOverhead.toFixed(2)}
= ${formatCurrency(state.results.humanCost)}`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => navigate('/human')}
        >
          Back: Human Metrics
        </Button>
        <Button
          onClick={() => dispatch({ type: 'RESET' })}
          variant="outline"
          className="border-terminal-primary/20 hover:bg-terminal-primary/10"
        >
          Reset Calculator
        </Button>
      </div>
    </div>
  );
}
