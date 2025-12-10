/**
 * API client utility for making authenticated requests
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  const url = `${baseUrl}${endpoint}`

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log("[API Client] Requesting:", url)
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include", // Include cookies for authentication
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    let error: any
    const contentType = response.headers.get("content-type")
    
    // Try to parse JSON error response
    if (contentType && contentType.includes("application/json")) {
      try {
        error = await response.json()
      } catch (parseError) {
        // If JSON parsing fails, create a generic error
        error = {
          error: `HTTP ${response.status}`,
          message: response.statusText || "An error occurred",
        }
      }
    } else {
      // If response is not JSON, try to get text
      try {
        const text = await response.text()
        // Check if it's an HTML error page (like Next.js 404 page)
        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
          // Extract meaningful error from HTML or use status-based message
          let message = `HTTP ${response.status}: ${response.statusText}`
          if (response.status === 404) {
            message = "The requested resource was not found. Please check the API endpoint."
          } else if (response.status === 500) {
            message = "Internal server error. Please try again later."
          }
          error = {
            error: `HTTP ${response.status}`,
            message: message,
          }
        } else {
          error = {
            error: `HTTP ${response.status}`,
            message: text || response.statusText || "An error occurred",
          }
        }
      } catch (textError) {
        // If text parsing also fails, create generic error
        error = {
          error: `HTTP ${response.status}`,
          message: response.statusText || "An error occurred",
        }
      }
    }
    
    // Extract error message with better fallback
    let errorMessage = error.message || error.error || `HTTP ${response.status}: ${response.statusText}`
    
    // If we have a more specific message from the API, use it
    if (error.message && typeof error.message === 'string' && error.message.length > 0) {
      errorMessage = error.message
    } else if (error.error && typeof error.error === 'string' && error.error.length > 0) {
      errorMessage = error.error
    }
    
    // Provide user-friendly messages for common errors
    if (response.status === 500 && !errorMessage.includes("Database") && !errorMessage.includes("Unable to fetch")) {
      errorMessage = "A server error occurred. Please try again later."
    }
    
    throw new ApiError(response.status, errorMessage, error)
  }

  return response.json()
}

export async function apiPost<T>(
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function apiGet<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "GET",
  })
}

export async function apiPut<T>(
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function apiDelete<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "DELETE",
  })
}

