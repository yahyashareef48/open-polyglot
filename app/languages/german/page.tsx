export default function GermanHome() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="text-8xl mb-8">🇩🇪</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">German</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Start your German learning journey. From basics to advanced conversations.
            </p>
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">
                We're currently building an amazing German learning experience for you.
                Check back soon for interactive lessons, vocabulary games, and pronunciation practice!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}