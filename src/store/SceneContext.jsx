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
  const [toolMode, setToolMode] = useState('select'); // 'select', 'wall', 'scale'
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [cameraSettings, setCameraSettings] = useState({
    fov: 75,
    wireframe: false,
    speed: 0.1,
  });
  const [sceneColors, setSceneColors] = useState({
    floor: '#1f2937',
    sky: '#111827',
  });
  const [panelMask, setPanelMask] = useState({
    enabled: false,
    width: 16,
    height: 9,
    opacity: 0.7,
    isCustom: false,
  });

  const addElement = useCallback((elementType) => {
    const newElement = {
      id: Date.now() + Math.random(),
      type: elementType,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#888888',
      material: 'solid', // 'solid', 'reflective', 'transparent'
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
    try {
      const scene = {
        elements,
        gridSize,
        cameraSettings,
      };
      localStorage.setItem('artAssistantScene', JSON.stringify(scene));
      alert('Scene saved successfully!');
    } catch (error) {
      console.error('Error saving scene:', error);
      alert('Error saving scene. Please try again.');
    }
  }, [elements, gridSize, cameraSettings]);

  const loadScene = useCallback(() => {
    try {
      const saved = localStorage.getItem('artAssistantScene');
      if (saved) {
        const scene = JSON.parse(saved);
        setElements(scene.elements || []);
        setGridSize(scene.gridSize || { width: 20, depth: 20 });
        setCameraSettings(scene.cameraSettings || { fov: 75, wireframe: false, speed: 0.1 });
        alert('Scene loaded successfully!');
      } else {
        alert('No saved scene found.');
      }
    } catch (error) {
      console.error('Error loading scene:', error);
      alert('Error loading scene. The saved data may be corrupted.');
    }
  }, []);

  const clearScene = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
  }, []);

  const addWall = useCallback((startPos, endPos, height = 2.5) => {
    const dx = endPos.x - startPos.x;
    const dz = endPos.z - startPos.z;
    const length = Math.sqrt(dx * dx + dz * dz);

    if (length < 0.1) return; // Too short, don't create wall

    // Calculate angle - rotate 90 degrees because wall depth is along Z, but we want length along the drawn line
    const angle = Math.atan2(dz, dx) - Math.PI / 2;
    const centerX = (startPos.x + endPos.x) / 2;
    const centerZ = (startPos.z + endPos.z) / 2;

    const newWall = {
      id: Date.now() + Math.random(),
      type: 'wall',
      position: { x: centerX, y: 0, z: centerZ },
      rotation: { x: 0, y: angle, z: 0 },
      scale: { x: 1, y: height / 2.5, z: length / 1 },
      color: '#cccccc',
      material: 'solid',
    };

    setElements(prev => [...prev, newWall]);
    setSelectedElement(newWall.id);
  }, []);

  const value = {
    viewMode,
    setViewMode,
    gridSize,
    setGridSize,
    elements,
    selectedElement,
    setSelectedElement,
    toolMode,
    setToolMode,
    snapToGrid,
    setSnapToGrid,
    cameraSettings,
    setCameraSettings,
    sceneColors,
    setSceneColors,
    panelMask,
    setPanelMask,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    addWall,
    saveScene,
    loadScene,
    clearScene,
  };

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
};
