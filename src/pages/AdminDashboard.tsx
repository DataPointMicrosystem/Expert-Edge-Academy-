import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { learningApi } from "../lib/learningApi";
import { notify } from "../lib/notify";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return;
    Promise.all([
      learningApi.getAdminAnalytics(),
      learningApi.getAdminCourses(),
    ])
      .then(([analyticsResponse, coursesResponse]) => {
        setAnalytics(analyticsResponse.data);
        setCourses(coursesResponse.data || []);
      })
      .catch((requestError) => {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to load admin data.";
        setError(message);
        notify(message, "error");
      });
  }, [user?.role]);

  if (!user) return <Navigate to="/login?redirectTo=%2Fadmin" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  const review = async (courseId: string, approved: boolean) => {
    await learningApi.reviewCourse(courseId, { approved });
    notify(approved ? "Course approved." : "Course rejected.", "success");
    setCourses((current) =>
      current.map((course) =>
        course._id === courseId || course.id === courseId
          ? { ...course, status: approved ? "APPROVED" : "REJECTED" }
          : course,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-blue">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#0b1735]">
          Platform overview
        </h1>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Object.entries(analytics || {})
            .slice(0, 3)
            .map(([key, value]) => (
              <div key={key} className="border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {key}
                </p>
                <p className="mt-2 text-2xl font-black text-[#0b1735]">
                  {String(value)}
                </p>
              </div>
            ))}
        </div>
        <section className="mt-8 border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-black text-[#0b1735]">
              Course review queue
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {courses.map((course) => {
              const courseId = course._id || course.id;
              return (
                <div
                  key={courseId}
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-bold text-[#0b1735]">{course.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {course.status || "Unknown status"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => void review(courseId, true)}
                      className="bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => void review(courseId, false)}
                      className="bg-red-600 px-3 py-2 text-xs font-bold text-white"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
