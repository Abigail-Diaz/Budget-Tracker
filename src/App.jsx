import { useState, useEffect } from 'react'
import './App.css'

import Header from './Header.jsx'
import Navigation from './Navigation.jsx'
import Dashboard from './Pages/DashboardPage.jsx'
import Transactions from './Pages/Transactions.jsx'
import Budget from './Pages/Budget.jsx'

import { getMonth, getYear } from 'date-fns';

import { Routes, Route, Router } from 'react-router-dom'


function App() {
  const [header, setHeader] = useState('Dashboard')
  const [transactions, setTransactions] = useState([])
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState({});

  // Airtable API constants
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`
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

        const simplified = records.map((record) => record.fields)

        setTransactions(simplified)
      } catch (error) {
      }
    }

    fetchTodos()
  }, [url, token])


  // Obtain the total income for the current month
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

  // Calculate amounts by category
  useEffect(() => {

    async function fetchExpenses() {
      try {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const totals = transactions.reduce((acc, txn) => {
          const amount = Number(txn.Amount || txn.amount || 0);
          const category = txn.Category || txn.category || 'Other';

          const txnDate = new Date(txn.Date || txn.date);
          const txnMonth = txnDate.getMonth();
          const txnYear = txnDate.getFullYear();

          // Calculate based on current month and year
          if (amount < 0 && txnMonth === currentMonth && txnYear === currentYear) {
            acc[category] = (acc[category] || 0) + Math.abs(amount);
          }

          return acc;
        }, {});

        setExpensesByCategory(totals);
      } catch (err) {
        console.error('Error loading recent expenses:', err);
      }
    }

    fetchExpenses();
  }, [transactions]);


  return (
    <>
      <Header header = {header} />
      <Navigation setHeader={setHeader}/>
      <Routes>
        <Route path="/" element={<Dashboard transactions={transactions}
          incomeTotal={incomeTotal} balance={balance} expensesByCategory={expensesByCategory} />} />
        <Route path="/transactions" element={<Transactions expensesByCategory={expensesByCategory} transactions={transactions}/>} />
        <Route path = "/budget" element={<Budget expensesByCategory={expensesByCategory}/>}/>
      </Routes></>

  )
}

export default App
