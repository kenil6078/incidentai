import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  createService as createServiceThunk,
  selectServices,
  selectServicesLoading,
} from '../services.slice';

export const useServices = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectServices);
  const loading = useSelector(selectServicesLoading);

  const getServices = useCallback(() => dispatch(fetchServices()), [dispatch]);

  const createService = useCallback((payload) => dispatch(createServiceThunk(payload)), [dispatch]);

  return {
    list,
    loading,
    getServices,
    createService,
  };
};
