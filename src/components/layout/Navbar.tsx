"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-[#fdfbf6]/80 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between relative">
          
          {/* Left Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {["Services", "Features", "Blog", "Services"].map((label, i) => (
              <Link
                key={i}
                href="#"
                className="text-[13px] font-medium text-[#1a1a1a]/70 transition-colors hover:text-[#1a1a1a]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-serif font-bold text-[#1a1a1a] tracking-tight">
                Flowboard
              </span>
            </Link>
          </div>

          {/* Right Nav & CTA */}
          <div className="hidden lg:flex items-center gap-8">
            {["About", "Pricing", "Contact"].map((label, i) => (
              <Link
                key={i}
                href="#"
                className="text-[13px] font-medium text-[#1a1a1a]/70 transition-colors hover:text-[#1a1a1a]"
              >
                {label}
              </Link>
            ))}
            <Link href="/dashboard">
              <button className="flex items-center gap-2 bg-[#0a0a0a] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold transition-transform hover:scale-105 active:scale-95">
                Get started
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden ml-auto p-2 text-[#1a1a1a]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out lg:hidden bg-white rounded-2xl shadow-xl mt-2",
            mobileOpen ? "max-h-[500px] mb-4 p-6" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-4">
            {["Services", "Features", "Blog", "About", "Pricing", "Contact"].map((label, i) => (
              <Link
                key={i}
                href="#"
                className="text-base font-medium text-[#1a1a1a]/70 hover:text-[#1a1a1a]"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link href="/dashboard" className="pt-4 border-t border-gray-100">
              <button className="w-full bg-[#0a0a0a] text-white py-4 rounded-xl font-bold">
                Get Started
              </button>
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
