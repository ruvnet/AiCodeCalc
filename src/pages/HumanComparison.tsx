import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/components/ui/use-toast';

const defaultValues = {
  hourlyRate: 80,    // Average fully-loaded developer cost per hour
  locPerDay: 50,     // Lines of code per day per developer
  developers: 1,     // Number of developers on the project
};

export function HumanComparison() {
  const navigate = useNavigate();
  const { state, dispatch } = useCalculator();
  const { toast } = useToast();

  // Set default values on first render
  React.useEffect(() => {
    if (!state.humanMetrics.hourlyRate) {
      dispatch({
        type: 'SET_HUMAN_METRICS',
        payload: defaultValues,
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.humanMetrics.hourlyRate || !state.humanMetrics.locPerDay) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    navigate('/analysis');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        Human Development Comparison
      </h1>

      <div className="bg-background-secondary shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-terminal-bright">Developer Hourly Rate (USD)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="1"
              placeholder={defaultValues.hourlyRate.toString()}
              value={state.humanMetrics.hourlyRate || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_HUMAN_METRICS',
                  payload: { hourlyRate: parseFloat(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Average fully-loaded cost (salary, benefits, overhead) per hour
            </p>
          </div>

          {/* Lines of Code per Day */}
          <div className="space-y-2">
            <Label htmlFor="locPerDay" className="text-terminal-bright">Lines of Code per Day</Label>
            <Input
              id="locPerDay"
              type="number"
              min="1"
              placeholder={defaultValues.locPerDay.toString()}
              value={state.humanMetrics.locPerDay || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_HUMAN_METRICS',
                  payload: { locPerDay: parseInt(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Effective lines of code per day, including testing & debugging
            </p>
          </div>

          {/* Number of Developers */}
          <div className="space-y-2">
            <Label htmlFor="developers" className="text-terminal-bright">Number of Developers</Label>
            <Input
              id="developers"
              type="number"
              min="1"
              placeholder={defaultValues.developers.toString()}
              value={state.humanMetrics.developers || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_HUMAN_METRICS',
                  payload: { developers: parseInt(e.target.value) || 0 },
                })
              }
              className="font-mono bg-background-primary focus:ring-terminal-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Number of developers working on the project
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/overhead')}
            >
              Back: Overhead
            </Button>
            <Button
              type="submit"
              className="bg-terminal-primary text-background hover:bg-terminal-primary/90"
            >
              Next: Analysis
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
