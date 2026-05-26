import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(localStorage.getItem('activeProjectId') || '');
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('projects');
      setProjects(res.data);
      if (res.data.length > 0) {
        const savedId = localStorage.getItem('activeProjectId');
        const validId = res.data.find(p => p.id == savedId) ? savedId : res.data[0].id;
        if (validId !== activeProjectId) {
          setActiveProjectId(validId);
          localStorage.setItem('activeProjectId', validId);
        }
      } else {
        setActiveProjectId('');
        localStorage.removeItem('activeProjectId');
      }
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const changeProject = (id) => {
    setActiveProjectId(id);
    localStorage.setItem('activeProjectId', id);
  };

  return (
    <ProjectContext.Provider value={{ projects, activeProjectId, changeProject, fetchProjects, loadingProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};
