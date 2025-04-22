"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { User, SignInParams, SignUpParams } from "@/types";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        // check if user exists in db
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };

        // save user to db
        await db.collection("users").doc(uid).set({
            name,
            email,
            // profileURL,
            // resumeURL,
        });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error: any) {
        console.error("Error creating user:", error);

        // Handle Firebase specific errors
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use",
            };
        }

        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord)
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };

        await setSessionCookie(idToken);
    } catch (error: any) {
        console.log("");

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

// Sign out user by clearing the session cookie
export async function signOut() {
    const cookieStore = await cookies();

    cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // get user info from db
        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.log(error);

        // Invalid or expired session
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}







































































// 'use server';
//
// import {auth, db} from "@/firebase/admin";
// import {cookies} from "next/headers";
//
// const ONE_WEEK = 60 * 60 * 24 * 7;
//
// export async function signUp(params: SignUpParams) {
//     const { uid, name, email } = params;
//
//     try {
//         // First check if user exists in Firestore
//         const userDoc = await db.collection('users').doc(uid).get();
//
//         if (userDoc.exists) {
//             return {
//                 success: false,
//                 message: 'User already exists. Please sign in instead.'
//             };
//         }
//
//         // Create user in Firestore
//         await db.collection('users').doc(uid).set({
//             name,
//             email,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         });
//
//         return {
//             success: true,
//             message: 'User created successfully'
//         };
//     } catch (error) {
//         console.error('Error creating user:', error);
//         return {
//             success: false,
//             message: error instanceof Error ? error.message : 'An error occurred during sign up'
//         };
//     }
// }
//
// export async function signIn(params: SignInParams) {
//     const {email, idToken} = params;
//
//     try {
//         const userRecord = await auth.getUserByEmail(email);
//
//         if(!userRecord) {
//             return {
//                 success: false,
//                 message: 'User does not exist. Please create an account instead.'
//             };
//         }
//
//         // Create session cookie
//         const sessionCookie = await auth.createSessionCookie(idToken, {
//             expiresIn: ONE_WEEK * 1000,
//         });
//
//         // Set the session cookie
//         const cookieStore = await cookies();
//         await cookieStore.set('session', sessionCookie, {
//             maxAge: ONE_WEEK,
//             httpOnly: true,
//             secure: true,
//             path: '/',
//             sameSite: 'lax'
//         });
//
//         return {
//             success: true,
//             message: 'Successfully signed in'
//         };
//     } catch (error: any) {
//         console.error('Error during sign in:', error);
//
//         if (error.code === 'auth/user-not-found') {
//             return {
//                 success: false,
//                 message: 'User does not exist. Please create an account instead.'
//             };
//         }
//
//         if (error.code === 'auth/invalid-credential') {
//             return {
//                 success: false,
//                 message: 'Invalid credentials. Please check your email and password.'
//             };
//         }
//
//         return {
//             success: false,
//             message: 'Failed to sign in. Please try again later.'
//         };
//     }
// }
//
// export async function setSessionCookie(idToken: string) {
//     try {
//         const sessionCookie = await auth.createSessionCookie(idToken, {
//             expiresIn: ONE_WEEK * 1000,
//         });
//
//         const cookieStore = await cookies();
//         cookieStore.set('session', sessionCookie, {
//             maxAge: ONE_WEEK,
//             httpOnly: true,
//             secure: true,
//             path: '/',
//             sameSite: 'lax'
//         });
//
//         return true;
//     } catch (error) {
//         console.error('Error setting session cookie:', error);
//         return false;
//     }
// }
//
// export async function getCurrentUser(): Promise<User | null> {
//     const cookieStore = await cookies();
//
//     const sessionCookie = cookieStore.get('session')?.value;
//
//     if(!sessionCookie) return null;
//
//
//     try {
//         const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
//
//         const userRecord =  await db.collection('users').doc(decodedClaims.uid).get();
//
//         if(!userRecord.exists) return null;
//
//         return {
//             ...userRecord.data(),
//             id : userRecord.id,
//         } as User;
//     }catch (e){
//         console.log(e)
//
//         return null;
//     }
// }
//
// export async function isAuthenticated(){
//     const user =  await getCurrentUser();
//
//     return !!user;
// }
//
// export async function verifySession() {
//     try {
//         const cookieStore = await cookies();
//         const session = cookieStore.get('session')?.value;
//
//         if (!session) {
//             return false;
//         }
//
//         const response = await fetch('/api/auth/verify', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ session }),
//         });
//
//         if (!response.ok) {
//             cookieStore.delete('session');
//             return false;
//         }
//
//         return true;
//     } catch (error) {
//         console.error('Error verifying session:', error);
//         return false;
//     }
// }