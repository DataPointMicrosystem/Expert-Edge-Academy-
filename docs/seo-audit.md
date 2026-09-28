# ExpertEdge Academy SEO audit

## Baseline findings

- The project is a React 19 + Vite SPA using React Router.
- Public content is currently rendered client-side. The shell is available to crawlers, but API-backed course metadata is not server-rendered.
- Site metadata previously used a generic Figma Make fallback and duplicated description/Open Graph tags.
- Indexing was disabled globally and no sitemap existed.
- There were no route-aware canonical URLs, Twitter cards, JSON-LD, category pages, instructor pages, or public 404 route.
- Course images are mostly remote Unsplash URLs and the bundle reports a large JavaScript chunk.
- The existing frontend has no source reference to the Vercel deployment domain.

## Implemented

- Added centralized site configuration in `src/lib/siteConfig.ts`.
- Production SEO identity defaults to `https://www.expertedgeacademy.ng`; `VITE_SITE_URL` can override it for local/staging runs.
- Added reusable route-aware metadata utilities in `src/lib/seo.tsx`.
- Added canonical, description, robots, Open Graph, and Twitter metadata updates.
- Added homepage Organization and WebSite JSON-LD.
- Added dynamic Course and BreadcrumbList JSON-LD to course landing pages.
- Added course-specific titles, descriptions, canonical paths, and social images.
- Added a unique public teaching-page title and description.
- Query/filter homepage URLs are marked `noindex` to avoid duplicate search/filter pages.
- Private, transactional, authentication, lesson, and dashboard routes receive `noindex, nofollow`.
- Vite now emits production-domain `robots.txt` and `sitemap.xml`.
- Robots allows public crawling, blocks private paths, and references the production sitemap.
- Sitemap includes the homepage, teaching page, and local published course seed pages only.
- The Figma Make fallback title is now company-branded and no longer says `Figma Make App`.

## Remaining work

- Move SEO-critical public rendering to SSR/SSG or provide a server-side metadata endpoint. Client-side effects cannot guarantee that every crawler sees API-backed course metadata before JavaScript runs.
- Connect sitemap generation to the backend's published-course query so drafts, rejected courses, and newly published courses are reflected automatically.
- Add real category landing pages and public instructor profiles before adding them to the sitemap. The current app has category filters and instructor fields, but not standalone routes or complete public profile data.
- Add a public 404 response at the hosting layer. The SPA fallback currently needs server routing that returns HTTP 404 rather than a successful shell for unknown paths.
- Optimize remote course and hero images with responsive dimensions, stable hosted assets, and modern formats where the backend/CDN supports them.
- Split the JavaScript bundle and measure Core Web Vitals with Lighthouse and real-user data.
- Add Google Search Console verification through an environment-controlled token and submit the sitemap after deployment.

## Validation performed

- `npm run build` passes.
- Generated `dist/robots.txt` allows public paths, blocks private paths, and references `https://www.expertedgeacademy.ng/sitemap.xml`.
- Generated `dist/sitemap.xml` contains only production `.ng` URLs for implemented public routes.
- Generated `dist/index.html` contains the production canonical and Open Graph URL and no old Figma Make metadata.
- Repository search confirms the Vercel deployment domain is not present in frontend SEO configuration.

## Production checklist

1. Deploy the current build to the custom `.ng` domain.
2. Confirm `/robots.txt`, `/sitemap.xml`, `/`, and a published `/courses/:id` return the deployed build.
3. Confirm private routes contain `noindex, nofollow` after client hydration.
4. Submit `https://www.expertedgeacademy.ng/sitemap.xml` in Google Search Console.
5. Inspect a homepage and course URL in URL Inspection and validate JSON-LD.
6. Replace the seed sitemap source with published backend data before scaling the catalog.
