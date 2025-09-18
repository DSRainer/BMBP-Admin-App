import React, { useState } from 'react';

interface AddThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

const AddThemeModal: React.FC<AddThemeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [themeName, setThemeName] = useState('');
  const [themeColor, setThemeColor] = useState('#000000'); // Default color

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (themeName.trim()) {
      onSave(themeName, themeColor);
      setThemeName('');
      setThemeColor('#000000');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-md w-full transform transition-all duration-300 animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Theme</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-4xl font-light leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="themeName" className="block text-sm font-medium text-gray-700 mb-2">Theme Name</label>
            <input
              type="text"
              id="themeName"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              placeholder="e.g., Adventure, Relax, Romantic"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
            <input
              type="color"
              id="themeColor"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              title="Choose your color"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold mr-4 hover:bg-gray-100 transition duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 ease-in-out shadow-md"
            >
              Add Theme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddThemeModal;
