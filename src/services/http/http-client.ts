import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

import type { HttpRequest, HttpResponse, HttpOptions } from '@/services/http';

export class HttpClient {
  private readonly client: AxiosInstance;

  constructor(options?: HttpOptions) {
    this.client = axios.create({
      baseURL: options?.baseUrl,
      timeout: options?.timeout ?? 30000,
    });
  }

  async send<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    const response: AxiosResponse<T> = await this.client.request({
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.body,
    });

    return this.mapToHttpResponse(response);
  }

  private mapToHttpResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
    const isSuccessStatusCode = response.status >= 200 && response.status < 300;

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      data: response.data,
      isSuccessStatusCode,
      ensureSuccessStatusCode() {
        if (!isSuccessStatusCode) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
      },
    }; 
  }
}