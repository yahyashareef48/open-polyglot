export default function SpanishHome() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-red-50 to-orange-50 dark:from-slate-900 dark:via-yellow-900/20 dark:to-red-900/20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="text-8xl mb-8">🇪🇸</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Bienvenidos to <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">Spanish</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              ¡Hola! Embark on your Spanish adventure. From Madrid to Mexico City and beyond.
            </p>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">¡Próximamente!</h2>
              <p className="text-muted-foreground">
                We're preparing an exciting Spanish learning journey for you.
                Get ready to explore Spanish grammar, vocabulary, and rich Hispanic culture!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}