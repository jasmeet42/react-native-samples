//Add new expense entries with category and amount
import { useState, useEffect } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Expense from "../../model/Expense";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';
import { addExpense as dbAddExpense, loadExpenses, initDB } from "./database/expenseStorage";
import PieChart from 'react-native-pie-chart';
import ExpenseItem from "./ExpenseItem";

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const predefinedCategories = [{ name: 'Food', color: 'yellow' },
    { name: 'Transport', color: 'blue' }, { name: 'Shopping', color: 'green' }, { name: 'Bills', color: 'pink' }, { name: 'Other', color: 'black' }];

    useEffect(() => {
        initDB();
        loadExpenses(setExpenses);
    }, []);

    const handleAddExpense = () => {
        if (category && amount) {
            const newExpense: Expense = {
                id: Math.random().toString(),
                category,
                amount: parseFloat(amount),
                date: new Date()
            };
            dbAddExpense(newExpense, setExpenses);
            setCategory('');
            setAmount('');
        }
    };

    const categoryTotals = predefinedCategories.map(cat =>
        expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0)
    );
    
    const pieSlices = categoryTotals.map((total, idx) => ({
        value: total,
        color: predefinedCategories[idx].color,
    }));

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.inputSection}>
                    <Picker
                        selectedValue={category}
                        onValueChange={setCategory}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Select Category" value="" />
                        {predefinedCategories.map(cat => (
                            <Picker.Item key={cat.name} label={cat.name} value={cat.name} />
                        ))}
                    </Picker>
                    <TextInput
                        placeholder="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Button title="Add Expense" onPress={handleAddExpense} />
                </View>

                <View style={styles.expenseSection}>
                    {expenses.map(expense => (
                        <ExpenseItem
                            key={expense.id}
                            id={expense.id}
                            category={expense.category}
                            amount={expense.amount}
                            date={new Date(expense.date)}
                        />
                    ))}

                    {expenses.length > 0 &&
                        <View style={styles.chartSection}>
                            <PieChart
                                widthAndHeight={250}
                                series={pieSlices}
                            />
                            <View style={styles.legendSection}>
                                {predefinedCategories.map((cat, idx) => (
                                    <View key={cat.name} style={styles.legendItem}>
                                        <View style={{ width: 20, height: 20, backgroundColor: cat.color, marginRight: 5, borderRadius: 4 }} />
                                        <Text>{cat.name} (${categoryTotals[idx].toFixed(2)})</Text>
                                    </View>
                                ))}
                            </View>
                        </View>}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
export default ExpenseTracker;

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    inputSection: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2
    },
    picker: {
        flex: 1,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        backgroundColor: 'white'
    },
    expenseSection: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        elevation: 1
    },
    chartSection: {
        alignItems: 'center',
        marginVertical: 20
    },
    legendSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginVertical: 10
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5
    }
});
