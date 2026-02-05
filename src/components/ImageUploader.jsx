import React, { useRef, useState } from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setPreviewUrl(imageData);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (previewUrl) {
      onImageUpload(previewUrl);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gertens-blue mb-2">
        Upload Your Garden Space
      </h2>
      <p className="text-gray-600 mb-8">
        Take a photo or upload an image of the area you'd like to transform
      </p>

      {!previewUrl ? (
        <>
          <div
            className={`border-4 border-dashed rounded-xl p-12 transition-all ${
              dragActive
                ? 'border-gertens-blue bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-6">
              {/* Camera Icon */}
              <div className="flex justify-center">
                <svg
                  className="w-24 h-24 text-gertens-blue camera-icon-style"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-lg text-gray-700 mb-4">
                  Drag and drop your photo here, or
                </p>
                <button
                  onClick={handleButtonClick}
                  className="btn-primary"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Choose File
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
                capture="environment"
              />

              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, HEIC • Max size: 10MB
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gertens-blue mb-2">💡 Tips for Best Results</h3>
            <ul className="text-sm text-gray-700 space-y-1 text-left max-w-2xl mx-auto">
              <li>• Take the photo during daylight for accurate lighting assessment</li>
              <li>• Include the full area you want to landscape</li>
              <li>• Try to take the photo from a straight-on angle</li>
              <li>• Make sure existing features (house, fence, etc.) are visible</li>
            </ul>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setPreviewUrl(null)}
              className="btn-secondary"
            >
              Choose Different Photo
            </button>
            <button
              onClick={handleContinue}
              className="btn-primary"
            >
              Continue to Outline
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
      )}
    </div>
  );
};

export default ImageUploader;
