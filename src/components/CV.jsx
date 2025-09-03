import React from 'react';
import Layout from './Layout';

const CV = ({ activeSection, setActiveSection }) => {
  return (
    <Layout 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      showHeader={true}
      showTopNav={true}
    >
      <div className="contact-page">
        <div className="contact-header">
          <h1>Curriculum Vitae</h1>
          <p>Professional experience and educational background</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Professional Experience</h3>
            <div className="contact-item">
              <strong>Current Position:</strong><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•Fullstack developer
            </div>
            <div className="contact-item">
              <strong>Current Company:</strong><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•Global Fun Partners
            </div>
            <div className="cv-download-section">
              <a 
                href="src/assets/documents/CV_eng.pdf" 
                download="CV_DanielNoya.pdf"
                className="cv-download-btn"
              >
                📄 Download Full CV (PDF)
              </a>
            </div>
          </div>

          <div className="cv-form-section">
            <div className="cv-section">
              <h3>Education</h3>
              <div className="cv-placeholder">
                <p>
                  <br/><br/>•Game Design and Development, Girona's University.
                  <br/><br/>•Master's in Data Science and Artificial Intelligence, Girona's University.
                  <br/><br/>•Study abroad in Università degli Studi di Cassino e del Lazio Meridionale.
                  <br/><br/>•Study abroad in St Kieran's College.
                </p>
              </div>
            </div>

            <div className="cv-section">
              <h3>Skills & Technologies</h3>
              <div className="cv-placeholder">
                <p><br/><strong>Programming Languages:</strong> Python, JavaScript, SQL, HTML/CSS, C++, C#, PHP, Laravel, React, Kotlin (Basic)
                <br/><br/><strong>Software/Tools:</strong>Unity, Unreal Engine, Git, ServiceNow, Godot, Blender, Substance Painter, Adobe Suite.</p>
              </div>
              <div className="cv-placeholder">
                <p><strong>Languages:</strong><br/>Spanish, Galician, Catalan, English, Italian</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CV;