import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrganizations, 
  fetchAllUsers, 
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

  return {
    organizations,
    users,
    loading,
    error,
    getOrganizations,
    getUsers,
  };
};
