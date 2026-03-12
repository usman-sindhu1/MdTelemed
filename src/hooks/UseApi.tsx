import { useMutation } from "@tanstack/react-query";
import axios, { AxiosProgressEvent, AxiosError } from "axios";
import { getData } from "../utils/storage";
import { API_URL } from "../constants/BaseUrl";

type DataRequestType<T> = {
  path: string;
  data?: T;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
};

type ApiResponse<R> = {
  message: string;
  data: R;
};

type MutationFunction<T, R = any> = {
  data?: T;
  path: string;
  onSuccess?: (data: R) => void;
  onError?: (error: any) => void;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
};

interface IUsePostApi<T> {
  key?: string | T;
  isSuccessToast?: boolean;
  method?: "post" | "put" | "delete" | "patch";
}

// Create axios instance with better defaults
const apiClient = axios.create({
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging and error handling
apiClient.interceptors.request.use(
  (config: any) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: any) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response: any) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error(`❌ Response error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("❌ No response received. Check your network connection and API server status.");
      console.error("Request details:", {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
      });
    } else {
      // Something else happened
      console.error("❌ Error:", error.message);
    }
    return Promise.reject(error);
  }
);

const useApi = <T,>({
  isSuccessToast = true,
  key,
  method = "post",
}: IUsePostApi<T> = {}) => {

  const headers = async () => {
    const token = await getData<string>("accessToken");
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  };

  // General API request function to handle different methods
  const apiRequest = async ({
    data,
    path,
    onUploadProgress,
  }: DataRequestType<T>) => {
    const REQUEST_PATH = `${API_URL}${path}`;
    const config = {
      headers: await headers(),
      onUploadProgress,
      timeout: 30000, // 30 second timeout
    };

    try {
      switch (method) {
        case "post":
          return await apiClient.post<ApiResponse<any>>(REQUEST_PATH, data, config);
        case "put":
          return await apiClient.put<ApiResponse<any>>(REQUEST_PATH, data, config);
        case "delete":
          return await apiClient.delete<ApiResponse<any>>(REQUEST_PATH, config);
        case "patch":
          return await apiClient.patch<ApiResponse<any>>(REQUEST_PATH, data, config);
        default:
          throw new Error("Invalid method provided");
      }
    } catch (error: unknown) {
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (!axiosError.response && axiosError.code === 'ECONNABORTED') {
          throw new Error('Request timeout - the server took too long to respond');
        } else if (!axiosError.response) {
          throw new Error('Network error - please check your internet connection and ensure the API server is running');
        }
      }
      throw error;
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: apiRequest,
    mutationKey: [key],
  });

  const onRequest = <R = any,>({
    data,
    path,
    onError = () => {},
    onSuccess = () => {},
    onUploadProgress,
  }: MutationFunction<T, R>) => {
    mutate(
      {
        path,
        data,
        onUploadProgress,
      },
      {
        onSuccess: (response: any) => {
          if (isSuccessToast) {
            // Add success toast if needed
          }
          console.log("✅ Success:", response);
          onSuccess(response.data.data);
        },
        onError: (error: any) => {
          console.error("❌ API error:", error);
          
          // Provide user-friendly error message
          let errorMessage = "An error occurred. Please try again.";
          
          if (axios.isAxiosError(error)) {
            if (error.response) {
              // Server responded with error
              errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
              // No response received
              errorMessage = "Cannot connect to server. Please check your internet connection and ensure the API server is running.";
            } else {
              // Request setup error
              errorMessage = error.message || "Request failed";
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          // Create enhanced error object
          const enhancedError = {
            ...error,
            message: errorMessage,
            isNetworkError: axios.isAxiosError(error) && !error.response,
          };
          
          onError(enhancedError);
        },
      }
    );
  };

  return {
    onRequest,
    isPending,
  };
};

export default useApi;
