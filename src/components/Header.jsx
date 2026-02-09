import React from 'react';

const Header = () => {
  return (
    <header className="blueprint-pattern text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <img 
            src="/images/gertens-logo.png" 
            alt="Gertens Garden Center" 
            className="h-16 md:h-20 w-auto"
            style={{ filter: 'brightness(0) invert(1)' }}
            onError={(e) => {
              console.error('Logo failed to load');
              e.target.style.display = 'none';
            }}
          />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Garden Planner
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
