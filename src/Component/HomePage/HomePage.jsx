import React, { useState, useEffect, useRef } from "react";
import leafImg from "../../assets/leaf.png";
import HeroImg from "../../assets/2.png";
import ProduceList from "../../assets/process1.jpeg";
import ConnectWith from "../../assets/process2.jpeg";
import SecurePayment from "../../assets/process3.jpeg";
import { useNavigate } from "react-router-dom";
import { getTokenFromCookie } from "../../../helper";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Leaf,
  Warehouse,
  CloudSun,
  FileText,
  Shield,
  Bot,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Play,
  Sparkles,
  Zap,
  Globe,
  Award,
  HeartHandshake,
} from "lucide-react";

/* ─────────────── tiny helpers ─────────────── */
const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const y = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const x = direction === "left" ? 40 : direction === "right" ? -40 : 0;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AnimatedCounter = ({ target, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ""));
    let start = 0;
    const step = Math.ceil(num / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </span>
  );
};

/* ─────────────── data ─────────────── */
const NAV_LINKS = [
  { label: "Features",        href: "#features" },
  { label: "How It Works",    href: "#how-it-works" },
  { label: "Crop Advisory",   href: "/crop-advisory", route: true },
  { label: "Market Trends",   href: "/market-trends", route: true },
  { label: "Success Stories", href: "#success-stories" },
];

const STATS = [
  { value: "10000", suffix: "+", prefix: "", label: "Active Farmers", icon: Users },
  { value: "1000", suffix: "+", prefix: "", label: "Verified Buyers", icon: ShoppingBag },
  { value: "10", suffix: "Cr+", prefix: "₹", label: "Transactions", icon: TrendingUp },
  { value: "22", suffix: "", prefix: "", label: "States Covered", icon: Globe },
];

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Direct Marketplace",
    desc: "List your crops and connect directly with verified buyers across India. No middlemen — you keep more of every rupee.",
    color: "green",
    badge: "Core Feature",
  },
  {
    icon: Shield,
    title: "Escrow Payments",
    desc: "Funds are held securely until delivery is confirmed. Both farmers and buyers are protected every single transaction.",
    color: "blue",
    badge: "Secure",
  },
  {
    icon: FileText,
    title: "Smart Contracts",
    desc: "Digitally signed, blockchain-verified contracts prevent disputes and hold all parties legally accountable.",
    color: "purple",
    badge: "Verified",
  },
  {
    icon: TrendingUp,
    title: "AI Price Engine",
    desc: "Our AI analyses real-time mandi data, seasonal trends, and demand signals to suggest the perfect selling price.",
    color: "orange",
    badge: "AI Powered",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    desc: "Hyper-local forecasts, rain alerts, and crop-specific weather advisories to protect your harvest before it's too late.",
    color: "cyan",
    badge: "Real-time",
  },
  {
    icon: Leaf,
    title: "Crop Advisory Bot",
    desc: "AI-powered chatbot gives personalised crop recommendations based on your location, soil type, and current season.",
    color: "emerald",
    badge: "AI Advisory",
  },
  {
    icon: Warehouse,
    title: "Cold Storage Finder",
    desc: "Locate nearby certified cold storage facilities on a live map, check availability, and book in seconds.",
    color: "teal",
    badge: "New",
  },
  {
    icon: BarChart3,
    title: "Market Trends",
    desc: "Live mandi prices, historical charts, and forecast trends for 200+ crops so you always know the right time to sell.",
    color: "indigo",
    badge: "Live Data",
  },
  {
    icon: QrCode,
    title: "QR Crop Tracking",
    desc: "Generate QR codes for every batch. Buyers can instantly verify crop origin, quality certifications, and harvest details.",
    color: "rose",
    badge: "Traceability",
  },
];

