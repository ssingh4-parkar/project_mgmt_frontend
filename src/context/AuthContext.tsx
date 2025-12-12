import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: User | null;
    permissions: number[];
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({ baseURL: 'http://localhost:5000/api',});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken');
    if (token) { config.headers.Authorization = `Bearer ${token}`; }
    return config;
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Start loading as true
    const navigate = useNavigate();
    
    // Helper with safety checks and explicit typing
    const setAuthData = (userData: User, token: string) => {
        if (!userData || !token) return; 
        
        localStorage.setItem('userToken', token);
        setUser(userData);
        if (userData.role?.permissions) {
            setPermissions(userData.role.permissions);
        } else {
            setPermissions([]);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        
        // ASSUMPTION: Backend returns { user: UserObject, token: string }
        const { user: userData, token } = response.data; 
        
        setAuthData(userData, token);
        console.log(response)
        
        // FIX 1: Manually set isLoading to false after successful login 
        // to unblock routing guards immediately.
        setIsLoading(false); 
     
        navigate('/home');
    };
    
    const logout = () => {
        localStorage.removeItem('userToken');
        setUser(null);
        setPermissions([]);
        navigate('/login');
    };
    
    useEffect(() => {
        const checkLoginStatus = async () => { 
            const token = localStorage.getItem('userToken'); 
            if (token) { 
                try {
                    // FIX 2: Call the new backend endpoint to verify token and fetch user details
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                    if (response.data.role?.permissions) {
                        setPermissions(response.data.role.permissions);
                    } else {
                        setPermissions([]);
                    }
                } catch (error) {
                    console.error("Profile fetch failed:", error);
                    logout(); // Log out invalid session
                }
            } 
            // FIX 3: Set isLoading to false only after all async checks are complete
            setIsLoading(false); 
        };
        checkLoginStatus();
    }, []);
    
    return (<AuthContext.Provider
         value={{ 
            user, 
            permissions, 
            isLoading, 
            login, 
            logout 
        }}>{children}</AuthContext.Provider>);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) { throw new Error('useAuth must be used within an AuthProvider'); } return context;
};
