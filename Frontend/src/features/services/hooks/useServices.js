import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  createService as createServiceThunk,
  selectServices,
  selectServicesLoading,
} from '../redux/servicesSlice';

export const useServices = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectServices);
  const loading = useSelector(selectServicesLoading);

  const getServices = () => dispatch(fetchServices());

  const createService = (payload) => dispatch(createServiceThunk(payload));

  return {
    list,
    loading,
    getServices,
    createService,
  };
};
