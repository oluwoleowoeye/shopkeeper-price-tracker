import React from 'react';
import { Clock, DollarSign, Package, Store } from 'lucide-react';
import type { PriceEntry } from '../types/supabase';

interface PriceTableProps {
  entries: PriceEntry[];
  isLoading: boolean;
}

export default function PriceTable({ entries, isLoading }: PriceTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3 text-blue-900">
          <div className="w-6 h-6 rounded-full bg-blue-200 animate-spin" />
          Loading recent entries...
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
        <Package size={64} className="text-blue-200 mb-4" />
        <h3 className="text-xl font-medium text-blue-900">No price entries yet</h3>
        <p className="text-gray-600 mt-2">Add your first price entry using the form.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.01]">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-blue-900">Recent Price Entries</h2>
        <p className="text-gray-600 mt-1">Showing the 5 most recent entries</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-teal-50">
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-teal-600" />
                  <span>Item</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-teal-600" />
                  <span>Supplier</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-teal-600" />
                  <span>Price</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-teal-600" />
                  <span>Date Added</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry, index) => (
              <tr 
                key={entry.id}
                className="hover:bg-blue-50/50 transition-colors duration-150"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideUp 0.5s ease-out forwards'
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-900">{entry.item_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{entry.supplier}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-teal-600">{formatPrice(entry.price)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatDate(entry.created_at)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}