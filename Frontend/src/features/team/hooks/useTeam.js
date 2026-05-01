import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeam,
  inviteMember as inviteMemberThunk,
  updateMemberRole as updateMemberRoleThunk,
  removeMember as removeMemberThunk,
  selectTeamMembers,
  selectTeamLoading,
} from '../redux/teamSlice';

export const useTeam = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectTeamMembers);
  const loading = useSelector(selectTeamLoading);

  const getTeam = () => dispatch(fetchTeam());

  const inviteMember = (payload) => dispatch(inviteMemberThunk(payload));

  const updateRole = (id, role) => dispatch(updateMemberRoleThunk({ id, role }));

  const removeMember = (id) => dispatch(removeMemberThunk(id));

  return {
    members,
    loading,
    getTeam,
    inviteMember,
    updateRole,
    removeMember,
  };
};
