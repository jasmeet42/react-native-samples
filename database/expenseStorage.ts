import SQLite from 'react-native-sqlite-storage';
import Expense from '../model/Expense';

const db = SQLite.openDatabase(
  { name: 'expenses.db', location: 'default' },
  () => { console.log('Database opened'); },
  (error: any) => { console.error(error); }
);

export const initDB = () => {
db.transaction((tx: SQLite.Transaction) => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS expenses (id TEXT PRIMARY KEY, category TEXT, amount REAL, date TEXT);'
    );
});
};

export const loadExpenses = (setExpenses: (expenses: any[]) => void) => {
  db.transaction((tx : SQLite.Transaction) => {
    tx.executeSql('SELECT * FROM expenses ORDER BY date DESC;', [], (tx : SQLite.Transaction, results: SQLite.ResultSet) => {
      const rows = results.rows;
      let loadedExpenses = [];
      for (let i = 0; i < rows.length; i++) {
        loadedExpenses.push(rows.item(i));
      }
      setExpenses(loadedExpenses);
    });
  });
};

export const addExpense = (expense: Expense, setExpenses: (expenses: Expense[]) => void) => {
  db.transaction((tx : SQLite.Transaction)  => {
    tx.executeSql(
      'INSERT INTO expenses (id, category, amount, date) VALUES (?, ?, ?, ?);',
      [expense.id, expense.category, expense.amount, expense.date],
      () => {
        loadExpenses(setExpenses);
      }
    );
  });
};