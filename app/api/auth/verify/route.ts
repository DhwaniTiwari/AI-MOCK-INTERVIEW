import { NextResponse } from 'next/server';
import { auth } from '@/firebase/admin';

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json(
                { error: 'ID token is required' },
                { status: 400 }
            );
        }

        const decodedToken = await auth.verifyIdToken(idToken);
        return NextResponse.json({ uid: decodedToken.uid });
    } catch (err) {
        console.error('Error verifying token:', err);
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        );
    }
} 