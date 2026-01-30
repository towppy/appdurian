import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAnalyticsStyles } from '../styles/Analytics.styles';

const { width } = Dimensions.get('window');

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const styles = useAnalyticsStyles();

  // Mock data - replace with real data from your backend
  const stats = {
    totalScans: 1248,
    exportQuality: 82,
    rejected: 18,
    avgQuality: 7.8,
    weeklyGrowth: 12.5,
    topVariety: 'Puyat',
  };

  const weeklyData = [
    { day: 'Mon', scans: 45, quality: 85 },
    { day: 'Tue', scans: 52, quality: 88 },
    { day: 'Wed', scans: 38, quality: 82 },
    { day: 'Thu', scans: 61, quality: 90 },
    { day: 'Fri', scans: 48, quality: 86 },
    { day: 'Sat', scans: 35, quality: 79 },
    { day: 'Sun', scans: 29, quality: 81 },
  ];

  const recentScans = [
    { id: 1, variety: 'Puyat', quality: 92, status: 'Export Ready', time: '2 hrs ago' },
    { id: 2, variety: 'Arancillo', quality: 78, status: 'Export Ready', time: '4 hrs ago' },
    { id: 3, variety: 'Puyat', quality: 45, status: 'Rejected', time: '5 hrs ago' },
    { id: 4, variety: 'Monthong', quality: 88, status: 'Export Ready', time: '6 hrs ago' },
  ];

  const qualityDistribution = [
    { range: '90-100', count: 425, percentage: 34 },
    { range: '80-89', count: 374, percentage: 30 },
    { range: '70-79', count: 249, percentage: 20 },
    { range: '0-69', count: 200, percentage: 16 },
  ];

  const maxScans = Math.max(...weeklyData.map(d => d.scans));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Durian Quality Insights</Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/LandingScreen')}
        >
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Total Scans */}
          <View style={[styles.metricCard, styles.metricCardLarge]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricIcon}>📊</Text>
              <View style={styles.metricBadge}>
                <Text style={styles.metricBadgeText}>+{stats.weeklyGrowth}%</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{stats.totalScans.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Total Scans</Text>
            <Text style={styles.metricSubtext}>This {timeRange}</Text>
          </View>

          {/* Export Quality */}
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>✅</Text>
            <Text style={styles.metricValue}>{stats.exportQuality}%</Text>
            <Text style={styles.metricLabel}>Export Quality</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${stats.exportQuality}%` }]} />
            </View>
          </View>

          {/* Rejected */}
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>⚠️</Text>
            <Text style={styles.metricValue}>{stats.rejected}%</Text>
            <Text style={styles.metricLabel}>Rejected</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, styles.progressFillWarning, { width: `${stats.rejected}%` }]} />
            </View>
          </View>

          {/* Avg Quality Score */}
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>⭐</Text>
            <Text style={styles.metricValue}>{stats.avgQuality}/10</Text>
            <Text style={styles.metricLabel}>Avg Quality Score</Text>
            <Text style={styles.metricSubtext}>Based on AI analysis</Text>
          </View>

          {/* Top Variety */}
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>👑</Text>
            <Text style={styles.metricValue}>{stats.topVariety}</Text>
            <Text style={styles.metricLabel}>Top Variety</Text>
            <Text style={styles.metricSubtext}>Most scanned</Text>
          </View>
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => {
                const barHeight = (data.scans / maxScans) * 100;
                return (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.chartBarContainer}>
                      <View style={[styles.chartBarFill, { height: `${barHeight}%` }]}>
                        <Text style={styles.chartBarValue}>{data.scans}</Text>
                      </View>
                    </View>
                    <Text style={styles.chartBarLabel}>{data.day}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#27AE60' }]} />
                <Text style={styles.legendText}>Scans per day</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quality Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quality Distribution</Text>
          <View style={styles.distributionCard}>
            {qualityDistribution.map((item, index) => (
              <View key={index} style={styles.distributionItem}>
                <View style={styles.distributionHeader}>
                  <Text style={styles.distributionRange}>{item.range}</Text>
                  <Text style={styles.distributionCount}>{item.count} scans</Text>
                </View>
                <View style={styles.distributionBarContainer}>
                  <View style={[styles.distributionBar, { width: `${item.percentage}%` }]} />
                </View>
                <Text style={styles.distributionPercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentScansCard}>
            {recentScans.map((scan) => (
              <View key={scan.id} style={styles.scanItem}>
                <View style={styles.scanIcon}>
                  <Text style={styles.scanIconText}>🥭</Text>
                </View>
                <View style={styles.scanInfo}>
                  <Text style={styles.scanVariety}>{scan.variety}</Text>
                  <Text style={styles.scanTime}>{scan.time}</Text>
                </View>
                <View style={styles.scanMetrics}>
                  <Text style={styles.scanQuality}>{scan.quality}%</Text>
                  <View style={[
                    styles.scanStatusBadge,
                    scan.status === 'Rejected' && styles.scanStatusBadgeRejected,
                  ]}>
                    <Text style={[
                      styles.scanStatusText,
                      scan.status === 'Rejected' && styles.scanStatusTextRejected,
                    ]}>
                      {scan.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>📥 Export Full Report</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}