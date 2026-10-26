export interface EvidenceItem {
  rule_id: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  matched_text: string;
  start_char?: number;
  end_char?: number;
  explanation: string;
}

export interface TextAnalysisResponse {
  id: string;
  risk_score: number;
  risk_level: "LOW" | "GUARDED" | "ELEVATED" | "CRITICAL";
  primary_category: string;
  ml_probability: number;
  model_confidence: number;
  evidences: EvidenceItem[];
  summary: string;
  safe_next_steps: string[];
  redacted_pii_categories: string[];
  is_ephemeral: boolean;
  created_at: string;
}

export interface URLAnalysisResponse {
  id: string;
  url: string;
  hostname: string;
  is_https: boolean;
  risk_score: number;
  risk_level: "LOW" | "GUARDED" | "ELEVATED" | "CRITICAL";
  evidences: Array<{
    id: string;
    severity: string;
    category?: string;
    detail: string;
    caveat?: string;
  }>;
  recommendations: string[];
  threat_intel_status: string;
  ssrf_protection: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_inr: number;
  billing_period: string;
  badge: string;
  credits: number;
  description: string;
  features: string[];
  is_popular: boolean;
  button_text: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  subscription_tier: string;
  credits_remaining: number;
}

export interface CommunityReport {
  id: string;
  company_name: string;
  scam_category: string;
  description: string;
  sender_contact?: string;
  status: string;
  upvotes: number;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function getClientSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  let sessionId = localStorage.getItem("scamkavach_session_id") || localStorage.getItem("scamshield_session_id");
  if (!sessionId) {
    sessionId = "student_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("scamkavach_session_id", sessionId);
  }
  return sessionId;
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem("scamkavach_user") || localStorage.getItem("scamshield_user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem("scamkavach_user");
    localStorage.removeItem("scamshield_user");
  } else {
    localStorage.setItem("scamkavach_user", JSON.stringify(user));
  }
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const resp = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }
  const data = await resp.json();
  setCurrentUser(data.user);
  return data.user;
}

export async function registerUser(name: string, email: string, password: string): Promise<UserProfile> {
  const resp = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  const data = await resp.json();
  setCurrentUser(data.user);
  return data.user;
}

export async function loginAsGuest(guestName?: string): Promise<UserProfile> {
  const resp = await fetch(`${API_BASE_URL}/auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guest_name: guestName || "Student Guest" })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Guest login failed");
  }
  const data = await resp.json();
  setCurrentUser(data.user);
  return data.user;
}

export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  const resp = await fetch(`${API_BASE_URL}/billing/plans`, { cache: "no-store" });
  if (!resp.ok) throw new Error("Failed to load plans");
  const data = await resp.json();
  return data.plans;
}

export async function createRazorpayOrder(planId: string, userEmail?: string): Promise<any> {
  const user = getCurrentUser();
  const resp = await fetch(`${API_BASE_URL}/billing/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plan_id: planId,
      user_id: user?.id,
      user_email: userEmail || user?.email
    })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create order");
  }
  return resp.json();
}

export async function verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  plan_id: string;
}): Promise<any> {
  const user = getCurrentUser();
  const resp = await fetch(`${API_BASE_URL}/billing/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      user_id: user?.id,
      user_email: user?.email
    })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Payment verification failed");
  }
  const res = await resp.json();
  if (user) {
    user.subscription_tier = res.plan_id;
    user.credits_remaining = res.credits_remaining;
    setCurrentUser(user);
  }
  return res;
}

export async function analyzeText(text: string, allowStorage: boolean = true): Promise<TextAnalysisResponse> {
  const sessionId = getClientSessionId();
  const resp = await fetch(`${API_BASE_URL}/analyze/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      allow_storage: allowStorage,
      session_id: sessionId
    })
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${resp.status}`);
  }

  // Deduct a local credit if user logged in
  const user = getCurrentUser();
  if (user && user.credits_remaining > 0) {
    user.credits_remaining -= 1;
    setCurrentUser(user);
  }

  return resp.json();
}

export async function uploadOfferLetterFile(file: File, allowStorage: boolean = true): Promise<TextAnalysisResponse> {
  const sessionId = getClientSessionId();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("allow_storage", String(allowStorage));
  formData.append("session_id", sessionId);

  const resp = await fetch(`${API_BASE_URL}/scan-file/offer-letter`, {
    method: "POST",
    body: formData
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    throw new Error(errorData.detail || `File upload failed with status ${resp.status}`);
  }

  const user = getCurrentUser();
  if (user && user.credits_remaining > 0) {
    user.credits_remaining -= 1;
    setCurrentUser(user);
  }

  return resp.json();
}

export async function analyzeURL(url: string, allowStorage: boolean = true): Promise<URLAnalysisResponse> {
  const sessionId = getClientSessionId();
  const resp = await fetch(`${API_BASE_URL}/analyze/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      allow_storage: allowStorage,
      session_id: sessionId
    })
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${resp.status}`);
  }

  return resp.json();
}

export async function fetchCommunityReports(): Promise<CommunityReport[]> {
  const resp = await fetch(`${API_BASE_URL}/community/reports`, { cache: "no-store" });
  if (!resp.ok) throw new Error("Failed to load community reports");
  return resp.json();
}

export async function submitScamReport(report: {
  company_name: string;
  scam_category: string;
  description: string;
  sender_contact?: string;
}): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/community/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report)
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to submit report");
  }
  return resp.json();
}

export async function upvoteScamReport(reportId: string): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/community/upvote/${reportId}`, {
    method: "POST"
  });
  if (!resp.ok) throw new Error("Failed to upvote");
  return resp.json();
}

export async function getDashboardStats(): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/dashboard/stats/`, { cache: "no-store" });
  if (!resp.ok) throw new Error(`Failed to load stats: ${resp.status}`);
  return resp.json();
}

export async function getHistory(): Promise<any[]> {
  const sessionId = getClientSessionId();
  const resp = await fetch(`${API_BASE_URL}/history/?session_id=${sessionId}`, { cache: "no-store" });
  if (!resp.ok) throw new Error(`Failed to load history: ${resp.status}`);
  return resp.json();
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const resp = await fetch(`${API_BASE_URL}/history/${id}`, { method: "DELETE" });
  if (!resp.ok) throw new Error(`Failed to delete record: ${resp.status}`);
}

export async function clearAllHistory(): Promise<void> {
  const sessionId = getClientSessionId();
  const resp = await fetch(`${API_BASE_URL}/history/?session_id=${sessionId}`, { method: "DELETE" });
  if (!resp.ok) throw new Error(`Failed to clear history: ${resp.status}`);
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const resp = await fetch(`${API_BASE_URL}/health/`, { signal: AbortSignal.timeout(3000) });
    return resp.ok;
  } catch {
    return false;
  }
}
