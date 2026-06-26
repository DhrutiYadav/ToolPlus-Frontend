import React from "react";
import {
  LineChart,
  Line,
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
        <p className="chart-tooltip-value" style={{ color: "#f97316" }}>
          {payload[0].value?.toLocaleString?.() ?? payload[0].value} payments
        </p>
      </div>
    );
  }
  return null;
};

export default function PaymentLineChart({ data }) {
  const chartData = (data || []).map((d) => ({
    name: d.label,
    value: d.value,
  }));

  return (
    <div className="chart-card chart-card--payment">
      <div className="chart-card__header">
        <div>
          <h4 className="chart-card__title">Payment Trends</h4>
          <p className="chart-card__subtitle">Successful transactions</p>
        </div>
        <div className="chart-card__badge chart-card__badge--orange">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" fill="currentColor" />
          </svg>
          Payments
        </div>
      </div>
      <div className="chart-card__body" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{
                r: 4,
                strokeWidth: 2,
                stroke: "#f97316",
                fill: "var(--chart-dot-fill)",
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "#f97316",
                fill: "var(--chart-dot-fill)",
              }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
