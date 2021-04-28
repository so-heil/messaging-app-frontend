import { UserDto } from "@services/interfaces/User.dto";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";

const LoginRedictor: React.FC<{ user: UserDto | null }> = ({ user }) => {
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/chat");
        }
    }, [user]);

    return <div></div>;
};

export default LoginRedictor;
