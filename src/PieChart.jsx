import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const COLORS = [
  '#6a0dad', // rich purple
  '#9b59b6', // light purple
  '#b39ddb', // lavender
  '#d1c4e9', // very light purple
  '#7f8c8d', // mid gray
  '#95a5a6', // light gray
  '#bdc3c7', // softer gray
  '#dfe6e9', // very soft gray
];

const currentDate = new Date();
const currentMonthLabel = format(currentDate, 'MMMM');

// Component to display a pie chart based on the total expense for the current month 
function PieChartExpense({ expensesByCategory }) {
    if (!expensesByCategory || typeof expensesByCategory !== 'object') return null;

    // convert the passed array to an array of objects containing name and value pairs
    const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
    }));

    return (
        <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '2rem auto',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{currentMonthLabel}'s Expenses</h3>
            {/* Pie chart with categories and corresponding amounts */}
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {/*Fill in the chart based on color palette */}
                        {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
