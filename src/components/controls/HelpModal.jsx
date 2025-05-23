import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Flex,
  Heading,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue
} from '@chakra-ui/react';

/**
 * Help modal component that displays instructions and keyboard shortcuts
 */
export default function HelpModal({ isOpen, onClose }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>Isometric Scene Creator Help</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={6}>
            <Heading size="sm" mb={2}>Getting Started</Heading>
            <Text mb={2}>
              The Isometric Scene Creator allows you to design isometric scenes by placing and arranging elements on an isometric grid.
            </Text>
            <Text>
              Drag elements from the palette on the right side onto the canvas to place them. Click on placed elements to select them and use the controls to manipulate them.
            </Text>
          </Box>
          
          <Divider my={4} />
          
          <Box mb={6}>
            <Heading size="sm" mb={3}>Navigation Controls</Heading>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Action</Th>
                  <Th>Control</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Pan Canvas</Td>
                  <Td>Middle mouse button drag or Ctrl+drag</Td>
                </Tr>
                <Tr>
                  <Td>Zoom In/Out</Td>
                  <Td>Ctrl+scroll wheel or use zoom buttons</Td>
                </Tr>
                <Tr>
                  <Td>Select Element</Td>
                  <Td>Click on an element</Td>
                </Tr>
                <Tr>
                  <Td>Move Element</Td>
                  <Td>Drag a selected element</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          
          <Divider my={4} />
          
          <Box mb={6}>
            <Heading size="sm" mb={3}>Keyboard Shortcuts</Heading>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Action</Th>
                  <Th>Shortcut</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Undo</Td>
                  <Td>Ctrl+Z</Td>
                </Tr>
                <Tr>
                  <Td>Redo</Td>
                  <Td>Ctrl+Y or Ctrl+Shift+Z</Td>
                </Tr>
                <Tr>
                  <Td>Delete Selected</Td>
                  <Td>Delete or Backspace</Td>
                </Tr>
                <Tr>
                  <Td>Duplicate Selected</Td>
                  <Td>Ctrl+D</Td>
                </Tr>
                <Tr>
                  <Td>Reset View</Td>
                  <Td>Ctrl+0</Td>
                </Tr>
                <Tr>
                  <Td>Zoom In</Td>
                  <Td>Ctrl++</Td>
                </Tr>
                <Tr>
                  <Td>Zoom Out</Td>
                  <Td>Ctrl+-</Td>
                </Tr>
                <Tr>
                  <Td>Toggle Grid</Td>
                  <Td>G</Td>
                </Tr>
                <Tr>
                  <Td>Pan View</Td>
                  <Td>Arrow Keys</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          
          <Divider my={4} />
          
          <Box>
            <Heading size="sm" mb={2}>Tips</Heading>
            <Text mb={2}>
              • Elements are automatically placed on the grid when dragged from the palette.
            </Text>
            <Text mb={2}>
              • Use the rotation controls to orient elements in different directions.
            </Text>
            <Text mb={2}>
              • The grid can be toggled on/off for a cleaner view of your scene.
            </Text>
            <Text>
              • For precise placement, use the grid as a guide and pay attention to the coordinates in the status bar.
            </Text>
          </Box>
        </ModalBody>
        
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}