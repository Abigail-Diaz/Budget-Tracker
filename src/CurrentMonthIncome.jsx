import React, { useEffect, useState } from 'react';
import { getMonth, getYear } from 'date-fns';
import styles from './CurrentMonthIncome.module.css';

// Display the total income for the current month
// Income is in the transactions list
function CurrentMonthIncome({ transactions }) {
  const [incomeTotal, setIncomeTotal] = useState(0);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setIncomeTotal(0);
      return;
    }
    // Get the current month and year
    const now = new Date();
    const currentMonth = getMonth(now);
    const currentYear = getYear(now);

    // Calculate total income for the current month
    const totalIncome = transactions.reduce((acc, txn) => {
      const dateStr = txn.Date || txn.date;
      const amount = Number(txn.Amount || txn.amount || 0);
      if (amount <= 0) return acc;

      const dateObj = new Date(dateStr);
      if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
        return acc + amount;
      }
      return acc;
    }, 0);

    setIncomeTotal(totalIncome);
  }, [transactions]);

  return (
    <div className={styles.incomeCard}>
      <h3> Income </h3>
      <p>${incomeTotal.toFixed(2)}</p>
    </div>
  );
}

export default CurrentMonthIncome;