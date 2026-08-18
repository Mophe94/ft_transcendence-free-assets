import { type CSSProperties, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Types — le contrat de données. Le mate raccorde ses fetch sur ces formes,
// rien d'autre dans ce fichier n'a besoin de changer.
// ---------------------------------------------------------------------------

interface GameSession {
  playerId: string;
  startedAt: string;
  endedAt: string | null;
  gameVersion: string;
  platform: 'windows' | 'linux' | 'macos' | 'web';
}

interface GameError {
  id: string;
  type: string;
  message: string;
  gameVersion: string;
  platform: string;
  occurredAt: string;
}

interface HttpRouteMetric {
  route: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  errorRate4xx: number;
  errorRate5xx: number;
}

interface NodeInfra {
  nodeName: string;
  cpuPercent: number;
  ramPercent: number;
  diskPercent: number;
}

interface SlowQuery {
  query: string;
  durationMs: number;
}

interface DatabaseHealth {
  activeConnections: number;
  maxConnections: number;
  slowQueries: SlowQuery[];
}

type SwarmStatus = 'healthy' | 'degraded' | 'down';

interface SwarmService {
  serviceName: string;
  desiredReplicas: number;
  runningReplicas: number;
  status: SwarmStatus;
}

interface DashboardData {
  sessions: GameSession[];
  errors: GameError[];
  httpMetrics: HttpRouteMetric[];
  infraNodes: NodeInfra[];
  database: DatabaseHealth;
  swarmServices: SwarmService[];
}

// ---------------------------------------------------------------------------
// Data — MOCK. Seul endroit à remplacer par de vrais fetch
// (endpoints NestJS, requêtes Grafana, etc). Garder la même forme de retour
// dans useDashboardData et le reste du fichier ne bouge pas.
// ---------------------------------------------------------------------------

const MOCK_DATA: DashboardData = {
  sessions: [
    { playerId: 'plyr_8f2a', startedAt: '2026-08-06T09:12:00Z', endedAt: null, gameVersion: '1.4.2', platform: 'windows' },
    { playerId: 'plyr_3c91', startedAt: '2026-08-06T08:47:00Z', endedAt: '2026-08-06T09:30:00Z', gameVersion: '1.4.2', platform: 'web' },
    { playerId: 'plyr_1d77', startedAt: '2026-08-06T08:15:00Z', endedAt: '2026-08-06T08:52:00Z', gameVersion: '1.4.1', platform: 'linux' },
    { playerId: 'plyr_9a04', startedAt: '2026-08-06T07:58:00Z', endedAt: null, gameVersion: '1.4.2', platform: 'macos' },
  ],
  errors: [
    { id: 'err_001', type: 'NullReferenceException', message: 'Object reference not set in InventorySystem.cs', gameVersion: '1.4.2', platform: 'windows', occurredAt: '2026-08-06T09:05:00Z' },
    { id: 'err_002', type: 'OutOfMemory', message: 'Texture atlas allocation failed', gameVersion: '1.4.1', platform: 'web', occurredAt: '2026-08-06T08:40:00Z' },
  ],
  httpMetrics: [
    { route: '/api/auth/login', method: 'POST', p50Ms: 42, p95Ms: 118, p99Ms: 210, errorRate4xx: 1.2, errorRate5xx: 0.1 },
    { route: '/api/game/save', method: 'PUT', p50Ms: 65, p95Ms: 190, p99Ms: 340, errorRate4xx: 0.4, errorRate5xx: 0.3 },
    { route: '/api/leaderboard', method: 'GET', p50Ms: 28, p95Ms: 80, p99Ms: 150, errorRate4xx: 0.1, errorRate5xx: 0.0 },
  ],
  infraNodes: [
    { nodeName: 'swarm-node-01', cpuPercent: 42, ramPercent: 61, diskPercent: 38 },
    { nodeName: 'swarm-node-02', cpuPercent: 77, ramPercent: 54, diskPercent: 45 },
  ],
  database: {
    activeConnections: 24,
    maxConnections: 100,
    slowQueries: [{ query: 'SELECT * FROM game_events WHERE payload @>...', durationMs: 820 }],
  },
  swarmServices: [
    { serviceName: 'api-nestjs', desiredReplicas: 3, runningReplicas: 3, status: 'healthy' },
    { serviceName: 'postgres', desiredReplicas: 1, runningReplicas: 1, status: 'healthy' },
    { serviceName: 'worker-jobs', desiredReplicas: 2, runningReplicas: 1, status: 'degraded' },
  ],
};

function useDashboardData(): { data: DashboardData; isLoading: boolean; error: string | null } {
  // MOCK — à remplacer par un vrai fetch (endpoints NestJS, requêtes Grafana, etc.)
  // Garder la même forme de retour pour ne rien casser en dessous.
  return { data: MOCK_DATA, isLoading: false, error: null };
}

// ---------------------------------------------------------------------------
// Styles — en dur, aucune dépendance à Tailwind ou un CSS externe.
// ---------------------------------------------------------------------------

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    background: '#f8fafc',
    padding: '24px',
    fontFamily: 'system-ui, sans-serif',
  },
  container: { maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  title: { fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748b', margin: '4px 0 0' },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' },
  statCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' },
  statLabel: { fontSize: '12px', color: '#64748b', margin: '0 0 4px' },
  statValue: { fontSize: '22px', fontWeight: 600, color: '#0f172a', margin: 0 },
  sectionLabel: { fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' },
  cardTitle: { fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', fontSize: '11px', color: '#94a3b8', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9', fontWeight: 500 },
  td: { padding: '6px 0', color: '#334155', borderBottom: '1px solid #f8fafc' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #f8fafc' },
};

function badgeStyle(status: SwarmStatus): CSSProperties {
  const map: Record<SwarmStatus, { bg: string; color: string; border: string }> = {
    healthy: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    degraded: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    down: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  };
  const c = map[status];
  return {
    fontSize: '11px',
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: '999px',
    background: c.bg,
    color: c.color,
    border: `1px solid ${c.border}`,
  };
}

const statusLabel: Record<SwarmStatus, string> = { healthy: 'ok', degraded: 'dégradé', down: 'down' };

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(startedAt: string, endedAt: string | null) {
  const end = endedAt ? new Date(endedAt) : new Date();
  const minutes = Math.round((end.getTime() - new Date(startedAt).getTime()) / 60000);
  return `${minutes} min`;
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>{title}</h2>
      {children}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <p style={{ ...styles.statValue, color: color ?? styles.statValue.color }}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  // const context = useAuth();
  // const navigate = useNavigate();
  const { data, isLoading, error } = useDashboardData();

  // useEffect(() => {
  //   const user = context.user;
  //   if (!user || user.role !== 'admin') navigate('/dashboard');
  // }, [context.user, navigate]);

  // if (!context.user || context.user.role !== 'admin') return null;

  const activeSessions = data.sessions.filter((s) => s.endedAt === null).length;
  const errors24h = data.errors.length;
  const avgP95 = Math.round(data.httpMetrics.reduce((sum, m) => sum + m.p95Ms, 0) / data.httpMetrics.length);
  const degradedServices = data.swarmServices.filter((s) => s.status !== 'healthy').length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div>
          <h1 style={styles.title}>Tableau de bord admin</h1>
          <p style={styles.subtitle}>Jeu, API et infrastructure — vue d'ensemble</p>
        </div>

        {isLoading && <p style={{ fontSize: '14px', color: '#64748b' }}>Chargement...</p>}
        {error && <p style={{ fontSize: '14px', color: '#dc2626' }}>{error}</p>}

        <div style={styles.statGrid}>
          <StatCard label="Sessions en cours" value={`${activeSessions}`} />
          <StatCard label="Erreurs (24h)" value={`${errors24h}`} color={errors24h > 0 ? '#b45309' : undefined} />
          <StatCard label="Latence p95 moyenne" value={`${avgP95} ms`} />
          <StatCard label="Services en alerte" value={`${degradedServices}`} color={degradedServices > 0 ? '#b91c1c' : undefined} />
        </div>

        <div>
          <p style={styles.sectionLabel}>Jeu</p>
          <div style={styles.cardGrid}>
            <Card title="Sessions récentes">
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Joueur</th>
                    <th style={styles.th}>Début</th>
                    <th style={styles.th}>Durée</th>
                    <th style={styles.th}>Plateforme</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sessions.map((s) => (
                    <tr key={s.playerId + s.startedAt}>
                      <td style={styles.td}>{s.playerId}</td>
                      <td style={styles.td}>{formatTime(s.startedAt)}</td>
                      <td style={styles.td}>
                        {formatDuration(s.startedAt, s.endedAt)}
                        {s.endedAt === null && (
                          <span style={{ color: '#16a34a', fontSize: '11px', marginLeft: '6px' }}>● en cours</span>
                        )}
                      </td>
                      <td style={styles.td}>{s.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card title="Erreurs & crashs">
              {data.errors.map((e) => (
                <div key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <strong style={{ color: '#1e293b' }}>{e.type}</strong>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>{formatTime(e.occurredAt)}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>{e.message}</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>
                    {e.gameVersion} · {e.platform}
                  </p>
                </div>
              ))}
            </Card>
          </div>
        </div>

        <div>
          <p style={styles.sectionLabel}>Infrastructure &amp; backend</p>
          <div style={styles.cardGrid}>
            <Card title="Requêtes HTTP">
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Route</th>
                    <th style={styles.th}>p50</th>
                    <th style={styles.th}>p95</th>
                    <th style={styles.th}>Erreurs</th>
                  </tr>
                </thead>
                <tbody>
                  {data.httpMetrics.map((m) => (
                    <tr key={m.route}>
                      <td style={styles.td}>
                        <span style={{ color: '#94a3b8', fontSize: '11px', marginRight: '4px' }}>{m.method}</span>
                        {m.route}
                      </td>
                      <td style={styles.td}>{m.p50Ms} ms</td>
                      <td style={styles.td}>{m.p95Ms} ms</td>
                      <td style={styles.td}>{(m.errorRate4xx + m.errorRate5xx).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card title="Nœuds (CPU / RAM / disque)">
              {data.infraNodes.map((n) => (
                <div key={n.nodeName} style={{ marginBottom: '10px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '4px',
                    }}
                  >
                    <strong style={{ color: '#334155' }}>{n.nodeName}</strong>
                    <span>
                      {n.cpuPercent}% CPU · {n.ramPercent}% RAM · {n.diskPercent}% disque
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${n.cpuPercent}%`, background: '#94a3b8' }} />
                  </div>
                </div>
              ))}
            </Card>

            <Card title="Base de données">
              <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 10px' }}>
                {data.database.activeConnections} / {data.database.maxConnections} connexions actives
              </p>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px' }}>Requêtes lentes</p>
              {data.database.slowQueries.map((q, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontSize: '11px',
                    color: '#64748b',
                    padding: '3px 0',
                  }}
                >
                  <code style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.query}</code>
                  <span style={{ color: '#94a3b8', flexShrink: 0 }}>{q.durationMs} ms</span>
                </div>
              ))}
            </Card>

            <Card title="Services Swarm">
              {data.swarmServices.map((s) => (
                <div key={s.serviceName} style={styles.listItem}>
                  <span style={{ color: '#334155' }}>{s.serviceName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                      {s.runningReplicas}/{s.desiredReplicas}
                    </span>
                    <span style={badgeStyle(s.status)}>{statusLabel[s.status]}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}