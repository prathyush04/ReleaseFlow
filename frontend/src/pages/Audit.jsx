import { useState, useEffect } from 'react';
import api from '../api';

const Audit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('audit');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Audit Logs
      </h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2.5rem' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ padding: '1.5rem 3rem' }}>Timestamp</th>
                <th style={{ padding: '1.5rem 3rem' }}>User</th>
                <th style={{ padding: '1.5rem 3rem' }}>Action</th>
                <th style={{ padding: '1.5rem 3rem' }}>Entity</th>
                <th style={{ padding: '1.5rem 3rem' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ padding: '1.5rem 3rem', color: 'var(--text-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={{ padding: '1.5rem 3rem' }}>{log.user?.username || 'System'}</td>
                  <td style={{ padding: '1.5rem 3rem', fontWeight: '500', color: 'var(--accent-primary)' }}>{log.action}</td>
                  <td style={{ padding: '1.5rem 3rem' }}>{log.entityType} #{log.entityId}</td>
                  <td style={{ padding: '1.5rem 3rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{log.details}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No audit logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Audit;
