import { Link, useParams } from "react-router";
import { Seo } from "../lib/seo";

type InfoSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  steps?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
};

type InfoPage = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: InfoSection[];
};

const pages: Record<string, InfoPage> = {
  about: {
    title: "About ExpertEdge Academy",
    eyebrow: "Professional education, built for what comes next",
    intro:
      "Empowering knowledge. Building skills. Creating opportunities. We provide practical, industry-relevant learning for individuals, professionals, entrepreneurs, and organizations.",
    sections: [
      {
        title: "Who we are",
        paragraphs: [
          "ExpertEdge Academy is a professional education and skills development institution committed to empowering people with relevant knowledge, practical skills, and career-focused learning opportunities.",
          "Our structured courses, expert-led instruction, and practical learning are designed to bridge the gap between theoretical knowledge and real-world application. We support learning across technology, business, entrepreneurship, management, digital skills, and emerging professional fields.",
        ],
      },
      {
        title: "Our mission",
        paragraphs: [
          "To provide accessible, practical, and quality-driven education that equips learners with relevant skills for career advancement, entrepreneurship, and professional success.",
        ],
      },
      {
        title: "Our vision",
        paragraphs: [
          "To become a leading centre for professional education, digital skills development, and lifelong learning in Africa.",
        ],
      },
      {
        title: "What we do",
        items: [
          "Professional education and certification",
          "Digital and technology training",
          "Business and entrepreneurship development",
          "Leadership and management training",
          "Career development and corporate training",
          "Online learning, workshops, and practical skills development",
        ],
      },
      {
        title: "Our values",
        items: [
          "Excellence",
          "Integrity",
          "Innovation",
          "Professionalism",
          "Accessibility",
          "Continuous learning",
        ],
      },
    ],
  },
  "revenue-share": {
    title: "Instructor revenue share",
    eyebrow: "Create value. Share in its growth.",
    intro:
      "Our revenue-share programme gives eligible instructors an opportunity to earn from approved courses and learning programmes delivered through ExpertEdge Academy.",
    sections: [
      {
        title: "How it works",
        steps: [
          { title: "Create", description: "Submit your course or programme." },
          {
            title: "Review",
            description:
              "Our team reviews the content for quality and learner value.",
          },
          {
            title: "Publish",
            description: "Approved courses are made available to learners.",
          },
          {
            title: "Earn",
            description:
              "Eligible revenue is calculated under your instructor agreement and paid on its agreed schedule.",
          },
        ],
      },
      {
        title: "Revenue-share terms",
        paragraphs: [
          "The revenue-sharing percentage, payment schedule, eligible revenue definition, refunds, taxes, promotional discounts, and other commercial terms will be stated in the agreement applicable to each instructor or programme.",
          "ExpertEdge Academy may update its commercial models from time to time, subject to applicable agreements.",
        ],
      },
      {
        title: "Ready to teach?",
        paragraphs: [
          "Share your expertise with learners across our community.",
        ],
      },
    ],
  },
  community: {
    title: "ExpertEdge Community",
    eyebrow: "Learn together. Connect. Grow.",
    intro:
      "A collaborative learning environment for learners, instructors, professionals, entrepreneurs, and industry practitioners.",
    sections: [
      {
        title: "Community benefits",
        items: [
          "Connect with fellow learners and professionals",
          "Join professional discussions and ask questions",
          "Attend community events and webinars",
          "Discover learning opportunities and educational updates",
          "Share projects, ideas, and achievements",
        ],
      },
      {
        title: "Community guidelines",
        paragraphs: [
          "We are committed to a respectful, inclusive, and productive learning environment. Members are expected to:",
        ],
        items: [
          "Treat others with respect; harassment and discrimination are not acceptable.",
          "Share accurate, constructive information.",
          "Respect intellectual property and other members' privacy.",
          "Avoid spam and unauthorized advertising.",
          "Follow Academy policies and applicable laws.",
        ],
      },
      {
        title: "Keeping the community welcoming",
        paragraphs: [
          "Violations of these guidelines may result in removal of content, suspension, or termination of community access.",
        ],
      },
    ],
  },
  "help-center": {
    title: "ExpertEdge Help Center",
    eyebrow: "Support for your learning journey",
    intro:
      "Find answers about your account, courses, payments, certificates, instructors, and learning experience.",
    sections: [
      {
        title: "Students",
        faqs: [
          {
            question: "How do I create an account?",
            answer:
              "Select Sign Up and complete the registration process using the required information.",
          },
          {
            question: "How do I enrol in a course?",
            answer:
              "Browse available courses, select your preferred programme, and follow the enrolment instructions.",
          },
          {
            question: "Can I learn online?",
            answer:
              "Where online access is provided, enrolled learners can access available learning materials through the designated platform.",
          },
          {
            question: "How do I receive my certificate?",
            answer:
              "Where certification is included, learners who satisfy the programme's completion requirements may receive a certificate according to its certification policy.",
          },
        ],
      },
      {
        title: "Payments and instructors",
        paragraphs: [
          "For payment-related enquiries, contact the Academy through the official support channel displayed on the website.",
          "Instructors can contact the Academy about course submissions, content review, instructor accounts, revenue share, payments, and course updates.",
        ],
      },
      {
        title: "Technical support",
        paragraphs: [
          "When reporting a technical problem, include the following so we can investigate:",
        ],
        items: [
          "Your full name and registered email address",
          "The course or programme name",
          "A description of the problem",
          "A screenshot, where applicable",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibility statement",
    eyebrow: "Learning should be open to everyone",
    intro:
      "ExpertEdge Academy is committed to providing an accessible and inclusive learning experience for people with different abilities and access needs.",
    sections: [
      {
        title: "Our commitment",
        paragraphs: ["We work towards providing:"],
        items: [
          "Clear, readable website content",
          "Accessible navigation and keyboard-friendly interaction where technically supported",
          "Alternative text for relevant images",
          "Accessible digital learning materials and clear page structures",
          "Compatibility with commonly used assistive technologies where reasonably practicable",
        ],
      },
      {
        title: "Tell us how we can improve",
        paragraphs: [
          "We continuously review our digital experience. If you have difficulty accessing any part of the website or learning platform, contact us and describe the issue.",
          "Accessibility support: support@expertedgeacademy.ng",
        ],
      },
    ],
  },
  "terms-of-use": {
    title: "Terms of use",
    eyebrow: "Last updated September 30, 2026",
    intro:
      "By accessing or using expertedgeacademy.ng, registering for an account, enrolling in a programme, or using our services, you agree to these terms.",
    sections: [
      {
        title: "1. Use of the website",
        paragraphs: [
          "Use the website lawfully and responsibly. You must not attempt unauthorized access, interfere with website operations, upload malicious software, misuse another person's account, copy or distribute protected content without permission, or use the platform for fraudulent purposes.",
        ],
      },
      {
        title: "2. Learner accounts",
        paragraphs: [
          "You are responsible for maintaining the confidentiality of your login credentials and for activities conducted through your account. Provide accurate information and promptly update information that becomes inaccurate.",
        ],
      },
      {
        title: "3. Course content",
        paragraphs: [
          "Course materials, videos, documents, assessments, graphics, trademarks, and other educational materials provided by ExpertEdge Academy or its instructors may be protected by intellectual-property laws. Unless expressly authorized, you may not reproduce, resell, redistribute, publish, or commercially exploit Academy content. Nigeria's Copyright Act 2022 provides the statutory framework governing copyright protection in Nigeria.",
        ],
      },
      {
        title: "4. Instructor content",
        paragraphs: [
          "Instructors retain applicable rights in their original content, subject to the licence and commercial terms agreed with ExpertEdge Academy.",
        ],
      },
      {
        title: "5. Payments",
        paragraphs: [
          "Applicable course fees must be paid through the payment methods made available by ExpertEdge Academy. Prices, discounts, and promotional offers may change.",
        ],
      },
      {
        title: "6. Certificates",
        paragraphs: [
          "Where a certificate is offered, issuance is subject to the programme's completion requirements. A certificate does not automatically constitute a government licence, statutory professional qualification, or employment guarantee unless expressly stated.",
        ],
      },
      {
        title: "7. Third-party services",
        paragraphs: [
          "The Academy may use third-party technology, payment, communication, hosting, or other service providers. Their services may be subject to their own terms and policies.",
        ],
      },
      {
        title: "8. Suspension or termination",
        paragraphs: [
          "ExpertEdge Academy may suspend or terminate an account where there is a serious violation of these Terms, applicable policies, or applicable law.",
        ],
      },
      {
        title: "9. Changes",
        paragraphs: [
          "We may update these Terms from time to time. Updated terms will be published on this page.",
        ],
      },
      {
        title: "10. Contact",
        paragraphs: [
          "For questions regarding these Terms, contact info@expertedgeacademy.ng.",
        ],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy policy",
    eyebrow: "Last updated September 30, 2026",
    intro:
      "ExpertEdge Academy respects your privacy. This policy explains how we collect, use, store, and protect personal information when you use our website, learning platform, courses, and related services.",
    sections: [
      {
        title: "Information we may collect",
        items: [
          "Name, email address, and telephone number",
          "Account and login information",
          "Course enrolment, educational, and professional information you provide",
          "Payment and transaction information, certificates, and learning records",
          "Technical or device information, website usage, and communications with support",
        ],
      },
      {
        title: "How we use information",
        items: [
          "Create and manage learner accounts and enrolments",
          "Provide educational services, process payments, and issue certificates",
          "Communicate with learners and provide customer support",
          "Improve courses and services and maintain platform security",
          "Meet legal and regulatory obligations and send marketing where legally permitted",
        ],
      },
      {
        title: "Lawful processing",
        paragraphs: [
          "Personal information is processed on an applicable lawful basis, which may include consent, contractual necessity, legal obligation, or another basis recognized under applicable data-protection law. Our privacy framework should be maintained in accordance with the Nigeria Data Protection Act 2023 and applicable requirements.",
        ],
      },
      {
        title: "Data sharing",
        paragraphs: [
          "We may share relevant information with trusted service providers where necessary to operate our services, including payment processors, hosting and learning technology providers, communication providers, professional advisers, or authorities where legally required. We do not sell personal information simply for commercial purposes.",
        ],
      },
      {
        title: "Security and retention",
        paragraphs: [
          "We implement reasonable technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure. We retain information only as long as reasonably necessary for its purpose, legal obligations, legitimate business requirements, and dispute resolution.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "Subject to applicable law, you may have rights to access, correct, object to, restrict, or request deletion or portability of your information; withdraw consent where consent is the legal basis; and lodge a complaint with the relevant supervisory authority. Rights may include protections concerning automated decision-making.",
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "Our website may use cookies and similar technologies to support functionality, security, analytics, and user preferences.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "For privacy enquiries or data-subject requests, contact info@expertedgeacademy.ng.",
        ],
      },
    ],
  },
  careers: {
    title: "Careers at ExpertEdge Academy",
    eyebrow: "Build the future of learning with us",
    intro:
      "We bring together educators, technology professionals, administrators, content developers, business professionals, and creative minds committed to improving access to quality learning.",
    sections: [
      {
        title: "Areas of opportunity",
        items: [
          "Academic and training",
          "Instructional design",
          "Technology and digital marketing",
          "Student support and business development",
          "Administration and content development",
          "Sales, partnerships, and community management",
        ],
      },
      {
        title: "Why ExpertEdge?",
        items: [
          "Professional growth and learning opportunities",
          "A collaborative environment and exposure to emerging technologies",
          "The opportunity to contribute to education and skills development",
          "Flexible opportunities for selected roles",
        ],
      },
      {
        title: "How to apply",
        paragraphs: [
          "Send your CV and a brief statement explaining the role you are interested in to training@expertedgeacademy.ng.",
        ],
      },
    ],
  },
  blog: {
    title: "ExpertEdge Blog",
    eyebrow: "Ideas. Insights. Skills. Opportunities.",
    intro:
      "Practical articles, expert insights, and educational resources to help you learn, grow, and stay competitive.",
    sections: [
      {
        title: "Explore topics",
        items: [
          "Technology: emerging technologies, digital tools, AI, cybersecurity, and innovation",
          "Business: practical insights for entrepreneurs, business owners, and professionals",
          "Career development: build skills, improve your profile, and navigate opportunities",
          "Entrepreneurship: ideas and strategies for starting and growing businesses",
          "Leadership: management and workplace skills",
          "Education: learning strategies and lifelong learning",
          "Expert insights: perspectives from instructors and industry professionals",
        ],
      },
      {
        title: "Latest articles",
        paragraphs: [
          "New articles and learning resources will be published here. Check back for the latest from ExpertEdge Academy.",
        ],
      },
    ],
  },
  "press-kit": {
    title: "ExpertEdge Academy press kit",
    eyebrow: "Official media and brand resources",
    intro:
      "Approved information and brand resources for journalists, partners, organizations, and other authorized stakeholders.",
    sections: [
      {
        title: "About ExpertEdge Academy",
        paragraphs: [
          "ExpertEdge Academy is a professional education and skills development institution focused on practical learning, professional development, digital skills, and career-oriented education.",
        ],
      },
      {
        title: "Approved descriptions",
        paragraphs: [
          "Short version: ExpertEdge Academy is a professional education and skills development institution providing practical learning opportunities for individuals, professionals, entrepreneurs, and organizations.",
          "One-line version: ExpertEdge Academy — Empowering Knowledge. Building Skills. Creating Opportunities.",
        ],
      },
      {
        title: "Brand assets",
        items: [
          "Official logo and logo variations",
          "Brand guidelines and approved photographs",
          "Executive and instructor photographs",
          "Academy profile, official biography, and course catalogue",
          "Fact sheet and media contact information",
        ],
      },
      {
        title: "Media enquiries",
        paragraphs: [
          "For interviews, media requests, partnerships, or official statements, contact info@expertedgeacademy.ng.",
        ],
      },
    ],
  },
};

export default function SiteInfo() {
  const { page = "" } = useParams();
  const content = pages[page];

  if (!content) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-[#0b1735]">
          Page not found
        </h1>
        <Link
          className="mt-5 inline-block font-semibold text-[#154c8c] underline"
          to="/"
        >
          Return to the homepage
        </Link>
      </main>
    );
  }

  return (
    <>
      <Seo
        title={`${content.title} | ExpertEdge Academy`}
        description={content.intro}
        path={`/${page}`}
      />
      <main className="min-h-[60vh] bg-white">
        <header className="border-b border-slate-200 bg-[#f4f7fa] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#154c8c]">
              {content.eyebrow}
            </p>
            <h1 className="max-w-4xl font-display text-4xl font-black leading-tight text-[#0b1735] sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              {content.intro}
            </p>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <div className="divide-y divide-slate-200">
            {content.sections.map((section) => (
              <section
                key={section.title}
                className="grid gap-5 py-8 first:pt-0 md:grid-cols-[220px_1fr] md:gap-12"
              >
                <h2 className="font-display text-xl font-bold text-[#0b1735]">
                  {section.title}
                </h2>
                <div className="space-y-4 text-[15px] leading-7 text-slate-700">
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items && (
                    <ul className="list-disc space-y-2 pl-5 marker:text-[#e8a63b]">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.steps && (
                    <ol className="space-y-4">
                      {section.steps.map((step, index) => (
                        <li key={step.title} className="flex gap-4">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eaf1f7] text-sm font-bold text-[#154c8c]">
                            {index + 1}
                          </span>
                          <p>
                            <strong className="text-[#0b1735]">
                              {step.title}.{" "}
                            </strong>
                            {step.description}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                  {section.faqs?.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-semibold text-[#0b1735]">
                        {faq.question}
                      </h3>
                      <p className="mt-1">{faq.answer}</p>
                    </div>
                  ))}
                  {section.title === "Ready to teach?" && (
                    <Link
                      to="/teach"
                      className="inline-flex rounded-full bg-[#154c8c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0b1735]"
                    >
                      Become an instructor
                    </Link>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
