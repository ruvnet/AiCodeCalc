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
        
        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="border-t border-terminal-primary/10 py-6 mt-auto bg-background/80 backdrop-blur">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-muted-foreground">$</span>
                <p className="text-sm font-mono matrix-text">
                  Created by rUv
                </p>
                <a 
                  href="https://github.com/ruvnet/AiCodeCalc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-muted-foreground hover:text-terminal-primary transition-colors"
                  aria-label="View source on GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-github"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-muted-foreground">
                  AiCodeCalc - Agentic Development Cost Calculator
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
