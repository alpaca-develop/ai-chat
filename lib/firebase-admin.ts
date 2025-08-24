import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(firebaseAdminConfig),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  : getApps()[0]

export const adminAuth = getAuth(app)