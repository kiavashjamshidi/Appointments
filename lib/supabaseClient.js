// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bevmdwleuwggybcodqeg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldm1kd2xldXdnZ3liY29kcWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTAzNjgsImV4cCI6MjA2NjI2NjM2OH0.D5AaEoiWuzNVmrKMlZT3NwDuE32VQbZYPauhl9rdXH4';
export const supabase = createClient(supabaseUrl, supabaseKey);
