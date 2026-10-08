export const SUBSCRIPTION_LEVELS = [
  "beginner",
  "intermediate",
  "professional",
  "advanced",
] as const;

export type SubscriptionPlanId = (typeof SUBSCRIPTION_LEVELS)[number];

export const SUBSCRIPTION_PRESENTATION: Record<
  string,
  {
    level: string;
    accent: "blue" | "teal" | "gold" | "navy";
    popular?: boolean;
  }
> = {
  beginner: { level: "Start here", accent: "blue" },
  intermediate: { level: "Build momentum", accent: "teal" },
  professional: { level: "Career ready", accent: "gold", popular: true },
  advanced: { level: "Specialize", accent: "navy" },
};
