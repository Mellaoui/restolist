import { defineEventHandler, getHeader, setResponseStatus } from 'h3';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { admin } from '~/server/utils/firebase-admin'; // Proper initialization

export default defineEventHandler(async (event) => {
  // Set security headers for all responses
  setResponseHeaders(event, {
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff'
  });

  const authHeader = getHeader(event, 'Authorization');
  
  if (!authHeader) {
    setResponseStatus(event, 401);
    return { 
      error: 'Unauthorized - Token required',
      valid: false 
    };
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (!token) {
    setResponseStatus(event, 403);
    return { 
      error: 'Forbidden - Malformed token',
      valid: false 
    };
  }

  try {
    const decodedToken = await verifyFirebaseToken(token);
    
    if (decodedToken) {
      // Store decoded token in context for subsequent middleware/handlers
      event.context.auth = { 
        uid: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified 
      };
      
      return { 
        valid: true,
        uid: decodedToken.uid,
        claims: decodedToken 
      };
    }
    
  } catch (error: any) {
    setResponseStatus(event, 403);
    console.error('[Auth Error]', error.message);
    
    return {
      valid: false,
      error: error.code || 'AUTH_ERROR',
      message: error.message
    };
  }
});

async function verifyFirebaseToken(token: string): Promise<DecodedIdToken> {
  try {
    return await admin.auth().verifyIdToken(token, true); // Check token revocation
  } catch (error: any) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid or revoked token',
    });
  }
}