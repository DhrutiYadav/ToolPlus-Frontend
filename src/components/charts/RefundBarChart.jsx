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
        <p className="chart-tooltip-value" style={{ color: "#f43f5e" }}>
          {payload[0].value?.toLocaleString?.() ?? payload[0].value} refunds
        </p>
      </div>
    );
  }
  return null;
};

export default function RefundBarChart({ data }) {
  const chartData = (data || []).map((d) => ({
    name: d.label,
    value: d.value,
  }));

  return (
    <div className="chart-card chart-card--refund">
      <div className="chart-card__header">
        <div>
          <h4 className="chart-card__title">Refund Trends</h4>
          <p className="chart-card__subtitle">Refunds processed</p>
        </div>
        <div className="chart-card__badge chart-card__badge--red">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 9L1 5H4V1H6V5H9L5 9Z" fill="currentColor" />
          </svg>
          Refunds
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
                  fill="#f43f5e"
                  fillOpacity={0.75 + (index / Math.max(chartData.length, 1)) * 0.25}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
