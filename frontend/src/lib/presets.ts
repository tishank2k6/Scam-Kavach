export interface DemoPreset {
  id: string;
  title: string;
  category: "HIGH_RISK" | "SUSPICIOUS" | "LEGITIMATE";
  type: "text" | "url";
  badge: string;
  description: string;
  content: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "preset-laptop-fee",
    title: "Fake Internship Laptop Fee",
    category: "HIGH_RISK",
    type: "text",
    badge: "Advance Fee Scam",
    description: "Classic student scam: demands $150 onboarding fee for company MacBook delivery.",
    content: "Congratulations! We reviewed your profile and are thrilled to offer you the Summer Software Engineering Internship at Amazon Web Services. Your stipend will be $4,500/month. To finalize your onboarding and courier dispatch, please pay $150 for your laptop and workstation delivery to our logistics partner. Contact our HR team on Telegram @aws_internship_support to receive payment instructions."
  },
  {
    id: "preset-telegram-task",
    title: "YouTube Video Rating Task Scam",
    category: "HIGH_RISK",
    type: "text",
    badge: "Task / Prepaid Scam",
    description: "Predatory daily wage scam targeting college students seeking work-from-home.",
    content: "Hi! I am Jessica from Google Talent Acquisition. We have flexible remote openings for college students. Earn $300 to $800 daily just by liking YouTube videos and rating hotels on Google Maps. No interview needed. Work 1 hour daily from phone. Add our manager on Telegram @google_daily_tasks immediately to claim your $50 joining bonus."
  },
  {
    id: "preset-recruiter-spoof",
    title: "Free Mail Recruiter Impersonation",
    category: "HIGH_RISK",
    type: "text",
    badge: "Domain Spoofing",
    description: "Fraudster claiming to be Microsoft HR using a free Gmail address.",
    content: "Dear Candidate, This is Michael Chang, Senior Technical Recruiter at Microsoft Corporation. Your resume has been shortlisted for our Cloud Developer position ($120,000/yr). Since this is an urgent hiring drive, you have been selected without interview. Please email your passport copy, SSN, and bank account details to microsoft.careers.recruiting@gmail.com within 24 hours to secure your offer letter."
  },
  {
    id: "preset-placement-guarantee",
    title: "100% Placement Guarantee Scheme",
    category: "HIGH_RISK",
    type: "text",
    badge: "Placement Fee Scam",
    description: "Exploits final-year graduates by charging advance fees for guaranteed MNC jobs.",
    content: "Final Year Engineering Alert! 100% job guarantee program in TCS, Infosys, and Wipro. Direct joining letter provided without technical round. Pay nominal registration charge of Rs 5,000 before midnight to reserve your seat in the fast-track hiring quota. Offer expires within 12 hours!"
  },
  {
    id: "preset-legitimate-offer",
    title: "Authentic Stripe Intern Offer",
    category: "LEGITIMATE",
    type: "text",
    badge: "Legitimate Offer",
    description: "Realistic genuine enterprise offer letter with official portal link and zero fee requests.",
    content: "Dear Candidate, On behalf of Stripe, Inc., we are delighted to extend an offer for the Software Engineering Intern role for Summer 2026. Your compensation will include a monthly base stipend of $8,500, housing assistance, and full health coverage. Please review your formal contract and sign via our official Workday portal. Your company-issued laptop will be provided at zero cost to you."
  },
  {
    id: "preset-malicious-url",
    title: "Lookalike IP-Based Phishing Portal",
    category: "HIGH_RISK",
    type: "url",
    badge: "SSRF-Safe URL Check",
    description: "Insecure raw IP address disguised as a career application portal.",
    content: "http://192.168.1.105:8080/careers-portal-login.xyz/verify-identity?redirect=bank"
  }
];
