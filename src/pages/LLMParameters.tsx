import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/components/ui/use-toast';

interface LLMModel {
  id: string;
  name: string;
  inputCost: number;
  outputCost: number;
  usageShare: number;
}

const defaultModels: LLMModel[] = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    inputCost: 0.03,    // $0.03 per 1K input tokens
    outputCost: 0.06,   // $0.06 per 1K output tokens
    usageShare: 60,     // 60% of code generation
  },
  {
    id: 'gpt35',
    name: 'GPT-3.5 Turbo',
    inputCost: 0.001,   // $0.001 per 1K input tokens
    outputCost: 0.002,  // $0.002 per 1K output tokens
    usageShare: 40,     // 40% of code generation
  },
];

export function LLMParameters() {
  const navigate = useNavigate();
  const { state, dispatch } = useCalculator();
  const { toast } = useToast();

  // Initialize models state from context or defaults
  const [models, setModels] = React.useState<LLMModel[]>(
    state.llmModels.length > 0 ? state.llmModels.map(m => ({
      id: m.name.toLowerCase().replace(/\s+/g, ''),
      name: m.name,
      inputCost: m.inputCost,
      outputCost: m.outputCost,
      usageShare: m.usageShare,
    })) : defaultModels
  );

  // Set default values in context on first render
  React.useEffect(() => {
    if (state.llmModels.length === 0) {
      dispatch({
        type: 'SET_LLM_MODELS',
        payload: defaultModels.map(({ name, inputCost, outputCost, usageShare }) => ({
          name,
          inputCost,
          outputCost,
          usageShare,
        })),
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate total usage share is 100%
    const totalShare = models.reduce((sum, model) => sum + model.usageShare, 0);
    if (Math.abs(totalShare - 100) > 0.01) {
      toast({
        title: "Validation Error",
        description: "Usage share must total 100%",
        variant: "destructive",
      });
      return;
    }

    // Update context with normalized models
    dispatch({
      type: 'SET_LLM_MODELS',
      payload: models.map(m => ({
        name: m.name,
        inputCost: m.inputCost,
        outputCost: m.outputCost,
        usageShare: m.usageShare,
      })),
    });

    navigate('/agent');
  };

  const handleAddModel = () => {
    const newId = `model${models.length + 1}`;
    setModels([
      ...models,
      {
        id: newId,
        name: `Model ${models.length + 1}`,
        inputCost: 0.001,
        outputCost: 0.002,
        usageShare: 0,
      },
    ]);
  };

  const handleRemoveModel = (id: string) => {
    if (models.length <= 1) {
      toast({
        title: "Error",
        description: "At least one model is required",
        variant: "destructive",
      });
      return;
    }
    setModels(models.filter(m => m.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        LLM Configuration
      </h1>

      <div className="bg-background-secondary shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {models.map((model, index) => (
            <div 
              key={model.id}
              className="p-4 border border-terminal-primary/10 bg-background-primary"
            >
              <div className="flex justify-between items-center mb-4">
                <Label className="text-terminal-bright">Model {index + 1}</Label>
                {models.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-2 text-sm border-destructive/20 hover:bg-destructive/10"
                    onClick={() => handleRemoveModel(model.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model Name */}
                <div className="space-y-2">
                  <Label htmlFor={`${model.id}-name`} className="text-terminal-bright">Name</Label>
                  <Input
                    id={`${model.id}-name`}
                    value={model.name}
                    onChange={(e) =>
                      setModels(models.map(m =>
                        m.id === model.id ? { ...m, name: e.target.value } : m
                      ))
                    }
                    className="font-mono bg-background-secondary focus:ring-terminal-primary/20"
                  />
                </div>

                {/* Usage Share */}
                <div className="space-y-2">
                  <Label htmlFor={`${model.id}-share`} className="text-terminal-bright">Usage Share (%)</Label>
                  <Input
                    id={`${model.id}-share`}
                    type="number"
                    min="0"
                    max="100"
                    value={model.usageShare}
                    onChange={(e) =>
                      setModels(models.map(m =>
                        m.id === model.id ? { ...m, usageShare: parseFloat(e.target.value) || 0 } : m
                      ))
                    }
                    className="font-mono bg-background-secondary focus:ring-terminal-primary/20"
                  />
                </div>

                {/* Input Cost */}
                <div className="space-y-2">
                  <Label htmlFor={`${model.id}-input-cost`} className="text-terminal-bright">
                    Input Cost ($/1K tokens)
                  </Label>
                  <Input
                    id={`${model.id}-input-cost`}
                    type="number"
                    min="0"
                    step="0.001"
                    value={model.inputCost}
                    onChange={(e) =>
                      setModels(models.map(m =>
                        m.id === model.id ? { ...m, inputCost: parseFloat(e.target.value) || 0 } : m
                      ))
                    }
                    className="font-mono bg-background-secondary focus:ring-terminal-primary/20"
                  />
                </div>

                {/* Output Cost */}
                <div className="space-y-2">
                  <Label htmlFor={`${model.id}-output-cost`} className="text-terminal-bright">
                    Output Cost ($/1K tokens)
                  </Label>
                  <Input
                    id={`${model.id}-output-cost`}
                    type="number"
                    min="0"
                    step="0.001"
                    value={model.outputCost}
                    onChange={(e) =>
                      setModels(models.map(m =>
                        m.id === model.id ? { ...m, outputCost: parseFloat(e.target.value) || 0 } : m
                      ))
                    }
                    className="font-mono bg-background-secondary focus:ring-terminal-primary/20"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Model Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddModel}
            className="w-full border-terminal-primary/20 hover:bg-terminal-primary/10"
          >
            Add Model
          </Button>

          {/* Usage Share Total */}
          <div className="pt-4 border-t border-terminal-primary/10">
            <Label className="text-terminal-bright">Total Usage Share</Label>
            <p className="text-2xl font-mono text-terminal-bright">
              {models.reduce((sum, model) => sum + model.usageShare, 0)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Must total 100%
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/project')}
            >
              Back: Project Setup
            </Button>
            <Button
              type="submit"
              className="bg-terminal-primary text-background hover:bg-terminal-primary/90"
            >
              Next: Agent Config
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
