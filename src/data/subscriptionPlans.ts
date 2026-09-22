export type SubscriptionPlan = {
  id: string;
  name: string;
  level: string;
  description: string;
  courses: string[];
  price: number;
  duration: string;
  benefits: string[];
  popular?: boolean;
  accent: string;
};

export const SUBSCRIPTION_LEVELS = [
  "free",
  "beginner",
  "intermediate",
  "professional",
  "advanced",
] as const;

export type SubscriptionPlanId = (typeof SUBSCRIPTION_LEVELS)[number];

export function getSubscriptionLevel(planId: string) {
  return SUBSCRIPTION_LEVELS.indexOf(planId as SubscriptionPlanId);
}

export function getSubscriptionPlan(planId: string) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) || SUBSCRIPTION_PLANS[1];
}

export function getUpgradePlans(currentPlanId: string) {
  const currentLevel = getSubscriptionLevel(currentPlanId);
  return SUBSCRIPTION_PLANS.filter(
    (plan) => getSubscriptionLevel(plan.id) > currentLevel && plan.id !== "free",
  );
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    level: "Try the basics",
    description:
      "Get comfortable with essential digital concepts before you choose your learning path.",
    courses: [
      "What Is the Internet?",
      "Computer and Device Basics",
      "Internet Browsing Basics",
      "Introduction to Email",
      "Staying Safe Online",
    ],
    price: 0,
    duration: "forever",
    benefits: ["5 introductory lessons", "Learn at your own pace", "No payment required"],
    accent: "teal",
  },
  {
    id: "beginner",
    name: "Beginner",
    level: "Start here",
    description:
      "Build the everyday computer confidence you need to learn, work, and explore online.",
    courses: [
      "Desktop Publishing",
      "Computer Fundamentals",
      "Microsoft Word",
      "Internet & Email Basics",
      "Basic Computer Skills",
    ],
    price: 25000,
    duration: "3 months",
    benefits: ["5 foundational courses", "Learn at your own pace", "Completion certificates"],
    accent: "blue",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    level: "Build momentum",
    description:
      "Turn your core knowledge into practical skills for better work and smarter decisions.",
    courses: [
      "Spreadsheet Analysis",
      "Microsoft Excel",
      "Data Organization",
      "Presentation Design",
      "Basic Data Analysis",
    ],
    price: 40000,
    duration: "3 months",
    benefits: ["5 practical courses", "Project-based learning", "Completion certificates"],
    accent: "teal",
  },
  {
    id: "professional",
    name: "Professional",
    level: "Career ready",
    description:
      "Develop the strategic skills that help you communicate, market, and grow a business.",
    courses: [
      "Digital Marketing",
      "Social Media Marketing",
      "Content Marketing",
      "Search Engine Optimization (SEO)",
      "Business Branding",
      "Professional Communication",
    ],
    price: 65000,
    duration: "6 months",
    benefits: ["6 career-focused courses", "Business-ready projects", "Priority support"],
    popular: true,
    accent: "gold",
  },
  {
    id: "advanced",
    name: "Advanced",
    level: "Specialize",
    description:
      "Go deeper into technical disciplines and build the expertise ambitious roles demand.",
    courses: [
      "Cybersecurity",
      "Ethical Hacking",
      "Advanced Data Analysis",
      "Cloud Computing",
      "Network Security",
      "Advanced Programming",
    ],
    price: 90000,
    duration: "6 months",
    benefits: ["6 specialist courses", "Advanced capstone projects", "Career-focused support"],
    accent: "navy",
  },
];