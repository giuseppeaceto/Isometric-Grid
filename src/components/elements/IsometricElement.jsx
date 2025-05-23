import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { useScene } from '../../context/SceneContext';
import { isometricToScreen, calculateZIndex } from '../../utils/isometricUtils';

/**
 * Base component for all isometric elements in the scene
 * 
 * This component serves as the foundation for all elements that can be placed
 * on the isometric grid. It handles:
 * - Positioning in the isometric space
 * - Dragging and selection
 * - Rotation and scaling
 * - Z-index calculation for proper layering
 * 
 * All specific element types (buildings, trees, roads, etc.) extend this
 * component and provide their specific appearance and behavior.
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the element
 * @param {string} props.type - Type of element (building, tree, road, etc.)
 * @param {Object} props.position - Position on the isometric grid {x, y}
 * @param {number} props.rotation - Rotation in degrees (0, 90, 180, 270)
 * @param {number} props.scale - Scale factor for the element
 * @param {Object} props.size - Size of the element {width, height}
 * @param {string} props.imageUrl - URL to the element's image
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The rendered isometric element
 */
export default function IsometricElement({
  id,
  type,
  position,
  rotation = 0,
  scale = 1,
  size = { width: 64, height: 64 },
  imageUrl,
  children,
  ...props
}) {
  const { tileSize, zoom, offset, selectedElementId, selectElement } = useScene();
  const isSelected = selectedElementId === id;
  
  /**
   * Set up draggable functionality using DnD Kit
   * This allows the element to be moved around the grid
   */
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      id,
      type,
      isNew: false
    }
  });
  
  /**
   * Calculate screen position from isometric grid coordinates
   * This converts the grid-based position to pixel coordinates on screen
   */
  const screenPosition = isometricToScreen(
    position.x,
    position.y,
    tileSize.width,
    tileSize.height
  );
  
  /**
   * Calculate z-index based on position
   * This ensures elements are properly layered in the isometric view
   * (elements further back should appear behind elements in front)
   */
  const zIndex = calculateZIndex(position.x, position.y);
  
  /**
   * Handle element selection
   * When an element is clicked, it becomes the selected element
   * 
   * @param {React.MouseEvent} e - The click event
   */
  const handleSelect = useCallback((e) => {
    e.stopPropagation(); // Prevent the click from bubbling to the canvas
    selectElement(id);
  }, [id, selectElement]);
  
  return (
    <Box
      ref={setNodeRef}
      position="absolute"
      left={`${screenPosition.x * zoom}px`}
      top={`${screenPosition.y * zoom}px`}
      width={`${size.width * scale * zoom}px`}
      height={`${size.height * scale * zoom}px`}
      transform={`
        translate(-50%, -50%)
        rotateX(60deg)
        rotateZ(-45deg)
        rotate(${rotation}deg)
        ${transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : ''}
      `}
      transformOrigin="center center"
      zIndex={zIndex + 10} // Add 10 to ensure elements are above the grid
      cursor="pointer"
      onClick={handleSelect}
      {...attributes}
      {...listeners}
      {...props}
    >
      {/* Element content - either an image or children components */}
      <Box
        width="100%"
        height="100%"
        backgroundImage={imageUrl ? `url(${imageUrl})` : 'none'}
        backgroundSize="contain"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        border={isSelected ? '2px solid #4299E1' : 'none'} // Highlight selected elements
        borderRadius="4px"
        transition="all 0.2s"
        _hover={{ boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.6)" }} // Hover effect
      >
        {children}
      </Box>
    </Box>
  );
}