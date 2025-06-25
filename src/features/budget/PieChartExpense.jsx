import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const colors = ["#6a0dad", "#9b59b6", "#b39ddb", "#d1c4e9"];

const labelMap = {
  monthlyExpense: "Expenses",
  monthlyRemaining: "Remaining",
};

// Pie chart to display amounts
function PieChartExpense({ dataObject, label }) {
  if (!dataObject) return null;

  const data = Object.entries(dataObject).map(([name, value]) => ({
    name: labelMap[name] || name,
    value: Math.abs(value),
  }));

  return (
    <div style={{ width: "100%", maxWidth: 600, margin: "auto" }}>
      <h3 style={{ textAlign: "center" }}>{label}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name }) => name}
          >
            {data.map(({ name }, index) => (
              <Cell key={name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartExpense;
