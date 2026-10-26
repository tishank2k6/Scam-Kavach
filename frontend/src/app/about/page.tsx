"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Shield,
  Cpu,
  Lock,
  Server,
  AlertCircle,
  Scale
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#07090D] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#FFC247] selection:text-[#07090D]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="space-y-3 border-b border-[#18222C] pb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFC247] uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            <span>Methodology & Ethics Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
            How Scam Kavach Works
          </h1>
          <p className="text-sm text-[#9AA7B5] leading-relaxed max-w-2xl font-sans">
            A transparent breakdown of our multi-layered screening pipeline, probability calibration, 
            zero-network SSRF precautions, and student privacy guarantees.
          </p>
        </div>

        {/* 1. Core Architecture */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#F5F7FA] tracking-tight flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#FFC247]" />
            <span>The Multi-Layered Analysis Pipeline</span>
          </h2>
          <p className="text-xs text-[#9AA7B5] leading-relaxed">
            Rather than relying on ungrounded black-box models that hallucinate or claim unsupported certainty, 
            Scam Kavach employs a calibrated hybrid defense architecture:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] shadow-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#FFC247] uppercase block">Layer 1: Heuristics</span>
              <h4 className="text-sm font-bold text-[#F5F7FA]">Forensic Pattern Matcher</h4>
              <p className="text-xs text-[#9AA7B5] leading-relaxed">
                Deterministic regex rules trained on recruitment fraud tactics. Identifies advance-fee demands, Telegram task redirects, free webmail impersonation, and extracts exact character offsets for interactive highlighting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] shadow-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase block">Layer 2: Baseline ML</span>
              <h4 className="text-sm font-bold text-[#F5F7FA]">Calibrated Classifier</h4>
              <p className="text-xs text-[#9AA7B5] leading-relaxed">
                A TF-IDF vectorizer paired with a Calibrated Classifier (Logistic Regression with Sigmoid scaling). Produces mathematically sound probability estimates rather than arbitrary guesses.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] shadow-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#22C987] uppercase block">Layer 3: Explainability</span>
              <h4 className="text-sm font-bold text-[#F5F7FA]">Forensic Verification Engine</h4>
              <p className="text-xs text-[#9AA7B5] leading-relaxed">
                Translates heuristic findings into clear, educational advice and verification steps. Optional provider-agnostic LLMs (OpenAI/Gemini/Groq) are strictly constrained to explain only detected signals.
              </p>
            </div>
          </div>
        </section>

        {/* 2. SSRF Immunity */}
        <section className="space-y-4 pt-4 border-t border-[#18222C]">
          <h2 className="text-xl font-bold text-[#F5F7FA] tracking-tight flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#38BDF8]" />
            <span>SSRF-Safe Passive URL Inspection</span>
          </h2>
          <p className="text-xs text-[#9AA7B5] leading-relaxed">
            Many link scanners introduce severe vulnerabilities by fetching arbitrary untrusted URLs, allowing malicious actors to orchestrate Server-Side Request Forgery (SSRF) attacks against internal networks or cloud metadata endpoints.
          </p>
          <div className="p-5 rounded-2xl bg-[#11151B] border border-[#18222C] text-xs text-[#9AA7B5] space-y-2">
            <div className="flex items-center gap-2 text-[#22C987] font-bold">
              <Lock className="w-4 h-4 text-[#22C987]" />
              <span>Zero-Fetch Security Guarantee</span>
            </div>
            <p>
              Scam Kavach never performs outbound HTTP connections to user-submitted domains. All assessments evaluate structural attributes, high-risk TLDs, IP literal hostnames, and Punycode homographs 100% passively.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
