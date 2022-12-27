import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Register user
    const register = async (user) => {};

    // Login user
    const login = async ({ email: identifier, password }) => {};

    // Logout user
    const logout = async () => {};

    // Check if user is logged in
    const checkUserLoggedIn = async (user) => {};

    return (
        <AuthContext.Provider value={{ user, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
