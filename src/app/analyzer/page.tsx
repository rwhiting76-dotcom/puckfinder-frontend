import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hockey Shot Analyzer — AI-Powered Technique Coaching",
  description:
    "Analyze your hockey shot with AI. Get phase detection, weight transfer tracking, 8 scored metrics, and personalized coaching cues. Free and open source.",
  openGraph: {
    title: "Hockey Shot Analyzer — AI Technique Coaching",
    description:
      "Film your shot. Get instant scores, coaching cues, and targeted drills.",
    type: "website",
  },
};

export default function AnalyzerLanding() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="text-6xl mb-6">🏒</div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="text-blue-400">Hockey Shot</span> Analyzer
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
          Film your shot. Get instant scores, phase-by-phase breakdowns, and
          coaching cues — powered by AI pose tracking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://colab.research.google.com/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          >
            Try in Colab →
          </a>
          <a
            href="https://github.com/rwhiting76-dotcom/puckfinder/tree/main/hockey-analyzer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold border border-zinc-700 transition"
          >
            GitHub ↗
          </a>
        </div>
        <p className="text-sm text-zinc-500 mt-4">
          Free · Open source · No account needed
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: "📹",
                title: "Film your shot",
                desc: "Record a side-view video of your shot. Phone camera works great.",
              },
              {
                step: "2",
                icon: "🤖",
                title: "AI analyzes 8 metrics",
                desc: "MediaPipe tracks your skeleton through 4 shot phases — load, transfer, release, follow-through.",
              },
              {
                step: "3",
                icon: "📊",
                title: "Get your report",
                desc: "Scored metrics, radar chart, coaching cues, and targeted drills — plus an overlay video.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-sm text-blue-400 font-semibold mb-1">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-4">
            8 scored metrics
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Each metric is measured at the right moment in your shot and compared
            to professional standards.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                metric: "Elbow Extension",
                phase: "Release",
                desc: "Full arm extension at puck release — the #1 power generator.",
              },
              {
                metric: "Knee Bend",
                phase: "Load",
                desc: "How deep you load your legs before the shot. More bend = more power.",
              },
              {
                metric: "Weight Transfer",
                phase: "Transfer → Release",
                desc: "Lateral shift from back leg to front. Drives shot power and accuracy.",
              },
              {
                metric: "Transfer Timing",
                phase: "Transfer",
                desc: "When your weight shift peaks. Too early or late kills power.",
              },
              {
                metric: "Hip Angle",
                phase: "Release",
                desc: "Hips opening toward the target at release. Unlocks rotational power.",
              },
              {
                metric: "Shoulder Rotation",
                phase: "Load",
                desc: "Upper body coil before the shot. More rotation = more torque.",
              },
              {
                metric: "Stance Width",
                phase: "Setup",
                desc: "Foot positioning for balance and power generation.",
              },
              {
                metric: "Follow-Through",
                phase: "Post-Release",
                desc: "Arm extension after release. Ensures accuracy and consistency.",
              },
            ].map((item) => (
              <div
                key={item.metric}
                className="rounded-xl bg-zinc-900/70 border border-zinc-800 px-4 py-3"
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-white">{item.metric}</span>
                  <span className="text-xs text-blue-400">{item.phase}</span>
                </div>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">
            What you get
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                icon: "🎥",
                title: "Overlay Video",
                desc: "Your shot with color-coded skeleton, phase labels, and live angle readouts.",
              },
              {
                icon: "📄",
                title: "PDF Report",
                desc: "Full technique report with radar chart, angle charts, scores, and drills.",
              },
              {
                icon: "💡",
                title: "Coaching Cues",
                desc: "Specific feedback on what to fix — tied to the exact phase of your shot.",
              },
              {
                icon: "🏋️",
                title: "Targeted Drills",
                desc: "Practice drills matched to your weak areas. Quality over quantity.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="text-3xl shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to improve your shot?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            Film a side-view video of your shot, upload it, and get your full
            technique analysis in minutes. No account, no cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://colab.research.google.com/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
            >
              Start Analyzing →
            </a>
            <a
              href="https://github.com/rwhiting76-dotcom/puckfinder/tree/main/hockey-analyzer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold border border-zinc-700 transition"
            >
              View on GitHub ↗
            </a>
          </div>
          <p className="text-xs text-zinc-600 mt-6">
            Built with MediaPipe · Open source · MIT License
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 text-center text-zinc-600 text-xs py-6">
        <p>
          Hockey Shot Analyzer · Part of{" "}
          <a
            href="https://puckfinder.hockey"
            className="text-zinc-400 hover:text-blue-400 transition"
          >
            PuckFinder
          </a>{" "}
          · Made with 🏒
        </p>
      </footer>
    </div>
  );
}