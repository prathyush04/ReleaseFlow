import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { KeyRound, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/signin', { username, password });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>ReleaseFlow</h2>
        
        {error && <div className="badge badge-danger" style={{ marginBottom: '1rem', display: 'block' }}>{error}</div>}
        
        <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Quick Login (Testing)</label>
          <select 
            className="form-input" 
            style={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            onChange={(e) => {
              if (e.target.value === 'admin') { setUsername('admin'); setPassword('password123'); }
              else if (e.target.value === 'manager') { setUsername('sarah_mgr'); setPassword('password123'); }
              else if (e.target.value === 'developer') { setUsername('john_dev'); setPassword('password123'); }
              else { setUsername(''); setPassword(''); }
            }}
          >
            <option value="">-- Select a test account --</option>
            <option value="admin">Administrator</option>
            <option value="manager">Release Manager</option>
            <option value="developer">Developer</option>
          </select>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label"><User size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/>Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username"
              required 
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label"><KeyRound size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
