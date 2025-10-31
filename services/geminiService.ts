import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gemini API client.
// The API key is sourced from environment variables for security.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates images using the Gemini API based on a text prompt and aspect ratio.
 * @param prompt - The text description of the image to generate.
 * @param aspectRatio - The desired aspect ratio for the image.
 * @returns A promise that resolves to an array of base64 data URLs of the generated images.
 */
export const generateImages = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4"): Promise<string[]> => {
  try {
    // Enhance the prompt to prevent the model from adding text, logos, or watermarks.
    const enhancedPrompt = `${prompt}, no text, no logos, no watermarks`;

    // Call the Gemini API to generate 4 images
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001', // High-quality image generation model
      prompt: enhancedPrompt,
      config: {
        numberOfImages: 4, // Generate 4 different images
        outputMimeType: 'image/png', // Request PNG format
        aspectRatio: aspectRatio,
      },
    });

    // Check if the response contains generated images
    if (response.generatedImages && response.generatedImages.length > 0) {
      // Map over the generated images and format them as data URLs
      return response.generatedImages.map(image => `data:image/png;base64,${image.image.imageBytes}`);
    } else {
      // Throw an error if no images were returned
      throw new Error("API returned no images.");
    }
  } catch (error) {
    // Log the error and re-throw a more user-friendly message
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the Gemini API.");
  }
};