
import TransactionList from '../TransactionList.jsx';
import Loading from '../Loading.jsx';

function Transactions({ transactions, handleEditExpense, categoryNames, isLoading }) {
  
  if (isLoading) return <Loading message = "Loading Transactions..."/>
  
  return (
    <>
      <div>
        <TransactionList transactions={transactions} handleEditExpense={handleEditExpense} categoryNames = {categoryNames}/>
      </div>

    </>
  );
}

export default Transactions;