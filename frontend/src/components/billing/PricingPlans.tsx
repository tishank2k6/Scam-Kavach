"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lock,
  ArrowRight,
  CreditCard,
  Building,
  Smartphone,
  Check,
  Zap,
  HelpCircle
} from "lucide-react";
import {
  fetchPlans,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getCurrentUser,
  SubscriptionPlan
} from "@/lib/api";

type PaymentState =
  | "IDLE"
  | "CREATING_ORDER"
  | "CHECKOUT_OPEN"
  | "VERIFYING_PAYMENT"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "RETRY_AVAILABLE";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function generateSimulatedPaymentId(methodName: string): string {
  return `pay_sim_${Date.now()}_${methodName.toLowerCase()}`;
}

export default function PricingPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("PRO");
  const [paymentState, setPaymentState] = useState<PaymentState>("IDLE");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);
  const [showSandboxModal, setShowSandboxModal] = useState<boolean>(false);
  const [user, setUser] = useState(getCurrentUser());

  // Prevent multiple rapid clicks & duplicate checkout instances
  const isRequestInProgressRef = useRef(false);

  useEffect(() => {
    fetchPlans()
      .then((data) => {
        setPlans(data);
        if (data.length > 0) {
          setSelectedPlanId((prev) => prev || data[1]?.id || data[0].id);
        }
      })
      .catch((err) => console.error("Failed to load plans", err));
  }, []);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || {
    id: "PRO",
    name: "Job Seeker Pro",
    price_inr: 499,
    billing_period: "month",
    credits: 250,
    description: "Comprehensive defense for intensive hiring drives, career switches, and remote jobs.",
    features: [
      "250 Full Scans per month",
      "Unlimited Offer Letter PDF scans",
      "Exportable Forensic PDF Reports for Cybercrime/Police",
      "Deep typosquatting & brand lookalike scans",
      "Priority verification support"
    ]
  };

  const handleStartPayment = async () => {
    // Debounce & prevent duplicate clicks
    if (isRequestInProgressRef.current) return;
    if (paymentState === "CREATING_ORDER" || paymentState === "VERIFYING_PAYMENT") return;

    if (selectedPlan.price_inr === 0) {
      setSuccessDetails("You are already active on the Free Student tier with 10 monthly scans.");
      setPaymentState("SUCCESS");
      return;
    }

    isRequestInProgressRef.current = true;
    setPaymentState("CREATING_ORDER");
    setErrorMessage(null);
    setSuccessDetails(null);

    // Timeout guard: 12 seconds
    const timeoutId = setTimeout(() => {
      if (isRequestInProgressRef.current) {
        isRequestInProgressRef.current = false;
        setPaymentState("RETRY_AVAILABLE");
        setErrorMessage("Order creation timed out. Please check your connection and try again.");
      }
    }, 12000);

    try {
      const order = await createRazorpayOrder(selectedPlan.id, user?.email);
      clearTimeout(timeoutId);
      setActiveOrderId(order.order_id);
      setPaymentState("CHECKOUT_OPEN");

      // Verify if genuine live Razorpay key is loaded in browser
      const isLiveRazorpay =
        typeof window !== "undefined" &&
        window.Razorpay &&
        order.key_id &&
        !order.key_id.startsWith("rzp_test_scamshield_demo") &&
        !order.is_mock_mode;

      if (isLiveRazorpay) {
        // Authenticated live Razorpay checkout
        try {
          const rzpOptions = {
            key: order.key_id,
            amount: order.amount,
            currency: "INR",
            name: "Scam Kavach",
            description: `Subscription: ${selectedPlan.name} (${selectedPlan.credits} Scans)`,
            order_id: order.order_id,
            handler: async function (response: any) {
              await handleVerifyPayment({
                razorpay_order_id: response.razorpay_order_id || order.order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: selectedPlan.id
              });
            },
            modal: {
              ondismiss: function () {
                isRequestInProgressRef.current = false;
                setPaymentState("CANCELLED");
                setErrorMessage("Payment was dismissed by user. You can safely retry whenever ready.");
              }
            },
            prefill: {
              name: user?.name || "Student Applicant",
              email: user?.email || "student@scamkavach.org",
              contact: "9876543210"
            },
            theme: {
              color: "#FFC247"
            }
          };

          const rzpInstance = new window.Razorpay(rzpOptions);
          rzpInstance.on("payment.failed", function (failResp: any) {
            isRequestInProgressRef.current = false;
            setPaymentState("FAILED");
            setErrorMessage(`Payment declined: ${failResp.error?.description || "Transaction failed."}`);
          });

          rzpInstance.open();
        } catch (rzpInitErr: any) {
          console.error("Razorpay instance init error:", rzpInitErr);
          // Fallback to sandbox simulator to prevent freezing
          setShowSandboxModal(true);
        }
      } else {
        // Safe interactive sandbox checkout dialog (prevents mock keys from freezing Razorpay iframe)
        setShowSandboxModal(true);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      isRequestInProgressRef.current = false;
      setPaymentState("FAILED");
      setErrorMessage(err.message || "Failed to initialize payment order.");
    }
  };

  const handleVerifyPayment = async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature?: string;
    plan_id: string;
  }) => {
    setPaymentState("VERIFYING_PAYMENT");
    setShowSandboxModal(false);

    try {
      const verifyRes = await verifyRazorpayPayment(payload);
      isRequestInProgressRef.current = false;
      setPaymentState("SUCCESS");
      setSuccessDetails(
        verifyRes.message || `Payment verified! ${selectedPlan.credits} scans unlocked for ${selectedPlan.name}.`
      );
      setUser(getCurrentUser());
    } catch (err: any) {
      isRequestInProgressRef.current = false;
      setPaymentState("FAILED");
      setErrorMessage(err.message || "Cryptographic payment verification failed.");
    }
  };

  const handleSimulatePayment = async (methodName: string) => {
    if (!activeOrderId) return;
    await handleVerifyPayment({
      razorpay_order_id: activeOrderId,
      razorpay_payment_id: generateSimulatedPaymentId(methodName),
      razorpay_signature: "simulated_valid_signature",
      plan_id: selectedPlan.id
    });
  };

  const handleCancelSandbox = () => {
    setShowSandboxModal(false);
    isRequestInProgressRef.current = false;
    setPaymentState("CANCELLED");
    setErrorMessage("Payment checkout cancelled. No charges were made.");
  };

  const handleReset = () => {
    isRequestInProgressRef.current = false;
    setPaymentState("IDLE");
    setErrorMessage(null);
    setSuccessDetails(null);
    setActiveOrderId(null);
  };

  return (
    <section id="pricing" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header matching visual reference */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
          Upgrade to Unlock More
        </h2>
        <p className="text-sm text-[#9AA7B5] mt-1">
          Get advanced threat intelligence, unlimited scans and premium features.
        </p>
      </div>

      {/* Plan Pills Switcher */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: "STANDARD", name: "Standard", price: "₹199 / mo", scans: "50 Scans" },
          { id: "PRO", name: "Pro", price: "₹499 / mo", scans: "250 Scans", popular: true },
          { id: "PREMIUM", name: "Institution", price: "₹1,499 / mo", scans: "Unlimited" }
        ].map((tier) => (
          <button
            key={tier.id}
            onClick={() => {
              setSelectedPlanId(tier.id);
              if (paymentState !== "CREATING_ORDER" && paymentState !== "VERIFYING_PAYMENT") {
                setPaymentState("IDLE");
                setErrorMessage(null);
                setSuccessDetails(null);
              }
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              selectedPlanId === tier.id
                ? "bg-[#18222C] text-[#FFC247] border border-[#FFC247]/60 shadow-lg shadow-[#FFC247]/10"
                : "bg-[#11151B] text-[#9AA7B5] border border-[#18222C] hover:border-[#263544]"
            }`}
          >
            <span>{tier.name}</span>
            <span className="font-mono text-[11px] opacity-80">({tier.price})</span>
            {tier.popular && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#FFC247] text-[#07090D]">
                POPULAR
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3 Interconnected Panels Matching Visual Reference Bottom-Left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Price & Proceed to Pay CTA */}
        <div className="lg:col-span-4 bg-[#11151B] border border-[#18222C] rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFC247]">
                Selected Tier
              </span>
              <span className="text-xs text-[#9AA7B5]">{selectedPlan.name}</span>
            </div>

            {/* Price display */}
            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#F5F7FA] font-mono tracking-tight">
                  ₹ {selectedPlan.price_inr}
                </span>
                <span className="text-sm text-[#9AA7B5] font-sans">/ month</span>
              </div>
              <p className="text-xs text-[#9AA7B5] mt-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#22C987]" />
                <span>Cancel anytime • Secure payment</span>
              </p>
            </div>

            {/* Features summary */}
            <div className="pt-4 border-t border-[#18222C] space-y-2">
              {selectedPlan.features.slice(0, 4).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#F5F7FA]">
                  <Check className="w-3.5 h-3.5 text-[#22C987] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Yellow Proceed to Pay Button */}
          <div className="pt-6">
            <button
              onClick={handleStartPayment}
              disabled={
                paymentState === "CREATING_ORDER" ||
                paymentState === "VERIFYING_PAYMENT" ||
                paymentState === "CHECKOUT_OPEN"
              }
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                paymentState === "CREATING_ORDER" || paymentState === "VERIFYING_PAYMENT"
                  ? "bg-[#FFC247]/50 text-[#07090D] cursor-not-allowed"
                  : "bg-[#FFC247] hover:bg-[#F59E0B] text-[#07090D] shadow-[#FFC247]/20 hover:shadow-[#FFC247]/30 active:scale-[0.98]"
              }`}
            >
              {paymentState === "CREATING_ORDER" ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#07090D] border-t-transparent rounded-full animate-spin" />
                  <span>Creating Order...</span>
                </>
              ) : paymentState === "VERIFYING_PAYMENT" ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#07090D] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying with Bank...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center Card: Razorpay Checkout & Payment Status Step Tracker */}
        <div className="lg:col-span-5 bg-[#11151B] border border-[#18222C] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            {/* Razorpay Checkout Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#18222C]">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-sm font-bold text-[#F5F7FA]">Razorpay Checkout</h3>
                </div>
                <span className="text-[11px] font-mono text-[#22C987] flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Payment
                </span>
              </div>

              {/* Payment Methods preview */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="p-2.5 rounded-xl bg-[#07090D] border border-[#18222C] flex items-center gap-2 text-xs text-[#9AA7B5]">
                  <Smartphone className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>UPI</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#07090D] border border-[#18222C] flex items-center gap-2 text-xs text-[#9AA7B5]">
                  <CreditCard className="w-3.5 h-3.5 text-[#FFC247]" />
                  <span>Cards</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#07090D] border border-[#18222C] flex items-center gap-2 text-xs text-[#9AA7B5]">
                  <Building className="w-3.5 h-3.5 text-[#22C987]" />
                  <span>Net Banking</span>
                </div>
              </div>
            </div>

            {/* Payment Status Step Tracker (Matching reference) */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AA7B5] block mb-3">
                Payment Status
              </span>

              <div className="space-y-3">
                {/* Step 1: Order Created */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      paymentState !== "IDLE"
                        ? "bg-[#22C987] text-[#07090D]"
                        : "bg-[#18222C] text-[#9AA7B5]"
                    }`}
                  >
                    {paymentState !== "IDLE" ? <Check className="w-3.5 h-3.5" /> : "1"}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      paymentState !== "IDLE" ? "text-[#F5F7FA]" : "text-[#9AA7B5]"
                    }`}
                  >
                    Order Created {activeOrderId ? `(${activeOrderId.slice(0, 10)}...)` : ""}
                  </span>
                </div>

                {/* Step 2: Payment Processing */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      paymentState === "CHECKOUT_OPEN"
                        ? "bg-[#FFC247] text-[#07090D] animate-pulse"
                        : paymentState === "VERIFYING_PAYMENT" || paymentState === "SUCCESS"
                        ? "bg-[#22C987] text-[#07090D]"
                        : "bg-[#18222C] text-[#9AA7B5]"
                    }`}
                  >
                    {paymentState === "VERIFYING_PAYMENT" || paymentState === "SUCCESS" ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      paymentState === "CHECKOUT_OPEN"
                        ? "text-[#FFC247]"
                        : paymentState === "VERIFYING_PAYMENT" || paymentState === "SUCCESS"
                        ? "text-[#F5F7FA]"
                        : "text-[#9AA7B5]"
                    }`}
                  >
                    Payment Processing
                  </span>
                </div>

                {/* Step 3: Verifying Payment */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      paymentState === "VERIFYING_PAYMENT"
                        ? "bg-[#38BDF8] text-[#07090D] animate-spin"
                        : paymentState === "SUCCESS"
                        ? "bg-[#22C987] text-[#07090D]"
                        : "bg-[#18222C] text-[#9AA7B5]"
                    }`}
                  >
                    {paymentState === "SUCCESS" ? <Check className="w-3.5 h-3.5" /> : "3"}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      paymentState === "VERIFYING_PAYMENT"
                        ? "text-[#38BDF8]"
                        : paymentState === "SUCCESS"
                        ? "text-[#F5F7FA]"
                        : "text-[#9AA7B5]"
                    }`}
                  >
                    Verifying Payment
                  </span>
                </div>

                {/* Step 4: Completed */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      paymentState === "SUCCESS"
                        ? "bg-[#22C987] text-[#07090D]"
                        : "bg-[#18222C] text-[#9AA7B5]"
                    }`}
                  >
                    {paymentState === "SUCCESS" ? <Check className="w-3.5 h-3.5" /> : "4"}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      paymentState === "SUCCESS" ? "text-[#22C987] font-bold" : "text-[#9AA7B5]"
                    }`}
                  >
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message / Notification */}
          {successDetails && (
            <div className="mt-4 p-3 rounded-xl bg-[#22C987]/15 border border-[#22C987]/40 text-xs text-[#22C987] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successDetails}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-[#FF4D5A]/15 border border-[#FF4D5A]/40 text-xs text-[#FF4D5A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Card: Payment Issues & Safe Recovery (Matching reference) */}
        <div className="lg:col-span-3 bg-[#11151B] border border-[#18222C] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#FFC247]" />
              <h3 className="text-sm font-bold text-[#F5F7FA]">Payment Issues?</h3>
            </div>

            <p className="text-xs text-[#9AA7B5] leading-relaxed">
              If you face any issues, please try again or contact support. No money is deducted if a session is cancelled.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  handleReset();
                  handleStartPayment();
                }}
                disabled={paymentState === "CREATING_ORDER" || paymentState === "VERIFYING_PAYMENT"}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#FFC247] bg-transparent border border-[#FFC247]/50 hover:bg-[#FFC247]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Payment</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-[#9AA7B5] hover:text-[#F5F7FA] bg-[#07090D] border border-[#18222C] hover:border-[#263544] transition-colors cursor-pointer"
              >
                Back to Home / Reset
              </button>
            </div>
          </div>

          {/* Secure Footer Badge */}
          <div className="pt-6 border-t border-[#18222C] flex items-center justify-center gap-2 text-[11px] text-[#9AA7B5]">
            <Shield className="w-3.5 h-3.5 text-[#22C987]" />
            <span>Your payment is secured by Razorpay</span>
          </div>
        </div>
      </div>

      {/* Razorpay Interactive Sandbox Simulator Modal (For hackathon testing without test bank hang) */}
      {showSandboxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#11151B] border border-[#FFC247]/50 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#18222C]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFC247]/20 flex items-center justify-center text-[#FFC247]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F7FA]">Razorpay Sandbox Checkout</h4>
                  <span className="text-[10px] text-[#22C987] font-mono">Test Mode Active</span>
                </div>
              </div>
              <span className="text-base font-extrabold text-[#F5F7FA] font-mono">
                ₹ {selectedPlan.price_inr}
              </span>
            </div>

            <p className="text-xs text-[#9AA7B5] leading-relaxed">
              Select a payment method to simulate instant test verification and account credit update:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleSimulatePayment("UPI")}
                className="w-full p-3 rounded-xl bg-[#07090D] border border-[#18222C] hover:border-[#38BDF8] text-left flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs font-semibold text-[#F5F7FA]">Simulate UPI (GPay / PhonePe)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9AA7B5] group-hover:text-[#38BDF8] transition-colors" />
              </button>

              <button
                onClick={() => handleSimulatePayment("CARD")}
                className="w-full p-3 rounded-xl bg-[#07090D] border border-[#18222C] hover:border-[#FFC247] text-left flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#FFC247]" />
                  <span className="text-xs font-semibold text-[#F5F7FA]">Simulate Credit / Debit Card</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9AA7B5] group-hover:text-[#FFC247] transition-colors" />
              </button>

              <button
                onClick={() => handleSimulatePayment("NETBANKING")}
                className="w-full p-3 rounded-xl bg-[#07090D] border border-[#18222C] hover:border-[#22C987] text-left flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-[#22C987]" />
                  <span className="text-xs font-semibold text-[#F5F7FA]">Simulate Net Banking</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9AA7B5] group-hover:text-[#22C987] transition-colors" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#18222C]">
              <button
                onClick={handleCancelSandbox}
                className="px-4 py-2 text-xs font-medium text-[#9AA7B5] hover:text-[#F5F7FA] rounded-lg transition-colors cursor-pointer"
              >
                Cancel Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
