import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCalculator, type AgentConfig as AgentConfigType } from '@/context/CalculatorContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const agentModes = [
  { value: 'single', label: 'Single Agent', description: 'One agent working sequentially' },
  { value: 'parallel', label: 'Parallel', description: 'Multiple agents working independently' },
  { value: 'swarm', label: 'Swarm', description: 'Collaborative agent swarm with shared knowledge' },
  { value: 'concurrent', label: 'Concurrent', description: 'Agents working on different tasks simultaneously' },
] as const;

type AgentMode = typeof agentModes[number]['value'];

const getModeDefaults = (mode: AgentMode): AgentConfigType => {
  switch (mode) {
    case 'single':
      return {
        mode,
        agentCount: 1,
        parallelTasks: 1,
        coordinationOverhead: 1.0,
        errorPropagation: 1.0,
        swarmEfficiency: 1.0,
        batchSize: 1,
        maxConcurrentTokens: 4096,
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
      };
    case 'parallel':
      return {
        mode,
        agentCount: 3,
        parallelTasks: 3,
        coordinationOverhead: 1.2,
        errorPropagation: 1.1,
        swarmEfficiency: 1.2,
        batchSize: 5,
        maxConcurrentTokens: 8192,
        taskDistribution: 'load-balanced',
        resourceAllocation: 'dynamic',
        communicationProtocol: 'p2p',
        learningRate: 0.2,
        specialization: 0.3,
        consensusThreshold: 0.7,
        failureRecovery: 'checkpoint',
        debugMode: false,
        memoryManagement: {
          cacheSize: 2048,
          retentionPeriod: 7200,
          pruningStrategy: 'priority'
        },
        monitoring: {
          metrics: ['latency', 'throughput', 'error-rate', 'resource-usage', 'task-distribution'],
          alertThresholds: {
            latency: 800,
            errorRate: 0.05,
            memoryUsage: 0.8,
            cpuUsage: 0.7
          },
          logLevel: 'info'
        }
      };
    case 'swarm':
      return {
        mode,
        agentCount: 5,
        parallelTasks: 4,
        coordinationOverhead: 1.3,
        errorPropagation: 1.15,
        swarmEfficiency: 1.4,
        batchSize: 8,
        maxConcurrentTokens: 16384,
        taskDistribution: 'adaptive',
        resourceAllocation: 'predictive',
        communicationProtocol: 'hierarchical',
        learningRate: 0.3,
        specialization: 0.8,
        consensusThreshold: 0.9,
        failureRecovery: 'adaptive',
        debugMode: true,
        memoryManagement: {
          cacheSize: 4096,
          retentionPeriod: 14400,
          pruningStrategy: 'adaptive'
        },
        monitoring: {
          metrics: ['latency', 'throughput', 'error-rate', 'resource-usage', 'task-distribution', 'swarm-coherence'],
          alertThresholds: {
            latency: 500,
            errorRate: 0.03,
            memoryUsage: 0.7,
            cpuUsage: 0.6
          },
          logLevel: 'debug'
        }
      };
    case 'concurrent':
      return {
        mode,
        agentCount: 4,
        parallelTasks: 4,
        coordinationOverhead: 1.25,
        errorPropagation: 1.1,
        swarmEfficiency: 1.3,
        batchSize: 6,
        maxConcurrentTokens: 12288,
        taskDistribution: 'priority-based',
        resourceAllocation: 'dynamic',
        communicationProtocol: 'p2p',
        learningRate: 0.25,
        specialization: 0.6,
        consensusThreshold: 0.85,
        failureRecovery: 'checkpoint',
        debugMode: false,
        memoryManagement: {
          cacheSize: 3072,
          retentionPeriod: 10800,
          pruningStrategy: 'priority'
        },
        monitoring: {
          metrics: ['latency', 'throughput', 'error-rate', 'resource-usage', 'task-distribution'],
          alertThresholds: {
            latency: 600,
            errorRate: 0.04,
            memoryUsage: 0.75,
            cpuUsage: 0.65
          },
          logLevel: 'info'
        }
      };
    default:
      return {
        mode: 'single' as const,
        agentCount: 1,
        parallelTasks: 1,
        coordinationOverhead: 1.0,
        errorPropagation: 1.0,
        swarmEfficiency: 1.0,
        batchSize: 1,
        maxConcurrentTokens: 4096,
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
      };
  }
};

const defaultValues = getModeDefaults('single');

