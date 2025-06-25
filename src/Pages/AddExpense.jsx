// Page to allow user to add a new expense to the transaction list
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AddExpenseForm from "../features/transactions/AddExpenseForm";
import Loading from "../shared/Loading";
import Error from "../shared/Error";

function AddExpense({ handleAddExpense, categoryNames, isLoading, isError }) {
    const navigate = useNavigate();

    if (isLoading) return <Loading message="Loading expense form ..." />;

    if (isError.state) {
        return (
            <div style={{ marginTop: "200px", justifyContent: "center" }}>
                <Error message={isError.errorMessage} />
            </div>
        );
    }

    return (
        <>
            <div style={{ marginLeft: '35%' }}>
                {/* Breadcrumb-style Back Link */}
                <div
                    onClick={() => navigate('/transactions')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '100px',
                        gap: '0.5rem',
                        color: '#210629',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                    }}
                >
                    <FaArrowLeft />
                    <span>Back to Expenses</span>
                </div>

                {/* Add Expense Form */}
                <div>
                    <AddExpenseForm
                        handleAddExpense={handleAddExpense}
                        categoryNames={categoryNames}
                    />
                </div>
            </div>
        </>
    );
}

export default AddExpense;
