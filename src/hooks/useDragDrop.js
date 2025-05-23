import { useCallback } from 'react';
import { useDndMonitor } from '@dnd-kit/core';
import { useScene } from '../context/SceneContext';
import { screenToIsometric } from '../utils/isometricUtils';

/**
 * Custom hook for handling drag and drop functionality in the isometric scene
 * 
 * This hook provides utilities for:
 * - Converting screen coordinates to isometric grid positions
 * - Handling element placement via drag and drop
 * - Managing element movement on the grid
 * 
 * It integrates with the DnD Kit library to provide a smooth drag and drop
 * experience that respects the isometric projection of the scene.
 * 
 * @returns {Object} - Drag and drop handlers and utility functions
 */
export function useDragDrop() {
  const { 
    gridSize, 
    tileSize, 
    addElement, 
    updateElement, 
    offset, 
    zoom 
  } = useScene();
  
  /**
   * Calculate grid position from screen coordinates
   * 
   * Converts screen (pixel) coordinates to isometric grid coordinates,
   * taking into account the current zoom level and pan offset.
   * Also ensures the resulting coordinates are within the grid bounds.
   * 
   * @param {number} x - Screen X coordinate (pixels)
   * @param {number} y - Screen Y coordinate (pixels)
   * @returns {Object} - Grid position {x, y} in grid cells
   */
  const calculateGridPosition = useCallback((x, y) => {
    // Adjust for zoom and offset
    const adjustedX = (x - offset.x) / zoom;
    const adjustedY = (y - offset.y) / zoom;
    
    // Convert to isometric coordinates using the utility function
    const { x: gridX, y: gridY } = screenToIsometric(
      adjustedX, 
      adjustedY, 
      tileSize.width, 
      tileSize.height
    );
    
    // Ensure coordinates are within grid bounds
    // This prevents elements from being placed outside the valid grid area
    const boundedX = Math.max(0, Math.min(gridSize.width - 1, Math.round(gridX)));
    const boundedY = Math.max(0, Math.min(gridSize.height - 1, Math.round(gridY)));
    
    return { x: boundedX, y: boundedY };
  }, [gridSize, tileSize, offset, zoom]);
  
  /**
   * Handle element placement when dragging from palette to canvas
   * 
   * This function is called when a drag operation ends. It handles two cases:
   * 1. Placing a new element from the palette onto the canvas
   * 2. Moving an existing element to a new position on the canvas
   * 
   * @param {Object} event - The drag end event from DnD Kit
   */
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    // If there's no drop target, do nothing
    if (!over) return;
    
    // Check if this is a new element from the palette
    if (active.id.toString().startsWith('palette-')) {
      const elementType = active.data?.current?.type;
      if (!elementType) return;
      
      // Get the drop position from the event
      const { clientX, clientY } = event.activatorEvent;
      const { x, y } = calculateGridPosition(clientX, clientY);
      
      // Add new element to the scene at the calculated position
      addElement({
        type: elementType,
        position: { x, y },
        rotation: 0,
        scale: 1,
      });
    } 
    // Handle moving existing elements
    else {
      const elementId = active.data?.current?.id;
      if (!elementId) return;
      
      // Get the drop position from the event
      const { clientX, clientY } = event.activatorEvent;
      const { x, y } = calculateGridPosition(clientX, clientY);
      
      // Update the element's position in the scene
      updateElement(elementId, { position: { x, y } });
    }
  }, [addElement, updateElement, calculateGridPosition]);
  
  // Monitor drag events using DnD Kit's monitor
  useDndMonitor({
    onDragEnd: handleDragEnd
  });
  
  // Return utility functions that may be useful to components
  return {
    calculateGridPosition
  };
}