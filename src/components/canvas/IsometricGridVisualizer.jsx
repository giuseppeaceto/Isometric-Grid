import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { isometricToScreen } from '../../utils/isometricUtils';

/**
 * IsometricGridVisualizer component creates a visual representation of the isometric grid
 * using HTML5 Canvas for demonstration purposes.
 */
export default function IsometricGridVisualizer({ gridWidth = 10, gridHeight = 10, tileWidth = 64, tileHeight = 32 }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const padding = Math.max(tileWidth, tileHeight) * 2;
    
    // Calculate canvas dimensions
    const width = (gridWidth + gridHeight) * (tileWidth / 2) + padding;
    const height = (gridWidth + gridHeight) * (tileHeight / 2) + padding;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set origin to center of canvas with padding
    const originX = padding / 2;
    const originY = height / 2;
    
    // Draw grid
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        // Calculate screen position
        const { x: screenX, y: screenY } = isometricToScreen(x, y, tileWidth, tileHeight);
        
        // Draw tile
        drawIsometricTile(
          ctx, 
          originX + screenX, 
          originY + screenY - (tileHeight / 2), 
          tileWidth, 
          tileHeight,
          `${x},${y}`
        );
      }
    }
    
    // Draw axes for reference
    drawAxes(ctx, originX, originY, tileWidth, tileHeight, gridWidth, gridHeight);
    
  }, [gridWidth, gridHeight, tileWidth, tileHeight]);
  
  // Function to draw an isometric tile
  function drawIsometricTile(ctx, x, y, width, height, label) {
    // Calculate corner points
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Draw tile
    ctx.beginPath();
    ctx.moveTo(x, y); // Top point
    ctx.lineTo(x + halfWidth, y + halfHeight); // Right point
    ctx.lineTo(x, y + height); // Bottom point
    ctx.lineTo(x - halfWidth, y + halfHeight); // Left point
    ctx.closePath();
    
    // Fill with semi-transparent color
    ctx.fillStyle = 'rgba(100, 149, 237, 0.2)';
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw coordinate label
    if (label) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y + halfHeight);
    }
  }
  
  // Function to draw reference axes
  function drawAxes(ctx, originX, originY, tileWidth, tileHeight, gridWidth, gridHeight) {
    const axisLength = Math.max(gridWidth, gridHeight) * Math.max(tileWidth, tileHeight);
    
    // X-axis (isometric)
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + axisLength, originY + (axisLength / 2));
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Y-axis (isometric)
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX - axisLength, originY + (axisLength / 2));
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Z-axis (vertical)
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY - axisLength / 2);
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Labels
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
    ctx.fillText('X', originX + axisLength, originY + (axisLength / 2));
    
    ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
    ctx.fillText('Y', originX - axisLength, originY + (axisLength / 2));
    
    ctx.fillStyle = 'rgba(0, 0, 255, 0.9)';
    ctx.fillText('Z', originX, originY - axisLength / 2);
  }
  
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.900"
      p={4}
      overflow="auto"
    >
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
      />
    </Box>
  );
}