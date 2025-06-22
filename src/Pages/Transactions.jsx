
import TransactionList from '../TransactionList.jsx';
function Transactions({ transactions }) {
  return (
    <>
      <div>
        <TransactionList transactions={transactions} />
      </div>

    </>
  );
}

export default Transactions;