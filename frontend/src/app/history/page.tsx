"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getHistory, deleteHistoryItem, clearAllHistory } from "@/lib/api";
import {
  Clock,
  Trash2,
  FileText,
  Globe,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const records = await getHistory();
      setHistory(records);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err: any) {
      alert("Failed to delete record: " + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to permanently erase all your scan history?")) return;
    try {
      await clearAllHistory();
      setHistory([]);
      setSelectedItem(null);
    } catch (err: any) {
      alert("Failed to clear history: " + err.message);
    }
  };

  // Demo fallback rows matching visual reference if local history is empty
  const displayItems =
    history.length > 0
      ? history
      : [
          {
            id: "hist_1",
            input_type: "EMAIL",
            content_snippet: "Fake internship offer from Amazon Web Services asking for $150 onboarding fee...",
            risk_level: "CRITICAL",
            risk_score: 88,
            primary_category: "ADVANCE_FEE",
            created_at: "2026-04-17T10:30:00Z"
          },
          {
            id: "hist_2",
            input_type: "URL",
            content_snippet: "https://bit.ly/abc-offer?candidate=9812",
            risk_level: "ELEVATED",
            risk_score: 65,
            primary_category: "SUSPICIOUS_LINK",
            created_at: "2026-04-16T14:15:00Z"
          },
          {
            id: "hist_3",
            input_type: "MESSAGE",
            content_snippet: "Stripe software engineering internship offer with official docuSign link and @stripe.com address...",
            risk_level: "LOW",
            risk_score: 12,
            primary_category: "LEGITIMATE",
            created_at: "2026-04-15T09:00:00Z"
          },
          {
            id: "hist_4",
            input_type: "EMAIL",
            content_snippet: "Recruitment email from Google recruiter using @gmail.com domain with urgent deadline...",
            risk_level: "ELEVATED",
            risk_score: 72,
            primary_category: "IMPERSONATION",
            created_at: "2026-04-14T16:45:00Z"
          }
        ];

  const filteredHistory = displayItems.filter((item) => {
    const matchesSearch =
      item.content_snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.primary_category?.toLowerCase().includes(searchQuery.toLowerCase());

    if (typeFilter !== "ALL") {
      return matchesSearch && item.input_type === typeFilter;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090D] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#FFC247] selection:text-[#07090D]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Header Matching Visual Reference Bottom-Center-Right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#18222C] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
              Scan History
            </h1>
            <p className="text-xs text-[#9AA7B5] mt-1">
              View and manage your past scans.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#FF4D5A] hover:bg-[#FF4D5A]/10 border border-[#FF4D5A]/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge History</span>
            </button>
          )}
        </div>

        {/* Search & Filter Controls (Matching Reference) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#9AA7B5] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by message, URL, or result..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#11151B] border border-[#18222C] focus:border-[#FFC247]/50 text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-[#11151B] border border-[#18222C] text-[#F5F7FA] outline-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="EMAIL">Email</option>
              <option value="MESSAGE">Message</option>
              <option value="URL">URL</option>
            </select>
          </div>
        </div>

        {/* Table Matching Reference Image (Bottom-Center-Right) */}
        <div className="bg-[#11151B] border border-[#18222C] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#18222C] bg-[#07090D]/50 text-[#9AA7B5] font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-24">Type</th>
                  <th className="py-3.5 px-4">Content Preview</th>
                  <th className="py-3.5 px-4 w-28">Risk</th>
                  <th className="py-3.5 px-4 w-32">Date</th>
                  <th className="py-3.5 px-4 w-20 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18222C]">
                {filteredHistory.map((item, idx) => {
                  const isHigh = item.risk_level === "CRITICAL";
                  const isMedium = item.risk_level === "ELEVATED" || item.risk_level === "GUARDED";

                  return (
                    <tr
                      key={item.id || idx}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-[#18222C]/40 transition-colors cursor-pointer"
                    >
                      {/* Type Column */}
                      <td className="py-4 px-4 font-mono font-medium text-[#F5F7FA]">
                        <div className="flex items-center gap-2">
                          {item.input_type === "URL" ? (
                            <Globe className="w-4 h-4 text-[#38BDF8]" />
                          ) : item.input_type === "EMAIL" ? (
                            <Mail className="w-4 h-4 text-[#FFC247]" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#22C987]" />
                          )}
                          <span className="capitalize">{item.input_type?.toLowerCase()}</span>
                        </div>
                      </td>

                      {/* Content Preview */}
                      <td className="py-4 px-4 text-[#9AA7B5] font-sans max-w-md truncate">
                        <span className="text-[#F5F7FA] font-medium">{item.content_snippet}</span>
                      </td>

                      {/* Risk Badge Column */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border inline-block ${
                            isHigh
                              ? "bg-[#FF4D5A]/15 text-[#FF4D5A] border-[#FF4D5A]/40"
                              : isMedium
                              ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40"
                              : "bg-[#22C987]/15 text-[#22C987] border-[#22C987]/40"
                          }`}
                        >
                          {isHigh ? "High" : isMedium ? "Medium" : "Low"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-[#9AA7B5] font-mono text-[11px]">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#18222C] hover:bg-[#263544] text-[#F5F7FA] text-xs font-semibold transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Matching Reference Image (< 1 2 3 >) */}
          <div className="py-4 px-6 border-t border-[#18222C] flex items-center justify-center gap-2">
            <button className="p-1 rounded-lg text-[#9AA7B5] hover:text-[#F5F7FA] hover:bg-[#18222C] transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-lg text-xs font-bold bg-[#FFC247] text-[#07090D] shadow-sm">
              1
            </button>
            <button className="w-7 h-7 rounded-lg text-xs text-[#9AA7B5] hover:text-[#F5F7FA] hover:bg-[#18222C] transition-colors">
              2
            </button>
            <button className="w-7 h-7 rounded-lg text-xs text-[#9AA7B5] hover:text-[#F5F7FA] hover:bg-[#18222C] transition-colors">
              3
            </button>
            <button className="p-1 rounded-lg text-[#9AA7B5] hover:text-[#F5F7FA] hover:bg-[#18222C] transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[#11151B] border border-[#18222C] rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#18222C]">
                <div>
                  <h3 className="text-base font-bold text-[#F5F7FA]">Scan Details</h3>
                  <span className="text-xs text-[#FFC247] font-mono">ID: {selectedItem.id}</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 text-[#9AA7B5] hover:text-[#F5F7FA] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#9AA7B5] block mb-1">Content Snippet:</span>
                  <div className="p-3.5 rounded-xl bg-[#07090D] border border-[#18222C] text-[#F5F7FA] leading-relaxed">
                    {selectedItem.content_snippet}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#07090D] border border-[#18222C]">
                    <span className="text-[#9AA7B5] block text-[10px] uppercase font-mono">Risk Level</span>
                    <span className="text-sm font-bold text-[#FF4D5A]">{selectedItem.risk_level}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07090D] border border-[#18222C]">
                    <span className="text-[#9AA7B5] block text-[10px] uppercase font-mono">Threat Category</span>
                    <span className="text-sm font-bold text-[#38BDF8]">{selectedItem.primary_category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#18222C]">
                {history.some(h => h.id === selectedItem.id) && (
                  <button
                    onClick={(e) => handleDelete(selectedItem.id, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FF4D5A] hover:bg-[#FF4D5A]/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#18222C] text-xs text-[#F5F7FA] ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
