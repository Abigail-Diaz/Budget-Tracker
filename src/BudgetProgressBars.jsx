import styles from './BudgetProgressBars.module.css';
import Button from './Button.jsx';

/**
 * BudgetProgressBars Component
 *
 * Displays a list of budget categories with corresponding progress bars
 * that visually represent the ratio of actual spending to allocated budget.
 *
 * Props:
 * - actualExpenses: [{ name: string, amount: number }] — actual spending data
 * - budgetCategories: [{ name: string, amount: number }] — allocated budget categories
 * - heading: string — customizable heading label
 * - buttonPath: string — URL path to navigate when the button is clicked
 * - buttonLabel: string (children) — label for the button
 */
function BudgetProgressBars({
  actualExpenses = [],
  budgetCategories = [],
  heading = 'Budget Usage',        // default heading
  buttonPath = '/editBudget',      // default path
  buttonLabel = 'Edit Budget',     // default label
}) {
  // Map actual expenses by category name for quick lookup
  const expenseMap = actualExpenses.reduce((acc, item) => {
    acc[item.name] = item.amount;
    return acc;
  }, {});

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>{heading}</h2>

      {/* Loop through each budget category except "Income" */}
      {budgetCategories
        .filter((item) => item.name !== 'Income')
        .map(({ name, amount: budgetAmount }) => {
          const spent = expenseMap[name] || 0;               // amount spent in this category
          const percent = (spent / budgetAmount) * 100;      // calculate percent used
          const isOverBudget = spent > budgetAmount;         // flag if over budget

          return (
            <div key={name} className={styles.category}>
              <div className={styles.labelRow}>
                <span>{name}</span>
                <span>${spent.toFixed(2)} / ${budgetAmount}</span>
              </div>

              {/* Progress bar container */}
              <div className={styles.barContainer}>
                {/* Fill bar based on percent (capped at 100%) */}
                <div
                  className={`${styles.barFill} ${isOverBudget ? styles.over : ''}`}
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

      {/* Configurable button for navigation*/}
      <Button path={buttonPath}>{buttonLabel}</Button>
    </div>
  );
}

export default BudgetProgressBars;
