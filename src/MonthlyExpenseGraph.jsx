import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Select from 'react-select';
import { format, subMonths, getMonth, getYear } from 'date-fns';

// Colors for the graph lines
const graphColors = [
  '#f48fb1', // pink
  '#81d4fa', // light blue
  '#aed581', // light green
  '#fff176', // yellow
  '#ffab91', // orange
  '#ce93d8', // purple
];

// Generate list for the last 6 months (excluding current month)
const monthOptions = Array.from({ length: 6 }, (_, i) => {
  const date = subMonths(new Date(), i + 1);
  const month = getMonth(date); // 0-based
  const year = getYear(date);
  return {
    label: format(date, 'MMMM yyyy'),
    value: { month, year },
    color: graphColors[i % graphColors.length],
  };
}).reverse();

// Map each option to its color using `${year}-${month}` as key
const colorByMonth = monthOptions.reduce((acc, option) => {
  const { month, year } = option.value;
  acc[`${year}-${month}`] = option.color;
  return acc;
}, {});

function MonthlyExpenseGraph({ transactions }) {
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [totalCurrentMonth, setTotalCurrentMonth] = useState(0);

  const currentDate = new Date();
  const currentMonth = getMonth(currentDate); // 0-based
  const currentYear = getYear(currentDate);
  const currentMonthLabel = format(currentDate, 'MMMM');

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Include current month always, and ensure no duplicates
    const currentMonthObj = {
      label: format(currentDate, 'MMMM yyyy'),
      value: { month: currentMonth, year: currentYear },
      color: '#210629',
    };

    const allSelected = [currentMonthObj, ...selectedMonths];
    const uniqueMap = new Map();

    for (const m of allSelected) {
      const { month, year } = m.value;
      const key = `${year}-${month}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, m);
    }

    const enforcedSelection = Array.from(uniqueMap.values());

    const groupedData = enforcedSelection.map(({ value }) => {
      const { month, year } = value;
      const dailyTotals = {};

      transactions.forEach((txn) => {
        const dateStr = txn.Date || txn.date;
        const amount = Number(txn.Amount || txn.amount || 0);
        if (amount >= 0) return; // only expenses

        const dateObj = new Date(dateStr);
        if (dateObj.getMonth() === month && dateObj.getFullYear() === year) {
          const day = dateObj.getDate();
          dailyTotals[day] = (dailyTotals[day] || 0) + amount;
        }
      });

      let runningTotal = 0;
      const days = Array.from({ length: 31 }, (_, i) => i + 1);
      const lineData = days.map((day) => {
        runningTotal += Math.abs(dailyTotals[day] || 0);
        return { day, amount: parseFloat(runningTotal.toFixed(2)) };
      });

      if (month === currentMonth && year === currentYear) {
        setTotalCurrentMonth(runningTotal);
      }

      const key = `${year}-${month}`; // always 0-based for consistency

      return {
        key,
        label: format(new Date(year, month), 'MMMM yyyy'),
        color:
          month === currentMonth && year === currentYear
            ? '#210629'
            : colorByMonth[key] || '#ccc',
        data: lineData,
      };
    });

    setSeriesData(groupedData);
  }, [transactions, selectedMonths, currentMonth, currentYear]);

  // Styles for the react-select dropdown
  const selectStyles = {
    control: (styles) => ({ ...styles, marginBottom: '1rem' }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused ? '#f0e6fa' : 'white',
      color: 'black',
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (styles) => ({
      ...styles,
      display: 'flex',
      alignItems: 'center',
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.color,
      color: '#000',
      padding: '2px 4px',
      borderRadius: '4px',
    }),
  };

  return (
    <div
      style={{
        width: '90%',
        backgroundColor: '#ffffff',
        fontFamily: 'roboto',
        zIndex: 4,
        borderRadius: '1.5rem',
        padding: '1rem',
        textAlign: 'left',
      }}
    >
      <h3 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>
        {currentMonthLabel}'s Expenses
      </h3>

      <p style={{ fontSize: '1.7rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        ${totalCurrentMonth.toFixed(2)}
      </p>

      {/* Month selector with unique option value keys */}
      <Select
        isMulti
        options={monthOptions}
        value={selectedMonths}
        onChange={setSelectedMonths}
        styles={selectStyles}
        getOptionValue={(e) => `${e.value.year}-${e.value.month}`}
        getOptionLabel={(e) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: e.color,
                borderRadius: '50%',
              }}
            ></div>
            {e.label}
          </div>
        )}
      />

      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <XAxis dataKey="day" type="number" domain={[1, 31]} />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${value.toFixed(2)}`}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Legend />
          {seriesData.map((series) => (
            <Line
              key={series.key}
              type="monotone"
              data={series.data}
              dataKey="amount"
              name={series.label}
              stroke={series.color}
              strokeWidth={series.color === '#210629' ? 3 : 2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyExpenseGraph;
