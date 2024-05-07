"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IUserData {
    id: string,
    email: string,
}

const withAuth = (Component: React.ElementType) => {
    const AuthenticatedComponent = () => {
        
        const router = useRouter();
        const [data, setData] = useState<IUserData | null>(null)

        useEffect(() => {
            const getUser = async () => {
                // const response = await fetch('http://localhost:4000/user/me', {
                //     headers: {
                //     },
                // })
                // const userData = await response.json();
                const userData = null

                if (!userData) {
                    router.push('/auth');
                } else {
                    setData(userData);
                }
            }
            getUser();
        } , [router]);

        return !!data ? <Component data={data} /> : null; // Render whatever you want while the authentication occurs
    };

    return AuthenticatedComponent;
};

export default withAuth;