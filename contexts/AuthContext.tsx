"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('idforge_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          localStorage.removeItem('idforge_user');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if this is the admin email
        const isAdmin = email.toLowerCase() === 'mattycarmstrong@gmail.com';
        
        // Mock successful login
        const user: User = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email,
          firstName: isAdmin ? 'Matty' : 'John',
          lastName: isAdmin ? 'Armstrong' : 'Doe',
          isAdmin,
        };
        
        localStorage.setItem('idforge_user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        resolve(true);
      }, 1500);
    });
  };

  const signup = async (userData: any): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if this is the admin email
        const isAdmin = userData.email.toLowerCase() === 'mattycarmstrong@gmail.com';
        
        // Mock successful signup
        const user: User = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isAdmin,
        };
        
        localStorage.setItem('idforge_user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        resolve(true);
      }, 2000);
    });
  };

  const logout = () => {
    localStorage.removeItem('idforge_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};