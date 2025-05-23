# Isometric Scene Creator

A modern web application built with React that allows users to create isometric scenes by placing elements on an isometric plane. Perfect for designing city layouts, game maps, or visualizing spatial concepts in an intuitive isometric view.

![Isometric Scene Creator](https://screenshots.codesandbox.io/yvdbc/2.png)

## Features

- Interactive isometric grid with intuitive controls
- Element placement, rotation, and scaling
- Drag and drop interface for easy element manipulation
- Scene management (save, load, export)
- Responsive design that works across different devices
- Dark/light mode support

## Screenshots

<div align="center">
  <img src="https://codesandbox.io/api/v1/sandboxes/v6jtxi/screenshot.png" alt="Isometric Grid Example" width="45%" />
  <img src="https://external-preview.redd.it/BL7uMYOPy5QqKOypfLrssT2go_hAYjjtuLZpETbbPac.jpg?auto=webp&s=d995c0901df43ace2b42f0e51139cc5b7cb35626" alt="Isometric City Builder" width="45%" />
</div>

## Scene Management

The application includes comprehensive scene management features:

- **Save Scenes**: Save your work to browser's localStorage for later use
- **Load Scenes**: Load previously saved scenes from localStorage
- **Export Options**: Export your scenes as:
  - JSON data for sharing or backup
  - PNG images for sharing on social media or presentations
  - JPEG images for smaller file sizes
- **Import Scenes**: Import previously exported JSON scene files

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/isometric-scene-creator.git
cd isometric-scene-creator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
isometric-scene-creator/
├── public/                      # Static assets
│   ├── assets/                  # Images and other static resources
│   │   ├── elements/            # Isometric elements/objects
│   │   └── *.png                # Grid visualizations and other images
│   └── vite.svg                 # Vite logo
├── src/                         # Source code
│   ├── components/              # React components
│   │   ├── canvas/              # Isometric canvas components
│   │   ├── controls/            # UI controls components
│   │   ├── elements/            # Isometric element components
│   │   └── layout/              # Layout components
│   ├── context/                 # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── styles/                  # CSS files
│   ├── utils/                   # Utility functions
│   ├── App.jsx                  # Main App component
│   └── main.jsx                 # JavaScript entry point
├── .gitignore                   # Git ignore file
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML entry point
├── LICENSE                      # MIT License file
├── package.json                 # NPM package configuration
├── README.md                    # Project documentation
└── vite.config.js               # Vite configuration
```

## Usage

### Basic Controls

- **Pan**: Hold middle mouse button or Ctrl/Alt/Shift + drag
- **Zoom**: Ctrl + mouse wheel or use zoom controls
- **Select Elements**: Click on an element to select it
- **Move Elements**: Drag selected elements to reposition
- **Rotate/Scale**: Use the controls that appear when an element is selected

### Element Placement

1. Select an element from the palette on the left sidebar
2. Click on the grid where you want to place the element
3. Use the controls to adjust position, rotation, or scale
4. Right-click to cancel placement

### Scene Management

- **New Scene**: Create a new empty scene
- **Save Scene**: Save your current scene to browser storage
- **Load Scene**: Load a previously saved scene
- **Export Scene**: Export your scene as JSON data or as an image
- **Import Scene**: Import a previously exported scene file

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save Scene | Ctrl/Cmd + S |
| Load Scene | Ctrl/Cmd + O |
| New Scene | Ctrl/Cmd + N |
| Delete Selected | Delete or Backspace |
| Copy | Ctrl/Cmd + C |
| Paste | Ctrl/Cmd + V |
| Undo | Ctrl/Cmd + Z |
| Redo | Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z |
| Toggle Grid | G |
| Toggle Sidebar | Tab |

## Technologies Used

- [React](https://reactjs.org/) (v19.1.0) - UI library
- [Chakra UI](https://chakra-ui.com/) (v3.19.1) - Component library
- [DnD Kit](https://dndkit.com/) (v6.3.1) - Drag and drop functionality
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) (v9.1.2) - 3D rendering
- [Three.js](https://threejs.org/) (v0.176.0) - 3D library
- [html2canvas](https://html2canvas.hertzen.com/) (v1.4.1) - Screenshot functionality
- [Vite](https://vitejs.dev/) (v6.3.5) - Build tool and development server

## Browser Compatibility

The application is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Isometric grid implementation inspired by CSS-Tricks articles
- Element designs from various open-source SVG collections
- Special thanks to the React and Three.js communities for their excellent documentation