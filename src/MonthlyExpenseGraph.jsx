// Component to display monthly expense graph with selectable months

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
  return {
    label: format(date, 'MMMM yyyy'),
    value: { month: getMonth(date), year: getYear(date) },
    color: graphColors[i % graphColors.length],
  };
}).reverse();


// Map each option to its color
const colorByMonth = monthOptions.reduce((acc, option) => {
  acc[`${option.value.month}-${option.value.year}`] = option.color;
  return acc;
}, {});

function MonthlyExpenseGraph({ transactions}) {

  // States to manage selected months and series data
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [totalCurrentMonth, setTotalCurrentMonth] = useState(0);

  // Obtain real-time current month and year
  // this ensures the current month is always included in the graph
  const currentDate = new Date();
  const currentMonth = getMonth(currentDate);
  const currentYear = getYear(currentDate);
  const currentMonthLabel = format(currentDate, 'MMMM');

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Always include the current month in the graph, even if not selected
    // This holds the months that will be displayed in the graph
    const enforcedSelection = [
      {
        label: format(currentDate, 'MMMM yyyy'),
        value: { month: currentMonth, year: currentYear },
        color: '#210629',
      },
      ...selectedMonths,
    ];

    const groupedData = enforcedSelection.map(({ value }) => {
      const { month, year } = value;
      const dailyTotals = {};

      // Accumulate daily totals for the given month/year
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

      // Build cumulative line data for the chart
      let runningTotal = 0;
      const days = Array.from({ length: 31 }, (_, i) => i + 1);
      const lineData = days.map((day) => {
        runningTotal += Math.abs(dailyTotals[day] || 0);
        return { day, amount: parseFloat(runningTotal.toFixed(2)) };
      });

      // Store the total only for the current month
      if (month === currentMonth && year === currentYear) {
        setTotalCurrentMonth(runningTotal);
      }

      // return the series data for the graph
      return {
        key: `${month}-${year}`,
        label: format(new Date(year, month), 'MMMM yyyy'),
        color: value.month === currentMonth && value.year === currentYear
          ? '#210629'
          : colorByMonth[`${month}-${year}`] || '#ccc',
        data: lineData,
      };
    });

    setSeriesData(groupedData);
  }, [transactions, selectedMonths]);

  // Reusable select style object
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
      // Main container styling for the expense graph card
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
      {/* Header showing which month’s expenses are being displayed */}
      <h3 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{currentMonthLabel}'s Expenses</h3>
      {/* Current month’s total expense amount */}
      <p style={{ fontSize: '1.7rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        ${totalCurrentMonth.toFixed(2)}
      </p>

      {/* Month selector dropdown using react-select */}
      <Select
        isMulti
        options={monthOptions}
        value={selectedMonths}
        onChange={setSelectedMonths}
        styles={selectStyles}
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
          {/* X-axis for days of the month */}
          <XAxis dataKey="day" type="number" domain={[1, 31]} />
          {/* Y-axis for cumulative expense values */}
          <YAxis />
          {/* Tooltip to show details on hover */}
          <Tooltip
            formatter={(value) => `$${value.toFixed(2)}`}
            labelFormatter={(label) => `Day ${label}`}
          />
          {/* Legend showing which line corresponds to which month */}
          <Legend />
          {/* Render a line for each month (current + selected) */}
          {seriesData.map((series) => (
            <Line
              key={series.key}
              type="monotone"
              data={series.data}
              dataKey="amount"
              name={series.label}
              stroke={series.color}
              strokeWidth={series.color === '#5a2091' ? 3 : 2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyExpenseGraph;
