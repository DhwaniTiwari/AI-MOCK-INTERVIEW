import { NextResponse } from 'next/server';
import { auth } from '@/firebase/admin';

export async function POST(request: Request) {
    try {
        const { session } = await request.json();
        
        if (!session) {
            return NextResponse.json({ error: 'No session provided' }, { status: 400 });
        }

        await auth.verifySessionCookie(session, true);
        return NextResponse.json({ valid: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
} 