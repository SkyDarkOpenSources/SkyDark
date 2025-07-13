import  Navbar  from "@/components/navbar"
import TextScramble from "@/components/TextScramble"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background Pattern Container */}
      <div className="relative min-h-screen w-full">
        {/* Dotted Radial Background */}
        <div className="absolute inset-0 h-full w-full bg-white dark:bg-gray-950">
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Grid Linear Background */}
        <div className="absolute inset-0 h-full w-full bg-white dark:bg-gray-950">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#6b7280_1px,transparent_1px),linear-gradient(to_bottom,#6b7280_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        {/* Content */}
        <main className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              <TextScramble 
               text ="Welcome to SkyDark"
              />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Space-Tech company aiming to build model rockets, drones, aircrafts in the future.
              We also aim to teach you about aerospace systems, aerodynamics, aircrafts, spacecrafts
              and many more things related to drone technology as well. You can join our courses which 
              offers a variety of knowledge for you to learn. 
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300">
                <h3 className="text-lg font-semibold mb-2">Sticky Navigation</h3>
                <p className="text-sm text-muted-foreground">
                  The header stays at the top with a beautiful backdrop blur effect as you scroll.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300">
                <h3 className="text-lg font-semibold mb-2">Theme Toggle</h3>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark modes with smooth transitions and proper theming.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300">
                <h3 className="text-lg font-semibold mb-2">Beautiful Patterns</h3>
                <p className="text-sm text-muted-foreground">
                  Layered gradient backgrounds create depth and visual interest.
                </p>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="mt-20">
              <p className="text-sm text-muted-foreground mb-4">Explore more!</p>
              <div className="animate-bounce">
                <svg
                  className="w-6 h-6 mx-auto text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </main>

        {/* Additional content to demonstrate sticky navbar */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold text-center mb-12">More Content</h2>

              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-8"
                >
                  <h3 className="text-2xl font-semibold mb-4">Section {i + 1}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    </div>
  )
}