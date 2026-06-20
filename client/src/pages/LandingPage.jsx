import { Link } from 'react-router-dom';
import { HardHat, ShieldCheck, BarChart3, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <HardHat className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-heading text-primary tracking-tight">BuildTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Sign in</Link>
            <Link to="/login" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-accent text-sm font-medium mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            v2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy-900 font-heading tracking-tight mb-6 animate-slide-up">
            Build smarter, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">finish faster.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            The all-in-one construction management platform. Track projects, manage massive workforces, control budgets, and generate real-time insights from site to office.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/login" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2">
              Access Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="text-slate-600 font-medium hover:text-primary px-8 py-4 transition-colors">
              Explore Features
            </a>
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="rounded-xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden bg-white/50 backdrop-blur-sm p-2">
              <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center relative">
                {/* Simulated Dashboard UI */}
                <div className="absolute inset-0 p-6 grid grid-cols-4 gap-4 opacity-50 pointer-events-none">
                   <div className="col-span-4 flex items-center justify-between mb-4">
                     <div className="w-48 h-8 bg-slate-200 rounded-md" />
                     <div className="w-10 h-10 bg-slate-200 rounded-full" />
                   </div>
                   <div className="col-span-1 h-32 bg-slate-200 rounded-xl" />
                   <div className="col-span-1 h-32 bg-slate-200 rounded-xl" />
                   <div className="col-span-1 h-32 bg-slate-200 rounded-xl" />
                   <div className="col-span-1 h-32 bg-slate-200 rounded-xl" />
                   <div className="col-span-3 h-64 bg-slate-200 rounded-xl" />
                   <div className="col-span-1 h-64 bg-slate-200 rounded-xl" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-10">
                   <Link to="/login" className="btn-primary shadow-lg shadow-primary/20">View Live Demo</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 font-heading mb-4">Everything you need on-site</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Designed specifically for Indian construction workflows, from daily wage tracking to heavy equipment management.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Mega-Project Scale', desc: 'Handle thousands of workers across multiple job sites with automated progress tracking.' },
              { icon: BarChart3, title: 'Real-time Budgets', desc: 'Track every rupee spent on materials, labor, and equipment against your total budget.' },
              { icon: Clock, title: 'Automated Payroll', desc: 'Compute monthly salaries and daily wages seamlessly using the attendance tracker.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-accent rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 font-heading mb-6">Built for accountability</h2>
            <ul className="space-y-4 mb-8">
              {[
                'Role-based dashboards for Admins, Managers, and Workers',
                'Worker skill and certification tracking',
                'Material inventory and low-stock alerts',
                'Subcontractor and PO management'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/login" className="btn-primary">Start managing today</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <div className="bg-slate-100 rounded-2xl aspect-square" />
              <div className="bg-blue-50 rounded-2xl aspect-square" />
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-2xl aspect-square" />
              <div className="bg-slate-100 rounded-2xl aspect-square" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 py-12 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HardHat className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold font-heading text-white">BuildTrack</span>
          </div>
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} BuildTrack Construction Management System. Final Year Submission.</p>
        </div>
      </footer>
    </div>
  );
}
