// Page to allow user to add a new expense to the transaction list
import AddExpenseForm from "../AddExpenseForm";
import Loading from "../Loading";

function AddExpense({handleAddExpense, categoryNames, isLoading, isError}) {
    if (isLoading) return <Loading message = 'Loading expense form ... '/>
    if (isError.state)
    return (
      <div style={{ marginTop: "200px", justifyContent: "center" }}>
        <Error message={isError.errorMessage} />
      </div>
    );
    return (
        <>
            <div style = {{marginLeft: '35%'}}>
                <AddExpenseForm handleAddExpense={handleAddExpense}
                    categoryNames={categoryNames}/>
            </div>
        </>
    )
}

export default AddExpense;