import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  saveSceneToLocalStorage, 
  loadSceneFromLocalStorage, 
  exportSceneAsJSON,
  exportSceneAsImage,
  exportSceneAsSVG,
  importSceneFromJSON
} from '../utils/sceneUtils';

/**
 * Context for managing the isometric scene state
 * This provides scene data and operations to all components
 */
const SceneContext = createContext();

/**
 * Provider component for the isometric scene context
 * 
 * This component manages the entire state of the isometric scene including:
 * - Grid configuration (size, tile dimensions, visibility)
 * - Scene elements (objects placed on the grid)
 * - History for undo/redo functionality
 * - View settings (zoom, pan offset)
 * - Element selection
 * - Scene metadata and persistence
 * 
 * It provides a comprehensive API for manipulating the scene through
 * various callback functions that components can use.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The context provider
 */
export function SceneProvider({ children }) {
  // Grid configuration
  const [gridSize, setGridSize] = useState({ width: 10, height: 10 });
  const [tileSize, setTileSize] = useState({ width: 64, height: 32 });
  const [showGrid, setShowGrid] = useState(true);
  
  // Scene elements (objects placed on the grid)
  const [elements, setElements] = useState([]);
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // View settings
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Selected element
  const [selectedElementId, setSelectedElementId] = useState(null);
  
  // Cursor position on grid
  const [cursorGridPosition, setCursorGridPosition] = useState({ x: 0, y: 0 });
  
  // Scene metadata
  const [sceneName, setSceneName] = useState('Untitled Scene');
  const [sceneModified, setSceneModified] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);
  
  /**
   * Add a new element to the scene
   * 
   * Creates a new element with the provided properties and adds it to the scene.
   * Also updates history and marks the scene as modified.
   * 
   * @param {Object} element - The element to add
   */
  const addElement = useCallback((element) => {
    setElements((prevElements) => {
      const newElements = [...prevElements, {
        id: Date.now().toString(),
        ...element
      }];
      
      // Add to history
      addToHistory(newElements);
      
      // Mark scene as modified
      setSceneModified(true);
      
      return newElements;
    });
  }, []);
  
  /**
   * Update an existing element
   * 
   * Updates the properties of an element with the specified ID.
   * Also updates history and marks the scene as modified.
   * 
   * @param {string} id - The ID of the element to update
   * @param {Object} updates - The properties to update
   */
  const updateElement = useCallback((id, updates) => {
    setElements((prevElements) => {
      const newElements = prevElements.map((element) => 
        element.id === id ? { ...element, ...updates } : element
      );
      
      // Add to history
      addToHistory(newElements);
      
      // Mark scene as modified
      setSceneModified(true);
      
      return newElements;
    });
  }, []);
  
  /**
   * Remove an element from the scene
   * 
   * Removes the element with the specified ID from the scene.
   * Also updates history, marks the scene as modified, and deselects
   * the element if it was selected.
   * 
   * @param {string} id - The ID of the element to remove
   */
  const removeElement = useCallback((id) => {
    setElements((prevElements) => {
      const newElements = prevElements.filter((element) => element.id !== id);
      
      // Add to history
      addToHistory(newElements);
      
      // Mark scene as modified
      setSceneModified(true);
      
      return newElements;
    });
    
    // Deselect if the removed element was selected
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);
  
  /**
   * Clear all elements from the scene
   * 
   * Removes all elements from the scene, updates history,
   * marks the scene as modified, and deselects any selected element.
   */
  const clearScene = useCallback(() => {
    // Add current state to history before clearing
    addToHistory([]);
    setElements([]);
    setSelectedElementId(null);
    
    // Mark scene as modified
    setSceneModified(true);
  }, []);
  
  /**
   * Duplicate an element
   * 
   * Creates a copy of the specified element with a slight position offset.
   * Also updates history, marks the scene as modified, and selects the new element.
   * 
   * @param {string} id - The ID of the element to duplicate
   */
  const duplicateElement = useCallback((id) => {
    const elementToDuplicate = elements.find(element => element.id === id);
    if (!elementToDuplicate) return;
    
    // Create a new element with the same properties but offset position
    const newElement = {
      ...elementToDuplicate,
      id: Date.now().toString(),
      position: {
        x: elementToDuplicate.position.x + 1,
        y: elementToDuplicate.position.y + 1
      }
    };
    
    setElements(prevElements => {
      const newElements = [...prevElements, newElement];
      
      // Add to history
      addToHistory(newElements);
      
      // Mark scene as modified
      setSceneModified(true);
      
      return newElements;
    });
    
    // Select the new element
    setSelectedElementId(newElement.id);
  }, [elements]);
  
  /**
   * Add current state to history
   * 
   * Adds the current state of elements to the history stack.
   * If we're not at the end of history, truncates the future history.
   * 
   * @param {Array} newElements - The new elements state to add to history
   */
  const addToHistory = useCallback((newElements) => {
    setHistory(prevHistory => {
      // If we're not at the end of the history, truncate
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      return [...newHistory, newElements];
    });
    setHistoryIndex(prevIndex => prevIndex + 1);
  }, [historyIndex]);
  
  /**
   * Undo the last action
   * 
   * Reverts to the previous state in the history stack.
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setElements(history[historyIndex - 1]);
      setSceneModified(true);
    }
  }, [history, historyIndex]);
  
  /**
   * Redo the last undone action
   * 
   * Advances to the next state in the history stack.
   */
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setElements(history[historyIndex + 1]);
      setSceneModified(true);
    }
  }, [history, historyIndex]);
  
  /**
   * Update grid size
   * 
   * Changes the number of cells in the isometric grid.
   * 
   * @param {Object} newSize - The new grid size {width, height}
   */
  const updateGridSize = useCallback((newSize) => {
    setGridSize(newSize);
    setSceneModified(true);
  }, []);
  
  /**
   * Update tile size
   * 
   * Changes the dimensions of each tile in the isometric grid.
   * 
   * @param {Object} newSize - The new tile size {width, height}
   */
  const updateTileSize = useCallback((newSize) => {
    setTileSize(newSize);
    setSceneModified(true);
  }, []);
  
  /**
   * Toggle grid visibility
   * 
   * Shows or hides the isometric grid.
   */
  const toggleGridVisibility = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);
  
  /**
   * Update zoom level
   * 
   * Changes the zoom level of the isometric view.
   * 
   * @param {number} newZoom - The new zoom level
   */
  const updateZoom = useCallback((newZoom) => {
    setZoom(newZoom);
  }, []);
  
  /**
   * Update view offset
   * 
   * Changes the pan offset of the isometric view.
   * 
   * @param {Object} newOffset - The new offset {x, y}
   */
  const updateOffset = useCallback((newOffset) => {
    setOffset(newOffset);
  }, []);
  
  /**
   * Select an element
   * 
   * Sets the currently selected element by ID.
   * 
   * @param {string|null} id - The ID of the element to select, or null to deselect
   */
  const selectElement = useCallback((id) => {
    setSelectedElementId(id);
  }, []);
  
  /**
   * Update cursor grid position
   * 
   * Updates the position of the cursor on the isometric grid.
   * 
   * @param {Object} position - The new cursor position {x, y}
   */
  const updateCursorGridPosition = useCallback((position) => {
    setCursorGridPosition(position);
  }, []);
  
  /**
   * Set canvas reference for image export
   * 
   * Stores a reference to the canvas DOM element for screenshot generation.
   * 
   * @param {HTMLElement} ref - The canvas DOM element
   */
  const setSceneCanvasRef = useCallback((ref) => {
    setCanvasRef(ref);
  }, []);
  
  /**
   * Create a new scene
   * 
   * Clears the current scene and resets all scene-related state.
   */
  const createNewScene = useCallback(() => {
    clearScene();
    setSceneName('Untitled Scene');
    setSceneModified(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [clearScene]);
  
  /**
   * Save the current scene
   * 
   * Saves the current scene state to localStorage.
   * 
   * @param {string} name - The name to save the scene under
   * @returns {boolean} - Whether the save was successful
   */
  const saveScene = useCallback((name = sceneName) => {
    const sceneState = {
      elements,
      gridSize,
      tileSize
    };
    
    const success = saveSceneToLocalStorage(name, sceneState);
    
    if (success) {
      setSceneName(name);
      setSceneModified(false);
    }
    
    return success;
  }, [elements, gridSize, tileSize, sceneName]);
  
  /**
   * Load a saved scene
   * 
   * Loads a scene from localStorage and updates the current state.
   * 
   * @param {string} name - The name of the scene to load
   * @returns {boolean} - Whether the load was successful
   */
  const loadScene = useCallback((name) => {
    const sceneState = loadSceneFromLocalStorage(name);
    
    if (sceneState) {
      const { elements: loadedElements, gridSize: loadedGridSize, tileSize: loadedTileSize } = sceneState;
      
      // Update state with loaded scene data
      setElements(loadedElements || []);
      if (loadedGridSize) setGridSize(loadedGridSize);
      if (loadedTileSize) setTileSize(loadedTileSize);
      
      // Reset history with the loaded state
      setHistory([loadedElements || []]);
      setHistoryIndex(0);
      
      // Update scene metadata
      setSceneName(name);
      setSceneModified(false);
      
      return true;
    }
    
    return false;
  }, []);
  
  /**
   * Export the scene as JSON
   * 
   * Exports the current scene state as a JSON file.
   * 
   * @param {string} filename - The filename to use
   * @returns {boolean} - Whether the export was successful
   */
  const exportSceneJSON = useCallback((filename = sceneName) => {
    const sceneState = {
      elements,
      gridSize,
      tileSize
    };
    
    return exportSceneAsJSON(sceneState, filename);
  }, [elements, gridSize, tileSize, sceneName]);
  
  /**
   * Export the scene as an image
   * 
   * Exports the current scene as a PNG or JPEG image.
   * 
   * @param {string} filename - The filename to use
   * @param {string} format - The image format (png or jpeg)
   * @returns {Promise<boolean>} - Whether the export was successful
   */
  const exportSceneImage = useCallback(async (filename = sceneName, format = 'png') => {
    if (!canvasRef) return false;
    
    return await exportSceneAsImage(canvasRef, filename, format);
  }, [canvasRef, sceneName]);
  
  /**
   * Export the scene as SVG
   * 
   * Exports the current scene as an SVG file.
   * 
   * @param {SVGElement} svgElement - The SVG element to export
   * @param {string} filename - The filename to use
   * @returns {boolean} - Whether the export was successful
   */
  const exportSceneSVG = useCallback((svgElement, filename = sceneName) => {
    if (!svgElement) return false;
    
    return exportSceneAsSVG(svgElement, filename);
  }, [sceneName]);
  
  /**
   * Import a scene from JSON file
   * 
   * Imports a scene from a JSON file and updates the current state.
   * 
   * @param {File} file - The JSON file to import
   * @returns {Promise<boolean>} - Whether the import was successful
   */
  const importScene = useCallback(async (file) => {
    try {
      const sceneState = await importSceneFromJSON(file);
      
      if (sceneState) {
        const { elements: importedElements, gridSize: importedGridSize, tileSize: importedTileSize } = sceneState;
        
        // Update state with imported scene data
        setElements(importedElements || []);
        if (importedGridSize) setGridSize(importedGridSize);
        if (importedTileSize) setTileSize(importedTileSize);
        
        // Reset history with the imported state
        setHistory([importedElements || []]);
        setHistoryIndex(0);
        
        // Update scene metadata
        setSceneName(file.name.replace(/\.[^/.]+$/, '') || 'Imported Scene');
        setSceneModified(true);
        
        return true;
      }
    } catch (error) {
      console.error('Error importing scene:', error);
    }
    
    return false;
  }, []);
  
  /**
   * Initialize history with empty state
   * This ensures we always have at least one history entry
   */
  useEffect(() => {
    if (history.length === 0) {
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, [history.length]);
  
  // Context value containing all state and functions
  const value = {
    // Grid configuration
    gridSize,
    tileSize,
    showGrid,
    
    // Scene elements
    elements,
    
    // View settings
    zoom,
    offset,
    
    // Selection
    selectedElementId,
    cursorGridPosition,
    
    // Scene metadata
    sceneName,
    sceneModified,
    
    // Element operations
    addElement,
    updateElement,
    removeElement,
    clearScene,
    duplicateElement,
    
    // History operations
    undo,
    redo,
    
    // Grid operations
    updateGridSize,
    updateTileSize,
    toggleGridVisibility,
    
    // View operations
    updateZoom,
    updateOffset,
    
    // Selection operations
    selectElement,
    updateCursorGridPosition,
    
    // Canvas reference
    setSceneCanvasRef,
    
    // Scene operations
    createNewScene,
    saveScene,
    loadScene,
    exportSceneJSON,
    exportSceneImage,
    exportSceneSVG,
    importScene
  };
  
  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

/**
 * Custom hook for using the scene context
 * 
 * Provides access to the scene context from any component.
 * Throws an error if used outside of a SceneProvider.
 * 
 * @returns {Object} The scene context value
 * @throws {Error} If used outside of a SceneProvider
 */
export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}