"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AnalyticsChart = ({ data, title, dataKey = "amount" }) => {
  return (
    <div className="bg-base-100 p-8 rounded-[3rem] border border-base-200 shadow-sm w-full h-112.5">
      <h3 className="text-xl font-black mb-8 px-2">{title}</h3>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#570df8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#570df8" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "20px",
              border: "none",
              color: "black",
              boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
            }}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#570df8"
            fillOpacity={1}
            fill="url(#colorAmount)"
            stackId="1"
          />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorCount)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
