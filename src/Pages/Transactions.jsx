
import TransactionList from '../features/dashboard/TransactionList.jsx';
import Loading from '../shared/Loading.jsx';
import Error from '../shared/Error.jsx';

function Transactions({ transactions, handleEditExpense, categoryNames, isLoading, isError }) {

  if (isLoading) return <Loading message="Loading Expenses ..." />
  if (isError.state)
    return (
      <div style={{ marginTop: "200px", justifyContent: "center" }}>
        <Error message={isError.errorMessage} />
      </div>
    );

  return (
    <>
      <div>
        <TransactionList transactions={transactions} handleEditExpense={handleEditExpense} categoryNames={categoryNames} />
      </div>
    </>
  );
}

export default Transactions;