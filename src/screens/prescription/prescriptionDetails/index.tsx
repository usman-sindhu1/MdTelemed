import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import { usePrescriptionDetail } from '../../../hooks/usePrescriptionDetail';
import type { PatientPrescriptionMedicine } from '../../../types/patientPrescriptions';
import {
  appointmentTypeToLabel,
  formatDoctorNameDetail,
  formatPrescriptionDetailDateTime,
  buildMedicineScheduleLine,
} from '../../../utils/prescriptionDisplay';
import ShimmerBox from '../../../components/common/ShimmerBox';
import { generateAndSharePrescriptionPdf } from '../../../utils/prescriptionPdfExport';
import { showErrorToast } from '../../../utils/appToast';

type PrescriptionDetailsParams = {
  PrescriptionDetails: { prescriptionId: string };
};

const PrescriptionDetails: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<PrescriptionDetailsParams, 'PrescriptionDetails'>>();
  const prescriptionId = route.params?.prescriptionId;

  const detailQuery = usePrescriptionDetail(prescriptionId);
  const data = detailQuery.data;
  const [pdfWorking, setPdfWorking] = useState(false);

  const handleDownloadPress = useCallback(async () => {
    if (!prescriptionId || !data) return;
    try {
      setPdfWorking(true);
      await generateAndSharePrescriptionPdf(data, prescriptionId);
    } catch (e) {
      showErrorToast(
        'Could not create PDF',
        (e as Error)?.message ?? 'Try again later.',
      );
    } finally {
      setPdfWorking(false);
    }
  }, [prescriptionId, data]);

  const prescription = data?.prescription;
  const medicines = data?.medicines ?? [];
  const appointment = data?.appointment;
  const doctor = data?.doctor;

  const serviceLabel = appointmentTypeToLabel(appointment?.appointmentType);
  const createdRaw =
    prescription?.createdAt && String(prescription.createdAt).trim()
      ? prescription.createdAt
      : undefined;
  const { date: dateStr, time: timeStr } =
    formatPrescriptionDetailDateTime(createdRaw);

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (!prescriptionId) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={[styles.headerBlock, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Icons.Vector1Icon width={22} height={22} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>Missing prescription.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (detailQuery.isPending && !data) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.headerBlock}>
          <View style={[styles.headerContent, { paddingTop: insets.top + 12 }]}>
            <View style={styles.headerActionsRow}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <Icons.Vector1Icon width={22} height={22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Prescription Details</Text>
            <View style={styles.downloadBtn}>
              <ShimmerBox width={160} height={32} borderRadius={16} />
            </View>
            <View style={styles.infoRow}>
              <ShimmerBox height={16} borderRadius={8} width="55%" />
            </View>
            <View style={styles.infoRow}>
              <ShimmerBox height={16} borderRadius={8} width="45%" />
            </View>
            <View style={styles.doctorCard}>
              <ShimmerBox height={72} borderRadius={12} width="100%" />
            </View>
            <Text style={styles.sectionTitle}>Prescribed Medicines</Text>
            <View style={styles.medicinesContainer}>
              <ShimmerBox height={96} borderRadius={12} width="100%" />
            </View>
            <Text style={styles.sectionTitle}>Medication instructions</Text>
            <ShimmerBox height={56} borderRadius={12} width="100%" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (detailQuery.isError) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={[styles.headerBlock, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Icons.Vector1Icon width={22} height={22} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>
            {(detailQuery.error as Error)?.message ?? 'Could not load prescription.'}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => detailQuery.refetch()}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const advise = prescription?.advise?.trim();
  const doctorName = formatDoctorNameDetail(doctor ?? undefined);
  const doctorPhone =
    doctor?.phone && String(doctor.phone).trim()
      ? String(doctor.phone).trim()
      : null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerContent, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Icons.Vector1Icon width={22} height={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={detailQuery.isFetching && !detailQuery.isPending}
            onRefresh={() => detailQuery.refetch()}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>Prescription Details</Text>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={handleDownloadPress}
            activeOpacity={0.8}
            disabled={pdfWorking}
          >
            {pdfWorking ? (
              <ShimmerBox width={148} height={14} borderRadius={7} />
            ) : (
              <Text style={styles.downloadBtnText}>Download Prescription</Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service:</Text>
            <Text style={styles.infoValue}>{serviceLabel}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {dateStr}
              {timeStr ? ` | ${timeStr}` : ''}
            </Text>
          </View>

          <View style={styles.doctorCard}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            {doctorPhone ? (
              <Text style={styles.mobileNo}>Mob. No: {doctorPhone}</Text>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>Prescribed Medicines</Text>
          <View style={styles.medicinesContainer}>
            {medicines.map((medicine: PatientPrescriptionMedicine, index: number) => (
              <MedicineCard key={medicine.id ?? `m-${index}`} medicine={medicine} />
            ))}
          </View>

          {advise ? (
            <>
              <Text style={styles.sectionTitle}>Medication instructions</Text>
              <Text style={styles.adviceText}>{advise}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function MedicineCard({ medicine }: { medicine: PatientPrescriptionMedicine }) {
  const typeLabel =
    medicine.medicineType && String(medicine.medicineType).trim()
      ? String(medicine.medicineType).trim()
      : 'Medicine';
  const name = medicine.name?.trim() || '—';
  const dosage = medicine.dosage?.trim();
  const duration = medicine.duration?.trim();
  const schedule = buildMedicineScheduleLine(medicine);

  return (
    <View style={styles.medicineCard}>
      <Text style={styles.medicineType}>{typeLabel}</Text>
      <View style={styles.medicineHeader}>
        <Text style={styles.medicineName}>{name}</Text>
        {dosage ? (
          <View style={styles.dosageBadge}>
            <Text style={styles.dosageText}>{dosage}</Text>
          </View>
        ) : null}
      </View>
      {duration ? (
        <Text style={styles.medicineDetail}>Duration: {duration}</Text>
      ) : null}
      {schedule ? (
        <Text style={styles.medicineDetail}>{schedule}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBlock: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    paddingHorizontal: 15,
    paddingBottom: 14,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 24,
    gap: 20,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  downloadBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: -4,
  },
  downloadBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  infoLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  infoValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginLeft: 4,
    flex: 1,
  },
  doctorCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  mobileNo: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  medicinesContainer: {
    gap: 12,
    marginTop: 8,
  },
  medicineCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  medicineType: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  medicineName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  dosageBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dosageText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  medicineDetail: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
    marginTop: 4,
  },
  adviceText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  retryText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default PrescriptionDetails;
