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
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/components/ui/use-toast';

const agentModes = [
  { value: 'single', label: 'Single Agent', description: 'One agent working sequentially' },
  { value: 'parallel', label: 'Parallel', description: 'Multiple agents working independently' },
  { value: 'swarm', label: 'Swarm', description: 'Collaborative agent swarm with shared knowledge' },
  { value: 'concurrent', label: 'Concurrent', description: 'Agents working on different tasks simultaneously' },
] as const;

const defaultValues = {
  mode: 'single' as const,
  agentCount: 1,
  parallelTasks: 1,
  coordinationOverhead: 1.1,
  errorPropagation: 1.0,
  swarmEfficiency: 1.0,
};

export function AgentConfig() {
  const navigate = useNavigate();
  const { state, dispatch } = useCalculator();
  const { toast } = useToast();

  // Set default values on first render
  React.useEffect(() => {
    if (!state.agentConfig.mode) {
      dispatch({
        type: 'SET_AGENT_CONFIG',
        payload: defaultValues,
      });
    }
  }, []);

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
              onValueChange={(value: typeof agentModes[number]['value']) =>
                dispatch({
                  type: 'SET_AGENT_CONFIG',
                  payload: { mode: value },
                })
              }
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
              step="0.1"
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
              step="0.1"
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
              step="0.1"
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
