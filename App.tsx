import React, { useState, useCallback } from 'react';
import { generateImages } from './services/geminiService';
import type { AspectRatio } from './types';
import AspectRatioSelector from './components/AspectRatioSelector';
import ImageDisplay from './components/ImageDisplay';
import { aspectRatios } from './constants';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(aspectRatios[0]);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    // Basic validation
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    
    // Clear previous state and set loading
    setError(null);
    setImageUrls(null);
    setIsLoading(true);
    setGeneratedPrompt(prompt); // Store the prompt used for this generation

    try {
      // Call the service to generate the images
      const urls = await generateImages(prompt, aspectRatio.value);
      setImageUrls(urls);
    } catch (err) {
      // Handle errors from the API call
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  return (
    <div className="min-h-screen bg-gray-900 text-slate-200 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            SEO Sentries AI Image Generator
          </h1>
          <p className="text-slate-400 mt-2">Generate stunning visuals for your SEO campaigns and content.</p>
        </header>
        
        <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-slate-700">
          
          <div className="flex flex-col gap-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe any image you want..."
              className="w-full h-28 p-4 bg-slate-700/50 rounded-lg border-2 border-slate-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-colors duration-300 resize-none placeholder-slate-400"
              disabled={isLoading}
            />
            
            <AspectRatioSelector
              selected={aspectRatio}
              onSelect={setAspectRatio}
              disabled={isLoading}
            />

            <button
              onClick={handleGenerateImage}
              disabled={isLoading}
              className="w-full py-3 px-6 text-lg font-semibold rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Generating...' : 'Generate 4 Images'}
            </button>
          </div>

        </div>

        {error && (
          <div className="mt-6 text-center text-red-400 bg-red-900/50 border border-red-700 rounded-lg p-3 w-full max-w-2xl">
            {error}
          </div>
        )}

        <ImageDisplay
          imageUrls={imageUrls}
          isLoading={isLoading}
          prompt={generatedPrompt}
        />

      </main>
    </div>
  );
};

export default App;