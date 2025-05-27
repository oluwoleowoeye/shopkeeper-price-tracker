import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PlusCircle, DollarSign, Package, Store } from 'lucide-react';
import { supabase, addToQueue } from '../lib/supabase';
import type { NewPriceEntry } from '../types/supabase';

const chaChing = new Audio('/assets/cha-ching.mp3');
chaChing.preload = 'auto';

interface PriceFormProps {
  onSuccess: () => void;
}

export default function PriceForm({ onSuccess }: PriceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewPriceEntry>({
    item_name: '',
    supplier: '',
    price: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item_name || !formData.supplier || formData.price <= 0) {
      toast.error('Please fill in all fields with valid values');
      return;
    }
    
    setIsSubmitting(true);
    
    const entry = {
      ...formData,
      shopkeeper_id: 'guest',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      if (!navigator.onLine) {
        addToQueue('insert', entry);
        toast.success('Entry saved offline. Will sync when online.');
        setFormData({ item_name: '', supplier: '', price: 0 });
        onSuccess();
        return;
      }

      const { error } = await supabase.from('prices').insert(entry);
        
      if (error) throw error;
      
      try {
        await chaChing.play();
      } catch (audioError) {
        console.warn('Could not play sound:', audioError);
      }
      
      toast.success('Price entry saved successfully!');
      setFormData({ item_name: '', supplier: '', price: 0 });
      onSuccess();
    } catch (error) {
      console.error('Error saving price entry:', error);
      toast.error('Failed to save price entry. Retrying in background...');
      addToQueue('insert', entry);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.01]">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
        <PlusCircle className="text-teal-600" />
        New Price Entry
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="item_name" className="flex items-center text-sm font-medium text-gray-700">
            <Package size={16} className="mr-2" />
            Item Name
          </label>
          <input
            type="text"
            id="item_name"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            placeholder="Enter item name"
            className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="supplier" className="flex items-center text-sm font-medium text-gray-700">
            <Store size={16} className="mr-2" />
            Supplier
          </label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            placeholder="Enter supplier name"
            className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price" className="flex items-center text-sm font-medium text-gray-700">
            <DollarSign size={16} className="mr-2" />
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle size={20} />
          {isSubmitting ? 'Saving...' : 'Save Price Entry'}
        </button>
      </form>
    </div>
  );
}