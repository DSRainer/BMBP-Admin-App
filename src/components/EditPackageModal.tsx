import React, { useState, useEffect } from 'react';
import { Package } from '../data/packages';
import { activities as allActivities } from '../data/activities';
import { themes as allThemes } from '../data/themes';
import { addons as allAddons } from '../data/addons';

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageToEdit: Package | null;
}

const EditPackageModal: React.FC<EditPackageModalProps> = ({ isOpen, onClose, packageToEdit }) => {
  const [packageName, setPackageName] = useState(packageToEdit?.name || '');
  const [packagePrice, setPackagePrice] = useState(packageToEdit?.price || 0);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

  useEffect(() => {
    if (packageToEdit) {
      setPackageName(packageToEdit.name);
      setPackagePrice(packageToEdit.price);
      setSelectedActivities(packageToEdit.activities.map(a => a.id));
      setSelectedThemes(packageToEdit.themes.map(t => t.id));
      setSelectedAddons(packageToEdit.addons.map(a => a.id));
    }
  }, [packageToEdit]);

  if (!isOpen) return null;

  const handleActivityToggle = (activityId: number) => {
    setSelectedActivities(prev =>
      prev.includes(activityId) ? prev.filter(id => id !== activityId) : [...prev, activityId]
    );
  };

  const handleThemeToggle = (themeId: number) => {
    setSelectedThemes(prev =>
      prev.includes(themeId) ? prev.filter(id => id !== themeId) : [...prev, themeId]
    );
  };

  const handleAddonToggle = (addonId: number) => {
    setSelectedAddons(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic here
    console.log({
      id: packageToEdit?.id,
      name: packageName,
      price: packagePrice,
      activities: selectedActivities,
      themes: selectedThemes,
      addons: selectedAddons,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-4xl w-full transform transition-all duration-300 animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Edit Package: {packageToEdit?.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-4xl font-light leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Package Details */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
              <div className="mb-4">
                <label htmlFor="packageName" className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                <input
                  type="text"
                  id="packageName"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
                  placeholder="Enter package name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="packagePrice" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  id="packagePrice"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
                  placeholder="Enter price"
                />
              </div>
            </div>

            {/* Activities */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Activities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                {allActivities.map(activity => (
                  <div
                    key={activity.id}
                    className={`cursor-pointer p-3 border rounded-lg flex items-center transition duration-200 ease-in-out
                      ${selectedActivities.includes(activity.id) ? 'border-indigo-500 bg-indigo-100 ring-2 ring-indigo-500' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                    onClick={() => handleActivityToggle(activity.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedActivities.includes(activity.id)}
                      readOnly
                      className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-800 text-base">{activity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Themes */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Themes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                {allThemes.map(theme => (
                  <div
                    key={theme.id}
                    className={`cursor-pointer p-3 border rounded-lg flex items-center transition duration-200 ease-in-out
                      ${selectedThemes.includes(theme.id) ? 'border-indigo-500 bg-indigo-100 ring-2 ring-indigo-500' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                    onClick={() => handleThemeToggle(theme.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedThemes.includes(theme.id)}
                      readOnly
                      className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-800 text-base">{theme.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Add-ons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                {allAddons.map(addon => (
                  <div
                    key={addon.id}
                    className={`cursor-pointer p-3 border rounded-lg flex items-center transition duration-200 ease-in-out
                      ${selectedAddons.includes(addon.id) ? 'border-indigo-500 bg-indigo-100 ring-2 ring-indigo-500' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                    onClick={() => handleAddonToggle(addon.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.id)}
                      readOnly
                      className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-800 text-base">{addon.name} (${addon.price})</span>
                  </div>
                ))}
              </div>
            </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPackageModal;
