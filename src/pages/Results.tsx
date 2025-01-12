import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/CalculatorContext';

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
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`;
  } else if (hours < 24) {
    return `${Math.round(hours)} hours`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days} days${remainingHours > 0 ? ` ${remainingHours} hours` : ''}`;
  }
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
  mode: 'single' | 'parallel' | 'swarm' | 'concurrent';
  agentCount: number;
  parallelTasks: number;
  swarmEfficiency: number;
}

function calculateParallelizationFactor(config: AgentConfig): number {
  const { mode, agentCount, parallelTasks, swarmEfficiency } = config;
  
  switch (mode) {
    case 'single':
      return 1;
    case 'parallel':
      return Math.min(agentCount, parallelTasks);
    case 'swarm':
      return agentCount * swarmEfficiency;
    case 'concurrent':
      return Math.min(agentCount, parallelTasks) * 0.8; // 20% coordination overhead
    default:
      return 1;
  }
}

export function Results() {
  const navigate = useNavigate();
  const { state, dispatch } = useCalculator();

  useEffect(() => {
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
    
    // Calculate error propagation based on agent count
    const errorMultiplier = 1 + (state.agentConfig.errorPropagation - 1) * 
      (state.agentConfig.agentCount > 1 ? Math.log2(state.agentConfig.agentCount) : 0);
    
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

    // Calculate time estimates
    const baseTokensPerHour = 100000; // Base tokens processed per hour
    const effectiveTokensPerHour = baseTokensPerHour * parallelFactor;
    const totalTokensWithOverhead = totalTokens * compositeOverhead * coordinationOverhead;
    const llmDuration = totalTokensWithOverhead / effectiveTokensPerHour;

    // Calculate human costs
    const hoursPerDay = 8;
    const daysRequired = state.project.totalLoc / 
      (state.humanMetrics.locPerDay * state.humanMetrics.developers);
    const humanDuration = daysRequired * hoursPerDay;
    const humanCost = humanDuration * state.humanMetrics.hourlyRate * 
      state.humanMetrics.developers;

    // Update results
    dispatch({
      type: 'UPDATE_RESULTS',
      payload: {
        llmCost,
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
          timeReduction: 1 / parallelFactor,
          costIncrease: coordinationOverhead * errorMultiplier,
        },
      },
    });
  }, []);

  const agentMetrics = state.results.agentMetrics;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        Cost Analysis Results
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LLM Development */}
        <div className="bg-background-secondary shadow-lg p-6">
          <h2 className="text-xl font-mono matrix-text mb-4">LLM Development</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-mono text-terminal-bright">
                {formatCurrency(state.results.llmCost)}
              </p>
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
                {state.humanMetrics.developers} developer{state.humanMetrics.developers > 1 ? 's' : ''}
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
                  {Math.round((1 - agentMetrics.timeReduction) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cost Impact</p>
                <p className="text-2xl font-mono text-terminal-bright">
                  {Math.round((agentMetrics.costIncrease - 1) * 100)}%
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
                {formatCurrency(state.results.humanCost - state.results.llmCost)}
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
                {Math.round((1 - state.results.llmCost / state.results.humanCost) * 100)}%
              </p>
            </div>
          </div>
        </div>
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
