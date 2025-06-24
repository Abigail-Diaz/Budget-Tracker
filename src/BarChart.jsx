import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Bar graph takes an object and takes each key to display each bar across the graph
function BarGraph({ dataObject = [], label = "Monthly Expenses" }) {
  // Normalize and calculate the total from the incoming array
  const { chartData, total } = useMemo(() => {
    const data = dataObject.map((item) => ({
      category: item.name || item.category, // support both keys
      amount: Math.abs(item.amount),
    }));
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    return { chartData: data, total: totalAmount };
  }, [dataObject]);

  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>{label}</h3>
      <p
        style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "2rem" }}
      >
        Total: ${total.toFixed(2)}
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Bar dataKey="amount" fill="#8884d8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarGraph;
