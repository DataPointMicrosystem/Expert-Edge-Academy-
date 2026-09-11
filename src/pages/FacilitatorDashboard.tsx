import { useMemo, useState } from "react"
import { Link, Navigate } from "react-router"
import { COURSES } from "../data/courses"
import { useAuth } from "../context/AuthContext"
import { formatNaira } from "../lib/money"
import expertedgeLogo from "../asset/expertedgeLogo.jpg"

type FacilitatorTab = "overview" | "courses" | "students" | "analytics" | "payouts"
type CourseStatus = "Published" | "Draft" | "In review"

const courseStatuses: CourseStatus[] = ["Published", "Draft", "In review"]

export default function FacilitatorDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<FacilitatorTab>("overview")
  const [courseFilter, setCourseFilter] = useState<"All" | CourseStatus>("All")
  const [createOpen, setCreateOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

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

  const tabs: { value: FacilitatorTab; label: string }[] = [
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
            <img src={expertedgeLogo} alt="ExpertEdge Academy" className="h-8 w-auto max-w-36 object-contain" />
            <span className="hidden border-l border-slate-200 pl-3 text-xs font-medium text-slate-500 sm:block">Facilitator studio</span>
          </Link>
          <div className="relative flex items-center gap-3">
            <Link to="/dashboard" className="hidden text-sm font-semibold text-slate-600 hover:text-[#17213D] sm:block">Learner dashboard</Link>
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              className="flex items-center gap-2 border-l border-slate-200 pl-3 text-left"
              aria-expanded={accountOpen}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17213D] text-sm font-bold text-white">{user.name[0]}</span>
              <span className="hidden sm:block"><span className="block max-w-32 truncate text-sm font-bold text-[#17213D]">{user.name}</span><span className="block text-xs text-slate-500">Facilitator account</span></span>
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-12 z-20 w-52 border border-slate-200 bg-white p-2 shadow-lg">
                <Link to="/dashboard" className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Open learner dashboard</Link>
                <button type="button" onClick={logout} className="block w-full px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Log out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-360 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-blue">Facilitator studio</p>
            <h1 className="mt-2 font-display text-3xl font-black text-[#17213D] sm:text-4xl">Good morning, {user.name}.</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your courses, understand your learners, and grow your teaching business.</p>
          </div>
          <button type="button" onClick={() => setCreateOpen(true)} className="bg-primary-blue px-5 py-3 text-sm font-bold text-white hover:bg-[#0b1735]">Create a course <span aria-hidden="true">+</span></button>
        </div>

        <div className="mt-7 flex gap-1 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => (
            <button key={tab.value} type="button" onClick={() => setActiveTab(tab.value)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition ${activeTab === tab.value ? "border-primary-blue text-[#17213D]" : "border-transparent text-slate-500 hover:text-[#17213D]"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <section className="pt-7">
          {activeTab === "overview" && <Overview courses={facilitatorCourses} onOpenCourses={() => setActiveTab("courses")} />}
          {activeTab === "courses" && <Courses courses={visibleCourses} filter={courseFilter} setFilter={setCourseFilter} onCreate={() => setCreateOpen(true)} />}
          {activeTab === "students" && <Students courses={facilitatorCourses} />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "payouts" && <Payouts />}
        </section>
      </div>

      {createOpen && <CreateCourse onClose={() => setCreateOpen(false)} />}
    </main>
  )
}

function Overview({ courses, onOpenCourses }: { courses: ReturnType<typeof getCourseData>; onOpenCourses: () => void }) {
  const published = courses.filter((course) => course.status === "Published")
  return (
    <div className="space-y-7">
      <div className="grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total students" value="3,212" detail="↑ 12.4% this month" positive />
        <Metric label="Course revenue" value={formatNaira(7790000)} detail="↑ 8.7% this month" positive />
        <Metric label="Average rating" value="4.86" detail="Across 2 published courses" />
        <Metric label="Profile visits" value="8,490" detail="Last 30 days" />
      </div>
      <div className="grid gap-7 lg:grid-cols-[1fr_310px]">
        <div className="border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">Performance</p><h2 className="mt-1 text-xl font-black text-[#17213D]">Revenue overview</h2></div><span className="text-xs font-semibold text-slate-500">Last 6 months</span></div>
          <div className="mt-6 flex h-52 items-end gap-3 border-b border-l border-slate-200 px-3 pb-0 pt-4 sm:gap-6"><Bar label="Apr" value="42%" amount="₦420k" /><Bar label="May" value="54%" amount="₦540k" /><Bar label="Jun" value="48%" amount="₦480k" /><Bar label="Jul" value="68%" amount="₦680k" /><Bar label="Aug" value="76%" amount="₦760k" /><Bar label="Sep" value="92%" amount="₦920k" active /></div>
        </div>
        <div className="border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">Your catalogue</p><h2 className="mt-1 text-xl font-black text-[#17213D]">Course status</h2></div><button type="button" onClick={onOpenCourses} className="text-xs font-bold text-primary-blue hover:underline">View all</button></div><div className="mt-6 space-y-4"><StatusRow label="Published" value={`${published.length} courses`} color="bg-emerald-500" /><StatusRow label="In review" value="1 course" color="bg-amber-500" /><StatusRow label="Drafts" value="1 course" color="bg-slate-400" /></div></div>
      </div>
      <div className="border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">Recent work</p><h2 className="mt-1 text-xl font-black text-[#17213D]">Your courses</h2></div><button type="button" onClick={onOpenCourses} className="text-sm font-bold text-primary-blue hover:underline">Manage courses</button></div><CourseTable courses={courses.slice(0, 3)} /></div>
    </div>
  )
}

function Courses({ courses, filter, setFilter, onCreate }: { courses: ReturnType<typeof getCourseData>; filter: "All" | CourseStatus; setFilter: (filter: "All" | CourseStatus) => void; onCreate: () => void }) {
  return <div className="border border-slate-200 bg-white"><div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">Catalogue</p><h2 className="mt-1 text-xl font-black text-[#17213D]">Manage your courses</h2></div><button type="button" onClick={onCreate} className="self-start bg-primary-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b1735]">New course +</button></div><div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-5 py-3 sm:px-6">{(["All", ...courseStatuses] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`px-3 py-1.5 text-xs font-bold ${filter === item ? "bg-[#17213D] text-white" : "text-slate-500 hover:bg-slate-100"}`}>{item}</button>)}</div><CourseTable courses={courses} /></div>
}

function CourseTable({ courses }: { courses: ReturnType<typeof getCourseData> }) {
  return <div className="divide-y divide-slate-100">{courses.map((course) => <article key={course.id} className="grid gap-4 px-5 py-5 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:px-6"><img src={`https://images.unsplash.com/${course.image}?w=480&h=270&fit=crop&auto=format`} alt="" className="h-24 w-full object-cover sm:h-20 sm:w-36" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`h-2 w-2 ${course.status === "Published" ? "bg-emerald-500" : course.status === "Draft" ? "bg-slate-400" : "bg-amber-500"}`} /><span className="text-xs font-bold text-slate-500">{course.status}</span></div><h3 className="mt-1 truncate font-bold text-[#17213D]">{course.title}</h3><p className="mt-1 text-xs text-slate-500">{course.students.toLocaleString()} students {course.rating ? `· ${course.rating} rating` : "· Not published yet"}</p></div><div className="flex items-center justify-between gap-5 sm:block sm:text-right"><p className="text-sm font-black text-[#17213D]">{formatNaira(course.revenue)}</p><button type="button" className="mt-1 text-xs font-bold text-primary-blue hover:underline">Edit course</button></div></article>)}</div>
}

function Students({ courses }: { courses: ReturnType<typeof getCourseData> }) {
  return <div className="grid gap-7 lg:grid-cols-[1fr_310px]"><div className="border border-slate-200 bg-white"><div className="border-b border-slate-100 px-5 py-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">Audience</p><h2 className="mt-1 text-xl font-black text-[#17213D]">Your students</h2><p className="mt-2 text-sm text-slate-500">See how learners are progressing through your courses.</p></div><div className="divide-y divide-slate-100">{["New enrolments this week", "Active learners", "Course completions", "Learner questions"].map((label, index) => <div key={label} className="flex items-center justify-between px-5 py-4 sm:px-6"><span className="text-sm font-semibold text-slate-700">{label}</span><span className="text-sm font-black text-[#17213D]">{[148, 1842, 624, 18][index].toLocaleString()}</span></div>)}</div></div><div className="border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">Top course</p><h2 className="mt-1 text-xl font-black text-[#17213D]">React Developer</h2><p className="mt-2 text-sm text-slate-500">{courses[0].students.toLocaleString()} enrolled learners</p><div className="mt-6 h-2 bg-slate-100"><div className="h-full w-4/5 bg-primary-blue" /></div><p className="mt-2 text-xs text-slate-500">80% of your total audience</p></div></div>
}

function Analytics() {
  return <div className="space-y-7"><div className="border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">Analytics</p><h2 className="mt-1 text-xl font-black text-[#17213D]">Understand what is working</h2><div className="mt-7 grid gap-5 md:grid-cols-3"><Metric label="Landing page conversion" value="6.8%" detail="+1.2% vs last month" positive /><Metric label="Average completion" value="64%" detail="Across published courses" /><Metric label="Reviews this month" value="86" detail="4.8 average rating" /></div></div><div className="border border-slate-200 bg-white p-5 sm:p-6"><h3 className="font-bold text-[#17213D]">Learner engagement</h3><div className="mt-6 grid h-44 grid-cols-7 items-end gap-2 border-b border-l border-slate-200 px-3">{[38, 52, 46, 70, 63, 78, 88].map((height, index) => <div key={index} className="bg-primary-blue/80" style={{ height: `${height}%` }} />)}</div></div></div>
}

function Payouts() {
  return <div className="space-y-7"><div className="grid gap-5 md:grid-cols-3"><Metric label="Available balance" value={formatNaira(684000)} detail="Ready for withdrawal" /><Metric label="This month" value={formatNaira(218500)} detail="Processed Sep 1" /><Metric label="Lifetime earnings" value={formatNaira(7790000)} detail="Since joining" /></div><div className="border border-slate-200 bg-white"><div className="border-b border-slate-100 px-5 py-5 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">Payments</p><h2 className="mt-1 text-xl font-black text-[#17213D]">Payout history</h2></div><div className="divide-y divide-slate-100">{[["Sep 01, 2026", "₦218,500", "Paid"], ["Aug 01, 2026", "₦194,200", "Paid"], ["Jul 01, 2026", "₦176,850", "Paid"]].map(([date, amount, status]) => <div key={date} className="flex items-center justify-between px-5 py-4 sm:px-6"><div><p className="text-sm font-bold text-[#17213D]">{date}</p><p className="mt-1 text-xs text-slate-500">Monthly instructor payout</p></div><div className="text-right"><p className="text-sm font-black text-[#17213D]">{amount}</p><p className="mt-1 text-xs font-bold text-emerald-600">{status}</p></div></div>)}</div></div></div>
}

function Metric({ label, value, detail, positive = false }: { label: string; value: string; detail: string; positive?: boolean }) {
  return <div className="border border-slate-200 bg-white p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-[#17213D]">{value}</p><p className={`mt-2 text-xs font-semibold ${positive ? "text-emerald-600" : "text-slate-500"}`}>{detail}</p></div>
}

function Bar({ label, value, amount, active = false }: { label: string; value: string; amount: string; active?: boolean }) {
  return <div className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100">{amount}</span><div className={`w-full max-w-9 ${active ? "bg-[#17213D]" : "bg-primary-blue/70"}`} style={{ height: value }} /><span className="text-[10px] text-slate-500">{label}</span></div>
}

function StatusRow({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className={`h-2 w-2 ${color}`} /><span className="text-sm font-semibold text-slate-700">{label}</span></div><span className="text-sm text-slate-500">{value}</span></div>
}

function CreateCourse({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17213D]/45 p-4"><div className="w-full max-w-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-blue">New course</p><h2 className="mt-1 text-2xl font-black text-[#17213D]">Start teaching</h2><p className="mt-2 text-sm text-slate-500">Set up the basics. You can add lessons and pricing next.</p></div><button type="button" onClick={onClose} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Close">×</button></div><label className="mt-7 block text-sm font-bold text-slate-700">Course title<input className="mt-2 w-full border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue" placeholder="e.g. Product design fundamentals" /></label><label className="mt-4 block text-sm font-bold text-slate-700">Category<select className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-primary-blue" defaultValue="Development"><option>Development</option><option>Design</option><option>Business</option><option>Marketing</option></select></label><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" onClick={onClose} className="bg-primary-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b1735]">Create draft</button></div></div></div>
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
