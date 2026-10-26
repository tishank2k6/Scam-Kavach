"use client";

import React, { useState } from "react";
import Link from "next/link";
import SecurityShield3D from "@/components/3d/SecurityShield3D";
import MessageScanner from "@/components/scanner/MessageScanner";
import PricingPlans from "@/components/billing/PricingPlans";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ShieldAlert,
  Lock,
  Cpu,
  ArrowRight,
  DollarSign,
  Send,
  UserX,
  CreditCard,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Building,
  Play,
  Activity,
  Users,
  ShieldCheck,
  Search,
  Check,
  ChevronDown,
  HelpCircle,
  FileSearch,
  Eye,
  AlertTriangle
} from "lucide-react";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does Scam Kavach detect advance-fee job scams?",
      a: "Scam Kavach utilizes a multi-layer inspection architecture combining deterministic heuristic regex parsers (trained on known recruitment extortion patterns) and a calibrated scikit-learn TF-IDF classifier. It flags specific phrases like 'laptop courier fee', 'refundable deposit', and 'onboarding training charges' with character-exact offsets."
    },
    {
      q: "Does Scam Kavach connect to or download suspicious target links?",
      a: "Never. The URL analyzer is 100% SSRF-Safe. It performs zero-fetch structural inspection of the domain, TLD risk rating, RFC1918 private IP detection, and Punycode homograph analysis without ever opening an HTTP connection to the destination host."
    },
    {
      q: "Can I inspect multi-page PDF offer letters?",
      a: "Yes! In the Job Offer tab, you can upload PDF employment contracts. Our backend parses text streams via pypdf and analyzes them for registration stamp tampering, fake HR domains, and equipment payment clauses."
    },
    {
      q: "Is my personal information stored or shared with recruiters?",
      a: "No. Privacy is built by design. Every scan automatically scrubs emails, phone numbers, and financial details before evaluating risk. You can also uncheck 'Save anonymized scan' for 100% ephemeral in-memory processing."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090D] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#FFC247] selection:text-[#07090D]">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section (Matching Visual Reference Top-Left) */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#18222C]">
          {/* Subtle Ambient Radial Glows (Amber + Sky Blue) */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFC247]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline & Action CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11151B] border border-[#18222C] text-xs font-mono font-bold text-[#FFC247] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#22C987] status-pulse" />
                  <span>STUDENT & EARLY-CAREER RECRUITMENT DEFENSE</span>
                </div>

                {/* Primary Headline Matching Reference Image */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.15]">
                  Don&apos;t Just Receive Messages.{" "}
                  <span className="text-[#FFC247]">Verify Them.</span>
                </h1>

                {/* Subtitle Matching Reference Image */}
                <p className="text-base sm:text-lg text-[#9AA7B5] max-w-2xl font-normal leading-relaxed">
                  Scam Kavach helps students and job seekers identify fake offers, phishing links and online scams using advanced forensic analysis.
                </p>

                {/* Action CTAs Matching Reference Image */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <a
                    href="#scanner"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-[#FFC247] hover:bg-[#F59E0B] text-[#07090D] shadow-lg shadow-[#FFC247]/20 hover:shadow-[#FFC247]/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Start Scanning</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#capabilities"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide bg-[#11151B] hover:bg-[#18222C] text-[#F5F7FA] border border-[#18222C] hover:border-[#263544] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-[#FFC247] fill-[#FFC247]" />
                    <span>Watch Demo</span>
                  </a>
                </div>
              </div>

              {/* Right Column: 3D Metallic Gold & Obsidian Security Shield */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <SecurityShield3D />
              </div>
            </div>

            {/* 4 Feature Pills Row Beneath Hero (Matching Reference Image Exactly) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-8 border-t border-[#18222C]">
              {/* Pill 1: AI-Powered Analysis */}
              <div className="p-4 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-center gap-3.5 shadow-md hover:border-[#FFC247]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#FFC247]/15 border border-[#FFC247]/30 flex items-center justify-center text-[#FFC247] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">AI-Powered Analysis</h4>
                  <p className="text-[11px] text-[#9AA7B5] mt-0.5">Detects scams, fake jobs & phishing links</p>
                </div>
              </div>

              {/* Pill 2: Real-time Threat Intel */}
              <div className="p-4 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-center gap-3.5 shadow-md hover:border-[#22C987]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#22C987]/15 border border-[#22C987]/30 flex items-center justify-center text-[#22C987] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Real-time Threat Intel</h4>
                  <p className="text-[11px] text-[#9AA7B5] mt-0.5">Updated scam patterns & risky domains</p>
                </div>
              </div>

              {/* Pill 3: Community Reports */}
              <div className="p-4 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-center gap-3.5 shadow-md hover:border-[#38BDF8]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Community Reports</h4>
                  <p className="text-[11px] text-[#9AA7B5] mt-0.5">Share & view user experiences</p>
                </div>
              </div>

              {/* Pill 4: Safe & Private */}
              <div className="p-4 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-center gap-3.5 shadow-md hover:border-[#FFC247]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#FFC247] shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Safe & Private</h4>
                  <p className="text-[11px] text-[#9AA7B5] mt-0.5">Your data, your control</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Live Scanner Section (Matching Visual Reference Top-Middle & Top-Right) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <MessageScanner />
        </section>

        {/* 3. Core Capabilities & How It Works */}
        <section id="capabilities" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#18222C]">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFC247]">
              {"// FORENSIC DETECTION ARCHITECTURE"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
              How Scam Kavach Analyzes Threats
            </h2>
            <p className="text-sm text-[#9AA7B5] leading-relaxed">
              Every message passes through a deterministic three-stage pipeline to separate genuine opportunities from extortion tactics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#FF4D5A]/15 border border-[#FF4D5A]/30 flex items-center justify-center text-[#FF4D5A] font-bold font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-[#F5F7FA]">Heuristic Rule Extraction</h3>
              <p className="text-xs text-[#9AA7B5] leading-relaxed">
                Extracts character-exact phrase offsets for advance-fee demands, fake laptop security deposits, and suspicious Telegram redirection handles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#FFC247]/15 border border-[#FFC247]/30 flex items-center justify-center text-[#FFC247] font-bold font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-[#F5F7FA]">Calibrated Probability Model</h3>
              <p className="text-xs text-[#9AA7B5] leading-relaxed">
                Evaluates linguistic n-grams with a Sigmoid-calibrated classifier (`TF-IDF + CalibratedClassifierCV`) to prevent artificial score polarization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] font-bold font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-[#F5F7FA]">Zero-Fetch URL Inspection</h3>
              <p className="text-xs text-[#9AA7B5] leading-relaxed">
                Passively evaluates domain structures, high-risk TLDs, and private IP addresses without ever connecting outbound, guaranteeing 100% SSRF immunity.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Why Choose Scam Kavach? (Matching Visual Reference Bottom-Right) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#18222C]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
              Why Choose Scam Kavach?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#FFC247]/15 border border-[#FFC247]/30 flex items-center justify-center text-[#FFC247] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Advanced AI Detection</h4>
                <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                  Finds scams, fake jobs and phishing links using machine learning and NLP heuristics.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#22C987]/15 border border-[#22C987]/30 flex items-center justify-center text-[#22C987] shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Real-time Threat Intel</h4>
                <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                  Continuously updated scam patterns, spoofed company domains & malicious hosts.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Explainable Results</h4>
                <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                  See exactly why something is risky with clear phrase highlights and rule citations.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#FF4D5A]/15 border border-[#FF4D5A]/30 flex items-center justify-center text-[#FF4D5A] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Community Powered</h4>
                <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                  Learn from other users&apos; verified reports and warning submissions in real-time.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#22C987]/15 border border-[#22C987]/30 flex items-center justify-center text-[#22C987] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Privacy First</h4>
                <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                  Your data is always protected with automated PII scrubbing and ephemeral incognito mode.
                </p>
              </div>
            </div>

            {/* Feature 6 / Callout */}
            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#FFC247]/15 border border-[#FFC247]/30 flex items-center justify-center text-[#FFC247] shrink-0">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Offer Letter PDF Scanner</h4>
                <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                  Forensic text-layer extraction for official PDF appointment agreements.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Banner Matching Reference Image */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#11151B] via-[#18222C] to-[#11151B] border border-[#FFC247]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#F5F7FA]">
                Join thousands of students and job seekers who trust Scam Kavach.
              </h3>
              <p className="text-xs text-[#9AA7B5] mt-1">
                Protect yourself from advance fees, fake placements, and credential-harvesting attacks.
              </p>
            </div>
            <a
              href="#scanner"
              className="px-7 py-3 rounded-xl font-bold text-xs tracking-wide text-[#07090D] bg-[#FFC247] hover:bg-[#F59E0B] shadow-lg shadow-[#FFC247]/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              Start Scanning Now &rarr;
            </a>
          </div>
        </section>

        {/* 5. Subscription Plans / Razorpay Payment Section (Matching Visual Reference Bottom-Left) */}
        <PricingPlans />

        {/* 6. Frequently Asked Questions (FAQ) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#18222C]">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFC247]">
              {"// STUDENT RECRUITMENT SAFETY"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#11151B] border border-[#18222C] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-[#F5F7FA] hover:text-[#FFC247] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9AA7B5] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[#FFC247]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#9AA7B5] leading-relaxed border-t border-[#18222C]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
