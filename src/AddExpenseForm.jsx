import React, { useState } from 'react';
import styles from './AddExpenseForm.module.css';

/**
 * AddExpenseForm Component
 *
 * Renders a form to add a new expense with fields for date, amount,
 * category selection, and optional description.
 *
 * Props:
 * - handleAddExpense: async function that accepts an expense object of shape
 *   { Date: string, Amount: number, Category: string, Description: string }
 * - categoryNames: array of strings representing available category names
 *
 * Features:
 * - Validates amount to be positive number
 * - Select dropdown for categories populated from categoryNames array
 * - Shows "Saving..." state on submit while awaiting handleAddExpense
 * - Displays success or error messages
 */
function AddExpenseForm({ handleAddExpense, categoryNames}) {
  // Helper function to get today's date in local timezone as YYYY-MM-DD
  const getTodayLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Form state to hold input values
  const [formData, setFormData] = useState({
    Date: getTodayLocalDate(), // default to today in local timezone
    Amount: '',
    Category: categoryNames.length > 0 ? categoryNames[0] : '', // default to first category if available
    Description: ''
  });

  console.log('formData', formData);

  // Local UI state for save button and messages
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * handleChange - Updates form data on input change
   * Allows only numeric input for Amount field with optional decimal
   */
  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'Amount') {
      // Regex to allow empty input or valid positive decimal number format
      if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  /**
   * handleSubmit - Handles form submission
   * Validates inputs, calls parent handler, and manages UI states
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation for amount and category
    if (!formData.Amount || isNaN(parseFloat(formData.Amount)) || parseFloat(formData.Amount) <= 0) {
      setError('Please enter a valid positive amount');
      setSuccess(false);
      return;
    }
    if (!formData.Category) {
      setError('Please select a category');
      setSuccess(false);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare expense object with correct data types
      // Make income positive, all other categories negative
      const amount = parseFloat(formData.Amount);
      const finalAmount = formData.Category.toLowerCase() === 'income' ? Math.abs(amount) : -Math.abs(amount);
      
      const expenseToAdd = {
        Date: formData.Date,
        Amount: finalAmount,
        Category: formData.Category,
        Description: formData.Description.trim()
      };

      // Await saving expense via parent function
      await handleAddExpense(expenseToAdd);

      // On success, show success message and reset amount & description fields
      setSuccess(true);
      setFormData((prev) => ({
        ...prev,
        Amount: '',
        Description: ''
      }));
    } catch (err) {
      // Show error message on failure
      setError('Failed to save expense, please try again.');
      setSuccess(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit}>
      <h2 className={styles.formHeading}>Add New Expense</h2>

      {/* Date input */}
      <div className={styles.formGroup}>
        <label htmlFor="Date" className={styles.formLabel}>Date</label>
        <input
          type="date"
          id="Date"
          name="Date"
          value={formData.Date}
          onChange={handleChange}
          className={styles.formInput}
          required
        />
      </div>

      {/* Amount input */}
      <div className={styles.formGroup}>
        <label htmlFor="Amount" className={styles.formLabel}>Amount</label>
        <input
          type="text"
          id="Amount"
          name="Amount"
          value={formData.Amount}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="Enter amount"
          required
        />
      </div>

      {/* Category select */}
      <div className={styles.formGroup}>
        <label htmlFor="Category" className={styles.formLabel}>Category</label>
        <select
          id="Category"
          name="Category"
          value={formData.Category}
          onChange={handleChange}
          className={styles.formSelect}
          required
        >
          {categoryNames.map((catName, i) => (
            <option key={i} value={catName}>
              {catName}
            </option>
          ))}
        </select>
      </div>

      {/* Description input */}
      <div className={styles.formGroup}>
        <label htmlFor="Description" className={styles.formLabel}>Description</label>
        <input
          type="text"
          id="Description"
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="Optional description"
        />
      </div>

      {/* Submit button */}
      <button type="submit" className={styles.submitButton} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Add Expense'}
      </button>

      {/* Feedback messages */}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>Expense added successfully!</p>}
    </form>
  );
}

export default AddExpenseForm;