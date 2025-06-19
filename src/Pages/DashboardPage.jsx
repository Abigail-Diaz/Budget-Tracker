import Navigation from '../Navigation.jsx';
import Header from '../Header.jsx';
import MonthlyExpenseGraph from '../MonthlyExpenseGraph.jsx';

function Dashboard({ header, transactions }) {
  console.log("Dashboard component rendered");
  return (
    <>
      <Header header={header} />
      <Navigation />
      <div style={{ justifyContent: 'center', margin: '1rem' }}>
        <MonthlyExpenseGraph transactions={transactions} />
      </div>
    </>
  );
}

export default Dashboard;