'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/actions/authaction';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = await isAuthenticated();
            if (authenticated) {
                router.push('/');
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {children}
            </div>
        </div>
    );
} 