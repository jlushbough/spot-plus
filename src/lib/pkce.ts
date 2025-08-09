import crypto from 'crypto';

/**
 * Generate a random string for the PKCE code verifier.
 */
export function generateCodeVerifier(length = 128): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * possible.length);
    text += possible[randomIndex];
  }
  return text;
}

/**
 * Generate a base64url-encoded SHA256 hash of the verifier for PKCE.
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return hash
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}