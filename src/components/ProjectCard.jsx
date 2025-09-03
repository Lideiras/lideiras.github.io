import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="project-card" onClick={() => onClick(project)}>
      <div className="project-card-image">
        <img src={project.image} alt={project.title} />
        <div className="project-card-overlay">
          <span className="view-details">View Details</span>
        </div>
      </div>
      
      <div className="project-card-content">
        <div className="project-card-header">
          <h3 className="project-card-title">{project.title}</h3>
          <div className="project-card-meta">
            <span className="project-year">{project.year}</span>
            <span className="project-status">{project.status}</span>
          </div>
        </div>
        
        <p className="project-card-description">{project.shortDescription}</p>
        
        <div className="project-card-technologies">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
          {project.technologies.length > 4 && (
            <span className="tech-tag more">+{project.technologies.length - 4}</span>
          )}
        </div>
        
        <div className="project-card-actions">
          {project.itchLink && (
            <a 
              href={project.itchLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="project-card-link itch"
            >
              🎮 Itch.io
            </a>
          )}
          {project.githubLink && (
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="project-card-link github"
            >
              💻 GitHub
            </a>
          )}
          {project.downloadLink && (
            <a 
              href={project.downloadLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="project-card-link download"
            >
              📥 Direct Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;