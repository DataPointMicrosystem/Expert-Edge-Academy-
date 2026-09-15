import { useEffect, useState } from "react";

import { Link, Navigate } from "react-router";

import { COURSES } from "../data/courses";

import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/useLearning";
import { toCourse } from "../lib/coursesApi";
import { notify } from "../lib/notify";
import { learningApi } from "../lib/learningApi";
import {
  referralsApi,
  type ReferralHistoryItem,
  type ReferralSummary,
} from "../lib/referralsApi";
import type { Course } from "../data/courses";
import type { NotificationChannel } from "../context/AuthContext";

import { formatNaira } from "../lib/money";

import CourseLessons from "./CourseLessons";

import expertedgeLogo from "../asset/expertedgeLogo.jpg";

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

const learnerNotifications = [
  {
    id: "course-progress",
    title: "Keep your learning moving",
    message:
      "You are making great progress. Continue your course when you are ready.",
    time: "Today",
    type: "Learning",
  },
  {
    id: "certificate-ready",
    title: "Your certificate is waiting",
    message:
      "Complete your final assessment to unlock your course certificate.",
    time: "Yesterday",
    type: "Achievement",
  },
  {
    id: "new-courses",
    title: "New courses are available",
    message:
      "Explore the marketplace to discover your next learning opportunity.",
    time: "3 days ago",
    type: "Marketplace",
  },
];

