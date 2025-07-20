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

// Main DashboardView
const DashboardView = ({ results }: { results: any }) => {
  // Show most recent first
  const displayResults = (results || []).slice().reverse();
  // Manage active tab for each result
  const [activeTabs, setActiveTabs] = useState<{ [idx: number]: string }>({});

  return (
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
          <motion.div
            key={idx}
            className="w-full max-w-4xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-3xl p-4 md:p-8 shadow-2xl border border-blue-400/30 transition-all duration-300 group relative overflow-hidden mb-8"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 text-lg font-bold text-blue-200">
              Result #{displayResults.length - idx}
            </div>
            {/* Tab headers */}
            <div className="flex space-x-4 mb-6">
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
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-blue-200 hover:bg-blue-700/40"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
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
                                dot={{ fill: "#fbbf24", strokeWidth: 2, r: 4 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="min"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Min Price"
                                dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="max"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                name="Max Price"
                                dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
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
                                {chart.data.map((entry: any, idx: number) => (
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
                                ))}
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
                              <p className="text-slate-300 mb-3">{s.summary}</p>
                              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-md border border-green-400/30">
                                <span className="text-xs text-green-300 font-medium">
                                  {s.eligibility}
                                </span>
                              </div>
                            </div>
                            <a
                              href={
                                extractUrlsFromText(s.applicationLink)?.[0] ??
                                ""
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
        );
      })}
    </div>
  );
};

export default DashboardView;
