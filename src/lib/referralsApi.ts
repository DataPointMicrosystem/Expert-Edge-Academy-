import { apiRequest } from "./api";

export type ReferralSummary = {
  referralCode: string;
  balance: number;
  totalEarned: number;
  pendingBalance: number;
  successfulReferrals: number;
  clicks: number;
};

export type ReferralHistoryItem = {
  id: string;
  referredUser?: { id: string; fullName: string };
  course?: { id: string; title: string };
  amount: number;
  status: string;
  createdAt: string;
};

export const referralsApi = {
  getSummary: () => apiRequest<{ data: ReferralSummary }>("/referrals/me"),
  getCode: () =>
    apiRequest<{ data: { referralCode: string } }>("/referrals/code"),
  track: (body: {
    referralCode: string;
    courseId: string;
    sessionId: string;
  }) =>
    apiRequest("/referrals/track", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getHistory: () =>
    apiRequest<{ data: ReferralHistoryItem[] }>(
      "/referrals/history?page=1&limit=20",
    ),
};

const REFERRAL_CODE_KEY = "expertedgeReferralCode";
const REFERRAL_SESSION_KEY = "expertedgeReferralSessionId";

export function getReferralSessionId() {
  let sessionId = localStorage.getItem(REFERRAL_SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(REFERRAL_SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getStoredReferralCode() {
  return localStorage.getItem(REFERRAL_CODE_KEY);
}

export function storeReferralCode(code: string) {
  localStorage.setItem(REFERRAL_CODE_KEY, code);
}
