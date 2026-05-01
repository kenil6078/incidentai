import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, selectAuthLoading, setCredentials, logout as logoutAction, setLoading } from '../auth.slice';
import { authApi } from '../service/auth.api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authApi.getMe();
        dispatch(setCredentials({ user: userData }));
      } catch (err) {
        dispatch(logoutAction());
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (!user) {
        initAuth();
    } else {
        dispatch(setLoading(false));
    }
  }, [dispatch, user]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    dispatch(setCredentials(data));
    return data.user;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    dispatch(setCredentials(data));
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch(e) {}
    dispatch(logoutAction());
    window.location.href = "/login";
  };

  return { user, isAuthenticated, loading, login, register, logout };
};
