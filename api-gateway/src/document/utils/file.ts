/**
 * Converts file size in bytes to a human-readable format (Bytes, KB, MB, GB).
 * @param bytes - File size in bytes.
 * @returns A formatted string representing the file size.
 */
export function convertBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  if (bytes === 0) {
    return 'File size is 0 Bytes.';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
