
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ImageStyle, Dish } from './types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getStylePrompt = (style: ImageStyle): string => {
    switch (style) {
        case ImageStyle.RUSTIC:
            return 'The style is rustic and dark, with moody, dramatic lighting. The dish is presented on a dark wooden table with vintage cutlery. Emphasize texture and deep colors.';
        case ImageStyle.MODERN:
            return 'The style is bright, modern, and minimalist. The dish is on a clean white plate against a light, airy background. Focus on clean lines and vibrant, natural colors.';
        case ImageStyle.SOCIAL:
            return 'This is a top-down flat lay shot, perfect for social media. The dish is arranged beautifully with colorful garnishes and ingredients scattered around. The lighting is bright and even. Make it look delicious and shareable.';
    }
};

export const parseMenu = async (menuText: string): Promise<Omit<Dish, 'id' | 'imageUrl' | 'isGenerating'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse the following restaurant menu text and extract a list of dishes with their names and descriptions. If a description isn't available, create a short, appetizing one. Menu: \n\n${menuText}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: 'The name of the dish.',
                            },
                            description: {
                                type: Type.STRING,
                                description: 'A brief, appetizing description of the dish.',
                            },
                        },
                        required: ["name", "description"],
                    },
                },
            },
        });
        
        const jsonStr = response.text.trim();
        const parsedDishes = JSON.parse(jsonStr);
        return parsedDishes;
    } catch (error) {
        console.error("Error parsing menu:", error);
        throw new Error("Failed to parse the menu. Please check the format and try again.");
    }
};

export const generateFoodImage = async (dishName: string, dishDescription: string, style: ImageStyle): Promise<{ base64: string, mimeType: string }> => {
    const styleDescription = getStylePrompt(style);
    const prompt = `Generate a photorealistic, high-end food photograph of "${dishName}". The dish is described as: "${dishDescription}". ${styleDescription} The image should look incredibly appetizing and be of professional quality.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '4:3',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return { base64: base64ImageBytes, mimeType: 'image/jpeg' };
        } else {
            throw new Error("No image generated.");
        }
    } catch (error) {
        console.error(`Error generating image for ${dishName}:`, error);
        throw new Error(`Failed to generate an image for ${dishName}.`);
    }
};

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<{ base64: string, mimeType: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        // FIX: Find the image part in the response, as the order of parts is not guaranteed.
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return { base64: imagePart.inlineData.data, mimeType: imagePart.inlineData.mimeType };
        } else {
            throw new Error("No edited image returned from API.");
        }
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit the image.");
    }
};
