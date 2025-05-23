import { useMemo } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useScene } from '../../context/SceneContext';
import { isometricToScreen, calculateGridDimensions } from '../../utils/isometricUtils';

/**
 * IsometricGrid component renders the isometric grid that serves as the foundation
 * for element placement in the isometric scene.
 */
export default function IsometricGrid({ showGrid = true }) {
  const { gridSize, tileSize, zoom, offset } = useScene();
  
  // Calculate grid dimensions
  const dimensions = useMemo(() => 
    calculateGridDimensions(gridSize.width, gridSize.height, tileSize.width, tileSize.height),
    [gridSize, tileSize]
  );
  
  // Generate grid cells
  const gridCells = useMemo(() => {
    const cells = [];
    
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        // Calculate screen position for this grid cell
        const { x: screenX, y: screenY } = isometricToScreen(x, y, tileSize.width, tileSize.height);
        
        cells.push({
          id: `cell-${x}-${y}`,
          x: screenX,
          y: screenY,
          gridX: x,
          gridY: y
        });
      }
    }
    
    return cells;
  }, [gridSize, tileSize]);
  
  // Color mode values
  const gridColor = useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)');
  const gridHoverColor = useColorModeValue('rgba(0, 0, 0, 0.4)', 'rgba(255, 255, 255, 0.4)');
  const axisColor = useColorModeValue('rgba(66, 153, 225, 0.6)', 'rgba(66, 153, 225, 0.6)');
  
  return (
    <Box
      position="relative"
      width={`${dimensions.width * zoom}px`}
      height={`${dimensions.height * zoom}px`}
      transform={`translate(${offset.x}px, ${offset.y}px)`}
      transformOrigin="top left"
    >
      {/* Grid container */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        pointerEvents="none"
        opacity={showGrid ? 1 : 0}
        transition="opacity 0.2s ease"
      >
        {/* Render grid cells */}
        {gridCells.map((cell) => {
          // Highlight the main axes
          const isAxis = cell.gridX === 0 || cell.gridY === 0;
          
          return (
            <Box
              key={cell.id}
              position="absolute"
              left={`${cell.x * zoom}px`}
              top={`${cell.y * zoom}px`}
              width={`${tileSize.width * zoom}px`}
              height={`${tileSize.height * zoom}px`}
              transform={`translate(-50%, -50%) rotateX(60deg) rotateZ(-45deg)`}
              transformOrigin="center center"
              border={`1px solid ${isAxis ? axisColor : gridColor}`}
              _hover={{ border: `1px solid ${gridHoverColor}` }}
              pointerEvents="none"
              zIndex={cell.gridX + cell.gridY}
              data-grid-x={cell.gridX}
              data-grid-y={cell.gridY}
            />
          );
        })}
        
        {/* Origin marker */}
        <Box
          position="absolute"
          left={`${isometricToScreen(0, 0, tileSize.width, tileSize.height).x * zoom}px`}
          top={`${isometricToScreen(0, 0, tileSize.width, tileSize.height).y * zoom}px`}
          width={`${6 * zoom}px`}
          height={`${6 * zoom}px`}
          borderRadius="50%"
          bg={axisColor}
          transform="translate(-50%, -50%)"
          zIndex={1000}
        />
      </Box>
    </Box>
  );
}