import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        dispatch({ type: 'LOGIN', payload: JSON.parse(userData) });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (loginResponse) => {
    try {
      console.log('UserContext login - Full response:', loginResponse);
      console.log('UserContext login - response.data:', loginResponse.data);
      console.log('UserContext login - response.data.data:', loginResponse.data.data);
      
      const { token, user } = loginResponse.data;
      console.log('UserContext login - Extracted token:', token);
      console.log('UserContext login - Extracted user:', user);
      
      if (!token || !user) {
        console.error('UserContext login - Missing token or user data');
        return false;
      }
      
      const userWithToken = { ...user, token };
      console.log('UserContext login - User with token:', userWithToken);
      
      await AsyncStorage.setItem('user', JSON.stringify(userWithToken));
      await AsyncStorage.setItem('token', token);
      dispatch({ type: 'LOGIN', payload: userWithToken });
      console.log('UserContext login - Successfully saved and dispatched');
      return true;
    } catch (error) {
      console.error('UserContext login error:', error);
      console.error('UserContext login error details:', {
        message: error.message,
        stack: error.stack
      });
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <UserContext.Provider value={{ ...state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};