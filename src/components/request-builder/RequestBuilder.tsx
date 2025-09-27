import type { ChangeEvent } from 'react';
import type { HttpRequest } from '@/services/http';

interface RequestBuilderProps {
  request: HttpRequest;
  onRequestChange: (request: HttpRequest) => void;
}

export function RequestBuilder({ request, onRequestChange }: RequestBuilderProps) {
  const handleMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onRequestChange({
      ...request,
      method: event.target.value as 'GET' | 'POST',
    });
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    onRequestChange({
      ...request,
      url: event.target.value,
    });
  };

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onRequestChange({
      ...request,
      body: event.target.value,
    });
  };

  const getBodyValue = (): string => {
    if (typeof request.body === 'string') {
      return request.body;
    }
    return '';
  };

  return (
    <div>
      <div>
        <label htmlFor="method">Method</label>
        <select
          id="method"
          aria-label="Method"
          value={request.method}
          onChange={handleMethodChange}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div>
        <label htmlFor="url">URL</label>
        <input
          id="url"
          type="text"
          aria-label="URL"
          value={request.url}
          onChange={handleUrlChange}
          placeholder="https://api.example.com/endpoint"
        />
      </div>

      {request.method === 'POST' && (
        <div>
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            aria-label="Body"
            value={getBodyValue()}
            onChange={handleBodyChange}
            placeholder="JSON request body"
            rows={10}
          />
        </div>
      )}
    </div>
  );
}