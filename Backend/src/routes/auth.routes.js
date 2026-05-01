import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';
import { auth  } from '../middleware/auth.middleware.js';

import passport from 'passport';

router.post('/register', authController.register);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getMe);
router.post('/finalize-profile', auth, authController.finalizeProfile);
router.get('/organizations', authController.getOrganizations);

// Google Auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "http://localhost:5173/login?error=auth_failed",
    }),
    authController.googleCallback
);

export default router;
