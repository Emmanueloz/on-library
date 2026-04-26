const buildAuthHeaders = (
  token: string | null,
  isAuthenticated: boolean,
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (isAuthenticated && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export { buildAuthHeaders };
