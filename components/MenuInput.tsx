import React from 'react';

interface MenuInputProps {
    value: string;
    onChange: (value: string) => void;
}

const placeholderText = `Example Menu:

Margherita Pizza
Classic pizza with fresh mozzarella, San Marzano tomatoes, fresh basil, salt, and extra-virgin olive oil.

Spaghetti Carbonara
Pasta with egg, hard cheese, cured pork, and black pepper. A Roman classic.

Tiramisu
A coffee-flavoured Italian dessert. Ladyfingers dipped in coffee, layered with a whipped mixture of eggs, sugar, and mascarpone cheese.`;

const MenuInput: React.FC<MenuInputProps> = ({ value, onChange }) => {
    return (
        <div>
            <label htmlFor="menu-input" className="block text-sm font-medium text-gray-300 mb-2">
                1. Paste Your Menu
            </label>
            <textarea
                id="menu-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholderText}
                rows={10}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-200 placeholder-gray-500"
            />
        </div>
    );
};

export default MenuInput;
