"use client";

import React, { useState } from "react";
import { CheckSquare, Square, ShieldCheck, Copy, Check } from "lucide-react";

interface SafeStepsCardProps {
  steps: string[];
}

export default function SafeStepsCard({ steps }: SafeStepsCardProps) {
  const [checkedIndices, setCheckedIndices] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleCheck = (idx: number) => {
    setCheckedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const copyAll = () => {
    const text = steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!steps || steps.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-[#11151B] border border-[#18222C] shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#22C987]/15 border border-[#22C987]/30 flex items-center justify-center text-[#22C987]">
            <ShieldCheck className="w-5 h-5 text-[#22C987]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F5F7FA] tracking-tight">
              Recommended Verification Checklist
            </h4>
            <p className="text-[11px] text-[#9AA7B5]">
              Complete these safe steps before responding or transferring funds
            </p>
          </div>
        </div>

        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-[#9AA7B5] hover:text-[#FFC247] bg-[#07090D] hover:bg-[#18222C] rounded-xl border border-[#18222C] transition-colors cursor-pointer"
          title="Copy checklist"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#22C987]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Steps"}</span>
        </button>
      </div>

      <div className="space-y-2.5 pt-1">
        {steps.map((step, idx) => {
          const isDone = !!checkedIndices[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isDone
                  ? "bg-[#07090D]/50 border-[#18222C] text-[#9AA7B5]/60"
                  : "bg-[#07090D] border-[#18222C] hover:border-[#22C987]/40 text-[#F5F7FA]"
              }`}
            >
              <button className="mt-0.5 text-[#22C987] focus:outline-none">
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-[#22C987]" />
                ) : (
                  <Square className="w-4 h-4 text-[#9AA7B5] hover:text-[#22C987]" />
                )}
              </button>
              <span className={`text-xs leading-relaxed font-sans ${isDone ? "line-through text-[#9AA7B5]/60" : ""}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
