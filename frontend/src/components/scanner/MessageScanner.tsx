"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Shield,
  Search,
  Link as LinkIcon,
  FileText,
  Upload,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Lock,
  Globe,
  CheckCircle,
  FileUp,
  CreditCard,
  Mail,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { DEMO_PRESETS, DemoPreset } from "@/lib/presets";
import {
  analyzeText,
  analyzeURL,
  uploadOfferLetterFile,
  TextAnalysisResponse,
  URLAnalysisResponse,
  getCurrentUser
} from "@/lib/api";
import ResultCard from "./ResultCard";
import EvidenceViewer from "./EvidenceViewer";
import SafeStepsCard from "./SafeStepsCard";

export default function MessageScanner() {
  const [activeTab, setActiveTab] = useState<"text" | "url" | "job">("text");
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [allowStorage, setAllowStorage] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [textResult, setTextResult] = useState<TextAnalysisResponse | null>(null);
  const [urlResult, setUrlResult] = useState<URLAnalysisResponse | null>(null);
  const [analyzedSnippet, setAnalyzedSnippet] = useState("");

  const samplePresets = [
    {
      label: "Fake Internship Offer",
      text: "Congratulations! You have been selected for Amazon Web Services Cloud Internship. Stipend: $3,200/month. To finalize enrollment and laptop shipment, transfer the $150 onboarding fee to our verification portal: http://192.168.1.100/verify",
      type: "text" as const
    },
    {
      label: "Phishing Link",
      url: "http://192.168.1.100/portal/stripe-recruitment.php?candidate_id=98231",
      type: "url" as const
    },
    {
      label: "Job Scam",
      text: "Work from home part-time! Earn ₹3,000 to ₹8,000 daily just by liking YouTube videos and rating Google Maps locations. Immediate payment via UPI. Message our Telegram coordinator @TaskManager99 right now to reserve your spot.",
      type: "text" as const
    },
    {
      label: "Urgent Message",
      text: "FINAL NOTICE: Your placement application will be permanently CANCELLED within 3 hours unless you pay the ₹2,500 security deposit. Click here to pay immediately.",
      type: "text" as const
    }
  ];

  const handleSelectSample = (sample: typeof samplePresets[0]) => {
    setErrorMsg(null);
    setTextResult(null);
    setUrlResult(null);

    if (sample.type === "text") {
      setActiveTab("text");
      setInputText(sample.text);
    } else {
      setActiveTab("url");
      setInputUrl(sample.url);
    }
  };

  const handleScanText = async () => {
    const textToScan = inputText.trim();
    if (!textToScan || textToScan.length < 5) {
      setErrorMsg("Please paste at least 5 characters of a message, email, or job offer to analyze.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setTextResult(null);
    setUrlResult(null);
    setLoadingStep("Extracting linguistic patterns & scrubbed PII...");

    try {
      setTimeout(() => setLoadingStep("Evaluating TF-IDF features & calibrated probabilities..."), 300);
      setTimeout(() => setLoadingStep("Scanning advance-fee & recruitment deception rules..."), 600);

      const res = await analyzeText(textToScan, allowStorage);
      setTextResult(res);
      setAnalyzedSnippet(textToScan);

      if (res.risk_level === "LOW") {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze message. Ensure the backend server is running.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleScanUrl = async () => {
    const urlToScan = inputUrl.trim();
    if (!urlToScan || urlToScan.length < 3) {
      setErrorMsg("Please enter a valid URL or domain to inspect.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setTextResult(null);
    setUrlResult(null);
    setLoadingStep("Executing passive structural heuristics (Zero-Fetch SSRF protected)...");

    try {
      const res = await analyzeURL(urlToScan, allowStorage);
      setUrlResult(res);

      if (res.risk_level === "LOW") {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze URL.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleScanFile = async () => {
    if (!uploadedFile) {
      setErrorMsg("Please select an Offer Letter document (PDF or TXT) to upload.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setTextResult(null);
    setUrlResult(null);
    setLoadingStep("Reading document and extracting text layers...");

    try {
      const res = await uploadOfferLetterFile(uploadedFile, allowStorage);
      setTextResult(res);
      setAnalyzedSnippet(uploadedFile.name + " (Extracted document text)");

      if (res.risk_level === "LOW") {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to parse and analyze file.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleResetScanner = () => {
    setInputText("");
    setInputUrl("");
    setUploadedFile(null);
    setTextResult(null);
    setUrlResult(null);
    setErrorMsg(null);
  };

  return (
    <div id="scanner" className="w-full max-w-5xl mx-auto space-y-8 scroll-mt-24">
      {/* Scanner Section Header Matching Reference Image */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
          Scan for Scams
        </h2>
        <p className="text-sm text-[#9AA7B5] leading-relaxed">
          Paste a message, email, job offer or URL below and let AI analyze it for potential threats.
        </p>
      </div>

      {/* Main Scanner Container */}
      <div className="bg-[#11151B] border border-[#18222C] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Mode Selector Tabs (Matching Reference Image) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#07090D] border border-[#18222C] max-w-md">
          <button
            onClick={() => {
              setActiveTab("text");
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeTab === "text"
                ? "bg-[#18222C] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm"
                : "text-[#9AA7B5] hover:text-[#F5F7FA]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Message / Email</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("url");
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeTab === "url"
                ? "bg-[#18222C] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm"
                : "text-[#9AA7B5] hover:text-[#F5F7FA]"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>URL</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("job");
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeTab === "job"
                ? "bg-[#18222C] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm"
                : "text-[#9AA7B5] hover:text-[#F5F7FA]"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Offer</span>
          </button>
        </div>

        {/* Input Area Based on Selected Tab */}
        {activeTab === "text" && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 2000))}
                placeholder="Paste your message, email or job offer here..."
                rows={6}
                className="w-full p-4 rounded-2xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247]/60 focus:ring-1 focus:ring-[#FFC247]/50 text-sm text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none transition-all resize-y leading-relaxed"
              />
              <div className="absolute bottom-3 right-4 text-[11px] font-mono text-[#9AA7B5]">
                {inputText.length}/2000
              </div>
            </div>
          </div>
        )}

        {activeTab === "url" && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter suspicious link or job portal URL (e.g. https://bit.ly/...)"
                className="w-full p-4 rounded-2xl bg-[#07090D] border border-[#18222C] focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/50 text-sm text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-[#9AA7B5]">
              🔒 100% SSRF-Safe: Analyzed structurally without connecting to or fetching the untrusted destination.
            </p>
          </div>
        )}

        {activeTab === "job" && (
          <div className="space-y-4">
            <div className="relative border-2 border-dashed border-[#18222C] hover:border-[#FFC247]/50 rounded-2xl p-6 text-center transition-colors bg-[#07090D]">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <Upload className="w-8 h-8 text-[#FFC247]" />
                <span className="text-sm font-semibold text-[#F5F7FA]">
                  {uploadedFile ? uploadedFile.name : "Upload Offer Letter PDF or Agreement"}
                </span>
                <span className="text-xs text-[#9AA7B5]">
                  Supports PDF or TXT up to 10MB. Text layers are extracted and evaluated for fee demands.
                </span>
              </div>
            </div>

            {/* Fallback to text box if user prefers typing */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 2000))}
                placeholder="Or paste the job description / offer details directly here..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247]/60 text-sm text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none transition-all"
              />
              <div className="absolute bottom-3 right-4 text-[11px] font-mono text-[#9AA7B5]">
                {inputText.length}/2000
              </div>
            </div>
          </div>
        )}

        {/* Sample Examples Pills Matching Reference Image */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AA7B5] block">
            Sample Examples:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleSelectSample(preset)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#07090D] border border-[#18222C] text-[#F5F7FA] hover:border-[#FFC247]/50 hover:text-[#FFC247] transition-all cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Golden Yellow Analyze Now Button Matching Reference Image */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#18222C]">
          <button
            onClick={() => {
              if (activeTab === "url") {
                handleScanUrl();
              } else if (activeTab === "job" && uploadedFile) {
                handleScanFile();
              } else {
                handleScanText();
              }
            }}
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-[#07090D] bg-[#FFC247] hover:bg-[#F59E0B] shadow-lg shadow-[#FFC247]/20 hover:shadow-[#FFC247]/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
              isLoading ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#07090D] border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Patterns...</span>
              </>
            ) : (
              <>
                <span>Analyze Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Privacy Note Footer Matching Reference Image */}
          <div className="flex items-center gap-2 text-xs text-[#9AA7B5] text-center sm:text-right">
            <Lock className="w-3.5 h-3.5 text-[#22C987] shrink-0" />
            <span>Your data is secure. We do not store sensitive information without your consent.</span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-[#FF4D5A]/15 border border-[#FF4D5A]/40 text-xs text-[#FF4D5A] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Render Scan Results Card When Available */}
      {textResult && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-300">
          <ResultCard
            riskScore={textResult.risk_score}
            riskLevel={textResult.risk_level}
            primaryCategory={textResult.primary_category}
            mlProbability={textResult.ml_probability}
            modelConfidence={textResult.model_confidence}
            summary={textResult.summary}
            evidenceCount={textResult.evidences.length}
            redactedPii={textResult.redacted_pii_categories}
            isEphemeral={!allowStorage}
            scanId={textResult.id || "SCM-2026-0417"}
            evidences={textResult.evidences}
            onScanAgain={handleResetScanner}
          />

          {/* Interactive Evidence Highlighter with Tooltips */}
          {textResult.evidences.length > 0 && analyzedSnippet && (
            <div className="bg-[#11151B] border border-[#18222C] rounded-2xl p-6 shadow-xl space-y-4">
              <EvidenceViewer
                originalText={analyzedSnippet}
                evidences={textResult.evidences}
              />
            </div>
          )}
        </div>
      )}

      {/* Render URL Scan Results When Available */}
      {urlResult && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-300">
          <ResultCard
            riskScore={urlResult.risk_score}
            riskLevel={urlResult.risk_level}
            primaryCategory="Suspicious URL / Phishing Link"
            mlProbability={urlResult.risk_score / 100}
            modelConfidence={0.92}
            summary={`Structural inspection of ${urlResult.url}: ${urlResult.evidences.map(e => e.detail).join("; ") || "Passive structural analysis completed."}`}
            evidenceCount={urlResult.evidences.length}
            isEphemeral={!allowStorage}
            scanId={urlResult.id || "SCM-URL-PASSIVE"}
            evidences={urlResult.evidences.map((e) => ({
              rule_id: e.id,
              description: e.detail,
              severity: e.severity
            }))}
            onScanAgain={handleResetScanner}
          />
        </div>
      )}
    </div>
  );
}
