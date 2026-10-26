import React from "react";
import Link from "next/link";
import { Shield, Lock, Server, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#07090D] border-t border-[#18222C] py-12 mt-20 text-[#9AA7B5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC247] via-[#F59E0B] to-[#11151B] p-[1px] flex items-center justify-center text-[#FFC247] shadow-sm">
                <div className="w-full h-full bg-[#11151B] rounded-[11px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#FFC247]" />
                </div>
              </div>
              <span className="font-extrabold text-[#F5F7FA] text-lg tracking-tight font-sans">
                Scam <span className="text-[#FFC247]">Kavach</span>
              </span>
            </div>
            <p className="text-xs text-[#9AA7B5] max-w-md leading-relaxed font-sans">
              Engineered specifically for university students, fresh graduates, and active job seekers.
              Scam Kavach combines transparent forensic heuristics, calibrated classification, 
              and passive URL inspection to protect against predatory recruitment schemes.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#FFC247] pt-1">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#22C987]" /> PII Auto-Redaction
              </span>
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#38BDF8]" /> SSRF-Safe Architecture
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#22C987]" /> Razorpay Secured
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F7FA] font-bold">Platform</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/" className="hover:text-[#FFC247] transition-colors">
                  Message & Offer Scanner
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#FFC247] transition-colors">
                  Threat Intelligence Dashboard
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#FFC247] transition-colors">
                  Community Scam Registry
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#FFC247] transition-colors">
                  Subscription Plans (Razorpay)
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#FFC247] transition-colors">
                  Scan History
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Responsible Screening */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F7FA] font-bold">Safety Disclaimer</h4>
            <p className="text-xs text-[#9AA7B5] leading-relaxed font-sans">
              Scam Kavach is an assistive decision-support engine. Assessments are based on detected forensic heuristics and probabilistic classification. Always conduct independent verification through official corporate channels before transferring fees or sensitive documents.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#18222C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9AA7B5] gap-4">
          <p>© 2026 Scam Kavach — Student & Job Seeker Defense Platform.</p>
          <p className="flex items-center gap-1">
            Built with Next.js, FastAPI & scikit-learn
          </p>
        </div>
      </div>
    </footer>
  );
}
