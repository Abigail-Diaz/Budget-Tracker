import React, { useEffect, useState } from 'react';
import styles from './BalanceSummary.module.css';

// Display the total balance
// Note: transactions include both income and expenses, therefore 
// the balance is simply the sum of all amounts
function BalanceSummary({ transactions }) {
  const [balance, setBalance] = useState(0);

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

  return (
    <div className={styles.balanceCard}>
      <h3>Total Account Balance</h3>
      <p>${balance.toFixed(2)}</p>
    </div>
  );
}

export default BalanceSummary;