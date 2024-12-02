import { handleAxiosError } from "~/utils/errors.utils";
import { ERROR_MESSAGE } from "~/constants/message";

export const handleApiError = (error: any, customErrorMessage?: string) => {
  const message = customErrorMessage || ERROR_MESSAGE.UNEXPECTED_ERROR;
  handleAxiosError(
    error,
    message,
    false,
    error?.response?.data?.message || message,
  );
  throw error; // Rethrow the error to keep the promise chain intact if necessary
};

export const wrapAsync = <T>(asyncFunction: () => Promise<T>): Promise<T> => {
  return asyncFunction().catch((error) => {
    // Centralized logging if needed
    throw error; // Let the error bubble up to be caught by handleRequest
  });
};

export const handleRequest = async <T>(
  request: () => Promise<T>,
  errorMessage?: string,
): Promise<T> => {
  return wrapAsync(() =>
    request()
      .then((response) => response)
      .catch((error) => {
        handleApiError(error, errorMessage);
        throw error; // Optional: rethrow the error if you want further processing
      }),
  );
};
