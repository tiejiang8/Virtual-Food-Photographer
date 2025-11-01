
import React, { useState, useCallback } from 'react';
import { Dish, ImageStyle } from './types';
import { parseMenu, generateFoodImage, editImage } from './services/geminiService';
import MenuInput from './components/MenuInput';
import StyleSelector from './components/StyleSelector';
import DishCard from './components/DishCard';
import ImageEditorModal from './components/ImageEditorModal';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
    const [menuText, setMenuText] = useState('');
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [imageStyle, setImageStyle] = useState<ImageStyle>(ImageStyle.MODERN);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);

    const handleParseAndGenerate = useCallback(async () => {
        if (!menuText.trim()) {
            setError("Please enter a menu.");
            return;
        }
        setError(null);
        setIsParsing(true);
        setDishes([]);

        try {
            const parsedDishes = await parseMenu(menuText);
            // FIX: Spread the parsed dish properties (name, description) into the new dish object.
            const initialDishes: Dish[] = parsedDishes.map(d => ({
                ...d,
                id: crypto.randomUUID(),
                imageUrl: null,
                isGenerating: true,
            }));
            setDishes(initialDishes);
            setIsParsing(false);

            await Promise.all(initialDishes.map(async (dish) => {
                try {
                    const { base64, mimeType } = await generateFoodImage(dish.name, dish.description, imageStyle);
                    setDishes(prevDishes =>
                        prevDishes.map(d =>
                            d.id === dish.id ? { ...d, imageUrl: `data:${mimeType};base64,${base64}`, mimeType, isGenerating: false } : d
                        )
                    );
                } catch (e) {
                    console.error(`Failed to generate image for ${dish.name}:`, e);
                    setDishes(prevDishes =>
                        prevDishes.map(d =>
                            d.id === dish.id ? { ...d, isGenerating: false } : d
                        )
                    );
                }
            }));

        } catch (err) {
            setError((err as Error).message);
            setIsParsing(false);
        }
    }, [menuText, imageStyle]);

    const handleApplyEdit = async (dishToEdit: Dish, editPrompt: string) => {
        if (!dishToEdit.imageUrl || !dishToEdit.mimeType) return;
        
        const base64Data = dishToEdit.imageUrl.split(',')[1];

        try {
            const { base64: newBase64, mimeType: newMimeType } = await editImage(base64Data, dishToEdit.mimeType, editPrompt);
            setDishes(prevDishes =>
                prevDishes.map(d =>
                    d.id === dishToEdit.id
                        ? { ...d, imageUrl: `data:${newMimeType};base64,${newBase64}`, mimeType: newMimeType }
                        : d
                )
            );
            setEditingDish(null);
        } catch (err) {
            setError(`Failed to apply edit: ${(err as Error).message}`);
            // Optionally, close the modal or show error within it
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <LogoIcon className="h-8 w-8 text-indigo-400" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">Virtual Food Photographer</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                        Turn Your Menu Into Masterpieces
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        Paste your menu, select a style, and let AI generate stunning, professional-quality photos for every dish.
                    </p>
                </div>
                
                <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                       <MenuInput value={menuText} onChange={setMenuText} />
                       <StyleSelector selectedStyle={imageStyle} onStyleChange={setImageStyle} />
                       <button
                           onClick={handleParseAndGenerate}
                           disabled={isParsing || dishes.some(d => d.isGenerating)}
                           className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                       >
                           {isParsing ? (
                               <>
                                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                   </svg>
                                   Parsing Menu...
                               </>
                           ) : dishes.some(d => d.isGenerating) ? 'Generating Images...' : 'Generate Photos'}
                       </button>
                    </div>

                    <div className="lg:mt-0 text-sm text-gray-400 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-lg text-white mb-2">How it works:</h3>
                        <ol className="list-decimal list-inside space-y-2">
                            <li><span className="font-semibold text-gray-200">Paste Your Menu:</span> Add your menu items into the text box. Include names and descriptions for best results.</li>
                            <li><span className="font-semibold text-gray-200">Choose a Style:</span> Select a photographic style that matches your brand's aesthetic.</li>
                            <li><span className="font-semibold text-gray-200">Generate:</span> Click the button and watch as AI creates unique images for each dish.</li>
                            <li><span className="font-semibold text-gray-200">Edit & Refine:</span> Not perfect? Click 'Edit' on any image and use text prompts to make adjustments.</li>
                        </ol>
                    </div>
                </div>

                {error && (
                    <div className="mt-8 max-w-4xl mx-auto bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                {dishes.length > 0 && (
                    <div className="mt-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {dishes.map(dish => (
                                <DishCard key={dish.id} dish={dish} onEdit={() => setEditingDish(dish)} />
                            ))}
                        </div>
                    </div>
                )}

            </main>
            
            {editingDish && (
                <ImageEditorModal
                    dish={editingDish}
                    onClose={() => setEditingDish(null)}
                    onApplyEdit={handleApplyEdit}
                />
            )}
        </div>
    );
};

export default App;
