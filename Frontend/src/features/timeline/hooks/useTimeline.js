import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTimeline,
  addTimelineEntry,
  selectTimelineByIncident,
  selectTimelineLoading,
} from '../redux/timelineSlice';

export const useTimeline = (incidentId) => {
  const dispatch = useDispatch();
  const entries = useSelector(selectTimelineByIncident(incidentId));
  const loading = useSelector(selectTimelineLoading);

  const getTimeline = useCallback(() => {
    if (incidentId) dispatch(fetchTimeline(incidentId));
  }, [dispatch, incidentId]);

  const addEntry = useCallback((payload) => {
    return dispatch(addTimelineEntry({ incidentId, payload }));
  }, [dispatch, incidentId]);

  return {
    entries,
    loading,
    getTimeline,
    addEntry,
  };
};
