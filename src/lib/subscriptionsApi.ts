import { apiRequest } from "./api";

export type SubscriptionPlanCourse = {
  _id: string;
  title: string;
  slug: string;
};

export type SubscriptionPlan = {
  planId: string;
  name: string;
  level: string;
  accent: string;
  description: string;
  price: number;
  amount: number;
  currency: string;
  billingInterval: "one_time" | string;
  durationMonths: number;
  courses: SubscriptionPlanCourse[];
  plannedCourseTitles: string[];
  courseAccessLimit: number | null;
  benefits: string[];
  features: string[];
  popular: boolean;
  isPurchasable: boolean;
  autoRenew: boolean;
  availabilityMessage?: string;
};

export type CurrentSubscription = {
  planId: string;
  planName: string;
  status: "pending" | "active" | "expired" | "failed" | "abandoned";
  billingInterval?: "one_time" | string;
  startedAt: string | null;
  renewalDate: string | null;
  amount: number;
  currency: string;
  reference: string;
  authorizationUrl?: string;
};

export type SubscriptionEntitlement = {
  active: boolean;
  courses: SubscriptionPlanCourse[];
};

export type SubscriptionEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const SUBSCRIPTION_REFERENCE_KEY = "expertedge:subscription:reference";

export const subscriptionsApi = {
  getPlans: () =>
    apiRequest<SubscriptionEnvelope<SubscriptionPlan[]>>(
      "/subscriptions/plans",
    ),
  getMine: () =>
    apiRequest<
      SubscriptionEnvelope<{
        subscription: CurrentSubscription | null;
        entitlement: SubscriptionEntitlement;
      }>
    >("/subscriptions/me"),
  initialize: (planId: string, callbackUrl?: string) =>
    apiRequest<
      SubscriptionEnvelope<{
        subscriptionId: string;
        planId: string;
        reference: string;
        authorizationUrl: string;
        provider: string;
      }>
    >("/subscriptions/initialize", {
      method: "POST",
      body: JSON.stringify({ planId, callbackUrl }),
    }),
  verify: (reference: string) =>
    apiRequest<
      SubscriptionEnvelope<{
        subscriptionId: string;
        planId: string;
        status: CurrentSubscription["status"];
        startedAt: string | null;
        renewalDate: string | null;
        amount: number;
        currency: string;
        reference: string;
      }>
    >(`/subscriptions/verify/${encodeURIComponent(reference)}`, {
      method: "POST",
    }),
};
