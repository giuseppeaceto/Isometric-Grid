import { 
  Box, 
  Flex, 
  Heading, 
  IconButton, 
  ButtonGroup, 
  Tooltip, 
  useBreakpointValue,
  useColorMode,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button
} from '@chakra-ui/react';
import { useScene } from '../../context/SceneContext';
import SceneControls from '../controls/SceneControls';

/**
 * Header component with app title and main controls
 */
export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { 
    undo,
    redo,
    clearScene,
    sceneName,
    sceneModified
  } = useScene();
  
  // Modal for confirming scene clearing
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive adjustments
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const showFullTitle = useBreakpointValue({ base: false, md: true });
  const showButtons = useBreakpointValue({ base: false, sm: true });
  
  // Clear scene handler
  const handleClearScene = () => {
    onOpen();
  };
  
  // Confirm clear scene
  const confirmClearScene = () => {
    clearScene();
    onClose();
  };
  
  return (
    <>
      <Flex 
        as="header" 
        width="100%" 
        py={2} 
        px={4} 
        bg="blue.600" 
        color="white"
        alignItems="center"
        justifyContent="space-between"
        boxShadow="md"
      >
        {/* App title */}
        <Flex alignItems="center">
          <Heading size={headingSize} fontWeight="bold" mr={2}>
            {showFullTitle ? 'Isometric Scene Creator' : 'ISO Creator'}
          </Heading>
          {sceneModified && (
            <Text fontSize="sm" opacity={0.8}>*</Text>
          )}
        </Flex>
        
        {/* Scene name display */}
        <Text 
          fontSize="md" 
          fontWeight="medium" 
          display={{ base: 'none', md: 'block' }}
        >
          {sceneName}
        </Text>
        
        {/* Main controls */}
        <HStack spacing={2}>
          {showButtons && (
            <ButtonGroup size="sm" isAttached variant="solid" colorScheme="whiteAlpha">
              <Tooltip label="Undo (Ctrl+Z)">
                <IconButton
                  aria-label="Undo"
                  icon={<span>↩️</span>}
                  onClick={undo}
                />
              </Tooltip>
              
              <Tooltip label="Redo (Ctrl+Y)">
                <IconButton
                  aria-label="Redo"
                  icon={<span>↪️</span>}
                  onClick={redo}
                />
              </Tooltip>
            </ButtonGroup>
          )}
          
          {/* Scene Controls */}
          <SceneControls />
          
          <Tooltip label={colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}>
            <IconButton
              aria-label="Toggle Color Mode"
              icon={colorMode === 'light' ? <span>🌙</span> : <span>☀️</span>}
              onClick={toggleColorMode}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
            />
          </Tooltip>
        </HStack>
      </Flex>
      
      {/* Clear Scene Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Clear Scene</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to clear the scene? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmClearScene}>
              Clear Scene
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}