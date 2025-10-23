# Art Assistant

A web application to help artists quickly create simple 3D models of scenes for drawing reference, camera placement, and perspective planning.

## Features

### Two View Modes

#### 2D Scene Builder
- Top-down grid view for placing and arranging elements
- Drag elements to position them on the grid
- Pan the view by clicking and dragging empty space
- Zoom in/out with mouse wheel
- Configurable grid size

#### 3D View
- Full 3D visualization of your scene
- WASD keyboard controls for camera movement
- Mouse orbit controls to rotate around the scene
- Adjustable camera focal length (FOV)
- Toggle between solid and wireframe rendering modes

### Element Library

Six types of elements to build your scene:
- **Person** - Simple human cutout silhouette
- **Chair** - Low-poly chair with seat, back, and legs
- **Bed** - Simple bed with mattress and base
- **Sphere** - Basic sphere primitive
- **Cube** - Basic cube primitive
- **Pyramid** - Triangular pyramid shape

### Editing Tools

- **Add Elements** - Click any element in the library to add it to the scene
- **Select** - Click elements to select them
- **Move** - Drag elements in 2D view or adjust X/Y/Z position values
- **Rotate** - Adjust rotation on all three axes (in degrees)
- **Scale** - Resize elements on each axis independently
- **Flip** - Quick flip buttons for X and Z axes
- **Color** - Change element color with color picker
- **Duplicate** - Create a copy of selected element
- **Delete** - Remove selected element
- **Clear Scene** - Remove all elements

### Scene Management

- **Save** - Save your scene to browser local storage
- **Load** - Load previously saved scene
- Persistent across browser sessions

## Controls

### 2D Builder Mode
- **Click & Drag Element** - Move element
- **Click & Drag Empty Space** - Pan view
- **Mouse Wheel** - Zoom in/out

### 3D View Mode
- **W/A/S/D Keys** - Move camera forward/left/back/right
- **Left Mouse Drag** - Rotate camera (orbit)
- **Right Mouse Drag** - Pan camera
- **Mouse Wheel** - Zoom in/out
- **Click Element** - Select element

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will be available at `http://localhost:5173/`

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── components/
│   ├── ElementLibrary.jsx    # Element selection sidebar
│   ├── SceneBuilder2D.jsx     # 2D top-down builder view
│   ├── SceneView3D.jsx        # 3D perspective view
│   └── Toolbar.jsx            # Editing controls sidebar
├── store/
│   └── SceneContext.jsx       # React Context for state management
├── utils/
│   └── elements.js            # Element type definitions
├── App.jsx                    # Main application component
├── main.jsx                   # Application entry point
└── index.css                  # Global styles
```

## Future Enhancements

Potential features for future versions:
- Custom element creation
- Import/export scene files
- Camera position presets
- Measurement tools
- Lighting controls
- Texture support
- More furniture and prop types
- Undo/redo functionality
- Multi-element selection
- Snap-to-grid options
- Reference image overlay

## License

MIT

## Contributing

This is a prototype application. Feel free to fork and enhance!
