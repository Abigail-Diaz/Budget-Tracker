import React, { useEffect, useState } from 'react';
import styles from './RecentExpensesList.module.css';
import foodIcon from './assets/Icons/food.png';
import travelIcon from './assets/Icons/travel.png';
import shoppingIcon from './assets/Icons/shopping.png';
import utilityIcon from './assets/Icons/utilities.png';
import entertainmentIcon from './assets/Icons/entertainment.png';
import healthIcon from './assets/Icons/health.png';
import groceryIcon from './assets/Icons/groceries.png';
import otherIcon from './assets/Icons/other.png';

// Icons for each category
const categoryIcons = {
  Food: foodIcon,
  Travel: travelIcon,
  Shopping: shoppingIcon,
  Utilities: utilityIcon,
  Entertainment: entertainmentIcon,
  Health: healthIcon,
  Groceries: groceryIcon,
  Other: otherIcon
};

// Calculate recent expenses by category and current month
function RecentExpensesList({ transactions }) {
  const [expensesByCategory, setExpensesByCategory] = useState({});

  useEffect(() => {
  
  async function fetchExpenses() {
    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const totals = transactions.reduce((acc, txn) => {
        const amount = Number(txn.Amount || txn.amount || 0);
        const category = txn.Category || txn.category || 'Other';

        const txnDate = new Date(txn.Date || txn.date);
        const txnMonth = txnDate.getMonth();
        const txnYear = txnDate.getFullYear();
        
        // Calculate based on current month and year
        if (amount < 0 && txnMonth === currentMonth && txnYear === currentYear) {
          acc[category] = (acc[category] || 0) + Math.abs(amount);
        }

        return acc;
      }, {});

      setExpensesByCategory(totals);
    } catch (err) {
      console.error('Error loading recent expenses:', err);
    }
  }

  fetchExpenses();
}, [transactions]);


  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Recent Expenses</h2>
      {Object.entries(expensesByCategory).map(([category, total]) => (
        <div key={category} className={styles.categoryItem}>
          <div className={styles.categoryHeader}>
            <img
              src={categoryIcons[category] || categoryIcons['Other']}
              alt={category}
              className={styles.categoryIcon}
            />
            <h3 className={styles.categoryTitle}>{category}</h3>
          </div>
          <p className={styles.categoryAmount}>
            -${total.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default RecentExpensesList;
