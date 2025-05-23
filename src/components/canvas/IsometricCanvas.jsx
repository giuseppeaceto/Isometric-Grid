import { useRef, useState, useCallback, useEffect } from 'react';
import { Box, useEventListener } from '@chakra-ui/react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useScene } from '../../context/SceneContext';
import { useDragDrop } from '../../hooks/useDragDrop';
import IsometricGrid from './IsometricGrid';
import ElementControls from '../controls/ElementControls';
import { getElementComponent } from '../elements';

/**
 * IsometricCanvas component
 * 
 * This is the main container for the isometric scene. It handles:
 * - Rendering the isometric grid and placed elements
 * - Pan and zoom interactions
 * - Element selection
 * - Drag and drop functionality for element placement
 * - Touch interactions for mobile devices
 * 
 * The canvas uses a combination of CSS transforms and absolute positioning
 * to create the isometric effect and allow for proper element placement.
 * 
 * @returns {JSX.Element} The rendered isometric canvas
 */
export default function IsometricCanvas() {
  const { 
    zoom, 
    offset, 
    updateOffset, 
    updateZoom, 
    elements, 
    selectElement,
    selectedElementId,
    showGrid,
    updateCursorGridPosition,
    setSceneCanvasRef
  } = useScene();
  
  // Reference to the canvas DOM element
  const canvasRef = useRef(null);
  
  // State for handling pan interactions
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  /**
   * Register canvas ref with context for image export functionality
   * This allows other components to access the canvas for screenshot generation
   */
  useEffect(() => {
    if (canvasRef.current) {
      setSceneCanvasRef(canvasRef.current);
    }
  }, [canvasRef, setSceneCanvasRef]);
  
  /**
   * Configure DnD sensors with better touch support
   * The activation constraints help prevent accidental drags
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
        tolerance: 5, // Tolerance for slight movements
      },
    })
  );
  
  // Initialize drag and drop functionality
  const { calculateGridPosition } = useDragDrop();
  
  /**
   * Handle mouse down events on the canvas
   * This initiates panning or handles element deselection
   * 
   * @param {MouseEvent} e - The mouse down event
   */
  const handleMouseDown = useCallback((e) => {
    // Only pan with middle mouse button or when holding space/ctrl/alt
    if (e.button === 1 || e.ctrlKey || e.altKey || e.shiftKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setStartOffset({ ...offset });
      e.preventDefault();
    } else if (e.target === canvasRef.current || e.target.classList.contains('canvas-background')) {
      // Deselect when clicking on empty canvas
      selectElement(null);
    }
  }, [offset, selectElement]);
  
  /**
   * Handle mouse move events
   * Updates cursor position and handles panning
   * 
   * @param {MouseEvent} e - The mouse move event
   */
  const handleMouseMove = useCallback((e) => {
    // Update cursor position for status bar and grid position indicator
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPosition({ x, y });
      
      // Calculate grid position from screen coordinates
      const adjustedX = (x - offset.x) / zoom;
      const adjustedY = (y - offset.y) / zoom;
      const gridPos = calculateGridPosition(e.clientX, e.clientY);
      
      // Update cursor grid position in context
      updateCursorGridPosition(gridPos);
    }
    
    // Handle dragging for pan
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    updateOffset({
      x: startOffset.x + deltaX,
      y: startOffset.y + deltaY
    });
  }, [isDragging, dragStart, startOffset, updateOffset, zoom, offset, calculateGridPosition, updateCursorGridPosition]);
  
  /**
   * Handle mouse up events
   * Ends the panning operation
   */
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  /**
   * Handle mouse wheel events for zooming
   * Zooms in or out centered on the mouse position
   * 
   * @param {WheelEvent} e - The wheel event
   */
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      // Calculate new zoom level with smoother steps
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
      
      // Get mouse position relative to canvas
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate new offset to zoom toward mouse position
      // This creates a more natural zoom experience centered on the cursor
      const newOffset = {
        x: offset.x - ((mouseX / zoom) * (newZoom - zoom)),
        y: offset.y - ((mouseY / zoom) * (newZoom - zoom))
      };
      
      updateZoom(newZoom);
      updateOffset(newOffset);
    }
  }, [zoom, offset, updateZoom, updateOffset]);
  
  // Attach event listeners for mouse move and up events
  useEventListener('mousemove', handleMouseMove);
  useEventListener('mouseup', handleMouseUp);
  
  /**
   * Handle touch start events for mobile devices
   * Initiates panning with two-finger touch
   * 
   * @param {TouchEvent} e - The touch start event
   */
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      // Two finger touch for panning
      setIsDragging(true);
      setDragStart({ 
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2, 
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2 
      });
      setStartOffset({ ...offset });
      e.preventDefault();
    }
  }, [offset]);
  
  /**
   * Handle touch move events for mobile devices
   * Updates panning based on two-finger touch movement
   * 
   * @param {TouchEvent} e - The touch move event
   */
  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 2) return;
    
    const touchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const touchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    
    const deltaX = touchX - dragStart.x;
    const deltaY = touchY - dragStart.y;
    
    updateOffset({
      x: startOffset.x + deltaX,
      y: startOffset.y + deltaY
    });
    
    e.preventDefault();
  }, [isDragging, dragStart, startOffset, updateOffset]);
  
  /**
   * Handle touch end events for mobile devices
   * Ends the panning operation
   */
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  /**
   * Add touch event listeners for mobile support
   * These are added directly to the DOM element for better control
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  /**
   * Handle drag end events from DnD Kit
   * The actual drag handling is in the useDragDrop hook
   * 
   * @param {Object} event - The drag end event
   */
  const handleDragEnd = (event) => {
    // The actual drag handling is in the useDragDrop hook
  };
  
  return (
    <Box
      ref={canvasRef}
      position="relative"
      width="100%"
      height="100%"
      overflow="hidden"
      bg="gray.900"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      cursor={isDragging ? 'grabbing' : 'default'}
      className="canvas-background"
      id="isometric-canvas"
      _dark={{
        bg: "gray.900"
      }}
      _light={{
        bg: "gray.100"
      }}
    >
      <DndContext 
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
        onDragEnd={handleDragEnd}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          {/* Render the isometric grid */}
          <IsometricGrid showGrid={showGrid} />
          
          {/* Render all placed elements */}
          {elements.map((element) => {
            const ElementComponent = getElementComponent(element.type);
            return (
              <ElementComponent
                key={element.id}
                id={element.id}
                position={element.position}
                rotation={element.rotation || 0}
                scale={element.scale || 1}
              />
            );
          })}
        </Box>
        
        {/* Element controls for the selected element */}
        {selectedElementId && <ElementControls />}
      </DndContext>
    </Box>
  );
}