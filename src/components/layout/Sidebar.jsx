import { 
  Box, 
  Flex, 
  Heading, 
  IconButton, 
  Tooltip, 
  Divider,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { useState } from 'react';
import ElementPalette from '../controls/ElementPalette';

/**
 * Sidebar component for element palette and additional controls
 */
export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive adjustments
  const sidebarDisplay = useBreakpointValue({ base: 'none', lg: 'block' });
  const sidebarWidth = useBreakpointValue({ base: '100%', md: '300px', lg: '280px' });
  
  // For mobile, we'll use a drawer instead of a fixed sidebar
  const isMobile = useBreakpointValue({ base: true, lg: false });
  
  // Sidebar content
  const SidebarContent = () => (
    <Flex direction="column" h="100%" overflow="hidden">
      <Heading size="sm" p={4}>Tools</Heading>
      
      <Tabs isFitted variant="enclosed" flex="1" display="flex" flexDirection="column">
        <TabList>
          <Tab>Elements</Tab>
          <Tab>Settings</Tab>
        </TabList>
        
        <TabPanels flex="1" overflow="auto">
          <TabPanel p={2}>
            <ElementPalette />
          </TabPanel>
          <TabPanel>
            <Box p={2}>
              <Heading size="xs" mb={2}>Grid Settings</Heading>
              {/* Grid settings will go here */}
              
              <Divider my={4} />
              
              <Heading size="xs" mb={2}>View Settings</Heading>
              {/* View settings will go here */}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
  
  // Mobile toggle button
  const MobileToggle = () => (
    <Box 
      position="absolute" 
      top="4" 
      left="4" 
      zIndex="10"
      display={{ base: 'block', lg: 'none' }}
    >
      <Tooltip label="Open Tools">
        <IconButton
          aria-label="Open Tools"
          icon={<span>🧰</span>}
          onClick={onOpen}
          colorScheme="blue"
          size="md"
          boxShadow="md"
        />
      </Tooltip>
    </Box>
  );
  
  return (
    <>
      {/* Mobile toggle button */}
      <MobileToggle />
      
      {/* Desktop sidebar */}
      <Box
        width={sidebarWidth}
        height="100%"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        display={sidebarDisplay}
        _dark={{
          bg: "gray.800",
          borderColor: "gray.700"
        }}
      >
        <SidebarContent />
      </Box>
      
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Tools</DrawerHeader>
            <DrawerBody p={0}>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}