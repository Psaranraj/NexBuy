import { useState } from "react";
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const execute = async <T>(
    apiFunction: () => Promise<T>,
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFunction();
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, execute };
}
