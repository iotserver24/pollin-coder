/**
 * Pollinations AI API utilities with token authentication
 */

const POLLINATIONS_API_URL = "https://text.pollinations.ai/openai";

/**
 * Get the Pollinations AI token from environment variables
 */
function getPollinationsToken(): string | undefined {
  // Use globalThis to access environment variables in Next.js
  return (globalThis as any).process?.env?.POLLINATIONS_AI_TOKEN;
}

/**
 * Create headers for Pollinations AI API requests with optional token authentication
 */
function createPollinationsHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getPollinationsToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Make a request to Pollinations AI API with authentication
 */
export async function callPollinationsAPI(
  body: any,
  options: {
    stream?: boolean;
    timeout?: number;
  } = {}
): Promise<Response> {
  const { stream = false, timeout = 30000 } = options;

  const url = stream 
    ? `${POLLINATIONS_API_URL}?token=${getPollinationsToken() || ''}`
    : POLLINATIONS_API_URL;

  const headers = createPollinationsHeaders();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pollinations API error: ${response.status} - ${errorText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Pollinations API request timed out');
    }
    throw error;
  }
}

/**
 * Make a streaming request to Pollinations AI API
 */
export async function callPollinationsAPIStream(body: any): Promise<Response> {
  return callPollinationsAPI(body, { stream: true });
}

/**
 * Make a non-streaming request to Pollinations AI API
 */
export async function callPollinationsAPISync(body: any): Promise<Response> {
  return callPollinationsAPI(body, { stream: false });
}