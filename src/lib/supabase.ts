import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: { 'x-application-name': 'shopkeeper-price-tracker' },
  },
});

// Queue for offline operations
const queue: Array<{ operation: string; data: any }> = [];
let isProcessingQueue = false;

export const addToQueue = (operation: string, data: any) => {
  queue.push({ operation, data });
  localStorage.setItem('operationQueue', JSON.stringify(queue));
  processQueue();
};

export const processQueue = async () => {
  if (isProcessingQueue || queue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (queue.length > 0) {
    const item = queue[0];
    
    try {
      if (item.operation === 'insert') {
        await supabase.from('prices').insert(item.data);
      }
      
      // Remove from queue if successful
      queue.shift();
      localStorage.setItem('operationQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to process queue item:', error);
      break; // Stop processing on error
    }
  }
  
  isProcessingQueue = false;
};

// Load queued operations on startup
const loadQueue = () => {
  const saved = localStorage.getItem('operationQueue');
  if (saved) {
    queue.push(...JSON.parse(saved));
    processQueue();
  }
};

loadQueue();

// Listen for online status
window.addEventListener('online', processQueue);