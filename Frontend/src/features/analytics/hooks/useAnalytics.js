/**
 * useAnalytics.js
 * Custom hook — wraps analytics Redux state and thunks.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOverview,
  fetchSummary,
  selectOverview,
  selectSummary,
  selectAnalyticsLoading,
} from '../redux/analyticsSlice';

export const useAnalytics = () => {
  const dispatch = useDispatch();
  const overview = useSelector(selectOverview);
  const summary = useSelector(selectSummary);
  const loading = useSelector(selectAnalyticsLoading);

  const getOverview = useCallback(() => dispatch(fetchOverview()), [dispatch]);
  const getSummary = useCallback(() => dispatch(fetchSummary()), [dispatch]);

  return { overview, summary, loading, getOverview, getSummary };
};
