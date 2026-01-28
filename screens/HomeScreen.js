import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image,Pressable } from 'react-native';
import { SearchBar } from 'react-native-elements';
import products from '../data.json'; // your sample data

export default function HomeScreen({ navigation }) {
//     const CATEGORIES = [
//   'All',
//   'Cigarettes',
//   'Beers & Drinks',
//   'Stationery',
// ];
// const [selectedCategory, setSelectedCategory] = useState('All');
// const filteredItems = useMemo(() => {
//   return items.filter(item => {
//     const matchesSearch = item.name
//       .toLowerCase()
//       .includes(search.toLowerCase());

//     const matchesCategory =
//       selectedCategory === 'All' ||
//       item.category === selectedCategory;

//     return matchesSearch && matchesCategory;
//   });
// }, [items, search, selectedCategory]);

  const [search, setSearch] = useState('');

  const filteredProducts = products
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₱{item.retail_price}</Text>
      <Text style={styles.price}>₱{item.wholesale_price}</Text>
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

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Products</Text>
        <Text style={styles.headerRetail}>Retail</Text>
        <Text style={styles.headerText}>Wholesale</Text>
      </View>
          {/* <FlatList
  data={CATEGORIES}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item}
  style={{ marginBottom: 10 }}
  renderItem={({ item }) => (
    <Pressable
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.categoryBtn,
        selectedCategory === item && styles.categoryBtnActive
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextActive
        ]}
      >
        {item}
      </Text>
    </Pressable>
  )}
/> */}

      {/* Product List */}
      <FlatList style={styles.listStyle}
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ 
    flex: 1, paddingTop: 45, paddingHorizontal: 15, backgroundColor: '#f9f9f9' 

   },
  searchRow:{ 
    flexDirection: 'row', alignItems: 'center', marginBottom: 15
    },

  searchContainer: { 
    flex: 1, backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 

  },
  inputContainer:
   { 
    backgroundColor: '#eee', borderRadius: 25, height: 50, paddingHorizontal: 10 

   },
  cartIcon: { 
    width: 40, height: 35, marginLeft: 10 ,tintColor: '#989292',
},
  headerRow: {
     flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 2, borderColor: '#9f8f8f'
     },
  headerText: {
     flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center' 
    },
  headerRetail: {
     flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingLeft: 50 
    },
  row: { 
    flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#e0e0e0'
 },
  name: {
     flex: 1.5, fontSize: 16 
    },
  price: {
     flex: 1, textAlign: 'center', fontSize: 16 
    },
    listStyle:{
        
        

    },
});
