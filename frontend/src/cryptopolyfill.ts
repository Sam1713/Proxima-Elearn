// src/crypto-polyfill.ts
if (!window.crypto || !window.crypto.getRandomValues) {
    window.crypto = {
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
    } as Crypto; // Type assertion to ensure it conforms to the Crypto interface
  }
  