"use client";

import {
  Globe,
  Languages,
  BookOpen,
  Gamepad2,
  Mic,
  Star,
  DollarSign,
  Users,
  Github,
  ExternalLink,
  ArrowRight,
  Zap,
  Heart,
  Download,
  Wifi,
  Target,
} from "lucide-react";

function LanguageLink({ language, children, className }: { language: string; children: React.ReactNode; className?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentHost = window.location.host;
    const isLocalhost = currentHost.includes("localhost");

    if (isLocalhost) {
      const port = currentHost.includes(":") ? ":" + currentHost.split(":")[1] : "";
      window.location.href = `http://${language}.localhost${port}`;
    } else {
      const baseDomain = currentHost.replace(/^[^.]+\./, "");
      window.location.href = `https://${language}.${baseDomain}`;
    }
  };

  return (
    <a href={`/languages/${language}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                Learn Languages for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Free</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                No More Expensive Courses. Master German, French, Spanish & More with Our
                <span className="text-primary font-semibold"> Open-Source Platform</span>
              </p>
            </div>

            <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                Start Learning Today
                <ArrowRight size={20} />
              </button>
              <a
                href="https://github.com/yahyashareef48/open-polyglot"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border hover:bg-accent transition-all duration-300 px-8 py-4 rounded-lg text-lg font-medium flex items-center justify-center gap-2"
              >
                <Github size={20} />
                View on GitHub
              </a>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="glass-effect rounded-2xl p-8 animate-float">
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe size={16} className="text-blue-500" />
                    <span className="font-medium">🇩🇪 German</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe size={16} className="text-blue-500" />
                    <span className="font-medium">🇫🇷 French</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe size={16} className="text-blue-500" />
                    <span className="font-medium">🇪🇸 Spanish</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Languages size={16} className="text-purple-500" />
                    <span className="font-medium">More Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why Spend <span className="text-red-500">$300+</span> on Language Courses?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The language learning industry profits billions while learners struggle with expensive, restrictive courses. There has to be a better
              way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
              <DollarSign size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">$2,000+</h3>
              <p className="text-muted-foreground">Average cost for comprehensive language courses</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/20">
              <Users size={48} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">70%</h3>
              <p className="text-muted-foreground">Of learners quit due to high costs & poor engagement</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20">
              <Target size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Limited</h3>
              <p className="text-muted-foreground">Access to quality resources for multiple languages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Features Section */}
      <section
        id="features"
        className="py-20 lg:py-32 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-800 dark:via-green-900/10 dark:to-blue-900/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              The <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Free</span> Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to master multiple languages, completely free and open-source
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group hover:scale-105 transition-all duration-300 p-8 rounded-2xl glass-effect hover:shadow-2xl">
              <BookOpen size={48} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-3">Structured A1-B2 Curriculum</h3>
              <p className="text-muted-foreground">Complete courses from beginner to upper-intermediate, professionally structured</p>
            </div>

            <div className="group hover:scale-105 transition-all duration-300 p-8 rounded-2xl glass-effect hover:shadow-2xl">
              <Gamepad2 size={48} className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-3">Wordle-Style Games</h3>
              <p className="text-muted-foreground">Interactive exercises and games that make learning addictive and fun</p>
            </div>

            <div className="group hover:scale-105 transition-all duration-300 p-8 rounded-2xl glass-effect hover:shadow-2xl">
              <Mic size={48} className="text-green-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-3">AI Pronunciation Help</h3>
              <p className="text-muted-foreground">Browser-based text-to-speech for perfect pronunciation practice</p>
            </div>

            <div className="group hover:scale-105 transition-all duration-300 p-8 rounded-2xl glass-effect hover:shadow-2xl">
              <Heart size={48} className="text-red-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-3">Completely Free</h3>
              <p className="text-muted-foreground">No ads, no subscriptions, no hidden costs. Education should be free</p>
            </div>

            <div className="group hover:scale-105 transition-all duration-300 p-8 rounded-2xl glass-effect hover:shadow-2xl">
              <Download size={48} className="text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-3">Works Offline (PWA)</h3>
              <p className="text-muted-foreground">Download lessons and learn anywhere, even without internet connection</p>
            </div>

            <div className="group hover:scale-105 transition-all duration-300 p-8 rounded-2xl glass-effect hover:shadow-2xl">
              <Github size={48} className="text-gray-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-3">Open Source</h3>
              <p className="text-muted-foreground">Transparent, community-driven, and constantly improving</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selection Preview */}
      <section id="languages" className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">Choose Your Language Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Starting with German, expanding to French, Spanish and more languages based on community demand
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LanguageLink
              language="german"
              className="group cursor-pointer p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🇩🇪</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">German</h3>
                <p className="text-muted-foreground mb-4">Complete A1-B2 curriculum available</p>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Zap size={16} />
                  <span className="font-medium">Available Now</span>
                </div>
              </div>
            </LanguageLink>

            <LanguageLink
              language="french"
              className="group cursor-pointer p-8 rounded-2xl border-2 border-red-200 dark:border-red-800 hover:border-red-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🇫🇷</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">French</h3>
                <p className="text-muted-foreground mb-4">A1-A2 levels coming soon</p>
                <div className="flex items-center justify-center gap-2 text-yellow-600">
                  <Target size={16} />
                  <span className="font-medium">In Development</span>
                </div>
              </div>
            </LanguageLink>

            <LanguageLink
              language="spanish"
              className="group cursor-pointer p-8 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🇪🇸</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Spanish</h3>
                <p className="text-muted-foreground mb-4">Planned for Q2 2024</p>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Languages size={16} />
                  <span className="font-medium">Coming Soon</span>
                </div>
              </div>
            </LanguageLink>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 lg:py-32 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-orange-900/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Simple, effective language learning in just 3 steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Choose Your Path</h3>
              <p className="text-muted-foreground text-lg">
                Select your target language and current level. Our adaptive curriculum adjusts to your pace.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Learn Through Games</h3>
              <p className="text-muted-foreground text-lg">
                Engage with interactive lessons, word games, and pronunciation practice. Learning feels like playing.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Track Progress</h3>
              <p className="text-muted-foreground text-lg">
                Monitor your advancement across multiple languages with detailed analytics and achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">Join Learners Worldwide Studying for Free</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8">
              <div className="text-4xl font-bold text-green-600 mb-2">$50,000+</div>
              <p className="text-muted-foreground">Saved in course fees by our community</p>
            </div>

            <div className="p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-2">
                <Star className="text-yellow-500" size={32} />
                1,200+
              </div>
              <p className="text-muted-foreground">GitHub stars and growing</p>
            </div>

            <div className="p-8">
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <p className="text-muted-foreground">Countries represented in our community</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">"Finally, a language platform that doesn't break the bank"</h3>
            <p className="text-lg text-muted-foreground italic">
              "I was spending $300/month on language courses. Open Polyglot gives me the same quality education for free. The community aspect makes
              it even better than paid alternatives."
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
              <Users size={16} />
              <span>- Sarah, Community Member</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Start Your Language Journey Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of learners mastering new languages without the expensive price tag. 100% free, forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-purple-600 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              Start Learning Free
              <ArrowRight size={20} />
            </button>
            <a
              href="https://github.com/yahyashareef48/open-polyglot"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300 px-8 py-4 rounded-lg text-lg font-medium flex items-center justify-center gap-2"
            >
              <Github size={20} />
              View on GitHub
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Heart size={16} />
              <span>No Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              <span>No Subscriptions</span>
            </div>
            <div className="flex items-center gap-2">
              <Download size={16} />
              <span>Works Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <Github size={16} />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Open Polyglot</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                The free, open-source language learning platform. Making quality language education accessible to everyone, everywhere.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/yahyashareef48/open-polyglot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://github.com/yahyashareef48/open-polyglot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Languages</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    🇩🇪 German
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    🇫🇷 French (Soon)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    🇪🇸 Spanish (Soon)
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Community</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/yahyashareef48/open-polyglot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/yahyashareef48/open-polyglot/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Contribute
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Open Polyglot. Free and open-source language learning for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
