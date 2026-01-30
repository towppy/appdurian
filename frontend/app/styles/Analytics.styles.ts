import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 768;
const isLargeScreen = width >= 768;

/* =====================
   Design Tokens
===================== */
const COLORS = {
  primary: '#27AE60',
  primaryDark: '#1b5e20',
  primaryLight: '#4ade80',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#fafafa',
  gray100: '#f4f4f5',
  gray200: '#e4e4e7',
  gray300: '#d4d4d8',
  gray400: '#a1a1aa',
  gray500: '#71717a',
  gray600: '#52525b',
  gray700: '#3f3f46',
  gray800: '#27272a',
  gray900: '#18181b',
  background: '#0a0a0a',
  cardBackground: '#111111',
  cardBorder: '#1f1f1f',
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
} as const;

import type { ViewStyle } from 'react-native';

const SHADOWS = Platform.select({
  ios: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
  web: ({ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' } as any),
}) as ViewStyle | undefined;

/* =====================
   Styles Hook
===================== */
export const useAnalyticsStyles = () => {
  return StyleSheet.create({
    /* =====================
       Container & Layout
    ===================== */
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    scrollView: {
      flex: 1,
    },

    scrollContent: {
      paddingBottom: SPACING.huge,
    },

    /* =====================
       Header
    ===================== */
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? 56 : SPACING.xxxl,
      paddingBottom: SPACING.xl,
      paddingHorizontal: SPACING.xl,
      backgroundColor: COLORS.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.cardBorder,
    },

    headerTitle: {
      fontSize: isSmallScreen ? 24 : 28,
      fontWeight: '800',
      color: COLORS.white,
      letterSpacing: 0.5,
    },

    headerSubtitle: {
      fontSize: isSmallScreen ? 13 : 14,
      fontWeight: '400',
      color: COLORS.gray400,
      marginTop: 2,
    },

    backButton: {
      width: 36,
      height: 36,
      borderRadius: BORDER_RADIUS.sm,
      backgroundColor: COLORS.gray800,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },

    backButtonText: {
      fontSize: 20,
      color: COLORS.gray400,
    },

    /* =====================
       Time Range Selector
    ===================== */
    timeRangeContainer: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xl,
      gap: SPACING.sm,
    },

    timeRangeButton: {
      flex: 1,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: COLORS.cardBackground,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
      alignItems: 'center',
    },

    timeRangeButtonActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },

    timeRangeText: {
      fontSize: isSmallScreen ? 13 : 14,
      fontWeight: '600',
      color: COLORS.gray400,
    },

    timeRangeTextActive: {
      color: COLORS.white,
    },

    /* =====================
       Metrics Grid
    ===================== */
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xl,
      gap: SPACING.md,
    },

    metricCard: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
      width: isSmallScreen ? '100%' : '48%',
      ...SHADOWS,
    },

    metricCardLarge: {
      width: '100%',
    },

    metricHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },

    metricIcon: {
      fontSize: 28,
    },

    metricBadge: {
      backgroundColor: 'rgba(39, 174, 96, 0.2)',
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.sm,
    },

    metricBadgeText: {
      color: COLORS.primary,
      fontSize: 12,
      fontWeight: '700',
    },

    metricValue: {
      fontSize: isSmallScreen ? 28 : 32,
      fontWeight: '800',
      color: COLORS.white,
      marginBottom: SPACING.xs,
      letterSpacing: 0.5,
    },

    metricLabel: {
      fontSize: isSmallScreen ? 13 : 14,
      fontWeight: '600',
      color: COLORS.gray400,
      marginBottom: SPACING.xs,
    },

    metricSubtext: {
      fontSize: 12,
      fontWeight: '400',
      color: COLORS.gray500,
    },

    /* Progress Bar */
    progressBar: {
      height: 6,
      backgroundColor: COLORS.gray800,
      borderRadius: BORDER_RADIUS.sm,
      marginTop: SPACING.sm,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      backgroundColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.sm,
    },

    progressFillWarning: {
      backgroundColor: COLORS.warning,
    },

    /* =====================
       Section
    ===================== */
    section: {
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xxl,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },

    sectionTitle: {
      fontSize: isSmallScreen ? 18 : 20,
      fontWeight: '700',
      color: COLORS.white,
      marginBottom: SPACING.lg,
      letterSpacing: 0.3,
    },

    sectionLink: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.primary,
    },

    /* =====================
       Chart Card
    ===================== */
    chartCard: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
      ...SHADOWS,
    },

    chart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: 200,
      gap: SPACING.xs,
    },

    chartBar: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },

    chartBarContainer: {
      width: '100%',
      height: '80%',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },

    chartBarFill: {
      width: '100%',
      backgroundColor: COLORS.primary,
      borderTopLeftRadius: BORDER_RADIUS.sm,
      borderTopRightRadius: BORDER_RADIUS.sm,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: SPACING.xs,
      minHeight: 30,
    },

    chartBarValue: {
      fontSize: 11,
      fontWeight: '700',
      color: COLORS.white,
    },

    chartBarLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: COLORS.gray500,
      marginTop: SPACING.sm,
    },

    chartLegend: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: SPACING.lg,
      gap: SPACING.lg,
    },

    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },

    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },

    legendText: {
      fontSize: 13,
      fontWeight: '500',
      color: COLORS.gray400,
    },

    /* =====================
       Distribution Card
    ===================== */
    distributionCard: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
      gap: SPACING.lg,
      ...SHADOWS,
    },

    distributionItem: {
      gap: SPACING.sm,
    },

    distributionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    distributionRange: {
      fontSize: isSmallScreen ? 14 : 15,
      fontWeight: '700',
      color: COLORS.white,
    },

    distributionCount: {
      fontSize: 13,
      fontWeight: '500',
      color: COLORS.gray400,
    },

    distributionBarContainer: {
      height: 8,
      backgroundColor: COLORS.gray800,
      borderRadius: BORDER_RADIUS.sm,
      overflow: 'hidden',
    },

    distributionBar: {
      height: '100%',
      backgroundColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.sm,
    },

    distributionPercentage: {
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.gray500,
    },

    /* =====================
       Recent Scans
    ===================== */
    recentScansCard: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
      gap: SPACING.md,
      ...SHADOWS,
    },

    scanItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.cardBorder,
    },

    scanIcon: {
      width: 44,
      height: 44,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: COLORS.gray800,
      justifyContent: 'center',
      alignItems: 'center',
    },

    scanIconText: {
      fontSize: 20,
    },

    scanInfo: {
      flex: 1,
    },

    scanVariety: {
      fontSize: isSmallScreen ? 14 : 15,
      fontWeight: '600',
      color: COLORS.white,
      marginBottom: 2,
    },

    scanTime: {
      fontSize: 12,
      fontWeight: '400',
      color: COLORS.gray500,
    },

    scanMetrics: {
      alignItems: 'flex-end',
      gap: SPACING.xs,
    },

    scanQuality: {
      fontSize: isSmallScreen ? 15 : 16,
      fontWeight: '700',
      color: COLORS.primary,
    },

    scanStatusBadge: {
      backgroundColor: 'rgba(39, 174, 96, 0.2)',
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.sm,
    },

    scanStatusBadgeRejected: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },

    scanStatusText: {
      fontSize: 11,
      fontWeight: '700',
      color: COLORS.primary,
    },

    scanStatusTextRejected: {
      color: COLORS.danger,
    },

    /* =====================
       Export Button
    ===================== */
    exportButton: {
      marginHorizontal: SPACING.xl,
      marginTop: SPACING.xxl,
      backgroundColor: COLORS.primary,
      paddingVertical: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      ...SHADOWS,
    },

    exportButtonText: {
      fontSize: isSmallScreen ? 15 : 16,
      fontWeight: '700',
      color: COLORS.white,
      letterSpacing: 0.5,
    },
  });
};