export const PRODUCTION_SITE_URL = "https://www.expertedgeacademy.ng";
export const SITE_NAME = "ExpertEdge Academy";
export const DEFAULT_DESCRIPTION =
  "ExpertEdge Academy helps learners build practical skills through expert-led online courses and helps instructors share their knowledge.";

export function getRuntimeSiteUrl() {
  return (
    import.meta.env.VITE_SITE_URL ||
    (import.meta.env.DEV ? window.location.origin : PRODUCTION_SITE_URL)
  );
}
