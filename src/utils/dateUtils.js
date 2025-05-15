// utils/dateUtils.js
export const dateUtils = {
  getCurrentUTCISODate: () => {
    return new Date().toISOString();
  },
  
  compareFormats: () => {
    const date = new Date();
    console.log("String format:", String(date)); // Thu May 15 12:34:03 CEST 2025
    console.log("ISO format:", date.toISOString()); // 2025-05-15T10:34:03.456Z
    return date.toISOString();
  }
};