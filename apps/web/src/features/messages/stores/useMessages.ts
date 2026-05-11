import { create } from 'zustand';
import { encryptMessage } from '../../crypto/encryption';
import socket from '../socket';
import { auth } from '../../../lib/firebase';
import { supabase } from '../../../lib/supabase';

// Define the state shape
interface MessageState {
  messages: Array<{ id: string; text: string; isOwn: boolean }>;
  sendMessage: (text: string) => Promise<void>;
  addMessage: (message: any) => void;
}

export const useMessages = create<MessageState>((set) => ({
  messages: [],

  sendMessage: async (text: string) => {
    try {
      // 1. Check Identity
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not logged in to Firebase");

      // 2. Grab your local Private Key to lock the vault
      const senderPrivateKey = localStorage.getItem('cipher_priv_key');
      if (!senderPrivateKey) {
        console.error("Private key not found in Local Storage");
        return;
      }

      // 3. The Mirror Test: Fetch your OWN Public Key from Supabase to act as the recipient
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('public_key')
        .eq('id', currentUser.uid)
        .single();

      if (error || !profile?.public_key) {
        console.error("Could not fetch Public Key from Supabase:", error);
        return;
      }

      const recipientPublicKey = profile.public_key;

      // 4. Lock the Vault!
      const { ciphertext, nonce } = await encryptMessage(text, recipientPublicKey, senderPrivateKey);

      // 5. Send the scrambled ciphertext over the WebSocket
      socket.emit('send_private_message', {
        receiverId: currentUser.uid, // Sending to ourselves
        ciphertext,
        nonce,
        senderPublicKey: recipientPublicKey // Our key (since we are the sender)
      });

      // 6. Optimistically update the UI
      set((state) => ({
        messages: [...state.messages, { id: Date.now().toString(), text, isOwn: true }]
      }));

    } catch (error) {
      console.error("Encryption/Sending crashed:", error);
    }
  },

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] }))
}));