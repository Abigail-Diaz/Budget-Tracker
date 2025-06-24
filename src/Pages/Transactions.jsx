
import TransactionList from '../TransactionList.jsx';
import Loading from '../Loading.jsx';
import Error from '../Error.jsx';

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