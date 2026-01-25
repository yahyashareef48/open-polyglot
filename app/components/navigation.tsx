"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Github, ExternalLink, Home } from "lucide-react";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnSubdomain, setIsOnSubdomain] = useState(false);
  const [mainDomainUrl, setMainDomainUrl] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const isLocalhost = hostname.includes('localhost');

      // Check if we're on a subdomain
      const parts = hostname.split('.');
      const hasSubdomain = parts.length > 2 || (isLocalhost && parts[0] !== 'localhost');

      setIsOnSubdomain(hasSubdomain);

      if (hasSubdomain) {
        if (isLocalhost) {
          const port = window.location.port ? `:${window.location.port}` : '';
          setMainDomainUrl(`http://localhost${port}`);
        } else {
          // For production, always use openpolyglot.org regardless of hosting platform
          let baseDomain = "openpolyglot.org";
          if (hostname.includes("openpolyglot.org") || hostname.includes("a.run.app")) {
            baseDomain = "openpolyglot.org";
          } else {
            // Fallback for other domains
            baseDomain = hostname.replace(/^[^.]+\./, '');
          }
          setMainDomainUrl(`https://${baseDomain}`);
        }
      } else {
        setMainDomainUrl("");
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavLink = (section: string) => {
    if (isOnSubdomain) {
      return `${mainDomainUrl}#${section}`;
    }
    return `#${section}`;
  };

  // Hide navigation on lesson pages (e.g., /a1/intro/03-useful-resources) only on language subdomains
  const isLessonPage = isOnSubdomain && /^\/[^/]+\/[^/]+\/[^/]+$/.test(pathname);

  // Don't render navigation on lesson pages
  if (isLessonPage) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href={isOnSubdomain ? mainDomainUrl : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                  src="/logo/logo-owl-no-bg.png"
                  alt="Open Polyglot Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Open Polyglot
                </span>
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isOnSubdomain && (
                <a href={mainDomainUrl} className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                  <Home size={16} />
                  Home
                </a>
              )}
              <a href={getNavLink("features")} className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Features
              </a>
              <a href={getNavLink("languages")} className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Languages
              </a>
              <a href={getNavLink("how-it-works")} className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                How It Works
              </a>
              <a href={isOnSubdomain ? `${mainDomainUrl}/blog` : "/blog"} className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Blog
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
            {!isOnSubdomain && (
              <div className="hidden md:block">
                <a href={getNavLink("languages")} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  Start Learning
                  <ExternalLink size={16} />
                </a>
              </div>
            )}

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
            {isOnSubdomain && (
              <a
                href={mainDomainUrl}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={16} />
                Home
              </a>
            )}
            <a
              href={getNavLink("features")}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href={getNavLink("languages")}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Languages
            </a>
            <a
              href={getNavLink("how-it-works")}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href={isOnSubdomain ? `${mainDomainUrl}/blog` : "/blog"}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
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
            {!isOnSubdomain && (
              <div className="pt-2">
                <a href={getNavLink("languages")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2">
                  Start Learning
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
