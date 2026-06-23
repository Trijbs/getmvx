"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  totals: {
    views: number;
    clicks: number;
    viewsLast30Days: number;
    clicksLast30Days: number;
  };
  dailyViews: { date: string; count: number }[];
  dailyClicks: { date: string; count: number }[];
  topLinks: {
    id: string;
    title: string;
    url: string;
    icon: string | null;
    clickCount: number;
  }[];
  recentEvents: {
    id: string;
    type: string;
    createdAt: string;
    country: string | null;
    device: string | null;
  }[];
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/overview")
      .then((res) => res.json())
      .then((d) => {
        setData(d as AnalyticsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[var(--muted)]">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--muted)]">Failed to load analytics</p>
      </div>
    );
  }

  // Merge daily views and clicks for chart
  const chartData = data.dailyViews.map((view) => {
    const click = data.dailyClicks.find((c) => c.date === view.date);
    return {
      date: view.date,
      views: view.count,
      clicks: click?.count || 0,
    };
  });

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-barlow)] text-2xl font-700">
        Analytics
      </h1>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total views"
          value={data.totals.views}
          accent
        />
        <StatCard
          label="Total clicks"
          value={data.totals.clicks}
        />
        <StatCard
          label="Views (30d)"
          value={data.totals.viewsLast30Days}
        />
        <StatCard
          label="Clicks (30d)"
          value={data.totals.clicksLast30Days}
        />
      </div>

      {/* Chart */}
      <section className="mb-8 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
        <h2 className="mb-4 text-sm font-600">Last 30 days</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--accent)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--accent)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--green)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--green)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="var(--muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis
                stroke="var(--muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "var(--text)" }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--accent)"
                fill="url(#viewsGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="var(--green)"
                fill="url(#clicksGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="text-xs text-[var(--muted)]">Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--green)]" />
            <span className="text-xs text-[var(--muted)]">Clicks</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top links */}
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <h2 className="mb-4 text-sm font-600">Top links</h2>
          {data.topLinks.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No links yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.topLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between rounded-lg bg-[var(--bg3)] px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {link.icon && <span className="shrink-0">{link.icon}</span>}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-500">{link.title}</p>
                      <p className="truncate text-xs text-[var(--muted)]">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right ml-4">
                    <p className="text-sm font-600 text-[var(--accent)]">
                      {link.clickCount}
                    </p>
                    <p className="text-xs text-[var(--muted)]">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <h2 className="mb-4 text-sm font-600">Recent activity</h2>
          {data.recentEvents.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No activity yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {data.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-600 ${
                        event.type === "VIEW"
                          ? "bg-[var(--blue)]/12 text-[var(--blue)]"
                          : "bg-[var(--green)]/12 text-[var(--green)]"
                      }`}
                    >
                      {event.type}
                    </span>
                    <span className="text-sm text-[var(--muted)]">
                      {event.country || "Unknown"}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)]">
                    {formatTimeAgo(event.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
      <p className="text-xs font-500 text-[var(--muted)]">{label}</p>
      <p
        className={`mt-1 font-[family-name:var(--font-barlow)] text-3xl font-800 ${
          accent ? "text-[var(--accent)]" : "text-[var(--text)]"
        }`}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
