import React from 'react';

const About = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-gertens-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gertens-blue mb-2">
            About These Recommendations
          </h1>
          <p className="text-gray-600">
            Understanding how your garden plan is created
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-8 h-8 bg-gertens-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              AI-Powered Garden Planning
            </h2>
            <p className="text-gray-700 leading-relaxed ml-11">
              Your garden recommendations are generated using Google's Gemini 2.5 Flash, an advanced artificial intelligence model. 
              This AI analyzes your uploaded photo, considers your sun exposure and theme preferences, and creates a customized 
              plant selection specifically for Minnesota's climate (USDA Hardiness Zones 3-4).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-8 h-8 bg-gertens-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              Knowledge Sources
            </h2>
            <p className="text-gray-700 leading-relaxed ml-11 mb-3">
              The AI's recommendations draw from extensive horticultural knowledge, including:
            </p>
            <ul className="ml-11 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Botanical databases and plant encyclopedias</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">USDA plant hardiness zone information</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Professional landscaping and garden design resources</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Regional gardening guides and proven Minnesota performers</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Nursery catalogs and plant care information</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-8 h-8 bg-gertens-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              Minnesota-Specific Expertise
            </h2>
            <p className="text-gray-700 leading-relaxed ml-11">
              All plant recommendations are specifically selected for Minnesota's unique climate and growing conditions. 
              The AI ensures every suggested plant is hardy in USDA Zones 3-4, can withstand our cold winters, 
              and will thrive in our growing season.
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-yellow-800 mb-2">
                Important: AI Recommendations Are a Starting Point
              </h3>
              <p className="text-yellow-700 leading-relaxed mb-3">
                While our AI provides knowledgeable suggestions based on extensive horticultural data, these recommendations 
                are <strong>general guidance</strong> and not a substitute for professional landscaping advice. Every garden 
                has unique characteristics including soil type, drainage, microclimates, and existing conditions that can 
                affect plant success.
              </p>
              <p className="text-yellow-700 leading-relaxed">
                <strong>Please note:</strong> These recommendations are generated from general botanical knowledge and are 
                not based on Gertens' current inventory. Plant availability may vary.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gertens-blue to-blue-600 rounded-xl p-8 text-white">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gertens-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">
                Talk to a Gertens Expert Before You Plant!
              </h3>
              <p className="text-blue-100 mb-4 leading-relaxed">
                We strongly recommend visiting Gertens Garden Center to speak with our knowledgeable nursery professionals 
                before making your final planting decisions. Our experts can:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-200 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-50">Assess your specific soil conditions and drainage</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-200 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-50">Verify plant availability in our current inventory</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-200 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-50">Suggest alternatives or improvements based on your specific site</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-200 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-50">Provide hands-on guidance for planting and care</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-200 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-50">Help you choose the healthiest specimens from our nursery</span>
                </li>
              </ul>
              <a
                href="https://www.gertens.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-gertens-blue px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                Visit Gertens.com
              </a>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gertens-blue hover:text-blue-700 font-semibold"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Your Garden Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
