import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import products from '../data.json';

export default function HomeScreen({ navigation }) {
  const CATEGORIES = ['All', 'Cigarettes', 'Beers & Drinks', 'Uncategorized'];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filtered products based on search and category
  const filteredProducts = useMemo(() => {
    return products
      .filter(item => {
        const name = item.name || '';
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
  }, [search, selectedCategory]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name || 'No Name'}</Text>
      <Text style={styles.price}>₱{item.retail_price || 0}</Text>
      <Text style={styles.price}>₱{item.wholesale_price || 0}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search + Cart */}
      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Search product..."
          value={search}
          onChangeText={setSearch}
          clearIcon={null}
          searchIcon={
            <Image
              source={require('../assets/searchglass.png')}
              style={{ width: 20, height: 20 }}
            />
          }
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.inputContainer}
        />
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Image
            source={require('../assets/shopping-cart.png')}
            style={styles.cartIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Category wrapper */}
      <View style={styles.categoryWrapper}>
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryBtn,
              selectedCategory === cat && styles.categoryBtnActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Products</Text>
        <Text style={styles.headerPrice}>Retail</Text>
        <Text style={styles.headerPrice}>Wholesale</Text>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => (item.id != null ? item.id.toString() : index.toString())}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No products found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: '#eee',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 10,
  },
  cartIcon: {
    width: 40,
    height: 35,
    marginLeft: 10,
    tintColor: '#989292',
  },
  categoryWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryBtn: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 25,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryBtnActive: { backgroundColor: '#007AFF' },
  categoryText: { color: '#333', fontSize: 16 },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  headerText: { flex: 1.5, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  headerPrice: { flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  name: { flex: 1.5, fontSize: 16 },
  price: { flex: 1, textAlign: 'center', fontSize: 16 },
});
