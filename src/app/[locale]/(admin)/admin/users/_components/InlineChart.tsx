'use client';

import { useEffect, useRef } from 'react';

type InlineChartProps = {
  title: string;
  timeline: string[];
  data: number[];
  lineColor: string;
  areaColor: string;
};

export function InlineChart({ title, timeline, data, lineColor, areaColor }: InlineChartProps) {
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
      <div ref={chartRef} className="h-48 w-full" />
    </div>
  );
}
