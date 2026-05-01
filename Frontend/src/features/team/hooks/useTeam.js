import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeam,
  selectTeamMembers,
  selectTeamLoading,
} from '../team.slice';
import { teamApi } from '../service/team.api';

export const useTeam = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectTeamMembers);
  const loading = useSelector(selectTeamLoading);

  const getTeam = () => dispatch(fetchTeam());

  const inviteMember = async (payload) => {
    const data = await teamApi.inviteMember(payload);
    getTeam(); // Refresh
    return data;
  };

  const updateRole = async (id, role) => {
    const data = await teamApi.updateRole(id, role);
    getTeam(); // Refresh
    return data;
  };

  const removeMember = async (id) => {
    const data = await teamApi.removeMember(id);
    getTeam(); // Refresh
    return data;
  };

  return {
    members,
    loading,
    getTeam,
    inviteMember,
    updateRole,
    removeMember,
  };
};
