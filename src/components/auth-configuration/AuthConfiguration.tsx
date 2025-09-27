import type { ChangeEvent } from 'react';
import type { AuthConfig } from '@/services/auth';

interface AuthConfigurationProps {
  config: AuthConfig;
  onConfigChange: (config: AuthConfig) => void;
  onGetToken: () => void;
  isTokenValid: boolean;
}

export function AuthConfiguration({
  config,
  onConfigChange,
  onGetToken,
  isTokenValid,
}: AuthConfigurationProps) {
  const handleFieldChange = (field: keyof AuthConfig) => 
    (event: ChangeEvent<HTMLInputElement>) => {
      onConfigChange({
        ...config,
        [field]: event.target.value,
      });
    };

  return (
    <div>
      <h2>Authentication Configuration</h2>
      
      <div>
        <label htmlFor="tenantId">Tenant ID</label>
        <input
          id="tenantId"
          type="text"
          aria-label="Tenant ID"
          value={config.tenantId}
          onChange={handleFieldChange('tenantId')}
          placeholder="your-tenant-id"
        />
      </div>

      <div>
        <label htmlFor="clientId">Client ID</label>
        <input
          id="clientId"
          type="text"
          aria-label="Client ID"
          value={config.clientId}
          onChange={handleFieldChange('clientId')}
          placeholder="your-client-id"
        />
      </div>

      <div>
        <label htmlFor="clientSecret">Client Secret</label>
        <input
          id="clientSecret"
          type="text"
          aria-label="Client Secret"
          value={config.clientSecret}
          onChange={handleFieldChange('clientSecret')}
          placeholder="your-client-secret"
        />
      </div>

      <div>
        <label htmlFor="scope">Scope</label>
        <input
          id="scope"
          type="text"
          aria-label="Scope"
          value={config.scope}
          onChange={handleFieldChange('scope')}
          placeholder="https://graph.microsoft.com/.default"
        />
      </div>

      <div>
        <button onClick={onGetToken}>Get Token</button>
        <span>
          Status: {isTokenValid ? 'Token Valid ✅' : 'No Token ❌'}
        </span>
      </div>
    </div>
  );
}