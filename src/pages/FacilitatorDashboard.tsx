import { useMemo, useState } from "react"

import { Link, Navigate } from "react-router"

import { COURSES } from "../data/courses"

import { useAuth } from "../context/AuthContext"

import { formatNaira } from "../lib/money"

import expertedgeLogo from "../asset/expertedgeLogo.jpg"

type FacilitatorTab = "overview" | "courses" | "students" | "analytics" | "payouts"

type CourseStatus = "Published" | "Draft" | "In review"

const courseStatuses: CourseStatus[] = ["Published", "Draft", "In review"]

const nigerianBanks = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "FCMB",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Jaiz Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Lotus Bank",
  "Moniepoint MFB",
  "Opay",
  "Palmpay",
  "Parallex Bank",
  "Polaris Bank",
  "Premium Trust Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank Nigeria",
  "Sterling Bank",
  "SunTrust Bank",
  "TAJBank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
]

export default function FacilitatorDashboard() {
  const { user, logout } = useAuth()

  const [activeTab, setActiveTab] = useState<FacilitatorTab>("overview")

  const [courseFilter, setCourseFilter] = useState<"All" | CourseStatus>("All")

  const [createOpen, setCreateOpen] = useState(false)

  const [accountOpen, setAccountOpen] = useState(false)

  const [selectedLearnerCourse, setSelectedLearnerCourse] =
    useState<string | null>(null)

  const facilitatorCourses = COURSES.slice(0, 4).map((course, index) => ({
    ...course,

    status: courseStatuses[index % courseStatuses.length],

    students: [1840, 982, 316, 74][index],

    revenue: [4680000, 2415000, 785000, 0][index],

    rating: [4.9, 4.8, 4.7, 0][index],
  }))

  const visibleCourses = useMemo(
    () =>
      courseFilter === "All"
        ? facilitatorCourses
        : facilitatorCourses.filter((course) => course.status === courseFilter),

    [courseFilter],
  )

  if (!user) {
    return (
      <Navigate
        to={`/signup?role=instructor&redirectTo=${encodeURIComponent("/facilitator")}`}
        replace
      />
    )
  }

  if (user.role !== "instructor") {
    return <Navigate to="/dashboard" replace />
  }

  const tabs: { value: FacilitatorTab label: string }[] = [
    { value: "overview", label: "Overview" },

    { value: "courses", label: "Courses" },

    { value: "students", label: "Students" },

    { value: "analytics", label: "Analytics" },

    { value: "payouts", label: "Payouts" },
  ]

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[4.25rem] max-w-360 items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={expertedgeLogo}
              alt="ExpertEdge Academy"
              className="h-8 w-auto max-w-36 object-contain"
            />
            <span className="hidden border-l border-slate-200 pl-3 text-xs font-medium text-slate-500 sm:block">
              Facilitator studio
            </span>
          </Link>
          <div className="relative flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden text-sm font-semibold text-slate-600 hover:text-[#17213D] sm:block"
            >
              Learner dashboard
            </Link>
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              className="flex items-center gap-2 border-l border-slate-200 pl-3 text-left"
              aria-expanded={accountOpen}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17213D] text-sm font-bold text-white">
                {user.name[0]}
              </span>
              <span className="hidden sm:block">
                <span className="block max-w-32 truncate text-sm font-bold text-[#17213D]">
                  {user.name}
                </span>
                <span className="block text-xs text-slate-500">
                  Facilitator account
                </span>
              </span>
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-12 z-20 w-52 border border-slate-200 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  onClick={logout}
                  className="block w-full px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-360 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-blue">
              Facilitator studio
            </p>
            <h1 className="mt-2 font-display text-3xl font-black text-[#17213D] sm:text-4xl">
              Good morning, {user.name}.
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your courses, understand your learners, and grow your
              teaching business.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="bg-primary-blue px-5 py-3 text-sm font-bold text-white hover:bg-[#0b1735]"
          >
            Create a course <span aria-hidden="true">+</span>
          </button>
        </div>

        <div className="mt-7 flex gap-1 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition ${
                activeTab === tab.value
                  ? "border-primary-blue text-[#17213D]"
                  : "border-transparent text-slate-500 hover:text-[#17213D]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="pt-7">
          {activeTab === "overview" && (
            <Overview
              courses={facilitatorCourses}
              onOpenCourses={() => setActiveTab("courses")}
            />
          )}
          {activeTab === "courses" && (
            <Courses
              courses={visibleCourses}
              filter={courseFilter}
              setFilter={setCourseFilter}
              onCreate={() => setCreateOpen(true)}
            />
          )}
          {activeTab === "students" &&
            (selectedLearnerCourse ? (
              <LearnerProgressDetail
                course={
                  facilitatorCourses.find(
                    (course) => course.id === selectedLearnerCourse,
                  ) || facilitatorCourses[0]
                }
                onBack={() => setSelectedLearnerCourse(null)}
              />
            ) : (
              <Students
                courses={facilitatorCourses}
                onViewLearners={setSelectedLearnerCourse}
              />
            ))}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "payouts" && <Payouts />}
        </section>
      </div>

      {createOpen && <CreateCourse onClose={() => setCreateOpen(false)} />}
    </main>
  )
}

