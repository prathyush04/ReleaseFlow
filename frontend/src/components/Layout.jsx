import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, Activity, LogOut, FileText, Plus, X, Settings } from 'lucide-react';
import { ProjectContext } from '../context/ProjectContext';
import api from '../api';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, activeProjectId, changeProject, fetchProjects } = useContext(ProjectContext);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/releases', label: 'Releases', icon: Box },
    { path: '/deployments', label: 'Deployments', icon: Activity },
    { path: '/audit', label: 'Audit Logs', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="app-container">
      <aside className="glass-panel" style={{ width: '250px', margin: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-gradient)', borderRadius: '8px' }}></div>
          ReleaseFlow
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <select 
            className="form-input" 
            value={activeProjectId} 
            onChange={(e) => changeProject(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
          >
            <option value="" disabled>Select a Project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem', fontSize: '0.8rem', width: '100%' }}
            onClick={() => setShowProjectModal(true)}
          >
            <Plus size={14} /> New Project
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', 
                  borderRadius: '8px', textDecoration: 'none',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={20} />
                <span style={{ fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="btn btn-secondary" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      {showProjectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Create New Project</h3>
              <button onClick={() => setShowProjectModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              try {
                await api.post('projects', { name: newProjectName, description: newProjectDesc });
                setShowProjectModal(false);
                setNewProjectName('');
                setNewProjectDesc('');
                fetchProjects();
              } catch (error) {
                alert('Error creating project');
              } finally {
                setSubmitting(false);
              }
            }}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input required className="form-input" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <input className="form-input" value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowProjectModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
