import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string(),
  recipientId: z.string(),
  ciphertext: z.string(), // Encrypted content
  nonce: z.string(),      // Cryptographic number used once
  timestamp: z.number()
});

export type Message = z.infer<typeof MessageSchema>;