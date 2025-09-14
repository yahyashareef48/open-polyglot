export default function FrenchHome() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-blue-50 to-white dark:from-slate-900 dark:via-red-900/20 dark:to-blue-900/20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="text-8xl mb-8">🇫🇷</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Bienvenue to <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">French</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover the beauty of the French language. From Parisian cafés to Quebec winters.
            </p>
            <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">En Développement</h2>
              <p className="text-muted-foreground">
                We're crafting a beautiful French learning experience for you.
                Soon you'll master French pronunciation, grammar, and culture!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}