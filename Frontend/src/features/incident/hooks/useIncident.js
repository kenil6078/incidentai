import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchIncidents,
  fetchIncidentDetail,
  createIncident as createIncidentThunk,
  updateIncident as updateIncidentThunk,
  deleteIncident as deleteIncidentThunk,
  selectIncidents,
  selectCurrentIncident,
  selectIncidentLoading,
  clearCurrentIncident,
} from '../incident.slice';

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

  const updateIncident = useCallback(async (id, payload) => {
    return dispatch(updateIncidentThunk({ id, payload }));
  }, [dispatch]);

  const deleteIncident = useCallback(async (id) => {
    return dispatch(deleteIncidentThunk(id));
  }, [dispatch]);

  return {
    list,
    current,
    loading,
    getIncidents,
    getIncident,
    createIncident,
    updateIncident,
    deleteIncident,
    clearCurrent: useCallback(() => dispatch(clearCurrentIncident()), [dispatch]),
  };
};
