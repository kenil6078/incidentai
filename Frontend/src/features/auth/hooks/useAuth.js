/**
 * useAuth.js
 * Custom hook — wraps auth Redux state and thunks.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login as loginThunk,
  register as registerThunk,
  getMe as getMeThunk,
  logout as logoutAction,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
} from '../redux/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  const login = useCallback(
    (credentials) => dispatch(loginThunk(credentials)),
    [dispatch]
  );
  const register = useCallback(
    (userData) => dispatch(registerThunk(userData)),
    [dispatch]
  );
  const refreshUser = useCallback(() => dispatch(getMeThunk()), [dispatch]);
  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);
  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    ...auth,
    user,
    isAuthenticated,
    loading,
    login,
    register,
    refreshUser,
    logout,
    resetError,
  };
};
