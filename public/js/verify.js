// verify.js
import { supabase } from './supabase.js';

// Function to compute document hash
async function computeHash(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Function to verify document against blockchain records
async function verifyDocument(file) {
  try {
    // Calculate hash of the document
    const documentHash = await computeHash(file);
    
    // Query Supabase for this document hash
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('hash', documentHash)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means no rows returned
        return {
          verified: false,
          message: "Document not found in our records. This document has not been verified in our system."
        };
      }
      throw error;
    }
    
    // If we got here, document was found
    return {
      verified: true,
      message: "Document verified successfully!",
      details: {
        uploadedBy: data.uploaded_by,
        uploadedAt: new Date(data.created_at).toLocaleString(),
        filename: data.filename,
        fileSize: data.file_size,
        documentType: data.document_type
      }
    };
  } catch (error) {
    console.error("Error verifying document:", error);
    return {
      verified: false,
      error: true,
      message: "An error occurred during verification. Please try again later."
    };
  }
}

export { verifyDocument };