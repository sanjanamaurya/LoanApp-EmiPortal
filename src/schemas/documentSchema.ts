import { z } from 'zod';
import { DOCUMENT_CONFIG } from '../constants';

export const documentSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().max(
    DOCUMENT_CONFIG.MAX_FILE_SIZE,
    `File size exceeds ${DOCUMENT_CONFIG.MAX_FILE_SIZE_MB} MB limit`
  ),
  type: z.string().refine(
    (type) => (DOCUMENT_CONFIG.ALLOWED_MIME_TYPES as readonly string[]).includes(type),
    'File type must be PDF, JPG, or PNG'
  ),
  previewUrl: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;