const STEPS = [
  {
    number: "01",
    title: "List Your Produce",
    desc: "Add crop details, photos, and quantity. Our AI instantly suggests the best market price based on live mandi data.",
    img: ProduceList,
    color: "from-green-50 to-green-100",
    iconColor: "bg-green-500",
  },
  {
    number: "02",
    title: "Connect with Buyers",
    desc: "Receive direct offers from verified buyers across India. Negotiate, chat, and finalise deals without any middlemen.",
    img: ConnectWith,
    color: "from-blue-50 to-blue-100",
    iconColor: "bg-blue-500",
  },
  {
    number: "03",
    title: "Get Paid Securely",
    desc: "Funds are held in escrow and released instantly on delivery confirmation. Signed contracts protect both parties.",
    img: SecurePayment,
    color: "from-purple-50 to-purple-100",
    iconColor: "bg-purple-500",
  },
];

const FOR_USERS = [
  {
    role: "For Farmers",
    emoji: "🌾",
    gradient: "from-green-600 to-emerald-500",
    light: "bg-green-50",
    accent: "text-green-700",
    border: "border-green-200",
    points: [
      "Get fair prices — no middlemen cutting your profits",
      "AI-suggested pricing based on live mandi rates",
      "Secure escrow payments — you always get paid",
      "Digital smart contracts for every deal",
      "Weather alerts and personalised crop advisories",
      "Find and book cold storage near your farm",
      "QR code traceability to prove crop quality",
    ],
  },
  {
    role: "For Buyers",
    emoji: "🏪",
    gradient: "from-blue-600 to-indigo-500",
    light: "bg-blue-50",
    accent: "text-blue-700",
    border: "border-blue-200",
    points: [
      "Source fresh produce directly from verified farmers",
      "Transparent pricing with live market comparison",
      "Secure transactions with escrow protection",
      "Verified contracts — zero fraud, zero disputes",
      "QR scan to verify crop origin and quality",
      "Real-time market trend insights for smart buying",
      "Dedicated support via KisanMitra helpdesk",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    location: "Punjab",
    avatar: "RK",
    rating: 5,
    text: "AgriConnect helped me increase profits by 35% by connecting me directly with buyers. The AI price predictions saved me from selling my wheat at rock-bottom rates.",
  },
  {
    name: "Sunita Devi",
    location: "Maharashtra",
    avatar: "SD",
    rating: 5,
    text: "I used to depend on middlemen who gave me unfair prices. Now I negotiate directly with buyers and get paid immediately through the secure payment system.",
  },
  {
    name: "Prakash Singh",
    location: "Uttar Pradesh",
    avatar: "PS",
    rating: 5,
    text: "The weather alerts and AI crop advisories have been invaluable. I've reduced crop losses by 40% thanks to the timely, location-specific information.",
  },
  {
    name: "Anita Patel",
    location: "Gujarat",
    avatar: "AP",
    rating: 5,
    text: "Finding cold storage used to be a nightmare. The map feature helped me locate a facility 5 km from my farm and book it instantly. Game changer!",
  },
];

const PLATFORM_HIGHLIGHTS = [
  { icon: Sparkles, text: "AI-powered crop & price intelligence" },
  { icon: Zap, text: "Real-time market data for 200+ crops" },
  { icon: Award, text: "Blockchain-verified smart contracts" },
  { icon: HeartHandshake, text: "24/7 KisanMitra support bot" },
];

const COLOR_MAP = {
  green: { bg: "bg-green-100", text: "text-green-600", hover: "group-hover:bg-green-600", ring: "ring-green-200", badge: "bg-green-100 text-green-700" },
  blue: { bg: "bg-blue-100", text: "text-blue-600", hover: "group-hover:bg-blue-600", ring: "ring-blue-200", badge: "bg-blue-100 text-blue-700" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", hover: "group-hover:bg-purple-600", ring: "ring-purple-200", badge: "bg-purple-100 text-purple-700" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", hover: "group-hover:bg-orange-600", ring: "ring-orange-200", badge: "bg-orange-100 text-orange-700" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-600", hover: "group-hover:bg-cyan-600", ring: "ring-cyan-200", badge: "bg-cyan-100 text-cyan-700" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", hover: "group-hover:bg-emerald-600", ring: "ring-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  teal: { bg: "bg-teal-100", text: "text-teal-600", hover: "group-hover:bg-teal-600", ring: "ring-teal-200", badge: "bg-teal-100 text-teal-700" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", hover: "group-hover:bg-indigo-600", ring: "ring-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
  rose: { bg: "bg-rose-100", text: "text-rose-600", hover: "group-hover:bg-rose-600", ring: "ring-rose-200", badge: "bg-rose-100 text-rose-700" },
};

/* ─────────────── component ─────────────── */
const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    const timer = setInterval(
      () => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length),
      5000
    );
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(timer); };
  }, []);

  const goAuth = (view) => navigate("/auth", { state: { defaultView: view } });

  return (
    <div className="min-h-screen bg-white font-poppins overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={leafImg} width={28} alt="AgriConnect" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 font-bold text-xl">
              AgriConnect
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((item) => (
              item.route ? (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className={`text-sm font-medium relative group transition-colors duration-200 ${
                    isScrolled ? "text-gray-700 hover:text-green-600" : "text-gray-800 hover:text-green-600"
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-500 rounded-full transition-all duration-300 group-hover:w-full" />
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium relative group transition-colors duration-200 ${
                    isScrolled ? "text-gray-700 hover:text-green-600" : "text-gray-800 hover:text-green-600"
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-500 rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              )
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!getTokenFromCookie() && (
              <button
                onClick={() => goAuth("login")}
                className={`hidden md:block px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
                  isScrolled
                    ? "border-green-600 text-green-600 hover:bg-green-50"
                    : "border-green-700 text-green-700 hover:bg-green-50"
                }`}
              >
                Login
              </button>
            )}
            <button
              onClick={() => goAuth("signup")}
              className="px-5 py-2 text-sm font-semibold bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-current" />
                <span className="block w-5 h-0.5 bg-current" />
                <span className="block w-4 h-0.5 bg-current" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
            {NAV_LINKS.map((item) => (
              item.route ? (
                <button
                  key={item.label}
                  onClick={() => { setMenuOpen(false); navigate(item.href); }}
                  className="block w-full text-left text-gray-700 font-medium hover:text-green-600 py-1"
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-gray-700 font-medium hover:text-green-600 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <button onClick={() => goAuth("login")} className="w-full py-2.5 border border-green-600 text-green-600 rounded-lg font-medium text-sm">Login</button>
              <button onClick={() => goAuth("signup")} className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm">Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden pt-18">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-100 rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 border border-green-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
              </span>
              Trusted by 10,000+ farmers across India
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Empowering Farmers with{" "}
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                  Direct Market
                </span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9C50 3 100 1 150 4C200 7 250 9 298 6" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              Access
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
            >
              Connect directly with buyers, get AI-powered price guidance, secure
              contracts, real-time market insights and crop advisories — all in
              one platform built for Indian agriculture.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <button
                onClick={() => goAuth("signup")}
                className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-green-600 text-white rounded-full text-base font-semibold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Start Selling Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => goAuth("login")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 rounded-full text-base font-semibold hover:border-green-400 hover:text-green-700 transition-all duration-200"
              >
                <Play size={16} className="text-green-600" />
                Browse Marketplace
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {["No registration fees", "Instant payouts", "Fraud protection"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - hero image + floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={HeroImg}
                alt="Farmer using AgriConnect"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating stat card – active farmers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Users size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Active Farmers</p>
                <p className="text-xl font-bold text-gray-800">10,000+</p>
              </div>
              <div className="ml-2 flex h-2 w-2 rounded-full bg-green-500">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
              </div>
            </motion.div>

            {/* Floating stat card – transactions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <p className="text-xs text-gray-500 font-medium mb-1">Total Transactions</p>
              <p className="text-xl font-bold text-gray-800">₹10 Crore+</p>
              <div className="mt-2 flex gap-1">
                {[60, 80, 50, 90, 75, 95].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-green-500 rounded-full opacity-80"
                    style={{ height: `${h * 0.32}px` }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="absolute top-4 right-4 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
            >
              <Sparkles size={12} />
              AI-Powered Platform
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs text-gray-500 font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 border-2 border-gray-400 rounded-full flex items-start justify-center pt-1"
          >
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-white to-green-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 mb-3">
                      <Icon size={22} className="text-green-600" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                      <AnimatedCounter target={s.value} suffix={s.suffix} prefix={s.prefix} />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">{s.label}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PLATFORM HIGHLIGHTS STRIP ── */}
      <div className="bg-green-600 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-3">
            {PLATFORM_HIGHLIGHTS.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <Icon size={16} className="text-green-200" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              EVERYTHING YOU NEED
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Why Farmers Choose{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                AgriConnect
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From listing crops to getting paid — every tool a farmer and buyer
              needs is built into one seamless platform.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const c = COLOR_MAP[f.color];
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${c.bg} ${c.hover} transition-colors duration-300`}>
                        <Icon size={26} className={`${c.text} group-hover:text-white transition-colors duration-300`} />
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
                        {f.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{f.desc}</p>
                    <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn more <ChevronRight size={15} />
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              SIMPLE PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Sell Your Crops in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From farm to payment in minutes — no paperwork, no middlemen, no hassle.
            </p>
          </FadeIn>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-36 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 z-0" />

            <div className="grid lg:grid-cols-3 gap-10">
              {STEPS.map((step, i) => (
                <FadeIn key={i} delay={i * 0.15} direction="up">
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-white shadow-xl mb-6 ${step.iconColor} text-white text-2xl font-bold`}>
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{step.desc}</p>
                    <div className={`rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${step.color} p-2 w-full`}>
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-44 object-cover rounded-xl"
                      />
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR FARMERS & BUYERS ── */}
      <section id="for-farmers" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              FOR EVERYONE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Built for Both{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                Farmers & Buyers
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AgriConnect creates a fair ecosystem where farmers earn more and
              buyers source better quality produce at transparent prices.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-8">
            {FOR_USERS.map((user, i) => (
              <FadeIn key={i} delay={i * 0.15} direction={i === 0 ? "right" : "left"}>
                <div className={`rounded-3xl border ${user.border} ${user.light} p-8 h-full`}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${user.gradient} text-3xl shadow-lg`}>
                      {user.emoji}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${user.accent}`}>{user.role}</h3>
                      <p className="text-gray-500 text-sm">Everything you get on AgriConnect</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {user.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className={`mt-0.5 flex-shrink-0 ${user.accent}`} />
                        <span className="text-gray-700 text-sm leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => goAuth("signup")}
                    className={`mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r ${user.gradient} text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2`}
                  >
                    Join as {user.role.split(" ")[2] || (i === 0 ? "Farmer" : "Buyer")}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM DEEP DIVE ── */}
      <section className="py-24 bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <span className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-semibold mb-6">
                PLATFORM OVERVIEW
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                One Platform.<br />Infinite Possibilities.
              </h2>
              <p className="text-green-100 text-lg leading-relaxed mb-8">
                AgriConnect is not just a marketplace — it's a complete agricultural
                intelligence platform. From AI crop advisories and live mandi
                prices to cold storage booking and KisanMitra support, we cover
                every aspect of the farming journey.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Bot, text: "KisanMitra AI Support" },
                  { icon: BarChart3, text: "Live Market Trends" },
                  { icon: Warehouse, text: "Cold Storage Map" },
                  { icon: QrCode, text: "Crop QR Traceability" },
                  { icon: CloudSun, text: "Weather Forecasting" },
                  { icon: FileText, text: "Digital Contracts" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                    <Icon size={18} className="text-green-200 flex-shrink-0" />
                    <span className="text-white text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => goAuth("signup")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-green-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore the Platform <ArrowRight size={18} />
              </button>
            </FadeIn>

            <FadeIn direction="left" delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "200+", label: "Crops Tracked", icon: Leaf, bg: "bg-white/10" },
                  { num: "Real-time", label: "Price Updates", icon: TrendingUp, bg: "bg-white/10" },
                  { num: "99.9%", label: "Uptime SLA", icon: Zap, bg: "bg-white/10" },
                  { num: "AI", label: "Price Engine", icon: Sparkles, bg: "bg-white/10" },
                  { num: "₹0", label: "Hidden Charges", icon: Shield, bg: "bg-white/10" },
                  { num: "24/7", label: "KisanMitra Bot", icon: Bot, bg: "bg-white/10" },
                ].map(({ num, label, icon: Icon, bg }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className={`${bg} border border-white/20 rounded-2xl p-5 text-center backdrop-blur-sm`}
                  >
                    <Icon size={24} className="text-green-200 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{num}</div>
                    <div className="text-green-200 text-xs font-medium mt-1">{label}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="success-stories" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              SUCCESS STORIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Real Farmers,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                Real Results
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear directly from the farmers and buyers who transformed their
              agricultural business with AgriConnect.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`cursor-pointer bg-white rounded-2xl p-6 border-2 transition-all duration-300 ${
                  activeTestimonial === i
                    ? "border-green-400 shadow-xl scale-[1.02]"
                    : "border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-1"
                }`}
                whileHover={{ y: -4 }}
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={11} />
                      {t.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeTestimonial === i ? "w-8 bg-green-600" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-2">
              {/* Left */}
              <div className="p-10 lg:p-14 relative overflow-hidden">
                <div className="absolute -top-16 -left-16 w-48 h-48 bg-green-50 rounded-full" />
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-50 rounded-full" />
                <div className="relative z-10">
                  <FadeIn>
                    <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-5">
                      START TODAY — IT'S FREE
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      Ready to Transform Your Agriculture Business?
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Join thousands of farmers already earning more with direct
                      market access, AI-powered insights, and secure payments on
                      AgriConnect.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <button
                        onClick={() => goAuth("signup")}
                        className="flex items-center justify-center gap-2 px-7 py-3.5 bg-green-600 text-white rounded-full font-semibold shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                      >
                        Get Started Free <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => goAuth("login")}
                        className="flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:border-green-400 hover:text-green-700 transition-all duration-200"
                      >
                        Login to Account
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {["Zero setup fees", "Instant account activation", "Cancel anytime"].map((t) => (
                        <div key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                          <CheckCircle2 size={14} className="text-green-500" />
                          {t}
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                </div>
              </div>

              {/* Right – callback form */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-10 lg:p-14 flex items-center justify-center border-l border-gray-100">
                <FadeIn direction="left" className="w-full max-w-sm">
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Request a Call Back</h3>
                    <p className="text-gray-500 text-sm mb-6">Our team will reach you within 24 hours</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          placeholder="Your full name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
                        <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white">
                          <option>Farmer</option>
                          <option>Buyer / Trader</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <button className="w-full py-3.5 bg-green-600 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-200">
                        Request Call Back
                      </button>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-700 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-900 rounded-full opacity-10 blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src={leafImg} width={28} alt="AgriConnect" className="brightness-0 invert" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100 font-bold text-xl">
                  AgriConnect
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                Empowering Indian farmers with direct market access, AI-powered
                insights, and secure payments. Bridging the gap between farms
                and markets across 22 states.
              </p>
              <div className="flex gap-3">
                {["facebook", "twitter", "linkedin", "instagram"].map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                    aria-label={s}
                  >
                    <svg className="w-4 h-4 fill-current text-gray-400 hover:text-white" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-green-500 rounded-full inline-block" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {["Home", "Features", "How It Works", "Success Stories", "About Us"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                      <ChevronRight size={13} className="text-green-500" /> {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-green-500 rounded-full inline-block" />
                Platform
              </h4>
              <ul className="space-y-3">
                {["Marketplace", "Market Trends", "Crop Advisory", "Cold Storage", "Weather", "KisanMitra"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                      <ChevronRight size={13} className="text-green-500" /> {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-green-500 rounded-full inline-block" />
                Contact Us
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={15} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">123 Agriculture Lane, Digital District, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={15} className="text-green-400 flex-shrink-0" />
                  <a href="tel:+911234567890" className="text-gray-400 hover:text-white transition-colors">+91 1234567890</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={15} className="text-green-400 flex-shrink-0" />
                  <a href="mailto:support@agriconnect.com" className="text-gray-400 hover:text-white transition-colors">support@agriconnect.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 AgriConnect. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                <a key={l} href="#" className="text-gray-500 hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
