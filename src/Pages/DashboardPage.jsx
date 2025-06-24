import MonthlyExpenseGraph from "../MonthlyExpenseGraph.jsx";
import Card from "../Card.jsx";
import RecentExpensesList from "../RecentExpensesList.jsx";
import Footer from "../Footer.jsx";
import Loading from "../Loading.jsx";
import styles from "./Dashboard.module.css";
import Error from "../Error.jsx";

function Dashboard({
  transactions,
  incomeTotal,
  balance,
  expensesByCategory,
  monthOptions,
  isLoading,
  isError,
}) {
  const currentMonth = "June 2025";

  if (isLoading) return <Loading message="Loading Dashboard ..." />;
  if (isError.state)
    return (
      <div style={{ marginTop: "200px", justifyContent: "center" }}>
        <Error message={isError.errorMessage} error={isError.error} />
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
        expensesByCategory={expensesByCategory[currentMonth]}
      />
      <Footer />
    </>
  );
}

export default Dashboard;
