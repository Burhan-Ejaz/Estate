import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Table, Tag, Button, Segmented, Skeleton, Empty, message } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
  FileSearchOutlined,
  ReloadOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import api from '../../../api/axios.js';
import {
  series,
  sequential,
  ink,
  axisProps,
  gridProps,
  formatMoney,
  formatCompact,
  lastMonths,
  monthKey,
  countSince,
} from '../../../Utils/chartTheme.js';
import './AdminDashboard.css';

const STATUS_COLORS = { available: series.blue, sold: series.orange, rented: series.aqua };

const PIPELINE = [
  { key: 'approved', label: 'Approved', color: '#0ca30c', icon: <CheckCircleOutlined /> },
  { key: 'pending', label: 'Pending review', color: '#fab219', icon: <ClockCircleOutlined /> },
  { key: 'rejected', label: 'Rejected', color: '#d03b3b', icon: <CloseCircleOutlined /> },
];

const HOVER_FILL = 'rgba(11,11,11,0.04)';

/* Tooltips enhance, never gate: every value here is also on a label, a legend or a table. */
const VizTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="viz-tip">
      {label ? <div className="viz-tip-head">{label}</div> : null}
      {payload
        .filter((p) => p.value !== undefined && p.value !== null)
        .map((p) => (
          <div className="viz-tip-row" key={p.dataKey ?? p.name}>
            <i style={{ background: p.color || p.payload?.fill || ink.muted }} />
            <span>{p.name}</span>
            <b>{p.value}</b>
          </div>
        ))}
    </div>
  );
};

const Panel = ({ title, subtitle, extra, children }) => (
  <section className="dash-card">
    <div className="dash-card-head">
      <div>
        <h2 className="dash-card-title">{title}</h2>
        {subtitle ? <p className="dash-card-sub">{subtitle}</p> : null}
      </div>
      {extra}
    </div>
    {children}
  </section>
);

const NoData = ({ height = 240 }) => (
  <div className="dash-empty" style={{ height }}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data yet" />
  </div>
);

