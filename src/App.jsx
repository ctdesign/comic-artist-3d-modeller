import { useState } from 'react';
import { SceneProvider, useScene } from './store/SceneContext';
import SceneBuilder2D from './components/SceneBuilder2D';
import SceneView3D from './components/SceneView3D';
import Toolbar from './components/Toolbar';
import ElementLibrary from './components/ElementLibrary';
import PropertiesPanel from './components/PropertiesPanel';

function AppContent() {
  const {
    viewMode,
    setViewMode,
    saveScene,
    loadScene,
    toolMode,
    setToolMode,
    snapToGrid,
    setSnapToGrid,
    clearScene,
  } = useScene();

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          {/* Left side with logo and tools */}
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">Art Assistant</h1>

            {/* 2D Tools */}
            {viewMode === '2d' && (
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setToolMode('select')}
                    className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                      toolMode === 'select'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span>↖</span>
                    <span>Select</span>
                  </button>
                  <button
                    onClick={() => setToolMode('wall')}
                    className={`px-3 py-1.5 rounded text-sm ${
                      toolMode === 'wall'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Wall Builder
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="rounded"
                  />
                  <span>Snap to Grid</span>
                </label>
              </div>
            )}
          </div>

          {/* Right side with view mode and actions */}
          <div className="flex items-center gap-4">
            {/* View Mode Tabs */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('2d')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === '2d'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                2D Builder
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === '3d'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                3D View
              </button>
            </div>

            {/* Save/Load/Clear */}
            <div className="flex gap-2">
              <button
                onClick={saveScene}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Save
              </button>
              <button
                onClick={loadScene}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
              >
                Load
              </button>
              <button
                onClick={clearScene}
                className="px-4 py-2 bg-red-900 hover:bg-red-800 rounded"
              >
                Clear Scene
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Tools and Element Library */}
        {leftPanelOpen && (
          <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
            {/* Element Library only shown in 2D view */}
            {viewMode === '2d' && <ElementLibrary />}
            <Toolbar />
          </aside>
        )}

        {/* Left Panel Toggle Button */}
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-r"
          style={{ left: leftPanelOpen ? '256px' : '0' }}
          title={leftPanelOpen ? 'Hide left panel' : 'Show left panel'}
        >
          {leftPanelOpen ? '◀' : '▶'}
        </button>

        {/* Main View Area */}
        <main className="flex-1 relative">
          {viewMode === '2d' ? <SceneBuilder2D /> : <SceneView3D />}
        </main>

        {/* Right Panel Toggle Button */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-l"
          style={{ right: rightPanelOpen ? '320px' : '0' }}
          title={rightPanelOpen ? 'Hide right panel' : 'Show right panel'}
        >
          {rightPanelOpen ? '▶' : '◀'}
        </button>

        {/* Right Sidebar - Properties Panel or Panel Windows */}
        {rightPanelOpen && (
          <aside className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">
                {viewMode === '2d' ? 'Properties' : 'Panel Windows'}
              </h2>
            </div>
            <PropertiesPanel viewMode={viewMode} />
          </aside>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <SceneProvider>
      <AppContent />
    </SceneProvider>
  );
}

export default App;