export function AgentConfig() {
  const navigate = useNavigate();
  const { state, dispatch } = useCalculator();
  const { toast } = useToast();

  // Set default values on first render or mode change
  React.useEffect(() => {
    if (!state.agentConfig.mode) {
      dispatch({
        type: 'SET_AGENT_CONFIG',
        payload: defaultValues,
      });
    }
  }, []);

  // Update values when mode changes
  const handleModeChange = (value: typeof agentModes[number]['value']) => {
    const newDefaults = getModeDefaults(value);
    dispatch({
      type: 'SET_AGENT_CONFIG',
      payload: newDefaults,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.agentConfig.mode || !state.agentConfig.agentCount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    navigate('/overhead');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        Agent Configuration
      </h1>

      <div className="bg-background-secondary shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Agent Mode */}
          <div className="space-y-2">
            <Label htmlFor="mode" className="text-terminal-bright">Agent Mode</Label>
            <Select
              value={state.agentConfig.mode}
              onValueChange={handleModeChange}
            >
              <SelectTrigger className="font-mono bg-background-primary focus:ring-terminal-primary/20">
                <SelectValue placeholder="Select agent mode" />
              </SelectTrigger>
              <SelectContent className="bg-background-primary">
                {agentModes.map((mode) => (
                  <SelectItem
                    key={mode.value}
                    value={mode.value}
                    className="font-mono"
                  >
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How agents will collaborate on the project
            </p>
          </div>

          {/* Number of Agents */}
          <div className="space-y-2">
            <Label htmlFor="agentCount" className="text-terminal-bright">Number of Agents</Label>
            <Input
              id="agentCount"
              type="number"
              min="1"
              placeholder={defaultValues.agentCount.toString()}
              value={state.agentConfig.agentCount || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_AGENT_CONFIG',
                  payload: { agentCount: parseInt(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Total number of agents working on the project
            </p>
          </div>

          {/* Parallel Tasks */}
          <div className="space-y-2">
            <Label htmlFor="parallelTasks" className="text-terminal-bright">Maximum Parallel Tasks</Label>
            <Input
              id="parallelTasks"
              type="number"
              min="1"
              placeholder={defaultValues.parallelTasks.toString()}
              value={state.agentConfig.parallelTasks || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_AGENT_CONFIG',
                  payload: { parallelTasks: parseInt(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Maximum number of tasks that can run in parallel
            </p>
          </div>

          {/* Coordination Overhead */}
          <div className="space-y-2">
            <Label htmlFor="coordinationOverhead" className="text-terminal-bright">Coordination Overhead</Label>
            <Input
              id="coordinationOverhead"
              type="number"
              min="1"
              step="0.001"
              placeholder={defaultValues.coordinationOverhead.toString()}
              value={state.agentConfig.coordinationOverhead || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_AGENT_CONFIG',
                  payload: { coordinationOverhead: parseFloat(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Additional overhead for agent coordination (1.0 = no overhead)
            </p>
          </div>

          {/* Error Propagation */}
          <div className="space-y-2">
            <Label htmlFor="errorPropagation" className="text-terminal-bright">Error Propagation</Label>
            <Input
              id="errorPropagation"
              type="number"
              min="1"
              step="0.001"
              placeholder={defaultValues.errorPropagation.toString()}
              value={state.agentConfig.errorPropagation || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_AGENT_CONFIG',
                  payload: { errorPropagation: parseFloat(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              How errors compound in multi-agent systems (1.0 = linear)
            </p>
          </div>

          {/* Swarm Efficiency */}
          <div className="space-y-2">
            <Label htmlFor="swarmEfficiency" className="text-terminal-bright">Swarm Efficiency</Label>
            <Input
              id="swarmEfficiency"
              type="number"
              min="0"
              max="2"
              step="0.001"
              placeholder={defaultValues.swarmEfficiency.toString()}
              value={state.agentConfig.swarmEfficiency || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_AGENT_CONFIG',
                  payload: { swarmEfficiency: parseFloat(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Efficiency multiplier for swarm behavior (1.0 = neutral)
            </p>
          </div>

          {/* Advanced Settings Accordion */}
          <Accordion type="single" collapsible className="bg-background-primary rounded-md">
            <AccordionItem value="advanced">
              <AccordionTrigger className="px-4 py-2 text-terminal-bright hover:bg-background-secondary">
                Advanced Settings
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-6">
                {/* Task Distribution */}
                <div className="space-y-2">
                  <Label htmlFor="taskDistribution" className="text-terminal-bright">Task Distribution Strategy</Label>
                  <Select
                    value={state.agentConfig.taskDistribution}
                    onValueChange={(value: 'round-robin' | 'load-balanced' | 'priority-based' | 'adaptive') =>
                      dispatch({
                        type: 'SET_AGENT_CONFIG',
                        payload: { taskDistribution: value },
                      })
                    }
                  >
                    <SelectTrigger className="font-mono bg-background-primary">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="load-balanced">Load Balanced</SelectItem>
                      <SelectItem value="priority-based">Priority Based</SelectItem>
                      <SelectItem value="adaptive">Adaptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resource Allocation */}
                <div className="space-y-2">
                  <Label htmlFor="resourceAllocation" className="text-terminal-bright">Resource Allocation</Label>
                  <Select
                    value={state.agentConfig.resourceAllocation}
                    onValueChange={(value: 'static' | 'dynamic' | 'predictive') =>
                      dispatch({
                        type: 'SET_AGENT_CONFIG',
                        payload: { resourceAllocation: value },
                      })
                    }
                  >
                    <SelectTrigger className="font-mono bg-background-primary">
                      <SelectValue placeholder="Select allocation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                      <SelectItem value="predictive">Predictive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Communication Protocol */}
                <div className="space-y-2">
                  <Label htmlFor="communicationProtocol" className="text-terminal-bright">Communication Protocol</Label>
                  <Select
                    value={state.agentConfig.communicationProtocol}
                    onValueChange={(value: 'broadcast' | 'p2p' | 'hierarchical') =>
                      dispatch({
                        type: 'SET_AGENT_CONFIG',
                        payload: { communicationProtocol: value },
                      })
                    }
                  >
                    <SelectTrigger className="font-mono bg-background-primary">
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broadcast">Broadcast</SelectItem>
                      <SelectItem value="p2p">Peer-to-Peer</SelectItem>
                      <SelectItem value="hierarchical">Hierarchical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Learning and Adaptation */}
                <div className="space-y-4">
                  <h4 className="font-mono text-terminal-bright">Learning & Adaptation</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="learningRate">Learning Rate</Label>
                    <Slider
                      id="learningRate"
                      min={0}
                      max={1}
                      step={0.001}
                      value={[state.agentConfig.learningRate]}
                      onValueChange={([value]) =>
                        dispatch({
                          type: 'SET_AGENT_CONFIG',
                          payload: { learningRate: value },
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground text-right">{state.agentConfig.learningRate.toFixed(1)}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Slider
                      id="specialization"
                      min={0}
                      max={1}
                      step={0.001}
                      value={[state.agentConfig.specialization]}
                      onValueChange={([value]) =>
                        dispatch({
                          type: 'SET_AGENT_CONFIG',
                          payload: { specialization: value },
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground text-right">{state.agentConfig.specialization.toFixed(1)}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consensusThreshold">Consensus Threshold</Label>
                    <Slider
                      id="consensusThreshold"
                      min={0}
                      max={1}
                      step={0.001}
                      value={[state.agentConfig.consensusThreshold]}
                      onValueChange={([value]) =>
                        dispatch({
                          type: 'SET_AGENT_CONFIG',
                          payload: { consensusThreshold: value },
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground text-right">{state.agentConfig.consensusThreshold.toFixed(1)}</p>
                  </div>
                </div>

                {/* Memory Management */}
                <div className="space-y-4">
                  <h4 className="font-mono text-terminal-bright">Memory Management</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cacheSize">Cache Size (MB)</Label>
                    <Input
                      id="cacheSize"
                      type="number"
                      min="256"
                      step="256"
                      value={state.agentConfig.memoryManagement.cacheSize}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_AGENT_CONFIG',
                          payload: {
                            memoryManagement: {
                              ...state.agentConfig.memoryManagement,
                              cacheSize: parseInt(e.target.value) || 1024
                            }
                          },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retentionPeriod">Retention Period (s)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      min="60"
                      step="60"
                      value={state.agentConfig.memoryManagement.retentionPeriod}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_AGENT_CONFIG',
                          payload: {
                            memoryManagement: {
                              ...state.agentConfig.memoryManagement,
                              retentionPeriod: parseInt(e.target.value) || 3600
                            }
                          },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pruningStrategy">Pruning Strategy</Label>
                    <Select
                      value={state.agentConfig.memoryManagement.pruningStrategy}
                      onValueChange={(value: 'lru' | 'priority' | 'adaptive') =>
                        dispatch({
                          type: 'SET_AGENT_CONFIG',
                          payload: {
                            memoryManagement: {
                              ...state.agentConfig.memoryManagement,
                              pruningStrategy: value
                            }
                          },
                        })
                      }
                    >
                      <SelectTrigger className="font-mono bg-background-primary">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lru">LRU</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="adaptive">Adaptive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Debug Mode */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="debugMode" className="text-terminal-bright">Debug Mode</Label>
                  <Switch
                    id="debugMode"
                    checked={state.agentConfig.debugMode}
                    onCheckedChange={(checked) =>
                      dispatch({
                        type: 'SET_AGENT_CONFIG',
                        payload: { debugMode: checked },
                      })
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Navigation */}
          <div className="flex justify-between space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/llm')}
            >
              Back: LLM Config
            </Button>
            <Button
              type="submit"
              className="bg-terminal-primary text-background hover:bg-terminal-primary/90"
            >
              Next: Overhead Factors
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
