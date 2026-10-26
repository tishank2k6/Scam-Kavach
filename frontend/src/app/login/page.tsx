"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, UserCheck, Sparkles, Mail, Key, User } from "lucide-react";
import { loginUser, registerUser, loginAsGuest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "guest">("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGuestAccess = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginAsGuest(name || "Student Guest");
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to enter as guest.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      if (mode === "register") {
        await registerUser(name, email, password);
      } else {
        await loginUser(email, password);
      }
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#FFC247] selection:text-[#07090D] relative overflow-hidden">
      {/* Background Soft Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-[#FFC247]/10 via-[#F59E0B]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFC247] via-[#F59E0B] to-[#11151B] p-[1.5px] shadow-lg shadow-[#FFC247]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#11151B] rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#FFC247]" />
            </div>
          </div>
        </Link>
        <h1 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
          Scam <span className="text-[#FFC247]">Kavach</span>
        </h1>
        <p className="text-xs text-[#9AA7B5] max-w-sm mx-auto">
          Student & Job Seeker Defense Platform. Verify recruitment offers before sharing personal data or money.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#11151B] border border-[#18222C] py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-xl bg-[#07090D] border border-[#18222C]">
            <button
              onClick={() => {
                setMode("guest");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "guest"
                  ? "bg-[#18222C] text-[#FFC247] shadow-sm"
                  : "text-[#9AA7B5] hover:text-[#F5F7FA]"
              }`}
            >
              Instant Guest
            </button>
            <button
              onClick={() => {
                setMode("login");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-[#18222C] text-[#FFC247] shadow-sm"
                  : "text-[#9AA7B5] hover:text-[#F5F7FA]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-[#18222C] text-[#FFC247] shadow-sm"
                  : "text-[#9AA7B5] hover:text-[#F5F7FA]"
              }`}
            >
              Register
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#FF4D5A]/15 border border-[#FF4D5A]/30 text-xs text-[#FF4D5A]">
              {errorMsg}
            </div>
          )}

          {/* Guest Mode Content */}
          {mode === "guest" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#07090D] border border-[#18222C] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFC247]">
                  <Sparkles className="w-4 h-4 text-[#FFC247]" />
                  <span>Instant 1-Click Access</span>
                </div>
                <p className="text-xs text-[#9AA7B5] leading-relaxed">
                  Enter immediately preloaded with <strong className="text-[#22C987]">10 free scans</strong>. No password or email verification required for judging or rapid scans.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA7B5] mb-1">
                  Your Display Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9AA7B5] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Student Applicant / Evaluator"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247]/60 text-xs text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleGuestAccess}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wide bg-[#FFC247] hover:bg-[#F59E0B] text-[#07090D] shadow-lg shadow-[#FFC247]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <span>Entering...</span>
                ) : (
                  <>
                    <span>Enter as Guest (10 Free Credits)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Login or Register Form */}
          {(mode === "login" || mode === "register") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-[#9AA7B5] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9AA7B5] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247]/60 text-xs text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#9AA7B5] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9AA7B5] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247]/60 text-xs text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA7B5] mb-1">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#9AA7B5] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247]/60 text-xs text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wide bg-[#FFC247] hover:bg-[#F59E0B] text-[#07090D] shadow-lg shadow-[#FFC247]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === "register" ? "Create Free Account" : "Sign In to Scam Kavach"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#18222C] text-center">
            <Link
              href="/"
              className="text-xs text-[#9AA7B5] hover:text-[#FFC247] transition-colors"
            >
              &larr; Return to Live Scanner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
