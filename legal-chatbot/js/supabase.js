// js/supabase.js
import { createClient } from '@supabase/supabase-js';
import geminiChatbot from './gemini-chat.js';

// Initialize Supabase client
const supabaseUrl = 'https://lugeqqhmxgvfcikxrxps.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Z2VxcWhteGd2ZmNpa3hyeHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjU1OTAsImV4cCI6MjA1OTcwMTU5MH0.jVQ-Kqs_DnUgE0IgBebaD-F3YIvwozV_Y3xjUypSE-I'


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }
  
  if (user) {
    // Set user ID in chatbot to load their conversation history
    geminiChatbot.setUserId(user.id);
  }
  
  return user;
}

// Sign in with email and password
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  
  if (error) {
    throw error;
  }
  
  // Set user ID in chatbot
  if (data.user) {
    geminiChatbot.setUserId(data.user.id);
  }
  
  return data;
}

// Sign up with email and password
export async function signUpWithEmail(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username,
      }
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  // Clear chatbot user ID
  geminiChatbot.setUserId(null);
}

// Password reset request
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password.html',
  });
  
  if (error) {
    throw error;
  }
  
  return true;
}

// Update user profile
export async function updateProfile(profile) {
  const { data, error } = await supabase.auth.updateUser({
    data: profile
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Get document by hash
export async function getDocumentByHash(documentHash) {
  const { data, error } = await supabase
    .from('legal_documents')
    .select('*')
    .eq('document_hash', documentHash)
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Upload document metadata to Supabase
export async function uploadDocumentMetadata(documentHash, documentType, title, metadata = {}) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User must be logged in to upload documents');
  }
  
  const { data, error } = await supabase
    .from('legal_documents')
    .insert([
      {
        document_hash: documentHash,
        document_type: documentType,
        title: title,
        owner_id: user.id,
        metadata: metadata
      }
    ]);
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Add document verify function
export async function verifyDocument(documentHash) {
  try {
    // Get document
    const document = await getDocumentByHash(documentHash);
    
    if (!document) {
      return { verified: false, message: 'Document not found' };
    }
    
    // Increment verification count
    const { error } = await supabase.rpc('increment_verification_count', {
      document_hash: documentHash
    });
    
    if (error) {
      throw error;
    }
    
    return { 
      verified: true, 
      document: document 
    };
  } catch (error) {
    console.error('Error verifying document:', error);
    return { verified: false, message: error.message };
  }
}

export default supabase;