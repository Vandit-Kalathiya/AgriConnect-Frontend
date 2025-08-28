import React, { useState, useEffect } from "react";
import leafImg from "../../assets/leaf.png";
import HeroImg from "../../assets/2.png";
import { useNavigate } from "react-router-dom";
import ProduceList from "../../assets/process1.jpeg";
import ConnectWith from "../../assets/process2.jpeg";
import SecurePayment from "../../assets/process3.jpeg";
import { getTokenFromCookie } from "../../../helper";

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Auto-advance testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Punjab",
      image: "/api/placeholder/60/60",
      text: "AgriConnect helped me increase my profits by 35% by connecting me directly with buyers. The price predictions saved me from selling my wheat at low rates.",
    },
    {
      name: "Sunita Devi",
      location: "Maharashtra",
      image: "/api/placeholder/60/60",
      text: "I used to depend on middlemen who gave me unfair prices. Through AgriConnect, I now negotiate directly with buyers and get paid immediately through the secure payment system.",
    },
    {
      name: "Prakash Singh",
      location: "Uttar Pradesh",
      image: "/api/placeholder/60/60",
      text: "The weather alerts and crop advisories have been invaluable for my farm planning. I've reduced crop losses by 40% thanks to the timely information.",
    },
  ];

  const features = [
    {
      title: "Direct Market Access",
      icon: "🏪",
      description: "Connect directly with buyers and eliminate intermediaries",
    },
    {
      title: "Secure Payments",
      icon: "🔐",
      description: "Escrow-based payment system ensures you always get paid",
    },
    {
      title: "Smart Contracts",
      icon: "📝",
      description: "Blockchain-verified contracts prevent fraud and disputes",
    },
    {
      title: "AI Price Predictions",
      icon: "📈",
      description: "Get AI-powered price suggestions for maximum profit",
    },
    {
      title: "Weather Alerts",
      icon: "🌦️",
      description: "Real-time weather updates to protect your crops",
    },
    {
      title: "Crop Advisory",
      icon: "🌱",
      description: "Personalized advice for better yield and crop health",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Farmers" },
    { value: "1,000+", label: "Buyers" },
    { value: "₹10Cr+", label: "Transactions" },
    { value: "22", label: "States Covered" },
  ];

  const handleLoginClick = () => {
    navigate("/auth", { state: { defaultView: "login" } });
  };

  const handleGetStartedClick = () => {
    navigate("/auth", { state: { defaultView: "signup" } });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 px-16 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-green-600 font-bold text-2xl flex gap-x-2 items-center">
              <img
                src={leafImg}
                width={30}
                alt="AgriConnect Logo"
                className={`transition-all duration-500 ${
                  isScrolled ? "transform rotate-12" : ""
                }`}
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                AgriConnect
              </span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {["Features", "How It Works", "Success Stories", "Contact"].map(
              (item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-gray-600 hover:text-green-600 font-medium relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              )
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {!getTokenFromCookie() ? (
              <button
                className="hidden md:block px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                onClick={handleLoginClick}
              >
                Login
              </button>
            ) : (
              ""
            )}
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={handleGetStartedClick}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 px-12 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -left-20 bottom-10 w-80 h-80 bg-green-300 rounded-full opacity-40 blur-3xl"></div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="max-w-xl">
            <div className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 animate-pulse">
              Trusted by 1000+ farmers across India
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
              Empowering Farmers with{" "}
              <span className="text-green-600 relative">
                Direct Market Access
                <span className="absolute bottom-2 left-0 w-full h-3 bg-green-100 -z-10"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Connect directly with buyers, get fair prices, secure contracts,
              and real-time market insights all in one platform.
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg font-medium">
                Start Selling
              </button>
              <button className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all text-lg font-medium">
                Browse Marketplace
              </button>
            </div> */}
            <div className="mt-8 flex items-center text-gray-500">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No middlemen, higher profits, secure payments</span>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute -z-10 w-full h-full bg-green-200 rounded-full blur-3xl opacity-30 transform -translate-y-10"></div>
            <img
              src={HeroImg}
              alt="Farmers using AgriConnect"
              className="rounded-2xl object-cover transform transition-transform hover:scale-105 duration-700"
            />
            <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-2">
                <div className="bg-green-500 h-3 w-3 rounded-full mr-2 animate-ping"></div>
                <span className="text-green-600 font-semibold">
                  Active Farmers
                </span>
              </div>
              <div className="text-3xl font-bold">&nbsp; &nbsp; 1000 +</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-12 bg-white relative">
        <div className="absolute inset-0 bg-[url('/api/placeholder/20/20')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-white to-green-50 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 transform hover:-translate-y-1"
              >
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
                <div className="w-16 h-1 bg-green-200 mt-3 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="p-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              OUR FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-green-600">AgriConnect</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to solve the biggest challenges faced by
              farmers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200 group"
              >
                <div className="text-4xl mb-4 bg-green-100 h-16 w-16 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-4 flex items-center text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50 to-white opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              SIMPLE PROCESS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How AgriConnect <span className="text-green-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to transform how you sell your produce
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-1 bg-green-200 z-0"></div>

              <div className="text-center p-6 relative z-10">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white text-green-600 text-2xl font-bold mb-6 border-4 border-green-200 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  List Your Produce
                </h3>
                <p className="text-gray-600">
                  Add details about your crops with photos. Our AI suggests the
                  best price based on market trends.
                </p>
                <img
                  src={ProduceList}
                  alt="List produce"
                  className="mx-auto mt-4 rounded-lg shadow-md"
                />
              </div>

              <div className="text-center p-6 relative z-10">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white text-green-600 text-2xl font-bold mb-6 border-4 border-green-200 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Connect with Buyers
                </h3>
                <p className="text-gray-600">
                  Receive offers directly from verified buyers. Negotiate and
                  finalize deals without intermediaries.
                </p>
                <img
                  src={ConnectWith}
                  alt="Connect with buyers"
                  className="mx-auto mt-4 rounded-lg shadow-md"
                />
              </div>

              <div className="text-center p-6 relative z-10">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white text-green-600 text-2xl font-bold mb-6 border-4 border-green-200 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Secure Transaction
                </h3>
                <p className="text-gray-600">
                  Use our blockchain-verified contracts and escrow payment
                  system for safe, guaranteed payments.
                </p>
                <img
                  src={SecurePayment}
                  alt="Secure transaction"
                  className="mx-auto mt-4 rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/api/placeholder/30/30')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-30 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-white bg-opacity-20 text-jewel-500 rounded-full text-sm font-medium mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Hear from farmers who transformed their businesses with
              AgriConnect
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-white text-gray-800 rounded-xl shadow-xl p-6 transform transition-all duration-500 hover:-translate-y-2 ${
                    index === activeTestimonial
                      ? "md:scale-105 ring-4 ring-green-300"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                >
                  <div className="mb-4">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-lg mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-500 mr-4"
                    />
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 w-3 rounded-full mx-1 ${
                    index === activeTestimonial
                      ? "bg-white"
                      : "bg-white bg-opacity-30"
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all">
            <div className="grid md:grid-cols-2">
              <div className="p-10 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-100 rounded-full"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-100 rounded-full"></div>

                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                    JOIN TODAY
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Ready to Transform Your Agriculture Business?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Join thousands of farmers who are selling directly to buyers
                    and earning more with AgriConnect.
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium shadow-lg hover:shadow-xl">
                      Get Started Now
                    </button>
                    <div className="flex items-center text-green-600 font-medium cursor-pointer">
                      <svg
                        className="w-12 h-12 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                      </svg>
                      <span>Watch how it works</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-10 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full border border-green-100">
                  <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
                    Request a Call Back
                  </h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your Phone"
                    />
                  </div>
                  <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg">
                    Request a Call Back
                  </button>
                  <p className="text-center text-gray-500 text-sm mt-4">
                    We'll call you back within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-green-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-green-800 rounded-full opacity-10 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4 flex gap-x-1 items-center">
                <img
                  src={leafImg}
                  width={30}
                  alt="AgriConnect Logo"
                  className="filter brightness-0 invert"
                />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100">
                  AgriConnect
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering farmers with direct market access and fair prices.
                Our platform connects farmers directly with buyers, eliminating
                middlemen and ensuring better profits.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map(
                  (social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors transform hover:-translate-y-1 inline-block"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-600 transition-colors flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </div>
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="w-8 h-1 bg-green-500 rounded-full mr-3"></span>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  "Home",
                  "Features",
                  "How It Works",
                  "Success Stories",
                  "About Us",
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="w-8 h-1 bg-green-500 rounded-full mr-3"></span>
                Resources
              </h3>
              <ul className="space-y-3">
                {[
                  "Market Trends",
                  "Weather Forecasts",
                  "Crop Advisory",
                  "FAQs",
                  "Help Center",
                ].map((resource, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="w-8 h-1 bg-green-500 rounded-full mr-3"></span>
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 mt-1 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-400">
                    123 Agriculture Lane, Digital District
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-400">+91 1234567890</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-400">support@agriconnect.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center mb-4 md:mb-0">
              © 2025 AgriConnect. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
