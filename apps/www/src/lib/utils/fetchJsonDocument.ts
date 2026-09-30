export type FetchJsonErrorCode =
  "invalid_url" | "request_failed" | "request_timeout" | "invalid_response";

export class FetchJsonError extends Error {
  constructor(
    public readonly code: FetchJsonErrorCode,
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = "FetchJsonError";
  }
}

const REQUEST_TIMEOUT_MS = 15_000;

export const fetchJsonDocument = async (url: string): Promise<unknown> => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch (cause) {
    throw new FetchJsonError("invalid_url", "Enter a valid URL.", { cause });
  }

  if (!/^https?:$/.test(parsedUrl.protocol)) {
    throw new FetchJsonError("invalid_url", "Only HTTP and HTTPS URLs are supported.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(parsedUrl, { signal: controller.signal });

    if (!response.ok) {
      throw new FetchJsonError(
        "request_failed",
        `Document request failed with status ${response.status}.`
      );
    }

    try {
      return await response.json();
    } catch (cause) {
      throw new FetchJsonError("invalid_response", "Response is not valid JSON.", { cause });
    }
  } catch (cause) {
    if (cause instanceof FetchJsonError) throw cause;
    if (cause instanceof DOMException && cause.name === "AbortError") {
      throw new FetchJsonError("request_timeout", "Document request timed out.", { cause });
    }
    throw new FetchJsonError("request_failed", "Document request could not be completed.", {
      cause,
    });
  } finally {
    clearTimeout(timeout);
  }
};
