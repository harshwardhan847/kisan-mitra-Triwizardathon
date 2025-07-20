"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Camera,
  Leaf,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Zap,
  Users,
  BarChart3,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  // Generate random positions for magical particles only on the client
  const [particlePositions, setParticlePositions] = useState<
    { left: string; top: string }[]
  >([]);

  useEffect(() => {
    // Only run on client
    const positions = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setParticlePositions(positions);
  }, []);

  // Handle scroll for header transparency
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Crop Disease Diagnosis",
      description:
        "Upload photos of diseased plants and get instant diagnosis with treatment recommendations in your native language.",
      color: "from-red-500/20 to-pink-500/20 border-red-400/30",
      iconColor: "from-red-500 to-pink-500",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Price Tracking",
      description:
        "Get real-time mandi prices, market trends, and selling recommendations to maximize your profits.",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-400/30",
      iconColor: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Government Schemes",
      description:
        "Discover relevant subsidies, loans, and support programs from central and state governments.",
      color: "from-green-500/20 to-emerald-500/20 border-green-400/30",
      iconColor: "from-green-500 to-emerald-500",
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice-First Interaction",
      description:
        "Speak naturally in your native language - Hindi, Marathi, Gujarati, Tamil, and more.",
      color: "from-purple-500/20 to-violet-500/20 border-purple-400/30",
      iconColor: "from-purple-500 to-violet-500",
    },
  ];

  const stats = [
    {
      label: "Languages Supported",
      value: "12+",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      label: "Crop Diseases",
      value: "500+",
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      label: "Market Data",
      value: "1000+",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      label: "Government Schemes",
      value: "200+",
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Magical Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, #1e40af 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, #7c2d12 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating magical particles */}
      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-400 rounded-full"
          style={pos}
          animate={{
            x: [0, Math.cos(i * 0.5) * 100, 0],
            y: [0, Math.sin(i * 0.5) * 100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 6 + i * 0.3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-xl bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-indigo-900/90 border-b border-amber-500/20"
            : "backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-indigo-900/80"
        }`}
      >
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.3)",
                    "0 0 30px rgba(251, 191, 36, 0.5)",
                    "0 0 20px rgba(251, 191, 36, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sparkles className="w-7 h-7 text-slate-900" />
              </motion.div>
            </div>
            <div>
              <motion.h1
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Kisan Mitra
              </motion.h1>
              <p className="text-sm text-amber-200/70 hidden md:block font-medium">
                AI-Powered Agricultural Assistant
              </p>
            </div>
          </motion.div>

          {/* Navigation & Auth */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-8">
              <motion.a
                href="#features"
                className="text-amber-200 hover:text-amber-300 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Features
              </motion.a>
              <motion.a
                href="#about"
                className="text-amber-200 hover:text-amber-300 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                About
              </motion.a>
              <motion.a
                href="#contact"
                className="text-amber-200 hover:text-amber-300 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Contact
              </motion.a>
            </nav>

            <div className="flex items-center space-x-4">
              <SignedOut>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-amber-200 hover:text-amber-300 transition-colors duration-200">
                      Sign In
                    </button>
                  </SignInButton>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SignUpButton mode="modal">
                    <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/25">
                      Get Started
                    </button>
                  </SignUpButton>
                </motion.div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/chat"
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Open Chat</span>
                    </Link>
                  </motion.div>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Kisan Mitra
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-amber-200/80 mb-8 max-w-4xl mx-auto leading-relaxed">
              Your AI-powered agricultural companion. Get expert help for crop
              diseases, market prices, and government schemes - all in your
              native language.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <SignedOut>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SignUpButton mode="modal">
                  <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold text-lg rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-amber-500/30 flex items-center space-x-3">
                    <Sparkles className="w-6 h-6" />
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </SignUpButton>
              </motion.div>
            </SignedOut>
            <SignedIn>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/chat"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-lg rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-green-500/30 flex items-center space-x-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Open AI Assistant</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
            </SignedIn>

            <motion.a
              href="#features"
              className="px-8 py-4 border-2 border-amber-500/30 hover:border-amber-400/50 text-amber-200 hover:text-amber-300 font-medium text-lg rounded-2xl transition-all duration-200 backdrop-blur-xl hover:bg-amber-500/10 flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Learn More</span>
              <ChevronDown className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className=" relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="text-amber-400">{stat.icon}</div>
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-amber-200/70 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Modern Farmers
              </span>
            </h2>
            <p className="text-xl text-amber-200/80 max-w-3xl mx-auto">
              Everything you need to make informed decisions about your crops,
              markets, and government benefits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-xl rounded-3xl p-8 border shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 group relative overflow-hidden`}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Magical shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.iconColor} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-amber-200/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className=" relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Kisan Mitra
              </span>
            </h2>
            <p className="text-xl text-amber-200/80 max-w-4xl mx-auto leading-relaxed">
              Kisan Mitra is a multilingual, multimodal AI agent built with
              Google Vertex AI and Gemini. We help farmers diagnose plant
              diseases, track market prices, discover government schemes, and
              get expert agricultural advice - all in their native language.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered</h3>
              <p className="text-amber-200/80">
                Built with cutting-edge AI technology from Google Vertex AI and
                Gemini for accurate, contextual responses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Multilingual
              </h3>
              <p className="text-amber-200/80">
                Support for 12+ Indian languages including Hindi, Marathi,
                Gujarati, Tamil, and more regional languages.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Trusted</h3>
              <p className="text-amber-200/80">
                Reliable data from official sources including APMC mandis,
                government portals, and agricultural departments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-xl rounded-3xl p-12 border border-amber-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Farming Journey?
              </span>
            </h2>
            <p className="text-xl text-amber-200/80 mb-8">
              Join thousands of farmers who are already using Kisan Mitra to
              make better decisions and increase their profits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <SignedOut>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SignUpButton mode="modal">
                    <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold text-lg rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-amber-500/30 flex items-center space-x-3">
                      <Sparkles className="w-6 h-6" />
                      <span>Get Started Free</span>
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </SignUpButton>
                </motion.div>
              </SignedOut>
              <SignedIn>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/chat"
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-lg rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-green-500/30 flex items-center space-x-3"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>Start Chatting</span>
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </motion.div>
              </SignedIn>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="relative py-12 px-6 border-t border-amber-500/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-white">Kisan Mitra</h3>
              </div>
              <p className="text-amber-200/70">
                Your AI-powered agricultural companion for modern farming.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Features
              </h4>
              <ul className="space-y-2 text-amber-200/70">
                <li>Crop Disease Diagnosis</li>
                <li>Market Price Tracking</li>
                <li>Government Schemes</li>
                <li>Voice Interaction</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-amber-200/70">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-xl flex items-center justify-center"
                >
                  <Users className="w-5 h-5 text-amber-400" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-500/20 mt-8 pt-8 text-center">
            <p className="text-amber-200/70">
              © 2024 Kisan Mitra. Built with ❤️ for Indian farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
