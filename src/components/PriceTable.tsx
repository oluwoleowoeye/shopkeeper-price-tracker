import React from 'react';
import { Clock, DollarSign, Package, Store, Tag } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-md p-6 min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading recent entries...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
        <Package size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700">No price entries yet</h3>
        <p className="text-gray-500 mt-2">Add your first price entry using the form above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Recent Price Entries</h2>
        <p className="text-sm text-gray-500 mt-1">Showing the 5 most recent entries</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  <span>Item</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Store size={14} />
                  <span>Supplier</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <DollarSign size={14} />
                  <span>Price</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>Date Added</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr 
                key={entry.id} 
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.item_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatPrice(entry.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(entry.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}