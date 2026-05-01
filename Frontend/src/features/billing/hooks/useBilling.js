/**
 * useBilling.js
 * Custom hook — wraps billing Redux state and thunks.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBillingInfo,
  createOrder,
  verifyPayment,
  selectBilling,
  selectBillingLoading,
} from '../redux/billingSlice';

export const useBilling = () => {
  const dispatch = useDispatch();
  const billing = useSelector(selectBilling);
  const loading = useSelector(selectBillingLoading);

  const getBillingInfo = useCallback(() => dispatch(fetchBillingInfo()), [dispatch]);

  const initiateOrder = useCallback(
    (payload) => dispatch(createOrder(payload)),
    [dispatch]
  );

  const confirmPayment = useCallback(
    (payload) => dispatch(verifyPayment(payload)),
    [dispatch]
  );

  return {
    ...billing,
    loading,
    getBillingInfo,
    initiateOrder,
    confirmPayment,
  };
};
