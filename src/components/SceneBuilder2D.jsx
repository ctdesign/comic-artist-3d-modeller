import { useRef, useEffect, useState } from 'react';
import { useScene } from '../store/SceneContext';
import { ELEMENT_DEFAULTS } from '../utils/elements';

function SceneBuilder2D() {
  const canvasRef = useRef(null);
  const {
    elements,
    selectedElement,
    setSelectedElement,
    updateElement,
    gridSize,
    toolMode,
    snapToGrid,
    addWall,
  } = useScene();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(40); // pixels per unit
  const [wallStart, setWallStart] = useState(null);
  const [wallPreview, setWallPreview] = useState(null);
  const [scaleHandle, setScaleHandle] = useState(null); // 'nw', 'ne', 'sw', 'se'
  const [scaleMode, setScaleMode] = useState('uniform'); // 'uniform' or 'skew'
  const [hoverHandle, setHoverHandle] = useState(null);

  // Snap to grid helper
  const snapValue = (value) => {
    if (!snapToGrid) return value;
    return Math.round(value);
  };

  // Arrow key movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedElement || toolMode !== 'select') return;

      const element = elements.find((el) => el.id === selectedElement);
      if (!element) return;

      const moveAmount = snapToGrid ? 1 : 0.1;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          updateElement(selectedElement, {
            position: { ...element.position, z: element.position.z - moveAmount },
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          updateElement(selectedElement, {
            position: { ...element.position, z: element.position.z + moveAmount },
          });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          updateElement(selectedElement, {
            position: { ...element.position, x: element.position.x - moveAmount },
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          updateElement(selectedElement, {
            position: { ...element.position, x: element.position.x + moveAmount },
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, elements, updateElement, snapToGrid, toolMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2 + cameraOffset.x;
    const centerY = canvas.height / 2 + cameraOffset.y;

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = -gridSize.width / 2; i <= gridSize.width / 2; i++) {
      const x = centerX + i * zoom;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines (Z axis)
    for (let i = -gridSize.depth / 2; i <= gridSize.depth / 2; i++) {
      const y = centerY + i * zoom;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + zoom * 2, centerY);
    ctx.stroke();

    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + zoom * 2);
    ctx.stroke();

    // Draw elements
    elements.forEach((element) => {
      const elementInfo = ELEMENT_DEFAULTS[element.type];
      const size = elementInfo.defaultSize;

      const x = centerX + element.position.x * zoom;
      const z = centerY + element.position.z * zoom;
      const width = size.width * Math.abs(element.scale.x) * zoom;
      const depth = size.depth * Math.abs(element.scale.z) * zoom;

      // Rotate context for drawing
      ctx.save();
      ctx.translate(x, z);
      ctx.rotate(element.rotation.y);

      // Draw element
      ctx.fillStyle = element.color;
      ctx.strokeStyle = selectedElement === element.id ? '#fbbf24' : '#6b7280';
      ctx.lineWidth = selectedElement === element.id ? 3 : 1;

      if (element.type === 'person') {
        // Draw person as 2D cutout silhouette
        ctx.beginPath();
        // Head (circle)
        ctx.arc(0, -depth / 3, width / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Body (rounded rectangle)
        ctx.beginPath();
        ctx.roundRect(-width / 3, -depth / 6, width * 0.66, depth * 0.7, width / 10);
        ctx.fill();
        ctx.stroke();
      } else if (element.type === 'sphere') {
        ctx.beginPath();
        ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (element.type === 'pyramid') {
        ctx.beginPath();
        ctx.moveTo(0, -depth / 2);
        ctx.lineTo(width / 2, depth / 2);
        ctx.lineTo(-width / 2, depth / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (element.type === 'tree') {
        // Draw tree as triangle crown + rectangle trunk
        // Crown
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(0, -depth / 2);
        ctx.lineTo(width / 2, 0);
        ctx.lineTo(-width / 2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Trunk
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-width / 6, 0, width / 3, depth / 3);
        ctx.strokeRect(-width / 6, 0, width / 3, depth / 3);

        ctx.fillStyle = element.color;
      } else {
        // Rectangle for all other shapes (including walls)
        ctx.fillRect(-width / 2, -depth / 2, width, depth);
        ctx.strokeRect(-width / 2, -depth / 2, width, depth);
      }

      ctx.restore();

      // Draw scale handles in scale mode
      if (toolMode === 'scale' && selectedElement === element.id) {
        ctx.save();
        ctx.translate(x, z);
        ctx.rotate(element.rotation.y);

        const handleSize = 8;
        const corners = [
          { x: -width / 2, y: -depth / 2, handle: 'nw' },
          { x: width / 2, y: -depth / 2, handle: 'ne' },
          { x: -width / 2, y: depth / 2, handle: 'sw' },
          { x: width / 2, y: depth / 2, handle: 'se' },
        ];

        corners.forEach(({ x: hx, y: hy, handle }) => {
          ctx.fillStyle = hoverHandle === handle ? '#fbbf24' : '#ffffff';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
          ctx.strokeRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
        });

        ctx.restore();
      }
    });

    // Draw wall preview
    if (wallPreview) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(wallPreview.startX, wallPreview.startY);
      ctx.lineTo(wallPreview.endX, wallPreview.endY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw selection info
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Grid: ${gridSize.width}x${gridSize.depth}`, 10, 20);
    ctx.fillText(`Zoom: ${zoom.toFixed(0)}px/unit`, 10, 35);
    ctx.fillText(`Elements: ${elements.length}`, 10, 50);
    ctx.fillText(`Tool: ${toolMode}`, 10, 65);
    if (toolMode === 'scale' && selectedElement) {
      ctx.fillText(`Scale Mode: ${scaleMode} (Hold Shift to ${scaleMode === 'uniform' ? 'skew' : 'uniform'})`, 10, 80);
    }
  }, [elements, selectedElement, gridSize, cameraOffset, zoom, wallPreview, toolMode, scaleMode, hoverHandle]);

  const screenToWorld = (screenX, screenY) => {
    const canvas = canvasRef.current;
    const centerX = canvas.width / 2 + cameraOffset.x;
    const centerY = canvas.height / 2 + cameraOffset.y;

    const worldX = (screenX - centerX) / zoom;
    const worldZ = (screenY - centerY) / zoom;

    return { x: snapValue(worldX), z: snapValue(worldZ) };
  };

  const worldToScreen = (worldX, worldZ) => {
    const canvas = canvasRef.current;
    const centerX = canvas.width / 2 + cameraOffset.x;
    const centerY = canvas.height / 2 + cameraOffset.y;

    return {
      x: centerX + worldX * zoom,
      y: centerY + worldZ * zoom,
    };
  };

  const getHandleAtPosition = (mouseX, mouseY, element) => {
    const elementInfo = ELEMENT_DEFAULTS[element.type];
    const size = elementInfo.defaultSize;

    const screen = worldToScreen(element.position.x, element.position.z);
    const width = size.width * Math.abs(element.scale.x) * zoom;
    const depth = size.depth * Math.abs(element.scale.z) * zoom;

    const handleSize = 8;
    const threshold = handleSize;

    // Calculate rotated corner positions
    const cos = Math.cos(element.rotation.y);
    const sin = Math.sin(element.rotation.y);

    const corners = [
      { dx: -width / 2, dz: -depth / 2, handle: 'nw' },
      { dx: width / 2, dz: -depth / 2, handle: 'ne' },
      { dx: -width / 2, dz: depth / 2, handle: 'sw' },
      { dx: width / 2, dz: depth / 2, handle: 'se' },
    ];

    for (const { dx, dz, handle } of corners) {
      const rotatedX = dx * cos - dz * sin;
      const rotatedZ = dx * sin + dz * cos;
      const cornerX = screen.x + rotatedX;
      const cornerY = screen.y + rotatedZ;

      if (
        Math.abs(mouseX - cornerX) < threshold &&
        Math.abs(mouseY - cornerY) < threshold
      ) {
        return handle;
      }
    }

    return null;
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.width / 2 + cameraOffset.x;
    const centerY = canvas.height / 2 + cameraOffset.y;

    if (toolMode === 'wall') {
      // Wall drawing mode
      const worldPos = screenToWorld(mouseX, mouseY);
      setWallStart({ x: worldPos.x, y: worldPos.z });
      setWallPreview({
        startX: mouseX,
        startY: mouseY,
        endX: mouseX,
        endY: mouseY,
      });
      setIsDragging(true);
      return;
    }

    // Check if clicking on an element
    let clickedElement = null;
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];

      // First check if we're clicking a scale handle in scale mode
      if (toolMode === 'scale' && selectedElement === element.id) {
        const handle = getHandleAtPosition(mouseX, mouseY, element);
        if (handle) {
          setScaleHandle(handle);
          setIsDragging(true);
          setDragStart({ x: mouseX, y: mouseY });
          return;
        }
      }

      const elementInfo = ELEMENT_DEFAULTS[element.type];
      const size = elementInfo.defaultSize;

      const x = centerX + element.position.x * zoom;
      const z = centerY + element.position.z * zoom;
      const width = size.width * Math.abs(element.scale.x) * zoom;
      const depth = size.depth * Math.abs(element.scale.z) * zoom;

      // Simple bounding box check (ignoring rotation for click detection simplicity)
      if (
        mouseX >= x - width / 2 &&
        mouseX <= x + width / 2 &&
        mouseY >= z - depth / 2 &&
        mouseY <= z + depth / 2
      ) {
        clickedElement = element;
        break;
      }
    }

    if (clickedElement) {
      setSelectedElement(clickedElement.id);
      if (toolMode === 'select') {
        setIsDragging(true);
        setDragStart({
          x: mouseX - (centerX + clickedElement.position.x * zoom),
          y: mouseY - (centerY + clickedElement.position.z * zoom),
        });
      }
    } else {
      setSelectedElement(null);
      setIsDragging(true);
      setDragStart({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Update cursor for scale handles
    if (toolMode === 'scale' && selectedElement) {
      const element = elements.find((el) => el.id === selectedElement);
      if (element) {
        const handle = getHandleAtPosition(mouseX, mouseY, element);
        setHoverHandle(handle);

        if (handle) {
          const cursors = {
            nw: 'nwse-resize',
            ne: 'nesw-resize',
            sw: 'nesw-resize',
            se: 'nwse-resize',
          };
          canvas.style.cursor = cursors[handle];
        } else if (!isDragging) {
          canvas.style.cursor = 'default';
        }
      }
    } else if (!isDragging) {
      canvas.style.cursor = toolMode === 'wall' ? 'crosshair' : 'move';
    }

    // Update scale mode based on shift key
    if (e.shiftKey) {
      setScaleMode('skew');
    } else {
      setScaleMode('uniform');
    }

    if (!isDragging) return;

    if (toolMode === 'wall' && wallStart) {
      // Update wall preview
      setWallPreview({
        startX: wallPreview.startX,
        startY: wallPreview.startY,
        endX: mouseX,
        endY: mouseY,
      });
      return;
    }

    if (scaleHandle && selectedElement) {
      // Scale mode
      const element = elements.find((el) => el.id === selectedElement);
      if (element) {
        const elementInfo = ELEMENT_DEFAULTS[element.type];
        const size = elementInfo.defaultSize;

        const dx = mouseX - dragStart.x;
        const dy = mouseY - dragStart.y;

        const scaleDelta = Math.sqrt(dx * dx + dy * dy) / zoom / 100;

        if (scaleMode === 'uniform') {
          // Uniform scaling
          const newScale = Math.max(0.1, element.scale.x + scaleDelta * Math.sign(dx));
          updateElement(element.id, {
            scale: {
              x: newScale * Math.sign(element.scale.x),
              y: element.scale.y,
              z: newScale * Math.sign(element.scale.z)
            },
          });
        } else {
          // Skew scaling
          let newScaleX = element.scale.x;
          let newScaleZ = element.scale.z;

          if (scaleHandle.includes('e')) {
            newScaleX = Math.max(0.1, Math.abs(element.scale.x) + dx / zoom / size.width) * Math.sign(element.scale.x);
          } else if (scaleHandle.includes('w')) {
            newScaleX = Math.max(0.1, Math.abs(element.scale.x) - dx / zoom / size.width) * Math.sign(element.scale.x);
          }

          if (scaleHandle.includes('s')) {
            newScaleZ = Math.max(0.1, Math.abs(element.scale.z) + dy / zoom / size.depth) * Math.sign(element.scale.z);
          } else if (scaleHandle.includes('n')) {
            newScaleZ = Math.max(0.1, Math.abs(element.scale.z) - dy / zoom / size.depth) * Math.sign(element.scale.z);
          }

          updateElement(element.id, {
            scale: { x: newScaleX, y: element.scale.y, z: newScaleZ },
          });
        }

        setDragStart({ x: mouseX, y: mouseY });
      }
      return;
    }

    if (selectedElement && toolMode === 'select') {
      // Drag element
      const element = elements.find((el) => el.id === selectedElement);
      if (element) {
        const centerX = canvas.width / 2 + cameraOffset.x;
        const centerY = canvas.height / 2 + cameraOffset.y;

        const newX = (mouseX - dragStart.x - centerX) / zoom;
        const newZ = (mouseY - dragStart.y - centerY) / zoom;

        updateElement(selectedElement, {
          position: { ...element.position, x: snapValue(newX), z: snapValue(newZ) },
        });
      }
    } else if (!selectedElement) {
      // Pan camera
      const dx = mouseX - dragStart.x;
      const dy = mouseY - dragStart.y;
      setCameraOffset({ x: cameraOffset.x + dx, y: cameraOffset.y + dy });
      setDragStart({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = (e) => {
    if (toolMode === 'wall' && wallStart && wallPreview) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const endPos = screenToWorld(mouseX, mouseY);
      addWall({ x: wallStart.x, z: wallStart.y }, { x: endPos.x, z: endPos.z });

      setWallStart(null);
      setWallPreview(null);
    }

    setIsDragging(false);
    setScaleHandle(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(10, Math.min(200, prev * delta)));
  };

  return (
    <div className="w-full h-full relative bg-gray-800">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 p-3 rounded text-sm">
        <div className="font-semibold mb-1">Controls:</div>
        {toolMode === 'select' && (
          <>
            <div>Click & Drag: Move elements</div>
            <div>Click empty: Pan view</div>
          </>
        )}
        {toolMode === 'wall' && (
          <>
            <div>Click & Drag: Draw wall</div>
          </>
        )}
        {toolMode === 'scale' && (
          <>
            <div>Drag corners: Scale</div>
            <div>Hold Shift: Skew mode</div>
          </>
        )}
        <div>Scroll: Zoom in/out</div>
      </div>
    </div>
  );
}

export default SceneBuilder2D;
