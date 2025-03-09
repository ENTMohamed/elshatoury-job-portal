export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const storeFile = async (key: string, file: File) => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      data: Array.from(new Uint8Array(arrayBuffer))
    };
    sessionStorage.setItem(key, JSON.stringify(fileData));
    return true;
  } catch (error) {
    console.error('Error storing file:', error);
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