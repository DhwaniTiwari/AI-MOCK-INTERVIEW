import {ReactNode} from 'react'
import {redirect} from "next/navigation";
import {isAuthenticated} from "@/lib/actions/authaction";

export const dynamic = 'force-dynamic';

const AuthLayout = async ({children}: {children: ReactNode}) => {
    try {
        const isUserAuthenticated = await isAuthenticated();

        if (isUserAuthenticated) {
            redirect("/");
        }

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg">
                    {children}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error in AuthLayout:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-8  rounded-lg shadow-lg">
                    {children}
                </div>
            </div>
        );
    }
}

export default AuthLayout;
