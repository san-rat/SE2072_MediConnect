const resolveAbsoluteUrl = (url) => {
  if (!url) {
    return null;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  if (url.startsWith('//')) {
    return `${window.location.protocol}${url}`;
  }
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  return `${window.location.origin}/${url}`;
};

const getAuthHeader = () => {
  const token = localStorage.getItem('mc_token');
  if (!token) {
    return undefined;
  }
  const tokenType = localStorage.getItem('mc_token_type') || 'Bearer';
  return `${tokenType.trim()} ${token.trim()}`.trim();
};

const extractFilename = (response, fallbackName) => {
  const disposition = response.headers.get('Content-Disposition');
  if (!disposition) {
    return fallbackName;
  }
  const fileNameMatch = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
  if (!fileNameMatch) {
    return fallbackName;
  }
  const encoded = fileNameMatch[1] || fileNameMatch[2];
  try {
    return decodeURIComponent(encoded);
  } catch (error) {
    console.warn('Unable to decode filename from header', error);
    return encoded;
  }
};

const triggerBrowserDownload = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadFile = async ({ url, fileName, fallbackName, headers = {} }) => {
  const absoluteUrl = resolveAbsoluteUrl(url);
  if (!absoluteUrl) {
    throw new Error('A valid URL is required to download a file.');
  }

  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', '*/*');
  }
  const authHeader = getAuthHeader();
  if (authHeader && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', authHeader);
  }

  const response = await fetch(absoluteUrl, {
    method: 'GET',
    headers: requestHeaders,
    credentials: 'include'
  });

  if (!response.ok) {
    const error = new Error(`Failed to download file. Server responded with ${response.status}.`);
    error.status = response.status;
    throw error;
  }

  const blob = await response.blob();
  const resolvedFileName = extractFilename(response, fileName || fallbackName || 'download');
  triggerBrowserDownload(blob, resolvedFileName);
};

export default downloadFile;

