import {initializeApp, getApps, cert} from 'firebase-admin/app';
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
    const apps = getApps();

    if(!apps.length){
        // Debug logging
        console.log('Environment variables check:', {
            hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
            hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
            hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY?.split('@')[0] + '@...',
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length
        });

        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
            console.error('Missing Firebase Admin SDK credentials');
            throw new Error('Missing Firebase Admin SDK credentials');
        }

        try {
            // Format the private key properly
            const privateKey = process.env.FIREBASE_PRIVATE_KEY
                .replace(/\\n/g, '\n')  // Replace \n with actual newlines
                .trim();                // Remove any extra whitespace

            // Debug logging for private key format
            console.log('Private key format check:', {
                startsWith: privateKey.startsWith('-----BEGIN PRIVATE KEY-----'),
                endsWith: privateKey.endsWith('-----END PRIVATE KEY-----'),
                length: privateKey.length
            });

            // Verify the private key format
            if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----') || 
                !privateKey.endsWith('-----END PRIVATE KEY-----')) {
                throw new Error('Invalid private key format');
            }

            const app = initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey
                })
            });

            console.log('Firebase Admin SDK initialized successfully');
            return {
                auth: getAuth(app),
                db: getFirestore(app)
            };
        } catch (error) {
            console.error('Error initializing Firebase Admin:', error);
            throw new Error('Failed to initialize Firebase Admin SDK');
        }
    }

    return {
        auth: getAuth(),
        db: getFirestore()
    };
}

export const {auth, db} = initFirebaseAdmin();