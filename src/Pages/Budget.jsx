import { useState, useEffect } from 'react';
import Card from "../Card.jsx";
import PieChartExpense from "../PieChart";
import styles from "./Budget.module.css";

import { format, getMonth } from 'date-fns';

function Budget({ incomeData }) {
    const now = new Date();
    const currentMonth = getMonth(now);

    const currentMonthLabel = format(new Date(), 'MMMM yyyy');

    // selected month from drop down menu
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    // monthly expenses and remaining balance (income - expense) based on selectedMonth
    const [currentIncomeData, setCurrentIncomeData] = useState(null);

    // Load first available month once incomeData is populated
    useEffect(() => {
        const months = Object.keys(incomeData);
        if (months.length > 0) {
            setSelectedMonth(currentMonthLabel);
            setCurrentIncomeData(incomeData[currentMonthLabel]);
        }
    }, [incomeData]);

    // helper function to set the selected month 
    const handleChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        setCurrentIncomeData(incomeData[month]);
    };

    if (!currentIncomeData) return <p>Loading budget data...</p>;
    return (
        <div className={styles.wrapper}>
            <div className={styles.cardColumn}>
                {/* month selection */}
                <label htmlFor="month-select">Select Month:</label>
                <select id="month-select" value={selectedMonth} onChange={handleChange}>
                    {Object.keys(incomeData).map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
                {/*Display the expense metrics*/}
                <Card title="Total Expenses" amount={currentIncomeData.monthlyExpense} />
                <Card title="Total Income" amount={currentIncomeData.monthlyIncome} />
                <Card title="Remaining" amount={currentIncomeData.monthlyRemaining} />
            </div>
            <div className={styles.chartArea}>
                {/*Display the pie chart to visually represent remaining money vs expenses*/}
                <PieChartExpense
                    dataObject={{
                        monthlyExpense: currentIncomeData.monthlyExpense,
                        monthlyRemaining: currentIncomeData.monthlyRemaining
                    }}

                    label={`${selectedMonth} Breakdown`}
                />

            </div>
        </div>
    );
}

export default Budget;
