import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TransactionContext } from './TransactionContext';

export default function Transactions() {
  const { transactions } = useContext(TransactionContext);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.txnId}>Txn #{String(item.id).padStart(5, '0')}</Text>
      <Text>Customer: {item.customerName}</Text>
      <Text>Date: {new Date(item.date).toLocaleString()}</Text>
      <Text>Total: ₱{item.total.toFixed(2)}</Text>

      <FlatList
        data={item.items}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <Text>• {item.name} P{item.wholesale_price} x {item.quantity}</Text>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No transactions yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  row: { marginBottom: 20, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 10 },
  txnId: { fontWeight: 'bold', marginBottom: 5 },
});
