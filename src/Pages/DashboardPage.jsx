import Navigation from '../Navigation.jsx';
import Header from '../Header.jsx';
import MonthlyExpenseGraph from '../MonthlyExpenseGraph.jsx';
import Card from '.././Card.jsx';
import RecentExpensesList from '../RecentExpensesList.jsx';
import Footer from '../Footer.jsx'
import styles from './Dashboard.module.css';

function Dashboard({ header, transactions, incomeTotal, balance, expensesByCategory }) {
  return (
    <>
      <Header header={header} />
      <Navigation />
      <div >
        <MonthlyExpenseGraph transactions={transactions} />
        <div className={styles.cardRow}>
          <Card title = {'Total Income '} amount={incomeTotal} />
          <Card title = {'Balance'} amount = {balance} />
          <RecentExpensesList expensesByCategory={expensesByCategory} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
