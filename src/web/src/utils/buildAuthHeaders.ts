const buildAuthHeaders = (
  token: string | null,
  isAuthenticated: boolean,
  isJson = true,
): Record<string, string> => {
  const headers: Record<string, string> = {};

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (isAuthenticated && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export { buildAuthHeaders };
