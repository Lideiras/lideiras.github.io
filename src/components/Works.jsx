import React, { useState } from 'react';
import Layout from './Layout';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { allProjects } from '../works/index.js';

const Works = ({ activeSection, setActiveSection }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const handleProjectClick = (project) => {
    console.log('handleProjectClick called with project:', project);
    const projectIndex = allProjects.findIndex(p => p.id === project.id);
    setCurrentProjectIndex(projectIndex);
    setSelectedProject(project);
    setIsModalOpen(true);
    console.log('Modal should be open now, isModalOpen:', true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handlePrevProject = () => {
    setCurrentProjectIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? allProjects.length - 1 : prevIndex - 1;
      if (isModalOpen) {
        setSelectedProject(allProjects[newIndex]);
      }
      return newIndex;
    });
  };

  const handleNextProject = () => {
    setCurrentProjectIndex((prevIndex) => {
      const newIndex = prevIndex === allProjects.length - 1 ? 0 : prevIndex + 1;
      if (isModalOpen) {
        setSelectedProject(allProjects[newIndex]);
      }
      return newIndex;
    });
  };

  const currentProject = allProjects[currentProjectIndex];

  return (
    <Layout 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      showHeader={true}
      showTopNav={true}
    >
      <div className="contact-page">
        <div className="contact-header">
          <h1>Works</h1>
          <p>Some projects I've made during the years</p>
          <br></br>
          <p>Some of the projects are available for <strong>direct download</strong> of the project files</p>
        </div>

        <div className="works-content">
          {allProjects.length > 0 ? (
            <div className="project-carousel">
              <button 
                className="carousel-nav carousel-nav-prev" 
                onClick={handlePrevProject}
                aria-label="Proyecto anterior"
              >
                ‹
              </button>
              
              <div className="project-carousel-container">
                <ProjectCard 
                  key={currentProject.id}
                  project={currentProject}
                  onClick={handleProjectClick}
                />
              </div>
              
              <button 
                className="carousel-nav carousel-nav-next" 
                onClick={handleNextProject}
                aria-label="Siguiente proyecto"
              >
                ›
              </button>
            </div>
          ) : (
            <div className="no-projects">
              <p>No hay proyectos disponibles en este momento.</p>
            </div>
          )}
          
          {allProjects.length > 1 && (
            <div className="carousel-indicators">
              {allProjects.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${index === currentProjectIndex ? 'active' : ''}`}
                  onClick={() => setCurrentProjectIndex(index)}
                  aria-label={`Ir al proyecto ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPrevProject={handlePrevProject}
        onNextProject={handleNextProject}
        currentIndex={currentProjectIndex}
        totalProjects={allProjects.length}
      />
    </Layout>
  );
};

export default Works;