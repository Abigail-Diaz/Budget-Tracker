import MonthlyExpenseGraph from "../features/dashboard/MonthlyExpenseGraph.jsx";
import Card from "../shared/Card.jsx";
import RecentExpensesList from "../features/dashboard/RecentExpensesList.jsx";
import Footer from "../layout/Footer.jsx";
import Loading from "../shared/Loading.jsx";
import styles from "./Dashboard.module.css";
import Error from "../shared/Error.jsx";

import { format } from 'date-fns';

function Dashboard({
  transactions,
  incomeTotal,
  balance,
  expensesByCategory,
  monthOptions,
  isLoading,
  isError,
}) {
  const now = new Date();
  const currentMonthLabel = format(now, 'MMMM yyyy');

  if (isLoading) return <Loading message="Loading Dashboard ..." />;
  if (isError.state)
    return (
      <div style={{ marginTop: "200px", justifyContent: "center" }}>
        <Error message={isError.errorMessage} />
      </div>
    );

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.cardColumn}>
          <Card title={"Total Income"} amount={incomeTotal} />
          <Card title={"Remaining"} amount={balance} />
        </div>
        <div className={styles.chartArea}>
          <MonthlyExpenseGraph
            transactions={transactions}
            monthOptions={monthOptions}
          />
        </div>
      </div>
      <RecentExpensesList
        expensesByCategory={expensesByCategory[currentMonthLabel]}
      />
      <Footer />
    </>
  );
}

export default Dashboard;
