import { useState } from 'react';
import { useScene } from '../store/SceneContext';
import { ELEMENT_TYPES, ELEMENT_DEFAULTS } from '../utils/elements';

function ElementLibrary() {
  const { addElement } = useScene();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter elements based on search query
  const filteredElements = Object.entries(ELEMENT_TYPES).filter(([key, type]) => {
    const elementInfo = ELEMENT_DEFAULTS[type];
    return elementInfo.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-4 border-b border-gray-700 flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Element Library</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search elements..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Scrollable Element Grid - Height for ~3 rows (2 items per row) */}
      <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
        <div className="grid grid-cols-2 gap-2">
          {filteredElements.length > 0 ? (
            filteredElements.map(([key, type]) => {
              const elementInfo = ELEMENT_DEFAULTS[type];
              return (
                <button
                  key={type}
                  onClick={() => addElement(type)}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded text-center transition-colors"
                  title={`Add ${elementInfo.name}`}
                >
                  <div className="text-2xl mb-1">{elementInfo.icon}</div>
                  <div className="text-xs">{elementInfo.name}</div>
                </button>
              );
            })
          ) : (
            <div className="col-span-2 text-center text-gray-500 text-sm py-4">
              No elements found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ElementLibrary;
