import React, { useEffect } from 'react';

const ProjectModal = ({ project, isOpen, onClose, onPrevProject, onNextProject, currentIndex, totalProjects }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-navigation">
            {totalProjects > 1 && (
              <>
                <button 
                  className="modal-nav-btn modal-nav-prev" 
                  onClick={onPrevProject}
                  aria-label="Proyecto anterior"
                >
                  ‹
                </button>
                <span className="modal-nav-indicator">
                  {currentIndex + 1} / {totalProjects}
                </span>
                <button 
                  className="modal-nav-btn modal-nav-next" 
                  onClick={onNextProject}
                  aria-label="Siguiente proyecto"
                >
                  ›
                </button>
              </>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        {/* Layout Grid Container */}
        <div className="modal-grid">
          {/* Left Column - Image */}
          <div className="modal-image-section">
            <img src={project.image} alt={project.title} className="modal-image" />
          </div>
          
          {/* Top Right - Title */}
          <div className="modal-title-section">
            <h2 className="modal-title">{project.title}</h2>
          </div>
          
          {/* Top Right - Year and Status */}
          <div className="modal-year-status-section">
            <span className="modal-year">{project.year || '2024'}</span>
            <span className="modal-status">{project.status || 'Completed'}</span>
          </div>
          
          {/* Description and Technologies Section */}
          <div className="modal-description-section">
            <div>
              <h3>About this Project</h3>
              <p className="modal-description-text">{project.fullDescription}</p>
            </div>
            
            {project.technologies && (
              <div className="modal-technologies-section">
                <h4>Technologies Used</h4>
                <ul className="modal-technologies-list">
                  {project.technologies.map((tech, index) => (
                    <li key={index} className="modal-tech-tag">{tech}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Content Grid - Features, Challenges, Links */}
          <div className="modal-content-grid">
            {/* Features */}
            {project.features && (
              <div className="modal-features-section">
                <h3>Key Features</h3>
                <ul className="modal-features-list">
                  {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Challenges */}
            {project.challenges && (
              <div className="modal-challenges-section">
                <h3>Development Challenges</h3>
                <p className="modal-challenges-text">{project.challenges}</p>
              </div>
            )}
            
            {/* Links */}
            <div className="modal-links-section">
              <h3>Project Links</h3>
              {project.itchLink && (
                <a href={project.itchLink} target="_blank" rel="noopener noreferrer" className="modal-link-button itch-link">
                  🎮 Itch.io's page
                </a>
              )}
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="modal-link-button github-link">
                  💻 GitHub's repo
                </a>
              )}
              {project.downloadLink && (
                <a href={project.downloadLink} target="_blank" rel="noopener noreferrer" className="modal-link-button download-link">
                  ⬇️ Download
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;