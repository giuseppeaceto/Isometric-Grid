import { 
  Box, 
  ButtonGroup, 
  IconButton, 
  Tooltip, 
  Flex,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  HStack,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { useState } from 'react';
import { useScene } from '../../context/SceneContext';

/**
 * Enhanced controls for manipulating selected elements
 */
export default function ElementControls() {
  const { 
    elements, 
    selectedElementId, 
    updateElement, 
    removeElement 
  } = useScene();
  
  // Find the selected element
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
  // Local state for scale
  const [scale, setScale] = useState(1);
  
  // If no element is selected, don't render controls
  if (!selectedElement) {
    return null;
  }
  
  // Update local scale when selected element changes
  if (selectedElement.scale !== scale) {
    setScale(selectedElement.scale || 1);
  }
  
  // Handle rotation
  const handleRotate = (degrees) => {
    const currentRotation = selectedElement.rotation || 0;
    const newRotation = (currentRotation + degrees) % 360;
    updateElement(selectedElementId, { rotation: newRotation });
  };
  
  // Handle scale change
  const handleScaleChange = (newScale) => {
    setScale(newScale);
    updateElement(selectedElementId, { scale: newScale });
  };
  
  // Handle deletion
  const handleDelete = () => {
    if (window.confirm(`Delete this ${selectedElement.type}?`)) {
      removeElement(selectedElementId);
    }
  };
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      position="absolute"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      bg={bgColor}
      borderRadius="md"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={2}
      zIndex={1000}
      minWidth="280px"
    >
      <Flex direction="column" gap={2}>
        {/* Element info */}
        <Flex justify="space-between" align="center" px={2}>
          <HStack>
            <Text fontSize="sm" fontWeight="medium">
              {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
            </Text>
            <Badge colorScheme="blue" fontSize="xs">
              {selectedElement.position.x}, {selectedElement.position.y}
            </Badge>
          </HStack>
          
          <Tooltip label="Delete" placement="top">
            <IconButton
              aria-label="Delete"
              icon={<span>🗑️</span>}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={handleDelete}
            />
          </Tooltip>
        </Flex>
        
        {/* Controls */}
        <Flex justify="space-between" align="center">
          {/* Rotation controls */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Rotate Left" placement="top">
              <IconButton
                aria-label="Rotate Left"
                icon={<span>↺</span>}
                onClick={() => handleRotate(-90)}
              />
            </Tooltip>
            
            <Tooltip label="Rotate Right" placement="top">
              <IconButton
                aria-label="Rotate Right"
                icon={<span>↻</span>}
                onClick={() => handleRotate(90)}
              />
            </Tooltip>
          </ButtonGroup>
          
          {/* Scale control */}
          <Popover placement="top">
            <PopoverTrigger>
              <IconButton
                aria-label="Scale"
                icon={<span>📏</span>}
                size="sm"
                variant="outline"
              />
            </PopoverTrigger>
            <PopoverContent width="200px">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader fontSize="sm">Adjust Size</PopoverHeader>
              <PopoverBody>
                <Flex direction="column" gap={2}>
                  <Slider
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={scale}
                    onChange={handleScaleChange}
                    colorScheme="blue"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
                  <Text textAlign="center" fontSize="xs">
                    Scale: {scale.toFixed(1)}x
                  </Text>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          
          {/* Clone button */}
          <Tooltip label="Duplicate" placement="top">
            <IconButton
              aria-label="Duplicate"
              icon={<span>📋</span>}
              size="sm"
              variant="outline"
              onClick={() => {
                // We'll need to add this functionality to SceneContext
                console.log('Duplicate element');
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
}