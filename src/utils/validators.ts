import { DOCUMENT_CONFIG } from '../constants';

export const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]{2,59}$/;
export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidName(name: string): boolean {
  if (!name) return false;
  return NAME_REGEX.test(name.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return INDIAN_PHONE_REGEX.test(digits);
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

export function validateFile(file: { size: number; type: string; name: string }): {
  valid: boolean;
  error?: string;
} {
  if (!file) {
    return { valid: false, error: 'Please select a document to upload.' };
  }

  // Extension check
  const ext = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
  const hasValidExt = (DOCUMENT_CONFIG.ALLOWED_EXTENSIONS as readonly string[]).includes(ext);

  // Mime type check
  const hasValidMime = (DOCUMENT_CONFIG.ALLOWED_MIME_TYPES as readonly string[]).includes(file.type);

  if (!hasValidExt && !hasValidMime) {
    return {
      valid: false,
      error: 'Only PDF, JPG, or PNG files are allowed.',
    };
  }

  if (file.size > DOCUMENT_CONFIG.MAX_FILE_SIZE) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large (${sizeInMb} MB). Max allowed is ${DOCUMENT_CONFIG.MAX_FILE_SIZE_MB} MB.`,
    };
  }

  return { valid: true };
}
