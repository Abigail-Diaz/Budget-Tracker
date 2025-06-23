import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseISO } from 'date-fns';
import styles from './TransactionList.module.css';
import Button from './Button.jsx';

const ITEMS_PER_PAGE = 20;

/**
 * TransactionList Component
 *
 * Displays a paginated list of transactions with dates, categories, and amounts.
 * Allows editing individual transactions by clicking on them.
 * Shows paginated view using ?page= query param.
 */
function TransactionList({ transactions, handleEditExpense }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingId, setEditingId] = useState(null); // ID of the currently edited transaction
  const [editFormData, setEditFormData] = useState({}); // Form state for current edit
  const [isSaving, setIsSaving] = useState(false); // Saving state
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const pageParam = parseInt(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(pageParam, totalPages || 1));

  // Slice the transactions for current page
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    const sorted = [...transactions].sort((a, b) => {
      const dateA = a.Date ? parseISO(a.Date) : new Date(a.date);
      const dateB = b.Date ? parseISO(b.Date) : new Date(b.date);
      return dateB - dateA;
    });

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setFilteredTransactions(sorted.slice(start, end));
  }, [transactions, currentPage]);

  // Change the page in the URL
  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setSearchParams({ page: validPage });
  };

  // Start editing a transaction
  const handleEditClick = (txn, index) => {
    // Use a combination of id and index to ensure uniqueness
    const uniqueId = txn.id || `temp-${index}`;
    setEditingId(uniqueId);
    setEditFormData({
      Date: txn.Date,
      Amount: txn.Amount,
      Category: txn.Category,
      Description: txn.Description || '',
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit edit
  const handleSave = async () => {
    if (!editingId) return;

    setIsSaving(true);
    try {
      const fields = {
        Date: editFormData.Date,
        Amount: parseFloat(editFormData.Amount),
        Category: editFormData.Category,
        Description: editFormData.Description,
      };

      // Find the original transaction to get its Airtable ID
      const originalTransaction = filteredTransactions.find(txn => {
        const uniqueId = txn.id || `temp-${filteredTransactions.indexOf(txn)}`;
        return uniqueId === editingId;
      });

      if (!originalTransaction || !originalTransaction.id) {
        throw new Error('Cannot find transaction ID for editing');
      }

      await handleEditExpense({ id: originalTransaction.id, fields });
      setEditingId(null);
      setEditFormData({});
    } catch (err) {
      console.error('Failed to update transaction:', err);
      alert('Failed to update transaction. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.transactionListContainer}>
      <h2 className={styles.transactionListHeader}>Expenses</h2>

      {/* Column Headers */}
      {filteredTransactions.length > 0 && (
        <div className={styles.columnHeaders}>
          <div className={styles.headerDate}>Date</div>
          <div className={styles.headerCategory}>Category</div>
          <div className={styles.headerDescription}>Description</div>
          <div className={styles.headerAmount}>Amount</div>
        </div>
      )}

      {filteredTransactions.length === 0 ? (
        <p style={{ color: '#7a739c', fontStyle: 'italic' }}>No transactions to display.</p>
      ) : (
        filteredTransactions.map((txn, index) => {
          // Create consistent unique identifier
          const uniqueId = txn.id || `temp-${index}`;
          const isEditing = editingId === uniqueId;
          const amount = Number(txn.Amount || 0);
          const dateObj = txn.Date ? parseISO(txn.Date) : new Date();
          const formattedDate = dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={uniqueId}
              className={styles.transactionItem}
              onClick={() => !editingId && handleEditClick(txn, index)}
            >
              {isEditing ? (
                <>
                  <div className={styles.editForm}>
                    <input
                      type="date"
                      name="Date"
                      value={editFormData.Date}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                    <input
                      type="text"
                      name="Category"
                      value={editFormData.Category}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="Category"
                    />
                    <input
                      type="text"
                      name="Description"
                      value={editFormData.Description}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      name="Amount"
                      value={editFormData.Amount}
                      onChange={handleChange}
                      className={styles.formInput}
                      step="0.01"
                      placeholder="Amount"
                    />
                  </div>

                  <div className={styles.buttonRow}>
                    <button 
                      className={styles.saveButton}
                      onClick={handleSave} 
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      className={styles.cancelButton}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.transactionDate}>{formattedDate}</div>
                  <div className={styles.transactionCategory}>
                    {txn.Category || 'Uncategorized'}
                  </div>
                  <div className={styles.transactionDescription}>
                    {txn.Description || 'No description'}
                  </div>
                  <div
                    className={`${styles.transactionAmount} ${
                      amount < 0 ? styles.negative : styles.positive
                    }`}
                  >
                    {amount < 0 ? '-' : '+'}${Math.abs(amount).toFixed(2)}
                  </div>
                </>
              )}
            </div>
          );
        })
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className={styles.paginationControls}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {/* Add Expense Button */}
      <div className={styles.addExpenseWrapper}>
        <Button path="/addExpense">Add Expense</Button>
      </div>
    </div>
  );
}

export default TransactionList;