import { StyleSheet, Text, View } from "react-native";
import Expense from "../model/Expense";
import React from "react";
const ExpenseItem = React.memo(({category,amount,date}: Expense) => {
    return (
        <View style={styles.item}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.amount}>${amount.toFixed(2)}</Text>
            <Text style={styles.date}>{date.toDateString()}</Text>
        </View>
    );
}
);

export default ExpenseItem;
const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white'
    },
    category: {
        fontSize: 16,   
        fontWeight: '500',
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: 'green'
    },
    date: {
        fontSize: 14,
        color: '#555',
    }
});
