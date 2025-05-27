import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format } from 'date-fns';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { PriceEntry } from '../types/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceDashboardProps {
  entries: PriceEntry[];
}

export default function PriceDashboard({ entries }: PriceDashboardProps) {
  // Group entries by supplier
  const supplierData = entries.reduce((acc, entry) => {
    if (!acc[entry.supplier]) {
      acc[entry.supplier] = [];
    }
    acc[entry.supplier].push(entry);
    return acc;
  }, {} as Record<string, PriceEntry[]>);

  // Calculate average prices by supplier
  const averagePrices = Object.entries(supplierData).map(([supplier, entries]) => {
    const avg = entries.reduce((sum, entry) => sum + entry.price, 0) / entries.length;
    return { supplier, avgPrice: avg };
  });

  // Prepare chart data
  const chartData = {
    labels: entries
      .slice(-10)
      .map(entry => format(new Date(entry.created_at), 'MMM d')),
    datasets: Object.entries(supplierData).map(([supplier, data], index) => ({
      label: supplier,
      data: data.slice(-10).map(entry => entry.price),
      borderColor: [
        '#1e40af',
        '#0d9488',
        '#7c3aed',
        '#db2777',
        '#ea580c'
      ][index % 5],
      tension: 0.4
    }))
  };

  // Predict price trends (simple linear regression)
  const predictTrend = (prices: number[]) => {
    const n = prices.length;
    if (n < 2) return 0;
    
    const x = Array.from({ length: n }, (_, i) => i);
    const y = prices;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, i) => a + (i * y[i]), 0);
    const sumXX = x.reduce((a, i) => a + (i * i), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  };

  // Get price alerts
  const priceAlerts = entries
    .filter(entry => {
      const avgPrice = averagePrices.find(ap => ap.supplier === entry.supplier)?.avgPrice || 0;
      return entry.price < avgPrice * 0.8; // 20% below average
    })
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Price Comparison Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 col-span-2">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <TrendingUp className="text-teal-600" />
          Price Trends by Supplier
        </h3>
        <div className="h-[300px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: value => `$${value}`
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Price Alerts */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="text-teal-600" />
          Price Alerts
        </h3>
        {priceAlerts.length > 0 ? (
          <ul className="space-y-4">
            {priceAlerts.map(alert => (
              <li
                key={alert.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-blue-900">{alert.item_name}</p>
                  <p className="text-sm text-gray-600">{alert.supplier}</p>
                </div>
                <div className="text-teal-600 font-medium">
                  ${alert.price.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No price alerts at the moment.</p>
        )}
      </div>

      {/* Supplier Analysis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Supplier Analysis</h3>
        <div className="space-y-4">
          {averagePrices.map(({ supplier, avgPrice }) => {
            const trend = predictTrend(supplierData[supplier].map(e => e.price));
            return (
              <div
                key={supplier}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-blue-900">{supplier}</p>
                  <p className="text-sm text-gray-600">
                    Trend: {trend > 0 ? '↗️ Rising' : trend < 0 ? '↘️ Falling' : '→ Stable'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-teal-600">
                    ${avgPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">avg. price</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}