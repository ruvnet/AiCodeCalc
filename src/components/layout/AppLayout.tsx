import React from 'react';
import { NavigationBar } from './NavigationBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      {/* Vertical lines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--terminal-primary)/0.03)_1px,transparent_1px)] bg-[size:3rem_1px]"
      />
      {/* Horizontal lines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(var(--terminal-primary)/0.03)_1px,transparent_1px)] bg-[size:1px_3rem]"
      />
      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgb(var(--background-primary))_100%)]"
      />
    </div>
  );
}

function ScanLine() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden opacity-10"
      aria-hidden="true"
    >
      <div 
        className="w-full h-[2px] bg-[linear-gradient(90deg,transparent,rgb(var(--terminal-primary)),transparent)] scan-line"
      />
    </div>
  );
}

function MatrixRain() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none opacity-[0.015] matrix-rain"
      aria-hidden="true"
    />
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans relative overflow-hidden">
      <GridBackground />
      <ScanLine />
      <MatrixRain />
      
      <div className="relative z-10">
        <NavigationBar />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>
        
        <footer className="border-t border-terminal-primary/10 py-6 mt-auto bg-background/80 backdrop-blur">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-muted-foreground">$</span>
                <p className="text-sm font-mono matrix-text">
                  Created by rUv
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-muted-foreground">
                  AiCodeCalc - LLM Development Cost Calculator
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
