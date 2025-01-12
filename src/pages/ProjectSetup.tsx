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

const complexityOptions = [
  { value: 'simple', label: 'Simple Scripting', tokensPerLoc: 3 },
  { value: 'moderate', label: 'Moderate Business Logic', tokensPerLoc: 5 },
  { value: 'complex', label: 'Complex Algorithms', tokensPerLoc: 8 },
  { value: 'high-verbosity', label: 'High-verbosity Frameworks', tokensPerLoc: 12 },
] as const;

const defaultValues = {
  projectName: 'My Awesome Project',
  totalLoc: 10000,
  complexity: 'moderate',
  timeline: 30,
};

export function ProjectSetup() {
  const navigate = useNavigate();
  const { state, dispatch } = useCalculator();
  const { toast } = useToast();

  // Set default values on first render
  React.useEffect(() => {
    if (!state.project.projectName) {
      dispatch({
        type: 'SET_PROJECT_DATA',
        payload: defaultValues,
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.project.projectName || !state.project.totalLoc) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    navigate('/llm');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        Project Setup
      </h1>

      <div className="bg-background-secondary shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-terminal-bright">Project Name</Label>
            <Input
              id="projectName"
              placeholder={defaultValues.projectName}
              value={state.project.projectName}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PROJECT_DATA',
                  payload: { projectName: e.target.value },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
          </div>

          {/* Lines of Code */}
          <div className="space-y-2">
            <Label htmlFor="totalLoc" className="text-terminal-bright">Total Lines of Code</Label>
            <Input
              id="totalLoc"
              type="number"
              min="1"
              placeholder={defaultValues.totalLoc.toString()}
              value={state.project.totalLoc || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PROJECT_DATA',
                  payload: { totalLoc: parseInt(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Estimated total lines of code to be generated
            </p>
          </div>

          {/* Complexity */}
          <div className="space-y-2">
            <Label htmlFor="complexity" className="text-terminal-bright">Language/Domain Complexity</Label>
            <Select
              value={state.project.complexity}
              onValueChange={(value: typeof complexityOptions[number]['value']) =>
                dispatch({
                  type: 'SET_PROJECT_DATA',
                  payload: { complexity: value },
                })
              }
            >
              <SelectTrigger className="font-mono bg-background-primary focus:ring-terminal-primary/20">
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent className="bg-background-primary">
                {complexityOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="font-mono"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Affects token usage estimation
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline" className="text-terminal-bright">Project Timeline (days)</Label>
            <Input
              id="timeline"
              type="number"
              min="1"
              placeholder={defaultValues.timeline.toString()}
              value={state.project.timeline || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PROJECT_DATA',
                  payload: { timeline: parseInt(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="submit"
              className="bg-terminal-primary text-background hover:bg-terminal-primary/90"
            >
              Next: LLM Parameters
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
