
import PieChartExpense from '../PieChart.jsx';

function Transactions({expensesByCategory}) {
  return (
    <>
      <header >
        <h1>Transaction</h1>
      </header>
      <PieChartExpense expensesByCategory={expensesByCategory} />
    </>
  );
}

export default Transactions;