import { isAxiosError } from "axios";

/** Turn any API failure into one readable sentence for the UI. */
export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    if (!err.response) {
      return "Cannot reach the server. Is the backend running?";
    }
    if (err.response.status === 429) {
      return "Too many attempts. Please wait a minute and try again.";
    }
    const data = err.response.data;
    if (data && typeof data === "object") {
      if (typeof data.detail === "string") {
        return data.detail;
      }
      // DRF field errors look like { email: ["..."], password: ["..."] }
      const messages = Object.values(data)
        .flat()
        .filter((m): m is string => typeof m === "string");
      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  }
  return "Something went wrong. Please try again.";
}