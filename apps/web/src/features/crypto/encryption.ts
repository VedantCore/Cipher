import _sodium from 'libsodium-wrappers';

// 1. Ensure the library is initialized before doing anything
export const initSodium = async () => {
  await _sodium.ready;
  return _sodium;
};

// 2. Generate a secure Public/Private keypair (Used during Registration)
export const generateKeyPair = async () => {
  await _sodium.ready;
  const keypair = _sodium.crypto_box_keypair();
  
  // Convert the raw buffers to Base64 strings so they can be saved in LocalStorage/Supabase
  return {
    publicKey: _sodium.to_base64(keypair.publicKey, _sodium.base64_variants.ORIGINAL),
    privateKey: _sodium.to_base64(keypair.privateKey, _sodium.base64_variants.ORIGINAL),
  };
};

// 3. Encrypt an outgoing message
export const encryptMessage = async (
  message: string, 
  recipientPublicKeyBase64: string, 
  senderPrivateKeyBase64: string
) => {
  await _sodium.ready;

  // The Bouncer: Catch missing inputs before Libsodium crashes
  if (!message || !recipientPublicKeyBase64 || !senderPrivateKeyBase64) {
    console.error("Encryption Failed. Missing Inputs:", {
      message: !!message,
      recipientKey: !!recipientPublicKeyBase64,
      senderKey: !!senderPrivateKeyBase64
    });
    throw new Error("Cannot encrypt: Missing message, recipient public key, or your private key.");
  }

  try {
    // Translate strings back into the Uint8Arrays that Libsodium requires
    const recipientPublicKey = _sodium.from_base64(recipientPublicKeyBase64, _sodium.base64_variants.ORIGINAL);
    const senderPrivateKey = _sodium.from_base64(senderPrivateKeyBase64, _sodium.base64_variants.ORIGINAL);
    const messageUint8 = _sodium.from_string(message);

    // Generate a unique one-time use number (nonce) for this specific message
    const nonce = _sodium.randombytes_buf(_sodium.crypto_box_NONCEBYTES);

    // Lock the vault
    const encrypted = _sodium.crypto_box_easy(messageUint8, nonce, recipientPublicKey, senderPrivateKey);

    // Return the ciphertext and nonce as Base64 strings to send over the WebSocket
    return {
      ciphertext: _sodium.to_base64(encrypted, _sodium.base64_variants.ORIGINAL),
      nonce: _sodium.to_base64(nonce, _sodium.base64_variants.ORIGINAL)
    };
  } catch (error) {
    console.error("Libsodium Encryption Error:", error);
    throw error;
  }
};

// 4. Decrypt an incoming message
export const decryptMessage = async (
  ciphertextBase64: string, 
  nonceBase64: string, 
  senderPublicKeyBase64: string, 
  recipientPrivateKeyBase64: string
) => {
  await _sodium.ready;

  try {
    // Translate all Base64 strings back to Uint8Arrays
    const ciphertext = _sodium.from_base64(ciphertextBase64, _sodium.base64_variants.ORIGINAL);
    const nonce = _sodium.from_base64(nonceBase64, _sodium.base64_variants.ORIGINAL);
    const senderPublicKey = _sodium.from_base64(senderPublicKeyBase64, _sodium.base64_variants.ORIGINAL);
    const recipientPrivateKey = _sodium.from_base64(recipientPrivateKeyBase64, _sodium.base64_variants.ORIGINAL);

    // Unlock the vault
    const decrypted = _sodium.crypto_box_open_easy(ciphertext, nonce, senderPublicKey, recipientPrivateKey);
    
    // Translate the decrypted buffer back to a readable string
    return _sodium.to_string(decrypted);
  } catch (error) {
    console.error("Libsodium Decryption Error (Invalid Key or Corrupted Data):", error);
    return "[Message could not be decrypted]";
  }
};