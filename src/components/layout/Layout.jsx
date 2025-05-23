import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';

/**
 * Main layout component for the application
 * Provides responsive structure for the isometric scene creator
 */
export default function Layout({ children }) {
  return (
    <Flex 
      direction="column" 
      height="100vh" 
      width="100%" 
      overflow="hidden"
    >
      {/* Header with app title and main controls */}
      <Header />
      
      {/* Main content area with sidebar and canvas */}
      <Flex 
        flex="1" 
        overflow="hidden"
        position="relative"
      >
        {/* Sidebar for element palette and controls */}
        <Sidebar />
        
        {/* Main canvas area */}
        <Box 
          flex="1" 
          position="relative" 
          overflow="hidden"
          bg="gray.900"
        >
          {children}
        </Box>
      </Flex>
      
      {/* Status bar */}
      <StatusBar />
    </Flex>
  );
}