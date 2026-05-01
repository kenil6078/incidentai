/**
 * useAI.js
 * Custom hook — wraps AI Redux state and thunks.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAISummary,
  fetchRootCause,
  fetchPostmortem,
  selectAISummary,
  selectRootCause,
  selectPostmortem,
  selectAILoadingKey,
  selectAIError,
} from '../redux/aiSlice';

export const useAI = (incidentId) => {
  const dispatch = useDispatch();
  const summary = useSelector(selectAISummary(incidentId));
  const rootCause = useSelector(selectRootCause(incidentId));
  const postmortem = useSelector(selectPostmortem(incidentId));
  const loadingKey = useSelector(selectAILoadingKey);
  const error = useSelector(selectAIError);

  const getSummary = useCallback(
    () => dispatch(fetchAISummary(incidentId)),
    [dispatch, incidentId]
  );
  const getRootCause = useCallback(
    () => dispatch(fetchRootCause(incidentId)),
    [dispatch, incidentId]
  );
  const getPostmortem = useCallback(
    () => dispatch(fetchPostmortem(incidentId)),
    [dispatch, incidentId]
  );

  return {
    summary,
    rootCause,
    postmortem,
    loadingKey,
    error,
    isSummaryLoading: loadingKey === 'summary',
    isRootCauseLoading: loadingKey === 'rootCause',
    isPostmortemLoading: loadingKey === 'postmortem',
    getSummary,
    getRootCause,
    getPostmortem,
  };
};
