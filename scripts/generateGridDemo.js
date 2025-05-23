// Script to generate an SVG visualization of the isometric grid

// Import the utility functions
import { isometricToScreen, calculateGridDimensions } from '../src/utils/isometricUtils.js';
import fs from 'fs';
import path from 'path';

/**
 * Generate an SVG representation of an isometric grid
 * @param {number} gridWidth - Width of the grid in cells
 * @param {number} gridHeight - Height of the grid in cells
 * @param {number} tileWidth - Width of each tile in pixels
 * @param {number} tileHeight - Height of each tile in pixels
 * @returns {string} - SVG markup as a string
 */
function generateIsometricGridSVG(gridWidth = 10, gridHeight = 10, tileWidth = 64, tileHeight = 32) {
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
      const screenX = (x - y) * (tileWidth / 2);
      const screenY = (x + y) * (tileHeight / 2);
      
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

// Generate SVG for different grid sizes
const sizes = [
  { gridWidth: 5, gridHeight: 5, tileWidth: 64, tileHeight: 32 },
  { gridWidth: 10, gridHeight: 10, tileWidth: 64, tileHeight: 32 },
  { gridWidth: 8, gridHeight: 8, tileWidth: 80, tileHeight: 40 }
];

// Create public/assets directory if it doesn't exist
const assetsDir = path.join(process.cwd(), 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate and save SVGs
sizes.forEach((size, index) => {
  const { gridWidth, gridHeight, tileWidth, tileHeight } = size;
  const svg = generateIsometricGridSVG(gridWidth, gridHeight, tileWidth, tileHeight);
  const filename = `isometric-grid-${gridWidth}x${gridHeight}.svg`;
  const filePath = path.join(assetsDir, filename);
  
  fs.writeFileSync(filePath, svg);
  console.log(`Generated ${filename}`);
});

console.log('SVG generation complete!');