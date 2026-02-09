import React, { useState } from 'react';

const GardenPlanResult = ({ gardenPlan, loading, loadingWatercolor, onStartOver }) => {
  const [activeTab, setActiveTab] = useState('plants');

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-gertens-blue"></div>
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-gertens-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gertens-blue mb-2">
              Creating Your Custom Garden Plan
            </h3>
            <p className="text-gray-600">
              Our AI is analyzing your space and selecting perfect plants...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (gardenPlan?.error) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{gardenPlan.error}</p>
        <button onClick={onStartOver} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const hasWatercolor = gardenPlan?.visualizations?.watercolor;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gertens-blue mb-2">
          Your Custom Garden Plan is Ready!
        </h2>
        <p className="text-gray-600">
          Personalized plant recommendations for your Minnesota garden
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('plants')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'plants'
                ? 'text-gertens-blue border-b-2 border-gertens-blue'
                : 'text-gray-600 hover:text-gertens-blue'
            }`}
          >
            🌱 Plant List
          </button>
          <button
            onClick={() => setActiveTab('watercolor')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'watercolor'
                ? 'text-gertens-blue border-b-2 border-gertens-blue'
                : 'text-gray-600 hover:text-gertens-blue'
            }`}
          >
            🎨 Watercolor View
            {loadingWatercolor && (
              <span className="ml-2 inline-block w-4 h-4 border-2 border-gertens-blue border-t-transparent rounded-full animate-spin"></span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {activeTab === 'plants' && gardenPlan?.recommendation && (
          <div className="space-y-6">
            {/* Overview */}
            {gardenPlan.recommendation.overview && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  🌿 Garden Overview
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {gardenPlan.recommendation.overview}
                </p>
              </div>
            )}

            {/* Plant Recommendations */}
            {gardenPlan.recommendation.plants && gardenPlan.recommendation.plants.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🌱 Recommended Plants
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gardenPlan.recommendation.plants.map((plant, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-gertens-blue mb-1 flex-1">
                          {plant.name}
                        </h4>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gertens-blue text-white text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                      </div>
                      {plant.type && (
                        <p className="text-sm text-gray-500 mb-2 capitalize">
                          {plant.type}
                        </p>
                      )}
                      {plant.description && (
                        <p className="text-sm text-gray-700 mb-2">
                          {plant.description}
                        </p>
                      )}
                      {plant.placement && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Placement:</span> {plant.placement}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout */}
            {gardenPlan.recommendation.layout && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  📐 Layout Design
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {gardenPlan.recommendation.layout}
                </p>
              </div>
            )}

            {/* Planting Tips */}
            {gardenPlan.recommendation.tips && gardenPlan.recommendation.tips.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gertens-blue mb-3">
                  💡 Planting Tips
                </h3>
                <ul className="space-y-2">
                  {gardenPlan.recommendation.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'watercolor' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🎨 Watercolor Garden Rendering
            </h3>
            {loadingWatercolor && !hasWatercolor ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gertens-blue mx-auto mb-4"></div>
                <p className="text-gray-600">Creating your watercolor illustration...</p>
                <p className="text-sm text-gray-500 mt-2">This may take 15-30 seconds</p>
              </div>
            ) : hasWatercolor ? (
              <div>
                <p className="text-gray-600 mb-6">
                  An artistic watercolor illustration showing how your garden will look in full bloom!
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <img
                    src={`data:image/jpeg;base64,${gardenPlan.visualizations.watercolor}`}
                    alt="Watercolor garden rendering"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Artistic Interpretation:</strong> This watercolor painting shows your garden in peak bloom with all recommended plants. Actual results will vary based on planting, care, and growing conditions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">Watercolor rendering will appear here once generated</p>
                <p className="text-sm text-gray-500">Click this tab after your plan loads to see the watercolor view</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gertens-blue to-blue-600 rounded-xl p-8 text-white mb-6">
        <h3 className="text-2xl font-bold mb-3">
          Ready to Bring Your Garden to Life?
        </h3>
        <p className="mb-4 text-blue-100">
          Visit Gertens Garden Center to find all these plants and get expert advice from our nursery professionals!
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.gertens.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gertens-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Visit Gertens.com
          </a>
          <button
            onClick={() => window.print()}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            Print This Plan
          </button>
        </div>
      </div>

      {/* Start Over */}
      <div className="text-center">
        <button
          onClick={onStartOver}
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Plan Another Garden
        </button>
      </div>
    </div>
  );
};

export default GardenPlanResult;
