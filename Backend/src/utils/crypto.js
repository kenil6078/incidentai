import crypto from 'crypto';
import { config } from '../config/config.js';

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(config.ENCRYPTION_KEY || 'd7a9f8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9', 'hex');
const IV_LENGTH = 16;

/**
 * Encrypts plaintext using AES-256-CBC.
 * Returns format: `iv_hex:ciphertext_hex`
 */
export const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error('Encryption failed, storing as plaintext:', error.message);
    return text;
  }
};

/**
 * Decrypts ciphertext produced by `encrypt`.
 * Gracefully returns original text if decryption fails (e.g. plaintext input).
 */
export const decrypt = (text) => {
  if (!text) return text;
  // Encrypted format is always `hex_iv:hex_cipher` — both parts are valid hex
  if (!text.includes(':')) return text;
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    // Decryption failed — probably a plaintext message that has a colon
    return text;
  }
};
