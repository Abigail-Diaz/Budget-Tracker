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
 * Allows navigating through pages using URL query parameters (?page=1, ?page=2).
 * Includes a button to add a new expense.
 *
 * Props:
 * - transactions: array of transaction objects from Airtable
 */
function TransactionList({ transactions }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get('page')) || 1;
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Calculate current page (safe fallback in case of bad input)
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(pageParam, totalPages || 1));

  // Paginate the transactions whenever current page or source data changes
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

    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    setFilteredTransactions(sorted.slice(startIdx, endIdx));
  }, [transactions, currentPage]);

  // Navigate to a specific page (updates URL)
  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setSearchParams({ page: validPage });
  };

  return (
    <div className={styles.transactionListContainer}>
      <h2 className={styles.transactionListHeader}>Expenses</h2>

      {filteredTransactions.length === 0 ? (
        <p style={{ color: '#7a739c', fontStyle: 'italic' }}>No transactions to display.</p>
      ) : (
        filteredTransactions.map((txn, index) => {
          const dateObj = txn.Date ? parseISO(txn.Date) : new Date(txn.date);
          const formattedDate = dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          const amount = Number(txn.Amount || txn.amount || 0);
          const amountClass = amount < 0 ? styles.negative : styles.positive;

          return (
            <div key={index} className={styles.transactionItem}>
              <div className={styles.transactionDate}>{formattedDate}</div>
              <div className={styles.transactionDescription}>{txn.Category || txn.description || 'No description'}</div>
              <div className={`${styles.transactionAmount} ${amountClass}`}>
                {amount < 0 ? '-' : '+'}${Math.abs(amount).toFixed(2)}
              </div>
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

      {/* Add expense button */}
      <div className={styles.addExpenseWrapper}>
        <Button path="/addExpense">Add Expense</Button>
      </div>
    </div>
  );
}

export default TransactionList;
