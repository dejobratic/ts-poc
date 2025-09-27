export interface HttpRequest {
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: unknown;
}

export interface HttpResponse<T = unknown> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
  isSuccessStatusCode: boolean;
  ensureSuccessStatusCode(): void;
}

export interface HttpOptions {
  baseUrl?: string;
  timeout?: number;
}