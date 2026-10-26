"use client";

import React, { useState } from "react";
import { EvidenceItem } from "@/lib/api";
import { AlertTriangle, Sparkles, Info, ShieldAlert } from "lucide-react";

interface EvidenceViewerProps {
  originalText: string;
  evidences: EvidenceItem[];
}

export default function EvidenceViewer({ originalText, evidences }: EvidenceViewerProps) {
  const [activeEvidence, setActiveEvidence] = useState<EvidenceItem | null>(null);

  if (!evidences || evidences.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-[#07090D] border border-[#18222C] text-sm text-[#F5F7FA]">
        <div className="flex items-center gap-2 text-[#22C987] font-bold mb-2">
          <Sparkles className="w-4 h-4 text-[#22C987]" />
          <span>No Predatory Signals Detected</span>
        </div>
        <p className="text-[#9AA7B5] text-xs leading-relaxed font-sans">
          The analyzed text does not trigger known advance-fee, coercive urgency, or recruitment impersonation patterns.
        </p>
        <div className="mt-4 p-4 bg-[#11151B] rounded-xl border border-[#18222C] text-xs font-mono text-[#9AA7B5] whitespace-pre-wrap">
          {originalText}
        </div>
      </div>
    );
  }

  const sortedEvidences = [...evidences]
    .filter((e) => e.start_char !== undefined && e.end_char !== undefined && e.start_char < e.end_char)
    .sort((a, b) => (a.start_char || 0) - (b.start_char || 0));

  const segments: React.ReactNode[] = [];
  let currentIndex = 0;

  sortedEvidences.forEach((evidence, idx) => {
    const start = Math.max(currentIndex, evidence.start_char || 0);
    const end = Math.min(originalText.length, evidence.end_char || 0);

    if (start > currentIndex) {
      segments.push(
        <span key={`text-${currentIndex}`} className="text-[#F5F7FA]">
          {originalText.slice(currentIndex, start)}
        </span>
      );
    }

    if (start < end) {
      const isHigh = evidence.severity === "HIGH";
      const isSelected =
        activeEvidence?.rule_id === evidence.rule_id &&
        activeEvidence?.start_char === evidence.start_char;

      segments.push(
        <mark
          key={`evidence-${idx}`}
          onClick={() => setActiveEvidence(evidence)}
          onMouseEnter={() => setActiveEvidence(evidence)}
          className={`cursor-pointer px-1 py-0.5 rounded font-mono font-bold transition-all duration-200 border-b-2 ${
            isHigh
              ? isSelected
                ? "bg-[#FF4D5A]/40 text-[#FF4D5A] border-[#FF4D5A] shadow-md shadow-[#FF4D5A]/20"
                : "bg-[#FF4D5A]/20 text-[#FF4D5A] border-[#FF4D5A]/60 hover:bg-[#FF4D5A]/30"
              : isSelected
              ? "bg-[#FFC247]/40 text-[#FFC247] border-[#FFC247] shadow-md shadow-[#FFC247]/20"
              : "bg-[#FFC247]/20 text-[#FFC247] border-[#FFC247]/60 hover:bg-[#FFC247]/30"
          }`}
          title="Click to inspect evidence"
        >
          {originalText.slice(start, end)}
        </mark>
      );
      currentIndex = end;
    }
  });

  if (currentIndex < originalText.length) {
    segments.push(
      <span key={`text-end`} className="text-[#F5F7FA]">
        {originalText.slice(currentIndex)}
      </span>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F7FA] font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#FF4D5A]" />
          <span>Interactive Evidence Highlighter ({evidences.length} flagged)</span>
        </h4>
        <span className="text-[11px] font-sans text-[#9AA7B5]">Hover or click highlighted text</span>
      </div>

      <div className="p-5 rounded-2xl bg-[#07090D] border border-[#18222C] text-sm font-sans leading-relaxed text-[#F5F7FA] whitespace-pre-wrap shadow-inner">
        {segments}
      </div>

      {activeEvidence ? (
        <div className="p-5 rounded-2xl bg-[#11151B] border-2 border-[#FFC247]/60 shadow-xl shadow-[#FFC247]/5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                  activeEvidence.severity === "HIGH"
                    ? "bg-[#FF4D5A]/15 text-[#FF4D5A] border-[#FF4D5A]/40"
                    : "bg-[#FFC247]/15 text-[#FFC247] border-[#FFC247]/40"
                }`}
              >
                {activeEvidence.severity} SEVERITY
              </span>
              <span className="text-xs font-mono font-bold text-[#38BDF8]">
                {activeEvidence.category.replace(/_/g, " ")}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#9AA7B5]">{activeEvidence.rule_id}</span>
          </div>

          <p className="text-xs text-[#F5F7FA] font-medium leading-relaxed font-sans">
            {activeEvidence.explanation}
          </p>

          <div className="mt-3 pt-2 border-t border-[#18222C] text-xs text-[#9AA7B5] font-sans flex items-center gap-1.5">
            <span>Trigger phrase:</span>
            <strong className="text-[#FF4D5A] bg-[#FF4D5A]/10 px-2 py-0.5 rounded border border-[#FF4D5A]/30">
              &ldquo;{activeEvidence.matched_text}&rdquo;
            </strong>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-[#07090D] border border-[#18222C] text-center text-xs text-[#9AA7B5] font-sans">
          Select or hover any highlighted phrase in the message above to inspect detailed forensic findings.
        </div>
      )}
    </div>
  );
}