/* Two series always get a legend; `note` direct-labels the value that matters. */
const InlineLegend = ({ items }) => (
  <ul className="legend legend-inline">
    {items.map((item) => (
      <li key={item.label}>
        <i style={{ background: item.color }} />
        <span>{item.label}</span>
        {item.note ? <b className="legend-note">{item.note}</b> : null}
      </li>
    ))}
  </ul>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [growthView, setGrowthView] = useState('Chart');
  const [data, setData] = useState({ users: [], agents: [], properties: [], pending: [] });

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [usersRes, agentsRes, propertiesRes, applicationsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/agents'),
        api.get('/admin/properties'),
        api.get('/admin/agents/applications/pending'),
      ]);
      setData({
        users: usersRes.data || [],
        agents: agentsRes.data || [],
        properties: propertiesRes.data || [],
        pending: applicationsRes.data || [],
      });
      setUpdatedAt(new Date());
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const { users, agents, properties, pending } = data;

  const months = useMemo(() => lastMonths(6), []);

  const monthlyCounts = useCallback(
    (rows) => {
      const buckets = new Map(months.map((m) => [m.key, 0]));
      rows.forEach((row) => {
        const key = monthKey(row.createdAt);
        if (key && buckets.has(key)) buckets.set(key, buckets.get(key) + 1);
      });
      return months.map((m) => ({ label: m.label, value: buckets.get(m.key) }));
    },
    [months]
  );

  /* Everyone who ever applied, whichever side of the role split they ended up on. */
  const applicants = useMemo(
    () => [...users, ...agents].filter((u) => u.agentStatus && u.agentStatus !== 'none'),
    [users, agents]
  );

  /* ---------- KPI tiles: a headline number is a stat tile, not a one-bar chart ---------- */

  const kpis = useMemo(
    () => [
      {
        label: 'Total Users',
        value: users.length,
        icon: <UserOutlined />,
        color: series.blue,
        spark: monthlyCounts(users),
        diff: countSince(users, 30) - countSince(users, 30, 30),
        to: '/admin/users',
      },
      {
        label: 'Active Agents',
        value: agents.length,
        icon: <TeamOutlined />,
        color: series.aqua,
        spark: monthlyCounts(agents),
        diff: countSince(agents, 30) - countSince(agents, 30, 30),
        to: '/admin/agents',
      },
      {
        label: 'Listings',
        value: properties.length,
        icon: <HomeOutlined />,
        color: series.orange,
        spark: monthlyCounts(properties),
        diff: countSince(properties, 30) - countSince(properties, 30, 30),
        to: '/admin/properties',
      },
      {
        label: 'Pending Applications',
        value: pending.length,
        icon: <FileSearchOutlined />,
        color: '#fab219',
        spark: monthlyCounts(applicants),
        diff: countSince(applicants, 30) - countSince(applicants, 30, 30),
        to: '/admin/agentapplications',
      },
    ],
    [users, agents, properties, pending, applicants, monthlyCounts]
  );

  /* ---------- growth: two series, one axis ---------- */

  const growth = useMemo(() => {
    const u = monthlyCounts(users);
    const p = monthlyCounts(properties);
    return months.map((m, i) => ({ month: m.label, users: u[i].value, listings: p[i].value }));
  }, [months, monthlyCounts, users, properties]);

  const growthHasData = growth.some((row) => row.users || row.listings);

  /* The current month, called out in the legend so the newest value is readable at rest. */
  const latest = useMemo(() => {
    const row = growth[growth.length - 1] || { month: '', users: 0, listings: 0 };
    return {
      users: `${row.month} ${row.users}`,
      listings: `${row.month} ${row.listings}`,
    };
  }, [growth]);

  /* ---------- listing status ---------- */

  const statusMix = useMemo(() => {
    const counts = { available: 0, sold: 0, rented: 0 };
    properties.forEach((p) => {
      if (counts[p.status] !== undefined) counts[p.status] += 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [properties]);

  /* ---------- type x purpose ---------- */

  const typeMix = useMemo(() => {
    const order = ['house', 'apartment', 'plot', 'commercial'];
    const rows = new Map(order.map((t) => [t, { name: t, sale: 0, rent: 0 }]));
    properties.forEach((p) => {
      const row = rows.get(p.type);
      if (!row) return;
      if (p.purpose === 'rent') row.rent += 1;
      else row.sale += 1;
    });
    return [...rows.values()]
      .map((r) => ({ ...r, total: r.sale + r.rent }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [properties]);

  /* ---------- top cities ---------- */

  const cityMix = useMemo(() => {
    const counts = new Map();
    properties.forEach((p) => {
      const city = (p.location?.city || '').trim() || 'Unknown';
      counts.set(city, (counts.get(city) || 0) + 1);
    });
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const head = sorted.slice(0, 6).map(([name, count]) => ({ name, count }));
    /* Past the top six the tail folds into "Other" rather than growing the chart. */
    const tail = sorted.slice(6).reduce((sum, [, c]) => sum + c, 0);
    return tail ? [...head, { name: 'Other', count: tail }] : head;
  }, [properties]);

  /* ---------- price brackets: five equal bands across the actual price range ---------- */

  const priceBands = useMemo(() => {
    const prices = properties.map((p) => p.price).filter((n) => typeof n === 'number' && n > 0);
    if (prices.length < 2) return [];
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const step = (max - min) / 5 || 1;
    const bands = Array.from({ length: 5 }, (_, i) => {
      const from = Math.round(min + step * i);
      const to = Math.round(min + step * (i + 1));
      return {
        name: i === 4 ? `${formatCompact(from)}+` : formatCompact(from),
        range: i === 4 ? `${formatMoney(from)} and above` : `${formatMoney(from)} - ${formatMoney(to)}`,
        count: 0,
      };
    });
    prices.forEach((price) => {
      const idx = Math.min(4, Math.max(0, Math.floor((price - min) / step)));
      bands[idx].count += 1;
    });
    return bands;
  }, [properties]);

  /* ---------- agent leaderboard ---------- */

  const topAgents = useMemo(() => {
    const byAgent = new Map();
    properties.forEach((p) => {
      const id = p.agent?._id || p.agent;
      if (!id) return;
      const entry = byAgent.get(id) || {
        _id: id,
        name: p.agent?.name || 'Unknown agent',
        email: p.agent?.email || '',
        listings: 0,
        value: 0,
      };
      entry.listings += 1;
      entry.value += typeof p.price === 'number' ? p.price : 0;
      byAgent.set(id, entry);
    });
    const rows = [...byAgent.values()].sort((a, b) => b.listings - a.listings).slice(0, 6);
    const leader = rows[0]?.listings || 1;
    return rows.map((r, i) => ({ ...r, rank: i + 1, share: r.listings / leader }));
  }, [properties]);

  const pipeline = useMemo(() => {
    const counts = { approved: 0, pending: 0, rejected: 0 };
    applicants.forEach((u) => {
      if (counts[u.agentStatus] !== undefined) counts[u.agentStatus] += 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return PIPELINE.map((p) => ({ ...p, count: counts[p.key], share: counts[p.key] / total }));
  }, [applicants]);

  const recentListings = useMemo(
    () => [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
    [properties]
  );

  const portfolioValue = useMemo(
    () => properties.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : 0), 0),
    [properties]
  );

  const totalListings = properties.length;

  if (loading) {
    return (
      <div className="dash">
        <Skeleton active title={{ width: 240 }} paragraph={{ rows: 1 }} />
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {[0, 1, 2, 3].map((i) => (
            <Col xs={24} sm={12} xl={6} key={i}>
              <section className="dash-card">
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
              </section>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} xl={16}>
            <section className="dash-card">
              <Skeleton active paragraph={{ rows: 8 }} />
            </section>
          </Col>
          <Col xs={24} xl={8}>
            <section className="dash-card">
              <Skeleton active paragraph={{ rows: 8 }} />
            </section>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="dash">
      <header className="dash-head">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            {(users.length + agents.length).toLocaleString()} accounts and{' '}
            {totalListings.toLocaleString()} listings worth {formatMoney(portfolioValue)} across the
            platform.
          </p>
        </div>
        <div className="dash-head-meta">
          {updatedAt ? <span>Updated {updatedAt.toLocaleTimeString()}</span> : null}
          <Button icon={<ReloadOutlined />} loading={refreshing} onClick={() => loadData(true)}>
            Refresh
          </Button>
        </div>
      </header>

      {/* Hold the previous render at reduced opacity on refetch instead of a skeleton flash. */}
      <div className={refreshing ? 'dash-refreshing' : undefined}>
        <Row gutter={[16, 16]}>
          {kpis.map((kpi) => {
            const dir = kpi.diff > 0 ? 'up' : kpi.diff < 0 ? 'down' : '';
            const sparkId = `spark-${kpi.label.replace(/\s+/g, '-')}`;
            return (
              <Col xs={24} sm={12} xl={6} key={kpi.label}>
                <button type="button" className="dash-card kpi" onClick={() => navigate(kpi.to)}>
                  <div className="kpi-top">
                    <span
                      className="kpi-icon"
                      style={{ background: `${kpi.color}1f`, color: kpi.color }}
                    >
                      {kpi.icon}
                    </span>
                    <span className="kpi-label">{kpi.label}</span>
                  </div>
                  <div className="kpi-value">{kpi.value.toLocaleString()}</div>
                  <div className="kpi-foot">
                    <span className={`kpi-delta ${dir}`}>
                      <b>
                        {kpi.diff > 0 ? '+' : ''}
                        {kpi.diff}
                      </b>{' '}
                      vs prior 30 days
                    </span>
                    <div className="kpi-spark" aria-hidden="true">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={kpi.spark} margin={{ top: 3, right: 0, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={kpi.color} stopOpacity={0.3} />
                              <stop offset="100%" stopColor={kpi.color} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={kpi.color}
                            strokeWidth={2}
                            fill={`url(#${sparkId})`}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </button>
              </Col>
            );
          })}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} xl={16}>
            <Panel
              title="Platform growth"
              subtitle="New users and new listings per month, last 6 months"
              extra={
                <Segmented
                  size="small"
                  value={growthView}
                  onChange={setGrowthView}
                  options={['Chart', 'Table']}
                />
              }
            >
              {!growthHasData ? (
                <NoData height={300} />
              ) : growthView === 'Chart' ? (
                <>
                  <div style={{ height: 268 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growth} margin={{ top: 20, right: 18, bottom: 4, left: -18 }}>
                        <CartesianGrid {...gridProps} vertical={false} />
                        <XAxis dataKey="month" {...axisProps} />
                        <YAxis {...axisProps} allowDecimals={false} axisLine={false} />
                        <Tooltip content={<VizTip />} cursor={{ stroke: ink.axis, strokeWidth: 1 }} />
                        <Line
                          name="New users"
                          isAnimationActive={false}
                          type="monotone"
                          dataKey="users"
                          stroke={series.blue}
                          strokeWidth={2}
                          dot={{ r: 4, fill: series.blue, stroke: ink.surface, strokeWidth: 2 }}
                          activeDot={{ r: 6, stroke: ink.surface, strokeWidth: 2 }}
                        />
                        <Line
                          name="New listings"
                          isAnimationActive={false}
                          type="monotone"
                          dataKey="listings"
                          stroke={series.orange}
                          strokeWidth={2}
                          dot={{ r: 4, fill: series.orange, stroke: ink.surface, strokeWidth: 2 }}
                          activeDot={{ r: 6, stroke: ink.surface, strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <InlineLegend
                    items={[
                      { label: 'New users', color: series.blue, note: latest.users },
                      { label: 'New listings', color: series.orange, note: latest.listings },
                    ]}
                  />
                </>
              ) : (
                <Table
                  size="small"
                  pagination={false}
                  rowKey="month"
                  dataSource={growth}
                  columns={[
                    { title: 'Month', dataIndex: 'month', key: 'month' },
                    { title: 'New users', dataIndex: 'users', key: 'users', align: 'right' },
                    { title: 'New listings', dataIndex: 'listings', key: 'listings', align: 'right' },
                  ]}
                />
              )}
            </Panel>
          </Col>

          <Col xs={24} xl={8}>
            <Panel title="Listing status" subtitle="Share of the catalogue by current state">
              {!totalListings ? (
                <NoData height={300} />
              ) : (
                <>
                  <div className="donut-wrap" style={{ height: 204 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusMix}
                          dataKey="value"
                          nameKey="name"
                          isAnimationActive={false}
                          innerRadius={62}
                          outerRadius={92}
                          paddingAngle={2}
                          stroke={ink.surface}
                          strokeWidth={2}
                        >
                          {statusMix.map((entry) => (
                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip content={<VizTip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                      <strong>{totalListings.toLocaleString()}</strong>
                      <span>Listings</span>
                    </div>
                  </div>
                  {/* Counts live in the legend, so no slice is colour-only or tooltip-only. */}
                  <ul className="legend">
                    {statusMix.map((s) => (
                      <li key={s.name}>
                        <i style={{ background: STATUS_COLORS[s.name] }} />
                        <span className="legend-name">{s.name}</span>
                        <span className="legend-val">{s.value}</span>
                        <span className="legend-pct">
                          {Math.round((s.value / totalListings) * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Panel>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={14}>
            <Panel title="Listings by type" subtitle="Split between sale and rent">
              {!typeMix.length ? (
                <NoData height={268} />
              ) : (
                <>
                  <div style={{ height: 244 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={typeMix}
                        layout="vertical"
                        margin={{ top: 4, right: 40, bottom: 4, left: 8 }}
                        barCategoryGap="30%"
                      >
                        <CartesianGrid {...gridProps} horizontal={false} />
                        <XAxis type="number" {...axisProps} allowDecimals={false} axisLine={false} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          {...axisProps}
                          width={88}
                          axisLine={false}
                          tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
                        />
                        <Tooltip content={<VizTip />} cursor={{ fill: HOVER_FILL }} />
                        {/* A surface-coloured stroke is the 2px gap between stacked fills. */}
                        <Bar
                          name="For sale"
                          isAnimationActive={false}
                          dataKey="sale"
                          stackId="mix"
                          fill={series.blue}
                          stroke={ink.surface}
                          strokeWidth={2}
                        />
                        <Bar
                          name="For rent"
                          isAnimationActive={false}
                          dataKey="rent"
                          stackId="mix"
                          fill={series.orange}
                          stroke={ink.surface}
                          strokeWidth={2}
                          radius={[0, 4, 4, 0]}
                        >
                          <LabelList
                            dataKey="total"
                            position="right"
                            offset={10}
                            fill={ink.secondary}
                            fontSize={12}
                            fontWeight={620}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <InlineLegend
                    items={[
                      { label: 'For sale', color: series.blue },
                      { label: 'For rent', color: series.orange },
                    ]}
                  />
                </>
              )}
            </Panel>
          </Col>

          <Col xs={24} lg={10}>
            <Panel
              title="Agent applications"
              subtitle="Where every application currently sits"
              extra={
                <Button type="link" size="small" onClick={() => navigate('/admin/agentapplications')}>
                  Review <ArrowRightOutlined />
                </Button>
              }
            >
              {!applicants.length ? (
                <NoData height={210} />
              ) : (
                <div className="pipeline">
                  {pipeline.map((p) => (
                    <div key={p.key}>
                      <div className="pipeline-row">
                        {/* A status colour always rides with an icon and a label. */}
                        <span className="pipeline-icon" style={{ color: p.color }}>
                          {p.icon}
                        </span>
                        <span className="pipeline-label">{p.label}</span>
                        <b className="pipeline-count">{p.count}</b>
                      </div>
                      <div className="meter">
                        <span
                          style={{
                            width: `${p.count ? Math.max(p.share * 100, 3) : 0}%`,
                            background: p.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Panel title="Top cities" subtitle="Listings per city, highest first">
              {!cityMix.length ? (
                <NoData height={272} />
              ) : (
                <div style={{ height: 272 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cityMix}
                      layout="vertical"
                      margin={{ top: 4, right: 40, bottom: 4, left: 8 }}
                      barCategoryGap="28%"
                    >
                      <CartesianGrid {...gridProps} horizontal={false} />
                      <XAxis type="number" {...axisProps} allowDecimals={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        {...axisProps}
                        width={100}
                        axisLine={false}
                      />
                      <Tooltip content={<VizTip />} cursor={{ fill: HOVER_FILL }} />
                      {/* One series, one colour: bar length already encodes the magnitude. */}
                      <Bar name="Listings" isAnimationActive={false} dataKey="count" fill={series.blue} radius={[0, 4, 4, 0]}>
                        <LabelList
                          dataKey="count"
                          position="right"
                          offset={10}
                          fill={ink.secondary}
                          fontSize={12}
                          fontWeight={620}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>
          </Col>

          <Col xs={24} lg={12}>
            <Panel title="Price distribution" subtitle="Listings per price bracket">
              {!priceBands.length ? (
                <NoData height={272} />
              ) : (
                <div style={{ height: 272 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={priceBands}
                      margin={{ top: 22, right: 8, bottom: 4, left: -18 }}
                      barCategoryGap="26%"
                    >
                      <CartesianGrid {...gridProps} vertical={false} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} allowDecimals={false} axisLine={false} />
                      <Tooltip
                        content={<VizTip />}
                        cursor={{ fill: HOVER_FILL }}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.range || ''}
                      />
                      {/* Ordered bands, so one hue stepped light to dark -- never a rainbow. */}
                      <Bar name="Listings" isAnimationActive={false} dataKey="count" radius={[4, 4, 0, 0]}>
                        {priceBands.map((band, i) => (
                          <Cell key={band.name} fill={sequential[i]} />
                        ))}
                        <LabelList
                          dataKey="count"
                          position="top"
                          offset={8}
                          fill={ink.secondary}
                          fontSize={12}
                          fontWeight={620}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} xl={12}>
            <Panel
              title="Top agents"
              subtitle="Ranked by listings on the platform"
              extra={
                <Button type="link" size="small" onClick={() => navigate('/admin/agents')}>
                  All agents <ArrowRightOutlined />
                </Button>
              }
            >
              <Table
                size="small"
                rowKey="_id"
                pagination={false}
                scroll={{ x: 'max-content' }}
                dataSource={topAgents}
                locale={{ emptyText: 'No listings yet' }}
                columns={[
                  {
                    title: 'Agent',
                    key: 'agent',
                    render: (_, row) => (
                      <div className="rank-row">
                        <span className="rank-no">{row.rank}</span>
                        <div>
                          <div className="rank-name">{row.name}</div>
                          <div className="rank-mail">{row.email}</div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Listings',
                    dataIndex: 'listings',
                    key: 'listings',
                    align: 'right',
                    width: 84,
                  },
                  {
                    title: 'Portfolio',
                    dataIndex: 'value',
                    key: 'value',
                    align: 'right',
                    width: 132,
                    render: (value) => formatMoney(value),
                  },
                  {
                    title: 'Share',
                    key: 'share',
                    width: 96,
                    render: (_, row) => (
                      <div className="meter" title={`${Math.round(row.share * 100)}% of the leader`}>
                        <span style={{ width: `${Math.max(row.share * 100, 4)}%` }} />
                      </div>
                    ),
                  },
                ]}
              />
            </Panel>
          </Col>

          <Col xs={24} xl={12}>
            <Panel
              title="Recent listings"
              subtitle="Newest properties added to the platform"
              extra={
                <Button type="link" size="small" onClick={() => navigate('/admin/properties')}>
                  All listings <ArrowRightOutlined />
                </Button>
              }
            >
              <Table
                size="small"
                rowKey="_id"
                pagination={false}
                scroll={{ x: 'max-content' }}
                dataSource={recentListings}
                locale={{ emptyText: 'No listings yet' }}
                columns={[
                  {
                    title: 'Property',
                    key: 'title',
                    render: (_, row) => (
                      <div>
                        <div className="rank-name">{row.title}</div>
                        <div className="rank-mail">
                          {(row.location?.city || 'Unknown city') + ' · ' + row.type}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                    align: 'right',
                    width: 124,
                    render: (price) => formatMoney(price),
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: 96,
                    render: (status) => (
                      <Tag color={status === 'available' ? 'green' : status === 'sold' ? 'red' : 'orange'}>
                        {status}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Added',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    width: 96,
                    render: (date) => (date ? new Date(date).toLocaleDateString() : '-'),
                  },
                ]}
              />
            </Panel>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
