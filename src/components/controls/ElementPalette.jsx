import { 
  Box, 
  SimpleGrid, 
  Image, 
  Text, 
  Tooltip, 
  Badge,
  Heading,
  Divider,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { ELEMENT_METADATA } from '../elements';

/**
 * Draggable element item for the palette
 */
function DraggableElementItem({ element }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${element.id}`,
    data: {
      type: element.type,
      isNew: true
    }
  });
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBorderColor = useColorModeValue('blue.300', 'blue.400');
  
  return (
    <Tooltip 
      label={element.description} 
      placement="top" 
      hasArrow
      openDelay={500}
    >
      <Box
        ref={setNodeRef}
        p={2}
        borderWidth="1px"
        borderRadius="md"
        bg={bgColor}
        cursor="grab"
        opacity={isDragging ? 0.5 : 1}
        transition="all 0.2s"
        _hover={{ 
          boxShadow: "md",
          borderColor: hoverBorderColor,
          bg: hoverBgColor
        }}
        borderColor={borderColor}
        {...attributes}
        {...listeners}
      >
        <Flex direction="column" align="center">
          <Box
            height="60px"
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={1}
          >
            <Image
              src={element.imageUrl}
              alt={element.name}
              maxH="100%"
              objectFit="contain"
              fallbackSrc="https://via.placeholder.com/60"
              draggable={false}
            />
          </Box>
          <Text 
            fontSize="xs" 
            fontWeight="medium" 
            textAlign="center"
            noOfLines={1}
          >
            {element.name}
          </Text>
        </Flex>
      </Box>
    </Tooltip>
  );
}

/**
 * Groups elements by category
 */
function groupElementsByCategory(elements) {
  const groups = {};
  
  elements.forEach(element => {
    const category = element.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(element);
  });
  
  return groups;
}

/**
 * Enhanced palette of available elements that can be dragged onto the canvas
 */
export default function ElementPalette() {
  // Add categories to elements for organization
  const elementsWithCategories = ELEMENT_METADATA.map(element => ({
    ...element,
    category: element.type.includes('building') ? 'Buildings' : 
              element.type.includes('tree') || element.type.includes('park') ? 'Nature' : 
              element.type.includes('road') ? 'Infrastructure' : 'Other'
  }));
  
  // Group elements by category
  const groupedElements = groupElementsByCategory(elementsWithCategories);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'gray.200');
  
  return (
    <Box
      width="100%"
      height="100%"
      overflow="auto"
      p={2}
    >
      {Object.entries(groupedElements).map(([category, elements]) => (
        <Box key={category} mb={4}>
          <Heading 
            size="xs" 
            mb={2} 
            color={headingColor}
            display="flex"
            alignItems="center"
          >
            {category}
            <Badge ml={2} colorScheme="blue" fontSize="xs">
              {elements.length}
            </Badge>
          </Heading>
          
          <SimpleGrid columns={2} spacing={2}>
            {elements.map((element) => (
              <DraggableElementItem key={element.id} element={element} />
            ))}
          </SimpleGrid>
          
          {/* Divider after each category except the last one */}
          {Object.keys(groupedElements).indexOf(category) < Object.keys(groupedElements).length - 1 && (
            <Divider my={3} />
          )}
        </Box>
      ))}
      
      <Box py={2} textAlign="center" fontSize="xs" color="gray.500" mt={4}>
        <Text>Drag elements to place them on the grid</Text>
      </Box>
    </Box>
  );
}