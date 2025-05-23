import {
  Box,
  ButtonGroup,
  IconButton,
  Tooltip,
  Flex,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Switch,
  FormControl,
  FormLabel,
  HStack,
  Divider,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useScene } from '../../context/SceneContext';
import HelpModal from './HelpModal';

/**
 * Toolbar component with canvas controls
 */
export default function Toolbar() {
  const { 
    zoom, 
    updateZoom, 
    offset, 
    updateOffset,
    gridSize,
    updateGridSize,
    showGrid,
    toggleGridVisibility,
    undo,
    redo
  } = useScene();
  
  // Help modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive adjustments
  const toolbarPosition = useBreakpointValue({ 
    base: { top: '70px', right: '20px' },
    lg: { top: '20px', left: '20px' }
  });
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Handle zoom controls
  const handleZoomIn = () => {
    updateZoom(Math.min(2, zoom + 0.1));
  };
  
  const handleZoomOut = () => {
    updateZoom(Math.max(0.5, zoom - 0.1));
  };
  
  const handleZoomReset = () => {
    updateZoom(1);
    updateOffset({ x: 0, y: 0 });
  };
  
  // Handle grid visibility toggle
  const handleGridVisibilityChange = (e) => {
    toggleGridVisibility();
  };
  
  return (
    <>
      <Box
        position="absolute"
        top={toolbarPosition.top}
        left={toolbarPosition.left}
        right={toolbarPosition.right}
        zIndex={900}
      >
        <Flex
          direction="column"
          bg={bgColor}
          borderRadius="md"
          boxShadow="md"
          borderWidth="1px"
          borderColor={borderColor}
          p={2}
          gap={2}
        >
          {/* History controls */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Undo (Ctrl+Z)" placement="right">
              <IconButton
                aria-label="Undo"
                icon={<span>↩️</span>}
                onClick={undo}
              />
            </Tooltip>
            
            <Tooltip label="Redo (Ctrl+Y)" placement="right">
              <IconButton
                aria-label="Redo"
                icon={<span>↪️</span>}
                onClick={redo}
              />
            </Tooltip>
          </ButtonGroup>
          
          <Divider />
          
          {/* View controls */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Zoom Out (Ctrl+-)" placement="right">
              <IconButton
                aria-label="Zoom Out"
                icon={<span>➖</span>}
                onClick={handleZoomOut}
              />
            </Tooltip>
            
            <Tooltip label="Reset View (Ctrl+0)" placement="right">
              <IconButton
                aria-label="Reset View"
                icon={<span>🔍</span>}
                onClick={handleZoomReset}
              />
            </Tooltip>
            
            <Tooltip label="Zoom In (Ctrl++)" placement="right">
              <IconButton
                aria-label="Zoom In"
                icon={<span>➕</span>}
                onClick={handleZoomIn}
              />
            </Tooltip>
          </ButtonGroup>
          
          <Divider />
          
          {/* Grid controls */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Grid Settings" placement="right">
              <Popover placement="right">
                <PopoverTrigger>
                  <IconButton
                    aria-label="Grid Settings"
                    icon={<span>📏</span>}
                  />
                </PopoverTrigger>
                <PopoverContent width="200px">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontSize="sm">Grid Settings</PopoverHeader>
                  <PopoverBody>
                    <Flex direction="column" gap={3}>
                      <FormControl display="flex" alignItems="center" size="sm">
                        <FormLabel htmlFor="show-grid" mb="0" fontSize="sm">
                          Show Grid
                        </FormLabel>
                        <Switch 
                          id="show-grid" 
                          isChecked={showGrid}
                          onChange={handleGridVisibilityChange}
                          colorScheme="blue"
                        />
                      </FormControl>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Tooltip>
            
            <Tooltip label="Center View" placement="right">
              <IconButton
                aria-label="Center View"
                icon={<span>⊕</span>}
                onClick={() => updateOffset({ x: 0, y: 0 })}
              />
            </Tooltip>
          </ButtonGroup>
          
          <Divider />
          
          {/* Help button */}
          <Tooltip label="Help" placement="right">
            <IconButton
              aria-label="Help"
              icon={<span>❓</span>}
              size="sm"
              variant="outline"
              onClick={onOpen}
            />
          </Tooltip>
        </Flex>
      </Box>
      
      {/* Help Modal */}
      <HelpModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}