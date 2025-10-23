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
  } = useScene();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(40); // pixels per unit

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

      if (element.type === 'sphere') {
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
      } else {
        // Rectangle for all other shapes
        ctx.fillRect(-width / 2, -depth / 2, width, depth);
        ctx.strokeRect(-width / 2, -depth / 2, width, depth);
      }

      ctx.restore();
    });

    // Draw selection info
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Grid: ${gridSize.width}x${gridSize.depth}`, 10, 20);
    ctx.fillText(`Zoom: ${zoom.toFixed(0)}px/unit`, 10, 35);
    ctx.fillText(`Elements: ${elements.length}`, 10, 50);
  }, [elements, selectedElement, gridSize, cameraOffset, zoom]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.width / 2 + cameraOffset.x;
    const centerY = canvas.height / 2 + cameraOffset.y;

    // Check if clicking on an element
    let clickedElement = null;
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      const elementInfo = ELEMENT_DEFAULTS[element.type];
      const size = elementInfo.defaultSize;

      const x = centerX + element.position.x * zoom;
      const z = centerY + element.position.z * zoom;
      const width = size.width * Math.abs(element.scale.x) * zoom;
      const depth = size.depth * Math.abs(element.scale.z) * zoom;

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
      setIsDragging(true);
      setDragStart({
        x: mouseX - (centerX + clickedElement.position.x * zoom),
        y: mouseY - (centerY + clickedElement.position.z * zoom),
      });
    } else {
      setSelectedElement(null);
      setIsDragging(true);
      setDragStart({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (selectedElement) {
      // Drag element
      const element = elements.find((el) => el.id === selectedElement);
      if (element) {
        const centerX = canvas.width / 2 + cameraOffset.x;
        const centerY = canvas.height / 2 + cameraOffset.y;

        const newX = (mouseX - dragStart.x - centerX) / zoom;
        const newZ = (mouseY - dragStart.y - centerY) / zoom;

        updateElement(selectedElement, {
          position: { ...element.position, x: newX, z: newZ },
        });
      }
    } else {
      // Pan camera
      const dx = mouseX - dragStart.x;
      const dy = mouseY - dragStart.y;
      setCameraOffset({ x: cameraOffset.x + dx, y: cameraOffset.y + dy });
      setDragStart({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 p-3 rounded text-sm">
        <div className="font-semibold mb-1">Controls:</div>
        <div>Click & Drag: Move elements</div>
        <div>Click empty: Pan view</div>
        <div>Scroll: Zoom in/out</div>
      </div>
    </div>
  );
}

export default SceneBuilder2D;
