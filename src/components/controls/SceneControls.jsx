import { useState, useRef } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  VStack,
  HStack,
  Text,
  useDisclosure,
  useToast,
  List,
  ListItem,
  Flex,
  Divider,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import { useScene } from '../../context/SceneContext';
import { getSavedScenes, deleteScene } from '../../utils/sceneUtils';

/**
 * SceneControls component for managing scenes (save, load, export)
 */
export default function SceneControls() {
  const {
    sceneName,
    sceneModified,
    createNewScene,
    saveScene,
    loadScene,
    exportSceneJSON,
    exportSceneImage,
    importScene
  } = useScene();
  
  // Toast for notifications
  const toast = useToast();
  
  // File input ref for importing scenes
  const fileInputRef = useRef(null);
  
  // State for saved scenes list
  const [savedScenes, setSavedScenes] = useState([]);
  
  // State for scene name input
  const [newSceneName, setNewSceneName] = useState('');
  
  // State for export format
  const [exportFormat, setExportFormat] = useState('png');
  
  // Modal states
  const {
    isOpen: isSaveModalOpen,
    onOpen: onSaveModalOpen,
    onClose: onSaveModalClose
  } = useDisclosure();
  
  const {
    isOpen: isLoadModalOpen,
    onOpen: onLoadModalOpen,
    onClose: onLoadModalClose
  } = useDisclosure();
  
  const {
    isOpen: isExportModalOpen,
    onOpen: onExportModalOpen,
    onClose: onExportModalClose
  } = useDisclosure();
  
  const {
    isOpen: isNewSceneModalOpen,
    onOpen: onNewSceneModalOpen,
    onClose: onNewSceneModalClose
  } = useDisclosure();
  
  // Handle opening the save modal
  const handleOpenSaveModal = () => {
    setNewSceneName(sceneName);
    onSaveModalOpen();
  };
  
  // Handle opening the load modal
  const handleOpenLoadModal = () => {
    // Refresh the list of saved scenes
    setSavedScenes(getSavedScenes());
    onLoadModalOpen();
  };
  
  // Handle saving a scene
  const handleSaveScene = () => {
    if (!newSceneName.trim()) {
      toast({
        title: 'Scene name required',
        description: 'Please enter a name for your scene.',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    const success = saveScene(newSceneName.trim());
    
    if (success) {
      toast({
        title: 'Scene saved',
        description: `Scene "${newSceneName}" has been saved.`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onSaveModalClose();
    } else {
      toast({
        title: 'Save failed',
        description: 'There was an error saving your scene.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  // Handle loading a scene
  const handleLoadScene = (name) => {
    const success = loadScene(name);
    
    if (success) {
      toast({
        title: 'Scene loaded',
        description: `Scene "${name}" has been loaded.`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onLoadModalClose();
    } else {
      toast({
        title: 'Load failed',
        description: `There was an error loading scene "${name}".`,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  // Handle deleting a scene
  const handleDeleteScene = (name, event) => {
    // Stop event propagation to prevent loading the scene
    event.stopPropagation();
    
    const success = deleteScene(name);
    
    if (success) {
      // Update the list of saved scenes
      setSavedScenes(getSavedScenes());
      
      toast({
        title: 'Scene deleted',
        description: `Scene "${name}" has been deleted.`,
        status: 'info',
        duration: 3000,
        isClosable: true
      });
    } else {
      toast({
        title: 'Delete failed',
        description: `There was an error deleting scene "${name}".`,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  // Handle exporting a scene
  const handleExportScene = () => {
    let success = false;
    
    if (exportFormat === 'json') {
      success = exportSceneJSON(sceneName);
    } else {
      success = exportSceneImage(sceneName, exportFormat);
    }
    
    if (success) {
      toast({
        title: 'Scene exported',
        description: `Scene has been exported as ${exportFormat.toUpperCase()}.`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onExportModalClose();
    } else {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your scene.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  // Handle creating a new scene
  const handleNewScene = () => {
    if (sceneModified) {
      onNewSceneModalOpen();
    } else {
      createNewScene();
      toast({
        title: 'New scene created',
        status: 'info',
        duration: 2000,
        isClosable: true
      });
    }
  };
  
  // Handle confirming new scene creation
  const handleConfirmNewScene = () => {
    createNewScene();
    onNewSceneModalClose();
    toast({
      title: 'New scene created',
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };
  
  // Handle importing a scene
  const handleImportScene = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file selection for import
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const success = await importScene(file);
    
    if (success) {
      toast({
        title: 'Scene imported',
        description: 'The scene has been imported successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } else {
      toast({
        title: 'Import failed',
        description: 'There was an error importing the scene.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
    
    // Reset the file input
    event.target.value = '';
  };
  
  return (
    <>
      {/* Scene Controls Menu */}
      <Menu>
        <Tooltip label="Scene Management">
          <MenuButton
            as={Button}
            size="sm"
            variant="solid"
            colorScheme="blue"
            rightIcon={<span>▼</span>}
          >
            Scene
          </MenuButton>
        </Tooltip>
        <MenuList>
          <MenuItem onClick={handleNewScene} icon={<span>🆕</span>}>
            New Scene
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleOpenSaveModal} icon={<span>💾</span>}>
            Save Scene
          </MenuItem>
          <MenuItem onClick={handleOpenLoadModal} icon={<span>📂</span>}>
            Load Scene
          </MenuItem>
          <MenuItem onClick={handleImportScene} icon={<span>📥</span>}>
            Import Scene
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={onExportModalOpen} icon={<span>📤</span>}>
            Export Scene
          </MenuItem>
        </MenuList>
      </Menu>
      
      {/* Hidden file input for importing scenes */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
      
      {/* Save Scene Modal */}
      <Modal isOpen={isSaveModalOpen} onClose={onSaveModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Scene</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Scene Name</FormLabel>
              <Input
                value={newSceneName}
                onChange={(e) => setNewSceneName(e.target.value)}
                placeholder="Enter a name for your scene"
              />
              <FormHelperText>
                This will save your scene to the browser's local storage.
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSaveModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveScene}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Load Scene Modal */}
      <Modal isOpen={isLoadModalOpen} onClose={onLoadModalClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Load Scene</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {savedScenes.length > 0 ? (
              <List spacing={2}>
                {savedScenes.map((scene) => (
                  <ListItem 
                    key={scene.name}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
                    onClick={() => handleLoadScene(scene.name)}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box>
                        <Text fontWeight="bold">{scene.name}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(scene.timestamp).toLocaleString()}
                        </Text>
                      </Box>
                      <IconButton
                        aria-label="Delete scene"
                        icon={<span>🗑️</span>}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={(e) => handleDeleteScene(scene.name, e)}
                      />
                    </Flex>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text>No saved scenes found.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onLoadModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Export Scene Modal */}
      <Modal isOpen={isExportModalOpen} onClose={onExportModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Export Scene</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Export Format</FormLabel>
                <RadioGroup value={exportFormat} onChange={setExportFormat}>
                  <Stack direction="row" spacing={5}>
                    <Radio value="png">PNG Image</Radio>
                    <Radio value="jpeg">JPEG Image</Radio>
                    <Radio value="json">JSON Data</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              
              <FormControl>
                <FormLabel>File Name</FormLabel>
                <Input
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  placeholder="Enter a name for your file"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onExportModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleExportScene}>
              Export
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* New Scene Confirmation Modal */}
      <Modal isOpen={isNewSceneModalOpen} onClose={onNewSceneModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Scene</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              You have unsaved changes. Are you sure you want to create a new scene?
              All unsaved changes will be lost.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNewSceneModalClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleConfirmNewScene}>
              Create New Scene
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}