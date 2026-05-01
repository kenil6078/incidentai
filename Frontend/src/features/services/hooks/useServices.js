import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  selectServices,
  selectServicesLoading,
} from '../services.slice';
import { servicesApi } from '../service/services.api';

export const useServices = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectServices);
  const loading = useSelector(selectServicesLoading);

  const getServices = () => dispatch(fetchServices());

  const createService = async (payload) => {
    const data = await servicesApi.createService(payload);
    getServices(); // Refresh
    return data;
  };

  const updateService = async (id, payload) => {
    const data = await servicesApi.updateService(id, payload);
    getServices(); // Refresh
    return data;
  };

  const deleteService = async (id) => {
    const data = await servicesApi.deleteService(id);
    getServices(); // Refresh
    return data;
  };

  return {
    list,
    loading,
    getServices,
    createService,
    updateService,
    deleteService,
  };
};