export default function Dashboard() {
  const {
    user,

    logout,

    updateProfile,
    changePassword,
    notificationChannel,
    setNotificationChannel,

    markCourseComplete,

    isCourseComplete,
  } = useAuth();

  const {
    enrollments,
    certificates,
    notifications,
    markNotification,
    markAllNotifications,
  } = useLearning();

  const [activeTab, setActiveTab] = useState<
    "learning" | "history" | "referrals" | "notifications" | "settings"
  >("learning");

  const [lessonCourseId, setLessonCourseId] = useState<string | null>(null);

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

  const [settingsSection, setSettingsSection] = useState<
    "profile" | "notifications" | "password"
  >("profile");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [referralSummary, setReferralSummary] =
    useState<ReferralSummary | null>(null);
  const [referralHistory, setReferralHistory] = useState<ReferralHistoryItem[]>(
    [],
  );
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralError, setReferralError] = useState("");

  useEffect(() => {
    if (!user) return;
    setHistoryLoading(true);
    learningApi
      .getPaymentHistory()
      .then((response) => setPaymentHistory(response.data || []))
      .catch((error) =>
        notify(
          error instanceof Error
            ? error.message
            : "Purchase history is temporarily unavailable.",
          "error",
        ),
      )
      .finally(() => setHistoryLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    setReferralLoading(true);
    setReferralError("");
    Promise.all([referralsApi.getSummary(), referralsApi.getHistory()])
      .then(([summaryResponse, historyResponse]) => {
        setReferralSummary(summaryResponse.data);
        setReferralHistory(historyResponse.data || []);
      })
      .catch(async (error) => {
        try {
          await referralsApi.getCode();
          setReferralSummary(null);
          setReferralHistory([]);
          setReferralError(
            "Your referral code is ready, but referral metrics are temporarily unavailable.",
          );
        } catch (fallbackError) {
          setReferralError(
            fallbackError instanceof Error
              ? fallbackError.message
              : error instanceof Error
                ? error.message
                : "Referral data is temporarily unavailable.",
          );
        }
      })
      .finally(() => setReferralLoading(false));
  }, [user?.id]);

  if (!user)
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent("/dashboard")}`}
        replace
      />
    );

  if (user.role === "instructor") {
    return <Navigate to="/facilitator" replace />;
  }

  const purchasedCourses = enrollments
    .map((enrollment) => enrollment.course && toCourse(enrollment.course))
    .filter(Boolean);

  const copyReferralLink = async (courseId: string) => {
    const code = referralSummary?.referralCode;
    if (!code) {
      notify("Your referral code is not available yet.", "error");
      return;
    }
    const link = `${window.location.origin}/signup?ref=${encodeURIComponent(code)}&courseId=${encodeURIComponent(courseId)}`;

    await navigator.clipboard?.writeText(link);
    notify("Referral link copied.", "success");

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
      notify("Passed. Your certificate is now available below.", "success");
    } else {
      setTestMessage(
        `You scored ${score}/3. Review the lessons and try again.`,
      );
      notify(
        `You scored ${score}/3. Review the lessons and try again.`,
        "error",
      );
    }
  };

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();

    updateProfile(profile);

    setTestMessage("Profile settings saved.");
    notify("Profile settings saved.", "success");
  };

  const savePassword = (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError("");

    if (!passwordForm.currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Your new password must be at least 8 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Your new passwords do not match.");
      return;
    }

    const error = changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
    );
    if (error) {
      setPasswordError(error);
      return;
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTestMessage("Password changed successfully.");
    notify("Password changed successfully.", "success");
  };

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[4.25rem] max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-sm font-bold text-[#17213D] transition hover:text-primary-blue"
          >
            <img
              src={expertedgeLogo}
              alt="ExpertEdge Academy"
              className="h-8 w-auto max-w-36 object-contain"
            />
            <span className="hidden border-l border-slate-200 pl-3 text-xs font-medium text-slate-500 sm:block">
              Learner portal
            </span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-100"
              aria-expanded={accountMenuOpen}
              aria-label="Open account menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-blue text-sm font-bold text-white">
                {user.name[0]}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-36 truncate text-sm font-bold text-[#17213D]">
                  {user.name}
                </span>
                <span className="block text-xs text-slate-500">
                  Learner account
                </span>
              </span>
              <svg
                className={`h-4 w-4 text-slate-400 transition ${
                  accountMenuOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {accountMenuOpen && (
              <div className="absolute right-0 top-14 z-30 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(23,33,61,0.16)]">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="truncate text-sm font-bold text-[#17213D]">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setAccountMenuOpen(false);
                  }}
                  className="mt-2 flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Profile settings
                </button>
                <Link
                  to="/"
                  className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to marketplace
                </Link>
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    setLogoutDialogOpen(true);
                  }}
                  className="mt-1 flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-360 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <section className="border-b border-slate-200 pb-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-blue">
                Learner dashboard
              </p>
              <h1 className="mt-2 font-display text-3xl font-black text-[#17213D] sm:text-4xl">
                Welcome back, {user.name}.
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Pick up where you left off and keep your learning moving.
              </p>
            </div>
            <p className="text-sm text-slate-500">
              Signed in as{" "}
              <span className="font-semibold text-slate-700">{user.email}</span>
            </p>
          </div>
          <div className="mt-7 grid divide-y divide-slate-200 border-y border-slate-200 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Stat
              label="Courses purchased"
              value={String(enrollments.length)}
            />
            <Stat
              label="Certificates earned"
              value={String(certificates.length)}
            />
            <Stat
              label="Referral balance"
              value={
                referralLoading
                  ? "Loading..."
                  : referralSummary
                    ? formatNaira(referralSummary.balance)
                    : "Unavailable"
              }
            />
          </div>
        </section>

        <div className="mt-7 grid gap-8 lg:grid-cols-[210px_1fr]">
          <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-2 lg:flex-col lg:border-0 lg:pb-0">
            {[
              ["learning", "My learning"],

              ["history", "Purchase history"],

              ["referrals", "Referral & earnings"],

              ["notifications", "Notifications"],

              ["settings", "Profile settings"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => {
                  setActiveTab(value as typeof activeTab);
                }}
                className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeTab === value
                    ? "bg-[#17213D] text-white"
                    : "text-slate-600 hover:bg-white hover:text-[#17213D]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className="min-w-0">
            {activeTab === "learning" && (
              <div>
                {lessonCourseId ? (
                  <CourseLessons
                    courseId={lessonCourseId}
                    embedded
                    onBack={() => setLessonCourseId(null)}
                  />
                ) : null}
                {!lessonCourseId && (
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
                )}
                {!lessonCourseId && purchasedCourses.length === 0 && (
                  <EmptyLearning />
                )}
                {!lessonCourseId && purchasedCourses.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {purchasedCourses.map((course) => {
                      const certificate = certificates.find(
                        (item) =>
                          (item.course?._id ||
                            item.course?.id ||
                            item.courseId) === course.id,
                      );
                      const complete = Boolean(certificate);

                      return (
                        <article
                          key={course.id}
                          className="group overflow-hidden border border-slate-200 bg-white transition-colors hover:border-slate-300"
                        >
                          <div className="relative">
                            <img
                              src={`https://images.unsplash.com/${course.image}?w=800&h=360&fit=crop&auto=format`}
                              alt=""
                              className="h-40 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setLessonCourseId(course.id)}
                              className="absolute inset-0 flex items-center justify-center bg-[#17213D]/65 text-white opacity-0 transition group-hover:opacity-100"
                            >
                              <span className="border border-white bg-[#17213D] px-4 py-2 text-sm font-bold text-white">
                                Open course
                              </span>
                            </button>
                          </div>
                          <div className="p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-blue">
                              {course.category}
                            </p>
                            <h3 className="mt-2 font-bold leading-6 text-[#17213D]">
                              {course.title}
                            </h3>
                            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                              <button
                                type="button"
                                onClick={() => setLessonCourseId(course.id)}
                                className="bg-primary-blue px-4 py-2 text-sm font-bold text-white hover:bg-[#0b1735]"
                              >
                                Continue learning
                              </button>
                              <button
                                onClick={() => {
                                  setTestCourseId(course.id);

                                  setAnswers([]);

                                  setTestMessage("");
                                }}
                                className="border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-500 hover:text-[#17213D]"
                              >
                                {complete
                                  ? "View certificate"
                                  : "Take final test"}
                              </button>
                            </div>
                            {complete &&
                              (certificate?.url ||
                                certificate?.downloadUrl) && (
                                <a
                                  href={
                                    certificate.url || certificate.downloadUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-4 inline-block text-sm font-bold text-emerald-700 hover:underline"
                                >
                                  View certificate
                                </a>
                              )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
                {!lessonCourseId && testCourseId && (
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
              <div className="border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-black text-[#17213D]">
                  Purchase history
                </h2>
                <div className="mt-6 divide-y divide-slate-200">
                  {historyLoading ? (
                    <p className="py-8 text-sm text-slate-500">
                      Loading purchase history...
                    </p>
                  ) : paymentHistory.length === 0 ? (
                    <p className="py-8 text-sm text-slate-500">
                      No completed purchases yet. Verified payments will appear
                      here.
                    </p>
                  ) : (
                    paymentHistory.map((payment) => {
                      const paymentCourse = payment.course || {};
                      return (
                        <div
                          key={payment._id || payment.id || payment.reference}
                          className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
                        >
                          <div>
                            <p className="font-bold text-[#17213D]">
                              {paymentCourse.title ||
                                payment.title ||
                                "Course purchase"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {payment.status || "Payment"} ·{" "}
                              {new Date(
                                payment.createdAt ||
                                  payment.paidAt ||
                                  payment.purchasedAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="font-bold text-slate-700">
                            {formatNaira(
                              Number(payment.amount || payment.amountPaid || 0),
                            )}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === "referrals" && (
              <ReferralPanel
                summary={referralSummary}
                history={referralHistory}
                loading={referralLoading}
                error={referralError}
                courses={purchasedCourses as Course[]}
                copied={copied}
                onCopy={copyReferralLink}
              />
            )}

            {activeTab === "notifications" && (
              <div className="max-w-3xl border border-slate-200 bg-white">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-semibold text-primary-blue">
                      Your inbox
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-[#17213D]">
                      Notifications
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Stay up to date with your learning activity and account.
                    </p>
                  </div>
                  {notifications.some(
                    (notification) =>
                      !notification.isRead && !notification.read,
                  ) && (
                    <button
                      type="button"
                      onClick={() => void markAllNotifications()}
                      className="text-left text-sm font-bold text-primary-blue hover:underline sm:text-right"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-slate-100">
                  {notifications.map((notification) => {
                    const notificationId = notification._id || notification.id;
                    const isRead = notification.isRead || notification.read;

                    return (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => void markNotification(notificationId)}
                        className={`flex w-full gap-4 p-5 text-left transition hover:bg-slate-50 ${isRead ? "" : "bg-blue-50/50"}`}
                      >
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${isRead ? "bg-slate-200" : "bg-primary-blue"}`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-bold text-[#17213D]">
                              {notification.title || notification.subject}
                            </span>
                            <span className="text-xs text-slate-400">
                              {notification.time ||
                                (notification.createdAt
                                  ? new Date(
                                      notification.createdAt,
                                    ).toLocaleDateString()
                                  : "")}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-primary-blue">
                            {notification.type}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-slate-600">
                            {notification.message || notification.body}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-black text-[#17213D]">
                  Profile settings
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Manage your account details, notifications, and password.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                  {[
                    ["profile", "Profile details"],
                    ["notifications", "Notification settings"],
                    ["password", "Change password"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSettingsSection(value as typeof settingsSection);
                        setTestMessage("");
                        setPasswordError("");
                      }}
                      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${settingsSection === value ? "bg-[#17213D] text-white" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {settingsSection === "profile" && (
                  <form onSubmit={saveProfile}>
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
                    <button className="mt-6 bg-primary-blue px-5 py-3 text-sm font-bold text-white hover:bg-[#0b1735]">
                      Save settings
                    </button>
                  </form>
                )}

                {settingsSection === "notifications" && (
                  <div
                    className="mt-6"
                    aria-labelledby="notification-settings-title"
                  >
                    <h3
                      id="notification-settings-title"
                      className="text-lg font-black text-[#17213D]"
                    >
                      Notification settings
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose where you want to receive account and learning
                      updates.
                    </p>
                    <div
                      className="mt-5 grid gap-3 sm:grid-cols-3"
                      role="radiogroup"
                      aria-label="Notification channel"
                    >
                      {[
                        ["email", "Email", "Receive updates in your inbox."],
                        ["app", "App", "Receive alerts in the app."],
                        ["sms", "SMS", "Receive updates by text message."],
                      ].map(([value, label, description]) => (
                        <label
                          key={value}
                          className={`cursor-pointer rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-primary-blue/30 ${notificationChannel === value ? "border-primary-blue bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
                        >
                          <input
                            type="radio"
                            name="notificationChannel"
                            value={value}
                            checked={notificationChannel === value}
                            onChange={() => {
                              setNotificationChannel(
                                value as NotificationChannel,
                              );
                              setTestMessage("Notification preference saved.");
                            }}
                            className="sr-only"
                          />
                          <span className="flex items-center justify-between gap-2 text-sm font-bold text-[#17213D]">
                            {label}
                            {notificationChannel === value && (
                              <span className="text-xs font-bold text-primary-blue">
                                Selected
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            {description}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {settingsSection === "password" && (
                  <form onSubmit={savePassword} className="mt-6 max-w-xl">
                    <h3 className="text-lg font-black text-[#17213D]">
                      Change password
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Use at least 8 characters for your new password.
                    </p>
                    <PasswordField
                      label="Current password"
                      value={passwordForm.currentPassword}
                      onChange={(value) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: value,
                        })
                      }
                    />
                    <PasswordField
                      label="New password"
                      value={passwordForm.newPassword}
                      onChange={(value) =>
                        setPasswordForm({ ...passwordForm, newPassword: value })
                      }
                    />
                    <PasswordField
                      label="Confirm new password"
                      value={passwordForm.confirmPassword}
                      onChange={(value) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: value,
                        })
                      }
                    />
                    {passwordError && (
                      <p className="mt-3 text-sm font-semibold text-red-600">
                        {passwordError}
                      </p>
                    )}
                    <button className="mt-5 bg-primary-blue px-5 py-3 text-sm font-bold text-white hover:bg-[#0b1735]">
                      Update password
                    </button>
                  </form>
                )}
                {testMessage && (
                  <p className="mt-3 text-sm font-semibold text-emerald-700">
                    {testMessage}
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      {logoutDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1735]/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="w-full max-w-sm bg-white p-6 shadow-2xl">
            <h2 id="logout-title" className="text-xl font-black text-[#17213D]">
              Log out of your account?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your progress is saved. You can sign back in whenever you are
              ready to continue learning.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setLogoutDialogOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 block text-sm font-bold text-slate-700">
      {label}
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 sm:px-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-5 00">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-[#17213D]">{value}</p>
    </div>
  );
}

function EmptyLearning() {
  return (
    <div className="border border-dashed border-slate-300 bg-white p-12 text-center">
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
  summary,
  history,
  loading,
  error,
  courses,

  copied,

  onCopy,
}: {
  summary: ReferralSummary | null;
  history: ReferralHistoryItem[];
  loading: boolean;
  error: string;
  courses: Course[];

  copied: string;

  onCopy: (courseId: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-blue">
            Invite and earn
          </p>
          <h2 className="mt-1 text-3xl font-black text-[#17213D]">
            Referral center
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Share your code, track referrals, and see rewards after verified
            payments.
          </p>
        </div>
        {summary?.referralCode && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Your code
            </p>
            <p className="font-black tracking-widest text-primary-blue">
              {summary.referralCode}
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-6 border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading referral data...
        </div>
      ) : error ? (
        <div className="mt-6 border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : summary ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Available balance", summary.balance, "text-emerald-700"],
              ["Total earned", summary.totalEarned, "text-[#17213D]"],
              ["Pending", summary.pendingBalance, "text-amber-700"],
            ].map(([label, amount, color]) => (
              <div
                key={String(label)}
                className="border border-slate-200 bg-white p-5"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </p>
                <p className={`mt-2 text-2xl font-black ${color}`}>
                  {formatNaira(Number(amount))}
                </p>
              </div>
            ))}
            <div className="border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Successful referrals
              </p>
              <p className="mt-2 text-2xl font-black text-[#17213D]">
                {summary.successfulReferrals}
              </p>
            </div>
            <div className="border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Link clicks
              </p>
              <p className="mt-2 text-2xl font-black text-[#17213D]">
                {summary.clicks}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-[#17213D]">Promote a course</h3>
              <p className="mt-1 text-sm text-slate-500">
                Create a signup link tied to one of your enrolled courses.
              </p>
              <div className="mt-3 divide-y divide-slate-100">
                {courses.length === 0 ? (
                  <p className="py-5 text-sm text-slate-500">
                    Enroll in a course before promoting it.
                  </p>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <p className="line-clamp-2 text-sm font-semibold text-slate-700">
                        {course.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => onCopy(course.id)}
                        className="shrink-0 rounded-lg bg-primary-blue px-3 py-2 text-xs font-bold text-white hover:bg-[#0b1735]"
                      >
                        {copied === course.id ? "Copied" : "Copy link"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
            <section className="border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-[#17213D]">Referral history</h3>
              {history.length === 0 ? (
                <p className="py-5 text-sm text-slate-500">
                  No referral rewards yet. Completed verified referrals will
                  appear here.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-slate-100">
                  {history.map((item) => (
                    <div key={item.id} className="py-3">
                      <div className="flex justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-700">
                          {item.course?.title || "Course referral"}
                        </p>
                        <span className="text-sm font-bold text-emerald-700">
                          {formatNaira(item.amount)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.status} ·{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      ) : (
        <div className="mt-6 border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Referral data is not available yet.
        </div>
      )}
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl">
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
