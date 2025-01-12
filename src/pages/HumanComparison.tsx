import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCalculator, type HumanMetrics } from '@/context/CalculatorContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultValues: Required<HumanMetrics> = {
  hourlyRate: 80,    // Average fully-loaded developer cost per hour
  locPerDay: 50,     // Lines of code per day per developer
  developers: 1,     // Number of developers on the project
  experienceLevel: 'mid' as const,  // Developer experience level
  onboardingWeeks: 2,     // Weeks needed for onboarding
  meetingsPerWeek: 5,     // Hours spent in meetings per week
  codeReviewTime: 0.2,    // Percentage of time spent on code reviews (20%)
  documentationTime: 0.1,  // Percentage of time spent on documentation (10%)
  qaTime: 0.15,          // Percentage of time spent on QA (15%)
  technicalDebtTime: 0.1, // Percentage of time handling technical debt (10%)
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

          {/* Advanced Options */}
          <Accordion type="single" collapsible className="bg-background-primary rounded-md">
            <AccordionItem value="advanced">
              <AccordionTrigger className="px-4 py-2 text-terminal-bright hover:bg-background-secondary">
                Advanced Options
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-6">
                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel" className="text-terminal-bright">Team Experience Level</Label>
                  <Select
                    value={state.humanMetrics.experienceLevel || defaultValues.experienceLevel}
                    onValueChange={(value: 'junior' | 'mid' | 'senior') =>
                      dispatch({
                        type: 'SET_HUMAN_METRICS',
                        payload: { experienceLevel: value },
                      })
                    }
                  >
                    <SelectTrigger className="font-mono bg-background-primary">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (1-2 years)</SelectItem>
                      <SelectItem value="mid">Mid-Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (6+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Onboarding Time */}
                <div className="space-y-2">
                  <Label htmlFor="onboardingWeeks" className="text-terminal-bright">Onboarding Time (weeks)</Label>
                  <Input
                    id="onboardingWeeks"
                    type="number"
                    min="0"
                    placeholder={defaultValues.onboardingWeeks.toString()}
                    value={state.humanMetrics.onboardingWeeks || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_HUMAN_METRICS',
                        payload: { onboardingWeeks: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="font-mono bg-background-primary"
                  />
                </div>

                {/* Meetings per Week */}
                <div className="space-y-2">
                  <Label htmlFor="meetingsPerWeek" className="text-terminal-bright">Meeting Hours per Week</Label>
                  <Input
                    id="meetingsPerWeek"
                    type="number"
                    min="0"
                    max="40"
                    placeholder={defaultValues.meetingsPerWeek.toString()}
                    value={state.humanMetrics.meetingsPerWeek || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_HUMAN_METRICS',
                        payload: { meetingsPerWeek: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="font-mono bg-background-primary"
                  />
                </div>

                {/* Time Allocation Percentages */}
                <div className="space-y-4">
                  <Label className="text-terminal-bright block">Time Allocation (%)</Label>
                  
                  {/* Code Review Time */}
                  <div className="space-y-2">
                    <Label htmlFor="codeReviewTime" className="text-sm">Code Review</Label>
                    <Input
                      id="codeReviewTime"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      placeholder={(defaultValues.codeReviewTime * 100).toString()}
                      value={state.humanMetrics.codeReviewTime ? state.humanMetrics.codeReviewTime * 100 : ''}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_HUMAN_METRICS',
                          payload: { codeReviewTime: parseInt(e.target.value) / 100 || 0 },
                        })
                      }
                      className="font-mono bg-background-primary"
                    />
                  </div>

                  {/* Documentation Time */}
                  <div className="space-y-2">
                    <Label htmlFor="documentationTime" className="text-sm">Documentation</Label>
                    <Input
                      id="documentationTime"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      placeholder={(defaultValues.documentationTime * 100).toString()}
                      value={state.humanMetrics.documentationTime ? state.humanMetrics.documentationTime * 100 : ''}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_HUMAN_METRICS',
                          payload: { documentationTime: parseInt(e.target.value) / 100 || 0 },
                        })
                      }
                      className="font-mono bg-background-primary"
                    />
                  </div>

                  {/* QA Time */}
                  <div className="space-y-2">
                    <Label htmlFor="qaTime" className="text-sm">Quality Assurance</Label>
                    <Input
                      id="qaTime"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      placeholder={(defaultValues.qaTime * 100).toString()}
                      value={state.humanMetrics.qaTime ? state.humanMetrics.qaTime * 100 : ''}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_HUMAN_METRICS',
                          payload: { qaTime: parseInt(e.target.value) / 100 || 0 },
                        })
                      }
                      className="font-mono bg-background-primary"
                    />
                  </div>

                  {/* Technical Debt Time */}
                  <div className="space-y-2">
                    <Label htmlFor="technicalDebtTime" className="text-sm">Technical Debt</Label>
                    <Input
                      id="technicalDebtTime"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      placeholder={(defaultValues.technicalDebtTime * 100).toString()}
                      value={state.humanMetrics.technicalDebtTime ? state.humanMetrics.technicalDebtTime * 100 : ''}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_HUMAN_METRICS',
                          payload: { technicalDebtTime: parseInt(e.target.value) / 100 || 0 },
                        })
                      }
                      className="font-mono bg-background-primary"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
