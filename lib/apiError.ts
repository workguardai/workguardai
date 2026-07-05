/** Pull a human-readable message out of an RTK Query / fetch error envelope. */
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === 'object' && 'error' in data) {
      const inner = (data as { error?: { message?: string } }).error;
      if (inner?.message) return inner.message;
    }
  }
  return fallback;
}
