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

  const getIncidents = (params) => dispatch(fetchIncidents(params));
  const getIncident = (id) => dispatch(fetchIncidentDetail(id));

  const createIncident = async (payload) => {
    return dispatch(createIncidentThunk(payload));
  };

  return {
    list,
    current,
    loading,
    getIncidents,
    getIncident,
    createIncident,
    clearCurrent: () => dispatch(clearCurrentIncident()),
  };
};
