import { useState, useEffect } from 'react';
import Card from "../Card.jsx";
import PieChartExpense from "../PieChart";
import BarChart from '../BarChart.jsx';
import styles from "./Budget.module.css";
import BudgetProgressBars from '../BudgetProgressBars.jsx';
import Loading from '../Loading.jsx';

import { format, getMonth } from 'date-fns';

function Budget({ incomeData, categoryData, budgetCategories, isLoading }) {
    const now = new Date();
    const currentMonthLabel = format(now, 'MMMM yyyy');

    // selected month from drop down menu
    const [selectedMonth, setSelectedMonth] = useState(currentMonthLabel);

    // monthly expenses and remaining balance (income - expense) based on selectedMonth
    const [currentIncomeData, setCurrentIncomeData] = useState(null);

    // Load first available month once incomeData is populated
    useEffect(() => {
        const months = Object.keys(incomeData);
        if (months.length > 0) {
            // Use current month if available, otherwise use the first available month
            const defaultMonth = months.includes(currentMonthLabel) ? currentMonthLabel : months[0];
            setSelectedMonth(defaultMonth);
        }
    }, [incomeData]);

    // Update currentIncomeData whenever incomeData or selectedMonth changes
    useEffect(() => {
        setCurrentIncomeData(incomeData[selectedMonth] || null);
    }, [incomeData, selectedMonth]);

    // helper function to set the selected month 
    const handleChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
    };

    console.log('incomeData:', incomeData);
    console.log('currentIncomeData:', currentIncomeData);

    // Show loading spinner while data is being fetched
    if (isLoading || !currentIncomeData) return <Loading message="Loading budget data..." />;

    return (
        <div className={styles.wrapper}>
            <div className={styles.cardColumn}>
                {/* month selection */}
                <label htmlFor="month-select" style={{ fontWeight: '600', color: '#5a4d8c' }}>Select Month:</label>
                <select id="month-select" value={selectedMonth} onChange={handleChange}>
                    {Object.keys(incomeData).map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>

                {/* Display the expense metrics */}
                <Card title="Total Expenses" amount={currentIncomeData.monthlyExpense} />
                <Card title="Total Income" amount={currentIncomeData.monthlyIncome} />
                <Card title="Remaining" amount={currentIncomeData.monthlyRemaining} />
            </div>

            <div className={styles.chartArea}>
                {/* Display the pie chart to visually represent remaining money vs expenses */}
                <PieChartExpense
                    dataObject={{
                        monthlyExpense: currentIncomeData.monthlyExpense,
                        monthlyRemaining: currentIncomeData.monthlyRemaining
                    }}
                    label={`${selectedMonth} Breakdown`}
                />
                
                <BarChart dataObject={categoryData[selectedMonth]} />
                
                <BudgetProgressBars
                    actualExpenses={categoryData[selectedMonth]}
                    budgetCategories={budgetCategories}
                />
            </div>
        </div>
    );
}

export default Budget;
