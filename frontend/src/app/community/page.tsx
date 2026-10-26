"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchCommunityReports, submitScamReport, upvoteScamReport, CommunityReport } from "@/lib/api";
import {
  Users,
  AlertTriangle,
  ThumbsUp,
  Plus,
  ShieldAlert,
  Search,
  CheckCircle,
  ExternalLink,
  Clock,
  Eye,
  X
} from "lucide-react";

export default function CommunityPage() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "VERIFIED" | "REVIEW">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [scamCategory, setScamCategory] = useState("ADVANCE_FEE");
  const [description, setDescription] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchCommunityReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await upvoteScamReport(id);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: res.upvotes } : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitScamReport({
        company_name: companyName,
        scam_category: scamCategory,
        description,
        sender_contact: senderContact,
      });
      setCompanyName("");
      setDescription("");
      setSenderContact("");
      setShowModal(false);
      loadReports();
    } catch (err: any) {
      alert(err.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.scam_category.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "VERIFIED") return matchesSearch && (r.upvotes || 0) >= 3;
    if (activeFilter === "REVIEW") return matchesSearch && (r.upvotes || 0) < 3;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090D] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#FFC247] selection:text-[#07090D]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Matching Visual Reference Bottom-Center-Left */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#18222C] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
              Community Reports
            </h1>
            <p className="text-xs text-[#9AA7B5] mt-1">
              See what others are reporting. Stay informed, stay safe.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide bg-[#FFC247] hover:bg-[#F59E0B] text-[#07090D] shadow-lg shadow-[#FFC247]/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Share a Report</span>
          </button>
        </div>

        {/* Filters & Search Row (Matching Reference) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#11151B] border border-[#18222C] w-fit">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === "ALL"
                  ? "bg-[#18222C] text-[#22C987] border border-[#22C987]/40 shadow-sm"
                  : "text-[#9AA7B5] hover:text-[#F5F7FA]"
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setActiveFilter("VERIFIED")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === "VERIFIED"
                  ? "bg-[#18222C] text-[#22C987] border border-[#22C987]/40 shadow-sm"
                  : "text-[#9AA7B5] hover:text-[#F5F7FA]"
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setActiveFilter("REVIEW")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === "REVIEW"
                  ? "bg-[#18222C] text-[#FFC247] border border-[#FFC247]/40 shadow-sm"
                  : "text-[#9AA7B5] hover:text-[#F5F7FA]"
              }`}
            >
              Under Review
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-[#9AA7B5] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search reports or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#11151B] border border-[#18222C] focus:border-[#FFC247]/50 text-[#F5F7FA] placeholder-[#9AA7B5]/60 outline-none"
            />
          </div>
        </div>

        {/* Reports List (Matching Visual Reference Bottom-Center-Left) */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#9AA7B5]">
              Loading verified community reports...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#9AA7B5] bg-[#11151B] border border-[#18222C] rounded-2xl">
              No reports match your search criteria.
            </div>
          ) : (
            filteredReports.map((report, idx) => {
              const isHigh = report.scam_category === "ADVANCE_FEE" || (report.upvotes || 0) >= 5;
              const isMedium = report.scam_category === "TASK_SCAM";

              return (
                <div
                  key={report.id || idx}
                  onClick={() => setSelectedReport(report)}
                  className="p-5 rounded-2xl bg-[#11151B] border border-[#18222C] hover:border-[#FFC247]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {/* Status Badge Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isHigh
                          ? "bg-[#FF4D5A]/15 border-[#FF4D5A]/30 text-[#FF4D5A]"
                          : isMedium
                          ? "bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]"
                          : "bg-[#22C987]/15 border-[#22C987]/30 text-[#22C987]"
                      }`}
                    >
                      <ShieldAlert className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#F5F7FA]">
                          {report.company_name}
                        </h3>
                        <span className="text-xs text-[#9AA7B5] font-mono">
                          • {report.scam_category.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-[#9AA7B5] line-clamp-1 max-w-xl">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                    <span className="text-[11px] text-[#9AA7B5] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {idx === 0 ? "2h ago" : idx === 1 ? "5h ago" : `${idx}d ago`}
                    </span>

                    {/* Risk Badge (Matching Reference) */}
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                        isHigh
                          ? "bg-[#FF4D5A]/15 text-[#FF4D5A] border-[#FF4D5A]/40"
                          : isMedium
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40"
                          : "bg-[#22C987]/15 text-[#22C987] border-[#22C987]/40"
                      }`}
                    >
                      {isHigh ? "High" : isMedium ? "Medium" : "Under Review"}
                    </span>

                    {/* Upvote Pill */}
                    <button
                      onClick={(e) => handleUpvote(report.id, e)}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#07090D] border border-[#18222C] hover:border-[#FFC247]/50 text-xs font-mono text-[#9AA7B5] hover:text-[#FFC247] transition-colors"
                      title="Confirm this report"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{report.upvotes || 0}</span>
                    </button>

                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3.5 py-1 text-xs font-semibold rounded-lg bg-[#18222C] hover:bg-[#263544] text-[#F5F7FA] transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[#11151B] border border-[#18222C] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#18222C]">
                <div>
                  <h3 className="text-base font-bold text-[#F5F7FA]">
                    {selectedReport.company_name}
                  </h3>
                  <span className="text-xs text-[#FFC247] font-mono">
                    Category: {selectedReport.scam_category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 text-[#9AA7B5] hover:text-[#F5F7FA] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#9AA7B5] block mb-1">Description:</span>
                  <p className="text-[#F5F7FA] leading-relaxed bg-[#07090D] p-3.5 rounded-xl border border-[#18222C]">
                    {selectedReport.description}
                  </p>
                </div>

                {selectedReport.sender_contact && (
                  <div>
                    <span className="text-[#9AA7B5] block mb-1">Reported Handle / Contact:</span>
                    <span className="font-mono text-[#38BDF8] bg-[#07090D] px-2.5 py-1 rounded-md border border-[#18222C] block">
                      {selectedReport.sender_contact}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#18222C]">
                <button
                  onClick={(e) => handleUpvote(selectedReport.id, e)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07090D] border border-[#18222C] text-xs font-semibold text-[#FFC247]"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Upvote Warning ({selectedReport.upvotes || 0})</span>
                </button>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-xl bg-[#18222C] text-xs text-[#F5F7FA]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share a Report Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[#11151B] border border-[#FFC247]/40 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#18222C]">
                <h3 className="text-base font-bold text-[#F5F7FA]">
                  Submit Scam Incident Warning
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-[#9AA7B5] hover:text-[#F5F7FA] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#9AA7B5] mb-1 font-semibold">
                    Company or Organization Claimed
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Recruitment / Task Manager Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247] text-[#F5F7FA] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA7B5] mb-1 font-semibold">Scam Category</label>
                  <select
                    value={scamCategory}
                    onChange={(e) => setScamCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247] text-[#F5F7FA] outline-none"
                  >
                    <option value="ADVANCE_FEE">Advance-Fee / Laptop Courier Charge</option>
                    <option value="TASK_SCAM">Telegram YouTube / Like Task Scam</option>
                    <option value="IMPERSONATION">Recruiter Webmail Impersonation</option>
                    <option value="PHISHING_LINK">Suspicious Link / Credential Harvest</option>
                    <option value="PLACEMENT_GUARANTEE">Fake Placement Guarantee Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA7B5] mb-1 font-semibold">
                    Incident Details / What Happened
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe how the scammer contacted you and what fees or actions they demanded..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247] text-[#F5F7FA] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA7B5] mb-1 font-semibold">
                    Sender Contact / Domain (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @tele_recruiter / hr-fake-domain.com"
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#07090D] border border-[#18222C] focus:border-[#FFC247] text-[#F5F7FA] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-[#9AA7B5] hover:text-[#F5F7FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#FFC247] text-[#07090D] hover:bg-[#F59E0B] shadow-lg shadow-[#FFC247]/20"
                  >
                    {submitting ? "Submitting..." : "Post Warning"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
