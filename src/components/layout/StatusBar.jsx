import { 
  Box, 
  Flex, 
  Text, 
  HStack, 
  Tooltip, 
  IconButton,
  useBreakpointValue,
  Badge
} from '@chakra-ui/react';
import { useScene } from '../../context/SceneContext';

/**
 * StatusBar component to display scene information and additional controls
 */
export default function StatusBar() {
  const { 
    zoom, 
    updateZoom, 
    elements, 
    selectedElementId,
    offset,
    sceneName,
    sceneModified
  } = useScene();
  
  // Responsive adjustments
  const showDetails = useBreakpointValue({ base: false, md: true });
  
  // Format zoom as percentage
  const zoomPercentage = Math.round(zoom * 100);
  
  // Get selected element info
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
  // Handle zoom controls
  const handleZoomIn = () => {
    updateZoom(Math.min(2, zoom + 0.1));
  };
  
  const handleZoomOut = () => {
    updateZoom(Math.max(0.5, zoom - 0.1));
  };
  
  const handleZoomReset = () => {
    updateZoom(1);
  };
  
  return (
    <Flex 
      as="footer" 
      width="100%" 
      py={1} 
      px={4} 
      bg="gray.100" 
      borderTop="1px solid" 
      borderColor="gray.200"
      alignItems="center"
      justifyContent="space-between"
      fontSize="sm"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700"
      }}
    >
      {/* Left side: Scene info */}
      <HStack spacing={4}>
        <HStack>
          <Text>Scene:</Text>
          <Text fontWeight="medium">{sceneName}</Text>
          {sceneModified && (
            <Badge colorScheme="yellow" variant="subtle" fontSize="xs">
              Modified
            </Badge>
          )}
        </HStack>
        
        <Text>Elements: {elements.length}</Text>
        
        {showDetails && selectedElement && (
          <Text>
            Selected: {selectedElement.type} at ({selectedElement.position.x}, {selectedElement.position.y})
          </Text>
        )}
      </HStack>
      
      {/* Right side: Zoom controls */}
      <HStack spacing={1}>
        <Text mr={2}>Zoom: {zoomPercentage}%</Text>
        
        <Tooltip label="Zoom Out">
          <IconButton
            aria-label="Zoom Out"
            icon={<span>➖</span>}
            onClick={handleZoomOut}
            size="xs"
            variant="ghost"
          />
        </Tooltip>
        
        <Tooltip label="Reset Zoom">
          <IconButton
            aria-label="Reset Zoom"
            icon={<span>🔍</span>}
            onClick={handleZoomReset}
            size="xs"
            variant="ghost"
          />
        </Tooltip>
        
        <Tooltip label="Zoom In">
          <IconButton
            aria-label="Zoom In"
            icon={<span>➕</span>}
            onClick={handleZoomIn}
            size="xs"
            variant="ghost"
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
}