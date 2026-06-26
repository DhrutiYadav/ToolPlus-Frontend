import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value" style={{ color: "#8b5cf6" }}>
          {payload[0].value?.toLocaleString?.() ?? payload[0].value} uses
        </p>
      </div>
    );
  }
  return null;
};

export default function CouponBarChart({ data }) {
  const chartData = (data || []).map((d) => ({
    name: d.label,
    value: d.value,
  }));

  return (
    <div className="chart-card chart-card--coupon">
      <div className="chart-card__header">
        <div>
          <h4 className="chart-card__title">Coupon Usage</h4>
          <p className="chart-card__subtitle">Coupons redeemed</p>
        </div>
        <div className="chart-card__badge chart-card__badge--purple">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="1" y="1" width="8" height="8" rx="2" fill="currentColor" />
          </svg>
          Coupons
        </div>
      </div>
      <div className="chart-card__body" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
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
              width={35}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--chart-cursor)" }} />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
              maxBarSize={42}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#8b5cf6"
                  fillOpacity={0.7 + (index / Math.max(chartData.length, 1)) * 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
