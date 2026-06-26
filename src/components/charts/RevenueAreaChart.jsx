import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value" style={{ color: "#10b981" }}>
          ${payload[0].value?.toLocaleString?.() ?? payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueAreaChart({ data }) {
  const chartData = (data || []).map((d) => ({
    name: d.label,
    value: d.value,
  }));

  return (
    <div className="chart-card chart-card--revenue">
      <div className="chart-card__header">
        <div>
          <h4 className="chart-card__title">Monthly Revenue</h4>
          <p className="chart-card__subtitle">Revenue over time</p>
        </div>
        <div className="chart-card__badge chart-card__badge--green">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1L9 5H6V9H4V5H1L5 1Z" fill="currentColor" />
          </svg>
          Revenue
        </div>
      </div>
      <div className="chart-card__body" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              tickFormatter={(v) => `$${v}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              animationDuration={1200}
              animationEasing="ease-out"
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "#10b981",
                fill: "var(--chart-dot-fill)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
