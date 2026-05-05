"use client";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

 

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* NAV */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter">
         Seeklead
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.push("/login")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Se connecter
          </button>
          <button 
            onClick={() => router.push("/login")}
            className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm"
          >
            Essai gratuit
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-32 px-6 max-w-5xl mx-auto text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-500 mb-8 transition-all duration-700 'opacity-100' : 'opacity-0'}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Beta fermée — Accès prioritaire
        </div>

        <h1 className={`text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 transition-all duration-1000 delay-100 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Trouve tes clients freelance <br className="hidden md:block" />
          <span className="text-slate-400">sans jamais prospecter.</span>
        </h1>

        <p className={`text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-200 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Nous analysons LinkedIn en temps réel pour détecter les décideurs qui cherchent activement votre expertise.
        </p>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">
            Démarrer gratuitement
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            Voir la démo
          </button>
        </div>

        {/* MOCKUP SIMPLE */}
        <div className={`mt-24 relative transition-all duration-1000 delay-500  ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="absolute inset-0 bg-indigo-100 blur-3xl opacity-30 -z-10 rounded-full scale-75"></div>
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-left max-w-4xl mx-auto">
            <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              </div>
              <div className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Signals Dashboard</div>
            </div>
            
            <div className="p-8">
              {[
                { name: "Marie L.", role: "CEO @ Studio", signal: "Cherche freelance Webflow pour refonte urgente", score: "High Intent" },
                { name: "Thomas R.", role: "CTO @ SaaS", signal: "Besoin d'un renfort React.js sur 3 mois", score: "Verified" }
              ].map((lead, i) => (
                <div key={i} className="flex items-center justify-between py-5 border-b border-slate-50 last:border-0 group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      {lead.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{lead.name} <span className="font-normal text-slate-400 ml-2">{lead.role}</span></div>
                      <div className="text-sm text-slate-500 mt-1">{lead.signal}</div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                    {lead.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="border-t border-slate-100 py-12 px-8 text-center text-slate-400 text-sm">
        © 2026 IntentSignals — Fait pour les freelances exigeants.
      </footer>
    </div>
  );
}