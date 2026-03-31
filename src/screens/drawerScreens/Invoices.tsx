import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type InvoicesNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'Invoices'
>;

interface PaymentData {
  id: string;
  title: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Pending';
}

const Invoices: React.FC = () => {
  const navigation = useNavigation<InvoicesNavigationProp>();
  const insets = useSafeAreaInsets();

  const payments: PaymentData[] = [
    {
      id: '1',
      title: 'Dr. Sarah Johnson - Consultation',
      amount: '$50.00',
      date: 'Mar 28, 2026',
      status: 'Completed',
    },
    {
      id: '2',
      title: 'Dr. Michael Chen - Consultation',
      amount: '$45.00',
      date: 'Mar 25, 2026',
      status: 'Completed',
    },
    {
      id: '3',
      title: 'Lab Tests - Blood Work',
      amount: '$85.00',
      date: 'Mar 20, 2026',
      status: 'Pending',
    },
  ];

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payments</Text>
          <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
            <Icons.Search width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Spent This Month</Text>
            <Text style={styles.totalAmount}>$180.00</Text>
          </View>

          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.transactionsWrap}>
            {payments.map((payment) => {
              const isCompleted = payment.status === 'Completed';
              return (
                <View key={payment.id} style={styles.transactionCard}>
                  <View style={[styles.iconWrap, isCompleted ? styles.iconWrapDone : styles.iconWrapPending]}>
                    <Text style={[styles.iconText, isCompleted ? styles.iconTextDone : styles.iconTextPending]}>
                      {isCompleted ? '✓' : '◷'}
                    </Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{payment.title}</Text>
                    <Text style={styles.transactionDate}>{payment.date}</Text>
                  </View>
                  <View style={styles.rightInfo}>
                    <Text style={styles.transactionAmount}>{payment.amount}</Text>
                    <Text style={[styles.transactionStatus, isCompleted ? styles.statusDone : styles.statusPending]}>
                      {payment.status}
                    </Text>
                  </View>
                </View>
              );
            })}
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
  headerBlock: {
    backgroundColor: '#ECF2FD',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  searchButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 15,
  },
  totalCard: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    padding: 20,
    marginBottom: 22,
  },
  totalLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '600',
    color: '#BFDBFE',
    marginBottom: 8,
  },
  totalAmount: {
    fontFamily: Fonts.raleway,
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  transactionsWrap: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 72 / 2,
    height: 72 / 2,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconWrapDone: {
    backgroundColor: '#DDF5EE',
  },
  iconWrapPending: {
    backgroundColor: '#E5E7EB',
  },
  iconText: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
  },
  iconTextDone: {
    color: '#10B981',
  },
  iconTextPending: {
    color: '#6B7280',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  transactionDate: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  rightInfo: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  transactionAmount: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  transactionStatus: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '500',
  },
  statusDone: {
    color: '#10B981',
  },
  statusPending: {
    color: '#6B7280',
  },
});

export default Invoices;

