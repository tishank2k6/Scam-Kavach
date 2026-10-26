"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Shield,
  CheckCircle,
  Info,
  RotateCcw,
  BookmarkCheck,
  Quote
} from "lucide-react";

interface ResultCardProps {
  riskScore: number;
  riskLevel: "LOW" | "GUARDED" | "ELEVATED" | "CRITICAL";
  primaryCategory: string;
  mlProbability: number;
  modelConfidence: number;
  summary: string;
  evidenceCount: number;
  redactedPii?: string[];
  isEphemeral?: boolean;
  scanId?: string;
  evidences?: Array<{
    rule_id?: string;
    id?: string;
    description?: string;
    explanation?: string;
    detail?: string;
    severity: string;
    matched_text?: string;
    category?: string;
  }>;
  onScanAgain?: () => void;
}

export default function ResultCard({
  riskScore,
  riskLevel,
  primaryCategory,
  mlProbability,
  modelConfidence,
  summary,
  evidenceCount,
  redactedPii = [],
  isEphemeral = false,
  scanId = "SCM-2026-0417",
  evidences = [],
  onScanAgain,
}: ResultCardProps) {
  const isHighRisk = riskLevel === "CRITICAL" || riskLevel === "ELEVATED";
  const isGuarded = riskLevel === "GUARDED";
  const isLowRisk = riskLevel === "LOW";

  const tierConfig = {
    CRITICAL: {
      color: "text-[#FF4D5A]",
      border: "border-[#FF4D5A]/40",
      bg: "bg-[#11151B]",
      badgeBg: "bg-[#FF4D5A]/15 text-[#FF4D5A] border-[#FF4D5A]/30",
      icon: ShieldAlert,
      label: "High Risk",
      description: "This message shows strong signs of a scam.",
      stroke: "#FF4D5A",
    },
    ELEVATED: {
      color: "text-[#F59E0B]",
      border: "border-[#F59E0B]/40",
      bg: "bg-[#11151B]",
      badgeBg: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
      icon: AlertTriangle,
      label: "Elevated Risk",
      description: "Multiple suspicious patterns detected.",
      stroke: "#F59E0B",
    },
    GUARDED: {
      color: "text-[#FFC247]",
      border: "border-[#FFC247]/40",
      bg: "bg-[#11151B]",
      badgeBg: "bg-[#FFC247]/15 text-[#FFC247] border-[#FFC247]/30",
      icon: AlertTriangle,
      label: "Guarded / Uncertain",
      description: "Exercise caution and verify sender credentials.",
      stroke: "#FFC247",
    },
    LOW: {
      color: "text-[#22C987]",
      border: "border-[#22C987]/40",
      bg: "bg-[#11151B]",
      badgeBg: "bg-[#22C987]/15 text-[#22C987] border-[#22C987]/30",
      icon: ShieldCheck,
      label: "Low Risk",
      description: "Consistent with standard professional communication.",
      stroke: "#22C987",
    },
  }[riskLevel];

  const IconComponent = tierConfig.icon;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  // Extract detected indicators from evidences or category
  const indicators = evidences.length > 0 
    ? Array.from(new Set(evidences.map(e => ((e.description || e.explanation || e.detail || e.category || e.rule_id || "Risk Indicator").split(":")[0]))))
    : [primaryCategory.replace(/_/g, " "), "Suspicious Link", "Urgency Pattern"];

  // Extract highlighted phrases
  const highlightedPhrases = evidences
    .filter(e => e.matched_text)
    .map(e => e.matched_text)
    .slice(0, 4);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5F7FA] tracking-tight">
          Scan Results
        </h2>
        <span className="text-xs font-mono text-[#9AA7B5]">
          ID: #{scanId}
        </span>
      </div>

      {/* Top Banner Matching Reference Image (Risk Level Banner + Radial Score) */}
      <div
        className={`rounded-2xl p-6 ${tierConfig.bg} border-2 ${tierConfig.border} shadow-2xl relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left: Risk Label & Description */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${tierConfig.badgeBg} border`}>
              <IconComponent className={`w-8 h-8 ${tierConfig.color}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-2xl font-extrabold tracking-tight ${tierConfig.color}`}>
                  {tierConfig.label}
                </h3>
              </div>
              <p className="text-sm text-[#9AA7B5] mt-1">
                {tierConfig.description}
              </p>
            </div>
          </div>

          {/* Right: Circular Score Gauge (Matching Reference) */}
          <div className="flex items-center gap-4 self-center sm:self-auto">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-[#18222C]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={tierConfig.stroke}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold font-mono text-[#F5F7FA]">
                  {riskScore.toFixed(0)}
                </span>
                <span className="text-[9px] font-mono text-[#9AA7B5] uppercase tracking-wider">
                  / 100
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-mono font-bold text-[#9AA7B5] block">
                Risk Score
              </span>
              <span className={`text-xs font-bold ${tierConfig.color}`}>
                {(modelConfidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Detected Indicator Badges Matching Reference */}
        <div className="mt-6 pt-5 border-t border-[#18222C] space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AA7B5] block">
            Detected Indicators
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {indicators.slice(0, 5).map((ind, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF4D5A]/10 border border-[#FF4D5A]/30 text-[#FF4D5A] flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D5A]" />
                <span className="capitalize">{ind}</span>
              </span>
            ))}
            {isLowRisk && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#22C987]/10 border border-[#22C987]/30 text-[#22C987] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C987]" />
                <span>Verified Recruitment Domain</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Highlighted Suspicious Phrases vs Why This Is Risky */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Highlighted Suspicious Phrases (Matching Reference) */}
        <div className="lg:col-span-6 bg-[#11151B] border border-[#18222C] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-[#FF4D5A]" />
            <h4 className="text-sm font-bold text-[#F5F7FA]">
              Highlighted Suspicious Phrases
            </h4>
          </div>

          <div className="space-y-2.5">
            {highlightedPhrases.length > 0 ? (
              highlightedPhrases.map((phrase, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#07090D] border border-[#FF4D5A]/30 text-xs text-[#FF4D5A] flex items-start gap-2.5 shadow-sm"
                >
                  <span className="font-bold font-mono text-[#FF4D5A]">&ldquo;</span>
                  <span className="font-mono leading-relaxed">{phrase}</span>
                  <span className="font-bold font-mono text-[#FF4D5A]">&rdquo;</span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-[#07090D] border border-[#18222C] text-xs text-[#9AA7B5] italic">
                {isLowRisk
                  ? "No predatory phrases detected. Structure aligns with standard employment correspondence."
                  : "General high-risk structure identified across message headers and payload."}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Why This Is Risky (Matching Reference) */}
        <div className="lg:col-span-6 bg-[#11151B] border border-[#18222C] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FFC247]" />
            <h4 className="text-sm font-bold text-[#F5F7FA]">
              Why This Is Risky
            </h4>
          </div>

          <div className="space-y-3">
            {evidences.length > 0 ? (
              evidences.slice(0, 4).map((ev, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#F5F7FA]">
                  <div className="w-4 h-4 rounded-full bg-[#FFC247]/20 border border-[#FFC247]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC247]" />
                  </div>
                  <span className="leading-relaxed">{ev.description || ev.explanation || ev.detail}</span>
                </div>
              ))
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-[#F5F7FA]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#22C987] shrink-0 mt-0.5" />
                  <span>Asks for upfront payment or deposit (primary scam indicator)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#F5F7FA]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#22C987] shrink-0 mt-0.5" />
                  <span>Uses artificial urgency to bypass critical thinking</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#F5F7FA]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#22C987] shrink-0 mt-0.5" />
                  <span>Unverified recruiter domain or communication channel</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety Recommendations & Meta Box (Matching Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Safety Recommendations */}
        <div className="lg:col-span-8 bg-[#11151B] border border-[#18222C] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#22C987]" />
            <h4 className="text-sm font-bold text-[#F5F7FA]">
              Safety Recommendations
            </h4>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2 text-xs text-[#F5F7FA]">
              <CheckCircle className="w-4 h-4 text-[#22C987] shrink-0 mt-0.5" />
              <span>Never pay any upfront fees, registration charges, or equipment deposits for a job or internship.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#F5F7FA]">
              <CheckCircle className="w-4 h-4 text-[#22C987] shrink-0 mt-0.5" />
              <span>Verify the company through official careers pages (e.g. company.com/careers), never via Telegram.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#F5F7FA]">
              <CheckCircle className="w-4 h-4 text-[#22C987] shrink-0 mt-0.5" />
              <span>Do not share bank account details, Aadhaar, PAN card, or OTP passwords prior to signed verified onboarding.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#9AA7B5] pt-1">
              <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
              <span>This is an assistive forensic screening analysis and not an official legal guarantee of authenticity.</span>
            </div>
          </div>
        </div>

        {/* Action Panel: Scan Again & Save to History */}
        <div className="lg:col-span-4 bg-[#11151B] border border-[#18222C] rounded-2xl p-6 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AA7B5] block mb-2">
              Scan Metadata
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#18222C]">
                <span className="text-[#9AA7B5]">Analysis Mode:</span>
                <span className="text-[#F5F7FA] font-semibold">Message & Offer</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#18222C]">
                <span className="text-[#9AA7B5]">Scan ID:</span>
                <span className="text-[#FFC247] font-mono font-bold">#{scanId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#9AA7B5]">Storage:</span>
                <span className="text-[#22C987]">{isEphemeral ? "Incognito (Ephemeral)" : "Saved Locally"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {onScanAgain && (
              <button
                onClick={onScanAgain}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#07090D] bg-[#FFC247] hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FFC247]/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Another Message</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
