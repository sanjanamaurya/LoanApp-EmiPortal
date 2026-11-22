import { describe, it, expect } from 'vitest';
import { validateFile } from '../utils/validators';

describe('Document Upload Validation (Type & Max 2 MB)', () => {
  const TWO_MB_BYTES = 2 * 1024 * 1024;

  it('accepts file of exactly 2 MB size with allowed extension and MIME type', () => {
    const file = {
      name: 'kyc_proof.pdf',
      size: TWO_MB_BYTES,
      type: 'application/pdf',
    };
    const result = validateFile(file);
    expect(result.valid).toBe(true);
  });

  it('rejects file that exceeds 2 MB by 1 byte', () => {
    const file = {
      name: 'salary_slip.pdf',
      size: TWO_MB_BYTES + 1,
      type: 'application/pdf',
    };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('File too large');
  });

  it('accepts valid image file types: .jpg, .jpeg, .png', () => {
    expect(
      validateFile({ name: 'pan.jpg', size: 500000, type: 'image/jpeg' }).valid
    ).toBe(true);
    expect(
      validateFile({ name: 'pan.png', size: 500000, type: 'image/png' }).valid
    ).toBe(true);
  });

  it('rejects unsupported file formats', () => {
    expect(
      validateFile({ name: 'archive.zip', size: 500000, type: 'application/zip' }).valid
    ).toBe(false);
    expect(
      validateFile({ name: 'script.exe', size: 1000, type: 'application/x-msdownload' }).valid
    ).toBe(false);
    expect(
      validateFile({ name: 'document.docx', size: 10000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }).valid
    ).toBe(false);
  });
});
