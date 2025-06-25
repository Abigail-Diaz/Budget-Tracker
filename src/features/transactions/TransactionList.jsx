import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { parseISO } from "date-fns";
import styles from "./TransactionList.module.css";
import Button from "./Button.jsx";

const ITEMS_PER_PAGE = 20;

/**
 * TransactionList Component
 *
 * Displays a paginated list of transactions with dates, categories, and amounts.
 * Allows editing individual transactions by clicking on them.
 * Shows paginated view using ?page= query param.
 */
function TransactionList({ transactions, handleEditExpense, categoryNames }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const pageParamRaw = searchParams.get("page");
  let pageParamNum = parseInt(pageParamRaw, 10);
  const pageParam =
    Number.isNaN(pageParamNum) || pageParamNum < 1 ? 1 : pageParamNum;

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(pageParam, totalPages || 1);

  // Update filtered transactions whenever transactions or currentPage change
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    // Sort transactions descending by date
    const sorted = [...transactions].sort((a, b) => {
      const dateA = a.Date ? parseISO(a.Date) : new Date(a.date);
      const dateB = b.Date ? parseISO(b.Date) : new Date(b.date);
      return dateB - dateA;
    });

    // Slice transactions for current page
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setFilteredTransactions(sorted.slice(start, end));
  }, [transactions, currentPage]);

  // Change the page in the URL query param
  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setSearchParams({ page: validPage.toString() });
  };

  // Generate consistent unique identifier for each transaction
  const getUniqueId = useCallback((txn) => {
    if (txn.id !== null && txn.id !== undefined) return txn.id;
    const dateStr = txn.Date || txn.date || "";
    return `${dateStr}-${txn.Category || ""}`;
  }, []);

  // Start editing a transaction
  const handleEditClick = (txn) => {
    const uniqueId = getUniqueId(txn);
    setEditingId(uniqueId);
    setEditFormData({
      Date: txn.Date,
      Amount:
        txn.Amount !== null && txn.Amount !== undefined
          ? txn.Amount.toString()
          : "",
      Category: txn.Category || "",
      Description: txn.Description || "",
    });
  };

  // Cancel editing mode and clear form data
  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Update form fields during editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit edited transaction
  const handleSave = async () => {
    if (!editingId) return;

    setIsSaving(true);
    try {
      const amountNum = parseFloat(editFormData.Amount);
      if (Number.isNaN(amountNum)) {
        alert("Please enter a valid number for Amount");
        setIsSaving(false);
        return;
      }

      const fields = {
        Date: editFormData.Date,
        Amount: amountNum,
        Category: editFormData.Category,
        Description: editFormData.Description,
      };

      const originalTransaction = filteredTransactions.find((txn) => {
        return getUniqueId(txn) === editingId;
      });

      if (
        !originalTransaction ||
        originalTransaction.id === null ||
        originalTransaction.id === undefined
      ) {
        throw new Error("Cannot find transaction ID for editing");
      }

      await handleEditExpense({ id: originalTransaction.id, fields });

      setEditingId(null);
      setEditFormData({});
    } catch (err) {
      console.error("Failed to update transaction:", err);
      alert("Failed to update transaction. Please try again.");
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

      {/* Show message if no transactions */}
      {filteredTransactions.length === 0 ? (
        <p style={{ color: "#7a739c", fontStyle: "italic" }}>
          No transactions to display.
        </p>
      ) : (
        filteredTransactions.map((txn) => {
          const uniqueId = getUniqueId(txn);
          const isEditing = editingId === uniqueId;
          const amount = Number(
            txn.Amount !== null && txn.Amount !== undefined ? txn.Amount : 0
          );
          const dateObj = txn.Date ? parseISO(txn.Date) : new Date();
          const formattedDate = dateObj.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={uniqueId}
              className={styles.transactionItem}
              onClick={() => !editingId && handleEditClick(txn)}
            >
              {isEditing ? (
                <>
                  <div className={styles.editForm}>
                    <label htmlFor="date">Date</label>
                    <input
                      id="date"
                      type="date"
                      name="Date"
                      value={editFormData.Date}
                      onChange={handleChange}
                      className={styles.formInput}
                    />

                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="Category"
                      value={editFormData.Category}
                      onChange={handleChange}
                      className={styles.formInput}
                    >
                      <option value="">Select Category</option>
                      {categoryNames &&
                        categoryNames.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>

                    <label htmlFor="description">Description</label>
                    <input
                      id="description"
                      type="text"
                      name="Description"
                      value={editFormData.Description}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="Description"
                    />

                    <label htmlFor="amount">Amount</label>
                    <input
                      id="amount"
                      type="number"
                      name="Amount"
                      value={editFormData.Amount}
                      onChange={handleChange}
                      className={styles.formInput}
                      step="0.01"
                      placeholder="Amount"
                    />
                  </div>

                  {/* Save and Cancel buttons */}
                  <div className={styles.buttonRow}>
                    <button
                      className={styles.saveButton}
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
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
                    {txn.Category || "Uncategorized"}
                  </div>
                  <div className={styles.transactionDescription}>
                    {txn.Description || "No description"}
                  </div>
                  <div
                    className={`${styles.transactionAmount} ${
                      amount < 0 ? styles.negative : styles.positive
                    }`}
                  >
                    {amount < 0 ? "-" : "+"}${Math.abs(amount).toFixed(2)}
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
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
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
