import { useState } from 'react';
import { SceneProvider, useScene } from './store/SceneContext';
import SceneBuilder2D from './components/SceneBuilder2D';
import SceneView3D from './components/SceneView3D';
import Toolbar from './components/Toolbar';
import ElementLibrary from './components/ElementLibrary';
import PropertiesPanel from './components/PropertiesPanel';

function AppContent() {
  const { viewMode, setViewMode, saveScene, loadScene } = useScene();

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Art Assistant</h1>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-2 rounded ${
                viewMode === '2d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              2D Builder
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded ${
                viewMode === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              3D View
            </button>
          </div>

          {/* Save/Load */}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools and Element Library */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
          <ElementLibrary />
          <Toolbar />
        </aside>

        {/* Main View Area */}
        <main className="flex-1 relative">
          {viewMode === '2d' ? <SceneBuilder2D /> : <SceneView3D />}
        </main>

        {/* Right Sidebar - Properties Panel */}
        <aside className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Properties</h2>
          </div>
          <PropertiesPanel />
        </aside>
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
