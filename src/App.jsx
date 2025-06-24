import { useState, useEffect, useMemo } from 'react'
import './App.css'

import Header from './Header.jsx'
import Navigation from './Navigation.jsx'
import Dashboard from './Pages/DashboardPage.jsx'
import Transactions from './Pages/Transactions.jsx'
import Budget from './Pages/Budget.jsx'
import AddExpenseForm from './AddExpenseForm.jsx'

import { format, subMonths, getMonth, getYear } from 'date-fns';
import { Routes, Route } from 'react-router-dom'

function App() {
  const [header, setHeader] = useState('Expense Tracker')
  const [transactions, setTransactions] = useState([])
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  // Loading states
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Error states
  const [isTransactionsError, setIsTransactionsError] = useState({ state: false, errorMessage: '', error: '' });
  const [isCategoriesError, setIsCategoriesError] = useState(false);


  const baseId = import.meta.env.VITE_BASE_ID;
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`
  const categoriesUrl = `https://api.airtable.com/v0/${baseId}/${import.meta.env.VITE_TABLE_CATEGORIES}`;
  const token = `Bearer ${import.meta.env.VIE_PAT}`

  function createOptions(method, records) {
    const opts = {
      method,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }
    if (records) {
      opts.body = JSON.stringify({ records })
    }
    return opts
  }

  useEffect(() => {
    async function fetchTodos() {
      try {
        setIsTransactionsLoading(true);
        const resp = await fetch(url, createOptions('GET'))
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}: ${resp.statusText || 'Unknown error'}`);
        }

        const { records } = await resp.json()

        const simplified = records.map((record) => ({
          id: record.id,
          ...record.fields
        }))

        setTransactions(simplified)
      } catch (error) {
        const message = error?.message?.trim() || error?.statusText || error?.toString() || fallbackMessage;
        setIsTransactionsError({ state: true, errorMessage: 'Error fetching transactions ', error: message })
      } finally {
        setIsTransactionsLoading(false);
      }
    }
    fetchTodos()
  }, [url, token])

  useEffect(() => {
    async function fetchTodos() {
      try {
        setIsCategoriesLoading(true);
        const resp = await fetch(categoriesUrl, createOptions('GET'))
        if (!resp.ok) throw new Error(resp.statusText)
        const { records } = await resp.json()

        const simplified = records.map(record => ({
          id: record.id,
          ...record.fields
        }));

        setBudgetCategories(simplified);
      } catch (error) {
        console.error('Error fetching budget categories:', error);
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    fetchTodos();
  }, [categoriesUrl, token]);

  const handleAddExpense = async (newExpense) => {
    const fields = {
      Date: newExpense.Date,
      Amount: newExpense.Amount,
      Category: newExpense.Category,
      Description: newExpense.Description
    }

    const options = createOptions('POST', [{ fields }]);

    try {
      const resp = await fetch(url, options);
    }
    catch (error) { }
  }

  async function handleEditExpense({ id, fields }) {
    const options = createOptions('PATCH', [{ id, fields }]);
    const resp = await fetch(url, options);
    if (!resp.ok) throw new Error(`Failed to edit expense: ${resp.statusText}`);
    const json = await resp.json();
    return json;
  }

  const monthOptions = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        name: format(date, 'MMMM yyyy'),
        value: { month: getMonth(date), year: getYear(date) },
      };
    }).reverse();
  }, []);

  useEffect(() => {
    const result = {};

    monthOptions.forEach(({ name, value }) => {
      const { income, expense } = transactions.reduce(
        (acc, txn) => {
          if (!txn.Date || txn.Amount == null) return acc;
          const amount = Number(txn.Amount);
          if (isNaN(amount) || amount === 0) return acc;
          const txnDate = new Date(txn.Date);
          if (isNaN(txnDate.getTime())) return acc;

          if (
            txnDate.getMonth() === value.month &&
            txnDate.getFullYear() === value.year
          ) {
            if (amount > 0) acc.income += amount;
            else acc.expense += Math.abs(amount);
          }
          return acc;
        },
        { income: 0, expense: 0 }
      );

      result[name] = {
        monthlyIncome: parseFloat(income.toFixed(2)),
        monthlyExpense: parseFloat(expense.toFixed(2)),
        monthlyRemaining: parseFloat((income - expense).toFixed(2)),
      };
    });

    setMonthlyData(result);
  }, [transactions, monthOptions]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setIncomeTotal(0);
      return;
    }

    const now = new Date();
    const currentMonth = getMonth(now);
    const currentYear = getYear(now);

    const totalIncome = transactions.reduce((acc, txn) => {
      const dateStr = txn.Date || txn.date;
      const amount = Number(txn.Amount || txn.amount || 0);
      if (amount <= 0) return acc;

      const dateObj = new Date(dateStr);
      if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
        return acc + amount;
      }
      return acc;
    }, 0);

    setIncomeTotal(totalIncome);
  }, [transactions]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    const result = {};

    transactions.forEach((txn) => {
      const amount = Number(txn.Amount || txn.amount || 0);
      const category = txn.Category || txn.category || 'Other';
      const txnDate = new Date(txn.Date || txn.date);
      const monthLabel = format(txnDate, 'MMMM yyyy');

      if (amount < 0) {
        if (!result[monthLabel]) {
          result[monthLabel] = {};
        }
        result[monthLabel][category] = (result[monthLabel][category] || 0) + Math.abs(amount);
      }
    });

    const formattedResult = {};
    for (const [month, categories] of Object.entries(result)) {
      formattedResult[month] = Object.entries(categories).map(([name, amount]) => ({
        name,
        amount: parseFloat(amount.toFixed(2)),
      }));
    }

    setExpensesByCategory(formattedResult);
  }, [transactions]);

  function getCategoryNames(budgetCategories) {
    return budgetCategories.map(category => category.name);
  }

  const categoryNames = getCategoryNames(budgetCategories);
  const currentMonthLabel = format(new Date(), 'MMMM yyyy');
  const remaining = monthlyData[currentMonthLabel]?.monthlyRemaining || 0;

  return (
    <>
      <Header header={header} />
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              transactions={transactions}
              monthOptions={monthOptions}
              incomeTotal={incomeTotal}
              balance={remaining}
              expensesByCategory={expensesByCategory}
              isLoading={isTransactionsLoading}
              isError={isTransactionsError}
            />
          }
        />
        <Route
          path="/transactions"
          element={
            <Transactions
              transactions={transactions}
              handleEditExpense={handleEditExpense}
              categoryNames={categoryNames}
              isLoading={isTransactionsLoading}
            />
          }
        />
        <Route
          path="/budget/*"
          element={
            <Budget
              incomeData={monthlyData}
              categoryData={expensesByCategory}
              budgetCategories={budgetCategories}
              isLoading={isCategoriesLoading || isTransactionsLoading}
            />
          }
        />
        <Route
          path="/addExpense"
          element={
            <AddExpenseForm
              handleAddExpense={handleAddExpense}
              categoryNames={categoryNames}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App
