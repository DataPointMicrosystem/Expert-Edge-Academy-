import { Link } from "react-router"

const benefits = [
  {
    title: "Share what you know",
    description: "Turn your practical experience into clear, useful lessons that help learners move forward.",
  },
  {
    title: "Reach motivated learners",
    description: "Build an audience of people who are actively investing in their careers and skills.",
  },
  {
    title: "Grow your teaching business",
    description: "Create a course library, build credibility, and earn from your expertise over time.",
  },
]

export default function TeachOnExpertEdge() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#17213D]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-375 px-4 py-16 sm:px-6 lg:flex lg:items-end lg:justify-between lg:gap-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-blue">
              Teach on ExpertEdge
            </p>
            <h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-6xl">
              Your expertise can change someone’s next chapter.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              ExpertEdge Academy helps professionals turn hard-won knowledge into practical courses for learners building their futures.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup?role=instructor"
                className="bg-primary-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0b1735]"
              >
                Start teaching
              </Link>
              <Link
                to="/"
                className="border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-500"
              >
                Explore the academy
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-sm border-l-4 border-[#f5b94e] pl-6 lg:mt-0">
            <p className="font-display text-2xl font-bold leading-tight">
              Teach with purpose. Build with confidence.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Bring your point of view to a learning experience designed around real progress.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-375 px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-blue">
            Why ExpertEdge
          </p>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            A better place for useful knowledge.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The best courses do more than explain a topic. They give learners a path, a practice, and the confidence to apply what they have learned.
          </p>
        </div>
        <div className="mt-10 grid gap-px border border-slate-200 bg-slate-200 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="bg-white p-7">
              <h3 className="font-display text-xl font-bold">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0b1735] text-white">
        <div className="mx-auto max-w-375 px-4 py-14 sm:px-6 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f5c76a]">
              Ready when you are
            </p>
            <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
              Make your next lesson matter.
            </h2>
          </div>
          <Link
            to="/signup?role=instructor"
            className="mt-7 inline-block bg-white px-6 py-3 text-sm font-bold text-[#0b1735] transition-colors hover:bg-slate-100 lg:mt-0"
          >
            Create your facilitator account
          </Link>
        </div>
      </section>
    </main>
  )
}
