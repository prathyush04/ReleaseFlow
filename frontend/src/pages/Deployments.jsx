import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import api from '../api';
import { Play, X } from 'lucide-react';

const Deployments = () => {
  const { activeProjectId } = useContext(ProjectContext);
  const [deployments, setDeployments] = useState([]);
  const [releases, setReleases] = useState([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ environment: 'QA' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeProjectId) {
      fetchReleases();
    } else {
      setReleases([]);
      setDeployments([]);
    }
  }, [activeProjectId]);

  useEffect(() => {
    let interval;
    const hasActiveDeployments = deployments.some(d => d.status === 'QUEUED' || d.status === 'IN_PROGRESS');
    if (hasActiveDeployments && selectedReleaseId) {
      interval = setInterval(() => {
        // Silently fetch deployments to update status without showing loading spinner
        api.get(`deployments/release/${selectedReleaseId}`)
          .then(res => setDeployments(res.data))
          .catch(err => console.error(err));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [deployments, selectedReleaseId]);

  const fetchReleases = async () => {
    try {
      const res = await api.get(`releases?projectId=${activeProjectId}`);
      setReleases(res.data);
      if (res.data.length > 0) {
        const savedId = localStorage.getItem('selectedReleaseId');
        // Validate if savedId still exists in current releases, otherwise fallback to first
        const validId = res.data.find(r => r.id == savedId) ? savedId : res.data[0].id;
        setSelectedReleaseId(validId);
        fetchDeployments(validId);
      } else {
        setSelectedReleaseId('');
        setDeployments([]);
      }
    } catch (error) {
      console.error('Error fetching releases', error);
    }
  };

  const fetchDeployments = async (releaseId) => {
    if (!releaseId) return;
    setLoading(true);
    try {
      const res = await api.get(`deployments/release/${releaseId}`);
      setDeployments(res.data);
    } catch (error) {
      console.error('Error fetching deployments', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseChange = (e) => {
    const id = e.target.value;
    setSelectedReleaseId(id);
    localStorage.setItem('selectedReleaseId', id);
    fetchDeployments(id);
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (!selectedReleaseId) return alert('Select a release first');
    setSubmitting(true);
    try {
      await api.post('deployments', {
        releaseId: selectedReleaseId,
        environment: formData.environment
      });
      setShowModal(false);
      // The backend simulates a pipeline in the background. Refresh immediately and then after 5 secs.
      fetchDeployments(selectedReleaseId);
      setTimeout(() => fetchDeployments(selectedReleaseId), 5000);
    } catch (error) {
      console.error('Error triggering deployment', error);
      if (error.response && error.response.status === 403) {
        alert('You are not authorized to trigger deployments. Only Admins and Release Managers can perform this action.');
      } else {
        alert('Failed to trigger deployment');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS': return 'badge-success';
      case 'FAILED': return 'badge-danger';
      case 'IN_PROGRESS': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>Deployments</h2>
          <select 
            className="form-input" 
            style={{ width: 'auto', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)' }} 
            value={selectedReleaseId} 
            onChange={handleReleaseChange}
          >
            {releases.length === 0 ? <option value="">No releases found</option> : null}
            {releases.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.version})</option>
            ))}
          </select>
          <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => fetchDeployments(selectedReleaseId)}>Refresh</button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={!selectedReleaseId}>
          <Play size={16} /> Deploy
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Environment</th>
              <th>Status</th>
              <th>Rollback</th>
              <th>Started At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : deployments.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No deployments found for this release.</td></tr>
            ) : (
              deployments.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: '500' }}>{d.environment}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(d.status)}`}>
                      {d.status}
                    </span>
                  </td>
                  <td>{d.isRollback ? 'Yes' : 'No'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{new Date(d.startedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Trigger Deployment</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Deploying: <strong style={{ color: 'white' }}>{releases.find(r => r.id == selectedReleaseId)?.name}</strong>
            </p>
            <form onSubmit={handleDeploy}>
              <div className="form-group">
                <label className="form-label">Target Environment</label>
                <select className="form-input" value={formData.environment} onChange={e => setFormData({ environment: e.target.value })}>
                  <option value="QA">QA Environment</option>
                  <option value="STAGING">Staging Environment</option>
                  <option value="PRODUCTION">Production Environment</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Triggering...' : 'Deploy'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deployments;
