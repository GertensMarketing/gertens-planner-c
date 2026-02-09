import { useState, useRef, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import GardenOutlineTool from './components/GardenOutlineTool';
import QuestionFlow from './components/QuestionFlow';
import GardenPlanResult from './components/GardenPlanResult';
import Header from './components/Header';

function App() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Outline, 3: Questions, 4: Result
  const [uploadedImage, setUploadedImage] = useState(null);
  const [outlinePoints, setOutlinePoints] = useState([]);
  const [answers, setAnswers] = useState({
    sunExposure: '',
    theme: ''
  });
  const [gardenPlan, setGardenPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDiagram, setLoadingDiagram] = useState(false);

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setStep(2);
  };

  const handleOutlineComplete = (points) => {
    setOutlinePoints(points);
    setStep(3);
  };

  const handleQuestionsComplete = (userAnswers) => {
    setAnswers(userAnswers);
    generateGardenPlan(userAnswers);
  };

  const generateGardenPlan = async (userAnswers) => {
    setLoading(true);
    setStep(4);

    try {
      // Step 1: Get plant recommendations (fast - ~20 seconds)
      const response = await fetch('/.netlify/functions/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: uploadedImage,
          outlinePoints: outlinePoints,
          sunExposure: userAnswers.sunExposure,
          theme: userAnswers.theme
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate garden plan');
      }

      const data = await response.json();
      
      // Set initial plan without diagram
      setGardenPlan({
        ...data,
        visualizations: { birdEye: null }
      });
      
      setLoading(false);
      
      // Step 2: Generate bird's eye diagram (async, in background)
      if (data.recommendation && data.recommendation.plants) {
        generateDiagram(data.recommendation.plants);
      }

    } catch (error) {
      console.error('Error generating garden plan:', error);
      setGardenPlan({
        error: 'Failed to generate garden plan. Please try again.',
        recommendation: null
      });
      setLoading(false);
    }
  };

  const generateDiagram = async (plants) => {
    setLoadingDiagram(true);
    
    try {
      const response = await fetch('/.netlify/functions/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outlinePoints: outlinePoints,
          plants: plants
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update garden plan with diagram
        setGardenPlan(prev => ({
          ...prev,
          visualizations: {
            ...prev.visualizations,
            birdEye: data.diagram,
            type: 'svg'
          }
        }));
      }
    } catch (error) {
      console.error('Error generating diagram:', error);
    } finally {
      setLoadingDiagram(false);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setUploadedImage(null);
    setOutlinePoints([]);
    setAnswers({ sunExposure: '', theme: '' });
    setGardenPlan(null);
    setLoading(false);
    setLoadingDiagram(false);
  };

  return (
    <div className="min-h-screen bg-blueprint-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= stepNum
                      ? 'bg-gertens-blue text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      step > stepNum ? 'bg-gertens-blue' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-8 mt-3">
            <span className={`text-sm ${step >= 1 ? 'text-gertens-blue font-semibold' : 'text-gray-500'}`}>
              Upload Photo
            </span>
            <span className={`text-sm ${step >= 2 ? 'text-gertens-blue font-semibold' : 'text-gray-500'}`}>
              Outline Area
            </span>
            <span className={`text-sm ${step >= 3 ? 'text-gertens-blue font-semibold' : 'text-gray-500'}`}>
              Answer Questions
            </span>
            <span className={`text-sm ${step >= 4 ? 'text-gertens-blue font-semibold' : 'text-gray-500'}`}>
              Your Plan
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          {step === 1 && (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}

          {step === 2 && uploadedImage && (
            <GardenOutlineTool
              image={uploadedImage}
              onComplete={handleOutlineComplete}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <QuestionFlow
              onComplete={handleQuestionsComplete}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <GardenPlanResult
              gardenPlan={gardenPlan}
              loading={loading}
              loadingDiagram={loadingDiagram}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Powered by AI • Designed for Gertens Garden Center
          </p>
          <p className="mt-2">
            All plant recommendations are guaranteed to thrive in Minnesota's climate
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