function Overview({
  courses,
  onOpenCourses,
}: {
  courses: ReturnType<typeof getCourseData>
  onOpenCourses: () => void
}) {
  const published = courses.filter((course) => course.status === "Published")

  return (
    <div className="space-y-7">
      <div className="grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Total students"
          value="3,212"
          detail="↑ 12.4% this month"
          positive
        />
        <Metric
          label="Course revenue"
          value={formatNaira(7790000)}
          detail="↑ 8.7% this month"
          positive
        />
        <Metric
          label="Average rating"
          value="4.86"
          detail="Across 2 published courses"
        />
        <Metric label="Profile visits" value="8,490" detail="Last 30 days" />
      </div>
      <div className="grid gap-7 lg:grid-cols-[1fr_310px]">
        <div className="border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
                Performance
              </p>
              <h2 className="mt-1 text-xl font-black text-[#17213D]">
                Revenue overview
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Last 6 months
            </span>
          </div>
          <div className="mt-6 flex h-52 items-end gap-3 border-b border-l border-slate-200 px-3 pb-0 pt-4 sm:gap-6">
            <Bar label="Apr" value="42%" amount="₦420k" />
            <Bar label="May" value="54%" amount="₦540k" />
            <Bar label="Jun" value="48%" amount="₦480k" />
            <Bar label="Jul" value="68%" amount="₦680k" />
            <Bar label="Aug" value="76%" amount="₦760k" />
            <Bar label="Sep" value="92%" amount="₦920k" active />
          </div>
        </div>
        <div className="border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
                Your catalogue
              </p>
              <h2 className="mt-1 text-xl font-black text-[#17213D]">
                Course status
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenCourses}
              className="text-xs font-bold text-primary-blue hover:underline"
            >
              View all
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <StatusRow
              label="Published"
              value={`${published.length} courses`}
              color="bg-emerald-500"
            />
            <StatusRow
              label="In review"
              value="1 course"
              color="bg-amber-500"
            />
            <StatusRow label="Drafts" value="1 course" color="bg-slate-400" />
          </div>
        </div>
      </div>
      <div className="border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
              Recent work
            </p>
            <h2 className="mt-1 text-xl font-black text-[#17213D]">
              Your courses
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenCourses}
            className="text-sm font-bold text-primary-blue hover:underline"
          >
            Manage courses
          </button>
        </div>
        <CourseTable courses={courses.slice(0, 3)} />
      </div>
    </div>
  )
}

