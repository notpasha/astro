import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/api/v1/auth/me');
        
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await api.post('/api/v1/auth/login', formData);
      
      localStorage.setItem('token', response.data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      // Get user data
      const userResponse = await api.get('/api/v1/auth/me');
      
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      return userResponse.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Failed to login. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/v1/auth/register', userData);
      return response.data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Social login
  const socialLogin = async (provider, accessToken) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/v1/auth/social-login', {
        provider,
        access_token: accessToken
      });
      
      localStorage.setItem('token', response.data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      // Get user data
      const userResponse = await api.get('/api/v1/auth/me');
      
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      return userResponse.data;
    } catch (err) {
      console.error('Social login error:', err);
      setError(err.response?.data?.detail || 'Failed to login. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        socialLogin,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};