import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import api from '../api';
import { Plus, X } from 'lucide-react';

const Releases = () => {
  const { activeProjectId } = useContext(ProjectContext);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', version: '', description: '', webhookUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeProjectId) {
      fetchReleases();
    } else {
      setReleases([]);
      setLoading(false);
    }
  }, [activeProjectId]);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const res = await api.get(`releases?projectId=${activeProjectId}`);
      setReleases(res.data);
    } catch (error) {
      console.error('Error fetching releases', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('releases', { ...formData, projectId: activeProjectId });
      setShowModal(false);
      setFormData({ name: '', version: '', description: '', webhookUrl: '' });
      fetchReleases();
    } catch (error) {
      console.error('Error creating release', error);
      alert('Failed to create release. Check console.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Releases</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
          disabled={!activeProjectId}
        >
          <Plus size={16} /> New Release
        </button>
      </div>

      {!activeProjectId ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Please select or create a project from the sidebar to manage releases.
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : releases.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No releases found.</td></tr>
            ) : (
              releases.map(r => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td style={{ fontWeight: '500' }}>{r.version}</td>
                  <td>
                    <span className={`badge ${r.status === 'READY' ? 'badge-success' : 'badge-info'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Create New Release</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Release Name</label>
                <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Payment Gateway Update" />
              </div>
              <div className="form-group">
                <label className="form-label">Version</label>
                <input required type="text" className="form-input" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} placeholder="e.g. v1.2.0" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description..." rows={3}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Webhook URL (Optional)</label>
                <input type="url" className="form-input" value={formData.webhookUrl} onChange={e => setFormData({...formData, webhookUrl: e.target.value})} placeholder="e.g. https://api.vercel.com/v1/integrations/deploy/..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Releases;
