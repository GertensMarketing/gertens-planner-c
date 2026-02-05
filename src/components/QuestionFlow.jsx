import React, { useState } from 'react';

const QuestionFlow = ({ onComplete, onBack }) => {
  const [sunExposure, setSunExposure] = useState('');
  const [theme, setTheme] = useState('');

  const sunExposureOptions = [
    {
      value: 'full-sun',
      label: 'Full Sun',
      description: '6+ hours of direct sunlight per day',
      icon: '☀️'
    },
    {
      value: 'partial-sun',
      label: 'Partial Sun',
      description: '3-6 hours of direct sunlight per day',
      icon: '⛅'
    },
    {
      value: 'mostly-shade',
      label: 'Mostly Shade',
      description: 'Less than 3 hours of direct sunlight per day',
      icon: '🌥️'
    }
  ];

  const themeOptions = [
    {
      value: 'shade-loving',
      label: 'Shade Loving',
      description: 'Lush foliage plants that thrive in low light',
      icon: '🌿'
    },
    {
      value: 'fun-in-sun',
      label: 'Fun in the Sun',
      description: 'Vibrant sun-loving flowers and plants',
      icon: '🌻'
    },
    {
      value: 'colors-galore',
      label: 'Colors Galore',
      description: 'A rainbow of colorful blooms throughout the season',
      icon: '🌈'
    },
    {
      value: 'white-moonlight',
      label: 'White Moonlight Garden',
      description: 'Elegant white flowering perennials',
      icon: '🌙'
    },
    {
      value: 'minnesota-native',
      label: 'Minnesota Native Garden',
      description: 'Native plants that support local ecosystems',
      icon: '🦋'
    }
  ];

  const handleSubmit = () => {
    if (sunExposure && theme) {
      onComplete({ sunExposure, theme });
    } else {
      alert('Please answer all questions before continuing');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gertens-blue mb-2">
          Tell Us About Your Garden
        </h2>
        <p className="text-gray-600">
          Answer a few questions to get personalized plant recommendations
        </p>
      </div>

      {/* Sun Exposure Question */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-800 mb-4">
          1. What is the sun exposure in this area?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sunExposureOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSunExposure(option.value)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                sunExposure === option.value
                  ? 'border-gertens-blue bg-blue-50 shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white hover:border-gertens-light-blue hover:shadow-md'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-semibold text-gray-900 mb-1">
                {option.label}
              </div>
              <div className="text-sm text-gray-600">
                {option.description}
              </div>
              {sunExposure === option.value && (
                <div className="mt-2 text-gertens-blue">
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 font-semibold">Selected</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Question */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-800 mb-4">
          2. Choose your garden theme
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                theme === option.value
                  ? 'border-gertens-blue bg-blue-50 shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white hover:border-gertens-light-blue hover:shadow-md'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-semibold text-gray-900 mb-1">
                {option.label}
              </div>
              <div className="text-sm text-gray-600">
                {option.description}
              </div>
              {theme === option.value && (
                <div className="mt-2 text-gertens-blue">
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 font-semibold">Selected</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">🌱 Coming Soon: Even More Customization!</p>
            <p>We're working on adding plant inventory integration and more garden themes. All recommendations will be from plants available at Gertens and guaranteed to thrive in Minnesota!</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          <svg
            className="w-5 h-5 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Outline
        </button>

        <button
          onClick={handleSubmit}
          disabled={!sunExposure || !theme}
          className={`btn-primary ${
            !sunExposure || !theme ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Generate My Garden Plan
          <svg
            className="w-5 h-5 inline-block ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuestionFlow;
