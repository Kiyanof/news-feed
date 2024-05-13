"use client"
import { whoIsMe } from "@/app/API/route/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IUserData {
    email: string,
}

const withAuth = (Component: React.ElementType) => {
    const AuthenticatedComponent = () => {
        
        const router = useRouter();
        const [data, setData] = useState<IUserData | null>(null)

        useEffect(() => {
            try {
                const getUser = async () => {
                    const response = await whoIsMe()
                    const userData = response ? response.data : null
    
                    if (!userData) {
                        setData(null);
                        router.push('/auth');
                    } else {
                        setData(userData);
                    }
                }
    
                getUser()
            } catch (error) {
                setData(null);
                router.push('/auth');
            }
        } , [router]);

        return !!data ? <Component {...data} /> : null; 
    };

    return AuthenticatedComponent;
};

export default withAuth;