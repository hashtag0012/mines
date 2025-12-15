import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check current auth status
    apiRequest("GET", "/api/auth/me")
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For now, we only support Google OAuth
      toast({
        title: "Login Method",
        description: "Please use Google Sign-In to login.",
      });
      return false;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For now, we only support Google OAuth
      toast({
        title: "Signup Method",
        description: "Please use Google Sign-In to create an account.",
      });
      return false;
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An error occurred during signup.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
      setLocation("/");
      toast({ title: "Logged Out", description: "Session terminated." });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loginWithGoogle,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
