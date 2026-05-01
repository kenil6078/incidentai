import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  login as loginThunk, 
  register as registerThunk, 
  logout as logoutAction, 
  getMe as getMeThunk,
  selectAuth 
} from '../redux/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, isInitialized } = useSelector(selectAuth);

  const login = useCallback((credentials) => {
    return dispatch(loginThunk(credentials));
  }, [dispatch]);

  const register = useCallback((userData) => {
    return dispatch(registerThunk(userData));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const refreshUser = useCallback(() => {
    return dispatch(getMeThunk());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    isInitialized,
    login,
    register,
    logout,
    refreshUser
  };
};
