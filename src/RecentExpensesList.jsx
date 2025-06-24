import React from "react";
import styles from "./RecentExpensesList.module.css";

import foodIcon from "./assets/Icons/food.png";
import travelIcon from "./assets/Icons/travel.png";
import shoppingIcon from "./assets/Icons/shopping.png";
import utilityIcon from "./assets/Icons/utilities.png";
import entertainmentIcon from "./assets/Icons/entertainment.png";
import healthIcon from "./assets/Icons/health.png";
import groceryIcon from "./assets/Icons/groceries.png";
import otherIcon from "./assets/Icons/other.png";

// Map category names to icons
const categoryIcons = {
  Food: foodIcon,
  Travel: travelIcon,
  Shopping: shoppingIcon,
  Utilities: utilityIcon,
  Entertainment: entertainmentIcon,
  Health: healthIcon,
  Groceries: groceryIcon,
  Other: otherIcon,
};

// Accepts an array like [{ name: 'Food', amount: 123 }, ...]
function RecentExpensesList({ expensesByCategory }) {
  if (!Array.isArray(expensesByCategory) || expensesByCategory.length === 0) {
    return <p className={styles.noData}>No expense data for this month.</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Recent Expenses</h2>
      {expensesByCategory.map(({ name, amount }) => (
        <div key={name} className={styles.categoryItem}>
          <div className={styles.categoryHeader}>
            <img
              src={categoryIcons[name] || categoryIcons["Other"]}
              alt={name}
              className={styles.categoryIcon}
            />
            <h3 className={styles.categoryTitle}>{name}</h3>
          </div>
          <p className={styles.categoryAmount}>-${amount.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default RecentExpensesList;
