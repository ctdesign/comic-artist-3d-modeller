import { useScene } from '../store/SceneContext';

function Toolbar() {
  const {
    gridSize,
    setGridSize,
    cameraSettings,
    setCameraSettings,
    sceneColors,
    setSceneColors,
    viewMode,
    toolMode,
    setToolMode,
    snapToGrid,
    setSnapToGrid,
  } = useScene();

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {/* Grid Settings (2D mode only) */}
      {viewMode === '2d' && (
        <div className="mb-6 pb-6 border-b border-gray-700">
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
        <div className="mb-6 pb-6 border-b border-gray-700">
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
              <label className="text-xs text-gray-400">
                Movement Speed: {cameraSettings.speed || 0.1}
              </label>
              <input
                type="range"
                value={cameraSettings.speed || 0.1}
                onChange={(e) =>
                  setCameraSettings({
                    ...cameraSettings,
                    speed: parseFloat(e.target.value),
                  })
                }
                className="w-full"
                min="0.05"
                max="0.5"
                step="0.05"
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

      {/* Scene Colors */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Scene Colors</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-400">Floor Color</label>
            <input
              type="color"
              value={sceneColors.floor}
              onChange={(e) =>
                setSceneColors({ ...sceneColors, floor: e.target.value })
              }
              className="w-full h-10 bg-gray-700 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Sky Color</label>
            <input
              type="color"
              value={sceneColors.sky}
              onChange={(e) =>
                setSceneColors({ ...sceneColors, sky: e.target.value })
              }
              className="w-full h-10 bg-gray-700 rounded cursor-pointer"
            />
          </div>
          {viewMode === '2d' && (
            <div>
              <label className="text-xs text-gray-400">Grid Color</label>
              <input
                type="color"
                value={sceneColors.grid}
                onChange={(e) =>
                  setSceneColors({ ...sceneColors, grid: e.target.value })
                }
                className="w-full h-10 bg-gray-700 rounded cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
