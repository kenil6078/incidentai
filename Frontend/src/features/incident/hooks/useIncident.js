import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchIncidents, 
  createIncident as createIncidentThunk, 
  updateIncident as updateIncidentThunk,
  deleteIncident as deleteIncidentThunk,
  selectIncidents,
  selectIncidentLoading
} from '../redux/incidentSlice';

export const useIncident = () => {
  const dispatch = useDispatch();
  const incidents = useSelector(selectIncidents);
  const loading = useSelector(selectIncidentLoading);

  const getIncidents = useCallback(() => {
    return dispatch(fetchIncidents());
  }, [dispatch]);

  const createIncident = useCallback((data) => {
    return dispatch(createIncidentThunk(data));
  }, [dispatch]);

  const updateIncident = useCallback((id, data) => {
    return dispatch(updateIncidentThunk({ id, data }));
  }, [dispatch]);

  const deleteIncident = useCallback((id) => {
    return dispatch(deleteIncidentThunk(id));
  }, [dispatch]);

  return {
    incidents,
    loading,
    getIncidents,
    createIncident,
    updateIncident,
    deleteIncident
  };
};
