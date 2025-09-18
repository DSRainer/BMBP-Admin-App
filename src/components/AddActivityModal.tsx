import React, { useState } from 'react';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activityName, setActivityName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activityName.trim()) {
      onSave(activityName);
      setActivityName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-md w-full transform transition-all duration-300 animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Activity</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-4xl font-light leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 mb-2">Activity Name</label>
            <input
              type="text"
              id="activityName"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              placeholder="e.g., Kayaking, Hiking, Cooking Class"
              required
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
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
