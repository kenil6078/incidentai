import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrganizations, 
  fetchAllUsers, 
  updateUserInfo,
  toggleUserActive,
  updateOrgSubscription,
  removeUser,
  removeOrganization,
  selectAdminOrganizations, 
  selectAdminUsers, 
  selectAdminLoading, 
  selectAdminError 
} from '../admin.slice';

export const useAdmin = () => {
  const dispatch = useDispatch();
  const organizations = useSelector(selectAdminOrganizations);
  const users = useSelector(selectAdminUsers);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  const getOrganizations = () => dispatch(fetchOrganizations());
  const getUsers = () => dispatch(fetchAllUsers());
  const updateUser = (userId, userData) => dispatch(updateUserInfo({ userId, userData }));
  const toggleBan = (userId) => dispatch(toggleUserActive(userId));
  const updatePlan = (orgId, plan) => dispatch(updateOrgSubscription({ orgId, plan }));
  const deleteUserData = (userId) => dispatch(removeUser(userId));
  const deleteOrgData = (orgId) => dispatch(removeOrganization(orgId));

  return {
    organizations,
    users,
    loading,
    error,
    getOrganizations,
    getUsers,
    updateUser,
    toggleBan,
    updatePlan,
    deleteUser: deleteUserData,
    deleteOrg: deleteOrgData,
  };
};
