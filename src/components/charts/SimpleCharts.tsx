'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  title: string;
  data: ChartDataPoint[];
  maxValue?: number;
  delay?: number;
}

export function SimpleBarChart({
  title,
  data,
  maxValue = 100,
  delay = 0,
}: SimpleBarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="p-6 h-full bg-gradient-to-br from-background to-secondary/20 border-border/50">
        <h3 className="text-lg font-semibold mb-6">{title}</h3>

        <div className="space-y-4">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
              <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: delay + 0.2 + index * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${
                    item.color ||
                    (index % 3 === 0
                      ? 'from-primary to-accent'
                      : index % 3 === 1
                        ? 'from-accent to-primary'
                        : 'from-success to-primary')
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

interface LineChartDataPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  title: string;
  data: LineChartDataPoint[];
  delay?: number;
}

export function SimpleLineChart({
  title,
  data,
  delay = 0,
}: SimpleLineChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const normalizedData = data.map((d) => ({
    ...d,
    normalized: (d.value - minValue) / range,
  }));

  const points = normalizedData
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - d.normalized * 80 - 10;
      return { x, y, ...d };
    })
    .slice(0, -1);

  const pathD = ['M', ...points.map((p) => `${p.x},${p.y}`).join(' L ')].join(' ');
  const fillPath = [
    'M',
    ...points.map((p) => `${p.x},${p.y}`).join(' L '),
    `L ${points[points.length - 1]?.x || 0}, 100`,
    `L 0, 100`,
    'Z',
  ].join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="p-6 h-full bg-gradient-to-br from-background to-secondary/20 border-border/50">
        <h3 className="text-lg font-semibold mb-6">{title}</h3>

        <div className="space-y-4">
          <div className="w-full aspect-[16/9] relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid */}
              {[0, 25, 50, 75].map((y) => (
                <line
                  key={`grid-${y}`}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border/30"
                />
              ))}

              {/* Fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: delay + 0.3 }}
                d={fillPath}
                className="fill-primary/10"
              />

              {/* Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: delay + 0.2 }}
                d={pathD}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-primary"
              />

              {/* Points */}
              {points.map((p, i) => (
                <motion.circle
                  key={`point-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="1.5"
                  fill="currentColor"
                  className="text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.4 + i * 0.1 }}
                />
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex gap-4">
            {normalizedData.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-1">{d.label}</p>
                <p className="text-sm font-semibold">{d.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
