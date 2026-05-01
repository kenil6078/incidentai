import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchIncidents,
  fetchIncidentDetail,
  createIncident as createIncidentThunk,
  selectIncidents,
  selectCurrentIncident,
  selectIncidentLoading,
  clearCurrentIncident,
} from '../redux/incidentSlice';

export const useIncident = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectIncidents);
  const current = useSelector(selectCurrentIncident);
  const loading = useSelector(selectIncidentLoading);

  const getIncidents = useCallback((params) => dispatch(fetchIncidents(params)), [dispatch]);
  const getIncident = useCallback((id) => dispatch(fetchIncidentDetail(id)), [dispatch]);

  const createIncident = useCallback(async (payload) => {
    return dispatch(createIncidentThunk(payload));
  }, [dispatch]);

  return {
    list,
    current,
    loading,
    getIncidents,
    getIncident,
    createIncident,
    clearCurrent: useCallback(() => dispatch(clearCurrentIncident()), [dispatch]),
  };
};
