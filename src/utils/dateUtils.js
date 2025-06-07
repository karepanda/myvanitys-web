
export const dateUtils = {
  getCurrentUTCISODate: () => {
    return new Date().toISOString();
  },
  
  compareFormats: () => {
    const date = new Date();
    console.log("String format:", String(date)); 
    console.log("ISO format:", date.toISOString()); 
    return date.toISOString();
  }
};