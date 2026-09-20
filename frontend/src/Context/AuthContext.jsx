import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setAuthLoading(false);
            return;
        }

        api.get("/users/profile")
            .then((response) => setUser(response.data))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setAuthLoading(false));
    }, []);

    const login = async (values) => {
        const response = await api.post("/auth/login", values);

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        setUser(user);

        return response.data;
    };

    const signup = async (values) => {
        const response = await api.post("/auth/signup", values);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                authLoading,
                login,
                signup,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};