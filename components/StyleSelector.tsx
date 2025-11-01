import React from 'react';
import { ImageStyle } from '../types';

interface StyleSelectorProps {
    selectedStyle: ImageStyle;
    onStyleChange: (style: ImageStyle) => void;
}

const styles = [
    { id: ImageStyle.MODERN, label: 'Bright & Modern' },
    { id: ImageStyle.RUSTIC, label: 'Rustic & Dark' },
    { id: ImageStyle.SOCIAL, label: 'Social Media' },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                2. Select a Photo Style
            </label>
            <div className="grid grid-cols-3 gap-2">
                {styles.map(style => (
                    <button
                        key={style.id}
                        onClick={() => onStyleChange(style.id)}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                            selectedStyle === style.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                    >
                        {style.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StyleSelector;
