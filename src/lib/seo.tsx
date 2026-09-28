import { useEffect } from "react";
import type { Course } from "../data/courses";
import {
  DEFAULT_DESCRIPTION,
  getRuntimeSiteUrl,
  SITE_NAME,
} from "./siteConfig";

export const SITE_URL = getRuntimeSiteUrl();
export { DEFAULT_DESCRIPTION } from "./siteConfig";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/expertedgeLogo-UhgU0hg_.jpg`;

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  tag.href = href;
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getRuntimeSiteUrl()}/`).toString();
}

export function courseUrl(course: Pick<Course, "id">) {
  return absoluteUrl(`/courses/${encodeURIComponent(course.id)}`);
}

export function courseJsonLd(course: Course) {
  const image = course.image.startsWith("http")
    ? course.image
    : `https://images.unsplash.com/${course.image}?w=1200&h=675&fit=crop&auto=format`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: courseUrl(course),
    image,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getRuntimeSiteUrl(),
    },
    instructor: {
      "@type": "Person",
      name: course.instructor,
    },
    courseMode: "online",
    educationalLevel: course.level,
    inLanguage: course.language,
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "NGN",
      url: courseUrl(course),
      availability: "https://schema.org/InStock",
    },
  };

  if (course.rating > 0 && course.reviews > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: course.rating,
      reviewCount: course.reviews,
      bestRating: 5,
    };
  }

  return schema;
}

export function Seo({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const canonical = absoluteUrl(path);
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow",
    );
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertLink("canonical", canonical);

    const existing = document.head.querySelector("script[data-seo-jsonld]");
    existing?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.head.querySelector("script[data-seo-jsonld]")?.remove();
    };
  }, [description, image, jsonLd, noindex, path, title, type]);

  return null;
}

export function NoIndex() {
  return (
    <Seo
      title={`${SITE_NAME} | Private Area`}
      description="This private ExpertEdge Academy area is not intended for search engines."
      noindex
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getRuntimeSiteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
