import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src="/images/gertens-logo.png" 
              alt="Gertens Garden Center" 
              className="h-12 w-auto"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 mb-1">
              Powered by AI • Designed for Gertens Garden Center
            </p>
            <p className="text-sm text-gray-600">
              All plant recommendations are guaranteed to thrive in Minnesota's climate
            </p>
          </div>

          {/* Link */}
          <div>
            <a
              href="https://www.gertens.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gertens-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              Visit Gertens.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
