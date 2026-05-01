import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import teamRoutes from './routes/team.routes.js';
import serviceRoutes from './routes/service.routes.js';
import publicRoutes from './routes/public.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import billingRoutes from './routes/billing.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/billing', billingRoutes);

export default app;
