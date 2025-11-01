import React, { useState } from 'react';
import { Dish } from '../types';
import { CloseIcon } from './icons';

interface ImageEditorModalProps {
    dish: Dish;
    onClose: () => void;
    onApplyEdit: (dish: Dish, prompt: string) => Promise<void>;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ dish, onClose, onApplyEdit }) => {
    const [prompt, setPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsEditing(true);
        await onApplyEdit(dish, prompt);
        setIsEditing(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 relative">
                    <h2 className="text-2xl font-bold text-white">Edit "{dish.name}"</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="px-6 pb-6">
                    <img src={dish.imageUrl!} alt={`Editing ${dish.name}`} className="w-full rounded-lg mb-4" />

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                            Describe your change
                        </label>
                        <input
                            type="text"
                            id="edit-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Add a sprinkle of parsley' or 'Make it look more rustic'"
                            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        />
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!prompt.trim() || isEditing}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center"
                            >
                                {isEditing && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isEditing ? 'Applying...' : 'Apply Edit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorModal;
