import { create } from 'zustand';
import { encryptMessage } from '../../crypto/encryption';
import socket from '../socket';
import type { Message } from '../types';

interface MessageState {
  messages: Message[];
  addMessage: (msg: Message) => void;
  sendMessage: (text: string, recipientId: string, recipientPublicKey: string) => Promise<void>;
}

export const useMessages = create<MessageState>((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  sendMessage: async (text, recipientId, recipientPublicKey) => {
    // 1. Retrieve the local Private Key saved during registration
    const privateKey = localStorage.getItem('cipher_priv_key');
    
    if (!privateKey) {
      throw new Error("Private key not found locally. Please re-register to generate keys.");
    }

    // 2. Perform Zero-Knowledge Encryption locally
    const { ciphertext, nonce } = await encryptMessage(text, recipientPublicKey, privateKey);

    // 3. Emit ONLY unreadable ciphertext to the backend
    socket.emit('send_private_message', {
      recipientId,
      ciphertext,
      nonce,
      timestamp: Date.now()
    });
  }
}));

// Auto-connect the tunnel
socket.connect();