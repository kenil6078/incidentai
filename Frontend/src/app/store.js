import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import adminReducer from '../features/admin/admin.slice';
import incidentReducer from '../features/incident/incident.slice';
import teamReducer from '../features/team/team.slice';
import servicesReducer from '../features/services/services.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    incident: incidentReducer,
    team: teamReducer,
    services: servicesReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
