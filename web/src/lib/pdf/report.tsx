import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

interface TeamMetrics {
  team_name: string;
  team_short_name: string;
  actual_points: number;
  pythagorean_wins: number | null;
  shot_quality_delta: number | null;
  defensive_fragility: number | null;
  verticality_index: number | null;
  sieve_index: number | null;
  field_tilt: number | null;
  high_press_efficiency: number | null;
  clinical_ratio: number | null;
  ball_retention_index: number | null;
  discipline_roi: number | null;
}

interface PDFReportProps {
  matchweekNumber: number;
  season: string;
  metrics: TeamMetrics[];
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#0f172a',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#10b981',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#10b981',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 11,
    color: '#64748b',
  },
  teamCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  teamTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 4,
  },
  teamSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 8,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -4,
    marginRight: -4,
  },
  metricItem: {
    width: '33.33%',
    padding: 4,
  },
  metricCard: {
    padding: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 8,
    color: '#64748b',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0f172a',
  },
});

const formatNumber = (value: number | null, decimals = 2): string => {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(decimals);
};

const formatPercent = (value: number | null, decimals = 1): string => {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)}%`;
};

export function PDFReport({ matchweekNumber, season, metrics }: PDFReportProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SportsHuddle.ai</Text>
          <Text style={styles.headerSubtitle}>
            Matchweek {matchweekNumber} Report - {season} Season
          </Text>
        </View>

        {metrics.map((team) => {
          const metricItems = [
            { label: 'Pythagorean Wins', value: formatNumber(team.pythagorean_wins) },
            { label: 'Shot Quality', value: formatNumber(team.shot_quality_delta) },
            { label: 'Defensive Fragility', value: formatNumber(team.defensive_fragility) },
            { label: 'Sieve Index', value: formatNumber(team.sieve_index) },
            { label: 'Verticality', value: formatNumber(team.verticality_index) },
            { label: 'Field Tilt', value: formatPercent(team.field_tilt) },
            { label: 'High-Press Eff.', value: formatNumber(team.high_press_efficiency) },
            { label: 'Clinical Ratio', value: formatNumber(team.clinical_ratio) },
            { label: 'Ball Retention', value: formatNumber(team.ball_retention_index) },
            { label: 'Discipline ROI', value: formatNumber(team.discipline_roi) },
          ];

          return (
            <View key={team.team_name} style={styles.teamCard}>
              <Text style={styles.teamTitle}>
                {team.team_name} ({team.team_short_name})
              </Text>
              <Text style={styles.teamSubtitle}>
                Actual Points: {team.actual_points}
              </Text>
              <View style={styles.metricGrid}>
                {metricItems.map((metric) => (
                  <View key={metric.label} style={styles.metricItem}>
                    <View style={styles.metricCard}>
                      <Text style={styles.metricLabel}>{metric.label}</Text>
                      <Text style={styles.metricValue}>{metric.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export async function generatePDFBuffer(props: PDFReportProps): Promise<Buffer> {
  return renderToBuffer(<PDFReport {...props} />);
}
