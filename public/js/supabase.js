// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

// Replace with your Supabase credentials
const supabaseUrl = 'https://lugeqqhmxgvfcikxrxps.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Z2VxcWhteGd2ZmNpa3hyeHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjU1OTAsImV4cCI6MjA1OTcwMTU5MH0.jVQ-Kqs_DnUgE0IgBebaD-F3YIvwozV_Y3xjUypSE-I'

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

// Authentication functions
async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username
      }
    }
  })
  
  if (error) throw error
  return data
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })
  
  if (error) throw error
  return data
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export {
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser
}