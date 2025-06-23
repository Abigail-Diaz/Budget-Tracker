import Navigation from '../Navigation.jsx';
import Header from '../Header.jsx';
import MonthlyExpenseGraph from '../MonthlyExpenseGraph.jsx';
import Card from '../Card.jsx';
import RecentExpensesList from '../RecentExpensesList.jsx';
import Footer from '../Footer.jsx';
import Loading from '../Loading.jsx';
import styles from './Dashboard.module.css';

function Dashboard({ transactions, incomeTotal, balance, expensesByCategory, monthOptions, isLoading }) {
  const currentMonth = 'June 2025';

  if (isLoading) return <Loading message="Loading Dashboard ..." />;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.cardColumn}>
          <Card title={'Total Income'} amount={incomeTotal} />
          <Card title={'Remaining'} amount={balance} />
        </div>
        <div className={styles.chartArea}>
          <MonthlyExpenseGraph transactions={transactions} monthOptions={monthOptions} />
        </div>
      </div>
      <RecentExpensesList expensesByCategory={expensesByCategory[currentMonth]} />
      <Footer />
    </>
  );
}

export default Dashboard;
