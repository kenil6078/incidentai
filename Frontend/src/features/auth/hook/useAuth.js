import { useDispatch, useSelector } from "react-redux";
import { register, login, getMe, logout, resendVerificationEmail } from "../service/auth.api";
import { setUser, setLoading, setError, clearError, selectAuth } from "../auth.slice";
import { useCallback } from "react";

export function useAuth() {
    const dispatch = useDispatch();
    const { user, loading, error, isInitialized } = useSelector(selectAuth);

    const handleRegister = useCallback(async (userData) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await register(userData);
            // On register, we don't necessarily set the user immediately 
            // if we require email verification, but we can set it if the backend returns it.
            if (response.user) {
                dispatch(setUser(response.user));
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.detail || error.response?.data?.message || "Registration failed";
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogin = useCallback(async ({ email, password }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await login({ email, password });
            dispatch(setUser(response.user));
            return response;
        } catch (error) {
            const message = error.response?.data?.detail || error.response?.data?.message || "Login failed";
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetMe = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const response = await getMe();
            dispatch(setUser(response.user || response));
        } catch (error) {
            if (error.response?.status !== 401) {
                const message = error.response?.data?.detail || error.response?.data?.message || "Failed to fetch user";
                dispatch(setError(message));
            }
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            await logout();
            dispatch(setUser(null));
        } catch (error) {
            dispatch(setError("Logout failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleResendEmail = useCallback(async ({ email }) => {
        try {
            dispatch(setLoading(true));
            return await resendVerificationEmail({ email });
        } catch (error) {
            const message = error.response?.data?.detail || error.response?.data?.message || "Failed to resend verification";
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return {
        user,
        loading,
        error,
        isInitialized,
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
        handleResendEmail,
        setUser: (userData) => dispatch(setUser(userData)),
        clearError: () => dispatch(clearError())
    };
}
