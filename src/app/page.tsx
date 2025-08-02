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
              {/* Main text with proper CSS shadow effects */}
              <h1 
                className="text-7xl font-bold text-center text-red-500"
                style={{
                  textShadow: `
                    0 0 20px rgba(239, 68, 68, 0.8),
                    0 0 40px rgba(239, 68, 68, 0.6),
                    0 0 60px rgba(239, 68, 68, 0.4),
                    0 0 80px rgba(239, 68, 68, 0.3),
                    0 0 100px rgba(239, 68, 68, 0.2),
                    0 0 120px rgba(239, 68, 68, 0.1)
                  `,
                  filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.5))'
                }}
              >
                Welcome to SkyDark
              </h1>
            </div>
            <p className="text-gray-400 text-xl text-center max-w-3xl leading-relaxed">
              A place full of vision on a mission to explore the world and beyond.
              <br />
              <span className="text-red-500 font-semibold">Pricing? Just Kidding!</span> We got you covered. You don&apos;t
              need to worry about anything!
            </p>
            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 px-8 py-3 text-lg bg-transparent"
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
                className="bg-red-500 text-white hover:bg-red-600 transition-all duration-300 px-8 py-3 text-lg hover:cursor-pointer"
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
              "[mask-image:radial-gradient(6000px_circle_at_center,white,transparent)]",
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-red-500" />
                  Space-Tech Events
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Experience lightning-fast load times and smooth interactions.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-500" />
                  Free-Courses
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Your data is safe with us, backed by robust security measures.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Globe className="w-6 h-6 text-red-500" />
                  Drone technology
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Connect with users worldwide, no matter where you are.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      
        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-red-600 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">What out team has to say!</h2>
              <p className="text-xl text-gray-300">Don&apos;t just take our word for it</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Achyut Paliwal",
                  role: "CEO of SkyDark",
                  content:
                    "SkyDark has revolutionized how we approach our projects. The interface is intuitive and the performance is outstanding!",
                  rating: 3,
                },
                {
                  name: "Mike Chen",
                  role: "Developer",
                  content:
                    "The best platform I've ever used. Clean, fast, and reliable. Plus, the free pricing model is incredible!",
                  rating: 4,
                },
                {
                  name: "Emily Davis",
                  role: "Designer",
                  content:
                    "Amazing user experience and fantastic support team. SkyDark has exceeded all my expectations.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-gray-200 dark:border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">&quot;{testimonial.content}&quot;</p>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
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
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg">
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
                  className="border-red-400 text-red-400 hover:bg-red-500 hover:text-white px-8 py-4 text-lg bg-transparent"
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