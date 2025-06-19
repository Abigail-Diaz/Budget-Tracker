import { useState, useEffect } from 'react'
import './App.css'
import PageBackground from './PageBackground.jsx'
import Dashboard from './Pages/DashboardPage.jsx'
import MonthlyExpensesChart from './MonthlyExpensesChart.jsx'
import BalanceSummary from './BalanceSummary.jsx'
import RecentExpensesList from './RecentExpensesList.jsx'

function App() {
  const [header, setHeader] = useState('Dashboard')
  const [transactions, setTransactions] = useState([])

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

        // Optional: Extract only the `fields` from each record
        const simplified = records.map((record) => record.fields)

        setTransactions(simplified)
        console.log('Fetched transactions:', simplified)
      } catch (error) {
        console.error('Error fetching Airtable data:', error)
      }
    }

    fetchTodos()
  }, [url, token])

  return (
      <Dashboard header = {header} transactions = {transactions}/>
  )
}

export default App
