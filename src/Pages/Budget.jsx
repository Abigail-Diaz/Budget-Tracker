import Card from "../Card.jsx";
import PieChartExpense from "../PieChart";

import styles from "./Budget.module.css";

function Budget({ expensesByCategory }) {
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.cardColumn}>
                    <Card title="Total Expenses" amount={200} />
                    <Card title="Total Income" amount={3000} />
                    <Card title="Remaining" amount={500} />
                </div>

                <div className={styles.chartArea}>
                    <PieChartExpense expensesByCategory={expensesByCategory} />
                </div>
            </div>

        </>
    );
}
export default Budget;
