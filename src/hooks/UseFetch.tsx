// hooks/useFetch.ts
import { API_URL } from "../constants/BaseUrl";
import { getData } from "../utils/storage";
import { useState, useEffect, useCallback, useRef } from "react";

type UseFetchOptions = RequestInit & {
  skip?: boolean;
};

export function useFetch<T = any>(url: string, options?: UseFetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const hasFetched = useRef<boolean>(false);

  const fetchData = useCallback(async () => {
    if (hasFetched.current && !options?.skip) {
      return; // Prevent multiple calls
    }
    
    setError(null);
    setIsSuccess(false);
    hasFetched.current = true;

    try {
      const token = await getData<string>("accessToken");

      const headers: HeadersInit_ = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      setData(json?.data);
      setIsSuccess(true);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [url, options?.skip]);

  useEffect(() => {
    if (!options?.skip) {
      fetchData();
    }
  }, [fetchData]);

  const refetch = useCallback(() => {
    hasFetched.current = false;
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, isSuccess, refetch };
}
