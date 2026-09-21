import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OrangeHospitalLogo, PoweredByOrangeHospital } from '../components/OrangeHospitalLogo';
import {
  ShieldCheck,
  HeartPulse,
  PiggyBank,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Clock,
  Coins,
  Stethoscope
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();
  const [dailyContribution, setDailyContribution] = useState<number>(1000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Derived calculation for quick savings estimate
  const monthlyTotal = dailyContribution * 30;
  const healthShare = Math.round(monthlyTotal * 0.5);
  const generalShare = Math.round(monthlyTotal * 0.5);

  const faqs = [
    {
      q: 'How does Orange Health Ajo differ from traditional Ajo?',
      a: 'Traditional Ajo is purely financial. Orange Health Ajo splits your contribution into two pools: Health Ajo (which provides subsidized medical care at Orange Hospital) and General Ajo (which provides flexible emergency cash draws).'
    },
    {
      q: 'What if I don\'t have a smartphone or internet access?',
      a: 'No problem! You can walk into Orange Hospital in Ajegunle, Lagos and pay cash directly to our registered Receptionists. They will issue an instant receipt and update your savings ledger on the spot.'
    },
    {
      q: 'How do I use my Health Ajo when I fall sick?',
      a: 'Simply present your registered phone number or Member ID at Orange Hospital reception. Your bill will be automatically offset against your accumulated Health Ajo pool and eligible medical subsidies.'
    },
    {
      q: 'Can I withdraw my money if I have an emergency?',
      a: 'Yes. You can request an emergency cash draw from your General Ajo pool at any time through your dashboard or at the reception desk. Admin approvals are processed quickly.'
    },
    {
      q: 'What happens to my savings in case of death?',
      a: 'Your registered Next-of-Kin can file a beneficiary claim at Orange Hospital. Once verified by the Admin, the full balance is paid to your designated beneficiary.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-[#1C2826] font-sans selection:bg-[#B8452D] selection:text-white flex flex-col">
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-[#FBF7EE]/90 backdrop-blur-md border-b border-[#1F4D3D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md border border-[#1F4D3D]/10 group-hover:scale-105 transition-transform">
              <OrangeHospitalLogo className="w-8 h-8 drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-tight text-lg sm:text-xl text-[#1F4D3D]">
                Orange Health <span className="text-[#B8452D]">Ajo</span>
              </span>
              <span className="text-[10px] text-[#1F4D3D]/70 font-mono tracking-wider uppercase font-medium">
                Powered by Orange Hospital
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1F4D3D]/80">
            <a href="#how-it-works" className="hover:text-[#B8452D] transition-colors">How It Works</a>
            <a href="#plans" className="hover:text-[#B8452D] transition-colors">Savings Pools</a>
            <a href="#calculator" className="hover:text-[#B8452D] transition-colors">Calculator</a>
            <a href="#faq" className="hover:text-[#B8452D] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={user.role === 'ADMIN' ? '/admin' : user.role === 'RECEPTIONIST' ? '/reception' : '/member'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1F4D3D] text-white font-medium text-sm hover:bg-[#16382C] shadow-lg shadow-[#1F4D3D]/20 transition-all hover:scale-[1.02]"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 sm:px-5 py-2.5 rounded-full border border-[#1F4D3D]/20 text-[#1F4D3D] font-medium text-sm hover:bg-[#1F4D3D]/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B8452D] text-white font-medium text-sm hover:bg-[#9E3924] shadow-lg shadow-[#B8452D]/20 transition-all hover:scale-[1.02]"
                >
                  <span>Join Ajo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#B8452D]/10 via-[#1F4D3D]/10 to-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F4D3D]/10 border border-[#1F4D3D]/15 text-[#1F4D3D] text-xs sm:text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[#52B848] animate-pulse" />
            <span>Official Healthcare & Thrift Savings Cooperative • Ajegunle, Lagos</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-[#1F4D3D] max-w-4xl mx-auto leading-[1.15]">
            Save Together. <br className="hidden sm:inline" />
            <span className="text-[#B8452D]">Heal Together.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#1C2826]/80 max-w-2xl mx-auto font-normal leading-relaxed">
            The community fund Ajegunle trusts, now digital. Save daily or weekly for guaranteed medical bill coverage at Orange Hospital and quick emergency cash draws.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#B8452D] text-white font-semibold text-base shadow-xl shadow-[#B8452D]/25 hover:bg-[#9E3924] transition-all hover:-translate-y-0.5"
            >
              <span>Start Saving Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-[#1F4D3D]/20 text-[#1F4D3D] font-semibold text-base shadow-sm hover:bg-[#F3E8D2]/40 transition-all"
            >
              <Users className="w-5 h-5 text-[#1F4D3D]" />
              <span>Member Portal Login</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#1F4D3D]/10 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-[#1F4D3D]/10 flex items-center justify-center text-[#1F4D3D] mb-3">
                <HeartPulse className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-display text-[#1F4D3D]">100%</p>
              <p className="text-xs text-[#1C2826]/70 mt-1">Medical Care Backing at Orange Hospital</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#1F4D3D]/10 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-[#B8452D]/10 flex items-center justify-center text-[#B8452D] mb-3">
                <PiggyBank className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-display text-[#B8452D]">Dual Pools</p>
              <p className="text-xs text-[#1C2826]/70 mt-1">Health Coverage + Flexible Cash Draws</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#1F4D3D]/10 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700 mb-3">
                <Coins className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-display text-[#1F4D3D]">Cash or Online</p>
              <p className="text-xs text-[#1C2826]/70 mt-1">Pay via Paystack or Reception Desk</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#1F4D3D]/10 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-700 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-display text-[#1F4D3D]">Beneficiary</p>
              <p className="text-xs text-[#1C2826]/70 mt-1">Full Next-of-Kin Claim Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL SAVINGS POOLS (HEALTH VS GENERAL) */}
      <section id="plans" className="py-20 bg-[#1F4D3D] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-amber-200 border border-white/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Smart Dual-Account System
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-paper">
              One Contribution. Two Protective Pools.
            </h2>
            <p className="mt-4 text-white/80 text-base sm:text-lg">
              Every amount you save is split into two specialized funds designed to protect both your health and financial security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Health Ajo Card */}
            <div className="bg-white/5 border border-white/15 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between hover:border-emerald-400/40 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-6">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase text-emerald-300 font-semibold">
                  Fund Pool #1
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  🏥 Health Ajo Pool
                </h3>
                <p className="text-white/70 text-sm mt-3 leading-relaxed">
                  Dedicated strictly to medical bill coverage, consultations, prescriptions, and treatments at Orange Hospital.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-white/90">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Direct medical bill offset at Orange Hospital reception.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Subsidized community care rates for active members.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Covers emergency care, maternity, and outpatient treatments.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/60">Primary Purpose</span>
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Medical Bill Protection
                </span>
              </div>
            </div>

            {/* General Ajo Card */}
            <div className="bg-white/5 border border-white/15 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between hover:border-amber-400/40 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-6">
                  <PiggyBank className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase text-amber-300 font-semibold">
                  Fund Pool #2
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  💰 General Ajo Pool
                </h3>
                <p className="text-white/70 text-sm mt-3 leading-relaxed">
                  Your personal emergency liquidity pool. Draw cash when urgent personal needs arise with quick admin verification.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-white/90">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Emergency cash draw requests available anytime.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Fast payout to your bank account or cash pick-up at reception.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Beneficiary claim protection for Next-of-Kin.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/60">Primary Purpose</span>
                <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Emergency Cash Draws
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B8452D] font-bold">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1F4D3D] mt-2">
            How Orange Health Ajo Works
          </h2>
          <p className="text-[#1C2826]/75 mt-3 text-base">
            Designed for everyday convenience — register in minutes online or in person at Orange Hospital.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#1F4D3D]/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-[#1F4D3D] text-white flex items-center justify-center font-display font-bold text-xl mb-6">
              1
            </div>
            <h3 className="text-xl font-display font-bold text-[#1F4D3D]">Register Your Profile</h3>
            <p className="text-sm text-[#1C2826]/70 mt-3 leading-relaxed">
              Create your account with your phone number online, or let our Reception desk set it up for you in 2 minutes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#1F4D3D]/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-[#B8452D] text-white flex items-center justify-center font-display font-bold text-xl mb-6">
              2
            </div>
            <h3 className="text-xl font-display font-bold text-[#1F4D3D]">Contribute Daily or Weekly</h3>
            <p className="text-sm text-[#1C2826]/70 mt-3 leading-relaxed">
              Pay seamlessly online using Paystack or bring cash to the Orange Hospital reception desk whenever you visit.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#1F4D3D]/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-[#52B848] text-white flex items-center justify-center font-display font-bold text-xl mb-6">
              3
            </div>
            <h3 className="text-xl font-display font-bold text-[#1F4D3D]">Access Care & Cash Draws</h3>
            <p className="text-sm text-[#1C2826]/70 mt-3 leading-relaxed">
              Use your Health Ajo balance for hospital treatment, or request an emergency cash draw from your General Ajo pool.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SAVINGS ESTIMATOR CALCULATOR */}
      <section id="calculator" className="py-16 bg-[#F3E8D2]/60 border-y border-[#1F4D3D]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#1F4D3D]/10 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1F4D3D]/10 text-[#1F4D3D] flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#1F4D3D]">
                  Quick Savings Estimator
                </h3>
                <p className="text-xs text-[#1C2826]/70">
                  See how your daily savings build up over 30 days.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#1C2826]">
                    Select Daily Contribution:
                  </label>
                  <span className="text-xl font-display font-bold text-[#B8452D]">
                    ₦{dailyContribution.toLocaleString()} / day
                  </span>
                </div>

                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="200"
                  value={dailyContribution}
                  onChange={(e) => setDailyContribution(Number(e.target.value))}
                  className="w-full h-3 bg-[#F3E8D2] rounded-lg appearance-none cursor-pointer accent-[#B8452D]"
                />

                <div className="flex justify-between text-[11px] text-[#1C2826]/50 mt-1 font-mono">
                  <span>₦200/day</span>
                  <span>₦1,000/day</span>
                  <span>₦5,000/day</span>
                  <span>₦10,000/day</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1F4D3D]/10">
                <div className="p-4 rounded-2xl bg-[#FBF7EE] border border-[#1F4D3D]/10">
                  <span className="text-xs text-[#1C2826]/70 font-medium">Total Monthly Savings</span>
                  <p className="text-2xl font-display font-bold text-[#1F4D3D] mt-1">
                    ₦{monthlyTotal.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-medium">🏥 Health Pool (50%)</span>
                  <p className="text-2xl font-display font-bold text-emerald-700 mt-1">
                    ₦{healthShare.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs text-amber-800 font-medium">💰 General Cash Pool (50%)</span>
                  <p className="text-2xl font-display font-bold text-amber-700 mt-1">
                    ₦{generalShare.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & HOSPITAL BACKING */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1F4D3D] to-[#123126] rounded-3xl text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <PoweredByOrangeHospital theme="dark" className="mb-6" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-paper leading-tight">
              Backed by Orange Hospital & Medical Professionals in Ajegunle
            </h2>
            <p className="mt-4 text-white/80 text-base leading-relaxed">
              Unlike anonymous online apps, Orange Health Ajo is directly connected to Orange Hospital medical staff, led by Dr. Adekunle Megbuwawon. Your contributions are securely tracked, transparently managed, and physically accessible whenever you walk into our clinic.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-300" />
                <span>Physical Hospital Premises</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-300" />
                <span>On-Site Reception Support</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Verified Beneficiary Claims</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1F4D3D]/10 text-[#1F4D3D] mb-3">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1F4D3D]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#1F4D3D]/10 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between font-display font-semibold text-lg text-[#1F4D3D] hover:bg-[#FBF7EE]/50 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#B8452D] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#1F4D3D]/50 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-6 pb-5 text-sm text-[#1C2826]/75 leading-relaxed border-t border-[#1F4D3D]/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="mt-auto bg-[#16382C] text-white border-t border-white/10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                  <OrangeHospitalLogo className="w-7 h-7" />
                </div>
                <span className="font-display font-bold text-xl text-paper">
                  Orange Health <span className="text-amber-300">Ajo</span>
                </span>
              </div>
              <p className="text-white/70 text-sm max-w-sm leading-relaxed">
                Combining traditional community thrift savings with reliable healthcare protection. Powered by Orange Hospital, Ajegunle, Lagos.
              </p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white mb-4">Quick Navigation</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><Link to="/login" className="hover:text-amber-200 transition-colors">Member Login</Link></li>
                <li><Link to="/signup" className="hover:text-amber-200 transition-colors">Join Ajo Scheme</Link></li>
                <li><Link to="/login" className="hover:text-amber-200 transition-colors">Receptionist Portal</Link></li>
                <li><Link to="/login" className="hover:text-amber-200 transition-colors">Admin Access</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white mb-4">Hospital Contact</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Orange Hospital Premises, Ajegunle, Lagos, Nigeria</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>+234 800 ORANGE AJO</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Walk-in Reception: 24/7 Care</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
            <p>© {new Date().getFullYear()} Orange Health Ajo • All Rights Reserved.</p>
            <PoweredByOrangeHospital theme="dark" />
          </div>
        </div>
      </footer>
    </div>
  );
}
