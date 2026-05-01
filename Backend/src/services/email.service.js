/**
 * ============================================================
 * FILE: src/services/mail.service.js
 * ROLE: Email delivery via Gmail API (Google OAuth2).
 *
 * WHAT IT DOES:
 *  - Uses googleapis OAuth2 + a permanent refresh_token to get
 *    access tokens without user interaction (same pattern as
 *    Perplexity project — proven & battle-tested)
 *  - sendEmail({ to, subject, html }) is the public interface
 *  - Used for: email verification, incident escalation notices
 *
 * SETUP:
 *  1. Google Cloud Console → Credentials → OAuth 2.0 Client ID
 *  2. Use OAuth Playground to generate refresh_token
 *  3. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN,
 *     GOOGLE_USER in .env
 * ============================================================
 */

import { google } from 'googleapis';
import { config } from '../config/config.js';

const OAuth2 = google.auth.OAuth2;

// --- Create Gmail API client with OAuth2 credentials ---
function createGmailClient() {
    const oauth2Client = new OAuth2(
        (config.GOOGLE_CLIENT_ID || '').trim(),
        (config.GOOGLE_CLIENT_SECRET || '').trim(),
        'https://developers.google.com/oauthplayground'
    );

    // Use refresh token to get new access tokens automatically
    oauth2Client.setCredentials({
        refresh_token: (config.GOOGLE_REFRESH_TOKEN || '').trim(),
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
}

// --- Build Base64url-encoded email body (required by Gmail API) ---
function makeBody(to, from, subject, message) {
    const str = [
        `To: ${to}`,
        `From: SIRP Platform <${from}>`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        '',
        message,
    ].join('\n');

    return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Send an HTML email via Gmail API.
 * @param {Object} opts
 * @param {string} opts.to       - Recipient email
 * @param {string} opts.subject  - Email subject
 * @param {string} opts.html     - HTML body content
 */
export async function sendEmail({ to, subject, html }) {
    try {
        console.log(`📧 Sending email to: ${to}`);
        const gmail = createGmailClient();
        const rawMessage = makeBody(to, config.GOOGLE_USER, subject, html);

        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw: rawMessage },
        });

        console.log(`✅ Email sent! ID: ${res.data.id}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return { success: false, error: error.message };
    }
}
