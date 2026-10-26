"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Lock,
  Menu,
  X,
  User,
  LogOut,
  Zap,
  ArrowRight
} from "lucide-react";
import { checkBackendHealth, getCurrentUser, setCurrentUser, UserProfile } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [engineOnline, setEngineOnline] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => (typeof window !== "undefined" ? getCurrentUser() : null));

  useEffect(() => {
    checkBackendHealth().then((isHealthy) => setEngineOnline(isHealthy));
    const interval = setInterval(() => {
      checkBackendHealth().then((isHealthy) => setEngineOnline(isHealthy));
      setUser(getCurrentUser());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Scanner", href: "/#scanner" },
    { name: "Threat Intelligence", href: "/dashboard" },
    { name: "Community", href: "/community" },
    { name: "History", href: "/history" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07090D]/90 border-b border-[#18222C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Custom Shield Brandmark with Metallic Gold & Blue Padlock */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC247] via-[#F59E0B] to-[#11151B] p-[1.5px] shadow-lg shadow-[#FFC247]/15 group-hover:shadow-[#FFC247]/30 transition-all duration-300">
              <div className="w-full h-full bg-[#11151B] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                {/* Subtle blue accent glow inside shield */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#38BDF8]/20 via-transparent to-transparent opacity-80" />
                <Shield className="w-5 h-5 text-[#FFC247] stroke-[2.2] relative z-10" />
                <Lock className="w-2.5 h-2.5 text-[#38BDF8] absolute z-20 top-[14px]" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#F5F7FA] font-sans">
                  Scam <span className="text-[#FFC247]">Kavach</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#11151B]/80 px-2 py-1.5 rounded-full border border-[#18222C]">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href.replace("/#scanner", ""));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? "text-[#FFC247] bg-[#18222C] font-semibold shadow-xs"
                      : "text-[#9AA7B5] hover:text-[#F5F7FA] hover:bg-[#18222C]/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Engine Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11151B] border border-[#18222C] text-[11px] font-mono text-[#9AA7B5]">
              <span
                className={`w-2 h-2 rounded-full ${
                  engineOnline ? "bg-[#22C987] status-pulse" : "bg-[#F59E0B]"
                }`}
              />
              <span className="text-[10px] tracking-wide">
                {engineOnline ? "Engine Active" : "Connecting..."}
              </span>
            </div>

            {/* Credit Balance Badge */}
            <Link
              href="/#pricing"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18222C]/80 border border-[#263544] text-xs font-semibold text-[#F5F7FA] hover:border-[#FFC247]/50 transition-colors"
              title="Click to view subscription tiers"
            >
              <Zap className="w-3.5 h-3.5 text-[#FFC247]" />
              <span>{user ? user.credits_remaining : 10} Credits</span>
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#18222C]">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#11151B] border border-[#18222C]">
                  <div className="w-5 h-5 rounded-full bg-[#FFC247]/20 flex items-center justify-center text-[#FFC247] text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-[#F5F7FA] max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#9AA7B5] hover:text-[#FF4D5A] rounded-lg hover:bg-[#18222C] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#18222C] border border-[#263544] text-[#9AA7B5] hover:text-[#F5F7FA] hover:border-[#FFC247]/40 transition-colors"
                title="Account Login"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Primary Golden Yellow CTA */}
            <Link
              href="/#scanner"
              className="px-4 py-2 text-xs font-bold tracking-wide text-[#07090D] bg-[#FFC247] hover:bg-[#F59E0B] rounded-xl shadow-md shadow-[#FFC247]/20 hover:shadow-[#FFC247]/30 transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/#scanner"
              className="px-3 py-1.5 text-xs font-bold text-[#07090D] bg-[#FFC247] rounded-lg shadow-sm"
            >
              Scan
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#9AA7B5] hover:text-[#F5F7FA] hover:bg-[#18222C]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 space-y-2 bg-[#11151B] border-b border-[#18222C] shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === link.href
                  ? "text-[#FFC247] bg-[#18222C] font-bold"
                  : "text-[#9AA7B5] hover:text-[#F5F7FA] hover:bg-[#18222C]/50"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-[#18222C] flex items-center justify-between">
            <span className="text-xs font-bold text-[#FFC247] font-mono flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {user ? user.credits_remaining : 10} Credits
            </span>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-1.5 text-xs font-bold bg-[#FFC247] text-[#07090D] rounded-lg"
            >
              {user ? "My Account" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
