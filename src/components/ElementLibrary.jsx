import { useScene } from '../store/SceneContext';
import { ELEMENT_TYPES, ELEMENT_DEFAULTS } from '../utils/elements';

function ElementLibrary() {
  const { addElement } = useScene();

  return (
    <div className="p-4 border-b border-gray-700">
      <h2 className="text-lg font-semibold mb-3">Element Library</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(ELEMENT_TYPES).map(([key, type]) => {
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
        })}
      </div>
    </div>
  );
}

export default ElementLibrary;
