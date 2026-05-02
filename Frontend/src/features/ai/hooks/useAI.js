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
} from '../ai.slice';

export const useAI = (incidentId) => {
  const dispatch = useDispatch();
  
  const summary = useSelector(selectAISummary(incidentId));
  const rootCause = useSelector(selectRootCause(incidentId));
  const postmortem = useSelector(selectPostmortem(incidentId));
  const loadingKey = useSelector(selectAILoadingKey);

  const generateSummary = useCallback(() => {
    return dispatch(fetchAISummary(incidentId));
  }, [dispatch, incidentId]);

  const generateRootCause = useCallback(() => {
    return dispatch(fetchRootCause(incidentId));
  }, [dispatch, incidentId]);

  const generatePostmortem = useCallback(() => {
    return dispatch(fetchPostmortem(incidentId));
  }, [dispatch, incidentId]);

  return {
    summary,
    rootCause,
    postmortem,
    loadingKey,
    generateSummary,
    generateRootCause,
    generatePostmortem,
  };
};
