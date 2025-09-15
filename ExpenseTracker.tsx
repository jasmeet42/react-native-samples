//Add new expense entries with category and amount
import { useState, useEffect } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Expense from "./model/Expense";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';
import { addExpense as dbAddExpense, loadExpenses, initDB } from "./database/expenseStorage";
import PieChart from 'react-native-pie-chart';
import ExpenseItem from "./components/ExpenseItem";

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

    // Calculate total per category for PieChart
    const categoryTotals = predefinedCategories.map(cat =>
        expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0)
    );
    const pieColors = predefinedCategories.map(cat => cat.color);
    // Convert to array of Slice objects for PieChart
    const pieSlices = categoryTotals.map((total, idx) => ({
        value: total,
        color: predefinedCategories[idx].color,
    }));

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.inputContainer}>
                <Picker
                    selectedValue={category}
                    onValueChange={setCategory}
                    style={{ flex: 1, marginRight: 10 }}
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


            <View style={{ flex: 1 }}>
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
                    <View style={{ alignItems: 'center', marginVertical: 20 }}>
                        <PieChart
                            widthAndHeight={250}
                            series={categoryTotals}
                            sliceColor={pieColors}
                            coverRadius={0.6}
                            coverFill={'#FFF'}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginVertical: 10 }}>
                            {predefinedCategories.map((cat, idx) => (
                                <View key={cat.name} style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                                    <View style={{ width: 20, height: 20, backgroundColor: cat.color, marginRight: 5 }} />
                                    <Text>{cat.name} (${categoryTotals[idx].toFixed(2)})</Text>
                                </View>
                            ))}
                        </View>
                    </View>}
            </View>
        </SafeAreaView>
    );
}
export default ExpenseTracker;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9'
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        backgroundColor: 'white'
    }
});
