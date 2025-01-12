import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/components/ui/use-toast';

const defaultValues = {
  iterationOverhead: 1.5,  // α: Code rewriting/iteration multiplier
  retryFactor: 1.1,       // ε: Retry factor for incorrect outputs
  bugFixOverhead: 1.2,    // δ: Bug fix overhead multiplier
  testingOverhead: 1.3,   // γ: Testing overhead multiplier
};

export function OverheadCalculator() {
  const navigate = useNavigate();
  const { state, dispatch } = useCalculator();
  const { toast } = useToast();

  // Set default values on first render
  React.useEffect(() => {
    if (!state.overheads.iterationOverhead) {
      dispatch({
        type: 'SET_OVERHEADS',
        payload: defaultValues,
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.overheads.iterationOverhead || !state.overheads.retryFactor) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    navigate('/human');
  };

  // Calculate composite overhead
  const compositeOverhead = 
    state.overheads.iterationOverhead * 
    state.overheads.retryFactor * 
    state.overheads.bugFixOverhead * 
    state.overheads.testingOverhead;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        Overhead Factors
      </h1>

      <div className="bg-background-secondary shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Iteration Overhead */}
          <div className="space-y-2">
            <Label htmlFor="iterationOverhead" className="text-terminal-bright">Iteration Overhead (α)</Label>
            <Input
              id="iterationOverhead"
              type="number"
              min="1"
              step="0.1"
              placeholder={defaultValues.iterationOverhead.toString()}
              value={state.overheads.iterationOverhead || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_OVERHEADS',
                  payload: { iterationOverhead: parseFloat(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Multiplier for code rewriting/iteration in agentic environment
            </p>
          </div>

          {/* Retry Factor */}
          <div className="space-y-2">
            <Label htmlFor="retryFactor" className="text-terminal-bright">Retry Factor (ε)</Label>
            <Input
              id="retryFactor"
              type="number"
              min="1"
              step="0.1"
              placeholder={defaultValues.retryFactor.toString()}
              value={state.overheads.retryFactor || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_OVERHEADS',
                  payload: { retryFactor: parseFloat(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Accounts for repeated calls when initial output is incorrect
            </p>
          </div>

          {/* Bug Fix Overhead */}
          <div className="space-y-2">
            <Label htmlFor="bugFixOverhead" className="text-terminal-bright">Bug Fix Overhead (δ)</Label>
            <Input
              id="bugFixOverhead"
              type="number"
              min="1"
              step="0.1"
              placeholder={defaultValues.bugFixOverhead.toString()}
              value={state.overheads.bugFixOverhead || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_OVERHEADS',
                  payload: { bugFixOverhead: parseFloat(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Extra tokens required to fix discovered bugs
            </p>
          </div>

          {/* Testing Overhead */}
          <div className="space-y-2">
            <Label htmlFor="testingOverhead" className="text-terminal-bright">Testing Overhead (γ)</Label>
            <Input
              id="testingOverhead"
              type="number"
              min="1"
              step="0.1"
              placeholder={defaultValues.testingOverhead.toString()}
              value={state.overheads.testingOverhead || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_OVERHEADS',
                  payload: { testingOverhead: parseFloat(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Extra tokens for test generation and fixes
            </p>
          </div>

          {/* Composite Overhead Display */}
          <div className="pt-4 border-t border-terminal-primary/10">
            <Label className="text-terminal-bright">Composite Overhead (Ω)</Label>
            <p className="text-2xl font-mono text-terminal-bright">
              {compositeOverhead.toFixed(2)}x
            </p>
            <p className="text-sm text-muted-foreground">
              Total overhead multiplier (α × ε × δ × γ)
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/agent')}
            >
              Back: Agent Config
            </Button>
            <Button
              type="submit"
              className="bg-terminal-primary text-background hover:bg-terminal-primary/90"
            >
              Next: Human Comparison
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
