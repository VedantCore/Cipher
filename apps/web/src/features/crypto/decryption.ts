import libsodium from 'libsodium-wrappers';

export const decryptMessage = async (ciphertext: string, nonce: string, senderPublicKey: string, recipientPrivateKey: string) => {
  await libsodium.ready;

  const cipher = libsodium.from_base64(ciphertext);
  const n = libsodium.from_base64(nonce);
  const pubKey = libsodium.from_base64(senderPublicKey);
  const privKey = libsodium.from_base64(recipientPrivateKey);

  const decrypted = libsodium.crypto_box_open_easy(
    cipher,
    n,
    pubKey,
    privKey
  );

  return libsodium.to_string(decrypted);
};