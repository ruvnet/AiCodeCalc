import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Documentation() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-mono font-bold mb-6 matrix-text">
        Documentation
      </h1>

      <div className="space-y-6">
        <div className="bg-background-secondary p-6 rounded-lg shadow-lg">
          <p className="text-muted-foreground mb-4">
            AiCodeCalc is a sophisticated calculator designed to analyze and compare the costs and efficiency of LLM-powered development versus traditional human development. This documentation provides detailed information about each component and how to use the calculator effectively.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {/* Project Setup */}
          <AccordionItem value="project" className="bg-background-secondary rounded-lg">
            <AccordionTrigger className="px-6 py-4 text-terminal-bright hover:bg-background-tertiary">
              Project Setup
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 space-y-4">
              <h3 className="text-lg font-mono text-terminal-bright">Configuration Options</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Project Name: Identifier for your development project</li>
                <li>Total Lines of Code: Estimated project size in LOC</li>
                <li>Language/Domain Complexity: Affects token usage and processing time
                  <ul className="list-disc pl-6 mt-2">
                    <li>Simple: 3 tokens per line</li>
                    <li>Moderate: 5 tokens per line</li>
                    <li>Complex: 8 tokens per line</li>
                    <li>High-verbosity: 12 tokens per line</li>
                  </ul>
                </li>
                <li>Development Timeline: Expected duration in months</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* LLM Configuration */}
          <AccordionItem value="llm" className="bg-background-secondary rounded-lg">
            <AccordionTrigger className="px-6 py-4 text-terminal-bright hover:bg-background-tertiary">
              LLM Configuration
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 space-y-4">
              <h3 className="text-lg font-mono text-terminal-bright">Model Settings</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Model Selection: Choose from various LLM models</li>
                <li>Input/Output Costs: Per-token costs for model usage</li>
                <li>Usage Share: Percentage allocation between models</li>
                <li>Performance Metrics:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Execution Time: Response latency</li>
                    <li>Accuracy: Output correctness rate</li>
                    <li>Token Efficiency: Token utilization</li>
                    <li>Memory Usage: Resource consumption</li>
                  </ul>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Agent Configuration */}
          <AccordionItem value="agent" className="bg-background-secondary rounded-lg">
            <AccordionTrigger className="px-6 py-4 text-terminal-bright hover:bg-background-tertiary">
              Agent Configuration
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 space-y-4">
              <h3 className="text-lg font-mono text-terminal-bright">Agent Settings</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Agent Mode:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Single: One agent handling all tasks</li>
                    <li>Parallel: Multiple independent agents</li>
                    <li>Swarm: Collaborative agent network</li>
                    <li>Concurrent: Balanced parallel/swarm hybrid</li>
                  </ul>
                </li>
                <li>Advanced Settings:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Task Distribution Strategy</li>
                    <li>Resource Allocation</li>
                    <li>Communication Protocol</li>
                    <li>Memory Management</li>
                  </ul>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Overhead Factors */}
          <AccordionItem value="overhead" className="bg-background-secondary rounded-lg">
            <AccordionTrigger className="px-6 py-4 text-terminal-bright hover:bg-background-tertiary">
              Overhead Factors
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 space-y-4">
              <h3 className="text-lg font-mono text-terminal-bright">Cost Factors</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Primary Overheads:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Iteration Overhead (α): Code rewriting multiplier</li>
                    <li>Retry Factor (ε): Error correction factor</li>
                    <li>Bug Fix Overhead (δ): Debugging multiplier</li>
                    <li>Testing Overhead (γ): Test generation factor</li>
                  </ul>
                </li>
                <li>Operational Expenses:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Infrastructure Costs</li>
                    <li>API Services</li>
                    <li>Monitoring & Security</li>
                    <li>Maintenance & Updates</li>
                  </ul>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Human Development */}
          <AccordionItem value="human" className="bg-background-secondary rounded-lg">
            <AccordionTrigger className="px-6 py-4 text-terminal-bright hover:bg-background-tertiary">
              Human Development
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 space-y-4">
              <h3 className="text-lg font-mono text-terminal-bright">Team Metrics</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Basic Metrics:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Hourly Rate: Developer cost per hour</li>
                    <li>Lines per Day: Development velocity</li>
                    <li>Team Size: Number of developers</li>
                  </ul>
                </li>
                <li>Advanced Metrics:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Experience Level Impact</li>
                    <li>Onboarding Time</li>
                    <li>Meeting Overhead</li>
                    <li>Code Review Time</li>
                  </ul>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Results Analysis */}
          <AccordionItem value="results" className="bg-background-secondary rounded-lg">
            <AccordionTrigger className="px-6 py-4 text-terminal-bright hover:bg-background-tertiary">
              Results Analysis
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 space-y-4">
              <h3 className="text-lg font-mono text-terminal-bright">Output Metrics</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Cost Analysis:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Total Development Costs</li>
                    <li>Cost per Line of Code</li>
                    <li>Cost Savings Analysis</li>
                  </ul>
                </li>
                <li>Time Analysis:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Development Duration</li>
                    <li>Time Savings</li>
                    <li>Efficiency Metrics</li>
                  </ul>
                </li>
                <li>Performance Metrics:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Token Usage Statistics</li>
                    <li>Processing Rates</li>
                    <li>Resource Utilization</li>
                  </ul>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
