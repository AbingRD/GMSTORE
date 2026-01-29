import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SearchBar, Image } from 'react-native-elements';
import products from '../data.json';

/* ---------- Cart Row ---------- */
const CartRow = React.memo(({ item, onUpdate }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>

      <View style={styles.qtyRow}>
        <Pressable onPress={() => onUpdate(item.id, -1)}>
          <Text style={styles.qtyBtn}>−</Text>
        </Pressable>

        <Text style={styles.qty}>{item.quantity}</Text>

        <Pressable onPress={() => onUpdate(item.id, 1)}>
          <Text style={styles.qtyBtn}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.price}>
        ₱{(item.wholesale_price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );
});

/* ---------- Screen ---------- */
export default function CartScreen({ navigation }) {
  const CATEGORIES = [
    'All',
    'Cigarettes',
    'Beers & Drinks',
    'Uncategorized'
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const [items, setItems] = useState(
    products.map(p => ({
      ...p,
      category: p.category ?? 'Uncategorized',
      quantity: 0,
    }))
  );

  /* Update quantity */
  const updateQty = useCallback((id, delta) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  }, []);

  /* Filter + Category + Sort */
  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' ||
          item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );
  }, [items, search, selectedCategory]);

  /* Selected items */
  const selectedItems = useMemo(
    () => items.filter(i => i.quantity > 0),
    [items]
  );

  /* Total */
  const total = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.wholesale_price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const renderItem = useCallback(
    ({ item }) => <CartRow item={item} onUpdate={updateQty} />,
    [updateQty]
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <SearchBar
        placeholder="Search product..."
        value={search}
        onChangeText={setSearch}
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
        searchIcon={
          <Image
            source={require('../assets/searchglass.png')}
            style={{ width: 22, height: 22 }}
          />
        }
      />

      {/* Categories */}
     {/* Categories */}
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
        <Text style={styles.headerName}>Name</Text>
        <Text style={styles.headerQty}>Qty</Text>
        <Text style={styles.headerPrice}>Price</Text>
      </View>

      {/* List */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* Preview */}
      {selectedItems.length > 0 && (
        <View style={styles.preview}>
          <Text>{selectedItems.length} items selected</Text>
          <Text style={styles.total}>Total: ₱{total.toFixed(2)}</Text>

          <Pressable
            style={styles.previewBtn}
            onPress={() =>
              navigation.navigate('PreviewScreen', {
                items: selectedItems,
                total,
              })
            }
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Preview
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 45, paddingHorizontal: 15 },

  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: { backgroundColor: '#eee', borderRadius: 25 },

  categoryWrapper: {
  flexDirection: 'row',
  flexWrap: 'wrap',      // 👈 wrap to next line
  marginBottom: 15,
},
categoryBtn: {
  paddingHorizontal: 15,
  paddingVertical: 6,
  backgroundColor: '#eee',
  borderRadius: 25,
  marginRight: 8,
  marginBottom: 8,       // 👈 spacing for wrapped lines
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
  headerName: { flex: 1.5, fontWeight: 'bold' },
  headerQty: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  headerPrice: { flex: 1, textAlign: 'right', fontWeight: 'bold' },

  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  name: { flex: 1.5 },
  qtyRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtn: { fontSize: 32, paddingHorizontal: 12, fontWeight: 'bold' },
  qty: { fontSize: 18, minWidth: 24, textAlign: 'center' },
  price: { flex: 1, textAlign: 'right' },

  preview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 5 },
  previewBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
});
