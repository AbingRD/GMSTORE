import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
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
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(
    products.map(p => ({ ...p, quantity: 0 }))
  );

  const updateQty = useCallback((id, delta) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const selectedItems = useMemo(
    () => items.filter(i => i.quantity > 0),
    [items]
  );

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
      <Text style={styles.title}>Create Transaction</Text>

      {/* Search */}
      <SearchBar
        placeholder="Search product..."
        value={search}
        onChangeText={setSearch}
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
      />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerName}>Name</Text>
        <Text style={styles.headerQty}>Qty</Text>
        <Text style={styles.headerPrice}>Price</Text>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        extraData={items}
        contentContainerStyle={{ paddingBottom: 120 }}
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
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 45, paddingHorizontal: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },

  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: { backgroundColor: '#eee', borderRadius: 25 },

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
  qtyBtn: {
    fontSize: 22,
    paddingHorizontal: 12,
    fontWeight: 'bold',
  },
  qty: { fontSize: 16, minWidth: 24, textAlign: 'center' },
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
