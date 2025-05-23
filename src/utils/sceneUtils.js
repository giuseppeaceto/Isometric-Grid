/**
 * Utility functions for scene management
 * 
 * This module provides functions for serializing, deserializing, validating,
 * and exporting scene data. It handles persistence to localStorage and
 * export/import functionality for various formats (JSON, PNG, JPEG, SVG).
 */

import html2canvas from 'html2canvas';

/**
 * Serializes the scene state to JSON
 * 
 * Converts the scene state object into a serializable format with
 * version information and metadata. This ensures that the scene can
 * be properly saved and restored.
 * 
 * @param {Object} sceneState - The current scene state
 * @param {Array} sceneState.elements - The elements in the scene
 * @param {Object} sceneState.gridSize - The grid dimensions {width, height}
 * @param {Object} sceneState.tileSize - The tile dimensions {width, height}
 * @returns {Object} - Serialized scene data
 */
export const serializeScene = (sceneState) => {
  const { elements, gridSize, tileSize } = sceneState;
  
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    metadata: {
      gridSize,
      tileSize
    },
    elements: elements.map(element => ({
      ...element,
      // Ensure we don't include any non-serializable properties
      // Add any specific transformations needed for serialization
    }))
  };
};

/**
 * Deserializes JSON data back into scene state
 * 
 * Converts serialized scene data back into the format expected by the application.
 * Validates the data first to ensure it's in the correct format.
 * 
 * @param {Object} sceneData - The serialized scene data
 * @returns {Object} - Deserialized scene state
 * @throws {Error} - If the scene data is invalid
 */
export const deserializeScene = (sceneData) => {
  // Validate the scene data first
  if (!validateSceneData(sceneData)) {
    throw new Error('Invalid scene data format');
  }
  
  const { elements, metadata } = sceneData;
  
  return {
    elements: elements.map(element => ({
      ...element,
      // Add any specific transformations needed for deserialization
    })),
    gridSize: metadata?.gridSize,
    tileSize: metadata?.tileSize
  };
};

/**
 * Validates scene data to ensure it has the required structure
 * 
 * Checks that the scene data contains the necessary properties and
 * has the correct structure. This helps prevent errors when loading
 * invalid or corrupted scene data.
 * 
 * @param {Object} sceneData - The scene data to validate
 * @returns {boolean} - Whether the data is valid
 */
export const validateSceneData = (sceneData) => {
  // Basic validation
  if (!sceneData) return false;
  
  // Check for required properties
  if (!Array.isArray(sceneData.elements)) return false;
  
  // Check version compatibility
  const version = sceneData.version || '1.0.0';
  // For now, we only have one version, but this allows for future compatibility checks
  
  return true;
};

/**
 * Saves scene data to localStorage
 * 
 * Stores the current scene state in the browser's localStorage.
 * Also maintains an index of saved scenes for easy retrieval.
 * 
 * @param {string} name - The name of the scene
 * @param {Object} sceneState - The scene state to save
 * @returns {boolean} - Whether the save was successful
 */
export const saveSceneToLocalStorage = (name, sceneState) => {
  try {
    const serializedScene = serializeScene(sceneState);
    
    // Get existing scenes index
    const scenesIndex = JSON.parse(localStorage.getItem('isometric-scenes-index') || '[]');
    
    // Add or update scene in index
    const existingIndex = scenesIndex.findIndex(item => item.name === name);
    const sceneInfo = {
      name,
      timestamp: new Date().toISOString(),
      preview: null // Could store a small preview image in the future
    };
    
    if (existingIndex >= 0) {
      scenesIndex[existingIndex] = sceneInfo;
    } else {
      scenesIndex.push(sceneInfo);
    }
    
    // Save updated index
    localStorage.setItem('isometric-scenes-index', JSON.stringify(scenesIndex));
    
    // Save the actual scene data
    localStorage.setItem(`isometric-scene-${name}`, JSON.stringify(serializedScene));
    
    return true;
  } catch (error) {
    console.error('Error saving scene to localStorage:', error);
    return false;
  }
};

/**
 * Loads scene data from localStorage
 * 
 * Retrieves a saved scene from localStorage and deserializes it.
 * 
 * @param {string} name - The name of the scene to load
 * @returns {Object|null} - The loaded scene state or null if not found
 */
