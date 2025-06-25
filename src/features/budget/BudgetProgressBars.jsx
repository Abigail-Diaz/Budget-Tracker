import styles from "./BudgetProgressBars.module.css";

/**
 * BudgetProgressBars Component
 *
 * Displays a list of budget categories with corresponding progress bars
 * that visually represent the ratio of actual spending to allocated budget.
 *
 * Props:
 * - actualExpenses: [{ name: string, amount: number }]
 * - budgetCategories: [{ name: string, amount: number }]
 * - heading: string — customizable heading label
 */
function BudgetProgressBars({
  actualExpenses = [],
  budgetCategories = [],
  heading = "Budget Usage", // default heading
}) {
  // Map actual expenses by category name for quick lookup
  const expenseMap = actualExpenses.reduce((acc, item) => {
    acc[item.name] = item.amount;
    return acc;
  }, {});

  // Helper to generate a unique key using name and current date
  const generateKey = (name, index) => {
    const safeName = name || "unknown"; // fallback if name is missing or falsy
    const todayDate = new Date().toISOString().slice(0, 10);
    return `${safeName}-${todayDate}-${index}`; // add index for guaranteed uniqueness
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>{heading}</h2>

      {/* Loop through each budget category except "Income" */}
      {budgetCategories
        .filter((item) => item.name !== "Income")
        .map(({ name, amount: budgetAmount }, index) => {
          const spent = expenseMap[name] || 0; // amount spent in this category
          const percent = (spent / budgetAmount) * 100; // calculate percent used
          const isOverBudget = spent > budgetAmount; // flag if over budget

          return (
            <div key={generateKey(name, index)} className={styles.category}>
              <div className={styles.labelRow}>
                <span>{name}</span>
                <span>
                  ${spent.toFixed(2)} / ${budgetAmount}
                </span>
              </div>

              {/* Progress bar container */}
              <div className={styles.barContainer}>
                {/* Fill bar based on percent (capped at 100%) */}
                <div
                  className={`${styles.barFill} ${
                    isOverBudget ? styles.over : ""
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                ></div>

                {/* Overflow bar if over budget */}
                {isOverBudget && (
                  <div
                    className={styles.barOverflow}
                    style={{ width: `${percent - 100}%` }}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default BudgetProgressBars;
