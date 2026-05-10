import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prkvlwhvodxnvenvmyhl.supabase.co';
// PASTE YOUR ACTUAL KEY BELOW, completely removing import.meta.env
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBya3Zsd2h2b2R4bnZlbnZteWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTE5MTcsImV4cCI6MjA5Mzg4NzkxN30.IQmPq3kJpkyraK-gQGGrhN0a1iOQWw96551e6dQxQk4'; 

export const supabase = createClient(supabaseUrl, supabaseKey);