import { useState, useEffect } from 'react';
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
  Stethoscope,
  TrendingUp,
  CreditCard,
  Zap,
  Activity,
  ArrowUpRight,
  Lock,
  Heart,
  Check
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();

  // Calculator State
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [amount, setAmount] = useState<number>(1000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Live activity simulation toast for social proof vibrancy
  const [activeToast, setActiveToast] = useState(0);
  const liveActivities = [
    { name: 'Amidat H.', action: 'saved ₦2,500 to Health Ajo', time: 'Just now', badge: '🏥 Health Pool' },
    { name: 'Blessing O.', action: 'saved ₦1,500 to Health Ajo', time: '2 mins ago', badge: '🏥 Health Pool' },
    { name: 'Emmanuel K.', action: 'processed ₦10,000 emergency draw', time: '5 mins ago', badge: '💰 General Pool' },
    { name: 'Mrs. Adebayo', action: 'paid ₦2,000 via Reception Desk', time: '12 mins ago', badge: '📍 Walk-in' },
    { name: 'Dr. Megbuwawon', action: 'approved beneficiary claim', time: '18 mins ago', badge: '🛡️ Verified' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveToast((prev) => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Calculation Math
  const multiplier = frequency === 'daily' ? 30 : frequency === 'weekly' ? 4 : 1;
  const monthlyTotal = amount * multiplier;
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
    <div className="min-h-screen bg-[#FBF7EE] text-[#1C2826] font-sans selection:bg-[#B8452D] selection:text-white flex flex-col overflow-x-hidden">
      
      {/* 1. TOP NAVBAR WITH GLASS EFFECT */}
      <header className="sticky top-0 z-50 bg-[#FBF7EE]/80 backdrop-blur-xl border-b border-[#1F4D3D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 shadow-lg shadow-[#1F4D3D]/5 border border-[#1F4D3D]/10 group-hover:scale-105 transition-all">
              <OrangeHospitalLogo className="w-7 h-7 drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-tight text-lg sm:text-xl text-[#1F4D3D]">
                Orange Health <span className="text-[#B8452D]">Ajo</span>
              </span>
              <span className="text-[10px] text-[#1F4D3D]/70 font-mono tracking-wider uppercase font-semibold">
                Orange Hospital Cooperative
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1F4D3D]/80">
            <a href="#how-it-works" className="hover:text-[#B8452D] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#B8452D] transition-colors">Features</a>
            <a href="#calculator" className="hover:text-[#B8452D] transition-colors">Estimator</a>
            <a href="#faq" className="hover:text-[#B8452D] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={user.role === 'ADMIN' ? '/admin' : user.role === 'RECEPTIONIST' ? '/reception' : '/member'}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1F4D3D] text-white font-medium text-sm hover:bg-[#16382C] shadow-lg shadow-[#1F4D3D]/25 transition-all hover:scale-[1.02]"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-5 py-2.5 rounded-full text-[#1F4D3D] font-semibold text-sm hover:bg-[#1F4D3D]/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B8452D] text-white font-semibold text-sm hover:bg-[#9E3924] shadow-xl shadow-[#B8452D]/25 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>Join Ajo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. MODERN DRIBBBLE-STYLE HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
        {/* Organic Animated Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#B8452D]/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[#1F4D3D]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-[#1F4D3D]/15 shadow-sm text-xs font-semibold text-[#1F4D3D] backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Ajegunle's Registered Healthcare & Savings Scheme</span>
              </div>

              {/* Bold Display Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-[#1F4D3D] leading-[1.08] tracking-tight">
                Save Together. <br className="hidden sm:inline" />
                <span className="text-[#B8452D]">Heal Together.</span>
              </h1>

              <p className="text-base sm:text-xl text-[#1C2826]/75 max-w-xl font-normal leading-relaxed">
                Save daily or weekly. Get guaranteed medical bill subsidies at <strong className="font-semibold text-[#1F4D3D]">Orange Hospital</strong> while building flexible emergency cash reserves.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#B8452D] text-white font-bold text-base shadow-xl shadow-[#B8452D]/30 hover:bg-[#9E3924] transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <span>Start Your Ajo Fund</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white border border-[#1F4D3D]/15 text-[#1F4D3D] font-semibold text-base shadow-sm hover:bg-[#F3E8D2]/50 transition-all"
                >
                  <span>How it works</span>
                </a>
              </div>

              {/* Social Proof Pill */}
              <div className="pt-4 flex items-center gap-4 border-t border-[#1F4D3D]/10">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#B8452D] text-white font-bold flex items-center justify-center border-2 border-[#FBF7EE] text-xs shadow-sm">
                    AH
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#1F4D3D] text-white font-bold flex items-center justify-center border-2 border-[#FBF7EE] text-xs shadow-sm">
                    AO
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center border-2 border-[#FBF7EE] text-xs shadow-sm">
                    DM
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F4D3D]">Verified Community Savings</p>
                  <p className="text-[11px] text-[#1C2826]/60">Backed by Orange Hospital Medical Staff</p>
                </div>
              </div>

            </div>

            {/* Right Column: Dribbble-Style Interactive Hero Card */}
            <div className="lg:col-span-5 relative">
              
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1F4D3D]/20 to-[#B8452D]/20 rounded-3xl blur-2xl transform rotate-1 scale-105 pointer-events-none" />

              {/* Main Card */}
              <div className="relative bg-[#1F4D3D] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden">
                
                {/* Top Card Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                      <OrangeHospitalLogo className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-paper">Ajo Member Vault</h4>
                      <span className="text-[10px] text-emerald-300 font-mono">ACTIVE MEMBER LEDGER</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>

                {/* Balance Display */}
                <div className="py-6">
                  <span className="text-xs text-white/60 font-mono uppercase tracking-wider">Total Combined Savings</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <h2 className="text-4xl font-display font-extrabold text-white">₦145,000</h2>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12% this month
                    </span>
                  </div>
                </div>

                {/* Sub-Pool Split Visual (Dribbble Bento style) */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all">
                    <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
                      <span className="font-semibold flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5" /> Health Ajo
                      </span>
                      <span>50%</span>
                    </div>
                    <p className="text-xl font-bold font-display text-white">₦72,500</p>
                    <span className="text-[10px] text-white/60 mt-1 block">Orange Hosp. Subsidized</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all">
                    <div className="flex items-center justify-between text-xs text-amber-300 mb-1">
                      <span className="font-semibold flex items-center gap-1">
                        <PiggyBank className="w-3.5 h-3.5" /> General Ajo
                      </span>
                      <span>50%</span>
                    </div>
                    <p className="text-xl font-bold font-display text-white">₦72,500</p>
                    <span className="text-[10px] text-white/60 mt-1 block">Emergency Cash Draw</span>
                  </div>
                </div>

                {/* Live Activity Toast Box */}
                <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3 animate-fade-in">
                  <div className="w-9 h-9 rounded-xl bg-[#B8452D] text-white flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span className="font-medium text-amber-200">{liveActivities[activeToast].badge}</span>
                      <span>{liveActivities[activeToast].time}</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate">
                      {liveActivities[activeToast].name} {liveActivities[activeToast].action}
                    </p>
                  </div>
                </div>

              </div>

              {/* Floating Accent Card (Bottom Right) */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-[#1F4D3D]/10 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F4D3D]">Verified Care Partner</p>
                  <p className="text-[10px] text-[#1C2826]/70">Orange Hospital, Ajegunle</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. BENTO-GRID FEATURE HIGHLIGHTS */}
      <section id="features" className="py-20 bg-white border-y border-[#1F4D3D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B8452D] font-bold">Why Orange Health Ajo?</span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#1F4D3D] mt-2">
              Designed for Real Community Financial & Health Security
            </h2>
            <p className="text-[#1C2826]/75 mt-3 text-base">
              Modern digital convenience backed by real physical medical services at Orange Hospital.
            </p>
          </div>

          {/* Dribbble Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Dual Fund Split */}
            <div className="md:col-span-2 bg-[#FBF7EE] rounded-3xl p-8 border border-[#1F4D3D]/10 shadow-sm relative overflow-hidden group hover:border-[#1F4D3D]/30 transition-all">
              <div className="max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-[#1F4D3D] text-white flex items-center justify-center mb-6">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#1F4D3D]">
                  Automatic 50/50 Dual Fund Splitting
                </h3>
                <p className="text-sm text-[#1C2826]/75 mt-3 leading-relaxed">
                  Every contribution you make is instantly divided. Half builds up your medical bill subsidy pool at Orange Hospital, while the other half builds your emergency cash fund.
                </p>
              </div>

              <div className="mt-8 flex gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-[#1F4D3D]/10 text-xs font-semibold text-[#1F4D3D] shadow-sm">
                  🏥 Subsidized Medical Care
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white border border-[#1F4D3D]/10 text-xs font-semibold text-[#B8452D] shadow-sm">
                  💰 Flexible Cash Draw
                </span>
              </div>
            </div>

            {/* Bento Card 2: Physical Walk-in Support */}
            <div className="bg-[#1F4D3D] text-white rounded-3xl p-8 border border-white/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white">
                  Walk-in Cash Payments
                </h3>
                <p className="text-sm text-white/75 mt-3 leading-relaxed">
                  No smartphone? No problem. Visit our reception desk at Orange Hospital, Ajegunle to pay cash in person and get an instant digital receipt.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-mono">
                <span>24/7 Reception Desk</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

            {/* Bento Card 3: Online Paystack Payments */}
            <div className="bg-[#FBF7EE] rounded-3xl p-8 border border-[#1F4D3D]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#B8452D]/10 text-[#B8452D] flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1F4D3D]">
                  Instant Online Paystack Top-up
                </h3>
                <p className="text-sm text-[#1C2826]/75 mt-3 leading-relaxed">
                  Pay securely with debit card, bank transfer, or USSD directly from your phone.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#B8452D]">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit Encrypted Payments</span>
              </div>
            </div>

            {/* Bento Card 4: Beneficiary Protection */}
            <div className="md:col-span-2 bg-gradient-to-r from-[#16382C] to-[#1F4D3D] text-white rounded-3xl p-8 border border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> Next-of-Kin Security
                </div>
                <h3 className="text-2xl font-display font-bold text-white">
                  Full Beneficiary Claim Protection
                </h3>
                <p className="text-sm text-white/75 mt-2 leading-relaxed">
                  Your savings are legally protected. In any eventuality, your registered Next-of-Kin can claim your complete accumulated balance at Orange Hospital.
                </p>
              </div>

              <Link
                to="/signup"
                className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-[#1F4D3D] font-bold text-sm shadow-lg hover:bg-amber-100 transition-all"
              >
                Register Beneficiary
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 4. DYNAMIC INTERACTIVE SAVINGS ESTIMATOR */}
      <section id="calculator" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1F4D3D] via-[#16382C] to-[#0E241C] text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-white/10 relative overflow-hidden">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left: Simulator Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-semibold">Interactive Calculator</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-1">
                  Estimate Your Monthly Growth
                </h2>
                <p className="text-white/70 text-sm mt-2">
                  Select your contribution frequency and amount to see how fast your fund builds up.
                </p>
              </div>

              {/* Frequency Selector Tabs */}
              <div className="flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 max-w-xs">
                {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFrequency(tab)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                      frequency === tab
                        ? 'bg-[#B8452D] text-white shadow-md'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Slider Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80 font-medium">Contribution Amount:</span>
                  <span className="text-2xl font-display font-extrabold text-amber-300">
                    ₦{amount.toLocaleString()} <span className="text-xs font-normal text-white/60">/ {frequency}</span>
                  </span>
                </div>

                <input
                  type="range"
                  min={frequency === 'daily' ? 200 : frequency === 'weekly' ? 1000 : 5000}
                  max={frequency === 'daily' ? 10000 : frequency === 'weekly' ? 50000 : 200000}
                  step={frequency === 'daily' ? 200 : frequency === 'weekly' ? 1000 : 5000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#B8452D]"
                />
              </div>

              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#B8452D] text-white font-bold text-sm shadow-lg shadow-[#B8452D]/30 hover:bg-[#9E3924] transition-all"
                >
                  <span>Start Saving ₦{amount.toLocaleString()} Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Calculated Breakdown Display */}
            <div className="lg:col-span-6 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8">
              
              <span className="text-xs text-white/60 font-mono uppercase tracking-wider">Estimated 30-Day Total</span>
              <h3 className="text-4xl font-display font-extrabold text-white mt-1">
                ₦{monthlyTotal.toLocaleString()}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                
                {/* Health Share */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Stethoscope className="w-4 h-4" /> Health Ajo Pool (50%)
                  </div>
                  <p className="text-2xl font-display font-bold text-white mt-2">
                    ₦{healthShare.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-white/60 mt-1">
                    Covers hospital stays, consultations & medication at Orange Hospital.
                  </p>
                </div>

                {/* General Share */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <PiggyBank className="w-4 h-4" /> General Cash Pool (50%)
                  </div>
                  <p className="text-2xl font-display font-bold text-white mt-2">
                    ₦{generalShare.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-white/60 mt-1">
                    Available for emergency cash withdrawals when needed.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS STEPS */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B8452D] font-bold">Quick Start</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1F4D3D] mt-1">
            3 Simple Steps to Get Started
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-[#1F4D3D]/10 shadow-sm relative group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1F4D3D] text-white font-display font-bold text-xl flex items-center justify-center mb-6">
              01
            </div>
            <h3 className="text-xl font-display font-bold text-[#1F4D3D]">Create Your Account</h3>
            <p className="text-sm text-[#1C2826]/75 mt-3 leading-relaxed">
              Register online in under 2 minutes or let our Receptionist set up your account at Orange Hospital.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#1F4D3D]/10 shadow-sm relative group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#B8452D] text-white font-display font-bold text-xl flex items-center justify-center mb-6">
              02
            </div>
            <h3 className="text-xl font-display font-bold text-[#1F4D3D]">Make Contributions</h3>
            <p className="text-sm text-[#1C2826]/75 mt-3 leading-relaxed">
              Pay via Paystack online or bring cash to the reception desk. Every deposit is automatically split 50/50.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#1F4D3D]/10 shadow-sm relative group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-display font-bold text-xl flex items-center justify-center mb-6">
              03
            </div>
            <h3 className="text-xl font-display font-bold text-[#1F4D3D]">Enjoy Health & Cash Protection</h3>
            <p className="text-sm text-[#1C2826]/75 mt-3 leading-relaxed">
              Use your Health pool for medical treatment at Orange Hospital or request cash draws from your General pool.
            </p>
          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1F4D3D]/10 text-[#1F4D3D] mb-3">
            <HelpCircle className="w-4 h-4" />
            Questions & Answers
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

      {/* 7. FOOTER */}
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
              <h4 className="font-display font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><Link to="/login" className="hover:text-amber-200 transition-colors">Member Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-amber-200 transition-colors">Join Ajo Fund</Link></li>
                <li><Link to="/login" className="hover:text-amber-200 transition-colors">Receptionist Portal</Link></li>
                <li><Link to="/login" className="hover:text-amber-200 transition-colors">Admin Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white mb-4">Contact & Location</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Orange Hospital, Ajegunle, Lagos, Nigeria</span>
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
