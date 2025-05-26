import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ShoppingBasket } from 'lucide-react';
import { supabase } from './lib/supabase';
import PriceForm from './components/PriceForm';
import PriceTable from './components/PriceTable';
import type { PriceEntry } from './types/supabase';

function App() {
  const [entries, setEntries] = useState<PriceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    // Check if Supabase is connected
    const checkSupabaseConnection = async () => {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          setIsSupabaseConnected(false);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase.from('price_entries').select('count');
        if (error && error.code === 'PGRST301') {
          // Table doesn't exist yet, but connection works
          setIsSupabaseConnected(true);
        } else {
          setIsSupabaseConnected(true);
        }
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsSupabaseConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupabaseConnection();
  }, []);

  useEffect(() => {
    if (isSupabaseConnected) {
      fetchEntries();
    }
  }, [isSupabaseConnected]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('price_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex items-center">
          <ShoppingBasket size={28} className="mr-3 text-teal-400" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Shopkeeper Price Tracker</h1>
            <p className="text-blue-200 text-sm">Track and manage your inventory prices</p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isSupabaseConnected ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Supabase Connection Required</h2>
            <p className="text-gray-600 mb-4">
              To use this application, you need to connect to Supabase first. Please click the "Connect to Supabase" button in the top right corner of the editor.
            </p>
            <p className="text-gray-600 mb-6">
              Once connected, you'll need to run the SQL migration to create the necessary table structure.
            </p>
            <div className="bg-gray-50 p-4 rounded-md text-sm text-left">
              <p className="font-medium mb-2">Required SQL Migration:</p>
              <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS price_entries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  item_name TEXT NOT NULL,
  supplier TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- Add some sample data
INSERT INTO price_entries (item_name, supplier, price)
VALUES 
  ('Organic Apples', 'Farm Fresh Produce', 2.99),
  ('Whole Wheat Bread', 'Sunshine Bakery', 3.49),
  ('Milk (1 Gallon)', 'Happy Cow Dairy', 4.29),
  ('Coffee Beans', 'Mountain Roasters', 12.99),
  ('Honey (16oz)', 'Local Bee Farm', 8.75);`}
              </pre>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Form Section */}
              <div className="lg:col-span-1">
                <PriceForm onSuccess={fetchEntries} />
              </div>
              
              {/* Table Section */}
              <div className="lg:col-span-2">
                <PriceTable entries={entries} isLoading={isLoading} />
              </div>
            </div>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Shopkeeper Price Tracker</p>
          <p className="text-sm mt-1 text-gray-400">
            Helping shopkeepers manage inventory costs effectively
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;