import { createContext, useContext, useState, useCallback } from 'react';

const SceneContext = createContext();

export const useScene = () => {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useScene must be used within SceneProvider');
  }
  return context;
};

export const SceneProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
  const [gridSize, setGridSize] = useState({ width: 20, depth: 20 });
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [cameraSettings, setCameraSettings] = useState({
    fov: 75,
    wireframe: false,
  });

  const addElement = useCallback((elementType) => {
    const newElement = {
      id: Date.now() + Math.random(),
      type: elementType,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#888888',
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  }, []);

  const updateElement = useCallback((id, updates) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const deleteElement = useCallback((id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const duplicateElement = useCallback((id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: Date.now() + Math.random(),
        position: {
          x: element.position.x + 1,
          y: element.position.y,
          z: element.position.z + 1,
        },
      };
      setElements(prev => [...prev, newElement]);
      setSelectedElement(newElement.id);
    }
  }, [elements]);

  const saveScene = useCallback(() => {
    const scene = {
      elements,
      gridSize,
      cameraSettings,
    };
    localStorage.setItem('artAssistantScene', JSON.stringify(scene));
  }, [elements, gridSize, cameraSettings]);

  const loadScene = useCallback(() => {
    const saved = localStorage.getItem('artAssistantScene');
    if (saved) {
      const scene = JSON.parse(saved);
      setElements(scene.elements || []);
      setGridSize(scene.gridSize || { width: 20, depth: 20 });
      setCameraSettings(scene.cameraSettings || { fov: 75, wireframe: false });
    }
  }, []);

  const clearScene = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
  }, []);

  const value = {
    viewMode,
    setViewMode,
    gridSize,
    setGridSize,
    elements,
    selectedElement,
    setSelectedElement,
    cameraSettings,
    setCameraSettings,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    saveScene,
    loadScene,
    clearScene,
  };

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
};
