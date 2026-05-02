import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOverview,
  fetchIncidentTrends,
  selectOverview,
  selectIncidentTrends,
  selectAnalyticsLoading,
} from '../analytics.slice';

export const useAnalytics = () => {
  const dispatch = useDispatch();
  const overview = useSelector(selectOverview);
  const trends = useSelector(selectIncidentTrends);
  const loading = useSelector(selectAnalyticsLoading);

  const getOverview = useCallback(() => dispatch(fetchOverview()), [dispatch]);
  const getTrends = useCallback(() => dispatch(fetchIncidentTrends()), [dispatch]);

  return { overview, trends, loading, getOverview, getTrends };
};
