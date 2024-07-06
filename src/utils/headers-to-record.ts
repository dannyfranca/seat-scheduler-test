export const headersToRecord = (headers?: HeadersInit | null): Record<string, string> => {
  const headerRecord: Record<string, string> = {};

  if (!headers) return headerRecord;
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      headerRecord[key.toLowerCase()] = value;
    });
  } else if (Array.isArray(headers)) {
    for (const header of headers) {
      headerRecord[header[0].toLowerCase()] = header[1];
    }
  } else if (typeof headers === 'object') {
    for (const [key, value] of Object.entries(headers)) {
      headerRecord[key.toLowerCase()] = value;
    }
  }

  return headerRecord;
};
