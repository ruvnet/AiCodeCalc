import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectSetup } from '@/pages/ProjectSetup';
import { LLMParameters } from '@/pages/LLMParameters';
import { AgentConfig } from '@/pages/AgentConfig';
import { OverheadCalculator } from '@/pages/OverheadCalculator';
import { HumanComparison } from '@/pages/HumanComparison';
import { Results } from '@/pages/Results';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router basename="/">
      <CalculatorProvider>
        <AppLayout>
          <Routes>
            {/* Redirect root to project setup */}
            <Route path="/" element={<Navigate to="/project" replace />} />
            
            {/* Main routes */}
            <Route path="/project" element={<ProjectSetup />} />
            <Route path="/llm" element={<LLMParameters />} />
            <Route path="/agent" element={<AgentConfig />} />
            <Route path="/overhead" element={<OverheadCalculator />} />
            <Route path="/human" element={<HumanComparison />} />
            <Route path="/analysis" element={<Results />} />
            
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/project" replace />} />
          </Routes>
          
          <Toaster />
        </AppLayout>
      </CalculatorProvider>
    </Router>
  );
}

export default App;
