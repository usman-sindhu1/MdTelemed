import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type InvoiceDetailsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'InvoiceDetails'
>;

interface InvoiceItem {
  no: string;
  service: string;
  amount: string;
  tax: string;
  total: string;
}

const InvoiceDetails: React.FC = () => {
  const navigation = useNavigation<InvoiceDetailsNavigationProp>();

  const invoiceId = '5646543';
  const billingAddress = {
    line1: 'Parkway Good',
    line2: 'Street 1122 Block D United States',
    line3: 'Block A USA',
    line4: 'New York. NY 1001',
  };
  const shippingAddress = {
    line1: 'Parkway Good',
    line2: 'Street 1122 Block D United States',
    line3: 'Block A USA',
    line4: 'New York. NY 1001',
  };

  const invoiceItems: InvoiceItem[] = [
    {
      no: '01',
      service: 'Skin care',
      amount: '$199.99',
      tax: '$20.00',
      total: '219.99',
    },
  ];

  const subtotal = '$219.99';
  const cardFee = '$00.00';
  const grandTotal = '$219.00';

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <BackHeader
            onBackPress={handleBackPress}
            onSearchPress={handleSearchPress}
            onSearchChange={handleSearchChange}
            showSearchIcon={true}
          />

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Invoice Details</Text>
            <View style={styles.idLabel}>
              <Text style={styles.idText}>ID: {invoiceId}</Text>
            </View>
          </View>

          {/* Billing and Shipping Addresses */}
          <View style={styles.addressesContainer}>
            {/* Bill To */}
            <View style={styles.addressCard}>
              <Text style={styles.addressTitle}>Bill To</Text>
              <Text style={styles.addressLine}>{billingAddress.line1}</Text>
              <Text style={styles.addressLine}>{billingAddress.line2}</Text>
              <Text style={styles.addressLine}>{billingAddress.line3}</Text>
              <Text style={styles.addressLine}>{billingAddress.line4}</Text>
            </View>

            {/* Ship To */}
            <View style={styles.addressCard}>
              <Text style={styles.addressTitle}>Ship To</Text>
              <Text style={styles.addressLine}>{shippingAddress.line1}</Text>
              <Text style={styles.addressLine}>{shippingAddress.line2}</Text>
              <Text style={styles.addressLine}>{shippingAddress.line3}</Text>
              <Text style={styles.addressLine}>{shippingAddress.line4}</Text>
            </View>
          </View>

          {/* Invoice Items Table */}
          <View style={styles.tableContainer}>
            {/* Table Headers */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colNo]}>#No.</Text>
              <Text style={[styles.tableHeaderText, styles.colService]}>Service</Text>
              <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
              <Text style={[styles.tableHeaderText, styles.colTax]}>Tax</Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
            </View>

            {/* Table Rows */}
            {invoiceItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCellText, styles.colNo]}>{item.no}</Text>
                <Text style={[styles.tableCellText, styles.colService]}>{item.service}</Text>
                <Text style={[styles.tableCellText, styles.colAmount]}>{item.amount}</Text>
                <Text style={[styles.tableCellText, styles.colTax]}>{item.tax}</Text>
                <Text style={[styles.tableCellText, styles.colTotal]}>{item.total}</Text>
              </View>
            ))}
          </View>

          {/* Invoice Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub total:</Text>
              <Text style={styles.summaryValue}>{subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Card fee:</Text>
              <Text style={styles.summaryValue}>{cardFee}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelGrand}>Grand total:</Text>
              <Text style={styles.summaryValueGrand}>{grandTotal}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
    gap: 12,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  idLabel: {
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  idText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addressesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  addressCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  addressTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addressLine: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  tableContainer: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tableHeaderText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  tableCellText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  colNo: {
    flex: 0.8,
  },
  colService: {
    flex: 2,
  },
  colAmount: {
    flex: 1.5,
    textAlign: 'right',
  },
  colTax: {
    flex: 1.5,
    textAlign: 'right',
  },
  colTotal: {
    flex: 1.5,
    textAlign: 'right',
  },
  summaryContainer: {
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  summaryValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  summaryLabelGrand: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryValueGrand: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default InvoiceDetails;

