import React from 'react';
import Header from './Header';
import TopNav from './TopNav';

const Layout = ({ children, activeSection, setActiveSection, showHeader = true, showTopNav = true }) => {
  return (
    <div className="main-content">
      {/* Header superior */}
      {showHeader && <Header />}
      
      {/* Barra de navegación */}
      {showTopNav && (
        <TopNav 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
      )}
      
      {/* Contenido de la página */}
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;