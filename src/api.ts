import axios from "axios";

const supabaseClient = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_BASE_URL, // Vite uses import.meta.env
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_API_KEY, // Supabase API key
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`, // Authorization header
  },
});

export default supabaseClient;
