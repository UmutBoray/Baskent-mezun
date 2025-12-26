import React, { useEffect, useState } from 'react';

const TestPage: React.FC = () => {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    (async () => {
      try {
        console.log('Testing backend connection...');
        const response = await fetch('http://localhost:5000/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setStatus(`✅ Backend OK: ${JSON.stringify(data)}`);
      } catch (error) {
        console.error('Backend test error:', error);
        setStatus(`❌ Backend Error: ${String(error)}`);
      }
    })();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>Backend Connection Test</h1>
      <p>{status}</p>
    </div>
  );
};

export default TestPage;
