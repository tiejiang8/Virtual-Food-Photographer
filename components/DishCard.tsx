import React from 'react';
import { Dish } from '../types';
import { EditIcon, ErrorIcon } from './icons';

interface DishCardProps {
    dish: Dish;
    onEdit: () => void;
}

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse">
        <div className="bg-gray-700 h-48 w-full"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
    </div>
);

const DishCard: React.FC<DishCardProps> = ({ dish, onEdit }) => {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-indigo-500/20">
            {dish.isGenerating ? (
                <SkeletonLoader />
            ) : dish.imageUrl ? (
                <div className="relative group">
                    <img src={dish.imageUrl} alt={dish.name} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                            onClick={onEdit}
                            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                        >
                            <EditIcon className="h-5 w-5" />
                            <span>Edit Image</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full h-48 bg-gray-700 flex flex-col items-center justify-center text-gray-500">
                    <ErrorIcon className="h-12 w-12 mb-2" />
                    <span className="text-sm">Image generation failed</span>
                </div>
            )}
            <div className="p-4">
                <h3 className="text-lg font-bold text-white">{dish.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{dish.description}</p>
            </div>
        </div>
    );
};

export default DishCard;
