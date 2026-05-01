/**
 * useIncident.js
 * Custom hook — wraps incident Redux state and thunks.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchIncidents,
  fetchIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  selectIncidents,
  selectCurrentIncident,
  selectIncidentLoading,
} from '../redux/incidentSlice';

export const useIncident = () => {
  const dispatch = useDispatch();
  const incidents = useSelector(selectIncidents);
  const currentIncident = useSelector(selectCurrentIncident);
  const loading = useSelector(selectIncidentLoading);

  const getIncidents = useCallback(
    (params) => dispatch(fetchIncidents(params)),
    [dispatch]
  );
  const getById = useCallback(
    (id) => dispatch(fetchIncidentById(id)),
    [dispatch]
  );
  const create = useCallback(
    (data) => dispatch(createIncident(data)),
    [dispatch]
  );
  const update = useCallback(
    (id, data) => dispatch(updateIncident({ id, data })),
    [dispatch]
  );
  const remove = useCallback(
    (id) => dispatch(deleteIncident(id)),
    [dispatch]
  );

  return {
    incidents,
    currentIncident,
    loading,
    getIncidents,
    getById,
    create,
    update,
    remove,
  };
};
