import { useState } from "react";
import { Link, Navigate } from "react-router";
import { COURSES } from "../data/courses";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../lib/money";

const testQuestions = [
  "Which habit best supports steady progress through an online course?",
  "What should you do before submitting a course project?",
  "When should you take the final assessment?",
];
const testAnswers = [
  "Practice consistently",
  "Review and test your work",
  "After completing the lessons",
];

export default function Dashboard() {
  const {
    user,
    logout,
    purchases,
    referralCode,
    referralBalance,
    updateProfile,
    markCourseComplete,
    isCourseComplete,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "learning" | "history" | "referrals" | "settings"
  >("learning");
  const [testCourseId, setTestCourseId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState("");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [copied, setCopied] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  if (!user)
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent("/dashboard")}`}
        replace
      />
    );

  const purchasedCourses = purchases
    .map((purchase) =>
      COURSES.find((course) => course.id === purchase.courseId),
    )
    .filter((course): course is (typeof COURSES)[number] => Boolean(course));

  const copyReferralLink = async (courseId: string) => {
    const link = `${window.location.origin}/courses/${courseId}?ref=${referralCode}`;
    await navigator.clipboard?.writeText(link);
    setCopied(courseId);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const submitTest = (courseId: string) => {
    const score = answers.filter(
      (answer, index) => answer === testAnswers[index],
    ).length;
    if (score >= 2) {
      markCourseComplete(courseId);
      setTestMessage("Passed. Your certificate is now available below.");
    } else {
      setTestMessage(
        `You scored ${score}/3. Review the lessons and try again.`,
      );
    }
  };

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile(profile);
    setTestMessage("Profile settings saved.");
  };

  return (
    <main className="min-h-screen bg-[#eef2f7] text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-sm font-bold text-[#17213D] transition hover:text-primary-blue">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17213D] text-xs font-black text-[#F5A623]">EE</span>
            <span className="hidden sm:block">ExpertEdge Academy</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-100"
              aria-expanded={accountMenuOpen}
              aria-label="Open account menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-blue text-sm font-bold text-white">{user.name[0]}</span>
              <span className="hidden min-w-0 sm:block"><span className="block max-w-36 truncate text-sm font-bold text-[#17213D]">{user.name}</span><span className="block text-xs text-slate-500">Learner account</span></span>
              <svg className={`h-4 w-4 text-slate-400 transition ${accountMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            {accountMenuOpen && (
              <div className="absolute right-0 top-14 z-30 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(23,33,61,0.16)]">
                <div className="border-b border-slate-100 px-3 py-3"><p className="truncate text-sm font-bold text-[#17213D]">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
                <button onClick={() => { setActiveTab("settings"); setAccountMenuOpen(false); }} className="mt-2 flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Profile settings</button>
                <Link to="/" className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Back to marketplace</Link>
                <button onClick={() => { setAccountMenuOpen(false); setLogoutDialogOpen(true); }} className="mt-1 flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-360">
        <section className="relative overflow-hidden rounded-[28px] bg-[#17213D] p-6 text-white shadow-[0_22px_60px_rgba(23,33,61,0.16)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border-40 border-[#f5a623]/15" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full border-28 border-white/5" />
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5A623]">
                Learner dashboard
              </p>
              <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Welcome back, {user.name}.
              </h1>
              <p className="mt-2 text-sm text-white/65">
                Keep building momentum across your learning journey.
              </p>
            </div>
            <div className="relative flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5A623] text-lg font-black text-[#17213D]">
                {user.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold">{user.email}</p>
                <p className="text-xs text-white/55">Active learner</p>
              </div>
            </div>
          </div>
          <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
            <Stat label="Courses purchased" value={String(purchases.length)} />
            <Stat
              label="Certificates earned"
              value={String(
                purchasedCourses.filter((course) => isCourseComplete(course.id))
                  .length,
              )}
            />
            <Stat
              label="Referral balance"
              value={formatNaira(referralBalance)}
            />
          </div>
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[230px_1fr] lg:gap-8">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:p-3 lg:shadow-sm lg:h-fit">
            {[
              ["learning", "My learning"],
              ["history", "Purchase history"],
              ["referrals", "Referral & earnings"],
              ["settings", "Profile settings"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setActiveTab(value as typeof activeTab)}
                className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-bold transition ${activeTab === value ? "bg-[#17213D] text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100 lg:bg-transparent"}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className="min-w-0">
            {activeTab === "learning" && (
              <div>
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary-blue">
                      Your library
                    </p>
                    <h2 className="mt-1 text-3xl font-black text-[#17213D]">
                      My courses
                    </h2>
                  </div>
                  <Link
                    to="/"
                    className="text-sm font-bold text-primary-blue hover:underline"
                  >
                    Browse more courses
                  </Link>
                </div>
                {purchasedCourses.length === 0 ? (
                  <EmptyLearning />
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {purchasedCourses.map((course) => {
                      const complete = isCourseComplete(course.id);
                      return (
                        <article
                          key={course.id}
                          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(23,33,61,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,33,61,0.12)]"
                        >
                          <div className="relative">
                            <img
                              src={`https://images.unsplash.com/${course.image}?w=800&h=360&fit=crop&auto=format`}
                              alt=""
                              className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            />
                            <Link
                              to={`/courses/${course.id}/lessons`}
                              className="absolute inset-0 flex items-center justify-center bg-[#17213D]/45 text-white opacity-0 transition group-hover:opacity-100"
                            >
                              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#17213D]">
                                Preview video
                              </span>
                            </Link>
                          </div>
                          <div className="p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-blue">
                              {course.category}
                            </p>
                            <h3 className="mt-2 font-bold leading-6 text-[#17213D]">
                              {course.title}
                            </h3>
                            <div className="mt-5 flex flex-wrap gap-2">
                              <Link
                                to={`/courses/${course.id}/lessons`}
                                className="rounded-lg bg-primary-blue px-4 py-2 text-sm font-bold text-white"
                              >
                                Continue learning
                              </Link>
                              <button
                                onClick={() => {
                                  setTestCourseId(course.id);
                                  setAnswers([]);
                                  setTestMessage("");
                                }}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
                              >
                                {complete
                                  ? "View certificate"
                                  : "Take final test"}
                              </button>
                            </div>
                            {complete && (
                              <a
                                href={`data:text/plain;charset=utf-8,Certificate of completion%0A${encodeURIComponent(user.name)} completed ${encodeURIComponent(course.title)}`}
                                download={`${course.id}-certificate.txt`}
                                className="mt-4 inline-block text-sm font-bold text-emerald-700 hover:underline"
                              >
                                Download certificate
                              </a>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
                {testCourseId && (
                  <TestPanel
                    courseTitle={
                      COURSES.find((course) => course.id === testCourseId)
                        ?.title || "Course"
                    }
                    answers={answers}
                    setAnswers={setAnswers}
                    message={testMessage}
                    onSubmit={() => submitTest(testCourseId)}
                    onClose={() => setTestCourseId(null)}
                  />
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-black text-[#17213D]">
                  Purchase history
                </h2>
                <div className="mt-6 divide-y divide-slate-200">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.courseId}
                      className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-bold text-[#17213D]">
                          {purchase.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Purchased{" "}
                          {new Date(purchase.purchasedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-bold text-slate-700">
                        {formatNaira(purchase.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "referrals" && (
              <ReferralPanel
                referralCode={referralCode}
                referralBalance={referralBalance}
                courses={COURSES}
                copied={copied}
                onCopy={copyReferralLink}
              />
            )}

            {activeTab === "settings" && (
              <form
                onSubmit={saveProfile}
                className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-black text-[#17213D]">
                  Profile settings
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Update the details shown on your learner account.
                </p>
                <label className="mt-6 block text-sm font-bold text-slate-700">
                  Full name
                  <input
                    value={profile.name}
                    onChange={(event) =>
                      setProfile({ ...profile, name: event.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                  />
                </label>
                <label className="mt-4 block text-sm font-bold text-slate-700">
                  Email address
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      setProfile({ ...profile, email: event.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                  />
                </label>
                <button className="mt-6 rounded-xl bg-primary-blue px-5 py-3 text-sm font-bold text-white">
                  Save settings
                </button>
                {testMessage && (
                  <p className="mt-3 text-sm font-semibold text-emerald-700">
                    {testMessage}
                  </p>
                )}
              </form>
            )}
          </section>
        </div>
      </div>
      {logoutDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1735]/60 px-4" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="logout-title" className="text-xl font-black text-[#17213D]">Log out of your account?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Your progress is saved. You can sign back in whenever you are ready to continue learning.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setLogoutDialogOpen(false)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Cancel</button>
              <button onClick={logout} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">Log out</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs text-white/55">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}
function EmptyLearning() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <h3 className="text-lg font-bold text-[#17213D]">
        Your learning library is empty
      </h3>
      <p className="mt-2 text-sm text-slate-500">
        Purchase a course to see its video lessons here.
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex rounded-xl bg-primary-blue px-5 py-3 text-sm font-bold text-white"
      >
        Explore courses
      </Link>
    </div>
  );
}
function ReferralPanel({
  referralCode,
  referralBalance,
  courses,
  copied,
  onCopy,
}: {
  referralCode: string;
  referralBalance: number;
  courses: typeof COURSES;
  copied: string;
  onCopy: (courseId: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black text-[#17213D]">
        Referral & earnings
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Share a course link and earn a bonus when a new learner purchases
        through it.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#17213D] p-5 text-white">
          <p className="text-xs text-white/60">Your referral code</p>
          <p className="mt-2 text-2xl font-black tracking-widest text-[#F5A623]">
            {referralCode}
          </p>
          <p className="mt-4 text-sm text-white/70">
            Available bonus:{" "}
            <strong className="text-white">
              {formatNaira(referralBalance)}
            </strong>
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            How it works
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Copy any course link below. Each completed purchase credits your
            demo bonus balance.
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-bold text-[#17213D]">Promote a course</h3>
        <div className="mt-3 divide-y divide-slate-100">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center"
            >
              <p className="text-sm font-semibold text-slate-700">
                {course.title}
              </p>
              <button
                onClick={() => onCopy(course.id)}
                className="shrink-0 rounded-lg border border-primary-blue px-3 py-2 text-xs font-bold text-primary-blue"
              >
                {copied === course.id ? "Copied" : "Copy referral link"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function TestPanel({
  courseTitle,
  answers,
  setAnswers,
  message,
  onSubmit,
  onClose,
}: {
  courseTitle: string;
  answers: string[];
  setAnswers: (answers: string[]) => void;
  message: string;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1735]/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary-blue">
              Final assessment
            </p>
            <h2 className="mt-1 text-xl font-black text-[#17213D]">
              {courseTitle}
            </h2>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400">
            ×
          </button>
        </div>
        <div className="mt-5 space-y-5">
          {testQuestions.map((question, index) => (
            <fieldset key={question}>
              <legend className="text-sm font-bold text-slate-700">
                {index + 1}. {question}
              </legend>
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={answers[index] === testAnswers[index]}
                  onChange={() => {
                    const next = [...answers];
                    next[index] = testAnswers[index];
                    setAnswers(next);
                  }}
                />{" "}
                {testAnswers[index]}
              </label>
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={answers[index] === "other"}
                  onChange={() => {
                    const next = [...answers];
                    next[index] = "other";
                    setAnswers(next);
                  }}
                />{" "}
                I need to review this topic
              </label>
            </fieldset>
          ))}
        </div>
        <button
          onClick={onSubmit}
          className="mt-6 rounded-xl bg-primary-blue px-5 py-3 text-sm font-bold text-white"
        >
          Submit assessment
        </button>
        {message && (
          <p className="mt-3 text-sm font-semibold text-emerald-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
