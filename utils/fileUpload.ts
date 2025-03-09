export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const storeFile = async (key: string, file: File): Promise<boolean> => {
  try {
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onload = () => {
        try {
          const base64String = reader.result as string;
          sessionStorage.setItem(key, base64String);
          resolve(true);
        } catch (error) {
          console.error('Error storing file:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        resolve(false);
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error in storeFile:', error);
    return false;
  }
};

export const retrieveFile = (key: string): File | null => {
  try {
    const fileData = JSON.parse(sessionStorage.getItem(key) || '');
    if (!fileData) return null;

    const uint8Array = new Uint8Array(fileData.data);
    const blob = new Blob([uint8Array], { type: fileData.type });
    return new File([blob], fileData.name, {
      type: fileData.type,
      lastModified: fileData.lastModified
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    return null;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 