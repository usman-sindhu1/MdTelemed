import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type InvoicesNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'Invoices'
>;

interface InvoiceData {
  id: string;
  status: string;
  serviceName: string;
  amount: string;
  paidDate: string;
}

const Invoices: React.FC = () => {
  const navigation = useNavigation<InvoicesNavigationProp>();

  const invoices: InvoiceData[] = [
    {
      id: '5646543',
      status: 'Paid',
      serviceName: 'Service Name',
      amount: '$25.00',
      paidDate: 'Jan 12, 2025',
    },
    {
      id: '5646543',
      status: 'Paid',
      serviceName: 'Service Name',
      amount: '$25.00',
      paidDate: 'Jan 12, 2025',
    },
  ];

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleCardPress = (invoice: InvoiceData) => {
    navigation.navigate('InvoiceDetails');
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
            <Text style={styles.heading}>Invoices</Text>
            <Text style={styles.description}>
              Search for the doctors by your need or services.
            </Text>
          </View>

          {/* Invoice Cards */}
          <View style={styles.cardsContainer}>
            {invoices.map((invoice, index) => (
              <TouchableOpacity
                key={index}
                style={styles.invoiceCard}
                onPress={() => handleCardPress(invoice)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.idLabel}>
                    <Text style={styles.idText}>ID: {invoice.id}</Text>
                  </View>
                  <View style={styles.statusLabel}>
                    <Text style={styles.statusText}>{invoice.status}</Text>
                  </View>
                </View>

                <View style={styles.serviceSection}>
                  <View style={styles.serviceNameContainer}>
                    <Text style={styles.sectionLabel}>Service</Text>
                    <Text style={styles.serviceName}>{invoice.serviceName}</Text>
                  </View>
                </View>

                <View style={styles.amountSection}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>{invoice.amount}</Text>
                </View>

                <View style={styles.dateSection}>
                  <Text style={styles.detailLabel}>Paid on:</Text>
                  <Text style={styles.detailValue}>{invoice.paidDate}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  invoiceCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idLabel: {
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  idText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusLabel: {
    backgroundColor: '#F0E8FB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  serviceSection: {
    gap: 8,
  },
  sectionLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    marginBottom: 8,
  },
  serviceNameContainer: {
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  serviceName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  detailValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
});

export default Invoices;

