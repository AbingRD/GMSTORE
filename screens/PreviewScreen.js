import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReactNativePosPrinter from 'react-native-thermal-pos-printer';
import { TransactionContext } from './TransactionContext';

const printerMac = '10:22:33:3B:93:A5'; // replace with your printer MAC

export default function PreviewScreen({ route, navigation }) {
  const { items, total } = route.params;
  const insets = useSafeAreaInsets();
  const { addTransaction, transactionNumber } = useContext(TransactionContext);

  const [customerName, setCustomerName] = useState('Customer');
  const [modalVisible, setModalVisible] = useState(false);
  const [cash, setCash] = useState(''); // for input

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      if (
        granted['android.permission.BLUETOOTH_SCAN'] !== 'granted' ||
        granted['android.permission.BLUETOOTH_CONNECT'] !== 'granted'
      ) {
        throw new Error('Bluetooth permissions denied');
      }
    }
  };

  const printReceipt = async () => {
    try {
      await requestPermissions();
      await ReactNativePosPrinter.init();
      await ReactNativePosPrinter.connectPrinter(printerMac, { type: 'BLUETOOTH' });

      const txnNumber = String(transactionNumber).padStart(5, '0');
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString();

      const cashAmount = parseFloat(cash) || total; // if cash not input, use total
      const change = cashAmount - total;
        
      // --- HEADER ---
      await ReactNativePosPrinter.newLine(1);
      await ReactNativePosPrinter.printText(`ABING STORE\n`, { align: 'CENTER', size: 14, bold: true });
      await ReactNativePosPrinter.printText(`09167640132\n`, { align: 'CENTER', size: 12 });
      await ReactNativePosPrinter.printText(`TNo:${txnNumber}      ${dateStr}      ${timeStr}\n`, { align: 'LEFT', size: 8 });
      await ReactNativePosPrinter.printText(`Customer: ${customerName}\n`, { align: 'LEFT', size: 10 });
      await ReactNativePosPrinter.printText(`--------------------------------\n`);

      // --- ITEMS ---
      for (const item of items) {
        const lineTotal = item.wholesale_price * item.quantity;
        await ReactNativePosPrinter.printText(
          `${item.name.substring(0, 20).padEnd(25)}P${lineTotal}\n`,
              
        );
        await ReactNativePosPrinter.printText(`P${item.wholesale_price} x ${item.quantity}\n`);
      }

      await ReactNativePosPrinter.printText(`--------------------------------\n`);

      // --- GRAND TOTAL & CASH ---
      await ReactNativePosPrinter.printText(`Grand Total: ₱${total.toFixed(2)}\n`, { align: 'RIGHT', bold: false, size: 12 });
      await ReactNativePosPrinter.printText(`Cash: P${cashAmount.toFixed(2)}\n`, { align: 'RIGHT', bold: false, size: 10 });
      if (change > 0) {
        await ReactNativePosPrinter.printText(`Change: P${change.toFixed(2)}\n`, { align: 'RIGHT', bold: false, size: 10 });
      }
      await ReactNativePosPrinter.printText(`Thank you!\n\n`, { align: 'CENTER',size: 10 });
      await ReactNativePosPrinter.newLine(2);
      
      await ReactNativePosPrinter.disconnectPrinter();

      // Save transaction
      addTransaction({
        customerName,
        date: now,
        items,
        total,
        cash: cashAmount,
        change: change > 0 ? change : 0,
      });

      Alert.alert('Success', 'Receipt printed successfully!', [
        { text: 'OK', onPress: () => navigation.popToTop() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Print Error', error.message);
    }
  };

  const handleConfirmTransaction = () => {
    const cashAmount = parseFloat(cash) || total;

    if (cashAmount < total) {
      Alert.alert(
        'Insufficient Cash',
        `Cash entered (₱${cashAmount.toFixed(2)}) is less than the total amount (₱${total.toFixed(2)}). Cannot proceed.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Print Receipt',
      'Do you want to print the receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Print Receipt', onPress: printReceipt },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => {
    const lineTotal = item.wholesale_price * item.quantity;
    return (
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.calc}>₱{item.wholesale_price} x {item.quantity}</Text>
        <Text style={styles.totalLine}>₱{lineTotal.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
          <Text style={styles.title}>Transaction Preview</Text>

          <View style={styles.customerRow}>
            <Pressable onPress={() => { setCustomerName(''); setModalVisible(true); }}>
              <Text style={styles.customerText}>
                Customer: {customerName || 'Enter Name'}
              </Text>
            </Pressable>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.headerName}>Item</Text>
            <Text style={styles.headerCalc}>Price x Qty</Text>
            <Text style={styles.headerTotal}>Total</Text>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 160 }}
          />

          {/* Footer with Grand Total + Cash input */}
          <View style={styles.footer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.grandTotal}>Grand Total: ₱{total.toFixed(2)}</Text>
              <TextInput
                style={styles.cashInput}
                placeholder="Cash"
                keyboardType="numeric"
                value={cash}
                onChangeText={setCash}
              />
            </View>

            <Pressable style={styles.confirmBtn} onPress={handleConfirmTransaction}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm Transaction</Text>
            </Pressable>
          </View>

          {/* Customer Modal */}
          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text>Edit Customer Name</Text>
                <TextInput
                  style={styles.input}
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="Enter Customer Name"
                />
                <Pressable style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#fff' }}>Done</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  customerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  customerText: { fontWeight: 'bold', fontSize: 16 },
  dateText: { fontSize: 14, color: '#555' },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderColor: '#ccc', paddingBottom: 8 },
  headerName: { flex: 1.5, fontWeight: 'bold' },
  headerCalc: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  headerTotal: { flex: 1, textAlign: 'right', fontWeight: 'bold' },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  name: { flex: 1.5 },
  calc: { flex: 1, textAlign: 'center' },
  totalLine: { flex: 1, textAlign: 'right', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, borderTopWidth: 1, backgroundColor: '#fff' },
  grandTotal: { fontSize: 18, fontWeight: 'bold' },
  cashInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, width: 100, borderRadius: 5, textAlign: 'center' },
  confirmBtn: { backgroundColor: '#28a745', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 10, marginBottom: 15, borderRadius: 6 },
  modalBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 6, alignItems: 'center' },
});
