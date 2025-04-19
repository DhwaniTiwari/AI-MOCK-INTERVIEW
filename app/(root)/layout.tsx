import  {ReactNode} from 'react'
import Image from "next/image";
import Link from "next/link";
import {resolveAppleWebApp} from "next/dist/lib/metadata/resolvers/resolve-basics";
import {redirect} from "next/navigation";
import {isAuthenticated} from "@/lib/actions/authaction";

const RootLayout =  async ({children} :{children : ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated();

    if(!isUserAuthenticated) redirect('/sign-in');
    return (
        <div className="root-layout">
            <nav>
                <Link href="/" className="flex items-center gap-2">
                    <Image 
                        src="/logo.svg" 
                        alt="Logo" 
                        width={38} 
                        height={32}
                        className="w-[38px] h-[32px]"
                    />
                </Link>
                <h2 className="text-primary-100">MockMuse</h2>
            </nav>

            {children}
        </div>
    )
}
export default RootLayout
