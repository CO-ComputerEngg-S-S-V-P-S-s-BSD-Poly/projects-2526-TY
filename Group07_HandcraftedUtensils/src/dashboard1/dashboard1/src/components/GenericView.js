import React from 'react';

const GenericView = ({ title, icon: Icon }) => {
  return (
    <div className="view-content">
      <h1 className="page-title">{title}</h1>
      <div className="placeholder-content">
        <Icon size={64} color="#C17A3F" />
        <p>This section is under development</p>
        <p className="placeholder-subtitle">Dynamic content will be displayed here</p>
      </div>
    </div>
  );
};

export default GenericView;
