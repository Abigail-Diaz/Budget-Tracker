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
  const [balance, setBalance] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  // Airtable API constants
  const baseId = import.meta.env.VITE_BASE_ID;
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`
  const categoriesUrl = `https://api.airtable.com/v0/${baseId}/${import.meta.env.VITE_TABLE_CATEGORIES}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`

  // Helper function to create fetch options
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

  // Fetch transactions from Airtable on mount
  useEffect(() => {
    async function fetchTodos() {
      try {
        const resp = await fetch(url, createOptions('GET'))
        if (!resp.ok) throw new Error(resp.statusText)
        const { records } = await resp.json()

        // Include the Airtable record ID
        const simplified = records.map((record) => ({
          id: record.id,  //  Airtable record ID needed for editing
          ...record.fields
        }))

        setTransactions(simplified)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    fetchTodos()
  }, [url, token])

  // Fetch budget categories from Airtable on mount
  useEffect(() => {
    async function fetchTodos() {
      try {
        const resp = await fetch(categoriesUrl, createOptions('GET'))
        if (!resp.ok) throw new Error(resp.statusText)
        const { records } = await resp.json()

        //  include Airtable's id, and fields name and amount in a single object
        const simplified = records.map(record => ({
          id: record.id,
          ...record.fields
        }));

        setBudgetCategories(simplified);
      } catch (error) {
        console.error('Error fetching budget categories:', error);
      }
    }

    fetchTodos();
  }, [categoriesUrl, token]);

  // Add a new category
  const handleAddCategory = async (newCategory) => {
    const fields = { name: newCategory.name, amount: newCategory.amount }

    // Obtain the json transalation
    const options = createOptions('POST', [{ fields }]);

    try {
      // Add the category to Airtable
      const resp = await fetch(categoriesUrl, options);
    }
    catch (error) {
    }
  }

  // add a new expense (transaction)
  const handleAddExpense = async (newExpense) => {
    const fields = {
      Date: newExpense.Date,        
      Amount: newExpense.Amount,
      Category: newExpense.Category,
      Description: newExpense.Description
    }

    // Obtain the json transalation
    const options = createOptions('POST', [{ fields }]);

    try {
      // Add the category to Airtable
      const resp = await fetch(url, options);
    }
    catch (error) {
    }
  }

  //handleAddExpense();

  /*   // edit categories
    const handleEditCategory = async (editedCategories) => {
      const records = editedCategories.map(category => ({
        id: category.id,
        fields: {
          name: category.name,
          amount: category.amount,
        },
      }));
  
      // Pass the array directly
      const options = createOptions('PATCH', records);
  
      try {
        const resp = await fetch(categoriesUrl, options);
        if (!resp.ok) throw new Error(`Failed to update: ${resp.status}`);
        const data = await resp.json();
        console.log('Updated categories:', data);
      } catch (error) {
        console.error('Error updating categories:', error);
      }
    }; */


  // Edit an existing expense by ID
  async function handleEditExpense({ id, fields }) {

    const options = createOptions('PATCH', [{ id, fields }]);

    const resp = await fetch(url, options);
    if (!resp.ok) throw new Error(`Failed to edit expense: ${resp.statusText}`);
    const json = await resp.json();
    return json;
  }

  const monthOptions = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i); // start from i = 0 for current month
      return {
        name: format(date, 'MMMM yyyy'),
        value: { month: getMonth(date), year: getYear(date) },
      };
    }).reverse(); // so current month shows up last
  }, []);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setMonthlyData({});
      return;
    }

    const result = {};

    monthOptions.forEach(({ name, value }) => {
      // For each month, sum income and expenses using reduce
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
            if (amount > 0) {
              acc.income += amount;
            } else if (amount < 0) {
              acc.expense += Math.abs(amount);
            }
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

  //Obtain the total income for the current month
  //Note: Income is in the transactions list
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setIncomeTotal(0);
      return;
    }
    // Get the current month and year
    const now = new Date();
    const currentMonth = getMonth(now);
    const currentYear = getYear(now);

    // Calculate total income for the current month
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

  // Obtain the total balance in the account
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setBalance(0);
      return;
    }

    // Calculate total balance by summing all amounts
    const totalBalance = transactions.reduce((acc, txn) => {
      const amount = Number(txn.Amount || txn.amount || 0);
      return acc + amount;
    }, 0);

    setBalance(totalBalance);
  }, [transactions]);

  // Calculate amounts by category on each month

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    const result = {};

    transactions.forEach((txn) => {
      const amount = Number(txn.Amount || txn.amount || 0);
      const category = txn.Category || txn.category || 'Other';
      const txnDate = new Date(txn.Date || txn.date);
      const monthLabel = format(txnDate, 'MMMM yyyy');

      // Only process expenses (negative amounts)
      if (amount < 0) {
        if (!result[monthLabel]) {
          result[monthLabel] = {};
        }
        result[monthLabel][category] = (result[monthLabel][category] || 0) + Math.abs(amount);
      }
    });

    // Convert inner objects to arrays like [{ name, amount }]
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
        <Route path="/" element={<Dashboard transactions={transactions} monthOptions={monthOptions}
          incomeTotal={incomeTotal} balance={remaining} expensesByCategory={expensesByCategory} />} />
        <Route path="/transactions" element={<Transactions transactions={transactions} handleEditExpense={handleEditExpense} categoryNames={categoryNames} />} />
        <Route path="/budget/*" element={<Budget incomeData={monthlyData} categoryData={expensesByCategory} budgetCategories={budgetCategories} />} />
        <Route path='/addExpense' element={<AddExpenseForm handleAddExpense={handleAddExpense} categoryNames={categoryNames} />} />
      </Routes></>
  )
}

export default App
