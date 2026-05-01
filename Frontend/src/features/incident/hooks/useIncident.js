import { useDispatch, useSelector } from 'react-redux';
import {
  fetchIncidents,
  fetchIncidentDetail,
  selectIncidents,
  selectCurrentIncident,
  selectIncidentLoading,
  clearCurrentIncident,
} from '../incident.slice';
import { incidentApi } from '../service/incident.api';

export const useIncident = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectIncidents);
  const current = useSelector(selectCurrentIncident);
  const loading = useSelector(selectIncidentLoading);

  const getIncidents = () => dispatch(fetchIncidents());
  const getIncident = (id) => dispatch(fetchIncidentDetail(id));

  const createIncident = async (payload) => {
    const data = await incidentApi.createIncident(payload);
    getIncidents(); // Refresh list
    return data;
  };

  const updateIncident = async (id, payload) => {
    const data = await incidentApi.updateIncident(id, payload);
    getIncident(id); // Refresh detail
    return data;
  };

  const deleteIncident = async (id) => {
    await incidentApi.deleteIncident(id);
    getIncidents(); // Refresh list
  };

  return {
    list,
    current,
    loading,
    getIncidents,
    getIncident,
    createIncident,
    updateIncident,
    deleteIncident,
    clearCurrent: () => dispatch(clearCurrentIncident()),
  };
};
