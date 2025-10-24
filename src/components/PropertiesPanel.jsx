import { useState } from 'react';
import { useScene } from '../store/SceneContext';
import { ELEMENT_DEFAULTS } from '../utils/elements';

// Common comic book panel ratios
const PANEL_RATIOS = [
  { name: 'Square', ratio: '1:1', width: 1, height: 1 },
  { name: 'Landscape 3:2', ratio: '3:2', width: 3, height: 2 },
  { name: 'Landscape 16:9', ratio: '16:9', width: 16, height: 9 },
  { name: 'Landscape 2:1', ratio: '2:1', width: 2, height: 1 },
  { name: 'Portrait 2:3', ratio: '2:3', width: 2, height: 3 },
  { name: 'Portrait 3:4', ratio: '3:4', width: 3, height: 4 },
  { name: 'Portrait 9:16', ratio: '9:16', width: 9, height: 16 },
  { name: 'Widescreen 21:9', ratio: '21:9', width: 21, height: 9 },
  { name: 'Vertical Strip 1:3', ratio: '1:3', width: 1, height: 3 },
  { name: 'Horizontal Strip 4:1', ratio: '4:1', width: 4, height: 1 },
];

function PanelWindows() {
  const { panelMask, setPanelMask } = useScene();
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);

  const handlePresetSelect = (preset) => {
    setPanelMask({
      ...panelMask,
      enabled: true,
      width: preset.width,
      height: preset.height,
      isCustom: false,
    });
  };

  const handleCustomApply = () => {
    setPanelMask({
      ...panelMask,
      enabled: true,
      width: customWidth,
      height: customHeight,
      isCustom: true,
    });
  };

  const handleOpacityChange = (e) => {
    setPanelMask({
      ...panelMask,
      opacity: parseFloat(e.target.value),
    });
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {/* Enable/Disable Toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={panelMask.enabled}
            onChange={(e) => setPanelMask({ ...panelMask, enabled: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-semibold">Enable Panel Mask</span>
        </label>
      </div>

      {/* Mask Opacity */}
      <div className="mb-6 pb-6 border-b border-gray-700">
        <h4 className="text-sm font-semibold mb-2">Mask Opacity</h4>
        <div className="space-y-2">
          <label className="text-xs text-gray-400">
            Opacity: {Math.round(panelMask.opacity * 100)}%
          </label>
          <input
            type="range"
            value={panelMask.opacity}
            onChange={handleOpacityChange}
            className="w-full"
            min="0"
            max="1"
            step="0.05"
          />
        </div>
      </div>

      {/* Panel Scale */}
      <div className="mb-6 pb-6 border-b border-gray-700">
        <h4 className="text-sm font-semibold mb-2">Panel Scale</h4>
        <div className="space-y-2">
          <label className="text-xs text-gray-400">
            Scale: {Math.round((panelMask.scale || 1) * 100)}%
          </label>
          <input
            type="range"
            value={panelMask.scale || 1}
            onChange={(e) => setPanelMask({ ...panelMask, scale: parseFloat(e.target.value) })}
            className="w-full"
            min="0.1"
            max="3"
            step="0.1"
          />
        </div>
      </div>

      {/* Preset Ratios */}
      <div className="mb-6 pb-6 border-b border-gray-700">
        <h4 className="text-sm font-semibold mb-3">Preset Ratios</h4>
        <div className="space-y-2">
          {PANEL_RATIOS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className={`w-full px-3 py-2 rounded text-sm text-left transition-colors ${
                panelMask.enabled &&
                !panelMask.isCustom &&
                panelMask.width === preset.width &&
                panelMask.height === preset.height
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs opacity-75">{preset.ratio}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Size */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-3">Custom Size</h4>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-400">Width (px)</label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(parseInt(e.target.value))}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              min="100"
              max="4000"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Height (px)</label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(parseInt(e.target.value))}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              min="100"
              max="4000"
            />
          </div>
          <button
            onClick={handleCustomApply}
            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            Apply Custom Size
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertiesPanel({ viewMode }) {
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
    // Prevent arrow keys from propagating to scene when editing
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.stopPropagation();
    }

    if (e.key === 'Enter') {
      applyEdit();
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  // In 3D view, show Panel Windows instead of properties
  if (viewMode === '3d') {
    return <PanelWindows />;
  }

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

      {/* Dimensions - Read-only calculated values */}
      <div className="mb-4 bg-gray-800 rounded p-3">
        <h4 className="text-sm font-semibold mb-2">Dimensions (read-only)</h4>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-400">Width:</span>
          <span className="text-xs font-mono text-gray-300 px-2 py-1">
            {actualWidth.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-400">Height:</span>
          <span className="text-xs font-mono text-gray-300 px-2 py-1">
            {actualHeight.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-400">Depth:</span>
          <span className="text-xs font-mono text-gray-300 px-2 py-1">
            {actualDepth.toFixed(2)}
          </span>
        </div>
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
