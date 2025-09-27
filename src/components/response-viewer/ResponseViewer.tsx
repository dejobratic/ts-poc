import type { HttpResponse } from '@/services/http';

interface ResponseViewerProps {
  response: HttpResponse | null;
}

export function ResponseViewer({ response }: ResponseViewerProps) {
  if (!response) {
    return null;
  }

  const formatResponseData = (data: unknown): string => {
    if (typeof data === 'string') {
      return data;
    }
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div>
      <h2>Response</h2>
      
      <div>
        <h3>Status</h3>
        <span>
          {response.isSuccessStatusCode ? '✅' : '❌'} {response.status} {response.statusText}
        </span>
      </div>

      <div>
        <h3>Headers</h3>
        {Object.entries(response.headers).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>

      <div>
        <h3>Body</h3>
        <pre>{formatResponseData(response.data)}</pre>
      </div>
    </div>
  );
}