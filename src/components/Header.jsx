import React from 'react';

const Header = () => {
  return (
    <header className="blueprint-pattern text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-4">
          <img 
            src="/images/gertens-blueprint-favicon.png" 
            alt="Gertens Logo" 
            className="w-12 h-12 camera-icon-style"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Gertens Garden Planner
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-1">
              Design Your Dream Garden with AI-Powered Plant Recommendations
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
