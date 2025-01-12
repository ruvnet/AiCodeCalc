import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/components/ui/use-toast';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LLMModel {
  id: string;
  name: string;
  inputCost: number;
  outputCost: number;
  usageShare: number;
  // Performance metrics from SynthLang evaluation
  executionTime: number;
  accuracy: number;
  tokenEfficiency: number;
  reasoningScore: number;
  memoryUsage: number;
  errorRate: number;
  apiCallsPerTask: number;
  cacheHitRate: number;
  // Category-specific scores
  patternRecognition: number;
  contextUnderstanding: number;
  algorithmOptimization: number;
  schemaHandling: number;
}

const defaultModels: LLMModel[] = [
  {
    id: 'gpt4',
    name: 'GPT-4 (SynthLang Optimized)',
    inputCost: 0.03,
    outputCost: 0.06,
    usageShare: 60,
    // Performance metrics based on SynthLang evaluation
    executionTime: 2.5,
    accuracy: 97,
    tokenEfficiency: 93,
    reasoningScore: 95,
    memoryUsage: 896,
    errorRate: 3,
    apiCallsPerTask: 8,
    cacheHitRate: 85,
    // Category-specific scores
    patternRecognition: 98,
    contextUnderstanding: 95,
    algorithmOptimization: 96,
    schemaHandling: 95,
  },
  {
    id: 'gpt35',
    name: 'GPT-3.5 Turbo (Traditional)',
    inputCost: 0.001,
    outputCost: 0.002,
    usageShare: 40,
    // Performance metrics based on traditional approach
    executionTime: 2.1,
    accuracy: 85,
    tokenEfficiency: 78,
    reasoningScore: 72,
    memoryUsage: 512,
    errorRate: 15,
    apiCallsPerTask: 12,
    cacheHitRate: 60,
    // Category-specific scores
    patternRecognition: 70,
    contextUnderstanding: 72,
    algorithmOptimization: 65,
    schemaHandling: 70,
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
      // Default performance metrics for existing models
      executionTime: 2.5,
      accuracy: 85,
      tokenEfficiency: 78,
      reasoningScore: 72,
      memoryUsage: 512,
      errorRate: 15,
      apiCallsPerTask: 12,
      cacheHitRate: 60,
      patternRecognition: 70,
      contextUnderstanding: 72,
      algorithmOptimization: 65,
      schemaHandling: 70,
    })) : defaultModels
  );

  // Set default values in context on first render
  React.useEffect(() => {
    if (state.llmModels.length === 0) {
      dispatch({
        type: 'SET_LLM_MODELS',
        payload: defaultModels,
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

    // Update context with all model data
    dispatch({
      type: 'SET_LLM_MODELS',
      payload: models,
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
        // Default performance metrics for new models
        executionTime: 2.1,
        accuracy: 85,
        tokenEfficiency: 78,
        reasoningScore: 72,
        memoryUsage: 512,
        errorRate: 15,
        apiCallsPerTask: 12,
        cacheHitRate: 60,
        patternRecognition: 70,
        contextUnderstanding: 72,
        algorithmOptimization: 65,
        schemaHandling: 70,
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
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-mono font-bold text-terminal-bright">Model Configuration</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure the LLM models that will be used in your development workflow. Define cost parameters and usage distribution across different models to optimize your token budget and performance requirements.
          </p>
        </CardContent>
      </Card>

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

              {/* Performance Metrics Accordion */}
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="performance">
                  <AccordionTrigger className="text-terminal-bright hover:bg-background-secondary px-2">
                    Performance Metrics
                  </AccordionTrigger>
                  <AccordionContent className="px-2 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Core Metrics */}
                      <div className="space-y-4">
                        <h4 className="font-mono text-terminal-bright">Core Metrics</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`${model.id}-execution-time`}>Execution Time (s)</Label>
                          <Input
                            id={`${model.id}-execution-time`}
                            type="number"
                            step="0.1"
                            value={model.executionTime}
                            onChange={(e) =>
                              setModels(models.map(m =>
                                m.id === model.id ? { ...m, executionTime: parseFloat(e.target.value) || 0 } : m
                              ))
                            }
                            className="font-mono bg-background-secondary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${model.id}-accuracy`}>Accuracy (%)</Label>
                          <Input
                            id={`${model.id}-accuracy`}
                            type="number"
                            min="0"
                            max="100"
                            value={model.accuracy}
                            onChange={(e) =>
                              setModels(models.map(m =>
                                m.id === model.id ? { ...m, accuracy: parseFloat(e.target.value) || 0 } : m
                              ))
                            }
                            className="font-mono bg-background-secondary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${model.id}-token-efficiency`}>Token Efficiency (%)</Label>
                          <Input
                            id={`${model.id}-token-efficiency`}
                            type="number"
                            min="0"
                            max="100"
                            value={model.tokenEfficiency}
                            onChange={(e) =>
                              setModels(models.map(m =>
                                m.id === model.id ? { ...m, tokenEfficiency: parseFloat(e.target.value) || 0 } : m
                              ))
                            }
                            className="font-mono bg-background-secondary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${model.id}-reasoning-score`}>Reasoning Score (%)</Label>
                          <Input
                            id={`${model.id}-reasoning-score`}
                            type="number"
                            min="0"
                            max="100"
                            value={model.reasoningScore}
                            onChange={(e) =>
                              setModels(models.map(m =>
                                m.id === model.id ? { ...m, reasoningScore: parseFloat(e.target.value) || 0 } : m
                              ))
                            }
                            className="font-mono bg-background-secondary"
                          />
                        </div>
                      </div>

                      {/* System Metrics */}
                      <div className="space-y-4">
                        <h4 className="font-mono text-terminal-bright">System Metrics</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`${model.id}-memory-usage`}>Memory Usage (MB)</Label>
                          <Input
                            id={`${model.id}-memory-usage`}
                            type="number"
                            min="0"
                            value={model.memoryUsage}
                            onChange={(e) =>
                              setModels(models.map(m =>
                                m.id === model.id ? { ...m, memoryUsage: parseFloat(e.target.value) || 0 } : m
                              ))
                            }
                            className="font-mono bg-background-secondary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${model.id}-error-rate`}>Error Rate (%)</Label>
                          <Input
                            id={`${model.id}-error-rate`}
                            type="number"
                            min="0"
                            max="100"
                            value={model.errorRate}
                            onChange={(e) =>
                              setModels(models.map(m =>
                                m.id === model.id ? { ...m, errorRate: parseFloat(e.target.value) || 0 } : m
                              ))
                            }
                            className="font-mono bg-background-secondary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${model.id}-api-calls`}>API Calls per Task</Label>
                          <Input
                            id={`${model.id}-api-calls`}
                            type="number"
                            min="0"
                            value={model.apiCallsPerTask}
                            onChange={(e) =>
                              setModels(models.map(m =>
                                m.id === model.id ? { ...m, apiCallsPerTask: parseFloat(e.target.value) || 0 } : m
                              ))
                            }
                            className="font-mono bg-background-secondary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${model.id}-cache-hit-rate`}>Cache Hit Rate (%)</Label>
                          <Input
                            id={`${model.id}-cache-hit-rate`}
                            type="number"
                            min="0"
                            max="100"
                            value={model.cacheHitRate}
                            onChange={(e) =>
                              setModels(models.map(m =>
                                m.id === model.id ? { ...m, cacheHitRate: parseFloat(e.target.value) || 0 } : m
                              ))
                            }
                            className="font-mono bg-background-secondary"
                          />
                        </div>
                      </div>

                      {/* Category Scores */}
                      <div className="space-y-4 md:col-span-2">
                        <h4 className="font-mono text-terminal-bright">Category Scores (%)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${model.id}-pattern-recognition`}>Pattern Recognition</Label>
                            <Input
                              id={`${model.id}-pattern-recognition`}
                              type="number"
                              min="0"
                              max="100"
                              value={model.patternRecognition}
                              onChange={(e) =>
                                setModels(models.map(m =>
                                  m.id === model.id ? { ...m, patternRecognition: parseFloat(e.target.value) || 0 } : m
                                ))
                              }
                              className="font-mono bg-background-secondary"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${model.id}-context-understanding`}>Context Understanding</Label>
                            <Input
                              id={`${model.id}-context-understanding`}
                              type="number"
                              min="0"
                              max="100"
                              value={model.contextUnderstanding}
                              onChange={(e) =>
                                setModels(models.map(m =>
                                  m.id === model.id ? { ...m, contextUnderstanding: parseFloat(e.target.value) || 0 } : m
                                ))
                              }
                              className="font-mono bg-background-secondary"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${model.id}-algorithm-optimization`}>Algorithm Optimization</Label>
                            <Input
                              id={`${model.id}-algorithm-optimization`}
                              type="number"
                              min="0"
                              max="100"
                              value={model.algorithmOptimization}
                              onChange={(e) =>
                                setModels(models.map(m =>
                                  m.id === model.id ? { ...m, algorithmOptimization: parseFloat(e.target.value) || 0 } : m
                                ))
                              }
                              className="font-mono bg-background-secondary"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${model.id}-schema-handling`}>Schema Handling</Label>
                            <Input
                              id={`${model.id}-schema-handling`}
                              type="number"
                              min="0"
                              max="100"
                              value={model.schemaHandling}
                              onChange={(e) =>
                                setModels(models.map(m =>
                                  m.id === model.id ? { ...m, schemaHandling: parseFloat(e.target.value) || 0 } : m
                                ))
                              }
                              className="font-mono bg-background-secondary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
