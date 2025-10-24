import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls, Grid } from '@react-three/drei';
import { useScene } from '../store/SceneContext';
import { ELEMENT_TYPES, ELEMENT_DEFAULTS } from '../utils/elements';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Component for rendering a single element in 3D
function Element3D({ element, isSelected, onSelect }) {
  const meshRef = useRef();
  const elementInfo = ELEMENT_DEFAULTS[element.type];
  const size = elementInfo.defaultSize;

  // Get material properties based on material type
  const getMaterialProps = (color) => {
    const material = element.material || 'solid';

    switch (material) {
      case 'reflective':
        return {
          color: color,
          metalness: 0.9,
          roughness: 0.1,
        };
      case 'transparent':
        return {
          color: color,
          transparent: true,
          opacity: 0.4,
          metalness: 0.1,
          roughness: 0.1,
        };
      case 'solid':
      default:
        return {
          color: color,
          metalness: 0.2,
          roughness: 0.8,
        };
    }
  };

  const getGeometry = () => {
    switch (element.type) {
      case ELEMENT_TYPES.PERSON:
        // More realistic person model
        return (
          <group>
            {/* Head */}
            <mesh position={[0, size.height * 0.9, 0]}>
              <sphereGeometry args={[size.width * 0.35, 16, 16]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, size.height * 0.82, 0]}>
              <cylinderGeometry args={[size.width * 0.15, size.width * 0.15, size.height * 0.08, 8]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Torso (upper body) */}
            <mesh position={[0, size.height * 0.6, 0]}>
              <boxGeometry args={[size.width * 0.9, size.height * 0.35, size.depth * 0.5]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Hips/Waist */}
            <mesh position={[0, size.height * 0.4, 0]}>
              <boxGeometry args={[size.width * 0.85, size.height * 0.15, size.depth * 0.45]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Left Leg */}
            <mesh position={[-size.width * 0.2, size.height * 0.2, 0]}>
              <cylinderGeometry args={[size.width * 0.15, size.width * 0.15, size.height * 0.4, 8]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Right Leg */}
            <mesh position={[size.width * 0.2, size.height * 0.2, 0]}>
              <cylinderGeometry args={[size.width * 0.15, size.width * 0.15, size.height * 0.4, 8]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Left Arm */}
            <mesh position={[-size.width * 0.55, size.height * 0.6, 0]} rotation={[0, 0, Math.PI / 6]}>
              <cylinderGeometry args={[size.width * 0.12, size.width * 0.12, size.height * 0.35, 8]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Right Arm */}
            <mesh position={[size.width * 0.55, size.height * 0.6, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <cylinderGeometry args={[size.width * 0.12, size.width * 0.12, size.height * 0.35, 8]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
          </group>
        );

      case ELEMENT_TYPES.CHAIR:
        return (
          <group>
            {/* Seat */}
            <mesh position={[0, size.height * 0.5, 0]}>
              <boxGeometry args={[size.width, size.height * 0.1, size.depth * 0.8]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Back */}
            <mesh position={[0, size.height * 0.7, -size.depth * 0.3]}>
              <boxGeometry args={[size.width, size.height * 0.4, size.depth * 0.1]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Legs */}
            {[
              [-size.width * 0.4, size.height * 0.25, size.depth * 0.3],
              [size.width * 0.4, size.height * 0.25, size.depth * 0.3],
              [-size.width * 0.4, size.height * 0.25, -size.depth * 0.3],
              [size.width * 0.4, size.height * 0.25, -size.depth * 0.3],
            ].map((pos, i) => (
              <mesh key={i} position={pos}>
                <cylinderGeometry args={[0.05, 0.05, size.height * 0.5, 8]} />
                <meshStandardMaterial {...getMaterialProps(element.color)} />
              </mesh>
            ))}
          </group>
        );

      case ELEMENT_TYPES.BED:
        return (
          <group>
            {/* Mattress */}
            <mesh position={[0, size.height * 0.7, 0]}>
              <boxGeometry args={[size.width, size.height * 0.4, size.depth]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
            {/* Base */}
            <mesh position={[0, size.height * 0.25, 0]}>
              <boxGeometry args={[size.width, size.height * 0.3, size.depth]} />
              <meshStandardMaterial {...getMaterialProps(element.color)} />
            </mesh>
          </group>
        );

      case ELEMENT_TYPES.SPHERE:
        return (
          <mesh position={[0, size.height / 2, 0]}>
            <sphereGeometry args={[size.width / 2, 32, 32]} />
            <meshStandardMaterial {...getMaterialProps(element.color)} />
          </mesh>
        );

      case ELEMENT_TYPES.CUBE:
        return (
          <mesh position={[0, size.height / 2, 0]}>
            <boxGeometry args={[size.width, size.height, size.depth]} />
            <meshStandardMaterial {...getMaterialProps(element.color)} />
          </mesh>
        );

      case ELEMENT_TYPES.PYRAMID:
        return (
          <mesh position={[0, size.height / 2, 0]}>
            <coneGeometry args={[size.width / 2, size.height, 4]} />
            <meshStandardMaterial {...getMaterialProps(element.color)} />
          </mesh>
        );

      case ELEMENT_TYPES.TREE:
        return (
          <group>
            {/* Trunk */}
            <mesh position={[0, size.height * 0.2, 0]}>
              <cylinderGeometry args={[size.width * 0.15, size.width * 0.2, size.height * 0.4, 8]} />
              <meshStandardMaterial {...getMaterialProps('#8B4513')} />
            </mesh>
            {/* Crown (cone foliage) */}
            <mesh position={[0, size.height * 0.6, 0]}>
              <coneGeometry args={[size.width * 0.6, size.height * 0.6, 8]} />
              <meshStandardMaterial {...getMaterialProps('#228B22')} />
            </mesh>
          </group>
        );

      case ELEMENT_TYPES.WALL:
        return (
          <mesh position={[0, size.height / 2, 0]}>
            <boxGeometry args={[size.width, size.height, size.depth]} />
            <meshStandardMaterial {...getMaterialProps(element.color)} />
          </mesh>
        );

      default:
        return (
          <mesh position={[0, size.height / 2, 0]}>
            <boxGeometry args={[size.width, size.height, size.depth]} />
            <meshStandardMaterial {...getMaterialProps(element.color)} />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={meshRef}
      position={[element.position.x, element.position.y, element.position.z]}
      rotation={[element.rotation.x, element.rotation.y, element.rotation.z]}
      scale={[element.scale.x, element.scale.y, element.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
    >
      {getGeometry()}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry
            args={[
              size.width * 1.1,
              size.height * 1.1,
              size.depth * 1.1,
            ]}
          />
          <meshBasicMaterial
            color="#fbbf24"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// FPS-style camera controller
function CameraController() {
  const { cameraSettings } = useScene();
  const { camera } = useThree();
  const controlsRef = useRef();
  const keysPressed = useRef({});
  const moveSpeed = cameraSettings.speed || 0.1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!controlsRef.current) return;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Forward/backward direction (maintain horizontal movement)
    const forward = direction.clone();
    forward.y = 0;
    forward.normalize();

    // Right direction
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();

    // Movement
    if (keysPressed.current['w']) {
      camera.position.addScaledVector(forward, moveSpeed);
    }
    if (keysPressed.current['s']) {
      camera.position.addScaledVector(forward, -moveSpeed);
    }
    if (keysPressed.current['a']) {
      camera.position.addScaledVector(right, moveSpeed);
    }
    if (keysPressed.current['d']) {
      camera.position.addScaledVector(right, -moveSpeed);
    }
    // Vertical movement
    if (keysPressed.current['e']) {
      camera.position.y += moveSpeed;
    }
    if (keysPressed.current['q']) {
      camera.position.y -= moveSpeed;
    }
  });

  return <PointerLockControls ref={controlsRef} />;
}

// Component to update camera FOV dynamically
function CameraFOVUpdater() {
  const { cameraSettings } = useScene();
  const { camera } = useThree();

  useEffect(() => {
    camera.fov = cameraSettings.fov;
    camera.updateProjectionMatrix();
  }, [cameraSettings.fov, camera]);

  return null;
}

// Main 3D Scene
function Scene() {
  const { elements, selectedElement, setSelectedElement, cameraSettings, gridSize } =
    useScene();

  return (
    <>
      {/* FOV Updater */}
      <CameraFOVUpdater />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />

      {/* Ground Grid */}
      <Grid
        args={[gridSize.width, gridSize.depth]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6b7280"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9ca3af"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[gridSize.width, gridSize.depth]} />
        <meshStandardMaterial
          color="#1f2937"
          wireframe={cameraSettings.wireframe}
        />
      </mesh>

      {/* Elements */}
      {elements.map((element) => (
        <group key={element.id}>
          <Element3D
            element={{
              ...element,
              color: cameraSettings.wireframe ? '#888888' : element.color,
            }}
            isSelected={selectedElement === element.id}
            onSelect={setSelectedElement}
          />
        </group>
      ))}

      {/* Camera Controls */}
      <CameraController />
    </>
  );
}

function SceneView3D() {
  const { cameraSettings } = useScene();

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [10, 1.6, 10], fov: cameraSettings.fov }}
        shadows
      >
        <Scene />
      </Canvas>
      <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 p-3 rounded text-sm text-white">
        <div className="font-semibold mb-1">Controls:</div>
        <div>Click canvas to activate</div>
        <div>WASD: Move horizontally</div>
        <div>E/Q: Move up/down</div>
        <div>Mouse: Look around</div>
        <div>ESC: Release mouse</div>
      </div>
    </div>
  );
}

export default SceneView3D;
