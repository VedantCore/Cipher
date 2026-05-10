import libsodium from 'libsodium-wrappers';

export const generateIdentityKeys = async () => {
  // Wait for the WebAssembly module to load
  await libsodium.ready;
  
  // Generate an X25519 keypair for key exchange
  const keyPair = libsodium.crypto_box_keypair();
  
  return {
    publicKey: libsodium.to_base64(keyPair.publicKey),
    privateKey: libsodium.to_base64(keyPair.privateKey),
  };
};