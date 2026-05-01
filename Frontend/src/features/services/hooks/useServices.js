/**
 * useServices.js
 * Custom hook — wraps services/monitors Redux state and thunks.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  createService,
  selectServices,
  selectServicesLoading,
  selectCreateLoading,
} from '../redux/servicesSlice';

export const useServices = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const loading = useSelector(selectServicesLoading);
  const createLoading = useSelector(selectCreateLoading);

  const getServices = useCallback(() => dispatch(fetchServices()), [dispatch]);
  const addService = useCallback((payload) => dispatch(createService(payload)), [dispatch]);

  return { services, loading, createLoading, getServices, addService };
};
