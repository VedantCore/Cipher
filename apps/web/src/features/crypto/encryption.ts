import libsodium from 'libsodium-wrappers';

export const encryptMessage = async (plaintext: string, recipientPublicKey: string, senderPrivateKey: string) => {
  await libsodium.ready;
  
  // 1. Convert keys from Base64 back to Uint8Array for processing
  const pubKey = libsodium.from_base64(recipientPublicKey);
  const privKey = libsodium.from_base64(senderPrivateKey);
  
  // 2. Generate a unique nonce for this specific message
  const nonce = libsodium.randombytes_buf(libsodium.crypto_box_NONCEBYTES);
  
  // 3. Encrypt using XSalsa20-Poly1305 (as per your spec)
  const ciphertext = libsodium.crypto_box_easy(
    plaintext,
    nonce,
    pubKey,
    privKey
  );

  return {
    ciphertext: libsodium.to_base64(ciphertext),
    nonce: libsodium.to_base64(nonce)
  };
};