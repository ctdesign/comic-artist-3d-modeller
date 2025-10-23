import { useState } from 'react';
import { useScene } from '../store/SceneContext';
import { ELEMENT_DEFAULTS } from '../utils/elements';

function PropertiesPanel() {
  const {
    selectedElement,
    elements,
    updateElement,
    deleteElement,
    duplicateElement,
  } = useScene();

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const selected = elements.find((el) => el.id === selectedElement);

  const startEdit = (field, value) => {
    setEditingField(field);
    setEditValue(value.toString());
  };

  const applyEdit = () => {
    if (!selected || !editingField) return;

    const value = parseFloat(editValue);
    if (isNaN(value)) {
      setEditingField(null);
      return;
    }

    const [category, axis] = editingField.split('.');

    if (category === 'position' || category === 'scale') {
      updateElement(selected.id, {
        [category]: { ...selected[category], [axis]: value },
      });
    } else if (category === 'rotation') {
      // Convert degrees to radians
      updateElement(selected.id, {
        rotation: { ...selected.rotation, [axis]: (value * Math.PI) / 180 },
      });
    }

    setEditingField(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyEdit();
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  if (!selected) {
    return (
      <div className="flex-1 p-4 text-gray-500 text-sm">
        Select an element to view its properties
      </div>
    );
  }

  const elementInfo = ELEMENT_DEFAULTS[selected.type];
  const size = elementInfo.defaultSize;

  // Calculate actual dimensions
  const actualWidth = size.width * Math.abs(selected.scale.x);
  const actualHeight = size.height * Math.abs(selected.scale.y);
  const actualDepth = size.depth * Math.abs(selected.scale.z);

  const PropertyField = ({ label, value, field, decimals = 1 }) => {
    const isEditing = editingField === field;

    return (
      <div className="flex items-center justify-between py-1">
        <span className="text-xs text-gray-400">{label}:</span>
        {isEditing ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={applyEdit}
            autoFocus
            className="w-20 bg-gray-700 rounded px-2 py-1 text-xs text-right"
            step={field.startsWith('rotation') ? '15' : '0.1'}
          />
        ) : (
          <span
            onClick={() => startEdit(field, value)}
            className="text-xs font-mono cursor-pointer hover:bg-gray-700 px-2 py-1 rounded"
          >
            {typeof value === 'number' ? value.toFixed(decimals) : value}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">{elementInfo.name}</h3>
        <div className="text-xs text-gray-500">ID: {selected.id.toString().slice(0, 8)}...</div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => duplicateElement(selected.id)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Duplicate
        </button>
        <button
          onClick={() => deleteElement(selected.id)}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Delete
        </button>
      </div>

      {/* Dimensions */}
      <div className="mb-4 bg-gray-800 rounded p-3">
        <h4 className="text-sm font-semibold mb-2">Dimensions</h4>
        <PropertyField label="Width" value={actualWidth} field="width" decimals={2} />
        <PropertyField label="Height" value={actualHeight} field="height" decimals={2} />
        <PropertyField label="Depth" value={actualDepth} field="depth" decimals={2} />
      </div>

      {/* Position */}
      <div className="mb-4 bg-gray-800 rounded p-3">
        <h4 className="text-sm font-semibold mb-2">Position</h4>
        <PropertyField label="X" value={selected.position.x} field="position.x" />
        <PropertyField label="Y" value={selected.position.y} field="position.y" />
        <PropertyField label="Z" value={selected.position.z} field="position.z" />
      </div>

      {/* Rotation */}
      <div className="mb-4 bg-gray-800 rounded p-3">
        <h4 className="text-sm font-semibold mb-2">Rotation (degrees)</h4>
        <PropertyField
          label="X"
          value={Math.round((selected.rotation.x * 180) / Math.PI)}
          field="rotation.x"
          decimals={0}
        />
        <PropertyField
          label="Y"
          value={Math.round((selected.rotation.y * 180) / Math.PI)}
          field="rotation.y"
          decimals={0}
        />
        <PropertyField
          label="Z"
          value={Math.round((selected.rotation.z * 180) / Math.PI)}
          field="rotation.z"
          decimals={0}
        />
      </div>

      {/* Scale */}
      <div className="mb-4 bg-gray-800 rounded p-3">
        <h4 className="text-sm font-semibold mb-2">Scale</h4>
        <PropertyField label="X" value={Math.abs(selected.scale.x)} field="scale.x" decimals={2} />
        <PropertyField label="Y" value={Math.abs(selected.scale.y)} field="scale.y" decimals={2} />
        <PropertyField label="Z" value={Math.abs(selected.scale.z)} field="scale.z" decimals={2} />
      </div>

      {/* Appearance */}
      <div className="mb-4 bg-gray-800 rounded p-3">
        <h4 className="text-sm font-semibold mb-2">Appearance</h4>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-400">Color:</span>
          <input
            type="color"
            value={selected.color}
            onChange={(e) => updateElement(selected.id, { color: e.target.value })}
            className="w-20 h-8 bg-gray-700 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-400">Material:</span>
          <select
            value={selected.material || 'solid'}
            onChange={(e) => updateElement(selected.id, { material: e.target.value })}
            className="w-32 bg-gray-700 rounded px-2 py-1 text-xs"
          >
            <option value="solid">Solid</option>
            <option value="reflective">Reflective</option>
            <option value="transparent">Transparent</option>
          </select>
        </div>
      </div>

      {/* Flip Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => updateElement(selected.id, {
            scale: { ...selected.scale, x: -selected.scale.x },
          })}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          Flip X
        </button>
        <button
          onClick={() => updateElement(selected.id, {
            scale: { ...selected.scale, z: -selected.scale.z },
          })}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          Flip Z
        </button>
      </div>
    </div>
  );
}

export default PropertiesPanel;
