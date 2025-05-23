import { useState, useEffect } from 'react';
import { Box, Button, HStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';
import { useScene } from '../../context/SceneContext';
import IsometricCanvas from './IsometricCanvas';
import '../../styles/isometric.css';

/**
 * IsometricDemo component provides a simple interface to test and demonstrate
 * the isometric grid rendering capabilities.
 */
export default function IsometricDemo() {
  const { updateGridSize, updateTileSize, gridSize, tileSize } = useScene();
  const [gridWidth, setGridWidth] = useState(gridSize.width);
  const [gridHeight, setGridHeight] = useState(gridSize.height);
  const [tileWidth, setTileWidth] = useState(tileSize.width);
  const [tileHeight, setTileHeight] = useState(tileSize.height);
  
  // Update scene context when slider values change
  useEffect(() => {
    updateGridSize({ width: gridWidth, height: gridHeight });
  }, [gridWidth, gridHeight, updateGridSize]);
  
  useEffect(() => {
    updateTileSize({ width: tileWidth, height: tileHeight });
  }, [tileWidth, tileHeight, updateTileSize]);
  
  return (
    <Box p={4}>
      <Box mb={4}>
        <Text mb={2}>Grid Size Controls</Text>
        <HStack spacing={4} mb={4}>
          <Box flex="1">
            <Text fontSize="sm">Width: {gridWidth}</Text>
            <Slider 
              min={5} 
              max={20} 
              value={gridWidth} 
              onChange={setGridWidth}
              colorScheme="blue"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          
          <Box flex="1">
            <Text fontSize="sm">Height: {gridHeight}</Text>
            <Slider 
              min={5} 
              max={20} 
              value={gridHeight} 
              onChange={setGridHeight}
              colorScheme="blue"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </HStack>
        
        <Text mb={2}>Tile Size Controls</Text>
        <HStack spacing={4}>
          <Box flex="1">
            <Text fontSize="sm">Width: {tileWidth}px</Text>
            <Slider 
              min={32} 
              max={128} 
              step={8}
              value={tileWidth} 
              onChange={setTileWidth}
              colorScheme="green"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          
          <Box flex="1">
            <Text fontSize="sm">Height: {tileHeight}px</Text>
            <Slider 
              min={16} 
              max={64} 
              step={4}
              value={tileHeight} 
              onChange={setTileHeight}
              colorScheme="green"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </HStack>
      </Box>
      
      <Box 
        border="1px solid" 
        borderColor="gray.200" 
        borderRadius="md" 
        overflow="hidden"
        height="500px"
      >
        <IsometricCanvas />
      </Box>
      
      <Box mt={4} fontSize="sm" color="gray.500">
        <Text>Navigation Controls:</Text>
        <Text>- Pan: Middle mouse button or Ctrl+drag</Text>
        <Text>- Zoom: Ctrl+mouse wheel</Text>
      </Box>
    </Box>
  );
}