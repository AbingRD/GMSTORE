import React, { createContext, useState } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [transactionNumber, setTransactionNumber] = useState(1); // auto increment

  const addTransaction = (txn) => {
    setTransactions(prev => [
      ...prev,
      { ...txn, id: transactionNumber } // assign transaction number as ID
    ]);
    setTransactionNumber(prev => prev + 1); // increment for next transaction
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, transactionNumber }}>
      {children}
    </TransactionContext.Provider>
  );
};
