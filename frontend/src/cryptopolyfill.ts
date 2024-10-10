// src/crypto-polyfill.ts

// Check if window.crypto and getRandomValues are not available
if (!window.crypto || !window.crypto.getRandomValues) {
    // Create a polyfill for the Crypto interface
    window.crypto = {
      getRandomValues: (arr: Uint8Array): Uint8Array => {
        for (let i = 0; i < arr.length; i++) {
          // Fill the array with random values between 0 and 255
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
    } as Crypto; // Type assertion to ensure it conforms to the Crypto interface
  
    console.warn("Crypto polyfill loaded: using Math.random() for random values.");
  } else {
    console.log("Crypto is supported.");
  }
  