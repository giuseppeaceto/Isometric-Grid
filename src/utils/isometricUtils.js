/**
 * Utility functions for isometric transformations and calculations
 * 
 * This module provides mathematical functions for converting between screen
 * coordinates and isometric grid coordinates, as well as helper functions
 * for positioning and rendering isometric elements.
 */

/**
 * Convert screen coordinates to isometric coordinates
 * 
 * This function transforms 2D screen coordinates (x, y) into isometric grid
 * coordinates. The transformation accounts for the isometric projection where
 * the grid is rotated 45 degrees and has a 2:1 ratio for width:height.
 * 
 * The formula is derived from the inverse of the isometric projection matrix.
 * 
 * @param {number} screenX - X coordinate in screen space (pixels)
 * @param {number} screenY - Y coordinate in screen space (pixels)
 * @param {number} tileWidth - Width of an isometric tile (pixels)
 * @param {number} tileHeight - Height of an isometric tile (pixels)
 * @returns {Object} - Object containing isometric x and y coordinates
 */
export function screenToIsometric(screenX, screenY, tileWidth, tileHeight) {
  // Convert screen coordinates to isometric grid coordinates
  // The division by 2 at the end converts from half-tile coordinates to full-tile coordinates
  const isoX = Math.floor((screenX / (tileWidth / 2) + screenY / (tileHeight / 2)) / 2);
  const isoY = Math.floor((screenY / (tileHeight / 2) - screenX / (tileWidth / 2)) / 2);
  return { x: isoX, y: isoY };
}

/**
 * Convert isometric coordinates to screen coordinates
 * 
 * This function transforms isometric grid coordinates into 2D screen coordinates.
 * It applies the isometric projection matrix to calculate where on the screen
 * a grid cell should be positioned.
 * 
 * @param {number} isoX - X coordinate in isometric space (grid cells)
 * @param {number} isoY - Y coordinate in isometric space (grid cells)
 * @param {number} tileWidth - Width of an isometric tile (pixels)
 * @param {number} tileHeight - Height of an isometric tile (pixels)
 * @returns {Object} - Object containing screen x and y coordinates (pixels)
 */
export function isometricToScreen(isoX, isoY, tileWidth, tileHeight) {
  // Convert isometric grid coordinates to screen coordinates
  // For isometric projection, we use a 2x2 matrix transformation:
  // [x']   [ 1  -1] [x]
  // [y'] = [0.5 0.5] [y]
  // Multiplied by tile dimensions
  const screenX = (isoX - isoY) * (tileWidth / 2);
  const screenY = (isoX + isoY) * (tileHeight / 2);
  return { x: screenX, y: screenY };
}

/**
 * Calculate the position for an element on the isometric grid
 * 
 * This function calculates the CSS position properties for an element
 * to be placed at the specified grid coordinates. It converts grid
 * coordinates to screen coordinates and adds any specified offsets.
 * 
 * @param {number} gridX - X position on the grid (grid cells)
 * @param {number} gridY - Y position on the grid (grid cells)
 * @param {number} tileWidth - Width of an isometric tile (pixels)
 * @param {number} tileHeight - Height of an isometric tile (pixels)
 * @param {number} offsetX - X offset for positioning (pixels)
 * @param {number} offsetY - Y offset for positioning (pixels)
 * @returns {Object} - Object containing CSS position properties
 */
export function calculateIsometricPosition(gridX, gridY, tileWidth, tileHeight, offsetX = 0, offsetY = 0) {
  const { x, y } = isometricToScreen(gridX, gridY, tileWidth, tileHeight);
  return {
    left: `${x + offsetX}px`,
    top: `${y + offsetY}px`,
  };
}

/**
 * Snap a position to the nearest grid point
 * 
 * This function takes screen coordinates and snaps them to the nearest
 * isometric grid point. It first converts to isometric coordinates (which
 * rounds to grid cells), then converts back to screen coordinates.
 * 
 * @param {number} x - X coordinate to snap (pixels)
 * @param {number} y - Y coordinate to snap (pixels)
 * @param {number} tileWidth - Width of an isometric tile (pixels)
 * @param {number} tileHeight - Height of an isometric tile (pixels)
 * @returns {Object} - Object containing snapped screen coordinates (pixels)
 */
export function snapToGrid(x, y, tileWidth, tileHeight) {
  const iso = screenToIsometric(x, y, tileWidth, tileHeight);
  return isometricToScreen(iso.x, iso.y, tileWidth, tileHeight);
}

/**
 * Calculate the CSS transform for isometric projection
 * 
 * This function returns the CSS transform property value needed to create
 * an isometric projection. The standard isometric projection uses a rotation
 * around the X-axis by 60 degrees and around the Z-axis by -45 degrees.
 * 
 * @returns {string} - CSS transform property value
 */
export function getIsometricTransform() {
  // Standard isometric projection uses 30-degree angles from horizontal
  // In CSS, this is achieved with a 60-degree X rotation and -45-degree Z rotation
  return 'rotateX(60deg) rotateZ(-45deg)';
}

/**
 * Calculate the z-index for an element based on its position in the isometric grid
 * 
 * This function calculates the appropriate z-index for an element to ensure
 * proper layering in the isometric view. Elements further back in the grid
 * (higher x+y value) should appear behind elements that are closer to the front.
 * 
 * @param {number} x - X position on the grid (grid cells)
 * @param {number} y - Y position on the grid (grid cells)
 * @returns {number} - z-index value
 */
export function calculateZIndex(x, y) {
  // Elements with higher x+y values should be drawn first (lower z-index)
  // This ensures proper layering in the isometric view
  return x + y;
}

/**
 * Calculate the dimensions of the isometric grid based on the number of cells
 * 
 * This function calculates the total width and height (in pixels) needed to
 * display an isometric grid with the specified number of cells and tile dimensions.
 * 
 * @param {number} gridWidth - Number of cells in the grid width
 * @param {number} gridHeight - Number of cells in the grid height
 * @param {number} tileWidth - Width of an isometric tile (pixels)
 * @param {number} tileHeight - Height of an isometric tile (pixels)
 * @returns {Object} - Object containing width and height of the grid in pixels
 */
export function calculateGridDimensions(gridWidth, gridHeight, tileWidth, tileHeight) {
  // Calculate the dimensions of the entire grid
  // For an isometric grid, the total width and height depend on both dimensions
  const width = (gridWidth + gridHeight) * (tileWidth / 2);
  const height = (gridWidth + gridHeight) * (tileHeight / 2);
  return { width, height };
}