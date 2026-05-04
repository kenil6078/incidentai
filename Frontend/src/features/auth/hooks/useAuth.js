import { useDispatch, useSelector } from "react-redux";
import { register, login, getMe, logout, resendVerificationEmail } from "../services/auth.api";
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
            // Crucial fix: Only set user if it exists in response.user
            // If response itself is returned (legacy), check for identifying fields
            const userData = response.user || (response._id ? response : null);
            dispatch(setUser(userData));
        } catch (error) {
            // If we get a 401, it's a clean "not logged in" state
            // Any other error (like server cold start timeout) should also result in null user
            dispatch(setUser(null));
            if (error.response?.status && error.response.status !== 401) {
                console.error("Server synchronization error:", error.message);
            }
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            await logout();
        } catch (error) {
            console.error("Logout API failed:", error);
            dispatch(setError("Logout failed on server, but clearing local session."));
        } finally {
            dispatch(setUser(null));
            dispatch(setLoading(false));
            // Force reload or redirect to login to ensure state is clean
            window.location.href = "/login";
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
