"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Github, Twitter, Linkedin, Mail, MapPin, MailIcon } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-teal-800 to-cyan-900 text-white">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                SkyDark
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Innovating the future with cutting-edge technology solutions. Building tomorrow&apos;s digital experiences
              today.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-cyan-300 hover:text-cyan-200">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-cyan-300 hover:text-cyan-200">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-cyan-300 hover:text-cyan-200">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-300">Navigation</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                Home
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                About Us
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                Services
              </Link>
              <Link href="/products" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                Products
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300">Company</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/founders" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">
                Founders
              </Link>
              <Link href="/team" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">
                Our Team
              </Link>
              <Link href="/careers" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">
                Careers
              </Link>
              <Link href="/news" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">
                News & Updates
              </Link>
              <Link href="/investors" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">
                Investors
              </Link>
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-300">Stay Connected</h4>
            <p className="text-gray-300 text-sm">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
              />
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                <Mail className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span>Doha, QA</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MailIcon className="h-4 w-4 text-cyan-400" />
                <span>skydarkteams@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20 mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-300">
            <p>&copy; {new Date().getFullYear()} SkyDark. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="hover:text-cyan-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-cyan-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-cyan-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          <div className="text-sm text-gray-400">Made by Team SkyDark</div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400" />
    </footer>
  )
}
