import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

/**
 * Sign a payload with an HMAC-SHA256 signature using 'jose'.
 * Automatically adds an expiration time (default: 24h).
 */
export async function signJWT(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const secretKey = encoder.encode(secret);
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

/**
 * Verify an HMAC-SHA256 JWT signature using 'jose'.
 * Returns the decoded payload if valid, otherwise null.
 */
export async function verifyJWT(
  token: string,
  secret: string
): Promise<Record<string, unknown> | null> {
  try {
    const secretKey = encoder.encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as Record<string, unknown>;
  } catch (err) {
    // Return null on invalid signature, expiration, or malformed tokens
    return null;
  }
}
