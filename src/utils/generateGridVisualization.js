/**
 * Script to generate a visual representation of the isometric grid
 * This can be used to demonstrate the isometric rendering system
 */

// Import the isometric utility functions
import { isometricToScreen, calculateGridDimensions } from './isometricUtils.js';

/**
 * Generate an SVG representation of an isometric grid
 * @param {number} gridWidth - Width of the grid in cells
 * @param {number} gridHeight - Height of the grid in cells
 * @param {number} tileWidth - Width of each tile in pixels
 * @param {number} tileHeight - Height of each tile in pixels
 * @returns {string} - SVG markup as a string
 */
export function generateIsometricGridSVG(gridWidth = 10, gridHeight = 10, tileWidth = 64, tileHeight = 32) {
  // Calculate dimensions
  const dimensions = calculateGridDimensions(gridWidth, gridHeight, tileWidth, tileHeight);
  const padding = Math.max(tileWidth, tileHeight) * 2;
  
  // Calculate SVG dimensions
  const svgWidth = dimensions.width + padding;
  const svgHeight = dimensions.height + padding;
  
  // Calculate origin (center of the SVG)
  const originX = svgWidth / 2;
  const originY = svgHeight / 2;
  
  // Start SVG markup
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Add background
  svg += `<rect width="100%" height="100%" fill="#1a202c" />`;
  
  // Draw grid cells
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      // Calculate screen position
      const { x: screenX, y: screenY } = isometricToScreen(x, y, tileWidth, tileHeight);
      
      // Adjust for origin
      const adjustedX = originX + screenX;
      const adjustedY = originY + screenY;
      
      // Calculate diamond points
      const points = [
        `${adjustedX},${adjustedY - tileHeight / 2}`,                    // Top
        `${adjustedX + tileWidth / 2},${adjustedY}`,                     // Right
        `${adjustedX},${adjustedY + tileHeight / 2}`,                    // Bottom
        `${adjustedX - tileWidth / 2},${adjustedY}`,                     // Left
      ].join(' ');
      
      // Add cell to SVG
      svg += `<polygon points="${points}" fill="rgba(100, 149, 237, 0.2)" stroke="rgba(255, 255, 255, 0.5)" stroke-width="1" />`;
      
      // Add coordinate text
      svg += `<text x="${adjustedX}" y="${adjustedY}" font-family="Arial" font-size="10" fill="rgba(255, 255, 255, 0.7)" text-anchor="middle">${x},${y}</text>`;
    }
  }
  
  // Draw axes
  const axisLength = Math.max(gridWidth, gridHeight) * Math.max(tileWidth, tileHeight) / 2;
  
  // X-axis (isometric)
  svg += `<line x1="${originX}" y1="${originY}" x2="${originX + axisLength}" y2="${originY + axisLength / 2}" stroke="rgba(255, 0, 0, 0.7)" stroke-width="2" />`;
  svg += `<text x="${originX + axisLength + 10}" y="${originY + axisLength / 2}" font-family="Arial" font-size="14" fill="rgba(255, 0, 0, 0.9)">X</text>`;
  
  // Y-axis (isometric)
  svg += `<line x1="${originX}" y1="${originY}" x2="${originX - axisLength}" y2="${originY + axisLength / 2}" stroke="rgba(0, 255, 0, 0.7)" stroke-width="2" />`;
  svg += `<text x="${originX - axisLength - 10}" y="${originY + axisLength / 2}" font-family="Arial" font-size="14" fill="rgba(0, 255, 0, 0.9)">Y</text>`;
  
  // Z-axis (vertical)
  svg += `<line x1="${originX}" y1="${originY}" x2="${originX}" y2="${originY - axisLength}" stroke="rgba(0, 0, 255, 0.7)" stroke-width="2" />`;
  svg += `<text x="${originX}" y="${originY - axisLength - 10}" font-family="Arial" font-size="14" fill="rgba(0, 0, 255, 0.9)">Z</text>`;
  
  // Add title and description
  svg += `<text x="${svgWidth / 2}" y="30" font-family="Arial" font-size="20" fill="white" text-anchor="middle">Isometric Grid Visualization</text>`;
  svg += `<text x="${svgWidth / 2}" y="60" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Grid Size: ${gridWidth}x${gridHeight}, Tile Size: ${tileWidth}x${tileHeight}</text>`;
  
  // Close SVG
  svg += `</svg>`;
  
  return svg;
}

/**
 * Save the SVG to a file
 * @param {string} svg - SVG markup as a string
 * @param {string} filename - Name of the file to save
 */
export function saveSVGToFile(svg, filename) {
  // In a browser environment, this would create a download
  // In a Node.js environment, this would require fs module
  console.log(`SVG generated. In a real environment, this would save to ${filename}`);
  console.log(svg.substring(0, 100) + '...');
  
  // Return the SVG for testing
  return svg;
}

// Example usage:
// const svg = generateIsometricGridSVG(10, 10, 64, 32);
// saveSVGToFile(svg, 'isometric-grid.svg');