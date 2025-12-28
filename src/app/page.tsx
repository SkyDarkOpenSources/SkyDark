import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { DotPattern } from "@/components/ui/kibo-ui/dot-pattern"
import { cn } from "../../lib/utils"
import { Rocket, Shield, Globe, Star, ArrowRight, CheckCircle } from "lucide-react"
import { GridPattern } from "@/components/ui/kibo-ui/grid-pattern"
import { currentUser } from "@clerk/nextjs/server"

export default async function HomePage() {
  const user = await currentUser()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="relative flex w-full h-screen flex-col items-center justify-center overflow-hidden bg-background">
          <DotPattern className={cn("[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]")} />
          <div className="flex flex-col absolute inset-0 items-center justify-center gap-6 px-4">
            <div className="relative">
              {/* Main text with purple-blue-cyan glow effects */}
              <h1 
                className="text-7xl font-bold text-center bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent"
                style={{
                  textShadow: `
                    0 0 200px rgba(139, 92, 246, 0.8),
                    0 0 400px rgba(59, 130, 2466, 0.6),
                    0 0 600px rgba(34, 211, 238, 0.4),
                    0 0 800px rgba(139, 92, 246, 0.3),
                    0 0 1000px rgba(59, 130, 246, 0.2),
                    0 0 1200px rgba(34, 211, 238, 0.1)
                  `,
                  filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))'
                }}
              >
                Welcome to SkyDark
              </h1>
            </div>
            <p className="text-gray-400 text-xl text-center max-w-3xl leading-relaxed">
              Dive into the world of aerospace technologies with our good open sourced-projects.
              <br />
              <span className="text-cyan-400 font-semibold">Pricing? Just Kidding!</span> We got you covered. You don&apos;t
              need to worry about anything!
            </p>
            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                className="text-purple-400 border-purrple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 px-8 py-3 text-lg bg-transparent"
              >
                <Link 
                  href={user ? "/dashboard" : "/sign-up"} 
                  className="flex items-center gap-2 hover:cursor-pointer"
                >
                  {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="default"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 px-8 py-3 text-lg hover:cursor-pointer"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative h-screen flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10">
          <GridPattern
            width={100}
            height={100}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className={cn(
              "[mask-image:radial-graadient(6000px_circle_at_center,white,transparent)]",
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-purple-500" />
                  Space-Tech Events
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Experiece Space-tech events like never before. Join us for live launches, workshops and more.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200 dark:borrder-gray-700 hover:border-blue-400 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-500" />
                  Free-Courses
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Our courses are designed to help you learn and grow in the field of aerospace technology.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700 hover:border-cyan-400 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Globe className="w-6 h-6 text-cyan-500" />
                  Open source-projects
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Our projects are free and open-sourced. You can go visit our GitHub and contribute to our projects
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      
        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">What out team has to say!</h2>
              <p className="text-xl text-blue-100">Don&apos;t just take our word for it</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Mike Chan",
                  role: "Developer",
                  content:
                    "The best platform I've ever used. Clean, fast, and reliable. Plus, the free pricing model is incredible!",
                  rating: 4,
                },
                {
                  name: "Achyut Paliwal",
                  role: "Founder and CEO of SkyDark",
                  content:
                    "SkyDark has revolutionized how we approach our projects. The interface is intuitive and the performance is outstanding!",
                  rating: 3,
                },
                {
                  name: "Emily Davis",
                  role: "Designer",
                  content:
                    "Amazing user experience and financially disturbing support team. SkyDark has exceeded shity expectations.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-gray-200 dark:border-gray-700 bg-white/10 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-blue-100 mb-4">&quot;{testimonial.content}&quot;</p>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-blue-200">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="relative h-screen flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10">
          <GridPattern
            width={50}
            height={50}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className={cn(
              "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
            )}
          />
          <section className="py-5 px-4 ">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Join thousands of users who have already discovered the power of SkyDark. Start your journey today,
                completely free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg">
                  <Link 
                    href={user ? "/dashboard" : "/sign-up"} 
                    className="flex items-center gap-2"
                  >
                    {user ? "Go to Dashboard" : "Start Free Trial"} <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-white px-8 py-4 text-lg bg-transparent"
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Free forever plan
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </section>
        </div>
        
      </main>
      <Footer />
    </div>
  )
}