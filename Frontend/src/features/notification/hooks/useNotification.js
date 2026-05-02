/**
 * useNotification.js
 * Custom hook — wraps notification Redux state and thunks.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markAllRead,
  selectNotifications,
  selectUnreadCount,
  selectNotificationLoading,
} from '../notification.slice';

export const useNotification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(selectNotificationLoading);

  const getNotifications = useCallback(() => dispatch(fetchNotifications()), [dispatch]);
  const readAll = useCallback(() => dispatch(markAllRead()), [dispatch]);

  return { notifications, unreadCount, loading, getNotifications, readAll };
};