function Courses({
  courses,
  filter,
  setFilter,
  onCreate,
}: {
  courses: ReturnType<typeof getCourseData>
  filter: "All" | CourseStatus
  setFilter: (filter: "All" | CourseStatus) => void
  onCreate: () => void
}) {
  return (
    <div className="border border-slate-200 bg-white">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
            Catalogue
          </p>
          <h2 className="mt-1 text-xl font-black text-[#17213D]">
            Manage your courses
          </h2>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="self-start bg-primary-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b1735]"
        >
          New course +
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-5 py-3 sm:px-6">
        {(["All", ...courseStatuses] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`px-3 py-1.5 text-xs font-bold ${
              filter === item
                ? "bg-[#17213D] text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <CourseTable courses={courses} />
    </div>
  )
}

function CourseTable({
  courses,
}: {
  courses: ReturnType<typeof getCourseData>
}) {
  return (
    <div className="divide-y divide-slate-100">
      {courses.map((course) => (
        <article
          key={course.id}
          className="grid gap-4 px-5 py-5 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:px-6"
        >
          <img
            src={`https://images.unsplash.com/${course.image}?w=480&h=270&fit=crop&auto=format`}
            alt=""
            className="h-24 w-full object-cover sm:h-20 sm:w-36"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`h-2 w-2 ${
                  course.status === "Published"
                    ? "bg-emerald-500"
                    : course.status === "Draft"
                      ? "bg-slate-400"
                      : "bg-amber-500"
                }`}
              />
              <span className="text-xs font-bold text-slate-500">
                {course.status}
              </span>
            </div>
            <h3 className="mt-1 truncate font-bold text-[#17213D]">
              {course.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {course.students.toLocaleString()} students{" "}
              {course.rating
                ? `· ${course.rating} rating`
                : "· Not published yet"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-5 sm:block sm:text-right">
            <p className="text-sm font-black text-[#17213D]">
              {formatNaira(course.revenue)}
            </p>
            <button
              type="button"
              className="mt-1 text-xs font-bold text-primary-blue hover:underline"
            >
              Edit course
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function Students({
  courses,
  onViewLearners,
}: {
  courses: ReturnType<typeof getCourseData>
  onViewLearners: (courseId: string) => void
}) {
  const courseProgress = [78, 64, 51, 29]

  const totalStudents = courses.reduce(
    (total, course) => total + course.students,
    0,
  )

  const averageProgress = Math.round(
    courseProgress.reduce((total, progress) => total + progress, 0) /
      courseProgress.length,
  )

  const questions = [
    ["How do I submit the project?", "React Developer", "12 min ago"],

    [
      "Can I download the lesson materials?",
      "UI/UX Design Bootcamp",
      "1 hr ago",
    ],

    [
      "When is the next live review?",
      "Data Science & Machine Learning",
      "3 hrs ago",
    ],
  ]

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  const [reply, setReply] = useState("")

  const [replies, setReplies] = useState<Record<string, string>>({})

  const sendReply = (question: string) => {
    if (!reply.trim()) return

    setReplies((current) => ({ ...current, [question]: reply.trim() }))

    setReply("")

    setSelectedQuestion(null)
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Total learners"
          value={totalStudents.toLocaleString()}
          detail="Across your courses"
        />
        <Metric
          label="Active learners"
          value="1,842"
          detail="In the last 30 days"
          positive
        />
        <Metric
          label="Average progress"
          value={`${averageProgress}%`}
          detail="Across all courses"
          positive
        />
        <Metric
          label="Questions waiting"
          value="18"
          detail="Needs your attention"
        />
      </div>

      <div className="border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
            Course progress
          </p>
          <h2 className="mt-1 text-xl font-black text-[#17213D]">
            See how learners are progressing
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Compare enrolments, active learners, and completion across your
            catalogue.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {courses.map((course, index) => {
            const progress = courseProgress[index]

            const activeLearners = Math.round(
              course.students * (0.42 + index * 0.04),
            )

            const completedLearners = Math.round(
              (course.students * progress) / 100,
            )

            return (
              <article
                key={course.id}
                className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_180px_150px] sm:items-center sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#17213D]">
                    {course.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {course.students.toLocaleString()} enrolled ·{" "}
                    {activeLearners.toLocaleString()} active
                  </p>
                  <div className="mt-3 h-2 bg-slate-100">
                    <div
                      className="h-full bg-primary-blue"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Completion
                  </p>
                  <p className="mt-1 text-lg font-black text-[#17213D]">
                    {progress}%
                  </p>
                  <p className="text-xs text-slate-500">
                    {completedLearners.toLocaleString()} learners finished
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onViewLearners(course.id)}
                  className="justify-self-start text-sm font-bold text-primary-blue hover:underline sm:justify-self-end"
                >
                  View learners
                </button>
              </article>
            )
          })}
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-2">
        <div className="border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
              Recent activity
            </p>
            <h2 className="mt-1 text-xl font-black text-[#17213D]">
              Learner momentum
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              ["Ada N.", "completed React Fundamentals", "8 min ago"],
              ["Michael O.", "started Product Design Bootcamp", "42 min ago"],
              ["Sarah K.", "submitted a final assessment", "2 hrs ago"],
            ].map(([name, action, time]) => (
              <div
                key={`${name}-${action}`}
                className="flex items-center gap-3 px-5 py-4 sm:px-6"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17213D] text-xs font-bold text-white">
                  {name[0]}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-bold text-[#17213D]">{name}</span>{" "}
                    {action}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
                Support
              </p>
              <h2 className="mt-1 text-xl font-black text-[#17213D]">
                Learner questions
              </h2>
            </div>
            <span className="bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
              18 open
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {questions.map(([question, course, time]) => (
              <div key={question} className="px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedQuestion(
                      selectedQuestion === question ? null : question,
                    )
                    setReply("")
                  }}
                  className="block w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-sm font-bold text-[#17213D]">
                      {question}
                    </p>
                    <span
                      className={`shrink-0 text-xs font-bold ${
                        replies[question]
                          ? "text-emerald-600"
                          : "text-primary-blue"
                      }`}
                    >
                      {replies[question] ? "Replied" : "Reply"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {course} · {time}
                  </p>
                  {replies[question] && (
                    <p className="mt-2 text-sm leading-5 text-slate-600">
                      {replies[question]}
                    </p>
                  )}
                </button>
                {selectedQuestion === question && !replies[question] && (
                  <div className="mt-4">
                    <textarea
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      autoFocus
                      className="min-h-24 w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-blue"
                      placeholder="Write a helpful response..."
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedQuestion(null)}
                        className="border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => sendReply(question)}
                        className="bg-primary-blue px-3 py-2 text-xs font-bold text-white hover:bg-[#0b1735]"
                      >
                        Send reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LearnerProgressDetail({
  course,
  onBack,
}: {
  course: ReturnType<typeof getCourseData>[number]
  onBack: () => void
}) {
  const learners = [
    ["Ada N.", "ada@example.com", "92%", "Active"],

    ["Michael O.", "michael@example.com", "68%", "Active"],

    ["Sarah K.", "sarah@example.com", "100%", "Completed"],

    ["David A.", "david@example.com", "34%", "Needs attention"],

    ["Grace I.", "grace@example.com", "12%", "Started recently"],
  ]

  return (
    <div className="border border-slate-200 bg-white">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-bold text-primary-blue hover:underline"
          >
            ← Back to progress
          </button>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
            Learner progress
          </p>
          <h2 className="mt-1 text-xl font-black text-[#17213D]">
            {course.title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Review individual progress and identify learners who may need
            support.
          </p>
        </div>
        <button
          type="button"
          className="self-start border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-500"
        >
          Export report
        </button>
      </div>
      <div className="grid gap-px border-b border-slate-200 bg-slate-200 sm:grid-cols-3">
        <Metric
          label="Enrolled"
          value={course.students.toLocaleString()}
          detail="Learners"
        />
        <Metric
          label="Average progress"
          value="61%"
          detail="Across this course"
          positive
        />
        <Metric label="Completed" value="624" detail="Learners finished" />
      </div>
      <div className="divide-y divide-slate-100">
        {learners.map(([name, email, progress, status]) => (
          <div
            key={email}
            className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_180px_130px] sm:items-center sm:px-6"
          >
            <div>
              <p className="text-sm font-bold text-[#17213D]">{name}</p>
              <p className="mt-1 text-xs text-slate-500">{email}</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Progress</span>
                <span>{progress}</span>
              </div>
              <div className="mt-2 h-2 bg-slate-100">
                <div
                  className="h-full bg-primary-blue"
                  style={{ width: progress }}
                />
              </div>
            </div>
            <span
              className={`text-xs font-bold ${
                status === "Completed"
                  ? "text-emerald-600"
                  : status === "Needs attention"
                    ? "text-amber-600"
                    : "text-slate-500"
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Analytics() {
  return (
    <div className="space-y-7">
      <div className="border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
          Analytics
        </p>
        <h2 className="mt-1 text-xl font-black text-[#17213D]">
          Understand what is working
        </h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <Metric
            label="Landing page conversion"
            value="6.8%"
            detail="+1.2% vs last month"
            positive
          />
          <Metric
            label="Average completion"
            value="64%"
            detail="Across published courses"
          />
          <Metric
            label="Reviews this month"
            value="86"
            detail="4.8 average rating"
          />
        </div>
      </div>
      <div className="border border-slate-200 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-[#17213D]">Learner engagement</h3>
        <div className="mt-6 grid h-44 grid-cols-7 items-end gap-2 border-b border-l border-slate-200 px-3">
          {[38, 52, 46, 70, 63, 78, 88].map((height, index) => (
            <div
              key={index}
              className="bg-primary-blue/80"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Payouts() {
  const availableBalance = 684000

  const [withdrawOpen, setWithdrawOpen] = useState(false)

  const [amount, setAmount] = useState("")

  const [method, setMethod] = useState("Bank transfer")

  const [bankName, setBankName] = useState("")

  const [accountName, setAccountName] = useState("")

  const [accountNumber, setAccountNumber] = useState("")

  const [walletDetails, setWalletDetails] = useState("")

  const [withdrawalError, setWithdrawalError] = useState("")

  const [withdrawalSubmitted, setWithdrawalSubmitted] = useState(false)

  const submitWithdrawal = (event: React.FormEvent) => {
    event.preventDefault()

    const requestedAmount = Number(amount)

    if (!requestedAmount || requestedAmount < 5000) {
      setWithdrawalError("Enter an amount of at least ₦5,000.")

      return
    }

    if (requestedAmount > availableBalance) {
      setWithdrawalError(
        "The requested amount is higher than your available balance.",
      )

      return
    }

    if (method === "Bank transfer" && (!bankName || !accountName.trim() || !/^\d{10}$/.test(accountNumber))) {
      setWithdrawalError("Select your bank and enter a valid 10-digit account number and account name.")
      return
    }

    if (method === "USDT wallet" && !walletDetails.trim()) {
      setWithdrawalError("Add your USDT wallet address for this payout.")

      return
    }

    setWithdrawalError("")

    setWithdrawalSubmitted(true)
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-5 md:grid-cols-3">
        <Metric
          label="Available balance"
          value={formatNaira(availableBalance)}
          detail="Ready for withdrawal"
        />
        <Metric
          label="This month"
          value={formatNaira(218500)}
          detail="Processed Sep 1"
        />
        <Metric
          label="Lifetime earnings"
          value={formatNaira(7790000)}
          detail="Since joining"
        />
      </div>
      <div className="border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
              Withdraw earnings
            </p>
            <h2 className="mt-1 text-xl font-black text-[#17213D]">
              Get paid for your teaching
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Request your available balance by bank transfer or USDT wallet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setWithdrawOpen(true)
              setWithdrawalError("")
              setWithdrawalSubmitted(false)
            }}
            className="self-start bg-primary-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b1735]"
          >
            Withdraw money
          </button>
        </div>
        <div className="grid gap-4 px-5 py-5 text-sm text-slate-600 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="font-bold text-[#17213D]">Minimum withdrawal</p>
            <p className="mt-1">₦5,000</p>
          </div>
          <div>
            <p className="font-bold text-[#17213D]">Processing time</p>
            <p className="mt-1">1–3 business days</p>
          </div>
          <div>
            <p className="font-bold text-[#17213D]">Available now</p>
            <p className="mt-1 font-bold text-emerald-600">
              {formatNaira(availableBalance)}
            </p>
          </div>
        </div>
      </div>
      <div className="border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
            Payments
          </p>
          <h2 className="mt-1 text-xl font-black text-[#17213D]">
            Payout history
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            ["Sep 01, 2026", "₦218,500", "Paid"],
            ["Aug 01, 2026", "₦194,200", "Paid"],
            ["Jul 01, 2026", "₦176,850", "Paid"],
          ].map(([date, payoutAmount, status]) => (
            <div
              key={date}
              className="flex items-center justify-between px-5 py-4 sm:px-6"
            >
              <div>
                <p className="text-sm font-bold text-[#17213D]">{date}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Monthly instructor payout
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#17213D]">
                  {payoutAmount}
                </p>
                <p className="mt-1 text-xs font-bold text-emerald-600">
                  {status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {withdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17213D]/45 p-4">
          <div className="w-full max-w-lg border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            {withdrawalSubmitted ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
                  Request submitted
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#17213D]">
                  Your withdrawal is being processed
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  We will send {formatNaira(Number(amount))} to your{" "}
                  {method.toLowerCase()} within 1–3 business days.
                </p>
                <button
                  type="button"
                  onClick={() => setWithdrawOpen(false)}
                  className="mt-7 bg-primary-blue px-5 py-3 text-sm font-bold text-white hover:bg-[#0b1735]"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
                      Withdraw earnings
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-[#17213D]">
                      Request a payout
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithdrawOpen(false)}
                    className="text-2xl leading-none text-slate-400 hover:text-slate-700"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={submitWithdrawal} className="mt-6 space-y-4">
                  <label className="block text-sm font-bold text-slate-700">
                    Amount
                    <input
                      required
                      type="number"
                      min="5000"
                      max={availableBalance}
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="mt-2 w-full border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                      placeholder="Enter amount"
                    />
                  </label>
                  <label className="block text-sm font-bold text-slate-700">
                    Payout method
                    <select
                      value={method}
                      onChange={(event) => setMethod(event.target.value)}
                      className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-primary-blue"
                    >
                      <option>Bank transfer</option>
                      <option>USDT wallet</option>
                    </select>
                  </label>
                  {method === "Bank transfer" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm font-bold text-slate-700 sm:col-span-2">
                        Bank name
                        <select
                          required
                          value={bankName}
                          onChange={(event) => setBankName(event.target.value)}
                          className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-primary-blue"
                        >
                          <option value="">Select your bank</option>
                          {nigerianBanks.map((bank) => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-bold text-slate-700">
                        Account name
                        <input
                          required
                          value={accountName}
                          onChange={(event) => setAccountName(event.target.value)}
                          className="mt-2 w-full border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                          placeholder="Name on your bank account"
                        />
                      </label>
                      <label className="block text-sm font-bold text-slate-700">
                        Account number
                        <input
                          required
                          inputMode="numeric"
                          maxLength={10}
                          value={accountNumber}
                          onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="mt-2 w-full border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                          placeholder="10-digit account number"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="block text-sm font-bold text-slate-700">
                      USDT wallet address
                      <input
                        required
                        value={walletDetails}
                        onChange={(event) => setWalletDetails(event.target.value)}
                        className="mt-2 w-full border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                        placeholder="Enter your USDT wallet address"
                      />
                    </label>
                  )}
                  {withdrawalError && (
                    <p className="text-sm font-semibold text-red-600">
                      {withdrawalError}
                    </p>
                  )}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawOpen(false)}
                      className="border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b1735]"
                    >
                      Submit withdrawal
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({
  label,
  value,
  detail,
  positive = false,
}: {
  label: string
  value: string
  detail: string
  positive?: boolean
}) {
  return (
    <div className="border border-slate-200 bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-[#17213D]">{value}</p>
      <p
        className={`mt-2 text-xs font-semibold ${
          positive ? "text-emerald-600" : "text-slate-500"
        }`}
      >
        {detail}
      </p>
    </div>
  )
}

function Bar({
  label,
  value,
  amount,
  active = false,
}: {
  label: string
  value: string
  amount: string
  active?: boolean
}) {
  return (
    <div className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
      <span className="text-[10px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100">
        {amount}
      </span>
      <div
        className={`w-full max-w-9 ${
          active ? "bg-[#17213D]" : "bg-primary-blue/70"
        }`}
        style={{ height: value }}
      />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  )
}

function StatusRow({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 ${color}`} />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <span className="text-sm text-slate-500">{value}</span>
    </div>
  )
}

function CreateCourse({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("")

  const [category, setCategory] = useState("Development")

  const [description, setDescription] = useState("")

  const [price, setPrice] = useState("")

  const [cover, setCover] = useState<File | null>(null)

  const [lessons, setLessons] = useState([
    { title: "", video: null as File | null, materials: [] as File[] },
  ])

  const [saved, setSaved] = useState(false)

  const updateLesson = (
    index: number,
    update: Partial<typeof lessons[number]>,
  ) => {
    setLessons((current) =>
      current.map((lesson, lessonIndex) =>
        lessonIndex === index ? { ...lesson, ...update } : lesson,
      ),
    )
  }

  const addLesson = () => {
    setLessons((current) => [
      ...current,
      { title: "", video: null, materials: [] },
    ])
  }

  const createDraft = (event: React.FormEvent) => {
    event.preventDefault()

    if (!title.trim()) return

    setSaved(true)
  }

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17213D]/45 p-4">
        <div className="w-full max-w-lg border border-slate-200 bg-white p-7 shadow-2xl sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
            Draft saved
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#17213D]">
            Your course is ready for lessons
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {title} has been saved as a draft with {lessons.length} lesson{" "}
            {lessons.length === 1 ? "slot" : "slots"}. You can continue adding
            videos and materials from the course editor.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 bg-primary-blue px-5 py-3 text-sm font-bold text-white hover:bg-[#0b1735]"
          >
            Return to courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#17213D]/45 p-4">
      <form
        onSubmit={createDraft}
        className="mx-auto my-6 w-full max-w-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
              New course
            </p>
            <h2 className="mt-1 text-2xl font-black text-[#17213D]">
              Build your course
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Add the course basics, then upload each lesson video and its
              supporting materials.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-bold text-slate-700 md:col-span-2">
            Course title
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
              placeholder="e.g. Product design fundamentals"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-primary-blue"
            >
              <option>Development</option>
              <option>Design</option>
              <option>Business</option>
              <option>Marketing</option>
              <option>Data Science</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-slate-700">
            Price
            <input
              type="number"
              min="0"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-2 w-full border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
              placeholder="e.g. 25000"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700 md:col-span-2">
            Course description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 min-h-24 w-full resize-y border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
              placeholder="What will learners be able to do after this course?"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700 md:col-span-2">
            Cover image
            <span className="mt-2 flex cursor-pointer items-center justify-between border border-dashed border-slate-300 px-4 py-3 text-sm font-normal text-slate-500 hover:border-primary-blue">
              <span>{cover ? cover.name : "Choose a JPG or PNG image"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) => setCover(event.target.files?.[0] || null)}
                className="sr-only"
              />
            </span>
          </label>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#17213D]">
                Course lessons
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Upload a video and optional teaching materials for each lesson.
              </p>
            </div>
            <button
              type="button"
              onClick={addLesson}
              className="border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-slate-500"
            >
              Add lesson +
            </button>
          </div>
          <div className="mt-5 space-y-5">
            {lessons.map((lesson, index) => (
              <div key={index} className="border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">
                  Lesson {index + 1}
                </p>
                <input
                  value={lesson.title}
                  onChange={(event) =>
                    updateLesson(index, { title: event.target.value })
                  }
                  className="mt-3 w-full border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary-blue"
                  placeholder="Lesson title"
                />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-between border border-dashed border-slate-300 px-3 py-3 text-xs font-semibold text-slate-500 hover:border-primary-blue">
                    <span className="truncate">
                      {lesson.video ? lesson.video.name : "Upload lesson video"}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(event) =>
                        updateLesson(index, {
                          video: event.target.files?.[0] || null,
                        })
                      }
                      className="sr-only"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between border border-dashed border-slate-300 px-3 py-3 text-xs font-semibold text-slate-500 hover:border-primary-blue">
                    <span className="truncate">
                      {lesson.materials.length
                        ? `${lesson.materials.length} material file${
                            lesson.materials.length > 1 ? "s" : ""
                          }`
                        : "Upload PDFs or materials"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                      onChange={(event) =>
                        updateLesson(index, {
                          materials: Array.from(event.target.files || []),
                        })
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b1735]"
          >
            Create draft
          </button>
        </div>
      </form>
    </div>
  )
}

type CourseData = ReturnType<typeof getCourseData>

function getCourseData() {
  return COURSES.slice(0, 4).map((course, index) => ({
    ...course,

    status: courseStatuses[index % courseStatuses.length],

    students: [1840, 982, 316, 74][index],

    revenue: [4680000, 2415000, 785000, 0][index],

    rating: [4.9, 4.8, 4.7, 0][index],
  }))
}
