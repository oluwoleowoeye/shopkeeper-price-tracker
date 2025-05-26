import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import { supabase, addToQueue } from '../lib/supabase';
import type { NewPriceEntry } from '../types/supabase';

// Create Audio instance and preload
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
      date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
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
      
      // Play the cha-ching sound
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
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Price Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="item_name" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            id="item_name"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            placeholder="Enter item name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
        </div>
        
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            placeholder="Enter supplier name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <PlusCircle size={18} />
          {isSubmitting ? 'Saving...' : 'Save Price Entry'}
        </button>
      </form>
    </div>
  );
}