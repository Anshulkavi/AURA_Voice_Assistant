// src/utils/fileUtils.js

// Yeh function file ko base64 string me convert karta hai
export const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]); // 'data:...' wala part hata deta hai
  reader.onerror = (error) => reject(error);
});