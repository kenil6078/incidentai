import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeam,
  inviteMember as inviteMemberThunk,
  updateMemberRole as updateMemberRoleThunk,
  removeMember as removeMemberThunk,
  selectTeamMembers,
  selectTeamLoading,
} from '../team.slice';

export const useTeam = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectTeamMembers);
  const loading = useSelector(selectTeamLoading);

  const getTeam = useCallback(() => dispatch(fetchTeam()), [dispatch]);

  const inviteMember = useCallback((payload) => dispatch(inviteMemberThunk(payload)), [dispatch]);

  const updateRole = useCallback((id, role) => dispatch(updateMemberRoleThunk({ id, role })), [dispatch]);

  const removeMember = useCallback((id) => dispatch(removeMemberThunk(id)), [dispatch]);

  return {
    members,
    loading,
    getTeam,
    inviteMember,
    updateRole,
    removeMember,
  };
};