export const loadSceneFromLocalStorage = (name) => {
  try {
    const sceneData = localStorage.getItem(`isometric-scene-${name}`);
    if (!sceneData) return null;
    
    return deserializeScene(JSON.parse(sceneData));
  } catch (error) {
    console.error('Error loading scene from localStorage:', error);
    return null;
  }
};

/**
 * Gets a list of all saved scenes from localStorage
 * 
 * Retrieves the index of saved scenes from localStorage.
 * 
 * @returns {Array} - List of saved scenes with metadata
 */
export const getSavedScenes = () => {
  try {
    return JSON.parse(localStorage.getItem('isometric-scenes-index') || '[]');
  } catch (error) {
    console.error('Error getting saved scenes:', error);
    return [];
  }
};

/**
 * Deletes a scene from localStorage
 * 
 * Removes a scene from localStorage and updates the scenes index.
 * 
 * @param {string} name - The name of the scene to delete
 * @returns {boolean} - Whether the deletion was successful
 */
export const deleteScene = (name) => {
  try {
    // Get existing scenes index
    const scenesIndex = JSON.parse(localStorage.getItem('isometric-scenes-index') || '[]');
    
    // Remove scene from index
    const updatedIndex = scenesIndex.filter(item => item.name !== name);
    
    // Save updated index
    localStorage.setItem('isometric-scenes-index', JSON.stringify(updatedIndex));
    
    // Remove the actual scene data
    localStorage.removeItem(`isometric-scene-${name}`);
    
    return true;
  } catch (error) {
    console.error('Error deleting scene:', error);
    return false;
  }
};

/**
 * Exports the scene as a JSON file
 * 
 * Serializes the scene state and creates a downloadable JSON file.
 * 
 * @param {Object} sceneState - The scene state to export
 * @param {string} filename - The filename to use (without extension)
 * @returns {boolean} - Whether the export was successful
 */
export const exportSceneAsJSON = (sceneState, filename = 'isometric-scene') => {
  try {
    const serializedScene = serializeScene(sceneState);
    const blob = new Blob([JSON.stringify(serializedScene, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting scene as JSON:', error);
    return false;
  }
};

/**
 * Imports a scene from a JSON file
 * 
 * Reads a JSON file and deserializes it into a scene state.
 * 
 * @param {File} file - The JSON file to import
 * @returns {Promise<Object|null>} - The imported scene state or null if import failed
 */
export const importSceneFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const sceneData = JSON.parse(event.target.result);
        const sceneState = deserializeScene(sceneData);
        resolve(sceneState);
      } catch (error) {
        console.error('Error importing scene from JSON:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Exports the scene as an image
 * 
 * Uses html2canvas to render the scene to a canvas and create a downloadable image.
 * 
 * @param {HTMLElement} elementRef - Reference to the element to export
 * @param {string} filename - The filename to use (without extension)
 * @param {string} format - The image format (png or jpeg)
 * @returns {Promise<boolean>} - Whether the export was successful
 */
export const exportSceneAsImage = async (elementRef, filename = 'isometric-scene', format = 'png') => {
  try {
    // Use html2canvas to render the element to a canvas
    const canvas = await html2canvas(elementRef, {
      backgroundColor: null, // Transparent background
      scale: 2, // Higher resolution
      logging: false,
      useCORS: true // Enable CORS for images
    });
    
    // Convert canvas to data URL
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpeg' ? 0.95 : undefined;
    const dataURL = canvas.toDataURL(mimeType, quality);
    
    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('Error exporting scene as image:', error);
    return false;
  }
};

/**
 * Exports the scene as an SVG
 * 
 * Serializes an SVG element and creates a downloadable SVG file.
 * 
 * @param {SVGElement} svgElement - Reference to the SVG element
 * @param {string} filename - The filename to use (without extension)
 * @returns {boolean} - Whether the export was successful
 */
export const exportSceneAsSVG = (svgElement, filename = 'isometric-scene') => {
  try {
    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true);
    
    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(clonedSvg);
    
    // Add XML declaration and doctype
    svgString = '<?xml version="1.0" standalone="no"?>\n' + svgString;
    
    // Create a blob from the SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting scene as SVG:', error);
    return false;
  }
};