import React from 'react'
import Agent from "@/components/Agent";
import { getCurrentUser } from '@/lib/actions/authaction';

const Page = async () => {

    const user = await getCurrentUser();

    return (
        <>
            <h3>Interview Generation</h3>

            <Agent userName={ user?.name} userId={user?.id} type="generate"/>
        </>
    )
}
export default Page
