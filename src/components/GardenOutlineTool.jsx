import React, { useRef, useEffect, useState } from 'react';

const GardenOutlineTool = ({ image, onComplete, onBack }) => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
      drawCanvas();
    };
    img.src = image;
  }, [image]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [points, imageLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    if (!img || !canvas) return;

    // Set canvas size to match container while maintaining aspect ratio
    const containerWidth = canvas.parentElement.offsetWidth;
    const aspectRatio = img.height / img.width;
    canvas.width = Math.min(containerWidth, 800);
    canvas.height = canvas.width * aspectRatio;

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw outline if points exist
    if (points.length > 0) {
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(30, 64, 175, 0.1)';

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (points.length > 2) {
        ctx.closePath();
        ctx.fill();
      }
      ctx.stroke();

      // Draw points
      points.forEach((point, index) => {
        ctx.fillStyle = '#1e40af';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Draw point number
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, point.x, point.y);
      });
    }

    // Draw crosshair cursor position if drawing
    if (isDrawing && points.length > 0) {
      const lastPoint = points[points.length - 1];
      ctx.strokeStyle = 'rgba(30, 64, 175, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setPoints([...points, { x, y }]);
    setIsDrawing(true);
  };

  const handleUndo = () => {
    if (points.length > 0) {
      setPoints(points.slice(0, -1));
      if (points.length === 1) {
        setIsDrawing(false);
      }
    }
  };

  const handleClear = () => {
    setPoints([]);
    setIsDrawing(false);
  };

  const handleComplete = () => {
    if (points.length >= 3) {
      onComplete(points);
    } else {
      alert('Please mark at least 3 points to outline your garden bed area');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gertens-blue mb-2">
          Outline Your Garden Bed Area
        </h2>
        <p className="text-gray-600">
          Click to place points around the area where you want to plant. 
          This helps us understand the boundaries of your garden space.
        </p>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-gertens-blue mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">How to outline:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click around the perimeter of your garden bed area</li>
              <li>The outline will automatically close when you finish</li>
              <li>Click at least 3 points to define the area</li>
              <li>Use "Undo" if you need to remove the last point</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-inner border-2 border-gray-200">
        <div className="relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="max-w-full mx-auto cursor-crosshair rounded border-2 border-gertens-blue"
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
          {!imageLoaded && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gertens-blue"></div>
            </div>
          )}
        </div>

        {/* Point counter */}
        {points.length > 0 && (
          <div className="mt-3 text-center text-sm text-gray-600">
            <span className="font-semibold text-gertens-blue">{points.length}</span> points marked
            {points.length >= 3 && (
              <span className="ml-2 text-green-600">✓ Ready to continue</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-between">
        <div className="flex gap-3">
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
            Back
          </button>

          <button
            onClick={handleUndo}
            disabled={points.length === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              points.length > 0
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ↶ Undo Last Point
          </button>

          <button
            onClick={handleClear}
            disabled={points.length === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              points.length > 0
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Clear All
          </button>
        </div>

        <button
          onClick={handleComplete}
          disabled={points.length < 3}
          className={`btn-primary ${
            points.length < 3 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Continue to Questions
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GardenOutlineTool;
