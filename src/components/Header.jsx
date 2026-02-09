import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b-4 border-gertens-blue shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-6">
          <img 
            src="/images/gertens-logo.png" 
            alt="Gertens Garden Center" 
            className="h-16 md:h-20 w-auto"
            onError={(e) => {
              console.error('Logo failed to load');
              e.target.style.display = 'none';
            }}
          />
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gertens-blue tracking-tight">
              Garden Planner
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Design Your Dream Garden with AI-Powered Plant Recommendations
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
