import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import api from '../api';
import { Activity, Box, CheckCircle, RefreshCcw } from 'lucide-react';

const Dashboard = () => {
  const { activeProjectId } = useContext(ProjectContext);
  const [stats, setStats] = useState({ releases: 0, deployments: 0 });

  useEffect(() => {
    if (activeProjectId) {
      fetchStats();
    } else {
      setStats({ releases: 0, deployments: 0 });
    }
  }, [activeProjectId]);

  const fetchStats = async () => {
    try {
      const response = await api.get(`dashboard/stats?projectId=${activeProjectId}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
            <Box size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Releases</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.releases}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
            <Activity size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Deployments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.deployments}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3>Recent Activity</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No recent activity to display.</p>
      </div>
    </div>
  );
};

export default Dashboard;
