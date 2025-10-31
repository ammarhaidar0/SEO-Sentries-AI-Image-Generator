import React from 'react';
import Spinner from './Spinner';

interface ImageDisplayProps {
  imageUrls: string[] | null;
  isLoading: boolean;
  prompt: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrls, isLoading, prompt }) => {
  /**
   * Handles the download of a specific generated image.
   * Creates a temporary anchor element to trigger the browser's download functionality.
   * @param url - The base64 data URL of the image to download.
   * @param index - The index of the image, used for the filename.
   */
  const handleDownload = (url: string, index: number) => {
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    
    // Sanitize the prompt to create a valid and descriptive filename
    const fileName = prompt
      .toLowerCase()
      .slice(0, 40) // Limit length
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_') || 'generated_image';
      
    link.download = `${fileName}_${index + 1}.png`;
    
    // Append, click, and remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 rounded-lg">
          <Spinner />
          <p className="mt-4 text-slate-400">Generating four unique styles...</p>
        </div>
      );
    }

    if (imageUrls && imageUrls.length > 0) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
              <img 
                src={url} 
                alt={`${prompt} - variation ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleDownload(url, index)}
                  aria-label={`Download image variation ${index + 1}`}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Placeholder content
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2">Four generated images will appear here</p>
      </div>
    );
  };

  return (
    <div className="mt-8 w-full max-w-2xl">
      <div className="relative w-full aspect-square bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-600 p-4 transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
};

export default ImageDisplay;