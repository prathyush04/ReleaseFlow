import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { Save } from 'lucide-react';
import { ProjectContext } from '../context/ProjectContext';

const Settings = () => {
  const { activeProjectId, projects, fetchProjects } = useContext(ProjectContext);
  const [formData, setFormData] = useState({ name: '', description: '', vercelToken: '', vercelProjectId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeProjectId) {
      const activeProject = projects.find(p => p.id == activeProjectId);
      if (activeProject) {
        setFormData({
          name: activeProject.name || '',
          description: activeProject.description || '',
          vercelToken: activeProject.vercelToken || '',
          vercelProjectId: activeProject.vercelProjectId || ''
        });
      }
    }
  }, [activeProjectId, projects]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`projects/${activeProjectId}`, formData);
      alert('Settings saved successfully!');
      fetchProjects(); // refresh global state
    } catch (error) {
      console.error('Error saving settings', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!activeProjectId) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Please select a project from the sidebar to view settings.
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Project Settings</h2>
      
      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        <form onSubmit={handleSave}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>General Settings</h3>
          
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}></textarea>
          </div>

          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Vercel Integration</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Connect this project to Vercel to automatically sync actual deployment statuses.
          </p>
          
          <div className="form-group">
            <label className="form-label">Vercel API Token</label>
            <input type="password" className="form-input" value={formData.vercelToken} onChange={e => setFormData({...formData, vercelToken: e.target.value})} placeholder="e.g. qm..." />
            <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>Create this in your Vercel Account Settings &gt; Tokens.</small>
          </div>
          <div className="form-group">
            <label className="form-label">Vercel Project ID</label>
            <input type="text" className="form-input" value={formData.vercelProjectId} onChange={e => setFormData({...formData, vercelProjectId: e.target.value})} placeholder="e.g. prj_..." />
            <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>Found in Vercel Project Settings &gt; General.</small>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
