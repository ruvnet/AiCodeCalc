import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const defaultValues = {
  // Primary Overheads
  iterationOverhead: 3.5,  // α: Code rewriting/iteration multiplier
  retryFactor: 3.2,       // ε: Retry factor for incorrect outputs
  bugFixOverhead: 3.8,    // δ: Bug fix overhead multiplier
  testingOverhead: 3.4,   // γ: Testing overhead multiplier
  
  // Operational Expenses (OPEX)
  infrastructureCost: 200,     // $200/month for cloud infrastructure
  apiServicesCost: 50,         // $50/month for API services
  monitoringCost: 30,          // $30/month for monitoring tools
  securityCost: 40,            // $40/month for security tools
  backupCost: 20,              // $20/month for backup services
  networkingCost: 30,          // $30/month for networking
  licensingCost: 60,           // $60/month for licenses
  maintenanceCost: 80,         // $80/month for maintenance
  
  // Advanced Overheads
  contextSwitchOverhead: 1.8,  // Time lost when switching between tasks
  toolingOverhead: 2.2,        // Additional overhead from tool setup and management
  documentationOverhead: 1.6,  // Extra tokens for documentation generation
  reviewOverhead: 1.9,         // Code review and quality assurance
  
  // Quality Factors
  qualityThreshold: 0.85,      // Minimum acceptable quality level
  complexityFactor: 2.4,       // Additional overhead for complex tasks
  debuggingMode: false,        // Enhanced debugging and logging
  optimizationLevel: 'balanced' as 'minimal' | 'balanced' | 'aggressive'
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

  // Calculate total monthly OPEX
  const monthlyOpex = 
    (state.overheads.infrastructureCost || defaultValues.infrastructureCost) +
    (state.overheads.apiServicesCost || defaultValues.apiServicesCost) +
    (state.overheads.monitoringCost || defaultValues.monitoringCost) +
    (state.overheads.securityCost || defaultValues.securityCost) +
    (state.overheads.backupCost || defaultValues.backupCost) +
    (state.overheads.networkingCost || defaultValues.networkingCost) +
    (state.overheads.licensingCost || defaultValues.licensingCost) +
    (state.overheads.maintenanceCost || defaultValues.maintenanceCost);

  // Calculate composite overhead including advanced factors
  const compositeOverhead = 
    state.overheads.iterationOverhead * 
    state.overheads.retryFactor * 
    state.overheads.bugFixOverhead * 
    state.overheads.testingOverhead *
    (state.overheads.contextSwitchOverhead || defaultValues.contextSwitchOverhead) *
    (state.overheads.toolingOverhead || defaultValues.toolingOverhead) *
    (state.overheads.documentationOverhead || defaultValues.documentationOverhead) *
    (state.overheads.reviewOverhead || defaultValues.reviewOverhead) *
    (state.overheads.complexityFactor || defaultValues.complexityFactor) *
    (state.overheads.debuggingMode ? 1.5 : 1.0);

  // Apply quality adjustments
  const qualityAdjustedOverhead = compositeOverhead * 
    (1 + (1 - (state.overheads.qualityThreshold || defaultValues.qualityThreshold)));

  // Apply optimization level adjustments
  const optimizationMultiplier = {
    minimal: 1.0,
    balanced: 0.9,
    aggressive: 0.8
  }[(state.overheads.optimizationLevel || defaultValues.optimizationLevel)];

  const finalOverhead = qualityAdjustedOverhead * optimizationMultiplier;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        Overhead Factors
      </h1>

      <div className="bg-background-secondary shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Primary Overheads */}
          <div className="space-y-6">
            <h3 className="text-lg font-mono text-terminal-bright">Primary Overhead Factors</h3>
            
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
                Multiplier for code rewriting/iteration in agentic environment (baseline: 3.5x)
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
                Accounts for repeated calls when initial output is incorrect (baseline: 3.2x)
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
                Extra tokens required to fix discovered bugs (baseline: 3.8x)
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
                Extra tokens for test generation and fixes (baseline: 3.4x)
              </p>
            </div>
          </div>

          {/* Operational Expenses (OPEX) Accordion */}
          <Accordion type="single" collapsible className="bg-background-primary rounded-md">
            <AccordionItem value="opex">
              <AccordionTrigger className="px-4 py-2 text-terminal-bright hover:bg-background-secondary">
                Operational Expenses (OPEX)
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-6">
                <div className="space-y-4">
                  <h4 className="font-mono text-terminal-bright">Infrastructure & Services</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="infrastructureCost">Cloud Infrastructure ($/month)</Label>
                    <Input
                      id="infrastructureCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overheads.infrastructureCost || defaultValues.infrastructureCost}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { infrastructureCost: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiServicesCost">API Services ($/month)</Label>
                    <Input
                      id="apiServicesCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overheads.apiServicesCost || defaultValues.apiServicesCost}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { apiServicesCost: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="networkingCost">Networking & Data Transfer ($/month)</Label>
                    <Input
                      id="networkingCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overheads.networkingCost || defaultValues.networkingCost}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { networkingCost: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono text-terminal-bright">Monitoring & Security</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monitoringCost">Monitoring Tools ($/month)</Label>
                    <Input
                      id="monitoringCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overheads.monitoringCost || defaultValues.monitoringCost}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { monitoringCost: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityCost">Security & Compliance ($/month)</Label>
                    <Input
                      id="securityCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overheads.securityCost || defaultValues.securityCost}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { securityCost: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupCost">Backup & Recovery ($/month)</Label>
                    <Input
                      id="backupCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overheads.backupCost || defaultValues.backupCost}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { backupCost: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono text-terminal-bright">Software & Maintenance</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licensingCost">Software Licenses ($/month)</Label>
                    <Input
                      id="licensingCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overheads.licensingCost || defaultValues.licensingCost}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { licensingCost: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenanceCost">Maintenance & Updates ($/month)</Label>
                    <Input
                      id="maintenanceCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overheads.maintenanceCost || defaultValues.maintenanceCost}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { maintenanceCost: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>
                </div>

                {/* Total Monthly OPEX Display */}
                <div className="pt-4 border-t border-terminal-primary/10">
                  <Label className="text-terminal-bright">Total Monthly OPEX</Label>
                  <p className="text-2xl font-mono text-terminal-bright">
                    ${monthlyOpex.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total operational expenses per month
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Advanced Settings Accordion */}
          <Accordion type="single" collapsible className="bg-background-primary rounded-md">
            <AccordionItem value="advanced">
              <AccordionTrigger className="px-4 py-2 text-terminal-bright hover:bg-background-secondary">
                Advanced Overhead Factors
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-6">
                {/* Process Overheads */}
                <div className="space-y-4">
                  <h4 className="font-mono text-terminal-bright">Process Overheads</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contextSwitchOverhead">Context Switch Overhead</Label>
                    <Input
                      id="contextSwitchOverhead"
                      type="number"
                      min="1"
                      step="0.1"
                      value={state.overheads.contextSwitchOverhead || defaultValues.contextSwitchOverhead}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { contextSwitchOverhead: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toolingOverhead">Tooling Overhead</Label>
                    <Input
                      id="toolingOverhead"
                      type="number"
                      min="1"
                      step="0.1"
                      value={state.overheads.toolingOverhead || defaultValues.toolingOverhead}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { toolingOverhead: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentationOverhead">Documentation Overhead</Label>
                    <Input
                      id="documentationOverhead"
                      type="number"
                      min="1"
                      step="0.1"
                      value={state.overheads.documentationOverhead || defaultValues.documentationOverhead}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { documentationOverhead: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewOverhead">Review Overhead</Label>
                    <Input
                      id="reviewOverhead"
                      type="number"
                      min="1"
                      step="0.1"
                      value={state.overheads.reviewOverhead || defaultValues.reviewOverhead}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { reviewOverhead: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>
                </div>

                {/* Quality Settings */}
                <div className="space-y-4">
                  <h4 className="font-mono text-terminal-bright">Quality Settings</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qualityThreshold">Quality Threshold</Label>
                    <Input
                      id="qualityThreshold"
                      type="number"
                      min="0"
                      max="1"
                      step="0.05"
                      value={state.overheads.qualityThreshold || defaultValues.qualityThreshold}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { qualityThreshold: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complexityFactor">Complexity Factor</Label>
                    <Input
                      id="complexityFactor"
                      type="number"
                      min="1"
                      step="0.1"
                      value={state.overheads.complexityFactor || defaultValues.complexityFactor}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { complexityFactor: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="font-mono bg-background-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optimizationLevel">Optimization Level</Label>
                    <Select
                      value={state.overheads.optimizationLevel || defaultValues.optimizationLevel}
                      onValueChange={(value: 'minimal' | 'balanced' | 'aggressive') =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { optimizationLevel: value },
                        })
                      }
                    >
                      <SelectTrigger className="font-mono bg-background-primary">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="debuggingMode" className="text-terminal-bright">Debugging Mode</Label>
                    <Switch
                      id="debuggingMode"
                      checked={state.overheads.debuggingMode || defaultValues.debuggingMode}
                      onCheckedChange={(checked) =>
                        dispatch({
                          type: 'SET_OVERHEADS',
                          payload: { debuggingMode: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Composite Overhead Display */}
          <div className="pt-4 border-t border-terminal-primary/10">
            <Label className="text-terminal-bright">Composite Overhead (Ω)</Label>
            <p className="text-2xl font-mono text-terminal-bright">
              {finalOverhead.toFixed(2)}x
            </p>
            <p className="text-sm text-muted-foreground">
              Total overhead multiplier including all factors and adjustments
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Monthly OPEX: ${monthlyOpex.toFixed(2)}
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
