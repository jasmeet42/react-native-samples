import { SafeAreaView } from "react-native-safe-area-context";
import useFetch from "../../hooks/useFetch";
import Config from "../../network/config";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import commonStyles from "../../styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductListResponse from "../../model/ProductListResponse";
import Product from "../../model/Product";
import ProductItem from "./ProductItem";

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const { data, loading, error } = useFetch<ProductListResponse>({
        url: Config.PRODUCTS_API_URL
    });
    useEffect(() => {
        if (data && data.products) {
            setProducts(data.products);
        }
    }, [data]);

    // Extract unique categories from products
    const categoryList = useMemo(() => {
        return Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    }, [products]);

    const filteredProducts = useMemo(() => {
        const searchLower = search.toLowerCase();
        const categoryLower = category.toLowerCase();
        return products.filter(product => {
            const matchesTitle = product.title.toLowerCase().includes(searchLower);
            const matchesCategory = category ? (product.category?.toLowerCase() === categoryLower) : true;
            return matchesTitle && matchesCategory;
        });
    }, [products, search, category]);

    const renderItem = useCallback(
        ({ item }: { item: Product }) => (
            <ProductItem
                id={item.id}
                title={item.title}
                description={item.description}
                thumbnail={item.thumbnail}
                price={item.price}
            />
        ),
        []
    );
    return (
        <SafeAreaView style={{ flex: 3, justifyContent: 'center', alignItems: 'stretch', flexDirection: 'column' }} >
            <View style={{ padding: 10 }}>
                <TextInput
                    placeholder="Search products..."
                    value={search}
                    onChangeText={setSearch}
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 }}
                />
                <Picker
                    selectedValue={category}
                    onValueChange={setCategory}
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 }}
                    mode="dropdown"
                >
                    <Picker.Item label="All Categories" value="" />
                    {categoryList.map((cat) => (
                        <Picker.Item key={cat} label={cat} value={cat} />
                    ))}
                </Picker>
            </View>
            {loading && <ActivityIndicator size="large" color="#000000" />}
            {error && <Text style={commonStyles.errorText}>🚨 Error: {error}</Text>}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={3}
                initialNumToRender={2}
                ListEmptyComponent={!loading && !error ? <Text style={{ textAlign: 'center', marginTop: 20 }}>No products found.</Text> : null}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => ({
                    length: 250,
                    offset: 250 * index,
                    index,
                })}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
            />
        </SafeAreaView>
    )
};

export default ProductList;