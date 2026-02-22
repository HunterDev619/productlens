'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useUserStatisticsOverview } from '@/services/admin/users/statistics';

type InlineChartProps = {
  title: string;
  timeline: string[];
  data: number[];
  lineColor: string;
  areaColor: string;
};

function InlineChart({ title, timeline, data, lineColor, areaColor }: InlineChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || !timeline.length) {
      return;
    }

    let timeoutId: number | null = null;

    const handleResize = () => {
      if (instanceRef.current) {
        instanceRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    import('echarts').then((echarts) => {
      if (instanceRef.current) {
        instanceRef.current.dispose();
      }
      const instance = echarts.init(chartRef.current as HTMLDivElement);
      instanceRef.current = instance;

      const option = {
        grid: { left: 40, right: 16, top: 8, bottom: 32 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeline.map(t => new Date(t).toLocaleDateString()),
          axisLabel: { color: '#6B7280', fontSize: 10 },
          axisLine: { lineStyle: { color: '#E5E7EB' } },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#6B7280', fontSize: 10 },
          splitLine: { lineStyle: { color: '#E5E7EB', type: 'dashed' } },
        },
        series: [
          {
            name: title,
            type: 'line',
            smooth: true,
            showSymbol: false,
            areaStyle: { color: areaColor },
            lineStyle: { color: lineColor, width: 2 },
            data,
          },
        ],
      } as any;

      instance.setOption(option);
      timeoutId = window.setTimeout(() => instance.resize(), 50);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (instanceRef.current && !instanceRef.current.isDisposed()) {
        instanceRef.current.dispose();
      }
    };
  }, [timeline, data, lineColor, areaColor, title]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-gray-900">{title}</h3>
      <div ref={chartRef} className="h-56 w-full" />
    </div>
  );
}

export default function OverviewPageContent() {
  const { data, isLoading, error } = useUserStatisticsOverview({});

  const details = data?.data?.statisticsDetails;
  const timeline = useMemo(() => details?.statisticsTime || [], [details]);
  const totalUsers = useMemo(() => details?.totalUsers || [], [details]);
  const activeUsers = useMemo(() => details?.activeUsers || [], [details]);
  const inactiveUsers = useMemo(() => details?.inactiveUsers || [], [details]);
  const recentUsers = useMemo(() => details?.recentUsers || [], [details]);
  const twoFactorEnabled = useMemo(() => details?.twoFactorEnabled || [], [details]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">Failed to load statistics.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <InlineChart
          title="Total Users"
          timeline={timeline}
          data={totalUsers}
          lineColor="#2563EB"
          areaColor="rgba(37, 99, 235, 0.12)"
        />
        <InlineChart
          title="Active Users"
          timeline={timeline}
          data={activeUsers}
          lineColor="#10B981"
          areaColor="rgba(16, 185, 129, 0.18)"
        />
        <InlineChart
          title="Inactive Users"
          timeline={timeline}
          data={inactiveUsers}
          lineColor="#EF4444"
          areaColor="rgba(239, 68, 68, 0.10)"
        />
        <InlineChart
          title="Recent Users"
          timeline={timeline}
          data={recentUsers}
          lineColor="#8B5CF6"
          areaColor="rgba(139, 92, 246, 0.12)"
        />
        <InlineChart
          title="2FA Enabled"
          timeline={timeline}
          data={twoFactorEnabled}
          lineColor="#F59E0B"
          areaColor="rgba(245, 158, 11, 0.12)"
        />
      </div>
    </div>
  );
}
