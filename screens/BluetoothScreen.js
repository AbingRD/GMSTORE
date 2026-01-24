import React from 'react';
import { View, Button, Alert, Platform, PermissionsAndroid } from 'react-native';
import ReactNativePosPrinter from 'react-native-thermal-pos-printer';

const printerMac = '10:22:33:3B:93:A5';

export default function BluetoothPrinterTest() {

  // Request Android Bluetooth permissions
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

  // Function to print 1 receipt
  const printSingleReceipt = async () => {
    try {
      await requestPermissions();
      await ReactNativePosPrinter.init();

      await ReactNativePosPrinter.connectPrinter(printerMac, { type: 'BLUETOOTH' });

      // Print 1 receipt
      await ReactNativePosPrinter.printText(`DanJ's SariSari Store`, { align: 'CENTER', size: 13});
      await ReactNativePosPrinter.printText(`09167640132\n`, { align: 'CENTER', size: 12 });
      await ReactNativePosPrinter.newLine(3);

      await ReactNativePosPrinter.disconnectPrinter();

      Alert.alert('Success', 'Printed 1 receipt!');
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Error', error.message);
    }
  };

  // Function to print 2 receipts
  // const printDoubleReceipt = async () => {
  //   try {
  //     await requestPermissions();
  //     await ReactNativePosPrinter.init();

  //     await ReactNativePosPrinter.connectPrinter(printerMac, { type: 'BLUETOOTH' });

  //     // Print 1st receipt
  //     await ReactNativePosPrinter.printText(`ABING STORE\n`, { align: 'CENTER', size: 18, bold: true });
  //     await ReactNativePosPrinter.printText(`09167640132\n`, { align: 'CENTER', size: 14 });
  //     await ReactNativePosPrinter.newLine(3);

      

  //     // Print 2nd receipt
  //     await ReactNativePosPrinter.printText(`ABING STORE\n`, { align: 'CENTER', size: 18, bold: true });
  //     await ReactNativePosPrinter.printText(`09167640132\n`, { align: 'CENTER', size: 14 });
  //     await ReactNativePosPrinter.newLine(3);

  //     await ReactNativePosPrinter.disconnectPrinter();

  //     Alert.alert('Success', 'Printed 2 receipts!');
  //   } catch (error) {
  //     console.error('Print error:', error);
  //     Alert.alert('Error', error.message);
  //   }
  // };

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:20 }}>
      <Button 
        title="Print Receipt" 
        onPress={() => {
          Alert.alert(
            'Confirm Print',
            'Do you want to print 1 receipt?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Yes', onPress: printSingleReceipt },
            ],
            { cancelable: true }
          );
        }}
      />
      <View style={{ height: 20 }} />
      <Button 
        title="Print Receipt 2x" 
        onPress={() => {
          Alert.alert(
            'Confirm Print',
            'Do you want to print 2 copies of the receipt?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Yes', onPress: printDoubleReceipt },
            ],
            { cancelable: true }
          );
        }}
      />
    </View>
  );
}
