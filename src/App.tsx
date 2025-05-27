import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ShoppingBasket } from 'lucide-react';
import { supabase } from './lib/supabase';
import PriceForm from './components/PriceForm';
import PriceTable from './components/PriceTable';
import PriceDashboard from './components/PriceDashboard';
import type { PriceEntry } from './types/supabase';

function App() {
  const [entries, setEntries] = useState<PriceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [view, setView] = useState<'table' | 'dashboard'>('table');

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          setIsSupabaseConnected(false);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase.from('prices').select('count');
        if (error && error.code === 'PGRST301') {
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
        .from('prices')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e3a8a',
            color: '#fff',
            borderRadius: '0.5rem',
          },
        }}
      />
      
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <div className="bg-white/10 p-3 rounded-full mr-4">
              <ShoppingBasket size={32} className="text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Shopkeeper Price Tracker
              </h1>
              <p className="text-blue-200 text-sm sm:text-base mt-1">
                Track and manage your inventory prices with ease
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'table'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              Recent Entries
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'dashboard'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {!isSupabaseConnected ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-8 text-center max-w-2xl mx-auto transform hover:scale-[1.01] transition-all">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Supabase Connection Required
            </h2>
            <p className="text-gray-600 mb-4">
              To use this application, you need to connect to Supabase first. Please click the "Connect to Supabase" button in the top right corner of the editor.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 animate-fade-in">
              <div className="lg:col-span-1">
                <PriceForm onSuccess={fetchEntries} />
              </div>
              <div className="lg:col-span-2">
                {view === 'table' ? (
                  <PriceTable entries={entries.slice(0, 5)} isLoading={isLoading} />
                ) : (
                  <PriceDashboard entries={entries} />
                )}
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-medium">© {new Date().getFullYear()} Shopkeeper Price Tracker</p>
          <p className="text-blue-200 mt-2">
            Empowering shopkeepers with smart price management
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;