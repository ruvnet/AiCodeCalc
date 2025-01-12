import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

const navItems = [
  { path: '/project', label: 'Project Setup' },
  { path: '/llm', label: 'LLM Config' },
  { path: '/agent', label: 'Agent Config' },
  { path: '/overhead', label: 'Overhead' },
  { path: '/human', label: 'Human Dev' },
  { path: '/analysis', label: 'Analysis' },
] as const;

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="border-b border-terminal-primary/10 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 font-mono matrix-text"
          >
            <span className="text-sm">$</span>
            <span className="text-lg font-bold">AiCodeCalc</span>
            <span className="text-xs opacity-50">v1.0.0</span>
          </NavLink>

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isOpen ? (
                <X className="h-5 w-5 text-terminal-bright" />
              ) : (
                <Menu className="h-5 w-5 text-terminal-bright" />
              )}
            </Button>
          )}

          {/* Navigation Links */}
          <div
            className={`${
              isMobile
                ? `absolute left-0 right-0 top-14 z-50 bg-background-secondary shadow-lg transition-all duration-200 ease-in-out ${
                    isOpen ? 'translate-y-0' : '-translate-y-full'
                  }`
                : 'flex items-center space-x-1'
            }`}
          >
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => isMobile && setIsOpen(false)}
                className={({ isActive }) =>
                  `${
                    isMobile
                      ? 'block w-full border-b border-terminal-primary/10 px-4 py-3 text-sm font-mono transition-colors hover:bg-background-tertiary'
                      : 'px-3 py-2 text-sm font-mono transition-colors hover:text-terminal-bright'
                  } ${
                    isActive
                      ? 'text-terminal-bright'
                      : 'text-muted-foreground'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
