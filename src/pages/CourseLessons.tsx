import { useState } from "react";
import { useParams, Link } from "react-router";
import { COURSES } from "../data/courses";

export default function CourseLessons() {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find((c) => c.id === id);
  const [activeSection, setActiveSection] = useState(0);
  const [activeLecture, setActiveLecture] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "qa" | "resources">("overview");
  const [completedLectures, setCompletedLectures] = useState<Set<number>>(new Set([1, 2]));

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1B1F3B]">
        <div className="text-center text-white">
          <div className="text-5xl mb-4">🎥</div>
          <h2 className="font-display font-bold text-2xl mb-3">Course not found</h2>
          <Link to="/" className="text-[#F5A623] underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const allLectures = course.sections.flatMap((s) => s.lectures);
  const currentLecture = course.sections[activeSection]?.lectures[activeLecture];
  const currentGlobalIdx = course.sections.slice(0, activeSection).reduce((sum, s) => sum + s.lectures.length, 0) + activeLecture;
  const totalLectures = allLectures.length;
  const progress = Math.round((completedLectures.size / totalLectures) * 100);

  const goNext = () => {
    const section = course.sections[activeSection];
    if (activeLecture < section.lectures.length - 1) {
      setActiveLecture((l) => l + 1);
    } else if (activeSection < course.sections.length - 1) {
      setActiveSection((s) => s + 1);
      setActiveLecture(0);
    }
  };

  const goPrev = () => {
    if (activeLecture > 0) {
      setActiveLecture((l) => l - 1);
    } else if (activeSection > 0) {
      setActiveSection((s) => s - 1);
      setActiveLecture(course.sections[activeSection - 1].lectures.length - 1);
    }
  };

  const toggleComplete = () => {
    setCompletedLectures((prev) => {
      const next = new Set(prev);
      if (next.has(currentGlobalIdx)) next.delete(currentGlobalIdx);
      else next.add(currentGlobalIdx);
      return next;
    });
  };

  const addNote = () => {
    if (noteText.trim()) {
      setNotes((prev) => [`[${currentLecture?.title}]: ${noteText.trim()}`, ...prev]);
      setNoteText("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0e1020] text-white overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 h-14 bg-[#1B1F3B] border-b border-white/10 flex items-center px-4 gap-4 z-20">
        <Link to={`/courses/${course.id}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-xs hidden sm:block">Back to course</span>
        </Link>

        <div className="w-px h-5 bg-white/20" />

        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/50 truncate">{course.title}</p>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F5A623] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-white/60 whitespace-nowrap">{progress}% complete</span>
        </div>

        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="ml-auto p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Toggle sidebar"
        >
          <svg className="w-5 h-5 text-white/70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video + content area */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
          {/* Video player */}
          <div className="bg-black shrink-0" style={{ aspectRatio: "16/9", maxHeight: "55vh" }}>
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={`https://images.unsplash.com/${course.image}?w=1200&h=675&fit=crop&auto=format&q=70`}
                alt="Course video"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                  <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <p className="text-white/80 text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full">
                  {currentLecture?.title || "Select a lecture"}
                </p>
              </div>

              {/* Video controls bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="w-full h-1 bg-white/30 rounded-full mb-2 cursor-pointer">
                  <div className="h-full w-1/3 bg-[#F5A623] rounded-full" />
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <button className="hover:text-white transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                  <span className="text-xs">4:22 / {currentLecture?.duration || "0:00"}</span>
                  <div className="flex-1" />
                  <button className="text-xs hover:text-white transition-colors">CC</button>
                  <button className="text-xs hover:text-white transition-colors">1x</button>
                  <button className="hover:text-white transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 000 2h11.586l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 00-1.414 1.414L14.586 4H3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Below video */}
          <div className="flex-1 overflow-y-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1B1F3B]">
              <button
                onClick={goPrev}
                disabled={activeSection === 0 && activeLecture === 0}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Previous
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleComplete}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                    completedLectures.has(currentGlobalIdx)
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 hover:bg-[#F5A623]/30"
                  }`}
                >
                  {completedLectures.has(currentGlobalIdx) ? "✓ Completed" : "Mark complete"}
                </button>
              </div>

              <button
                onClick={goNext}
                disabled={activeSection === course.sections.length - 1 && activeLecture === course.sections[activeSection].lectures.length - 1}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                Next
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="px-4 border-b border-white/10 bg-[#13172b] flex gap-1">
              {(["overview", "notes", "qa", "resources"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-xs font-semibold capitalize transition-colors border-b-2 ${
                    activeTab === tab
                      ? "border-[#F5A623] text-[#F5A623]"
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  {tab === "qa" ? "Q&A" : tab}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === "overview" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="font-display font-bold text-lg mb-2">
                      {currentLecture?.title || course.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">{course.description}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Duration", value: currentLecture?.duration || "—" },
                      { label: "Type", value: currentLecture?.type === "quiz" ? "📝 Quiz" : "🎥 Video" },
                      { label: "Section", value: course.sections[activeSection]?.title },
                      { label: "Progress", value: `${progress}%` },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">{stat.label}</p>
                        <p className="text-sm font-semibold text-white truncate">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note for this lecture…"
                      rows={3}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5A623]/50 resize-none"
                    />
                    <button
                      onClick={addNote}
                      className="self-end px-5 py-2 rounded-lg bg-[#F5A623] text-[#1B1F3B] text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      Save note
                    </button>
                  </div>
                  {notes.length === 0 ? (
                    <p className="text-white/30 text-sm text-center py-8">No notes yet. Add your first note above.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {notes.map((note, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                          <p className="text-sm text-white/80">{note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "qa" && (
                <div className="flex flex-col gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="text-sm text-white/60 mb-3">Have a question? Ask the instructor or community.</p>
                    <button className="px-5 py-2 rounded-lg bg-[#F5A623] text-[#1B1F3B] text-xs font-bold hover:opacity-90 transition-opacity">
                      Ask a question
                    </button>
                  </div>
                  {[
                    { q: "How do I set up the development environment on Windows?", a: "Great question! Check the pinned resource in Section 1 — there's a Windows setup guide included.", votes: 24 },
                    { q: "What's the difference between useState and useReducer?", a: "useState is best for simple, independent values. useReducer shines when state transitions depend on the previous state or involve multiple sub-values.", votes: 18 },
                  ].map((qa, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-sm font-semibold text-white mb-2">Q: {qa.q}</p>
                      <p className="text-xs text-white/60 leading-relaxed">A: {qa.a}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="flex items-center gap-1 text-xs text-white/40 hover:text-[#F5A623] transition-colors">
                          👍 {qa.votes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "resources" && (
                <div className="flex flex-col gap-3">
                  {[
                    { name: "Course source code (GitHub)", icon: "💾", size: "Repository" },
                    { name: "Section slides (PDF)", icon: "📑", size: "4.2 MB" },
                    { name: "Cheat sheet — Key concepts", icon: "📋", size: "1.1 MB" },
                    { name: "Recommended reading list", icon: "📚", size: "Document" },
                  ].map((r) => (
                    <div key={r.name} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors cursor-pointer">
                      <span className="text-xl">{r.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-white">{r.name}</p>
                        <p className="text-xs text-white/40">{r.size}</p>
                      </div>
                      <svg className="w-4 h-4 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — course content */}
        {sidebarOpen && (
          <div className="w-80 xl:w-96 shrink-0 flex flex-col border-l border-white/10 bg-[#13172b] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Course content</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F5A623] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-white/50">{progress}%</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {course.sections.map((section, si) => (
                <div key={si}>
                  <button
                    onClick={() => setActiveSection(si)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors ${activeSection === si ? "bg-white/5" : ""}`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{section.title}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {section.lectures.filter((l) => {
                          const gIdx = course.sections.slice(0, si).reduce((s, sec) => s + sec.lectures.length, 0) + section.lectures.indexOf(l);
                          return completedLectures.has(gIdx);
                        }).length}/{section.lectures.length} completed
                      </p>
                    </div>
                    <svg className={`w-3.5 h-3.5 text-white/40 transition-transform ${activeSection === si ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {activeSection === si && (
                    <div>
                      {section.lectures.map((lecture, li) => {
                        const gIdx = course.sections.slice(0, si).reduce((s, sec) => s + sec.lectures.length, 0) + li;
                        const done = completedLectures.has(gIdx);
                        const active = si === activeSection && li === activeLecture;
                        return (
                          <button
                            key={lecture.id}
                            onClick={() => { setActiveSection(si); setActiveLecture(li); }}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 border-l-2 transition-all ${
                              active ? "bg-[#F5A623]/10 border-[#F5A623]" : "border-transparent hover:bg-white/5"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              done ? "bg-green-500 border-green-500" : active ? "border-[#F5A623]" : "border-white/20"
                            }`}>
                              {done && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                  <path d="M2 6l3 3 5-5" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-snug ${active ? "text-[#F5A623] font-semibold" : done ? "text-white/40" : "text-white/80"}`}>
                                {lecture.title}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                {lecture.type === "quiz" ? <span className="text-[9px] text-white/30">📝 Quiz</span> : <span className="text-[9px] text-white/30">🎥</span>}
                                <span className="text-[10px] text-white/30">{lecture.duration}</span>
                                {lecture.free && <span className="text-[9px] text-[#F5A623]/60 font-bold">FREE</span>}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
