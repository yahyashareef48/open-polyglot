'use client';

import { useState } from 'react';
import { Moon, Sun, Menu, X, Github, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OpenPolyglot
              </h1>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#features"
                className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#languages"
                className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                Languages
              </a>
              <a
                href="#how-it-works"
                className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                How It Works
              </a>
              <a
                href="https://github.com/yahyashareef48/open-polyglot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <Github size={16} />
                GitHub
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="hidden md:block">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                Start Learning
                <ExternalLink size={16} />
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-b border-border">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#languages"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Languages
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="https://github.com/yahyashareef48/open-polyglot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Github size={16} />
              GitHub
            </a>
            <div className="pt-2">
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2">
                Start Learning
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}