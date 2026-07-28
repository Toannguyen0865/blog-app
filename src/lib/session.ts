import { createHmac, timingSafeEqual } from 'crypto';

const getSecret = () =>
  process.env.SESSION_SECRET || 'devvibe-default-secret-change-in-production';

/**
 * Ký (sign) session data thành chuỗi chống giả mạo.
 * Format: base64(JSON).hmac_signature
 */
export function signSession(data: object): string {
  const payload = JSON.stringify(data);
  const signature = createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

/**
 * Xác thực và giải mã session đã ký.
 * Trả về null nếu chữ ký không hợp lệ hoặc dữ liệu bị giả mạo.
 */
export function verifySession<T = any>(signedValue: string): T | null {
  try {
    const dotIndex = signedValue.lastIndexOf('.');
    if (dotIndex === -1) return null;

    const encodedPayload = signedValue.substring(0, dotIndex);
    const signature = signedValue.substring(dotIndex + 1);
    if (!encodedPayload || !signature) return null;

    const payload = Buffer.from(encodedPayload, 'base64').toString('utf-8');
    const expectedSignature = createHmac('sha256', getSecret())
      .update(payload)
      .digest('hex');

    // Sử dụng timingSafeEqual để chống timing attack
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    return JSON.parse(payload) as T;
  } catch {
    return null;
  }
}
