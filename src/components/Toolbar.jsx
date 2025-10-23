import { useScene } from '../store/SceneContext';

function Toolbar() {
  const {
    selectedElement,
    elements,
    updateElement,
    deleteElement,
    duplicateElement,
    gridSize,
    setGridSize,
    cameraSettings,
    setCameraSettings,
    viewMode,
    clearScene,
    toolMode,
    setToolMode,
    snapToGrid,
    setSnapToGrid,
  } = useScene();

  const selected = elements.find((el) => el.id === selectedElement);

  const handlePositionChange = (axis, value) => {
    if (selected) {
      updateElement(selected.id, {
        position: { ...selected.position, [axis]: parseFloat(value) },
      });
    }
  };

  const handleRotationChange = (axis, value) => {
    if (selected) {
      updateElement(selected.id, {
        rotation: { ...selected.rotation, [axis]: parseFloat(value) },
      });
    }
  };

  const handleScaleChange = (axis, value) => {
    if (selected) {
      updateElement(selected.id, {
        scale: { ...selected.scale, [axis]: parseFloat(value) },
      });
    }
  };

  const handleColorChange = (color) => {
    if (selected) {
      updateElement(selected.id, { color });
    }
  };

  const handleFlipX = () => {
    if (selected) {
      updateElement(selected.id, {
        scale: { ...selected.scale, x: -selected.scale.x },
      });
    }
  };

  const handleFlipZ = () => {
    if (selected) {
      updateElement(selected.id, {
        scale: { ...selected.scale, z: -selected.scale.z },
      });
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {/* Tool Mode (2D mode only) */}
      {viewMode === '2d' && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Tools</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => setToolMode('select')}
              className={`px-2 py-2 rounded text-xs ${
                toolMode === 'select'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Select
            </button>
            <button
              onClick={() => setToolMode('wall')}
              className={`px-2 py-2 rounded text-xs ${
                toolMode === 'wall'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Wall
            </button>
            <button
              onClick={() => setToolMode('scale')}
              className={`px-2 py-2 rounded text-xs ${
                toolMode === 'scale'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Scale
            </button>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Snap to Grid</span>
            </label>
          </div>
        </div>
      )}

      {/* Grid Settings (2D mode only) */}
      {viewMode === '2d' && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Grid Settings</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400">Width</label>
              <input
                type="number"
                value={gridSize.width}
                onChange={(e) =>
                  setGridSize({ ...gridSize, width: parseInt(e.target.value) })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                min="5"
                max="100"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Depth</label>
              <input
                type="number"
                value={gridSize.depth}
                onChange={(e) =>
                  setGridSize({ ...gridSize, depth: parseInt(e.target.value) })
                }
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                min="5"
                max="100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Camera Settings (3D mode only) */}
      {viewMode === '3d' && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Camera Settings</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400">
                Focal Length (FOV: {cameraSettings.fov}°)
              </label>
              <input
                type="range"
                value={cameraSettings.fov}
                onChange={(e) =>
                  setCameraSettings({
                    ...cameraSettings,
                    fov: parseInt(e.target.value),
                  })
                }
                className="w-full"
                min="20"
                max="120"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cameraSettings.wireframe}
                  onChange={(e) =>
                    setCameraSettings({
                      ...cameraSettings,
                      wireframe: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">Wireframe Mode</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Element Controls */}
      {selected ? (
        <div>
          <h3 className="font-semibold mb-2">Edit Element</h3>

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
            <button
              onClick={handleFlipX}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Flip X
            </button>
            <button
              onClick={handleFlipZ}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Flip Z
            </button>
          </div>

          {/* Position */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-1">Position</label>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">X:</span>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.x.toFixed(1)}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">Y:</span>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.y.toFixed(1)}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">Z:</span>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.z.toFixed(1)}
                  onChange={(e) => handlePositionChange('z', e.target.value)}
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rotation */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-1">
              Rotation (degrees)
            </label>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">X:</span>
                <input
                  type="number"
                  step="15"
                  value={Math.round((selected.rotation.x * 180) / Math.PI)}
                  onChange={(e) =>
                    handleRotationChange('x', (e.target.value * Math.PI) / 180)
                  }
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">Y:</span>
                <input
                  type="number"
                  step="15"
                  value={Math.round((selected.rotation.y * 180) / Math.PI)}
                  onChange={(e) =>
                    handleRotationChange('y', (e.target.value * Math.PI) / 180)
                  }
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">Z:</span>
                <input
                  type="number"
                  step="15"
                  value={Math.round((selected.rotation.z * 180) / Math.PI)}
                  onChange={(e) =>
                    handleRotationChange('z', (e.target.value * Math.PI) / 180)
                  }
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Scale */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-1">Scale</label>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">X:</span>
                <input
                  type="number"
                  step="0.1"
                  value={Math.abs(selected.scale.x).toFixed(1)}
                  onChange={(e) =>
                    handleScaleChange(
                      'x',
                      parseFloat(e.target.value) * Math.sign(selected.scale.x)
                    )
                  }
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                  min="0.1"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">Y:</span>
                <input
                  type="number"
                  step="0.1"
                  value={Math.abs(selected.scale.y).toFixed(1)}
                  onChange={(e) =>
                    handleScaleChange(
                      'y',
                      parseFloat(e.target.value) * Math.sign(selected.scale.y)
                    )
                  }
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                  min="0.1"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-4">Z:</span>
                <input
                  type="number"
                  step="0.1"
                  value={Math.abs(selected.scale.z).toFixed(1)}
                  onChange={(e) =>
                    handleScaleChange(
                      'z',
                      parseFloat(e.target.value) * Math.sign(selected.scale.z)
                    )
                  }
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                  min="0.1"
                />
              </div>
            </div>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-1">Color</label>
            <input
              type="color"
              value={selected.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 bg-gray-700 rounded cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Select an element to edit its properties
        </div>
      )}

      {/* Clear Scene */}
      <button
        onClick={clearScene}
        className="w-full mt-4 px-3 py-2 bg-red-900 hover:bg-red-800 rounded text-sm"
      >
        Clear Scene
      </button>
    </div>
  );
}

export default Toolbar;
