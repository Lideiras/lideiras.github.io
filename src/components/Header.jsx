import React from 'react';

const Header = ({ version = 'v2025.02.09' }) => {
  return (
    <div className="top-header">
      <div className="version-info">{version}</div>
    </div>
  );
};

export default Header;