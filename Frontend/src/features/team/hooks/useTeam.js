/**
 * useTeam.js
 * Custom hook — wraps team Redux state and thunks.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeam,
  inviteMember,
  updateMemberRole,
  removeMember,
  selectTeam,
  selectTeamLoading,
  selectTeamActionLoading,
} from '../redux/teamSlice';

export const useTeam = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectTeam);
  const loading = useSelector(selectTeamLoading);
  const actionLoading = useSelector(selectTeamActionLoading);

  const getTeam = useCallback(() => dispatch(fetchTeam()), [dispatch]);
  const invite = useCallback((payload) => dispatch(inviteMember(payload)), [dispatch]);
  const updateRole = useCallback(
    (id, role) => dispatch(updateMemberRole({ id, role })),
    [dispatch]
  );
  const remove = useCallback((id) => dispatch(removeMember(id)), [dispatch]);

  return { members, loading, actionLoading, getTeam, invite, updateRole, remove };
};
