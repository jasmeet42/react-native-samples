import { Image, StyleSheet, Text, View } from "react-native";
import Product from "../model/Product";
import React from "react";


const ProductItem = React.memo(({thumbnail,title,price}: Product) => {
    return (
        <View style={styles.box}>
            <Image source={{ uri: thumbnail }} style={{ width: 100, height: 100 }} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>${price}</Text>
        </View>
    );
});


const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    box: {
        flexDirection: 'column',
        width: '50%',
        margin: 5,
        padding: 20,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        height:250

    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    price: {
        fontSize: 32,
        color: '#555',
    },

});

export default ProductItem;