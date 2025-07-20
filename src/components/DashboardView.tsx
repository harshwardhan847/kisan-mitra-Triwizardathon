"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Leaf,
  Info,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { extractUrlsFromText } from "@/utils/ai_parsing";
import Head from "next/head";

// Chart component (reuse from before)
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

// StatCard (reuse from before)
const StatCard = React.memo(
  ({
    label,
    value,
    icon,
    color = "blue",
  }: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
  }) => {
    const colorClasses: { [key: string]: string } = {
      blue: "from-blue-500/20 to-cyan-500/20 border-blue-400/30 text-blue-300",
      green:
        "from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-300",
      amber:
        "from-amber-500/20 to-yellow-500/20 border-amber-400/30 text-amber-300",
      red: "from-red-500/20 to-pink-500/20 border-red-400/30 text-red-300",
      purple:
        "from-purple-500/20 to-violet-500/20 border-purple-400/30 text-purple-300",
    };
    const glowColors: { [key: string]: string } = {
      blue: "hover:shadow-blue-400/20",
      green: "hover:shadow-green-400/20",
      amber: "hover:shadow-amber-400/20",
      red: "hover:shadow-red-400/20",
      purple: "hover:shadow-purple-400/20",
    };
    return (
      <motion.div
        className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl border shadow-lg p-6 flex flex-col items-center min-w-[140px] transition-all duration-300 ${glowColors[color]} hover:shadow-2xl cursor-pointer group relative overflow-hidden`}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-3 relative z-10">
          {icon}
        </div>
        <div className="text-xs text-slate-300 mb-2 text-center font-medium relative z-10">
          {label}
        </div>
        <motion.div
          className="text-2xl font-bold text-white relative z-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {value}
        </motion.div>
      </motion.div>
    );
  }
);

// Tab names
const TAB_SUMMARY = "Summary";
const TAB_CHARTS = "Charts";
const TAB_STATS = "Stats";
const TAB_DISEASE = "Disease";
const TAB_SCHEMES = "Schemes";
const TAB_COMPARISON = "Comparison";

const TAB_ICONS: Record<string, React.ReactNode> = {
  [TAB_SUMMARY]: <Sparkles className="w-5 h-5 text-amber-300" />,
  [TAB_CHARTS]: <BarChart3 className="w-5 h-5 text-blue-300" />,
  [TAB_STATS]: <Activity className="w-5 h-5 text-green-300" />,
  [TAB_DISEASE]: <Leaf className="w-5 h-5 text-red-400" />,
  [TAB_SCHEMES]: <FileText className="w-5 h-5 text-green-400" />,
  [TAB_COMPARISON]: <TrendingUp className="w-5 h-5 text-purple-400" />,
};

// Main DashboardView
const DashboardView = ({ results }: { results: any }) => {
  // Show most recent first
  const displayResults = (results || []).slice().reverse();
  // Manage active tab for each result
  const [activeTabs, setActiveTabs] = useState<{ [idx: number]: string }>({});

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style jsx global>{`
        .magical-bg {
          background: linear-gradient(
            135deg,
            #1e193a 0%,
            #3b2063 50%,
            #0f2027 100%
          );
          position: relative;
          overflow: hidden;
        }
        .magical-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
              circle at 20% 30%,
              #fbbf24 0%,
              transparent 60%
            ),
            radial-gradient(circle at 80% 70%, #a78bfa 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, #f472b6 0%, transparent 70%);
          opacity: 0.18;
          z-index: 0;
          pointer-events: none;
          animation: magical-bg-anim 12s linear infinite alternate;
        }
        @keyframes magical-bg-anim {
          0% {
            filter: blur(0px);
          }
          100% {
            filter: blur(4px);
          }
        }
        .magical-border {
          border: 2.5px solid #fbbf24;
          box-shadow: 0 0 24px 2px #fbbf24cc, 0 0 0 4px #fff0 inset;
          animation: magical-border-glow 2.5s ease-in-out infinite alternate;
        }
        @keyframes magical-border-glow {
          0% {
            box-shadow: 0 0 24px 2px #fbbf24cc, 0 0 0 4px #fff0 inset;
          }
          100% {
            box-shadow: 0 0 36px 6px #fbbf24ee, 0 0 0 8px #fff2 inset;
          }
        }
        .magical-heading {
          font-family: "MedievalSharp", serif;
          letter-spacing: 0.04em;
          text-shadow: 0 0 8px #fbbf24, 0 0 2px #fff;
          color: #fbbf24;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, #fbbf24 40%, #a78bfa 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: magical-heading-glow 3s ease-in-out infinite alternate;
        }
        @keyframes magical-heading-glow {
          0% {
            text-shadow: 0 0 8px #fbbf24, 0 0 2px #fff;
          }
          100% {
            text-shadow: 0 0 16px #a78bfa, 0 0 8px #fff;
          }
        }
        .magical-scroll {
          background: linear-gradient(90deg, #f5e6c5 0%, #e9d8a6 100%);
          border-radius: 2rem;
          box-shadow: 0 2px 16px #fbbf2440;
          padding: 0.5rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border: 2px solid #fbbf24;
          position: relative;
        }
        .magical-scroll .active {
          background: linear-gradient(90deg, #fbbf24 60%, #a78bfa 100%);
          color: #fff;
          box-shadow: 0 0 12px #fbbf24cc;
          border-radius: 1.5rem;
          font-weight: bold;
          animation: magical-tab-glow 2s infinite alternate;
        }
        @keyframes magical-tab-glow {
          0% {
            box-shadow: 0 0 8px #fbbf24cc;
          }
          100% {
            box-shadow: 0 0 24px #a78bfa;
          }
        }
        .magical-divider {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #fbbf24 0%, #a78bfa 100%);
          margin: 2rem 0 2.5rem 0;
          border-radius: 1px;
          box-shadow: 0 0 8px #fbbf24cc;
          opacity: 0.7;
        }
        .magical-tooltip {
          background: #1e193a;
          color: #fbbf24;
          border: 1.5px solid #a78bfa;
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          box-shadow: 0 0 8px #a78bfa;
          font-family: "MedievalSharp", serif;
          z-index: 100;
        }
      `}</style>
      <div className="w-full flex flex-col h-full flex-1 items-center gap-6 md:px-8 py-28 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-amber-600/50 scrollbar-track-slate-800/50">
        {displayResults.map((result: any, idx: number) => {
          const synthesized =
            result && result.response && result.response.result
              ? result.response.result
              : null;
          if (!synthesized) return null;
          // Icon mapping for stats (move here)
          const iconMap: Record<string, React.ReactNode> = {
            TrendingDown: <TrendingDown className="w-5 h-5" />,
            TrendingUp: <TrendingUp className="w-5 h-5" />,
            Activity: <Activity className="w-5 h-5" />,
            BarChart3: <BarChart3 className="w-5 h-5" />,
          };
          // Determine default tab: Stats > Charts > Summary
          let defaultTab = TAB_SUMMARY;
          if (synthesized.stats && synthesized.stats.length)
            defaultTab = TAB_STATS;
          else if (synthesized.charts && synthesized.charts.length)
            defaultTab = TAB_CHARTS;
          else if (synthesized.details && synthesized.details.disease)
            defaultTab = TAB_DISEASE;
          else if (synthesized.details && synthesized.details.schemes)
            defaultTab = TAB_SCHEMES;
          else if (synthesized.details && synthesized.details.comparison)
            defaultTab = TAB_COMPARISON;
          const activeTab = activeTabs[idx] ?? defaultTab;
          const setActiveTab = (tab: string) =>
            setActiveTabs((prev) => ({ ...prev, [idx]: tab }));
          return (
            <React.Fragment key={idx}>
              <motion.div
                className="w-full max-w-4xl bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-900 border-2 border-amber-400 shadow-lg shadow-amber-400/30 rounded-3xl p-4 md:p-8 transition-all duration-300 group relative overflow-hidden mb-8"
                initial={{ opacity: 0, y: 50, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                  <span className="text-2xl md:text-3xl font-bold text-amber-300 drop-shadow">
                    Oracle’s Prophecy #{displayResults.length - idx}
                  </span>
                </div>
                {/* Tab Bar */}
                <div className="flex gap-2 mb-6 bg-yellow-100/80 border-2 border-amber-300 rounded-2xl p-2">
                  {[TAB_SUMMARY]
                    .concat(
                      synthesized.charts && synthesized.charts.length
                        ? [TAB_CHARTS]
                        : [],
                      synthesized.stats && synthesized.stats.length
                        ? [TAB_STATS]
                        : [],
                      synthesized.details && synthesized.details.disease
                        ? [TAB_DISEASE]
                        : [],
                      synthesized.details && synthesized.details.schemes
                        ? [TAB_SCHEMES]
                        : [],
                      synthesized.details && synthesized.details.comparison
                        ? [TAB_COMPARISON]
                        : []
                    )
                    .map((tab) => (
                      <button
                        key={tab}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 border-2 ${
                          activeTab === tab
                            ? "bg-amber-400 text-white border-amber-400 shadow shadow-amber-400/40"
                            : "bg-transparent text-amber-900 border-transparent hover:bg-amber-100 hover:shadow hover:shadow-amber-400/30"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {TAB_ICONS[tab]} {tab}
                      </button>
                    ))}
                </div>
                {/* Tab content (reuse existing logic, but with synthesized for this result) */}
                <div className="min-h-[200px]">
                  {activeTab === TAB_SUMMARY && (
                    <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-700/30">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {synthesized.summary}
                      </ReactMarkdown>
                    </div>
                  )}
                  {activeTab === TAB_CHARTS && (
                    <div className="space-y-8">
                      {synthesized.charts.map((chart: any, cidx: number) => {
                        // Accept both 'type' and 'chartType' for compatibility
                        const chartType = chart.type || chart.chartType;
                        return (
                          <div key={cidx} className="mb-6">
                            <h3 className="text-lg font-semibold text-blue-200 mb-2">
                              {chart.title}
                            </h3>
                            {chartType === "line" && (
                              <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                  data={chart.data}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                  }}
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#6b7280"
                                    opacity={0.3}
                                  />
                                  <XAxis
                                    dataKey="date"
                                    stroke="#d1d5db"
                                    fontSize={12}
                                  />
                                  <YAxis stroke="#d1d5db" fontSize={12} />
                                  <Tooltip />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="modal"
                                    stroke="#fbbf24"
                                    strokeWidth={3}
                                    name="Modal Price"
                                    dot={{
                                      fill: "#fbbf24",
                                      strokeWidth: 2,
                                      r: 4,
                                    }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="min"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Min Price"
                                    dot={{
                                      fill: "#10b981",
                                      strokeWidth: 2,
                                      r: 3,
                                    }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="max"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    name="Max Price"
                                    dot={{
                                      fill: "#f59e0b",
                                      strokeWidth: 2,
                                      r: 3,
                                    }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            )}
                            {chartType === "bar" && (
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                  data={chart.data}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                  }}
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#6b7280"
                                    opacity={0.3}
                                  />
                                  <XAxis
                                    dataKey="market"
                                    stroke="#d1d5db"
                                    fontSize={12}
                                  />
                                  <YAxis stroke="#d1d5db" fontSize={12} />
                                  <Tooltip />
                                  <Legend />
                                  <Bar
                                    dataKey="modal"
                                    fill="#8b5cf6"
                                    name="Modal Price"
                                    radius={[4, 4, 0, 0]}
                                  />
                                  <Bar
                                    dataKey="min"
                                    fill="#10b981"
                                    name="Min Price"
                                    radius={[4, 4, 0, 0]}
                                  />
                                  <Bar
                                    dataKey="max"
                                    fill="#f59e0b"
                                    name="Max Price"
                                    radius={[4, 4, 0, 0]}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            )}
                            {chartType === "grouped-bar" && (
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                  data={chart.data}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                  }}
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#6b7280"
                                    opacity={0.3}
                                  />
                                  <XAxis
                                    dataKey="date"
                                    stroke="#d1d5db"
                                    fontSize={12}
                                  />
                                  <YAxis stroke="#d1d5db" fontSize={12} />
                                  <Tooltip />
                                  <Legend />
                                  {Object.keys(chart.data[0] || {})
                                    .filter((k) => k !== "date")
                                    .map((key, idx) => (
                                      <Bar
                                        key={key}
                                        dataKey={key}
                                        fill={
                                          [
                                            "#8b5cf6",
                                            "#10b981",
                                            "#f59e0b",
                                            "#3b82f6",
                                          ][idx % 4]
                                        }
                                        name={key}
                                        radius={[4, 4, 0, 0]}
                                      />
                                    ))}
                                </BarChart>
                              </ResponsiveContainer>
                            )}
                            {chartType === "area" && (
                              <ResponsiveContainer width="100%" height={300}>
                                <AreaChart
                                  data={chart.data}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                  }}
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#6b7280"
                                    opacity={0.3}
                                  />
                                  <XAxis
                                    dataKey="date"
                                    stroke="#d1d5db"
                                    fontSize={12}
                                  />
                                  <YAxis stroke="#d1d5db" fontSize={12} />
                                  <Tooltip />
                                  <Legend />
                                  <Area
                                    type="monotone"
                                    dataKey="modal"
                                    stroke="#fbbf24"
                                    fill="#fbbf24"
                                    fillOpacity={0.3}
                                    name="Modal Price"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="min"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.2}
                                    name="Min Price"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="max"
                                    stroke="#f59e0b"
                                    fill="#f59e0b"
                                    fillOpacity={0.2}
                                    name="Max Price"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            )}
                            {chartType === "pie" && (
                              <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Tooltip />
                                  <Legend />
                                  <Pie
                                    data={chart.data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                  >
                                    {chart.data.map(
                                      (entry: any, idx: number) => (
                                        <Cell
                                          key={`cell-${idx}`}
                                          fill={
                                            [
                                              "#8b5cf6",
                                              "#10b981",
                                              "#f59e0b",
                                              "#3b82f6",
                                            ][idx % 4]
                                          }
                                        />
                                      )
                                    )}
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            )}
                            {chartType === "scatter" && (
                              <ResponsiveContainer width="100%" height={300}>
                                <ScatterChart
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                  }}
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#6b7280"
                                    opacity={0.3}
                                  />
                                  <XAxis
                                    dataKey="x"
                                    stroke="#d1d5db"
                                    fontSize={12}
                                  />
                                  <YAxis
                                    dataKey="y"
                                    stroke="#d1d5db"
                                    fontSize={12}
                                  />
                                  <ZAxis dataKey="z" range={[60, 400]} />
                                  <Tooltip />
                                  <Legend />
                                  <Scatter
                                    name="Data"
                                    data={chart.data}
                                    fill="#8b5cf6"
                                  />
                                </ScatterChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {activeTab === TAB_STATS && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {synthesized.stats.map((stat: any, sidx: number) => (
                        <StatCard
                          key={sidx}
                          label={stat.label}
                          value={stat.value}
                          icon={iconMap[stat.icon || ""]}
                          color={stat.color}
                        />
                      ))}
                    </div>
                  )}
                  {activeTab === TAB_DISEASE && synthesized.details.disease && (
                    <div className="space-y-6">
                      {synthesized.details.disease.markdown ? (
                        <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-700/30">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {synthesized.details.disease.markdown}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-700/30">
                            <div className="flex items-center space-x-2 mb-3">
                              <Leaf className="w-5 h-5 text-red-400" />
                              <span className="font-bold text-red-200">
                                Cursed Affliction Identified:
                              </span>
                            </div>
                            <p className="text-slate-200 text-lg">
                              {synthesized.details.disease.diseaseName}
                            </p>
                          </div>
                          <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-700/30">
                            <div className="flex items-center space-x-2 mb-3">
                              <Info className="w-5 h-5 text-blue-400" />
                              <span className="font-bold text-blue-200">
                                Source of Dark Magic:
                              </span>
                            </div>
                            <p className="text-slate-200">
                              {synthesized.details.disease.cause}
                            </p>
                          </div>
                          <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-700/30">
                            <div className="flex items-center space-x-2 mb-4">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              <span className="font-bold text-green-200">
                                Healing Incantations:
                              </span>
                            </div>
                            <div className="space-y-3">
                              {synthesized.details.disease.treatment &&
                                synthesized.details.disease.treatment.map(
                                  (step: string, tidx: number) => (
                                    <div
                                      key={tidx}
                                      className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-700/30 transition-colors duration-300"
                                    >
                                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-400/30">
                                        <span className="text-xs font-bold text-green-400">
                                          {tidx + 1}
                                        </span>
                                      </div>
                                      <p className="text-slate-200">{step}</p>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === TAB_SCHEMES && synthesized.details.schemes && (
                    <div className="mb-6 p-4 bg-slate-900/30 rounded-2xl border border-slate-700/30">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {synthesized.details.schemes.summary}
                      </ReactMarkdown>
                      <div className="grid gap-4 mt-4">
                        {synthesized.details.schemes.schemes &&
                          synthesized.details.schemes.schemes.map(
                            (s: any, scidx: number) => (
                              <div
                                key={scidx}
                                className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 hover:border-green-400/40 transition-all duration-300 group/scheme relative overflow-hidden"
                              >
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-green-200 mb-2 group-hover/scheme:text-green-100 transition-colors">
                                    {s.name}
                                  </h3>
                                  <p className="text-slate-300 mb-3">
                                    {s.summary}
                                  </p>
                                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-md border border-green-400/30">
                                    <span className="text-xs text-green-300 font-medium">
                                      {s.eligibility}
                                    </span>
                                  </div>
                                </div>
                                <a
                                  href={
                                    extractUrlsFromText(
                                      s.applicationLink
                                    )?.[0] ?? ""
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 relative z-10"
                                >
                                  <span>Cast Application</span>
                                </a>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  )}
                  {activeTab === TAB_COMPARISON &&
                    synthesized.details.comparison && (
                      <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-700/30">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {synthesized.details.comparison.summary}
                        </ReactMarkdown>
                      </div>
                    )}
                </div>
              </motion.div>
              {idx < displayResults.length - 1 && (
                <div className="h-1 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 rounded-full my-8 shadow" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default DashboardView;
